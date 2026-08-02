// ============================================================
// Yearly Horoscope Engine — Constants
// ------------------------------------------------------------
// Static tables + category mapping. The yearly engine exposes
// a richer category vocabulary than the daily engine; every
// yearly category resolves to exactly one existing DailyScore-
// Category so nothing has to be re-computed from ephemeris.
// ============================================================

import { MONTHLY_ENGINE_VERSION } from "../monthly/engine";
import type { DailyScoreCategory } from "../daily/types";
import type { YearlyScoreCategory } from "./types";

export const YEARLY_ENGINE_VERSION = `${MONTHLY_ENGINE_VERSION}+yearly.1`;
export const YEARLY_DATA_SOURCE = "sanatan-tools/monthly+transit+panchang+festivals";

/**
 * Canonical yearly categories in reporting order. Superset of
 * daily categories with a few life-domain aliases (marriage,
 * relationships, property, investments, leadership,
 * personalDevelopment, decisionMaking).
 */
export const YEARLY_SCORE_CATEGORIES: readonly YearlyScoreCategory[] = [
  "overall",
  "career",
  "business",
  "finance",
  "relationships",
  "marriage",
  "family",
  "health",
  "education",
  "travel",
  "property",
  "investments",
  "spiritual",
  "personalDevelopment",
  "decisionMaking",
  "communication",
  "leadership",
  "productivity",
] as const;

/**
 * Maps a yearly category → the daily category whose pre-computed
 * scores feed it. This keeps calculations DRY (Phase 12.3 stays
 * the single source of truth for score math).
 */
export const YEARLY_CATEGORY_SOURCE: Record<YearlyScoreCategory, DailyScoreCategory> = {
  overall: "overall",
  career: "career",
  business: "business",
  finance: "finance",
  relationships: "love",
  marriage: "love",
  family: "family",
  health: "health",
  education: "education",
  travel: "travel",
  property: "finance",
  investments: "finance",
  spiritual: "spiritual",
  personalDevelopment: "spiritual",
  decisionMaking: "decision",
  communication: "communication",
  leadership: "confidence",
  productivity: "productivity",
};

/** Categories rolled into each Quarter timeline record. */
export const QUARTER_TREND_CATEGORIES = [
  "overall",
  "career",
  "finance",
  "relationships",
  "health",
  "travel",
  "business",
] as const;

/** Slugs of festivals surfaced in the annual calendar. Resolved lazily. */
export const YEARLY_FESTIVAL_SLUGS: readonly string[] = [
  "makar-sankranti",
  "maha-shivaratri",
  "holi",
  "ram-navami",
  "hanuman-jayanti",
  "guru-purnima",
  "raksha-bandhan",
  "janmashtami",
  "ganesh-chaturthi",
  "navratri",
  "dussehra",
  "diwali",
  "kartik-purnima",
] as const;
