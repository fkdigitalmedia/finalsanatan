// ============================================================
// Sade Sati & Dhaiya Engine — Cache
// ------------------------------------------------------------
// Reuses the shared TransitCache for TTL/FIFO discipline.
// ============================================================

import type { KundliResult } from "@/lib/kundli/types";
import { TransitCache } from "@/lib/transit/cache";
import type { SadeSatiOutput, SaturnOccupancy } from "./types";

export interface SadeSatiCacheOptions {
  birthTtlMs?: number;
  occupancyTtlMs?: number;
  outputTtlMs?: number;
  maxEntries?: number;
}

export class SadeSatiCache {
  readonly birth: TransitCache<KundliResult>;
  readonly occupancy: TransitCache<SaturnOccupancy[]>;
  readonly output: TransitCache<SadeSatiOutput>;
  hits = 0;

  constructor(opts: SadeSatiCacheOptions = {}) {
    const max = opts.maxEntries ?? 64;
    this.birth = new TransitCache<KundliResult>({
      ttlMs: opts.birthTtlMs ?? 60 * 60 * 1000,
      maxEntries: max,
    });
    this.occupancy = new TransitCache<SaturnOccupancy[]>({
      ttlMs: opts.occupancyTtlMs ?? 24 * 60 * 60 * 1000,
      maxEntries: max,
    });
    this.output = new TransitCache<SadeSatiOutput>({
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

  memoizeOccupancy(key: string, produce: () => SaturnOccupancy[]): SaturnOccupancy[] {
    const hit = this.occupancy.get(key);
    if (hit !== undefined) {
      this.hits++;
      return hit;
    }
    const value = produce();
    this.occupancy.set(key, value);
    return value;
  }

  memoizeOutput(key: string, produce: () => SadeSatiOutput): SadeSatiOutput {
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
    this.occupancy.clear();
    this.output.clear();
    this.hits = 0;
  }
}
