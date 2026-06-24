/**
 * bot.ts
 * ────────────────────────────────────────────────────────────────────────────
 * The execution engine. Entry point (`npm start`).
 *
 *  1. Validates config (import side-effect) and resolves the trading market.
 *  2. Polls the price every POLL_INTERVAL_MS.
 *  3. Feeds price to the strategy, gates the signal through the risk engine,
 *     and places a bracketed market order when all guards pass.
 *  4. Tracks active positions in memory and respects MAX_OPEN_POSITIONS.
 *  5. Shuts down cleanly on SIGINT/SIGTERM; never overlaps polling ticks.
 *
 * In DRY_RUN mode the engine performs every step except the final POST,
 * logging the exact payload it would have submitted.
 */

import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { api, VdexApiError } from "./api.js";
import { log } from "./logger.js";
import { risk } from "./risk.js";
import { createStrategy, type Strategy } from "./strategy.js";
import {
  addPosition,
  getPositions,
  hasOpenPositionForAsset,
  openPositionCount,
} from "./state.js";
import type { Position, TradeSignal } from "./types.js";

interface Market {
  baseAssetId: string;
  baseToken: string;
  quoteToken: string;
  symbol: string;
}

class TradingEngine {
  private readonly strategy: Strategy = createStrategy();
  private market!: Market;
  private timer: NodeJS.Timeout | null = null;
  private ticking = false;
  private running = false;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  async start(): Promise<void> {
    log.info("─".repeat(72));
    log.info(`vDEX Trading Bot starting`, {
      strategy: this.strategy.name,
      dryRun: config.dryRun,
      market: `${config.baseToken}/${config.quoteToken}`,
      leverage: `${config.leverage}x ${config.leverageType}`,
      maxAllocationPct: config.maxAllocationPct,
    });
    if (config.dryRun) log.warn("DRY_RUN is ON — no live orders will be submitted.");
    else log.warn("DRY_RUN is OFF — this WILL place live orders with real capital.");

    this.market = await this.resolveMarket();
    log.info(`Market resolved`, this.market);

    // Sanity-check connectivity & capital up front.
    const margin = await api.getAvailableMargin(this.market.quoteToken);
    log.info(`Available margin: ${margin} ${this.market.quoteToken}`);
    if (margin < config.minBalance) {
      log.warn(`Margin below MIN_BALANCE (${config.minBalance}). Engine will idle until funded.`);
    }

    this.running = true;
    this.scheduleNext(0); // first tick immediately
    log.info(`Polling every ${config.pollIntervalMs}ms. Press Ctrl+C to stop.`);
  }

  stop(): void {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    log.info("Engine stopped.", { openPositions: openPositionCount(), positions: getPositions() });
  }

  // ─── Startup: resolve base_asset_id ──────────────────────────────────────────

  private async resolveMarket(): Promise<Market> {
    // Explicit override wins.
    if (config.baseAssetId) {
      return {
        baseAssetId: config.baseAssetId,
        baseToken: config.baseToken,
        quoteToken: config.quoteToken,
        symbol: `${config.baseToken}/${config.quoteToken}`,
      };
    }

    // Otherwise resolve from /v2/pairs by matching the configured tokens.
    const pairs = await api.getPairs();
    const wantBase = config.baseToken.toUpperCase();
    const wantQuote = config.quoteToken.toUpperCase();

    const match = pairs.find((p) => {
      const base = (p.baseToken ?? "").toUpperCase();
      const quote = (p.quoteToken ?? "").toUpperCase();
      const sym = (p.symbol ?? "").toUpperCase();
      const symMatch = sym.includes(wantBase) && sym.includes(wantQuote);
      return (base === wantBase && quote === wantQuote) || symMatch;
    });

    if (!match?.baseAssetId) {
      throw new VdexApiError(
        `Could not resolve base_asset_id for ${config.baseToken}/${config.quoteToken} from /v2/pairs. ` +
          `Set BASE_ASSET_ID in .env explicitly. (${pairs.length} pairs returned.)`,
      );
    }

    return {
      baseAssetId: match.baseAssetId,
      baseToken: match.baseToken ?? config.baseToken,
      quoteToken: match.quoteToken ?? config.quoteToken,
      symbol: match.symbol ?? `${config.baseToken}/${config.quoteToken}`,
    };
  }

  // ─── Polling loop ────────────────────────────────────────────────────────────

