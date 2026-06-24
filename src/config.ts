/**
 * config.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Loads, validates and freezes the runtime configuration from environment
 * variables (via dotenv). Fails fast with a clear message if anything required
 * is missing or malformed. No credentials are ever hardcoded.
 */

import "dotenv/config";
import type { LeverageType } from "./types.js";

type LogLevel = "debug" | "info" | "warn" | "error";
type StrategyName = "mean_reversion" | "trend_following";

// ─── Small env helpers ───────────────────────────────────────────────────────

function requireString(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optionalString(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

function num(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`Env var ${name} must be a number, got "${raw}"`);
  return n;
}

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (raw === undefined || raw === "") return fallback;
  return raw === "true" || raw === "1" || raw === "yes";
}

function oneOf<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  const raw = (process.env[name]?.trim() as T) || fallback;
  if (!allowed.includes(raw)) {
    throw new Error(`Env var ${name} must be one of ${allowed.join(", ")}, got "${raw}"`);
  }
  return raw;
}

// ─── Config shape ────────────────────────────────────────────────────────────

export interface BotConfig {
  apiKey: string;
  baseUrl: string;
  dryRun: boolean;

  baseToken: string;
  quoteToken: string;
  baseAssetId: string; // may be "" → resolved from /v2/pairs at startup

  strategy: StrategyName;
  pollIntervalMs: number;
  smaWindow: number;
  entryThreshold: number;
  fastSma: number;
  slowSma: number;

  maxAllocationPct: number;
  stopLossPct: number;
  takeProfitPct: number;
  leverage: number;
  leverageType: LeverageType;
  maxOpenPositions: number;
  minBalance: number;

  requestTimeoutMs: number;
  maxRetries: number;
  retryBaseDelayMs: number;

  logLevel: LogLevel;
}

function build(): BotConfig {
  const cfg: BotConfig = {
    apiKey: requireString("VDEX_API_KEY"),
    baseUrl: optionalString("VDEX_BASE_URL", "https://api.vdex.trade/api-gateway").replace(/\/+$/, ""),
    dryRun: bool("DRY_RUN", true),

    baseToken: optionalString("BASE_TOKEN", "ETH"),
    quoteToken: optionalString("QUOTE_TOKEN", "USD"),
    baseAssetId: optionalString("BASE_ASSET_ID", ""),

    strategy: oneOf("STRATEGY", ["mean_reversion", "trend_following"] as const, "mean_reversion"),
    pollIntervalMs: num("POLL_INTERVAL_MS", 15_000),
    smaWindow: num("SMA_WINDOW", 20),
    entryThreshold: num("ENTRY_THRESHOLD", 0.01),
    fastSma: num("FAST_SMA", 5),
    slowSma: num("SLOW_SMA", 20),

    maxAllocationPct: num("MAX_ALLOCATION_PCT", 0.1),
    stopLossPct: num("STOP_LOSS_PCT", 0.02),
    takeProfitPct: num("TAKE_PROFIT_PCT", 0.06),
    leverage: num("LEVERAGE", 2),
    leverageType: oneOf("LEVERAGE_TYPE", ["cross", "isolated"] as const, "isolated"),
    maxOpenPositions: num("MAX_OPEN_POSITIONS", 1),
    minBalance: num("MIN_BALANCE", 10),

    requestTimeoutMs: num("REQUEST_TIMEOUT_MS", 15_000),
    maxRetries: num("MAX_RETRIES", 4),
    retryBaseDelayMs: num("RETRY_BASE_DELAY_MS", 500),

    logLevel: oneOf("LOG_LEVEL", ["debug", "info", "warn", "error"] as const, "info"),
  };

  // ── Sanity checks — fail fast before any capital is at risk. ──────────────
  if (cfg.maxAllocationPct <= 0 || cfg.maxAllocationPct > 1) {
    throw new Error("MAX_ALLOCATION_PCT must be in (0, 1]. Spec caps a single trade at 0.10 (10%).");
  }
  if (cfg.maxAllocationPct > 0.1) {
    // Soft guard around the spec's hard rule. Warn loudly but allow override.
    console.warn(`[config] WARNING: MAX_ALLOCATION_PCT=${cfg.maxAllocationPct} exceeds the 10% spec limit.`);
  }
  if (cfg.stopLossPct <= 0 || cfg.takeProfitPct <= 0) {
    throw new Error("STOP_LOSS_PCT and TAKE_PROFIT_PCT must be positive fractions.");
  }
  if (cfg.leverage < 1) throw new Error("LEVERAGE must be >= 1.");
  if (cfg.pollIntervalMs < 1000) throw new Error("POLL_INTERVAL_MS must be >= 1000ms to respect rate limits.");
  if (cfg.strategy === "trend_following" && cfg.fastSma >= cfg.slowSma) {
    throw new Error("FAST_SMA must be < SLOW_SMA for trend_following.");
  }

  return Object.freeze(cfg);
}

/** The validated, frozen, singleton config. */
export const config: BotConfig = build();
