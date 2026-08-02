// ============================================================
// Weekly Horoscope Engine — Types
// ============================================================

import type { RashiKey } from "../types";
import type { DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import type { TrendResult } from "../trend";

export interface WeeklyHoroscopeInput {
  /** YYYY-MM-DD. Required — inclusive week start (e.g. Monday). */
  startDate: string;
  /**
   * YYYY-MM-DD. Optional — inclusive week end. Defaults to
   * startDate + 6 days. Must be within 6..13 days of startDate.
   */
  endDate?: string;
  rashi: RashiKey;
  timezone?: string | number;
  language?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
}

export interface DayScoreSample {
  date: string; // YYYY-MM-DD
  score: number; // overall 0..100
  confidence: number; // 0..1
}

export type WeeklyTrends = Record<DailyScoreCategory, TrendResult>;

export interface WeeklyPlanetHighlight {
  planet: string;
  event: "sign-change" | "retrograde-start" | "retrograde-end" | "steady";
  fromSign?: string;
  toSign?: string;
  when?: string; // ISO
}

export interface WeeklyPanchangSummary {
  ekadashiDates: string[]; // YYYY-MM-DD
  purnimaDates: string[];
  amavasyaDates: string[];
  auspiciousYogasCount: number;
  inauspiciousYogasCount: number;
}

export interface WeeklyLuckyFactors {
  days: string[]; // YYYY-MM-DD list of top-scoring days
  numbers: number[];
  colors: string[];
  direction: string;
  timeRange: { start: string | null; end: string | null; label: string };
}

export interface WeeklyMetadata {
  calculationTimestamp: string;
  timezone: string | number;
  engineVersion: string;
  language: string;
  dataSource: string;
  calculationDurationMs: number;
  daysComputed: number;
}

export interface WeeklyHoroscopeOutput {
  startDate: string;
  endDate: string;
  rashi: RashiKey;
  trends: WeeklyTrends;
  scores: Record<DailyScoreCategory, { average: number; min: number; max: number }>;
  opportunities: string[]; // canonical labels, no prose
  challenges: string[]; // canonical labels, no prose
  favorableDays: string[]; // YYYY-MM-DD
  cautionDays: string[]; // YYYY-MM-DD
  planetHighlights: WeeklyPlanetHighlight[];
  panchangSummary: WeeklyPanchangSummary;
  luckyFactors: WeeklyLuckyFactors;
  dailyScores: DayScoreSample[];
  /** Raw per-day payloads — omit for lean callers. */
  days: DailyHoroscopeOutput[];
  metadata: WeeklyMetadata;
}

export interface WeeklyValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}
