/**
 * risk.test.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Unit tests for the RiskEngine — sizing maths and the protective bracket.
 *
 * `config` is a frozen singleton built from env at import time, so we pin a
 * deterministic env BEFORE importing anything that pulls it in. Node's test
 * runner gives each test file its own process, so this never collides with the
 * env set by the strategy test files.
 */

// ── Pin deterministic config (must precede the module imports below). ─────────
process.env.VDEX_API_KEY = "test-key";
process.env.MAX_ALLOCATION_PCT = "0.1";
process.env.LEVERAGE = "2";
process.env.STOP_LOSS_PCT = "0.02";
process.env.TAKE_PROFIT_PCT = "0.06";
process.env.MIN_BALANCE = "10";

import { test } from "node:test";
import assert from "node:assert/strict";

// Dynamic import (NOT hoisted) so the env above is set before config builds.
const { RiskEngine } = await import("../src/risk.js");
const { MARKET_PRICE } = await import("../src/types.js");

const risk = new RiskEngine();

test("long: sizes margin/notional/quantity and brackets correctly", () => {
  const d = risk.size("buy", 100, 1000);
  assert.equal(d.ok, true);
  const s = d.sizing!;
  // 10% of 1000 = 100 margin; ×2 leverage = 200 notional; ÷100 entry = 2 qty.
  assert.equal(s.marginToCommit, 100);
  assert.equal(s.notional, 200);
  assert.equal(s.quantity, 2);
  // Long: SL below entry, TP above.
  assert.equal(s.stopLossPrice, 98); // 100 × (1 − 0.02)
  assert.equal(s.takeProfitPrice, 106); // 100 × (1 + 0.06)
});

test("short: bracket sides invert (SL above, TP below)", () => {
  const d = risk.size("sell", 100, 1000);
  assert.equal(d.ok, true);
  const s = d.sizing!;
  assert.equal(s.stopLossPrice, 102); // 100 × (1 + 0.02)
  assert.equal(s.takeProfitPrice, 94); // 100 × (1 − 0.06)
});

test("allocation cap: margin never exceeds MAX_ALLOCATION_PCT of available", () => {
  for (const margin of [10, 100, 1000, 12345.67]) {
    const d = risk.size("buy", 100, margin);
    assert.equal(d.ok, true);
    // Allow a cent of rounding slack; must never exceed the 10% cap.
    assert.ok(d.sizing!.marginToCommit <= margin * 0.1 + 0.01,
      `margin ${d.sizing!.marginToCommit} exceeded 10% of ${margin}`);
  }
});

test("rejects non-positive entry price", () => {
  assert.equal(risk.size("buy", 0, 1000).ok, false);
  assert.equal(risk.size("buy", -5, 1000).ok, false);
});

test("rejects non-positive available margin", () => {
  assert.equal(risk.size("buy", 100, 0).ok, false);
  assert.equal(risk.size("buy", 100, -100).ok, false);
});

test("rejects available margin below MIN_BALANCE", () => {
  const d = risk.size("buy", 100, 9); // MIN_BALANCE is 10
  assert.equal(d.ok, false);
  assert.match(d.reason, /MIN_BALANCE/);
});

test("rejects when quantity rounds to zero (entry too high for margin)", () => {
  const d = risk.size("buy", 1e12, 1000); // 200 notional / 1e12 ≈ 0
  assert.equal(d.ok, false);
  assert.match(d.reason, /rounds to zero/);
});

test("buildMarketOrder emits a valid market-open payload with the bracket", () => {
  const d = risk.size("buy", 100, 1000);
  const order = risk.buildMarketOrder("ETH-USD", "buy", d.sizing!);
  assert.equal(order.price, MARKET_PRICE); // -1 sentinel
  assert.equal(order.order_type, "MarketOpen");
  assert.equal(order.direction, "buy");
  assert.equal(order.base_asset_id, "ETH-USD");
  assert.equal(order.quantity, d.sizing!.quantity);
  assert.equal(order.stop_loss_price, d.sizing!.stopLossPrice);
  assert.equal(order.take_profit_price, d.sizing!.takeProfitPrice);
  assert.equal(order.leverage, 2);
});
