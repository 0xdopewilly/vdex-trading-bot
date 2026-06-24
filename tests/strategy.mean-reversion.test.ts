/**
 * strategy.mean-reversion.test.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Unit tests for the mean-reversion signal. Env is pinned before import so the
 * config singleton resolves to STRATEGY=mean_reversion with a small SMA window.
 */

process.env.VDEX_API_KEY = "test-key";
process.env.STRATEGY = "mean_reversion";
process.env.SMA_WINDOW = "5";
process.env.ENTRY_THRESHOLD = "0.01";

import { test } from "node:test";
import assert from "node:assert/strict";

// Dynamic import (NOT hoisted) so the env above is set before config builds.
const { createStrategy } = await import("../src/strategy.js");

/** Feed a sequence, return the final signal. */
function feed(prices: number[]) {
  const s = createStrategy();
  let last;
  for (const p of prices) last = s.update(p);
  return { s, last: last! };
}

test("factory selects mean_reversion from config", () => {
  assert.equal(createStrategy().name, "mean_reversion");
});

test("holds and is cold while warming up", () => {
  const { s, last } = feed([100, 100, 100]); // < SMA_WINDOW (5)
  assert.equal(s.isWarm(), false);
  assert.equal(last.action, "hold");
  assert.match(last.reason, /Warming up/);
});

test("warm once SMA_WINDOW samples have accumulated", () => {
  const { s } = feed([100, 100, 100, 100, 100]);
  assert.equal(s.isWarm(), true);
});

test("buys when price drops far below the mean", () => {
  // SMA(5) of [100,100,100,100,90] = 98; price 90 ≈ −8.2% → buy.
  const { last } = feed([100, 100, 100, 100, 90]);
  assert.equal(last.action, "buy");
});

test("sells when price extends far above the mean", () => {
  // SMA(5) of [100,100,100,100,110] = 102; price 110 ≈ +7.8% → sell.
  const { last } = feed([100, 100, 100, 100, 110]);
  assert.equal(last.action, "sell");
});

test("holds inside the entry band", () => {
  // SMA(5) of [100,100,100,100,100.5] = 100.1; +0.4% < 1% threshold → hold.
  const { last } = feed([100, 100, 100, 100, 100.5]);
  assert.equal(last.action, "hold");
});
