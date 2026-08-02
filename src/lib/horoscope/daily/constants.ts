// ============================================================
// Daily Horoscope Engine — Constants
// ------------------------------------------------------------
// Traditional lookup tables used by rules.ts + score.ts.
// Values follow mainstream Vedic sources (Brihat Parashara Hora
// Shastra / Muhurta Chintamani) and are intentionally static.
// ============================================================

import type { RashiKey } from "../types";
import type { DailyScoreCategory } from "./types";

export const DAILY_ENGINE_VERSION = "0.3.0-daily";
export const DAILY_DATA_SOURCE = "sanatan-tools/transit+panchang";

/** Numerology digit associated with each ruling planet. */
export const PLANET_LUCKY_NUMBER: Record<string, number> = {
  Sun: 1,
  Moon: 2,
  Jupiter: 3,
  Rahu: 4,
  Mercury: 5,
  Venus: 6,
  Ketu: 7,
  Saturn: 8,
  Mars: 9,
};

/** Traditional lucky color per Rashi (ruling-planet aligned). */
export const RASHI_LUCKY_COLOR: Record<RashiKey, string> = {
  mesha: "Red",
  vrishabha: "White",
  mithuna: "Green",
  karka: "Silver",
  simha: "Golden",
  kanya: "Emerald Green",
  tula: "Pink",
  vrishchika: "Deep Red",
  dhanu: "Yellow",
  makara: "Indigo",
  kumbha: "Blue",
  meena: "Saffron",
};

/** Auspicious cardinal / intercardinal direction per Rashi. */
export const RASHI_LUCKY_DIRECTION: Record<RashiKey, string> = {
  mesha: "East",
  vrishabha: "South-East",
  mithuna: "West",
  karka: "North",
  simha: "East",
  kanya: "North",
  tula: "West",
  vrishchika: "North",
  dhanu: "North-East",
  makara: "South",
  kumbha: "West",
  meena: "North-East",
};

/**
 * Chandra-gochara benefic houses (1-indexed) per planet transiting
 * relative to the caller's natal Moon sign. Houses NOT listed are
 * considered neutral-to-adverse in the traditional tables.
 */
export const GOCHARA_BENEFIC_HOUSES: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 10, 11],
};

/** Per-category weighting across planets (rows sum > 0). */
export const CATEGORY_WEIGHTS: Record<DailyScoreCategory, Record<string, number>> = {
  overall: { Moon: 3, Sun: 2, Jupiter: 2, Venus: 1, Mercury: 1, Mars: 1, Saturn: 1 },
  career: { Sun: 3, Saturn: 2, Mars: 2, Jupiter: 1, Mercury: 1 },
  business: { Mercury: 3, Jupiter: 2, Sun: 1, Mars: 1, Saturn: 1 },
  finance: { Jupiter: 3, Venus: 2, Mercury: 2, Moon: 1 },
  love: { Venus: 4, Moon: 2, Mars: 1, Jupiter: 1 },
  family: { Moon: 3, Venus: 2, Jupiter: 2, Sun: 1 },
  education: { Mercury: 3, Jupiter: 3, Moon: 1 },
  travel: { Mercury: 2, Moon: 2, Mars: 1, Rahu: 1, Jupiter: 1 },
  health: { Sun: 2, Moon: 3, Mars: 1, Jupiter: 1, Saturn: 1 },
  spiritual: { Jupiter: 3, Ketu: 2, Moon: 2, Saturn: 1 },
  social: { Venus: 3, Moon: 2, Mercury: 2, Jupiter: 1 },
  productivity: { Sun: 2, Mars: 2, Mercury: 2, Saturn: 2 },
  decision: { Sun: 2, Jupiter: 2, Saturn: 2, Mercury: 1 },
  communication: { Mercury: 4, Moon: 1, Jupiter: 1, Venus: 1 },
  confidence: { Sun: 3, Mars: 3, Jupiter: 1, Moon: 1 },
};

/**
 * Tithi qualities used to derive favorable/avoid activity lists.
 * Rikta tithis (4, 9, 14) are traditionally avoided for new work.
 */
export const RIKTA_TITHIS = new Set([4, 9, 14, 19, 24, 29]);
export const NANDA_TITHIS = new Set([1, 6, 11, 16, 21, 26]);
export const BHADRA_TITHIS = new Set([2, 7, 12, 17, 22, 27]);
export const JAYA_TITHIS = new Set([3, 8, 13, 18, 23, 28]);
export const PURNA_TITHIS = new Set([5, 10, 15, 20, 25, 30]);

/** Yogas broadly regarded as inauspicious in classical texts. */
export const INAUSPICIOUS_YOGAS = new Set([
  "Vishkambha",
  "Atiganda",
  "Shoola",
  "Ganda",
  "Vyaghata",
  "Vajra",
  "Vyatipata",
  "Parigha",
  "Vaidhriti",
]);

/** Score categories exported in canonical order. */
export const DAILY_SCORE_CATEGORIES: readonly DailyScoreCategory[] = [
  "overall",
  "career",
  "business",
  "finance",
  "love",
  "family",
  "education",
  "travel",
  "health",
  "spiritual",
  "social",
  "productivity",
  "decision",
  "communication",
  "confidence",
] as const;
