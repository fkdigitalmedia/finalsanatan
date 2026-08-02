// ============================================================
// Unified cache layer — types
// ------------------------------------------------------------
// The whole app talks to a driver-shaped async interface so the
// backing store can move from in-process memory to Redis /
// Upstash without a single call site changing.
// ============================================================

/** Logical cache partitions. Each gets its own key prefix + default TTL. */
export type CacheNamespace =
  | "query" // raw database result sets
  | "result" // computed engine output (dasha, transit, panchang…)
  | "session" // short-lived request/session scoped values
  | "user" // per-user derived data (entitlements, preferences)
  | "config" // site settings, gateways, providers, feature flags
  | "analytics" // BI aggregates and rollups
  | "seo" // metadata, sitemaps, schema payloads
  | "ai" // AI completions keyed by prompt hash
  | "api"; // HTTP response envelopes

export interface CacheSetOptions {
  /** Time to live in milliseconds. Falls back to the namespace default. */
  ttlMs?: number;
  /** Tags allow surgical group invalidation (e.g. "festivals"). */
  tags?: string[];
}

export interface CacheDriverStats {
  driver: string;
  size: number;
  hits: number;
  misses: number;
  sets: number;
  evictions: number;
  errors: number;
}

/**
 * Every method is async on purpose: a network-backed driver (Redis,
 * Upstash) is a drop-in replacement for the in-memory one.
 */
export interface CacheDriver {
  readonly name: string;
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, opts?: CacheSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
  invalidateTag(tag: string): Promise<number>;
  invalidatePrefix(prefix: string): Promise<number>;
  clear(): Promise<void>;
  stats(): CacheDriverStats;
}

/** Default TTLs tuned per namespace (ms). */
export const NAMESPACE_TTL_MS: Record<CacheNamespace, number> = {
  query: 60_000,
  result: 10 * 60_000,
  session: 5 * 60_000,
  user: 2 * 60_000,
  config: 15 * 60_000,
  analytics: 5 * 60_000,
  seo: 30 * 60_000,
  ai: 24 * 60 * 60_000,
  api: 5 * 60_000,
};

/** Rough per-namespace entry budgets for the in-memory driver. */
export const NAMESPACE_MAX_ENTRIES: Record<CacheNamespace, number> = {
  query: 500,
  result: 300,
  session: 500,
  user: 500,
  config: 100,
  analytics: 200,
  seo: 400,
  ai: 200,
  api: 500,
};
