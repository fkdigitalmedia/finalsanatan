// ============================================================
// Personalized Horoscope Engine — Types (Phase 12.6)
// ------------------------------------------------------------
// Structural contracts only. No prose, no AI, no HTML.
// The personalized engine consumes an actual birth chart
// (Kundli) plus the current instant and produces structured
// JSON blending natal strength with live transits.
// ============================================================

import type { BirthInput, KundliChart, PlanetChartPosition } from "@/lib/kundli/types";
import type { PlanetTransit } from "@/lib/transit/types";
import type { DailyHoroscopeOutput, DailyScoreCategory, LuckyFactors } from "../daily/types";
import type { WeeklyHoroscopeOutput } from "../weekly/types";
import type { MonthlyHoroscopeOutput } from "../monthly/types";
import type { YearlyHoroscopeOutput } from "../yearly/types";
import type { TrendResult } from "../trend";
import type { RashiKey } from "../types";

/** Which horizon the personalized payload is centred on. */
export type PersonalizedPeriod = "daily" | "weekly" | "monthly" | "yearly";

/** 20 structured personalized life-domain categories. */
export type PersonalizedScoreCategory =
  | "overallEnergy"
  | "career"
  | "business"
  | "finance"
  | "love"
  | "marriage"
  | "relationships"
  | "family"
  | "health"
  | "education"
  | "travel"
  | "property"
  | "investments"
  | "creativity"
  | "leadership"
  | "communication"
  | "productivity"
  | "decisionMaking"
  | "mentalWellness"
  | "spiritualGrowth";

export interface PersonalizedScoreEntry {
  score: number; // 0..100
  confidence: number; // 0..1
  source: string; // provenance string ("natal+transit(...)")
  natal: number; // 0..100 — natal contribution
  transit: number; // 0..100 — transit contribution
  updatedAt: string; // ISO instant
}

export type PersonalizedScores = Record<PersonalizedScoreCategory, PersonalizedScoreEntry>;

export interface PersonalizedInput {
  /** All natal fields (date, time, place, lat/lon, timezone, language). */
  birth: BirthInput;
  /** Optional YYYY-MM-DD in caller timezone. Defaults to "today". */
  currentDate?: string;
  /** Period the timeline focuses on. Defaults to "daily". */
  period?: PersonalizedPeriod;
  /** Optional language override (falls back to birth.language / "en"). */
  language?: string;
}

export interface PersonalizedValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

// ------------------------------------------------------------
// Birth-chart snapshot exposed with the payload
// ------------------------------------------------------------
export interface BirthChartSnapshot {
  ascendant: {
    rashi: string;
    rashiIndex: number;
    degreesInRashi: number;
    nakshatra: string;
    pada: 1 | 2 | 3 | 4;
  };
  moonSign: string;
  moonRashiKey: RashiKey;
  sunSign: string;
  sunRashiKey: RashiKey;
  birthNakshatra: {
    nakshatra: string;
    pada: 1 | 2 | 3 | 4;
    lord: string;
  };
  planets: Array<{
    graha: string;
    rashi: string;
    rashiIndex: number;
    house: number;
    degreesInRashi: number;
    nakshatra: string;
    pada: 1 | 2 | 3 | 4;
    retrograde: boolean;
    dignity: PlanetChartPosition["dignity"];
    strengthScore: number;
    longitudeSidereal: number;
  }>;
}

// ------------------------------------------------------------
// Transit snapshot exposed with the payload
// ------------------------------------------------------------
export interface CurrentTransitSnapshot {
  referenceInstant: string;
  ayanamsaDegrees: number;
  planets: PlanetTransit[];
}

// ------------------------------------------------------------
// Comparison / planet influence
// ------------------------------------------------------------
export interface PlanetComparison {
  planet: string;
  natal: {
    rashi: string;
    rashiIndex: number;
    house: number; // house from lagna at birth
    degreesInRashi: number;
    dignity: PlanetChartPosition["dignity"];
    strengthScore: number; // 0..1
    retrograde: boolean;
    longitudeSidereal: number;
  };
  current: {
    rashi: string;
    rashiIndex: number;
    degreesInRashi: number;
    retrograde: boolean;
    speed: number; // deg / day
    longitudeSidereal: number;
    nextSignChange: string | null;
    signEntry: string | null;
  };
  transitHouseFromLagna: number; // 1..12
  transitHouseFromNatalMoon: number; // Chandra gochara (1..12)
  transitHouseFromNatalPlanet: number; // 1..12 (natal-planet relative)
  signChangedSinceBirth: boolean;
  degreesTravelledSinceBirth: number; // absolute degrees along the ecliptic
  strengthDelta: number; // (transit-house benefic ? +1 : -1) * magnitude
}

