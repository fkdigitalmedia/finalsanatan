// ============================================================
// Dasha Engine — Types (Phase 13.1)
// ------------------------------------------------------------
// Structural contracts only. No astronomy, no I/O. Pluggable
// system registry so Yogini / Kalachakra / Ashtottari / Char
// can slot in without touching this file's callers.
// ============================================================

import type { BirthInput, GrahaName, KundliResult } from "@/lib/kundli/types";

/** Machine key for a supported dasha system. */
export type DashaSystemKey = "vimshottari" | "yogini" | "kalachakra" | "ashtottari" | "char";

export interface DashaInput {
  birth: BirthInput;
  /** YYYY-MM-DD in caller tz. Defaults to "today". */
  currentDate?: string;
  /** Dasha system to run. Defaults to "vimshottari". */
  system?: DashaSystemKey;
  language?: string;
}

export interface DashaValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

export interface DashaSubPeriod {
  lord: GrahaName;
  startISO: string;
  endISO: string;
  durationDays: number;
}

export interface AntardashaEntry extends DashaSubPeriod {
  pratyantardashas?: DashaSubPeriod[];
}

export interface MahadashaEntry {
  lord: GrahaName;
  startISO: string;
  endISO: string;
  years: number;
  durationDays: number;
  antardashas: AntardashaEntry[];
}

export interface CurrentPeriod {
  lord: GrahaName;
  startISO: string;
  endISO: string;
  /** Total lifespan of this period in days. */
  durationDays: number;
  /** How many days have already elapsed. */
  elapsedDays: number;
  /** How many days remain. */
  remainingDays: number;
  /** 0..1 completion ratio. */
  progress: number;
}

export interface NeighbourPeriod {
  lord: GrahaName;
  startISO: string;
  endISO: string;
  years: number;
}

export interface DashaBalanceAtBirth {
  lord: GrahaName;
  yearsRemaining: number;
  daysRemaining: number;
}

export interface DashaMetadata {
  calculationTimestamp: string;
  timezone: string | number;
  language: string;
  engineVersion: string;
  dataSource: string;
  calculationDurationMs: number;
  system: DashaSystemKey;
  cacheHits: number;
}

export interface DashaOutput {
  profile: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string | number;
    currentDate: string;
    language: string;
    system: DashaSystemKey;
  };
  balanceAtBirth: DashaBalanceAtBirth;
  currentMahadasha: CurrentPeriod | null;
  currentAntardasha: CurrentPeriod | null;
  currentPratyantar: CurrentPeriod | null;
  previousMahadasha: NeighbourPeriod | null;
  nextMahadasha: NeighbourPeriod | null;
  timeline: MahadashaEntry[];
  metadata: DashaMetadata;
}

// ------------------------------------------------------------
// Pluggable system interface
// ------------------------------------------------------------

export interface DashaSystemContext {
  natal: KundliResult;
  birthUtc: Date;
  currentUtc: Date;
}

export interface DashaSystemComputation {
  balanceAtBirth: DashaBalanceAtBirth;
  timeline: MahadashaEntry[];
}

/**
 * Contract every dasha system must satisfy. `compute()` returns
 * the raw timeline + birth balance; the shared calculator layer
 * derives current/previous/next + progress from it, so a new
 * system only implements the classical math.
 */
export interface DashaSystem {
  key: DashaSystemKey;
  totalYears: number;
  compute(ctx: DashaSystemContext): DashaSystemComputation;
}
