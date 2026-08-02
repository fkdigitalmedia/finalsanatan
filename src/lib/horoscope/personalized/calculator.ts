// ============================================================
// Personalized Horoscope Engine — Score Calculator
// ------------------------------------------------------------
// Combines natal chart strength with the daily category scores
// (from the Daily Engine, computed for the natal Moon rashi) to
// yield 0..100 scores for the 20 personalized life domains.
// ============================================================

import type { DailyHoroscopeOutput } from "../daily/types";
import { CATEGORY_WEIGHTS } from "../daily/constants";
import {
  DIGNITY_BASE_SCORE,
  NATAL_TRANSIT_MIX,
  PERSONALIZED_CATEGORY_SOURCE,
  PERSONALIZED_SCORE_CATEGORIES,
} from "./constants";
import { clamp, round } from "./helpers";
import type {
  BirthChartSnapshot,
  PersonalizedScoreEntry,
  PersonalizedScores,
  PlanetInfluenceMap,
} from "./types";

/** Weighted natal contribution for a daily category using CATEGORY_WEIGHTS. */
function natalCategoryScore(
  category: string,
  natalPlanetScores: Record<string, number>,
): { score: number; confidence: number } {
  const weights = CATEGORY_WEIGHTS[category as keyof typeof CATEGORY_WEIGHTS];
  if (!weights) return { score: 50, confidence: 0 };
  let num = 0;
  let den = 0;
  let hit = 0;
  const total = Object.keys(weights).length;
  for (const [planet, w] of Object.entries(weights)) {
    const s = natalPlanetScores[planet];
    if (s === undefined) continue;
    num += s * w;
    den += w;
    hit++;
  }
  return {
    score: clamp(den > 0 ? num / den : 50, 0, 100),
    confidence: total > 0 ? hit / total : 0,
  };
}

/** Turn each natal planet into a 0..100 dignity+strength score. */
export function buildNatalPlanetScores(chart: BirthChartSnapshot): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of chart.planets) {
    const dignity = DIGNITY_BASE_SCORE[p.dignity] ?? 55;
    const combined = dignity * 0.6 + p.strengthScore * 100 * 0.4;
    out[p.graha] = clamp(combined, 0, 100);
  }
  return out;
}

/**
 * Compute personalized 20-category scores by blending daily
 * (transit-driven) scores with natal-chart-derived scores.
 */
export function computePersonalizedScores(
  daily: DailyHoroscopeOutput,
  chart: BirthChartSnapshot,
  planetInfluence: PlanetInfluenceMap,
  nowIso: string,
): PersonalizedScores {
  const natalPlanetScores = buildNatalPlanetScores(chart);
  const scores = {} as PersonalizedScores;

  for (const cat of PERSONALIZED_SCORE_CATEGORIES) {
    const source = PERSONALIZED_CATEGORY_SOURCE[cat];
    const transitEntry = daily.scores[source];
    const transitScore = transitEntry?.score ?? 50;
    const transitConf = transitEntry?.confidence ?? 0;

    const natal = natalCategoryScore(source, natalPlanetScores);
    const mix = NATAL_TRANSIT_MIX[cat];
    const combined = clamp(transitScore * mix.transit + natal.score * mix.natal, 0, 100);

    // Modest influence-driven adjustment: top-planet influence
    // nudges the score toward its influence value.
    const areaPlanets = Object.values(planetInfluence).filter((p) => p.affectedAreas.includes(cat));
    let inflAdj = 0;
    if (areaPlanets.length > 0) {
      const meanInfl = areaPlanets.reduce((s, p) => s + p.influenceScore, 0) / areaPlanets.length;
      inflAdj = (meanInfl - 50) * 0.15;
    }
    const finalScore = clamp(combined + inflAdj, 0, 100);

    const entry: PersonalizedScoreEntry = {
      score: round(finalScore, 0),
      confidence: clamp(round(transitConf * mix.transit + natal.confidence * mix.natal, 2), 0, 1),
      source: `natal(${round(natal.score, 0)})+transit.${source}(${round(transitScore, 0)})`,
      natal: round(natal.score, 0),
      transit: round(transitScore, 0),
      updatedAt: nowIso,
    };
    scores[cat] = entry;
  }

  return scores;
}
