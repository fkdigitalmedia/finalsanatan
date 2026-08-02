// ============================================================
// Unified cache layer — in-process LRU driver
// ------------------------------------------------------------
// Default driver. O(1) LRU via Map insertion order, TTL expiry on
// read, tag index for group invalidation. Safe on the edge runtime
// (no timers, no globals beyond the Map).
// ============================================================

import type { CacheDriver, CacheDriverStats, CacheSetOptions } from "./types";

interface Entry {
  value: unknown;
  expiresAt: number;
  tags: string[];
}

export class MemoryCacheDriver implements CacheDriver {
  readonly name = "memory";
  private store = new Map<string, Entry>();
  private hits = 0;
  private misses = 0;
  private sets = 0;
  private evictions = 0;

  constructor(
    private defaultTtlMs = 5 * 60_000,
    private maxEntries = 500,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const hit = this.store.get(key);
    if (!hit) {
      this.misses++;
      return undefined;
    }
    if (hit.expiresAt <= Date.now()) {
      this.store.delete(key);
      this.misses++;
      return undefined;
    }
    // Refresh LRU recency.
    this.store.delete(key);
    this.store.set(key, hit);
    this.hits++;
    return hit.value as T;
  }

  async set<T>(key: string, value: T, opts: CacheSetOptions = {}): Promise<void> {
    while (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value as string | undefined;
      if (!oldest) break;
      this.store.delete(oldest);
      this.evictions++;
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (opts.ttlMs ?? this.defaultTtlMs),
      tags: opts.tags ?? [],
    });
    this.sets++;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async invalidateTag(tag: string): Promise<number> {
    let n = 0;
    for (const [k, v] of this.store) {
      if (v.tags.includes(tag)) {
        this.store.delete(k);
        n++;
      }
    }
    return n;
  }

  async invalidatePrefix(prefix: string): Promise<number> {
    let n = 0;
    for (const k of [...this.store.keys()]) {
      if (k.startsWith(prefix)) {
        this.store.delete(k);
        n++;
      }
    }
    return n;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  /** Drop expired entries; cheap enough to call from a health probe. */
  prune(): number {
    const now = Date.now();
    let n = 0;
    for (const [k, v] of this.store) {
      if (v.expiresAt <= now) {
        this.store.delete(k);
        n++;
      }
    }
    return n;
  }

  stats(): CacheDriverStats {
    return {
      driver: this.name,
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
      evictions: this.evictions,
      errors: 0,
    };
  }
}
