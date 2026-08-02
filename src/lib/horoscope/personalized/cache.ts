// ============================================================
// Personalized Horoscope Engine — Cache Layer
// ------------------------------------------------------------
// Thin wrappers around the shared TransitCache so all personal-
// ized artifacts (birth chart, transit snapshot, final payload)
// obey the same TTL/FIFO discipline as the rest of the horoscope
// stack.
// ============================================================

import type { KundliResult } from "@/lib/kundli/types";
import { TransitCache } from "@/lib/transit/cache";
import type { CurrentTransitSnapshot, PersonalizedHoroscopeOutput } from "./types";

export interface PersonalizedCacheOptions {
  birthTtlMs?: number;
  transitTtlMs?: number;
  outputTtlMs?: number;
  maxEntries?: number;
}

export class PersonalizedCache {
  readonly birth: TransitCache<KundliResult>;
  readonly transit: TransitCache<CurrentTransitSnapshot>;
  readonly output: TransitCache<PersonalizedHoroscopeOutput>;
  /** Hit-counter for observability — reset on `clear()`. */
  hits = 0;

  constructor(opts: PersonalizedCacheOptions = {}) {
    const max = opts.maxEntries ?? 64;
    this.birth = new TransitCache<KundliResult>({
      ttlMs: opts.birthTtlMs ?? 60 * 60 * 1000,
      maxEntries: max,
    });
    this.transit = new TransitCache<CurrentTransitSnapshot>({
      ttlMs: opts.transitTtlMs ?? 5 * 60 * 1000,
      maxEntries: max * 2,
    });
    this.output = new TransitCache<PersonalizedHoroscopeOutput>({
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

  memoizeTransit(key: string, produce: () => CurrentTransitSnapshot): CurrentTransitSnapshot {
    const hit = this.transit.get(key);
    if (hit !== undefined) {
      this.hits++;
      return hit;
    }
    const value = produce();
    this.transit.set(key, value);
    return value;
  }

  memoizeOutput(
    key: string,
    produce: () => PersonalizedHoroscopeOutput,
  ): PersonalizedHoroscopeOutput {
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
    this.transit.clear();
    this.output.clear();
    this.hits = 0;
  }
}
