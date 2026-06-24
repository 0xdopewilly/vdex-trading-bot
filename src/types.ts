/**
 * types.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Strict domain & API type definitions for the vDEX trading bot.
 *
 * The vDEX gateway does not publish exhaustive response schemas, so request
 * bodies (which we control) are typed strictly, while response shapes carry a
 * small set of known fields plus an index signature. `src/api.ts` normalises
 * the loose responses into the strict internal shapes the engine relies on.
 */

// ─── Shared primitives ───────────────────────────────────────────────────────

export type LeverageType = "cross" | "isolated";
export type OrderDirection = "buy" | "sell";
export type OrderType = "MarketOpen" | "LimitOpen";

/** Sentinel price for a market order, per the vDEX spec. */
export const MARKET_PRICE = -1 as const;

/** Generic envelope used by most vDEX gateway endpoints. */
export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  result?: T;
  message?: string;
  error?: string;
}

// ─── Orders (request — strictly typed, we own this contract) ─────────────────

export interface CreateLeverageOrderRequest {
  /** Limit price, or -1 for a market open. */
  price: number;
  leverage_type: LeverageType;
  quantity: number;
  direction: OrderDirection;
  order_type: OrderType;
  expiration_time_in_min?: number;
  base_asset_id: string;
  leverage: number;
  take_profit_price?: number;
  take_profit_amount?: number;
  stop_loss_price?: number;
  stop_loss_amount?: number;
  is_mobile?: boolean;
}

/** Best-effort parse of an order-creation response. */
export interface OrderResult {
  order_id?: string;
  id?: string;
  status?: string;
  [key: string]: unknown;
}

// ─── Balances (response) ─────────────────────────────────────────────────────

export interface RawBalance {
  asset_id?: string;
  asset?: string;
  symbol?: string;
  currency?: string;
  available?: number | string;
  available_balance?: number | string;
  free?: number | string;
  total?: number | string;
  balance?: number | string;
  locked?: number | string;
  [key: string]: unknown;
}

/** Normalised balance line used internally. */
export interface Balance {
  symbol: string;
  assetId: string | undefined;
  available: number;
  total: number;
}

// ─── Pairs / market data (response) ──────────────────────────────────────────

export interface RawMarketData {
  last_price?: number | string;
  lastPrice?: number | string;
  price?: number | string;
  mark_price?: number | string;
  index_price?: number | string;
  [key: string]: unknown;
}

export interface RawPair {
  id?: string;
  pair_id?: string;
  base_asset_id?: string;
  baseAssetId?: string;
  base_token?: string;
  baseToken?: string;
  quote_token?: string;
  quoteToken?: string;
  symbol?: string;
  name?: string;
  market_data?: RawMarketData;
  marketData?: RawMarketData;
  [key: string]: unknown;
}

/** Normalised pair used internally. */
export interface Pair {
  baseAssetId: string | undefined;
  baseToken: string | undefined;
  quoteToken: string | undefined;
  symbol: string | undefined;
  price: number | undefined;
  raw: RawPair;
}

// ─── Price endpoint (response) ───────────────────────────────────────────────

export interface RawPriceResponse {
  price?: number | string;
  last_price?: number | string;
  base_token?: string;
  quote_token?: string;
  [key: string]: unknown;
}

// ─── Internal engine state ───────────────────────────────────────────────────

export interface Position {
  id: string;
  baseAssetId: string;
  symbol: string;
  direction: OrderDirection;
  entryPrice: number;
  quantity: number;
  leverage: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  openedAt: number;
  dryRun: boolean;
  orderResult?: OrderResult;
}

export interface ExecutionLogEntry {
  ts: number;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  meta?: Record<string, unknown>;
}

export interface TradeSignal {
  action: OrderDirection | "hold";
  reason: string;
  price: number;
}
