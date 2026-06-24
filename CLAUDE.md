# CLAUDE.md — project context for Claude Code

Persistent context for this repository. Read this first when continuing work.

## What this is
A fully automated leverage trading bot for the **vDEX API**. TypeScript, Node 18+,
native `fetch` (no axios/node-fetch). ESM throughout (`"type": "module"`, `.js`
extensions on relative imports as TS ESM requires).

## Golden rules
- **No hardcoded credentials.** All secrets come from `.env` via `dotenv`.
  `src/config.ts` validates env and fails fast.
- **Safety first.** `DRY_RUN` defaults to `true`. Never flip defaults to live.
- **Risk limits are sacred.** Single-trade allocation is capped at
  `MAX_ALLOCATION_PCT` (≤10%). Every order carries a stop-loss + take-profit.
- **Order POSTs are never auto-retried** (not idempotent). Read-only GETs retry
  with jittered exponential backoff (`src/api.ts`).
- Keep modules single-responsibility; `risk.ts` and `strategy.ts` stay **pure**
  (no I/O) so they're testable.

## Module map
- `src/types.ts` — strict request types; response types are loose + normalised in `api.ts`.
- `src/config.ts` — env schema, validation, frozen singleton `config`.
- `src/logger.ts` — levelled logger feeding the in-memory execution log.
- `src/state.ts` — positions map, bounded exec log, rate-limit cool-off state.
- `src/api.ts` — `VdexClient`: auth headers, AbortController timeout, retry/backoff,
  Cloudflare/WAF detection, response normalisation. Singleton `api`.
- `src/risk.ts` — `RiskEngine`: `size()` (sizing + sided SL/TP) and
  `buildMarketOrder()`. Singleton `risk`.
- `src/strategy.ts` — `mean_reversion` + `trend_following`; `createStrategy()` factory.
- `src/bot.ts` — `TradingEngine`: startup, market resolution, poll loop, decision,
  execution, graceful shutdown. Entry point.

## Conventions
- Comments explain *why*, not *what*. Keep the file-header block on each module.
- British spelling in user-facing strings to match the domain.
- New endpoints go on `VdexClient` as a method that returns a normalised type.
- New tunables go in `.env.example` (documented) **and** `config.ts` (validated).

## Known assumptions to verify against the live API
- Order path is `POST /v2/leverage/orders` (inferred from the request interface).
- Balance/pair/price field names are normalised defensively — confirm real keys.

## Suggested backlog
1. Unit tests for `risk.ts` (sizing/bracket maths) and `strategy.ts` (signals).
2. Backtester replaying historical candles through `createStrategy()`.
3. Persist positions + exec log to disk (survive restarts).
4. Position-exit poller / reconcile open orders with the exchange.
5. Optional metrics endpoint exposing `getRecentLog()` and open positions.
