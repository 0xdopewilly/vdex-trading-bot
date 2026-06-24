/**
 * state.ts
 * ────────────────────────────────────────────────────────────────────────────
 * In-memory state tracker: active positions, a bounded execution log, and the
 * client-side rate-limiting state. Process-local by design — restarting the bot
 * clears it. (Persisting state across restarts is a documented next step.)
 */

import type { ExecutionLogEntry, Position } from "./types.js";

// ─── Active positions ────────────────────────────────────────────────────────

const positions = new Map<string, Position>();

export function addPosition(p: Position): void {
  positions.set(p.id, p);
}

export function removePosition(id: string): boolean {
  return positions.delete(id);
}

export function getPositions(): Position[] {
  return [...positions.values()];
}

export function openPositionCount(): number {
  return positions.size;
}

export function hasOpenPositionForAsset(baseAssetId: string): boolean {
  for (const p of positions.values()) if (p.baseAssetId === baseAssetId) return true;
  return false;
}

// ─── Bounded execution log ───────────────────────────────────────────────────

const MAX_LOG_ENTRIES = 1000;
const executionLog: ExecutionLogEntry[] = [];

export function appendLog(entry: ExecutionLogEntry): void {
  executionLog.push(entry);
  if (executionLog.length > MAX_LOG_ENTRIES) executionLog.shift();
}

export function getRecentLog(n = 50): ExecutionLogEntry[] {
  return executionLog.slice(-n);
}

// ─── Client-side rate-limit state ────────────────────────────────────────────
//
// Tracks the last response that asked us to slow down (HTTP 429 / WAF challenge)
// so the HTTP client can apply a cool-off window before the next request.

interface RateLimitState {
  /** Epoch ms until which new requests should be held back. 0 = clear. */
  cooldownUntil: number;
  /** Count of consecutive throttle responses, for diagnostics. */
  consecutiveThrottles: number;
}

const rateLimit: RateLimitState = { cooldownUntil: 0, consecutiveThrottles: 0 };

export function noteThrottle(retryAfterMs: number): void {
  rateLimit.consecutiveThrottles += 1;
  rateLimit.cooldownUntil = Math.max(rateLimit.cooldownUntil, Date.now() + retryAfterMs);
}

export function clearThrottle(): void {
  rateLimit.consecutiveThrottles = 0;
  rateLimit.cooldownUntil = 0;
}

export function rateLimitDelayMs(): number {
  return Math.max(0, rateLimit.cooldownUntil - Date.now());
}
