// ============================================================
// Phase 14.7 — Metadata / schema cache.
// Small TTL memo used by the sitemap, robots and engine builders so a
// crawler hitting 50k URLs does not recompute the same registries.
// Regeneration is per-key: touching one page never clears the rest.
// ============================================================

interface Entry<T> {
  value: T;
  expires: number;
}

const store = new Map<string, Entry<unknown>>();

export const DEFAULT_TTL_MS = 10 * 60 * 1000;

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expires < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS): T {
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

/** Memoised async computation. */
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T> | T): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  return cacheSet(key, await fn(), ttlMs);
}

/** Memoised sync computation. */
export function cachedSync<T>(key: string, ttlMs: number, fn: () => T): T {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  return cacheSet(key, fn(), ttlMs);
}

/** Invalidate one key, or every key beginning with `prefix:`. */
export function invalidate(keyOrPrefix: string): number {
  if (store.delete(keyOrPrefix)) return 1;
  let n = 0;
  for (const k of [...store.keys()]) {
    if (k.startsWith(keyOrPrefix)) {
      store.delete(k);
      n += 1;
    }
  }
  return n;
}

export function cacheStats() {
  const now = Date.now();
  const keys = [...store.entries()];
  return {
    size: keys.length,
    live: keys.filter(([, e]) => e.expires >= now).length,
    keys: keys.map(([k]) => k),
  };
}

export function clearCache(): void {
  store.clear();
}
