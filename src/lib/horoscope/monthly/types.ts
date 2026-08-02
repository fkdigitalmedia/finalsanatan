// ============================================================
// Monthly Horoscope Engine — Types
// ============================================================

import type { RashiKey } from "../types";
import type { DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import type { TrendResult } from "../trend";
import type { DayScoreSample, WeeklyHoroscopeOutput, WeeklyPlanetHighlight } from "../weekly/types";

export interface MonthlyHoroscopeInput {
  /** Full calendar year, e.g. 2026. */
  year: number;
  /** 1..12. */
  month: number;
  rashi: RashiKey;
  timezone?: string | number;
  language?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
}

export type MonthlyTrends = Record<DailyScoreCategory, TrendResult>;

export interface MonthlyPlanetRetrograde {
  planet: string;
  starts?: string; // ISO — first observed day of retrograde
  ends?: string; // ISO — first observed day back direct
  daysRetrograde: number;
}

export interface MonthlyPanchangSummary {
  ekadashiDates: string[];
  purnimaDates: string[];
  amavasyaDates: string[];
  sankashtiDates: string[]; // Krishna Chaturthi (index 19 in tithi cycle)
  auspiciousYogasCount: number;
  inauspiciousYogasCount: number;
}

export interface MonthlyLuckyFactors {
  dates: string[]; // YYYY-MM-DD top-scoring dates
  numbers: number[];
  colors: string[];
  direction: string;
  bestWeek: { startDate: string; endDate: string; averageScore: number } | null;
}

export interface MonthlyBestWeek {
  startDate: string;
  endDate: string;
  averageScore: number;
}

export interface MonthlyMetadata {
  calculationTimestamp: string;
  timezone: string | number;
  engineVersion: string;
  language: string;
  dataSource: string;
  calculationDurationMs: number;
  daysComputed: number;
  weeksComputed: number;
}

export interface MonthlyHoroscopeOutput {
  year: number;
  month: number;
  rashi: RashiKey;
  overview: {
    trend: TrendResult; // overall category trend across the month
    averageScore: number;
    peakDay: DayScoreSample | null;
    lowDay: DayScoreSample | null;
  };
  trends: MonthlyTrends;
  scores: Record<DailyScoreCategory, { average: number; min: number; max: number }>;
  opportunities: string[];
  challenges: string[];
  bestWeek: MonthlyBestWeek | null;
  mostSensitiveWeek: MonthlyBestWeek | null;
  planetHighlights: WeeklyPlanetHighlight[];
  planetRetrogrades: MonthlyPlanetRetrograde[];
  panchangSummary: MonthlyPanchangSummary;
  luckyFactors: MonthlyLuckyFactors;
  dailyScores: DayScoreSample[];
  weeks: WeeklyHoroscopeOutput[];
  /** Raw per-day payloads for downstream callers. */
  days: DailyHoroscopeOutput[];
  metadata: MonthlyMetadata;
}

export interface MonthlyValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}
