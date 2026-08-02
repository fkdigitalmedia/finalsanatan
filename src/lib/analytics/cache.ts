/**
 * Tiny TTL cache for analytics query results.
 * Server-side memoisation keeps expensive aggregations off the database on
 * dashboard tab-switching; entries are tag-invalidated on ingestion spikes.
 */

interface Entry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
}

const store = new Map<string, Entry<unknown>>();
const MAX_ENTRIES = 500;

export function cacheKey(parts: Record<string, unknown>): string {
  return JSON.stringify(parts, Object.keys(parts).sort());
}

export function getCached<T>(key: string): T | null {
  const hit = store.get(key) as Entry<T> | undefined;
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

export function setCached<T>(key: string, value: T, ttlMs: number, tags: string[] = []): T {
  if (store.size >= MAX_ENTRIES) {
    const oldest = [...store.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt)[0];
    if (oldest) store.delete(oldest[0]);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlMs, tags });
  return value;
}

export function invalidateTag(tag: string): number {
  let n = 0;
  for (const [k, v] of store) {
    if (v.tags.includes(tag)) {
      store.delete(k);
      n += 1;
    }
  }
  return n;
}

export function clearCache(): void {
  store.clear();
}

export function cacheStats() {
  const now = Date.now();
  let live = 0;
  for (const v of store.values()) if (v.expiresAt > now) live += 1;
  return { entries: store.size, live };
}

/** Memoise an async producer under a TTL. */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T>,
  tags: string[] = [],
): Promise<T> {
  const hit = getCached<T>(key);
  if (hit !== null) return hit;
  const value = await producer();
  return setCached(key, value, ttlMs, tags);
}
