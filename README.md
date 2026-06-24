# vDEX Algorithmic Trading Bot

Production-ready, fully automated leverage trading bot for the **vDEX API**.
TypeScript · Node 18+ (native `fetch`) · modular execution engine with a strict
risk engine and exponential-backoff HTTP client.

> ⚠️ **Financial risk.** This software places **leveraged** orders that can lose
> money faster than spot trading — potentially your entire balance. It ships with
> `DRY_RUN=true` so nothing trades until you explicitly turn it off. Validate
> thoroughly on a small allocation first. The API response shapes are normalised
> defensively because vDEX does not publish exhaustive schemas — confirm the live
> field names against your account before going live. You are responsible for any
> capital you deploy.

---

## Architecture

```
vdex-trading-bot/
├── package.json          # scripts + deps (dotenv, tsx, typescript)
├── tsconfig.json         # strict TS, ES2022, NodeNext-style ESM
├── .env.example          # every tunable, documented — copy to .env
├── .gitignore            # keeps .env and dist/ out of git
└── src/
    ├── types.ts          # strict request types + normalised response shapes
    ├── config.ts         # env load + validation, fails fast (no hardcoded creds)
    ├── logger.ts         # levelled, timestamped logger → in-memory log
    ├── state.ts          # in-memory positions, exec log, rate-limit state
    ├── api.ts            # native-fetch client: auth, timeout, retry/backoff, WAF
    ├── risk.ts           # position sizing (≤10%) + sided SL/TP bracket
    ├── strategy.ts       # mean_reversion + trend_following signal generators
    └── bot.ts            # the engine: init → poll loop → decide → execute
```

**Data flow per cycle (every 15s):**

`bot.tick()` → `api.getPrice()` → `strategy.update()` → `risk.size()` →
`risk.buildMarketOrder()` → `api.createLeverageOrder()` → `state.addPosition()`.

---

## Quick start

```bash
# 1. Install (Node 18+ required)
npm install

# 2. Configure
cp .env.example .env
#   → set VDEX_API_KEY, pick BASE_TOKEN/QUOTE_TOKEN, keep DRY_RUN=true

# 3. Run in dry-run (no live orders, logs the payloads it would send)
npm start

# 4. When you trust it, set DRY_RUN=false in .env and run again
```

Other scripts:

| Script | What it does |
|---|---|
| `npm start` | Run the bot once via `tsx` (no build step). |
| `npm run dev` | Same, with file-watch auto-restart. |
| `npm run typecheck` | Strict `tsc --noEmit`. |
| `npm run build` | Compile `src/` → `dist/`. |
| `npm run start:prod` | Run the compiled `dist/bot.js` with plain `node`. |

---

## How it behaves (the 100 USD test plan)

- **Frequency** — polls the price every `POLL_INTERVAL_MS` (default 15 000 ms).
  Cycles never overlap; a slow request just delays the next tick.
- **Risk engine** — commits at most `MAX_ALLOCATION_PCT` (default **10%**) of your
  available margin to a single trade, and attaches a **2% stop-loss / 6%
  take-profit** bracket to every order, sided correctly for longs and shorts.
- **Position tracking** — in-memory; honours `MAX_OPEN_POSITIONS` (default 1) and
  won't double-up on the same asset.
- **Market orders** — `order_type: "MarketOpen"` with `price: -1`, per the spec.
- **Resilience** — every network call is wrapped; transient failures (timeouts,
  5xx, HTTP 429, Cloudflare/WAF challenges) retry with jittered exponential
  backoff. **Order POSTs are never auto-retried** (not idempotent).

Tune everything from `.env` — strategy choice, SMA windows, thresholds, leverage,
allocation %, SL/TP %, poll interval, timeouts and retry budget.

---

## Endpoints used

| Purpose | Method & path |
|---|---|
| Available margin | `GET /v2/users/balances` |
| Resolve `base_asset_id` | `GET /v2/pairs?includeMarketData=true` |
| Price feed | `GET /v1/tokens/price/{baseToken}/{quoteToken}` |
| Place order | `POST /v2/leverage/orders` |

All requests send `X-API-Key: $VDEX_API_KEY` + JSON content headers against
`VDEX_BASE_URL` (default `https://api.vdex.trade/api-gateway`).

> The order-placement path (`/v2/leverage/orders`) was inferred from the request
> interface in the spec. If your account uses a different path, change it in the
> single `createLeverageOrder()` method in `src/api.ts`.

---

## → Moving to Claude Code in VS Code

This workspace is ready to open directly.

1. Download the project (the chat shows a download card) and unzip it, **or**
   `git init && git add . && git commit -m "vDEX bot scaffold"`.
2. Open the folder in VS Code and run **Claude Code** in the integrated terminal.
3. `CLAUDE.md` (included) gives Claude Code the full project context, conventions,
   and a backlog of suggested next steps, so you can continue iterating
   immediately.
4. `npm install`, then `npm run typecheck` to confirm a clean baseline.

Good first asks for Claude Code: add a backtester over historical candles, persist
positions to disk, add unit tests for `risk.ts`/`strategy.ts`, or implement a
position-exit poller.
