// ============================================================
// Daily Horoscope Engine — Rules
// ------------------------------------------------------------
// Traditional astrological rule mappings for lucky-factor and
// activity derivation. Pure functions, no I/O.
// ============================================================

import type { RashiKey } from "../types";
import { getRashi } from "../constants";
import {
  BHADRA_TITHIS,
  INAUSPICIOUS_YOGAS,
  JAYA_TITHIS,
  NANDA_TITHIS,
  PLANET_LUCKY_NUMBER,
  PURNA_TITHIS,
  RASHI_LUCKY_COLOR,
  RASHI_LUCKY_DIRECTION,
  RIKTA_TITHIS,
} from "./constants";

/** Lucky number for a Rashi is derived from its ruling planet. */
export function luckyNumberForRashi(rashi: RashiKey): number {
  const info = getRashi(rashi);
  return (info && PLANET_LUCKY_NUMBER[info.rulingPlanet]) ?? 1;
}

export function luckyColorForRashi(rashi: RashiKey): string {
  return RASHI_LUCKY_COLOR[rashi] ?? "White";
}

export function luckyDirectionForRashi(rashi: RashiKey): string {
  return RASHI_LUCKY_DIRECTION[rashi] ?? "East";
}

/**
 * Derive favorable activities from Tithi + Yoga class.
 * Rules follow Muhurta Chintamani / Brihat Samhita groupings.
 */
export function favorableActivities(tithiIndex: number, yogaName: string): string[] {
  const acts = new Set<string>();
  if (NANDA_TITHIS.has(tithiIndex)) acts.add("Celebrations & auspicious beginnings");
  if (BHADRA_TITHIS.has(tithiIndex)) acts.add("Meetings & partnerships");
  if (JAYA_TITHIS.has(tithiIndex)) acts.add("Competitive endeavors");
  if (PURNA_TITHIS.has(tithiIndex)) {
    acts.add("Long-term commitments");
    acts.add("Charity & donations");
  }
  if (!INAUSPICIOUS_YOGAS.has(yogaName)) {
    acts.add("Prayer & meditation");
    acts.add("Learning & study");
  }
  if (acts.size === 0) acts.add("Routine work & reflection");
  return Array.from(acts);
}

/** Derive activities to avoid from Tithi + Yoga class. */
export function activitiesToAvoid(tithiIndex: number, yogaName: string): string[] {
  const avoid = new Set<string>();
  if (RIKTA_TITHIS.has(tithiIndex)) {
    avoid.add("Starting new ventures");
    avoid.add("Signing contracts");
  }
  if (INAUSPICIOUS_YOGAS.has(yogaName)) {
    avoid.add("Travel initiation");
    avoid.add("Major financial decisions");
  }
  if (tithiIndex === 15 || tithiIndex === 30) {
    avoid.add("Heavy manual labor");
  }
  if (avoid.size === 0) avoid.add("Impulsive decisions");
  return Array.from(avoid);
}
