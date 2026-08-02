// ============================================================
// AI Interpretation Engine — Cache
// ------------------------------------------------------------
// Identical engine data + report + depth + language + prompt
// version => identical narration. The cache key is derived from
// the calculation payload, so it self-invalidates the moment any
// engine number changes.
// ============================================================

import { CACHE_MAX_ENTRIES, CACHE_TTL_MS } from "./constants";
import type { InterpretationResult } from "./types";

/** Deterministic JSON: object keys sorted at every level. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

/** 64-bit-ish FNV-1a hash rendered as hex — fast and dependency-free. */
export function hashString(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ (c + i), 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
}

export interface CacheKeyParts {
  report: string;
  depth: string;
  language: string;
  templateVersion: number;
  data: unknown;
  context?: unknown;
}

export function buildCacheKey(parts: CacheKeyParts): string {
  const payload = stableStringify({
    r: parts.report,
    d: parts.depth,
    l: parts.language,
    v: parts.templateVersion,
    data: parts.data,
    ctx: parts.context ?? null,
  });
  return `${parts.report}:${parts.depth}:${parts.language}:v${parts.templateVersion}:${hashString(payload)}`;
}

interface Entry {
  value: InterpretationResult;
  expiresAt: number;
}

export class InterpretationCache {
  private store = new Map<string, Entry>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  hits = 0;
  misses = 0;

  constructor(opts: { ttlMs?: number; maxEntries?: number } = {}) {
    this.ttlMs = opts.ttlMs ?? CACHE_TTL_MS;
    this.maxEntries = opts.maxEntries ?? CACHE_MAX_ENTRIES;
  }

  get(key: string): InterpretationResult | undefined {
    const hit = this.store.get(key);
    if (!hit) {
      this.misses++;
      return undefined;
    }
    if (this.ttlMs > 0 && hit.expiresAt < Date.now()) {
      this.store.delete(key);
      this.misses++;
      return undefined;
    }
    this.hits++;
    return hit.value;
  }

  set(key: string, value: InterpretationResult): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next();
      if (!oldest.done) this.store.delete(oldest.value);
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /** Drop every entry for a report (used when a template changes). */
  invalidateReport(report: string): number {
    let removed = 0;
    for (const key of [...this.store.keys()]) {
      if (key.startsWith(`${report}:`)) {
        this.store.delete(key);
        removed++;
      }
    }
    return removed;
  }

  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  get size(): number {
    return this.store.size;
  }
}

/** Process-wide cache shared by the default engine instance. */
export const interpretationCache = new InterpretationCache();
