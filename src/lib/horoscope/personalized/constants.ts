// ============================================================
// Personalized Horoscope Engine — Constants
// ------------------------------------------------------------
// Static reference data. Every personalized category resolves
// to exactly one daily category so score math stays DRY.
// ============================================================

import { YEARLY_ENGINE_VERSION } from "../yearly/engine";
import type { DailyScoreCategory } from "../daily/types";
import type { PersonalizedCategorySource, PersonalizedScoreCategory } from "./types";

export const PERSONALIZED_ENGINE_VERSION = `${YEARLY_ENGINE_VERSION}+personalized.1`;
export const PERSONALIZED_DATA_SOURCE = "sanatan-tools/kundli+transit+daily+panchang";

/** Canonical personalized categories in reporting order. */
export const PERSONALIZED_SCORE_CATEGORIES: readonly PersonalizedScoreCategory[] = [
  "overallEnergy",
  "career",
  "business",
  "finance",
  "love",
  "marriage",
  "relationships",
  "family",
  "health",
  "education",
  "travel",
  "property",
  "investments",
  "creativity",
  "leadership",
  "communication",
  "productivity",
  "decisionMaking",
  "mentalWellness",
  "spiritualGrowth",
] as const;

/**
 * Maps a personalized category → the daily category whose
 * pre-computed scores feed it. Reuses the existing daily
 * scoring math (Phase 12.3) rather than re-deriving from the
 * ephemeris.
 */
export const PERSONALIZED_CATEGORY_SOURCE: PersonalizedCategorySource = {
  overallEnergy: "overall",
  career: "career",
  business: "business",
  finance: "finance",
  love: "love",
  marriage: "love",
  relationships: "love",
  family: "family",
  health: "health",
  education: "education",
  travel: "travel",
  property: "finance",
  investments: "finance",
  creativity: "social",
  leadership: "confidence",
  communication: "communication",
  productivity: "productivity",
  decisionMaking: "decision",
  mentalWellness: "health",
  spiritualGrowth: "spiritual",
};

/**
 * Categories every planet has *some* say in. Used to build the
 * `affectedAreas` list on PlanetInfluenceEntry.
 */
export const PLANET_AFFECTED_AREAS: Record<string, PersonalizedScoreCategory[]> = {
  Sun: ["career", "leadership", "health", "overallEnergy", "decisionMaking"],
  Moon: ["mentalWellness", "family", "overallEnergy", "love", "creativity"],
  Mars: ["career", "leadership", "productivity", "property", "health"],
  Mercury: ["communication", "education", "business", "travel", "decisionMaking"],
  Jupiter: ["finance", "spiritualGrowth", "education", "marriage", "investments"],
  Venus: ["love", "marriage", "relationships", "creativity", "finance"],
  Saturn: ["career", "property", "health", "decisionMaking", "productivity"],
  Rahu: ["business", "travel", "investments", "leadership"],
  Ketu: ["spiritualGrowth", "mentalWellness", "decisionMaking"],
};

/**
 * Contribution mix per category: how much of the final score
 * comes from natal (birth chart) vs transit (live).
 * Natal-heavy for long-lived themes; transit-heavy for daily fluxes.
 * Rows must sum to 1.0.
 */
export const NATAL_TRANSIT_MIX: Record<
  PersonalizedScoreCategory,
  { natal: number; transit: number }
> = {
  overallEnergy: { natal: 0.3, transit: 0.7 },
  career: { natal: 0.45, transit: 0.55 },
  business: { natal: 0.45, transit: 0.55 },
  finance: { natal: 0.5, transit: 0.5 },
  love: { natal: 0.4, transit: 0.6 },
  marriage: { natal: 0.6, transit: 0.4 },
  relationships: { natal: 0.35, transit: 0.65 },
  family: { natal: 0.55, transit: 0.45 },
  health: { natal: 0.4, transit: 0.6 },
  education: { natal: 0.5, transit: 0.5 },
  travel: { natal: 0.25, transit: 0.75 },
  property: { natal: 0.6, transit: 0.4 },
  investments: { natal: 0.55, transit: 0.45 },
  creativity: { natal: 0.5, transit: 0.5 },
  leadership: { natal: 0.55, transit: 0.45 },
  communication: { natal: 0.35, transit: 0.65 },
  productivity: { natal: 0.3, transit: 0.7 },
  decisionMaking: { natal: 0.4, transit: 0.6 },
  mentalWellness: { natal: 0.35, transit: 0.65 },
  spiritualGrowth: { natal: 0.65, transit: 0.35 },
};

/** Houses considered "kendra + trikona + upachaya" (broadly benefic) from lagna. */
export const BENEFIC_HOUSES_FROM_LAGNA = new Set([1, 3, 4, 5, 6, 7, 9, 10, 11]);

/** Dignity → base 0..100 score for natal contribution. */
export const DIGNITY_BASE_SCORE: Record<string, number> = {
  exalted: 95,
  moolatrikona: 88,
  own: 80,
  friend: 65,
  neutral: 55,
  enemy: 40,
  debilitated: 25,
};

/** Re-export the underlying daily categories the engine ultimately targets. */
export type SourceCategory = DailyScoreCategory;