export interface PlanetInfluenceEntry {
  planet: string;
  influenceScore: number; // 0..100
  confidence: number; // 0..1
  affectedAreas: PersonalizedScoreCategory[];
  planetStatus: {
    retrograde: boolean;
    dignity: PlanetChartPosition["dignity"];
    beneficHouse: boolean; // whether current gochara house is benefic
    transitHouseFromLagna: number;
    transitHouseFromMoon: number;
    natalStrength: number; // 0..100 (from Shadbala-derived strengthScore)
  };
  notes: string; // machine-readable label, never a sentence
}

export type PlanetInfluenceMap = Record<string, PlanetInfluenceEntry>;

// ------------------------------------------------------------
// Timeline
// ------------------------------------------------------------
export interface PersonalizedTimelineHighlight {
  key: string; // machine label ("moon-benefic-house", "jupiter-retrograde")
  planet?: string;
  when?: string; // ISO
  score?: number;
  meta?: Record<string, string | number | boolean>;
}

export interface PersonalizedTimeline {
  todayHighlights: PersonalizedTimelineHighlight[];
  thisWeek: {
    startDate: string;
    endDate: string;
    trend: TrendResult;
    averageScore: number;
    favorableDays: string[];
    cautionDays: string[];
  } | null;
  thisMonth: {
    year: number;
    month: number;
    trend: TrendResult;
    averageScore: number;
    peakDay: string | null;
    lowDay: string | null;
    bestWeek: { startDate: string; endDate: string; averageScore: number } | null;
  } | null;
  thisYear: {
    year: number;
    trend: TrendResult;
    averageScore: number;
    peakMonth: number | null;
    lowMonth: number | null;
  } | null;
  upcomingPlanetChanges: Array<{
    planet: string;
    from: string;
    to: string;
    when: string;
  }>;
  importantPanchangDays: {
    ekadashi: string[];
    purnima: string[];
    amavasya: string[];
  };
}

// ------------------------------------------------------------
// Metadata + Output
// ------------------------------------------------------------
export interface PersonalizedMetadata {
  calculationTimestamp: string;
  timezone: string | number;
  engineVersion: string;
  language: string;
  dataSource: string;
  calculationDurationMs: number;
  period: PersonalizedPeriod;
  cacheHits: number;
}

export interface PersonalizedHoroscopeOutput {
  profile: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string | number;
    language: string;
    currentDate: string;
    period: PersonalizedPeriod;
    moonRashiKey: RashiKey;
    sunRashiKey: RashiKey;
    ascendantRashi: string;
  };
  birthChart: BirthChartSnapshot;
  transits: CurrentTransitSnapshot;
  comparison: PlanetComparison[];
  planetInfluence: PlanetInfluenceMap;
  scores: PersonalizedScores;
  timeline: PersonalizedTimeline;
  luckyFactors: LuckyFactors;
  /** Raw underlying payloads exposed for downstream consumers. */
  raw?: {
    daily?: DailyHoroscopeOutput;
    weekly?: WeeklyHoroscopeOutput;
    monthly?: MonthlyHoroscopeOutput;
    yearly?: YearlyHoroscopeOutput;
  };
  metadata: PersonalizedMetadata;
}

/** Category-source mapping so consumers know which daily bucket feeds each personalized category. */
export type PersonalizedCategorySource = Record<PersonalizedScoreCategory, DailyScoreCategory>;

/** Convenience — internal composition context passed between calculator helpers. */
export interface PersonalizedContext {
  input: PersonalizedInput;
  currentDateIso: string;
  natalChart: KundliChart;
  moonRashiKey: RashiKey;
  sunRashiKey: RashiKey;
}
