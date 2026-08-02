// ============================================================
// Kundli / strength
// ------------------------------------------------------------
// Classical dignity table (exaltation, moolatrikona, own sign,
// debilitation) + friend/enemy/neutral rulership. Produces a
// normalized 0..1 strength score used by the API layer.
// Not a full Shadbala — that lives in a future module.
// ============================================================
import type { GrahaName, PlanetDignity, Rashi } from "@/lib/kundli/types";
import { RASHIS } from "@/lib/kundli/types";

// rashi indices: 0=Mesha … 11=Meena
const EXALTATION: Record<GrahaName, number> = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6,
  Rahu: 2,
  Ketu: 8,
};
const DEBILITATION: Record<GrahaName, number> = {
  Sun: 6,
  Moon: 7,
  Mars: 3,
  Mercury: 11,
  Jupiter: 9,
  Venus: 5,
  Saturn: 0,
  Rahu: 8,
  Ketu: 2,
};
const OWN_SIGNS: Record<GrahaName, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
  Rahu: [],
  Ketu: [],
};
const MOOLATRIKONA: Record<GrahaName, number> = {
  Sun: 4,
  Moon: 1,
  Mars: 0,
  Mercury: 5,
  Jupiter: 8,
  Venus: 6,
  Saturn: 10,
  Rahu: -1,
  Ketu: -1,
};
const FRIENDS: Record<GrahaName, GrahaName[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
  Rahu: ["Venus", "Saturn", "Mercury"],
  Ketu: ["Mars", "Venus", "Saturn"],
};
const ENEMIES: Record<GrahaName, GrahaName[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
  Rahu: ["Sun", "Moon", "Mars"],
  Ketu: ["Sun", "Moon"],
};

const SIGN_LORDS: GrahaName[] = [
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

export function computeDignity(graha: GrahaName, rashiIndex: number): PlanetDignity {
  if (EXALTATION[graha] === rashiIndex) return "exalted";
  if (DEBILITATION[graha] === rashiIndex) return "debilitated";
  if (MOOLATRIKONA[graha] === rashiIndex) return "moolatrikona";
  if (OWN_SIGNS[graha].includes(rashiIndex)) return "own";
  const lord = SIGN_LORDS[rashiIndex];
  if (FRIENDS[graha].includes(lord)) return "friend";
  if (ENEMIES[graha].includes(lord)) return "enemy";
  return "neutral";
}

const DIGNITY_SCORE: Record<PlanetDignity, number> = {
  exalted: 1.0,
  moolatrikona: 0.9,
  own: 0.8,
  friend: 0.6,
  neutral: 0.5,
  enemy: 0.3,
  debilitated: 0.1,
};

export function strengthScore(dignity: PlanetDignity, degreesInRashi: number): number {
  // "combustion by cusp" — planets near 0° or 30° of a sign are weaker (Sandhi).
  const distToEdge = Math.min(degreesInRashi, 30 - degreesInRashi);
  const sandhi = distToEdge < 1 ? 0.7 : 1;
  return Math.round(DIGNITY_SCORE[dignity] * sandhi * 100) / 100;
}

/** Nakshatra lords (Vimshottari) — indexed 0..26 */
export const NAKSHATRA_LORDS: GrahaName[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

export function rashiName(index: number): Rashi {
  return RASHIS[((index % 12) + 12) % 12];
}