  private scheduleNext(delayMs: number): void {
    if (!this.running) return;
    this.timer = setTimeout(() => void this.tick(), delayMs);
  }

  /** One poll cycle. Guarded so cycles never overlap if a request runs long. */
  private async tick(): Promise<void> {
    if (this.ticking) {
      this.scheduleNext(config.pollIntervalMs);
      return;
    }
    this.ticking = true;
    const startedAt = Date.now();

    try {
      const price = await api.getPrice(this.market.baseToken, this.market.quoteToken);
      const signal = this.strategy.update(price);
      log.debug(`tick`, { price, signal: signal.action, reason: signal.reason });

      await this.evaluate(signal);
    } catch (err) {
      // Never let a single bad cycle kill the loop.
      log.error(`Tick failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      this.ticking = false;
      const elapsed = Date.now() - startedAt;
      this.scheduleNext(Math.max(0, config.pollIntervalMs - elapsed));
    }
  }

  // ─── Decision + execution ─────────────────────────────────────────────────────

  private async evaluate(signal: TradeSignal): Promise<void> {
    if (signal.action === "hold") return;
    if (!this.strategy.isWarm()) return;

    // Position guards.
    if (openPositionCount() >= config.maxOpenPositions) {
      log.debug(`Signal ${signal.action} ignored — at MAX_OPEN_POSITIONS (${config.maxOpenPositions}).`);
      return;
    }
    if (hasOpenPositionForAsset(this.market.baseAssetId)) {
      log.debug(`Signal ${signal.action} ignored — already holding ${this.market.symbol}.`);
      return;
    }

    // Risk gate: size + bracket against live available margin.
    const margin = await api.getAvailableMargin(this.market.quoteToken);
    const decision = risk.size(signal.action, signal.price, margin);
    if (!decision.ok || !decision.sizing) {
      log.warn(`Trade rejected by risk engine: ${decision.reason}`);
      return;
    }

    const order = risk.buildMarketOrder(this.market.baseAssetId, signal.action, decision.sizing);
    log.info(`SIGNAL ${signal.action.toUpperCase()} — ${signal.reason}`);
    log.info(`Risk: ${decision.reason}`, {
      stopLoss: decision.sizing.stopLossPrice,
      takeProfit: decision.sizing.takeProfitPrice,
      marginCommitted: decision.sizing.marginToCommit,
      notional: decision.sizing.notional,
    });

    await this.execute(order, signal, decision.sizing.stopLossPrice, decision.sizing.takeProfitPrice);
  }

  private async execute(
    order: ReturnType<typeof risk.buildMarketOrder>,
    signal: TradeSignal,
    stopLossPrice: number,
    takeProfitPrice: number,
  ): Promise<void> {
    const position: Position = {
      id: randomUUID(),
      baseAssetId: this.market.baseAssetId,
      symbol: this.market.symbol,
      direction: signal.action as Position["direction"],
      entryPrice: signal.price,
      quantity: order.quantity,
      leverage: order.leverage,
      stopLossPrice,
      takeProfitPrice,
      openedAt: Date.now(),
      dryRun: config.dryRun,
    };

    if (config.dryRun) {
      log.warn(`DRY_RUN — would POST leverage order`, { payload: order });
      addPosition(position);
      log.info(`DRY_RUN position recorded`, { id: position.id, open: openPositionCount() });
      return;
    }

    try {
      const result = await api.createLeverageOrder(order);
      position.orderResult = result;
      addPosition(position);
      log.info(`ORDER PLACED`, { id: position.id, result });
    } catch (err) {
      // POSTs are not retried (see api.ts) — surface and move on without
      // recording a position we cannot confirm.
      log.error(`Order placement failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

const engine = new TradingEngine();

function installShutdown(): void {
  let stopping = false;
  const shutdown = (sig: string) => {
    if (stopping) return;
    stopping = true;
    log.info(`Received ${sig} — shutting down.`);
    engine.stop();
    // Give final log flush a tick.
    setTimeout(() => process.exit(0), 100);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (reason) => log.error(`Unhandled rejection: ${String(reason)}`));
  process.on("uncaughtException", (err) => {
    log.error(`Uncaught exception: ${err.message}`);
    engine.stop();
    process.exit(1);
  });
}

async function main(): Promise<void> {
  installShutdown();
  try {
    await engine.start();
  } catch (err) {
    log.error(`Fatal during startup: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

void main();
