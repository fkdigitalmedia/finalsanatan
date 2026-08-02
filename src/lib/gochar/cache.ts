// ============================================================
// Gochar Engine — Cache
// ------------------------------------------------------------
// Reuses the shared TransitCache for TTL/FIFO discipline.
// ============================================================

import type { KundliResult } from "@/lib/kundli/types";
import { TransitCache } from "@/lib/transit/cache";
import type { GocharOutput } from "./types";

export interface GocharCacheOptions {
  birthTtlMs?: number;
  outputTtlMs?: number;
  maxEntries?: number;
}

export class GocharCache {
  readonly birth: TransitCache<KundliResult>;
  readonly output: TransitCache<GocharOutput>;
  hits = 0;

  constructor(opts: GocharCacheOptions = {}) {
    const max = opts.maxEntries ?? 64;
    this.birth = new TransitCache<KundliResult>({
      ttlMs: opts.birthTtlMs ?? 60 * 60 * 1000,
      maxEntries: max,
    });
    this.output = new TransitCache<GocharOutput>({
      ttlMs: opts.outputTtlMs ?? 15 * 60 * 1000,
      maxEntries: max,
    });
  }

  memoizeBirth(key: string, produce: () => KundliResult): KundliResult {
    const hit = this.birth.get(key);
    if (hit !== undefined) {
      this.hits++;
      return hit;
    }
    const value = produce();
    this.birth.set(key, value);
    return value;
  }

  memoizeOutput(key: string, produce: () => GocharOutput): GocharOutput {
    const hit = this.output.get(key);
    if (hit !== undefined) {
      this.hits++;
      return hit;
    }
    const value = produce();
    this.output.set(key, value);
    return value;
  }

  clear(): void {
    this.birth.clear();
    this.output.clear();
    this.hits = 0;
  }
}
