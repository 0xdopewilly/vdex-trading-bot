/**
 * risk.ts
 * ────────────────────────────────────────────────────────────────────────────
 * The Risk Engine. Owns position sizing and the protective bracket. Pure and
 * deterministic — no I/O — so it is trivial to unit-test.
 *
 *  • Never allocates more than MAX_ALLOCATION_PCT (default 10%) of available
 *    margin to a single trade.
 *  • Attaches a tight stop-loss and a wider take-profit to every order, sided
 *    correctly for longs (buy) and shorts (sell).
 */

import { config } from "./config.js";
import type { CreateLeverageOrderRequest, OrderDirection } from "./types.js";
import { MARKET_PRICE } from "./types.js";

export interface SizingResult {
  /** Margin (quote currency) committed to the trade. */
  marginToCommit: number;
  /** Notional exposure = margin × leverage. */
  notional: number;
  /** Quantity of the base asset to buy/sell. */
  quantity: number;
  stopLossPrice: number;
  takeProfitPrice: number;
}

export interface SizingDecision {
  ok: boolean;
  reason: string;
  sizing?: SizingResult;
}

/** Round to a sane number of significant decimals for an exchange payload. */
function round(value: number, dp = 8): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

export class RiskEngine {
  /**
   * Compute the position size and protective bracket for a candidate trade.
   * Returns ok:false (with a reason) when the trade cannot be sized safely.
   */
  size(direction: OrderDirection, entryPrice: number, availableMargin: number): SizingDecision {
    if (entryPrice <= 0) return { ok: false, reason: "Invalid entry price (<= 0)." };
    if (availableMargin <= 0) return { ok: false, reason: "No available margin." };
    if (availableMargin < config.minBalance) {
      return { ok: false, reason: `Available margin ${availableMargin} below MIN_BALANCE ${config.minBalance}.` };
    }

    // ── Position sizing: cap at MAX_ALLOCATION_PCT of available margin. ──────
    const marginToCommit = round(availableMargin * config.maxAllocationPct, 2);
    if (marginToCommit <= 0) return { ok: false, reason: "Computed margin is zero." };

    const notional = round(marginToCommit * config.leverage, 2);
    const quantity = round(notional / entryPrice, 8);
    if (quantity <= 0) return { ok: false, reason: "Computed quantity rounds to zero — entry price too high for this margin." };

    // ── Protective bracket, sided by direction. ─────────────────────────────
    // Long  (buy):  SL below entry, TP above entry.
    // Short (sell): SL above entry, TP below entry.
    const slPct = config.stopLossPct;
    const tpPct = config.takeProfitPct;
    const stopLossPrice = direction === "buy" ? round(entryPrice * (1 - slPct)) : round(entryPrice * (1 + slPct));
    const takeProfitPrice = direction === "buy" ? round(entryPrice * (1 + tpPct)) : round(entryPrice * (1 - tpPct));

    return {
      ok: true,
      reason: `Sized ${quantity} @ ~${entryPrice} (${(config.maxAllocationPct * 100).toFixed(0)}% of ${availableMargin} margin, ${config.leverage}x).`,
      sizing: { marginToCommit, notional, quantity, stopLossPrice, takeProfitPrice },
    };
  }

  /**
   * Build the strict CreateLeverageOrderRequest for a market open with the
   * computed bracket attached. Price is the -1 sentinel for MarketOpen.
   */
  buildMarketOrder(baseAssetId: string, direction: OrderDirection, sizing: SizingResult): CreateLeverageOrderRequest {
    return {
      price: MARKET_PRICE, // -1 → market open per the vDEX spec
      order_type: "MarketOpen",
      leverage_type: config.leverageType,
      leverage: config.leverage,
      direction,
      quantity: sizing.quantity,
      base_asset_id: baseAssetId,
      take_profit_price: sizing.takeProfitPrice,
      stop_loss_price: sizing.stopLossPrice,
      is_mobile: false,
    };
  }
}

export const risk = new RiskEngine();
