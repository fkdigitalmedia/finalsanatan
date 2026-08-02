// ============================================================
// Kundli / houses
// ------------------------------------------------------------
// Two house systems are exposed. Vedic charts overwhelmingly use
// whole-sign; equal-house is provided for KP-style callers.
// ============================================================
import type { HouseCusp } from "@/lib/kundli/types";
import { RASHIS } from "@/lib/kundli/types";
import { norm360 } from "@/lib/astro/core";

export type HouseSystem = "whole-sign" | "equal-house";

export function buildHouses(
  ascendantSidereal: number,
  system: HouseSystem = "whole-sign",
): HouseCusp[] {
  const cusps: HouseCusp[] = [];
  const ascRashi = Math.floor(ascendantSidereal / 30);

  for (let i = 0; i < 12; i++) {
    if (system === "whole-sign") {
      const rashi = (ascRashi + i) % 12;
      cusps.push({
        house: i + 1,
        rashiIndex: rashi,
        rashi: RASHIS[rashi],
        startDegree: rashi * 30,
      });
    } else {
      // equal-house: each cusp = asc + i*30
      const start = norm360(ascendantSidereal + i * 30);
      const rashi = Math.floor(start / 30);
      cusps.push({
        house: i + 1,
        rashiIndex: rashi,
        rashi: RASHIS[rashi],
        startDegree: start,
      });
    }
  }
  return cusps;
}

/** Map a sidereal longitude → house number (1..12) for whole-sign chart. */
export function houseOfLongitude(
  siderealLon: number,
  ascendantSidereal: number,
  system: HouseSystem = "whole-sign",
): number {
  const ascRashi = Math.floor(ascendantSidereal / 30);
  if (system === "whole-sign") {
    const bodyRashi = Math.floor(siderealLon / 30);
    return ((bodyRashi - ascRashi + 12) % 12) + 1;
  }
  const diff = norm360(siderealLon - ascendantSidereal);
  return Math.floor(diff / 30) + 1;
}
