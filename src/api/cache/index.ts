// ============================================================
// Universal API Layer — Response cache
// ------------------------------------------------------------
// The engines keep their own domain caches (Kundli, Transit,
// Gochar, Dasha, AI, PDF). This is a thin HTTP-response cache
// on top of them: keyed by endpoint + role-visibility + payload,
// tagged so invalidation stays surgical.
// ============================================================

export interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
  tags: string[];
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  evictions: number;
}

export const DEFAULT_TTL_MS = 5 * 60_000;
export const MAX_ENTRIES = 500;

/** Stable stringify so key order never changes the cache key. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value ?? null);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export function hashString(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c + 1, 2246822519) >>> 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}`;
}

export function buildCacheKey(parts: {
  version: string;
  endpoint: string;
  method: string;
  visibility: string;
  payload: unknown;
}): string {
  return `${parts.version}:${parts.method}:${parts.endpoint}:${parts.visibility}:${hashString(
    stableStringify(parts.payload),
  )}`;
}

export class ApiCache {
  private store = new Map<string, CacheEntry>();
  hits = 0;
  misses = 0;
  evictions = 0;

  constructor(
    private ttlMs: number = DEFAULT_TTL_MS,
    private maxEntries: number = MAX_ENTRIES,
  ) {}

  get<T>(key: string): T | undefined {
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
    // refresh LRU position
    this.store.delete(key);
    this.store.set(key, hit);
    this.hits++;
    return hit.value as T;
  }

  set<T>(key: string, value: T, opts: { ttlMs?: number; tags?: string[] } = {}): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value as string | undefined;
      if (oldest) {
        this.store.delete(oldest);
        this.evictions++;
      }
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (opts.ttlMs ?? this.ttlMs),
      tags: opts.tags ?? [],
    });
  }

  /** Smart invalidation: drop everything carrying a tag. */
  invalidateTag(tag: string): number {
    let n = 0;
    for (const [k, v] of this.store) {
      if (v.tags.includes(tag)) {
        this.store.delete(k);
        n++;
      }
    }
    return n;
  }

  invalidatePrefix(prefix: string): number {
    let n = 0;
    for (const k of [...this.store.keys()]) {
      if (k.startsWith(prefix)) {
        this.store.delete(k);
        n++;
      }
    }
    return n;
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }

  stats(): CacheStats {
    return { size: this.size, hits: this.hits, misses: this.misses, evictions: this.evictions };
  }
}

export const apiCache = new ApiCache();
