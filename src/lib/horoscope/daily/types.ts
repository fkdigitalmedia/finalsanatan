// ============================================================
// Daily Horoscope Engine — Types
// ------------------------------------------------------------
// Phase 12.3 — structural contracts only. No astrological text
// or AI is produced here; downstream phases consume this JSON.
// ============================================================

import type { RashiKey } from "../types";
import type { PlanetTransit, PlanetMetadata } from "@/lib/transit/types";

export type DailyScoreCategory =
  | "overall"
  | "career"
  | "business"
  | "finance"
  | "love"
  | "family"
  | "education"
  | "travel"
  | "health"
  | "spiritual"
  | "social"
  | "productivity"
  | "decision"
  | "communication"
  | "confidence";

/** Input contract for DailyHoroscopeEngine.generate(). */
export interface DailyHoroscopeInput {
  /** YYYY-MM-DD in the caller-supplied timezone. Defaults to "today". */
  date?: string;
  /** Required — general (rashi-based) mode only for Phase 12.3. */
  rashi: RashiKey;
  /** IANA timezone name or fixed hour offset. */
  timezone?: string | number;
  language?: string;
  /** Optional geo used for sunrise/sunset + Panchang tuning. */
  latitude?: number;
  longitude?: number;
  location?: string;
}

/** Normalized 0..100 score with provenance. */
export interface ScoreEntry {
  score: number; // 0..100
  confidence: number; // 0..1
  source: string; // human-readable calculation source
  updatedAt: string; // ISO instant
}

export type DailyScores = Record<DailyScoreCategory, ScoreEntry>;

/** Panchang summary surfaced with the daily payload. */
export interface DailyPanchangSummary {
  tithi: { index: number; name: string; paksha: "Shukla" | "Krishna"; percent: number };
  nakshatra: { index: number; name: string; pada: number; lord: string };
  yoga: { index: number; name: string };
  karana: { index: number; name: string };
  sunrise: string | null; // ISO
  sunset: string | null; // ISO
  moonPhase: "Waxing" | "Waning" | "New" | "Full";
  paksha: "Shukla" | "Krishna";
}

/** Moon-centric snapshot (drives most daily scoring). */
export interface MoonStatus {
  rashi: string;
  rashiIndex: number;
  nakshatra: string;
  pada: 1 | 2 | 3 | 4;
  degreesInRashi: number;
  /** House index (1..12) from the caller's natal rashi (Chandra gochara). */
  houseFromNatal: number;
  /** Whether the current placement is broadly favorable per gochara. */
  favorable: boolean;
}

export interface DailyPlanetaryInfluence {
  /** Compact per-planet metadata (rashi + retrograde flag). */
  summary: PlanetMetadata[];
  /** Full transit records for the target instant. */
  detailed: PlanetTransit[];
  /** Planets currently in retrograde motion. */
  retrograde: string[];
  /** Planets ingressing into a new sign within ±3 days of `date`. */
  imminentSignChanges: Array<{ planet: string; from: string; to: string; when: string }>;
}

export interface LuckyFactors {
  number: number;
  color: string;
  direction: string;
  /** Local time window (ISO instants) considered auspicious for the day. */
  timeWindow: { start: string | null; end: string | null; label: string };
  favorableActivities: string[];
  activitiesToAvoid: string[];
}

export interface DailyMetadata {
  calculationTimestamp: string; // ISO instant
  timezone: string | number;
  engineVersion: string;
  language: string;
  dataSource: string;
  calculationDurationMs: number;
}

/** Output contract for DailyHoroscopeEngine.generate(). */
export interface DailyHoroscopeOutput {
  date: string; // YYYY-MM-DD (caller-tz local date)
  rashi: RashiKey;
  planetaryInfluence: DailyPlanetaryInfluence;
  moonStatus: MoonStatus;
  transits: {
    referenceInstant: string; // ISO
    ayanamsaDegrees: number;
    planetCount: number;
  };
  panchang: DailyPanchangSummary;
  luckyFactors: LuckyFactors;
  scores: DailyScores;
  metadata: DailyMetadata;
}

export interface DailyValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}
