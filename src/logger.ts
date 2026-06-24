/**
 * logger.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Tiny levelled, timestamped structured logger. No dependencies. Honours the
 * LOG_LEVEL from config and forwards every entry to the in-memory execution log
 * (see state.ts) so recent activity can be inspected programmatically.
 */

import { config } from "./config.js";
import { appendLog } from "./state.js";
import type { ExecutionLogEntry } from "./types.js";

type Level = ExecutionLogEntry["level"];

const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = ORDER[config.logLevel];

function emit(level: Level, message: string, meta?: Record<string, unknown>): void {
  if (ORDER[level] < threshold) return;

  const ts = Date.now();
  appendLog({ ts, level, message, meta });

  const stamp = new Date(ts).toISOString();
  const tag = level.toUpperCase().padEnd(5);
  const line = `${stamp} ${tag} ${message}`;

  const sink = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  if (meta && Object.keys(meta).length > 0) sink(line, meta);
  else sink(line);
}

export const log = {
  debug: (m: string, meta?: Record<string, unknown>) => emit("debug", m, meta),
  info: (m: string, meta?: Record<string, unknown>) => emit("info", m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => emit("warn", m, meta),
  error: (m: string, meta?: Record<string, unknown>) => emit("error", m, meta),
};
