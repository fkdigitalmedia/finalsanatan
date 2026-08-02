// ============================================================
// Yearly Horoscope Engine — Score aggregator
// ------------------------------------------------------------
// Rolls the 12 monthly payloads into a per-category yearly
// score band. Reuses daily/monthly numbers verbatim — this
// module never touches the ephemeris.
// ============================================================

import type { DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import { classifyTrend, classifyTrendMap, type TrendResult } from "../trend";
import type { MonthlyHoroscopeOutput } from "../monthly/types";
import { YEARLY_CATEGORY_SOURCE, YEARLY_SCORE_CATEGORIES } from "./constants";
import { avg, minMax, round2 } from "./helpers";
import type { YearlyScoreCategory, YearlyScoreEntry, YearlyScores, YearlyTrends } from "./types";

/** Collect the per-day score series for every daily category once. */
export function collectDailySeries(months: MonthlyHoroscopeOutput[]): {
  days: DailyHoroscopeOutput[];
  series: Record<DailyScoreCategory, number[]>;
} {
  const days: DailyHoroscopeOutput[] = months.flatMap((m) => m.days);
  const series = {} as Record<DailyScoreCategory, number[]>;
  const categories = Object.keys(months[0]?.scores ?? {}) as DailyScoreCategory[];
  for (const cat of categories) series[cat] = [];
  for (const day of days) {
    for (const cat of categories) series[cat].push(day.scores[cat].score);
  }
  return { days, series };
}

/** Build yearly {score,confidence,min,max,source} for every yearly category. */
export function computeYearlyScores(series: Record<DailyScoreCategory, number[]>): {
  scores: YearlyScores;
  trends: YearlyTrends;
} {
  const trendsByDaily = classifyTrendMap(series);
  const scores = {} as YearlyScores;
  const trends = {} as YearlyTrends;

  for (const cat of YEARLY_SCORE_CATEGORIES) {
    const source: DailyScoreCategory = YEARLY_CATEGORY_SOURCE[cat as YearlyScoreCategory];
    const values = series[source] ?? [];
    const [min, max] = minMax(values);
    const t: TrendResult = trendsByDaily[source] ?? classifyTrend(values);
    const entry: YearlyScoreEntry = {
      score: Math.round(avg(values)),
      confidence: round2(t.confidence),
      source: `daily.${source}`,
      min,
      max,
    };
    scores[cat as YearlyScoreCategory] = entry;
    trends[cat as YearlyScoreCategory] = t;
  }
  return { scores, trends };
}
