/**
 * strategy.trend-following.test.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Unit tests for the trend-following signal. Env is pinned before import so the
 * config singleton resolves to STRATEGY=trend_following with FAST_SMA(2) <
 * SLOW_SMA(4). The strategy must only fire on a fresh crossover, never on every
 * tick of an established trend.
 */

process.env.VDEX_API_KEY = "test-key";
process.env.STRATEGY = "trend_following";
process.env.FAST_SMA = "2";
process.env.SLOW_SMA = "4";

import { test } from "node:test";
import assert from "node:assert/strict";

// Dynamic import (NOT hoisted) so the env above is set before config builds.
const { createStrategy } = await import("../src/strategy.js");

test("factory selects trend_following from config", () => {
  assert.equal(createStrategy().name, "trend_following");
});

test("holds and is cold until SLOW_SMA samples exist", () => {
  const s = createStrategy();
  s.update(10);
  s.update(9);
  const third = s.update(8); // slow SMA(4) still undefined
  assert.equal(s.isWarm(), false);
  assert.equal(third.action, "hold");
});

test("first warm tick establishes the baseline without trading", () => {
  const s = createStrategy();
  s.update(10);
  s.update(9);
  s.update(8);
  const fourth = s.update(7); // both SMAs defined, prev undefined
  assert.equal(s.isWarm(), true);
  assert.equal(fourth.action, "hold");
  assert.match(fourth.reason, /baseline/i);
});

test("buys on a fresh bullish crossover (fast crosses above slow)", () => {
  const s = createStrategy();
  // Downtrend establishes fast < slow baseline...
  for (const p of [10, 9, 8, 7, 6]) s.update(p);
  // ...then a sharp jump pulls the fast SMA above the slow SMA.
  const sig = s.update(20);
  assert.equal(sig.action, "buy");
  assert.match(sig.reason, /[Bb]ullish/);
});

test("does not re-fire while the trend is intact", () => {
  const s = createStrategy();
  for (const p of [10, 9, 8, 7, 6]) s.update(p);
  s.update(20); // buy (crossover)
  const next = s.update(20); // trend intact, no new crossover
  assert.equal(next.action, "hold");
});

test("sells on a fresh bearish crossover (fast crosses below slow)", () => {
  const s = createStrategy();
  for (const p of [10, 9, 8, 7, 6]) s.update(p);
  s.update(20); // bullish crossover → buy
  s.update(20); // trend intact
  const sig = s.update(1); // fast collapses below slow
  assert.equal(sig.action, "sell");
  assert.match(sig.reason, /[Bb]earish/);
});
