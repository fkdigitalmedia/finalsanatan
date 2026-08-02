// ============================================================
// Personalized Horoscope Engine — Transit Loader
// ------------------------------------------------------------
// Delegates to the shared Transit Engine so its own cache is
// reused (per-minute buckets keyed on planet).
// ============================================================

import type { BirthInput } from "@/lib/kundli/types";
import { TransitEngine } from "@/lib/transit";
import type { CurrentTransitSnapshot } from "./types";
import type { PersonalizedCache } from "./cache";

/** Build a personalized transit snapshot for the given instant. */
export function loadCurrentTransits(
  engine: TransitEngine,
  when: Date,
  birth: BirthInput,
  cache?: PersonalizedCache,
): CurrentTransitSnapshot {
  const key = [
    Math.floor(when.getTime() / 60_000),
    birth.latitude.toFixed(3),
    birth.longitude.toFixed(3),
  ].join("|");

  const produce = (): CurrentTransitSnapshot => {
    const snap = engine.generateTransitSnapshot({
      date: when.toISOString(),
      location: {
        place: birth.place,
        latitude: birth.latitude,
        longitude: birth.longitude,
        timezone: birth.timezone,
      },
    });
    return {
      referenceInstant: snap.date,
      ayanamsaDegrees: snap.ayanamsaDegrees,
      planets: snap.planets,
    };
  };

  return cache ? cache.memoizeTransit(key, produce) : produce();
}
