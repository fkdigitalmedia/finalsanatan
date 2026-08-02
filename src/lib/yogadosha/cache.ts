// ============================================================
// Dosha & Yoga Detection Engine — Cache
// ------------------------------------------------------------
// Reuses the shared TransitCache for TTL/FIFO discipline.
// ============================================================

import type { KundliResult } from "@/lib/kundli/types";
import { TransitCache } from "@/lib/transit/cache";
import type { YogaDoshaOutput } from "./types";

export interface YogaDoshaCacheOptions {
  birthTtlMs?: number;
  outputTtlMs?: number;
  maxEntries?: number;
}

export class YogaDoshaCache {
  readonly birth: TransitCache<KundliResult>;
  readonly output: TransitCache<YogaDoshaOutput>;
  hits = 0;

  constructor(opts: YogaDoshaCacheOptions = {}) {
    const max = opts.maxEntries ?? 64;
    this.birth = new TransitCache<KundliResult>({
      ttlMs: opts.birthTtlMs ?? 60 * 60 * 1000,
      maxEntries: max,
    });
    this.output = new TransitCache<YogaDoshaOutput>({
      ttlMs: opts.outputTtlMs ?? 60 * 60 * 1000,
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

  memoizeOutput(key: string, produce: () => YogaDoshaOutput): YogaDoshaOutput {
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
