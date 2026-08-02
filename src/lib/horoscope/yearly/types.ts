// ============================================================
// Yearly Horoscope Engine — Types
// ------------------------------------------------------------
// Structural contracts only. No prose, no AI, no HTML.
// ============================================================

import type { RashiKey } from "../types";
import type { DailyScoreCategory } from "../daily/types";
import type { MonthlyHoroscopeOutput, MonthlyPlanetRetrograde } from "../monthly/types";
import type { TrendResult } from "../trend";

/** Yearly category vocabulary (see constants.ts). */
export type YearlyScoreCategory =
  | "overall"
  | "career"
  | "business"
  | "finance"
  | "relationships"
  | "marriage"
  | "family"
  | "health"
  | "education"
  | "travel"
  | "property"
  | "investments"
  | "spiritual"
  | "personalDevelopment"
  | "decisionMaking"
  | "communication"
  | "leadership"
  | "productivity";

export interface YearlyHoroscopeInput {
  /** Full calendar year, e.g. 2026. */
  year: number;
  rashi: RashiKey;
  timezone?: string | number;
  language?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
}

export interface YearlyValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

/** Normalized 0..100 score with provenance. */
export interface YearlyScoreEntry {
  score: number; // 0..100
  confidence: number; // 0..1
  source: string; // human-readable calculation source
  min: number;
  max: number;
}

export type YearlyScores = Record<YearlyScoreCategory, YearlyScoreEntry>;
export type YearlyTrends = Record<YearlyScoreCategory, TrendResult>;

export interface YearlyQuarter {
  quarter: 1 | 2 | 3 | 4;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  months: number[]; // 1..12
  averageScore: number; // overall
  trends: {
    overall: TrendResult;
    career: TrendResult;
    finance: TrendResult;
    relationships: TrendResult;
    health: TrendResult;
    travel: TrendResult;
    business: TrendResult;
  };
  bestMonth: number | null; // 1..12
  toughestMonth: number | null;
}

export interface YearlyMonthSummary {
  month: number; // 1..12
  averageScore: number;
  trend: TrendResult;
  peakDay: string | null; // YYYY-MM-DD
  lowDay: string | null;
  bestWeek: { startDate: string; endDate: string; averageScore: number } | null;
  mostSensitiveWeek: { startDate: string; endDate: string; averageScore: number } | null;
}

export interface YearlyPlanetEvent {
  planet: string;
  type:
    "sign-change" | "retrograde-start" | "retrograde-end" | "retrograde-window" | "major-transit";
  fromSign?: string;
  toSign?: string;
  when?: string; // ISO instant
  startDate?: string; // YYYY-MM-DD (retrograde-window)
  endDate?: string; // YYYY-MM-DD (retrograde-window)
  daysRetrograde?: number;
}

export interface YearlyFestival {
  slug: string;
  name: string;
  isoDate: string; // YYYY-MM-DD local
  timestamp: string; // ISO
  monthIndex: number; // 1..12
  quarter: 1 | 2 | 3 | 4;
  panchang?: {
    tithiIndex?: number;
    tithiName?: string;
    paksha?: "Shukla" | "Krishna";
    nakshatra?: string;
  };
  window?: { start: string; end: string };
}

export interface YearlyLuckyFactors {
  luckyMonths: number[]; // 1..12
  luckyDates: string[]; // YYYY-MM-DD
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDirection: string;
  favorableTimeWindows: Array<{ month: number; window: string }>;
  highOpportunityPeriods: Array<{ startDate: string; endDate: string; averageScore: number }>;
  cautionPeriods: Array<{ startDate: string; endDate: string; averageScore: number }>;
}

export interface YearlyPanchangSummary {
  ekadashiCount: number;
  purnimaCount: number;
  amavasyaCount: number;
  sankashtiCount: number;
  auspiciousYogasCount: number;
  inauspiciousYogasCount: number;
  ekadashiDates: string[];
  purnimaDates: string[];
  amavasyaDates: string[];
}

export interface YearlyOverview {
  trend: TrendResult;
  averageScore: number;
  peakMonth: { month: number; averageScore: number } | null;
  lowMonth: { month: number; averageScore: number } | null;
  peakDay: { date: string; score: number } | null;
  lowDay: { date: string; score: number } | null;
}

export interface YearlyMetadata {
  calculationTimestamp: string;
  timezone: string | number;
  engineVersion: string;
  language: string;
  dataSource: string;
  calculationDurationMs: number;
  monthsComputed: number;
  weeksComputed: number;
  daysComputed: number;
  festivalCount: number;
  eventCount: number;
}

export interface YearlyHoroscopeOutput {
  year: number;
  rashi: RashiKey;
  overview: YearlyOverview;
  scores: YearlyScores;
  trends: YearlyTrends;
  quarters: YearlyQuarter[]; // length 4
  months: YearlyMonthSummary[]; // length 12
  planetaryEvents: YearlyPlanetEvent[];
  planetRetrogrades: MonthlyPlanetRetrograde[];
  festivals: YearlyFestival[];
  panchangSummary: YearlyPanchangSummary;
  luckyFactors: YearlyLuckyFactors;
  /** Machine-readable opportunity/challenge labels rolled up from monthly. */
  opportunities: string[];
  challenges: string[];
  /** Category-source map so consumers know which daily bucket fed each yearly category. */
  categorySources: Record<YearlyScoreCategory, DailyScoreCategory>;
  monthly: MonthlyHoroscopeOutput[]; // raw monthly payloads for downstream callers
  metadata: YearlyMetadata;
}
