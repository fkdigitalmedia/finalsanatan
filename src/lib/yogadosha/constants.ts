// ============================================================
// Dosha & Yoga Detection Engine — Constants
// ============================================================

import type { GrahaName } from "@/lib/kundli/types";

export const YOGADOSHA_ENGINE_VERSION = "0.1.0-yogadosha";
export const YOGADOSHA_DATA_SOURCE = "sanatan-tools/kundli";

/** Rashi lords, index 0 = Mesha … 11 = Meena. */
export const SIGN_LORDS: GrahaName[] = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

export const KENDRA_HOUSES = [1, 4, 7, 10] as const;
export const TRIKONA_HOUSES = [1, 5, 9] as const;
export const DUSTHANA_HOUSES = [6, 8, 12] as const;
export const UPACHAYA_HOUSES = [3, 6, 10, 11] as const;

/** Natural benefics (Mercury treated as conditional but benefic by default). */
export const NATURAL_BENEFICS: GrahaName[] = ["Jupiter", "Venus", "Mercury", "Moon"];
export const NATURAL_MALEFICS: GrahaName[] = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

/** Special graha drishti (in addition to the universal 7th aspect). */
export const SPECIAL_ASPECTS: Partial<Record<GrahaName, number[]>> = {
  Mars: [4, 8],
  Jupiter: [5, 9],
  Saturn: [3, 10],
  Rahu: [5, 9],
  Ketu: [5, 9],
};

/** Combustion arcs (degrees from the Sun). */
export const COMBUSTION_ARC_DEG: Partial<Record<GrahaName, number>> = {
  Moon: 12,
  Mars: 17,
  Mercury: 14,
  Jupiter: 11,
  Venus: 10,
  Saturn: 15,
};

/** Conjunction orb (degrees) used by close-conjunction rules. */
export const CLOSE_CONJUNCTION_ORB = 12;

/** Mangal Dosha reference houses. */
export const MANGAL_HOUSES = [1, 2, 4, 7, 8, 12];

/** Kaal Sarp Yoga names by Rahu's house. */
export const KAAL_SARP_TYPES: Record<number, string> = {
  1: "Anant Kaal Sarp",
  2: "Kulik Kaal Sarp",
  3: "Vasuki Kaal Sarp",
  4: "Shankhpal Kaal Sarp",
  5: "Padma Kaal Sarp",
  6: "Mahapadma Kaal Sarp",
  7: "Takshak Kaal Sarp",
  8: "Karkotak Kaal Sarp",
  9: "Shankhachud Kaal Sarp",
  10: "Ghatak Kaal Sarp",
  11: "Vishdhar Kaal Sarp",
  12: "Sheshnag Kaal Sarp",
};

/** Vipreet Raj Yoga variants keyed by the dusthana lord involved. */
export const VIPREET_NAMES: Record<number, string> = {
  6: "Harsha Yoga",
  8: "Sarala Yoga",
  12: "Vimala Yoga",
};

/** Weight each detected record contributes to the balance score. */
export const BALANCE_WEIGHTS = { yoga: 1, dosha: -1 } as const;
