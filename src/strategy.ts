/**
 * strategy.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Signal generation. Two interchangeable, fully self-contained strategies that
 * consume a rolling price series and emit a TradeSignal:
 *
 *  • mean_reversion  — fade extension from the SMA. Price ENTRY_THRESHOLD below
 *                      the mean → buy (expect reversion up); above → sell.
 *  • trend_following — fast/slow SMA crossover. Fast above slow → buy; below → sell.
 *
 * Strategies are pure functions over an internal ring buffer; no I/O.
 */

import { config } from "./config.js";
import type { TradeSignal } from "./types.js";

function sma(values: number[], length: number): number | undefined {
  if (values.length < length) return undefined;
  const window = values.slice(-length);
  return window.reduce((a, b) => a + b, 0) / length;
}

export interface Strategy {
  readonly name: string;
  /** Push the latest price and return the resulting signal. */
  update(price: number): TradeSignal;
  /** True once enough samples have accumulated to trade. */
  isWarm(): boolean;
}

abstract class BaseStrategy implements Strategy {
  abstract readonly name: string;
  protected prices: number[] = [];
  protected readonly maxLen: number;

  constructor(maxLen: number) {
    this.maxLen = maxLen;
  }

  protected push(price: number): void {
    this.prices.push(price);
    if (this.prices.length > this.maxLen) this.prices.shift();
  }

  abstract isWarm(): boolean;
  abstract update(price: number): TradeSignal;
}

// ─── Mean reversion ──────────────────────────────────────────────────────────

class MeanReversionStrategy extends BaseStrategy {
  readonly name = "mean_reversion";

  constructor() {
    super(Math.max(config.smaWindow, 2) + 5);
  }

  override isWarm(): boolean {
    return this.prices.length >= config.smaWindow;
  }

  override update(price: number): TradeSignal {
    this.push(price);
    const mean = sma(this.prices, config.smaWindow);
    if (mean === undefined) {
      return { action: "hold", price, reason: `Warming up (${this.prices.length}/${config.smaWindow}).` };
    }

    const deviation = (price - mean) / mean; // signed fractional distance from mean
    const t = config.entryThreshold;

    if (deviation <= -t) {
      return { action: "buy", price, reason: `Price ${(deviation * 100).toFixed(2)}% below SMA(${config.smaWindow}) → revert up.` };
    }
    if (deviation >= t) {
      return { action: "sell", price, reason: `Price +${(deviation * 100).toFixed(2)}% above SMA(${config.smaWindow}) → revert down.` };
    }
    return { action: "hold", price, reason: `Within band (dev ${(deviation * 100).toFixed(2)}%, threshold ±${(t * 100).toFixed(2)}%).` };
  }
}

// ─── Trend following ─────────────────────────────────────────────────────────

class TrendFollowingStrategy extends BaseStrategy {
  readonly name = "trend_following";
  private prevFastAboveSlow: boolean | undefined;

  constructor() {
    super(config.slowSma + 5);
  }

  override isWarm(): boolean {
    return this.prices.length >= config.slowSma;
  }

  override update(price: number): TradeSignal {
    this.push(price);
    const fast = sma(this.prices, config.fastSma);
    const slow = sma(this.prices, config.slowSma);
    if (fast === undefined || slow === undefined) {
      return { action: "hold", price, reason: `Warming up (${this.prices.length}/${config.slowSma}).` };
    }

    const fastAboveSlow = fast > slow;
    const prev = this.prevFastAboveSlow;
    this.prevFastAboveSlow = fastAboveSlow;

    // Only act on a fresh crossover, not on every tick of an established trend.
    if (prev === undefined) {
      return { action: "hold", price, reason: "Establishing trend baseline." };
    }
    if (!prev && fastAboveSlow) {
      return { action: "buy", price, reason: `Bullish crossover: SMA(${config.fastSma}) crossed above SMA(${config.slowSma}).` };
    }
    if (prev && !fastAboveSlow) {
      return { action: "sell", price, reason: `Bearish crossover: SMA(${config.fastSma}) crossed below SMA(${config.slowSma}).` };
    }
    return { action: "hold", price, reason: `Trend intact (fast ${fast.toFixed(2)} ${fastAboveSlow ? ">" : "<"} slow ${slow.toFixed(2)}).` };
  }
}

/** Factory: instantiate the strategy named in config. */
export function createStrategy(): Strategy {
  switch (config.strategy) {
    case "trend_following":
      return new TrendFollowingStrategy();
    case "mean_reversion":
    default:
      return new MeanReversionStrategy();
  }
}
