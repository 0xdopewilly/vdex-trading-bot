/**
 * api.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Core HTTP client for the vDEX gateway, built on Node 18+ native `fetch`.
 *
 *  • Injects auth (`X-API-Key`) and content headers on every request.
 *  • Per-request timeout via AbortController.
 *  • Exponential backoff with jitter on network timeouts, 5xx, HTTP 429, and
 *    Cloudflare / WAF challenge responses (403/503 with an HTML body).
 *  • Honours a client-side cool-off window driven by state.ts.
 *  • Normalises loosely-typed JSON into the strict shapes from types.ts.
 *
 * Every public method wraps its network call in try/catch and throws a single,
 * descriptive `VdexApiError` on unrecoverable failure.
 */

import { config } from "./config.js";
import { log } from "./logger.js";
import { noteThrottle, clearThrottle, rateLimitDelayMs } from "./state.js";
import {
  type ApiEnvelope,
  type Balance,
  type CreateLeverageOrderRequest,
  type OrderResult,
  type Pair,
  type RawBalance,
  type RawPair,
  type RawPriceResponse,
} from "./types.js";

export class VdexApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
  ) {
    super(message);
    this.name = "VdexApiError";
  }
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Treat these as transient → worth retrying. */
function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

/** Detect a Cloudflare / WAF interstitial (HTML where we expect JSON). */
function looksLikeWafChallenge(status: number, contentType: string, body: string): boolean {
  const html = contentType.includes("text/html") || body.trimStart().startsWith("<");
  if (!html) return false;
  if (status === 403 || status === 503 || status === 429) return true;
  return /cloudflare|cf-ray|just a moment|attention required|cf-browser-verification/i.test(body);
}

/** Parse a Retry-After header (seconds or HTTP-date) into milliseconds. */
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const secs = Number(value);
  if (Number.isFinite(secs)) return secs * 1000;
  const date = Date.parse(value);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return undefined;
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

interface RequestOptions {
  method?: "GET" | "POST";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: unknown;
  /** Override the default retry count for this call. */
  retries?: number;
}

export class VdexClient {
  private readonly baseUrl = config.baseUrl;
  private readonly headers: Record<string, string> = {
    "X-API-Key": config.apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  /**
   * Low-level JSON request with timeout + exponential-backoff retry.
   * Returns the parsed JSON body typed as T.
   */
  private async request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, retries = config.maxRetries } = opts;
    const url = `${this.baseUrl}${path}`;

