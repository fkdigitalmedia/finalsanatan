// ============================================================
// Sade Sati & Dhaiya Engine — Constants
// ============================================================

import type { SadeSatiPhaseKey } from "./types";

export const SADESATI_ENGINE_VERSION = "0.1.0-sadesati";
export const SADESATI_DATA_SOURCE = "sanatan-tools/transit+kundli";

/** Default search window (years, centred on currentDate). */
export const DEFAULT_WINDOW_YEARS = 40;

/** Coarse scan step (days) used to detect Saturn sign changes. */
export const SCAN_STEP_DAYS = 8;

/** Boundary refinement precision (hours). */
export const REFINE_PRECISION_HOURS = 6;

/**
 * Retrograde wobble near a sign boundary can split one stay into
 * several short intervals. Any stay shorter than this, flanked by
 * the same sign, is merged back into the surrounding stay.
 */
export const MIN_STAY_DAYS = 140;

export const PHASE_META: Record<
  SadeSatiPhaseKey,
  {
    houseFromMoon: 12 | 1 | 2;
    offset: number; // signs ahead of natal Moon
    label: string;
    intensity: "moderate" | "peak" | "waning";
    description: string;
  }
> = {
  first: {
    houseFromMoon: 12,
    offset: 11,
    label: "Rising Phase (Aarohi) — Saturn in the 12th from Moon",
    intensity: "moderate",
    description:
      "Saturn transits the 12th from the natal Moon. Traditionally linked to expenses, disturbed sleep, travel, detachment and the slow closing of old chapters.",
  },
  second: {
    houseFromMoon: 1,
    offset: 0,
    label: "Peak Phase (Madhya) — Saturn over the Moon",
    intensity: "peak",
    description:
      "Saturn transits the natal Moon sign. Considered the most demanding phase — health, mind, responsibility and identity are tested and restructured.",
  },
  third: {
    houseFromMoon: 2,
    offset: 1,
    label: "Setting Phase (Avarohi) — Saturn in the 2nd from Moon",
    intensity: "waning",
    description:
      "Saturn transits the 2nd from the natal Moon. Focus shifts to finances, family, speech and consolidating whatever survived the peak phase.",
  },
};

export const PHASE_ORDER: SadeSatiPhaseKey[] = ["first", "second", "third"];

export const DHAIYA_META = {
  kantaka: {
    offset: 3,
    houseFromMoon: 4 as const,
    label: "Kantaka Shani (Ardha Ashtama) — Saturn in the 4th from Moon",
  },
  ashtama: {
    offset: 7,
    houseFromMoon: 8 as const,
    label: "Ashtama Shani — Saturn in the 8th from Moon",
  },
} as const;

/** Base intensity (0..100) contributed by each phase. */
export const PHASE_INTENSITY_BASE: Record<SadeSatiPhaseKey, number> = {
  first: 55,
  second: 85,
  third: 65,
};

export const DAY_MS = 24 * 60 * 60 * 1000;
