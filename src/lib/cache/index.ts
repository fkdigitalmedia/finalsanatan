// ============================================================
// Unified cache layer — namespaced facade
// ------------------------------------------------------------
// Call sites use `cache("config").remember(key, ttl, loader)` and
// never touch a driver directly. Swapping in Redis/Upstash is a
// one-line change in `resolveDriver()` (or just setting the env).
// ============================================================

import { MemoryCacheDriver } from "./memory-driver";
import {
  NAMESPACE_MAX_ENTRIES,
  NAMESPACE_TTL_MS,
  type CacheDriver,
  type CacheDriverStats,
  type CacheNamespace,
  type CacheSetOptions,
} from "./types";

export * from "./types";
export { MemoryCacheDriver } from "./memory-driver";

/** Stable stringify so key order never changes the resulting hash. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value ?? null);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(",")}}`;
}

/** Fast, allocation-light 64-bit-ish FNV hash for cache keys. */
export function hashKey(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c + 1, 2246822519) >>> 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}`;
}

/** Build a deterministic key from any payload. */
export function keyOf(prefix: string, payload: unknown): string {
  return `${prefix}:${hashKey(stableStringify(payload))}`;
}

// ---------------------------------------------------------------
// Driver resolution
// ---------------------------------------------------------------

type DriverFactory = (ns: CacheNamespace) => CacheDriver;

let driverFactory: DriverFactory | null = null;

/**
 * Redis-ready hook. Call once at server boot to route every namespace
 * through a distributed driver; application logic is untouched.
 *
 *   import { UpstashCacheDriver } from "@/lib/cache/upstash-driver.server";
 *   setCacheDriverFactory((ns) =>
 *     UpstashCacheDriver.fromEnv(NAMESPACE_TTL_MS[ns]) ?? new MemoryCacheDriver());
 */
export function setCacheDriverFactory(factory: DriverFactory | null): void {
  driverFactory = factory;
  registry.clear();
}

const registry = new Map<CacheNamespace, NamespaceCache>();

// ---------------------------------------------------------------
// Namespace cache
// ---------------------------------------------------------------

export class NamespaceCache {
  readonly driver: CacheDriver;
  private inflight = new Map<string, Promise<unknown>>();

  constructor(readonly namespace: CacheNamespace) {
    this.driver =
      driverFactory?.(namespace) ??
      new MemoryCacheDriver(NAMESPACE_TTL_MS[namespace], NAMESPACE_MAX_ENTRIES[namespace]);
  }

  private full(key: string): string {
    return `${this.namespace}:${key}`;
  }

  get<T>(key: string): Promise<T | undefined> {
    return this.driver.get<T>(this.full(key));
  }

  set<T>(key: string, value: T, opts: CacheSetOptions = {}): Promise<void> {
    return this.driver.set(this.full(key), value, {
      ttlMs: opts.ttlMs ?? NAMESPACE_TTL_MS[this.namespace],
      tags: opts.tags,
    });
  }

  delete(key: string): Promise<void> {
    return this.driver.delete(this.full(key));
  }

  /**
   * Read-through with request coalescing: N concurrent misses for the
   * same key trigger exactly one loader call (kills duplicate queries,
   * AI calls and N+1 storms under load).
   */
  async remember<T>(key: string, loader: () => Promise<T>, opts: CacheSetOptions = {}): Promise<T> {
    const hit = await this.get<T>(key);
    if (hit !== undefined) return hit;

    const fullKey = this.full(key);
    const pending = this.inflight.get(fullKey) as Promise<T> | undefined;
    if (pending) return pending;

    const promise = (async () => {
      try {
        const value = await loader();
        if (value !== undefined) await this.set(key, value, opts);
        return value;
      } finally {
        this.inflight.delete(fullKey);
      }
    })();
    this.inflight.set(fullKey, promise);
    return promise;
  }

  invalidateTag(tag: string): Promise<number> {
    return this.driver.invalidateTag(tag);
  }

  invalidatePrefix(prefix: string): Promise<number> {
    return this.driver.invalidatePrefix(this.full(prefix));
  }

  clear(): Promise<void> {
    return this.driver.clear();
  }

  stats(): CacheDriverStats {
    return this.driver.stats();
  }
}

/** Get (or lazily create) the cache for a namespace. */
export function cache(namespace: CacheNamespace): NamespaceCache {
  let existing = registry.get(namespace);
  if (!existing) {
    existing = new NamespaceCache(namespace);
    registry.set(namespace, existing);
  }
  return existing;
}

/** Invalidate a tag across every namespace (e.g. after a content edit). */
export async function invalidateTagEverywhere(tag: string): Promise<number> {
  let n = 0;
  for (const ns of registry.values()) n += await ns.invalidateTag(tag);
  return n;
}

export async function clearAllCaches(): Promise<void> {
  for (const ns of registry.values()) await ns.clear();
}

export interface CacheOverview {
  namespace: CacheNamespace;
  stats: CacheDriverStats;
  hitRate: number;
}

/** Snapshot used by the admin performance dashboard. */
export function cacheOverview(): CacheOverview[] {
  return [...registry.entries()].map(([namespace, nsCache]) => {
    const stats = nsCache.stats();
    const total = stats.hits + stats.misses;
    return { namespace, stats, hitRate: total === 0 ? 0 : stats.hits / total };
  });
}
