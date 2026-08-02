// ============================================================
// Transit Engine — In-memory cache
// ------------------------------------------------------------
// Cheap TTL cache keyed by a canonical request signature. Used
// by TransitEngine to avoid recomputing identical snapshots
// inside the same request lifecycle (SSR / edge worker).
// ============================================================

interface Entry<V> {
  value: V;
  expiresAt: number;
}

export interface TransitCacheOptions {
  /** Default TTL in milliseconds (0 disables expiry). */
  ttlMs?: number;
  /** Maximum number of cached entries. */
  maxEntries?: number;
}

export class TransitCache<V = unknown> {
  private store = new Map<string, Entry<V>>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(opts: TransitCacheOptions = {}) {
    this.ttlMs = opts.ttlMs ?? 5 * 60 * 1000;
    this.maxEntries = opts.maxEntries ?? 256;
  }

  /** Retrieve a live cache entry, or `undefined` on miss / expiry. */
  get(key: string): V | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (this.ttlMs > 0 && hit.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }

  /** Insert / overwrite a cache entry. Enforces size cap FIFO-style. */
  set(key: string, value: V): void {
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value as string | undefined;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, {
      value,
      expiresAt: this.ttlMs > 0 ? Date.now() + this.ttlMs : Number.POSITIVE_INFINITY,
    });
  }

  /** Memoize a producer under `key`. */
  memoize(key: string, produce: () => V): V {
    const hit = this.get(key);
    if (hit !== undefined) return hit;
    const value = produce();
    this.set(key, value);
    return value;
  }

  clear(): void {
    this.store.clear();
  }
  get size(): number {
    return this.store.size;
  }
}

/** Stable string signature for a snapshot request. */
export function cacheKey(parts: Record<string, unknown>): string {
  const keys = Object.keys(parts).sort();
  return keys.map((k) => `${k}=${JSON.stringify(parts[k])}`).join("|");
}
