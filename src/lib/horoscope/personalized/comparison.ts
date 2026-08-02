// ============================================================
// Personalized Horoscope Engine — Comparison Engine
// ------------------------------------------------------------
// Compares each natal planet with its live transit position and
// derives Chandra/Lagna gochara + influence metrics used by the
// scoring layer. Pure functions, no I/O.
// ============================================================

import type { KundliChart } from "@/lib/kundli/types";
import { GOCHARA_BENEFIC_HOUSES } from "../daily/constants";
import { BENEFIC_HOUSES_FROM_LAGNA, DIGNITY_BASE_SCORE, PLANET_AFFECTED_AREAS } from "./constants";
import { clamp, forwardDegrees, houseFromRashi, round } from "./helpers";
import type {
  CurrentTransitSnapshot,
  PlanetComparison,
  PlanetInfluenceEntry,
  PlanetInfluenceMap,
} from "./types";

/** Build per-planet natal vs current comparison. */
export function buildComparison(
  natal: KundliChart,
  transit: CurrentTransitSnapshot,
): PlanetComparison[] {
  const lagnaIdx = natal.ascendant.rashiIndex;
  const moonNatal = natal.planets.find((p) => p.graha === "Moon");
  const moonIdx = moonNatal?.rashiIndex ?? 0;

  const out: PlanetComparison[] = [];
  for (const t of transit.planets) {
    const n = natal.planets.find((p) => p.graha === t.name);
    if (!n) continue;

    const transitHouseFromLagna = houseFromRashi(t.rashiIndex, lagnaIdx);
    const transitHouseFromNatalMoon = houseFromRashi(t.rashiIndex, moonIdx);
    const transitHouseFromNatalPlanet = houseFromRashi(t.rashiIndex, n.rashiIndex);
    const beneficLagna = BENEFIC_HOUSES_FROM_LAGNA.has(transitHouseFromLagna);
    const beneficChandra = (GOCHARA_BENEFIC_HOUSES[t.name] ?? []).includes(
      transitHouseFromNatalMoon,
    );
    const strengthDelta = (beneficLagna ? 1 : -1) * 6 + (beneficChandra ? 1 : -1) * 4;

    out.push({
      planet: t.name,
      natal: {
        rashi: n.rashi,
        rashiIndex: n.rashiIndex,
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
        degreesInRashi: t.degreesInRashi,
        retrograde: t.retrograde,
        speed: round(t.speed, 4),
        longitudeSidereal: t.longitude,
        nextSignChange: t.nextSignChange,
        signEntry: t.signEntry,
      },
      transitHouseFromLagna,
      transitHouseFromNatalMoon,
      transitHouseFromNatalPlanet,
      signChangedSinceBirth: t.rashiIndex !== n.rashiIndex,
      degreesTravelledSinceBirth: round(forwardDegrees(n.longitudeSidereal, t.longitude), 2),
      strengthDelta,
    });
  }
  return out;
}

/**
 * Derive per-planet influence scores. Combines natal
 * dignity/strength with current gochara benefic-house
 * placement. Retrograde adjusts by ±5 depending on natural
 * benefic/malefic status.
 */
export function buildPlanetInfluence(comparison: PlanetComparison[]): PlanetInfluenceMap {
  const map: PlanetInfluenceMap = {};
  for (const c of comparison) {
    const natalDignity = DIGNITY_BASE_SCORE[c.natal.dignity] ?? 55;
    const natalStrength = clamp(natalDignity * 0.5 + c.natal.strengthScore * 100 * 0.5, 0, 100);

    const beneficLagna = BENEFIC_HOUSES_FROM_LAGNA.has(c.transitHouseFromLagna);
    const beneficChandra = (GOCHARA_BENEFIC_HOUSES[c.planet] ?? []).includes(
      c.transitHouseFromNatalMoon,
    );
    let transitScore = beneficLagna ? 72 : 42;
    if (beneficChandra) transitScore += 12;
    else transitScore -= 6;
    if (c.current.retrograde) {
      const benefic = ["Jupiter", "Venus", "Mercury", "Moon"].includes(c.planet);
      transitScore += benefic ? -5 : 5;
    }
    transitScore = clamp(transitScore, 0, 100);

    const influenceScore = round(natalStrength * 0.5 + transitScore * 0.5, 0);
    const confidence = round(0.55 + (beneficLagna ? 0.15 : 0) + (beneficChandra ? 0.15 : 0), 2);

    const entry: PlanetInfluenceEntry = {
      planet: c.planet,
      influenceScore,
      confidence: clamp(confidence, 0, 1),
      affectedAreas: PLANET_AFFECTED_AREAS[c.planet] ?? [],
      planetStatus: {
        retrograde: c.current.retrograde,
        dignity: c.natal.dignity,
        beneficHouse: beneficLagna,
        transitHouseFromLagna: c.transitHouseFromLagna,
        transitHouseFromMoon: c.transitHouseFromNatalMoon,
        natalStrength: round(natalStrength, 0),
      },
      notes: [
        beneficLagna ? "lagna:benefic-house" : "lagna:neutral",
        beneficChandra ? "chandra:benefic" : "chandra:neutral",
        c.current.retrograde ? "motion:retrograde" : "motion:direct",
        `dignity:${c.natal.dignity}`,
      ].join("|"),
    };
    map[c.planet] = entry;
  }
  return map;
}
