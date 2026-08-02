// ============================================================
// Sade Sati & Dhaiya Engine — Types (Phase 13.3)
// ------------------------------------------------------------
// Structural contracts only. Backend-only, JSON-only module.
// ============================================================

import type { BirthInput, Rashi } from "@/lib/kundli/types";

export interface SadeSatiInput {
  birth: BirthInput;
  /** YYYY-MM-DD. Defaults to "today" in the birth timezone. */
  currentDate?: string;
  language?: string;
  /** Search window (years) used to locate cycles. Default 40. */
  windowYears?: number;
}

export interface SadeSatiValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

/** A contiguous stay of Saturn inside one rashi. */
export interface SaturnOccupancy {
  rashiIndex: number;
  rashi: Rashi;
  startISO: string;
  endISO: string;
  durationDays: number;
}

export type SadeSatiPhaseKey = "first" | "second" | "third";

export interface SadeSatiPhase {
  key: SadeSatiPhaseKey;
  /** 12 (Rising), 1 (Peak), 2 (Setting) — house from natal Moon. */
  houseFromMoon: 12 | 1 | 2;
  label: string;
  rashiIndex: number;
  rashi: Rashi;
  startISO: string;
  endISO: string;
  durationDays: number;
  intensity: "moderate" | "peak" | "waning";
  status: "past" | "active" | "upcoming";
  description: string;
}

export interface SadeSatiCycle {
  startISO: string;
  endISO: string;
  durationDays: number;
  phases: SadeSatiPhase[];
  status: "past" | "active" | "upcoming";
}

export interface RemainingDuration {
  days: number;
  months: number;
  years: number;
  humanized: string;
}

export interface SadeSatiStatus {
  active: boolean;
  currentPhase: SadeSatiPhase | null;
  startISO: string | null;
  endISO: string | null;
  elapsedDays: number;
  remainingDays: number;
  remaining: RemainingDuration | null;
  progress: number; // 0..1 across the whole cycle
  intensityScore: number; // 0..100 (higher = more challenging)
}

export type DhaiyaKind = "kantaka" | "ashtama";

export interface DhaiyaPeriod {
  kind: DhaiyaKind;
  label: string;
  houseFromMoon: 4 | 8;
  rashiIndex: number;
  rashi: Rashi;
  startISO: string;
  endISO: string;
  durationDays: number;
  status: "past" | "active" | "upcoming";
}

export interface DhaiyaStatus {
  active: boolean;
  current: DhaiyaPeriod | null;
  remainingDays: number;
  remaining: RemainingDuration | null;
  progress: number;
  next: DhaiyaPeriod | null;
  previous: DhaiyaPeriod | null;
}

export interface SaturnTransitSummary {
  siderealLongitude: number;
  rashiIndex: number;
  rashi: Rashi;
  degreesInRashi: number;
  retrograde: boolean;
  dailySpeed: number;
  houseFromMoon: number;
  houseFromLagna: number;
  natalRashiIndex: number;
  natalRashi: Rashi;
  currentSignStartISO: string | null;
  currentSignEndISO: string | null;
  nextSignRashiIndex: number;
  nextSignRashi: Rashi;
  daysUntilNextSign: number | null;
}

export interface SadeSatiMetadata {
  calculationTimestamp: string;
  engineVersion: string;
  dataSource: string;
  calculationDurationMs: number;
  timezone: string | number;
  language: string;
  windowYears: number;
  occupanciesScanned: number;
  cacheHits: number;
}

export interface SadeSatiOutput {
  profile: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string | number;
    currentDate: string;
    language: string;
    moonRashiIndex: number;
    moonRashi: Rashi;
    lagnaRashiIndex: number;
    lagnaRashi: Rashi;
  };
  sadeSati: SadeSatiStatus;
  phases: {
    first: SadeSatiPhase | null;
    second: SadeSatiPhase | null;
    third: SadeSatiPhase | null;
  };
  cycles: SadeSatiCycle[];
  previousCycle: SadeSatiCycle | null;
  currentCycle: SadeSatiCycle | null;
  nextCycle: SadeSatiCycle | null;
  dhaiya: DhaiyaStatus;
  dhaiyaPeriods: DhaiyaPeriod[];
  saturnTransit: SaturnTransitSummary;
  metadata: SadeSatiMetadata;
}