    let attempt = 0;
    // One extra iteration than `retries` so retries=4 means 1 try + 4 retries.
    while (true) {
      // Respect any active client-side cool-off window first.
      const cooldown = rateLimitDelayMs();
      if (cooldown > 0) {
        log.debug(`Cooling off ${cooldown}ms before ${method} ${path}`);
        await sleep(cooldown);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);

      try {
        const res = await fetch(url, {
          method,
          headers: this.headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });

        const contentType = res.headers.get("content-type") ?? "";
        const text = await res.text();

        // ── WAF / Cloudflare challenge → back off and retry. ────────────────
        if (looksLikeWafChallenge(res.status, contentType, text)) {
          throw new RetryableError(`WAF/Cloudflare challenge (HTTP ${res.status})`, res.status, parseRetryAfter(res.headers.get("retry-after")));
        }

        // ── Retryable HTTP statuses. ────────────────────────────────────────
        if (isRetryableStatus(res.status)) {
          const retryAfter = parseRetryAfter(res.headers.get("retry-after"));
          if (res.status === 429) noteThrottle(retryAfter ?? config.retryBaseDelayMs * 2 ** attempt);
          throw new RetryableError(`Retryable HTTP ${res.status}`, res.status, retryAfter);
        }

        // ── Hard client errors (4xx) → do not retry. ────────────────────────
        if (!res.ok) {
          throw new VdexApiError(`vDEX ${method} ${path} failed: HTTP ${res.status}`, res.status, text.slice(0, 500));
        }

        clearThrottle();

        // ── Parse JSON. ─────────────────────────────────────────────────────
        if (text.trim() === "") return undefined as unknown as T;
        try {
          return JSON.parse(text) as T;
        } catch {
          throw new VdexApiError(`vDEX ${method} ${path} returned non-JSON body`, res.status, text.slice(0, 500));
        }
      } catch (err) {
        const retryable = err instanceof RetryableError || isAbortOrNetwork(err);

        if (retryable && attempt < retries) {
          const explicit = err instanceof RetryableError ? err.retryAfterMs : undefined;
          const backoff = explicit ?? jitteredBackoff(attempt, config.retryBaseDelayMs);
          attempt += 1;
          log.warn(`${describe(err)} — retry ${attempt}/${retries} in ${backoff}ms (${method} ${path})`);
          await sleep(backoff);
          continue;
        }

        if (err instanceof VdexApiError) throw err;
        if (err instanceof RetryableError) {
          throw new VdexApiError(`${err.message} — exhausted ${retries} retries (${method} ${path})`, err.status);
        }
        throw new VdexApiError(`Network error on ${method} ${path}: ${describe(err)}`);
      } finally {
        clearTimeout(timer);
      }
    }
  }

  /** Unwrap `{ data | result }` envelopes; fall back to the raw payload. */
  private unwrap<T>(payload: ApiEnvelope<T> | T): T {
    const env = payload as ApiEnvelope<T>;
    if (env && typeof env === "object" && (("data" in env && env.data !== undefined) || ("result" in env && env.result !== undefined))) {
      return (env.data ?? env.result) as T;
    }
    return payload as T;
  }

  // ─── Public endpoints ──────────────────────────────────────────────────────

  /** GET /v2/users/balances → normalised balances. */
  async getBalances(): Promise<Balance[]> {
    const raw = await this.request<ApiEnvelope<RawBalance[]> | RawBalance[]>("/v2/users/balances");
    const list = this.unwrap<RawBalance[]>(raw) ?? [];
    if (!Array.isArray(list)) throw new VdexApiError("Unexpected balances payload (not an array)");

    return list.map((b): Balance => {
      const available = toNumber(b.available) ?? toNumber(b.available_balance) ?? toNumber(b.free) ?? toNumber(b.balance) ?? 0;
      const total = toNumber(b.total) ?? toNumber(b.balance) ?? available;
      return {
        symbol: (b.symbol ?? b.asset ?? b.currency ?? "").toString().toUpperCase(),
        assetId: b.asset_id?.toString(),
        available,
        total,
      };
    });
  }

  /** Available margin for the configured quote currency (e.g. USD). */
  async getAvailableMargin(quoteSymbol: string): Promise<number> {
    const balances = await this.getBalances();
    const want = quoteSymbol.toUpperCase();
    const match = balances.find((b) => b.symbol === want);
    if (match) return match.available;
    // Fall back to the single largest available balance if no exact match.
    const best = balances.reduce<Balance | undefined>((a, b) => (a && a.available >= b.available ? a : b), undefined);
    return best?.available ?? 0;
  }

  /** GET /v2/pairs?includeMarketData=true → normalised pairs. */
  async getPairs(): Promise<Pair[]> {
    const raw = await this.request<ApiEnvelope<RawPair[]> | RawPair[]>("/v2/pairs?includeMarketData=true");
    const list = this.unwrap<RawPair[]>(raw) ?? [];
    if (!Array.isArray(list)) throw new VdexApiError("Unexpected pairs payload (not an array)");

    return list.map((p): Pair => {
      const md = p.market_data ?? p.marketData ?? {};
      const price = toNumber(md.last_price) ?? toNumber(md.lastPrice) ?? toNumber(md.price) ?? toNumber(md.mark_price);
      return {
        baseAssetId: (p.base_asset_id ?? p.baseAssetId ?? p.id ?? p.pair_id)?.toString(),
        baseToken: (p.base_token ?? p.baseToken)?.toString(),
        quoteToken: (p.quote_token ?? p.quoteToken)?.toString(),
        symbol: (p.symbol ?? p.name)?.toString(),
        price,
        raw: p,
      };
    });
  }

  /** GET /v1/tokens/price/{baseToken}/{quoteToken} → spot price. */
  async getPrice(baseToken: string, quoteToken: string): Promise<number> {
    const raw = await this.request<ApiEnvelope<RawPriceResponse> | RawPriceResponse | number | string>(
      `/v1/tokens/price/${encodeURIComponent(baseToken)}/${encodeURIComponent(quoteToken)}`,
    );

    // Endpoint may return a bare number/string, or an envelope/object.
    const direct = toNumber(raw);
    if (direct !== undefined) return direct;

    const data = this.unwrap<RawPriceResponse>(raw as ApiEnvelope<RawPriceResponse>);
    const price = toNumber(data?.price) ?? toNumber(data?.last_price);
    if (price === undefined || price <= 0) {
      throw new VdexApiError(`Could not parse price for ${baseToken}/${quoteToken}`, undefined, JSON.stringify(raw).slice(0, 300));
    }
    return price;
  }

  /** POST a leverage order. Returns the parsed order result. */
  async createLeverageOrder(payload: CreateLeverageOrderRequest): Promise<OrderResult> {
    // Orders are not idempotent → never auto-retry a POST that may have landed.
    const raw = await this.request<ApiEnvelope<OrderResult> | OrderResult>("/v2/leverage/orders", {
      method: "POST",
      body: payload,
      retries: 0,
    });
    return this.unwrap<OrderResult>(raw) ?? {};
  }
}

// ─── Internal retry helpers ──────────────────────────────────────────────────

class RetryableError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = "RetryableError";
  }
}

function isAbortOrNetwork(err: unknown): boolean {
  if (err instanceof Error) {
    if (err.name === "AbortError") return true; // timeout
    // Native fetch wraps DNS/connection failures in a TypeError.
    if (err.name === "TypeError") return true;
    if (/ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up|fetch failed/i.test(err.message)) return true;
  }
  return false;
}

/** Exponential backoff with full jitter, capped at 30s. */
function jitteredBackoff(attempt: number, base: number): number {
  const exp = Math.min(base * 2 ** attempt, 30_000);
  return Math.round(exp / 2 + Math.random() * (exp / 2));
}

function describe(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

/** Shared singleton client. */
export const api = new VdexClient();
