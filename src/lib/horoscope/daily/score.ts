// ============================================================
// Daily Horoscope Engine — Scoring
// ------------------------------------------------------------
// Deterministic 0..100 scoring per DailyScoreCategory. Every
// score has a confidence estimate + provenance string.
// ============================================================

import { CATEGORY_WEIGHTS, DAILY_SCORE_CATEGORIES, GOCHARA_BENEFIC_HOUSES } from "./constants";
import { houseFromNatal, normalizeScore, rashiIndexFromKey } from "./helpers";
import type { RashiKey } from "../types";
import type { PlanetTransit } from "@/lib/transit/types";
import type { DailyScoreCategory, DailyScores, ScoreEntry } from "./types";

/**
 * Per-planet base contribution (0..100) from a chandra-gochara
 * house evaluation, softened by retrograde motion of natural
 * malefics vs benefics.
 */
export function planetBaseScore(planet: PlanetTransit, natalRashiIndex: number): number {
  const benefic = GOCHARA_BENEFIC_HOUSES[planet.name] ?? [];
  const house = houseFromNatal(planet.rashiIndex, natalRashiIndex);
  const inBenefic = benefic.includes(house);
  let base = inBenefic ? 75 : 40;

  // Malefic houses (4, 8, 12) further reduce non-benefic-house scores.
  if (!inBenefic && [4, 8, 12].includes(house)) base -= 10;

  // Retrograde modifiers.
  const isBenefic = ["Jupiter", "Venus", "Mercury", "Moon"].includes(planet.name);
  if (planet.retrograde) base += isBenefic ? -6 : +4;

  return normalizeScore(base);
}

/** Weighted mean of per-planet base scores using CATEGORY_WEIGHTS. */
export function categoryScore(
  category: DailyScoreCategory,
  planetScores: Record<string, number>,
): number {
  const weights = CATEGORY_WEIGHTS[category];
  let num = 0;
  let den = 0;
  for (const [planet, w] of Object.entries(weights)) {
    const s = planetScores[planet];
    if (s === undefined) continue;
    num += s * w;
    den += w;
  }
  return normalizeScore(den > 0 ? num / den : 50);
}

/**
 * Confidence proxy: how many of the requested planets contributed
 * to this category. 1.0 when every weighted planet had data.
 */
export function categoryConfidence(
  category: DailyScoreCategory,
  planetScores: Record<string, number>,
): number {
  const weights = CATEGORY_WEIGHTS[category];
  const total = Object.keys(weights).length;
  if (total === 0) return 0;
  let hit = 0;
  for (const p of Object.keys(weights)) if (planetScores[p] !== undefined) hit++;
  return Math.round((hit / total) * 100) / 100;
}

/** Compute the full DailyScores map. */
export function computeDailyScores(
  planets: PlanetTransit[],
  rashi: RashiKey,
  now: string,
): DailyScores {
  const natalIndex = rashiIndexFromKey(rashi);
  const planetScores: Record<string, number> = {};
  for (const p of planets) planetScores[p.name] = planetBaseScore(p, natalIndex);

  const scores: Partial<DailyScores> = {};
  for (const category of DAILY_SCORE_CATEGORIES) {
    const entry: ScoreEntry = {
      score: categoryScore(category, planetScores),
      confidence: categoryConfidence(category, planetScores),
      source: `chandra-gochara+weights[${category}]`,
      updatedAt: now,
    };
    scores[category] = entry;
  }
  return scores as DailyScores;
}
