// ============================================================
// Weekly Horoscope Engine — Calculator
// ------------------------------------------------------------
// Wraps the Daily Engine over a 7-day window and aggregates
// per-category trends + score bands. No AI, no prose.
// ============================================================

import { DAILY_SCORE_CATEGORIES } from "../daily/constants";
import type { DailyHoroscopeInput, DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import { DailyHoroscopeEngine } from "../daily/engine";
import { classifyTrendMap, type TrendResult } from "../trend";
import { enumerateDates } from "./helpers";
import type { DayScoreSample, WeeklyHoroscopeInput } from "./types";

export interface WeeklyRawAggregate {
  days: DailyHoroscopeOutput[];
  dailyScores: DayScoreSample[];
  trends: Record<DailyScoreCategory, TrendResult>;
  scoreBands: Record<DailyScoreCategory, { average: number; min: number; max: number }>;
  favorableDays: string[];
  cautionDays: string[];
}

const FAVORABLE_THRESHOLD = 68;
const CAUTION_THRESHOLD = 45;

/** Run the daily engine for each date in the inclusive window. */
export function runDailyWindow(
  daily: DailyHoroscopeEngine,
  input: WeeklyHoroscopeInput,
  endDate: string,
): DailyHoroscopeOutput[] {
  const dates = enumerateDates(input.startDate, endDate);
  const base: Omit<DailyHoroscopeInput, "date"> = {
    rashi: input.rashi,
    timezone: input.timezone,
    language: input.language,
    latitude: input.latitude,
    longitude: input.longitude,
    location: input.location,
  };
  return dates.map((date) => daily.generate({ ...base, date }));
}

/** Aggregate per-day payloads into weekly trend + band metrics. */
export function aggregateWeekly(days: DailyHoroscopeOutput[]): WeeklyRawAggregate {
  const seriesByCategory = {} as Record<DailyScoreCategory, number[]>;
  for (const cat of DAILY_SCORE_CATEGORIES) seriesByCategory[cat] = [];
  const dailyScores: DayScoreSample[] = [];

  for (const day of days) {
    for (const cat of DAILY_SCORE_CATEGORIES) {
      seriesByCategory[cat].push(day.scores[cat].score);
    }
    dailyScores.push({
      date: day.date,
      score: day.scores.overall.score,
      confidence: day.scores.overall.confidence,
    });
  }

  const trends = classifyTrendMap(seriesByCategory);
  const scoreBands = {} as WeeklyRawAggregate["scoreBands"];
  for (const cat of DAILY_SCORE_CATEGORIES) {
    const s = seriesByCategory[cat];
    scoreBands[cat] = {
      average: trends[cat].average,
      min: s.length ? Math.min(...s) : 0,
      max: s.length ? Math.max(...s) : 0,
    };
  }

  const favorableDays = dailyScores
    .filter((d) => d.score >= FAVORABLE_THRESHOLD)
    .map((d) => d.date);
  const cautionDays = dailyScores.filter((d) => d.score <= CAUTION_THRESHOLD).map((d) => d.date);

  return { days, dailyScores, trends, scoreBands, favorableDays, cautionDays };
}
