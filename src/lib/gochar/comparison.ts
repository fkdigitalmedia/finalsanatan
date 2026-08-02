// ============================================================
// Gochar Engine — Comparison Layer
// ------------------------------------------------------------
// Pure functions. Compares each natal planet with its live
// transit position and returns per-planet natal/current pairs
// plus the classical gochara reference houses. The scoring /
// verdict / sensitive-period logic lives in calculator.ts.
// ============================================================

import type { KundliChart } from "@/lib/kundli/types";
import type { TransitSnapshot } from "@/lib/transit/types";
import { GOCHARA_BENEFIC_HOUSES } from "@/lib/horoscope/daily/constants";
import { BENEFIC_HOUSES_FROM_LAGNA } from "@/lib/horoscope/personalized/constants";
import { forwardDegrees, houseFromRashi, round } from "./helpers";
import type { CurrentTransitSnapshot, GocharPlanetInfluence, NatalPlanetSnapshot } from "./types";

export interface RawComparison {
  planet: GocharPlanetInfluence["planet"];
  natal: NatalPlanetSnapshot;
  current: CurrentTransitSnapshot;
  transitHouseFromLagna: number;
  transitHouseFromNatalMoon: number;
  transitHouseFromNatalPlanet: number;
  signChangedSinceBirth: boolean;
  degreesTravelledSinceBirth: number;
  beneficFromLagna: boolean;
  beneficFromMoon: boolean;
}

export function buildComparison(natal: KundliChart, transit: TransitSnapshot): RawComparison[] {
  const lagnaIdx = natal.ascendant.rashiIndex;
  const moonNatal = natal.planets.find((p) => p.graha === "Moon");
  const moonIdx = moonNatal?.rashiIndex ?? 0;

  const out: RawComparison[] = [];
  for (const t of transit.planets) {
    const n = natal.planets.find((p) => p.graha === t.name);
    if (!n) continue;

    const transitHouseFromLagna = houseFromRashi(t.rashiIndex, lagnaIdx);
    const transitHouseFromNatalMoon = houseFromRashi(t.rashiIndex, moonIdx);
    const transitHouseFromNatalPlanet = houseFromRashi(t.rashiIndex, n.rashiIndex);

    const beneficLagna = BENEFIC_HOUSES_FROM_LAGNA.has(transitHouseFromLagna);
    const beneficMoon = (GOCHARA_BENEFIC_HOUSES[t.name] ?? []).includes(transitHouseFromNatalMoon);

    out.push({
      planet: t.name,
      natal: {
        rashi: n.rashi,
        rashiIndex: n.rashiIndex,
        nakshatra: n.nakshatra,
        nakshatraIndex: n.nakshatraIndex,
        house: n.house,
        degreesInRashi: n.degreesInRashi,
        dignity: n.dignity,
        strengthScore: n.strengthScore,
        retrograde: n.retrograde,
        longitudeSidereal: n.longitudeSidereal,
      },
      current: {
        rashi: t.rashi,
        rashiIndex: t.rashiIndex,
        nakshatra: t.nakshatra,
        nakshatraIndex: t.nakshatraIndex,
        degreesInRashi: t.degreesInRashi,
        longitudeSidereal: t.longitude,
        speed: round(t.speed, 4),
        retrograde: t.retrograde,
        signEntry: t.signEntry,
        nextSignChange: t.nextSignChange,
      },
      transitHouseFromLagna,
      transitHouseFromNatalMoon,
      transitHouseFromNatalPlanet,
      signChangedSinceBirth: t.rashiIndex !== n.rashiIndex,
      degreesTravelledSinceBirth: round(forwardDegrees(n.longitudeSidereal, t.longitude), 3),
      beneficFromLagna: beneficLagna,
      beneficFromMoon: beneficMoon,
    });
  }
  return out;
}
