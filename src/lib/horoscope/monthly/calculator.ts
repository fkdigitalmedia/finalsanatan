// ============================================================
// Monthly Horoscope Engine — Calculator
// ------------------------------------------------------------
// Composes weekly aggregates + daily series into a monthly
// rollup. Never touches the ephemeris directly.
// ============================================================

import { DAILY_SCORE_CATEGORIES } from "../daily/constants";
import type { DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import { WeeklyHoroscopeEngine } from "../weekly/engine";
import type { WeeklyHoroscopeInput, WeeklyHoroscopeOutput } from "../weekly/types";
import { classifyTrend, classifyTrendMap, type TrendResult } from "../trend";
import { chunkWeeks, monthBounds } from "./helpers";
import type { MonthlyHoroscopeInput } from "./types";

export interface MonthlyRawAggregate {
  weeks: WeeklyHoroscopeOutput[];
  days: DailyHoroscopeOutput[];
  trends: Record<DailyScoreCategory, TrendResult>;
  overallTrend: TrendResult;
  scoreBands: Record<DailyScoreCategory, { average: number; min: number; max: number }>;
}

/** Run the weekly engine once per 7-day chunk inside the target month. */
export function runWeeklyWindow(
  weekly: WeeklyHoroscopeEngine,
  input: MonthlyHoroscopeInput,
): WeeklyHoroscopeOutput[] {
  const { start, end } = monthBounds(input.year, input.month);
  const chunks = chunkWeeks(start, end);
  return chunks.map((c) => {
    const wIn: WeeklyHoroscopeInput = {
      startDate: c.start,
      endDate: c.end,
      rashi: input.rashi,
      timezone: input.timezone,
      language: input.language,
      latitude: input.latitude,
      longitude: input.longitude,
      location: input.location,
    };
    return weekly.generate(wIn);
  });
}

/** Aggregate a set of weekly payloads into monthly trends + bands. */
export function aggregateMonthly(weeks: WeeklyHoroscopeOutput[]): MonthlyRawAggregate {
  const days = weeks.flatMap((w) => w.days);
  const seriesByCategory = {} as Record<DailyScoreCategory, number[]>;
  for (const cat of DAILY_SCORE_CATEGORIES) seriesByCategory[cat] = [];
  for (const day of days) {
    for (const cat of DAILY_SCORE_CATEGORIES) seriesByCategory[cat].push(day.scores[cat].score);
  }
  const trends = classifyTrendMap(seriesByCategory);
  const scoreBands = {} as MonthlyRawAggregate["scoreBands"];
  for (const cat of DAILY_SCORE_CATEGORIES) {
    const s = seriesByCategory[cat];
    scoreBands[cat] = {
      average: trends[cat].average,
      min: s.length ? Math.min(...s) : 0,
      max: s.length ? Math.max(...s) : 0,
    };
  }
  const overallTrend = classifyTrend(seriesByCategory.overall);
  return { weeks, days, trends, overallTrend, scoreBands };
}
