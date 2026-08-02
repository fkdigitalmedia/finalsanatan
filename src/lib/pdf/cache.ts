// ============================================================
// Universal PDF Report Engine — Cache
// ------------------------------------------------------------
// Two caches: rendered templates (resolved JSON) and generated
// PDFs (data URLs). Both keyed on a stable hash of their inputs
// so a data change automatically invalidates the entry.
// ============================================================

import {
  PDF_CACHE_MAX_ENTRIES,
  PDF_CACHE_TTL_MS,
  TEMPLATE_CACHE_MAX_ENTRIES,
  TEMPLATE_CACHE_TTL_MS,
} from "./constants";

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
  return `{${entries.join(",")}}`;
}

export function hashString(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c + i, 2246822519) >>> 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}`;
}

export function buildCacheKey(parts: Record<string, unknown>): string {
  return hashString(stableStringify(parts));
}

interface Entry<T> {
  value: T;
  expires: number;
}

export class TtlCache<T> {
  private store = new Map<string, Entry<T>>();
  hits = 0;
  misses = 0;

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries: number,
  ) {}

  get size(): number {
    return this.store.size;
  }

  get(key: string): T | null {
    const hit = this.store.get(key);
    if (!hit) {
      this.misses++;
      return null;
    }
    if (hit.expires < Date.now()) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    // refresh LRU position
    this.store.delete(key);
    this.store.set(key, hit);
    this.hits++;
    return hit.value;
  }

  set(key: string, value: T): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
  delete(key: string): boolean {
    return this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /** Drop every key containing the given marker (report id, template id...). */
  invalidatePrefix(marker: string): number {
    let removed = 0;
    for (const key of [...this.store.keys()]) {
      if (key.startsWith(marker)) {
        this.store.delete(key);
        removed++;
      }
    }
    return removed;
  }
}

export interface CachedPdf {
  dataUrl: string;
  pages: number;
  bytes: number;
  filename: string;
  generatedAt: string;
}

export const templateCache = new TtlCache<unknown>(
  TEMPLATE_CACHE_TTL_MS,
  TEMPLATE_CACHE_MAX_ENTRIES,
);
export const pdfCache = new TtlCache<CachedPdf>(PDF_CACHE_TTL_MS, PDF_CACHE_MAX_ENTRIES);

export function clearPdfCaches(): void {
  templateCache.clear();
  pdfCache.clear();
}
