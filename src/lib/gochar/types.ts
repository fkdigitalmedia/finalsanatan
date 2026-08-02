// ============================================================
// Gochar Engine — Types (Phase 13.2)
// ------------------------------------------------------------
// Structural contracts for the transit-influence engine. No
// runtime code lives here. Consumed by comparison / calculator /
// engine only.
// ============================================================

import type { BirthInput } from "@/lib/kundli/types";
import type { TransitPlanetName } from "@/lib/transit/types";

export type GocharVerdict = "positive" | "neutral" | "sensitive";

export interface GocharInput {
  birth: BirthInput;
  /** YYYY-MM-DD in birth tz. Defaults to today. */
  currentDate?: string;
  language?: string;
  /** Restrict to a subset of planets. Defaults to all 9. */
  planets?: TransitPlanetName[];
  /** Attach current Vimshottari MD/AD/PD lords to each planet. Default true. */
  includeDasha?: boolean;
}

export interface GocharValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

export interface NatalPlanetSnapshot {
  rashi: string;
  rashiIndex: number;
  nakshatra: string;
  nakshatraIndex: number;
  house: number;
  degreesInRashi: number;
  dignity: string;
  strengthScore: number;
  retrograde: boolean;
  longitudeSidereal: number;
}

export interface CurrentTransitSnapshot {
  rashi: string;
  rashiIndex: number;
  nakshatra: string;
  nakshatraIndex: number;
  degreesInRashi: number;
  longitudeSidereal: number;
  speed: number;
  retrograde: boolean;
  signEntry: string | null;
  nextSignChange: string | null;
}

/** A ±window around a transit event that raises volatility. */
export interface SensitivePeriod {
  reason: "sign-change" | "retrograde" | "combustion" | "gochara-adverse";
  startISO: string;
  endISO: string;
  detail?: string;
}

export interface GocharPlanetInfluence {
  planet: TransitPlanetName;
  natal: NatalPlanetSnapshot;
  current: CurrentTransitSnapshot;

  /** Houses relative to natal reference points. */
  transitHouseFromLagna: number; // 1..12
  transitHouseFromNatalMoon: number; // 1..12
  transitHouseFromNatalPlanet: number; // 1..12

  /** Whether the transit sign matches the natal sign. */
  signChangedSinceBirth: boolean;
  degreesTravelledSinceBirth: number;

  /** Classical gochara / kendra-trikona flags. */
  beneficFromLagna: boolean;
  beneficFromMoon: boolean;

  /** Composite 0..100 influence score + confidence 0..1. */
  influenceScore: number;
  confidence: number;

  /** Derived transit strength delta (natal reference = 0). */
  strengthDelta: number;

  /** Positive / neutral / sensitive summary of this planet's transit. */
  verdict: GocharVerdict;

  /** ISO windows where this planet's influence spikes. */
  sensitivePeriods: SensitivePeriod[];

  /** Human-labelled affected areas (English keys). */
  affectedAreas: string[];

  /** Dasha overlay: is this planet a current MD/AD/PD lord? */
  dashaActive: {
    mahadasha: boolean;
    antardasha: boolean;
    pratyantar: boolean;
  };
}

export interface GocharSummary {
  overallScore: number; // average influenceScore 0..100
  verdict: GocharVerdict; // rolled-up verdict
  positivePlanets: TransitPlanetName[];
  neutralPlanets: TransitPlanetName[];
  sensitivePlanets: TransitPlanetName[];
  strongestInfluence: TransitPlanetName | null;
  weakestInfluence: TransitPlanetName | null;
  activeDashaLords: TransitPlanetName[];
}

export interface GocharMetadata {
  calculationTimestamp: string;
  engineVersion: string;
  dataSource: string;
  calculationDurationMs: number;
  timezone: string | number;
  language: string;
  cacheHits: number;
  planetCount: number;
}

export interface GocharOutput {
  profile: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string | number;
    currentDate: string;
    language: string;
  };
  influences: GocharPlanetInfluence[];
  summary: GocharSummary;
  metadata: GocharMetadata;
}
