// ============================================================
// Dasha Engine — Constants
// ============================================================

import type { DashaSystemKey } from "./types";

export const DASHA_ENGINE_VERSION = "0.1.0-dasha";
export const DASHA_DATA_SOURCE = "sanatan-tools/kundli+dasha";

/** Julian year length in ms (matches kundli/dasha/vimshottari). */
export const YEAR_MS = 365.2425 * 24 * 3600 * 1000;
export const DAY_MS = 24 * 3600 * 1000;

/** Systems currently implemented. Others are declared so registry lookups don't lie. */
export const IMPLEMENTED_SYSTEMS: readonly DashaSystemKey[] = ["vimshottari"] as const;
export const PLANNED_SYSTEMS: readonly DashaSystemKey[] = [
  "yogini",
  "kalachakra",
  "ashtottari",
  "char",
] as const;

export const ALL_SYSTEM_KEYS: readonly DashaSystemKey[] = [
  ...IMPLEMENTED_SYSTEMS,
  ...PLANNED_SYSTEMS,
];
