// ============================================================
// Gochar Engine — Calculator
// ------------------------------------------------------------
// Turns raw natal-vs-current comparisons into scored, verdicted,
// sensitive-period-annotated planet influences. Pure functions.
// ============================================================

import { PLANET_AFFECTED_AREAS } from "@/lib/horoscope/personalized/constants";
import type { TransitSnapshot } from "@/lib/transit/types";
import {
  COMBUSTION_ARC_DEG,
  NEUTRAL_INFLUENCE,
  RETROGRADE_WINDOW_DAYS,
  SIGN_CHANGE_WINDOW_DAYS,
  VERDICT_THRESHOLDS,
} from "./constants";
import { addDaysISO, clamp, round, signedArc } from "./helpers";
import type { RawComparison } from "./comparison";
import type { GocharPlanetInfluence, GocharVerdict, SensitivePeriod } from "./types";

/** Verdict from a 0..100 influence score. */
export function verdictFromScore(score: number): GocharVerdict {
  if (score >= VERDICT_THRESHOLDS.positive) return "positive";
  if (score < VERDICT_THRESHOLDS.sensitive) return "sensitive";
  return "neutral";
}

/**
 * Composite influence score for a single planet, 0..100.
 * Blend of gochara (from Moon), kendra-trikona (from Lagna),
 * natal strength, motion state (retrograde / combust).
 */
export function scoreInfluence(
  cmp: RawComparison,
  combust: boolean,
): { score: number; delta: number; confidence: number } {
  const gochara = cmp.beneficFromMoon ? +12 : -8;
  const lagna = cmp.beneficFromLagna ? +8 : -6;
  // Natal strength contributes ± around 55 baseline.
  const natal = ((cmp.natal.strengthScore ?? 55) - 55) * 0.25;
  const retro = cmp.current.retrograde ? -4 : 0;
  const combustPenalty = combust ? -6 : 0;
  const delta = gochara + lagna + natal + retro + combustPenalty;
  const score = clamp(round(NEUTRAL_INFLUENCE + delta), 0, 100);
  // Confidence rises when sign is stable and the planet is well within the sign.
  const stability = cmp.current.degreesInRashi > 2 && cmp.current.degreesInRashi < 28 ? 0.85 : 0.65;
  return { score, delta: round(delta, 2), confidence: stability };
}

/** Detect ± windows where the planet's influence spikes. */
export function detectSensitivePeriods(
  cmp: RawComparison,
  transit: TransitSnapshot,
  nowISO: string,
): SensitivePeriod[] {
  const out: SensitivePeriod[] = [];

  // 1) Sign change ±SIGN_CHANGE_WINDOW_DAYS around next ingress.
  if (cmp.current.nextSignChange) {
    const nc = cmp.current.nextSignChange;
    out.push({
      reason: "sign-change",
      startISO: addDaysISO(nc, -SIGN_CHANGE_WINDOW_DAYS),
      endISO: addDaysISO(nc, +SIGN_CHANGE_WINDOW_DAYS),
      detail: `${cmp.planet} ingress at ${nc}`,
    });
  }

  // 2) Retrograde envelope — approximate ±RETROGRADE_WINDOW_DAYS around now
  //    whenever the planet is currently retrograde (no station data in v1).
  if (cmp.current.retrograde) {
    out.push({
      reason: "retrograde",
      startISO: addDaysISO(nowISO, -RETROGRADE_WINDOW_DAYS),
      endISO: addDaysISO(nowISO, +RETROGRADE_WINDOW_DAYS),
      detail: `${cmp.planet} retrograde motion`,
    });
  }

  // 3) Combustion — if within Sun's arc.
  if (cmp.planet !== "Sun") {
    const sun = transit.planets.find((p) => p.name === "Sun");
    const arc = COMBUSTION_ARC_DEG[cmp.planet];
    if (sun && arc) {
      const sep = Math.abs(signedArc(sun.longitude, cmp.current.longitudeSidereal));
      if (sep <= arc) {
        out.push({
          reason: "combustion",
          startISO: nowISO,
          endISO: addDaysISO(nowISO, +3),
          detail: `${cmp.planet} within ${arc}° of Sun (Δ=${round(sep, 2)}°)`,
        });
      }
    }
  }

  // 4) Adverse gochara (bad from both Moon and Lagna) → flag current day.
  if (!cmp.beneficFromMoon && !cmp.beneficFromLagna) {
    out.push({
      reason: "gochara-adverse",
      startISO: nowISO,
      endISO: addDaysISO(nowISO, +1),
      detail: `${cmp.planet} in adverse gochara houses`,
    });
  }

  return out;
}

export interface DashaOverlay {
  mahadashaLord?: string | null;
  antardashaLord?: string | null;
  pratyantarLord?: string | null;
}

export function isCombust(cmp: RawComparison, transit: TransitSnapshot): boolean {
  if (cmp.planet === "Sun") return false;
  const arc = COMBUSTION_ARC_DEG[cmp.planet];
  if (!arc) return false;
  const sun = transit.planets.find((p) => p.name === "Sun");
  if (!sun) return false;
  const sep = Math.abs(signedArc(sun.longitude, cmp.current.longitudeSidereal));
  return sep <= arc;
}

export function buildInfluence(
  cmp: RawComparison,
  transit: TransitSnapshot,
  nowISO: string,
  dasha: DashaOverlay,
): GocharPlanetInfluence {
  const combust = isCombust(cmp, transit);
  const { score, delta, confidence } = scoreInfluence(cmp, combust);
  const verdict = verdictFromScore(score);
  const sensitivePeriods = detectSensitivePeriods(cmp, transit, nowISO);
  const affectedAreas = (PLANET_AFFECTED_AREAS[cmp.planet] ?? []).slice();
  return {
    planet: cmp.planet,
    natal: cmp.natal,
    current: cmp.current,
    transitHouseFromLagna: cmp.transitHouseFromLagna,
    transitHouseFromNatalMoon: cmp.transitHouseFromNatalMoon,
    transitHouseFromNatalPlanet: cmp.transitHouseFromNatalPlanet,
    signChangedSinceBirth: cmp.signChangedSinceBirth,
    degreesTravelledSinceBirth: cmp.degreesTravelledSinceBirth,
    beneficFromLagna: cmp.beneficFromLagna,
    beneficFromMoon: cmp.beneficFromMoon,
    influenceScore: score,
    confidence: round(confidence, 3),
    strengthDelta: delta,
    verdict,
    sensitivePeriods,
    affectedAreas,
    dashaActive: {
      mahadasha: dasha.mahadashaLord === cmp.planet,
      antardasha: dasha.antardashaLord === cmp.planet,
      pratyantar: dasha.pratyantarLord === cmp.planet,
    },
  };
}
