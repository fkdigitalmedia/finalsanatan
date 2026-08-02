// ============================================================
// Dasha Engine — Cache
// ------------------------------------------------------------
// Reuses the shared TransitCache TTL/FIFO discipline so the
// dasha engine caches identically to horoscope / transit code.
// ============================================================

import type { KundliResult } from "@/lib/kundli/types";
import { TransitCache } from "@/lib/transit/cache";
import type { DashaOutput } from "./types";

export interface DashaCacheOptions {
  birthTtlMs?: number;
  outputTtlMs?: number;
  maxEntries?: number;
}

export class DashaCache {
  readonly birth: TransitCache<KundliResult>;
  readonly output: TransitCache<DashaOutput>;
  hits = 0;

  constructor(opts: DashaCacheOptions = {}) {
    const max = opts.maxEntries ?? 64;
    this.birth = new TransitCache<KundliResult>({
      ttlMs: opts.birthTtlMs ?? 60 * 60 * 1000,
      maxEntries: max,
    });
    this.output = new TransitCache<DashaOutput>({
      ttlMs: opts.outputTtlMs ?? 30 * 60 * 1000,
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

  memoizeOutput(key: string, produce: () => DashaOutput): DashaOutput {
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
