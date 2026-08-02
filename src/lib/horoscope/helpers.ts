// ============================================================
// Horoscope Engine — Helpers
// ------------------------------------------------------------
// Small pure utilities shared by validators / engine.
// ============================================================

import { RASHIS } from "./constants";
import type { RashiKey } from "./types";

/** Resolve a Rashi index (0..11) from a sidereal longitude in degrees. */
export function rashiIndexFromLongitude(sidereal: number): number {
  const norm = ((sidereal % 360) + 360) % 360;
  return Math.floor(norm / 30);
}

/** Resolve a RashiKey from a sidereal longitude. */
export function rashiKeyFromLongitude(sidereal: number): RashiKey {
  return RASHIS[rashiIndexFromLongitude(sidereal)].key;
}

/** Format a Date as an ISO YYYY-MM-DD (UTC). */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Combine a YYYY-MM-DD + HH:mm into a Date (UTC-neutral, parsing only). */
export function combineDateTime(date: string, time = "12:00"): Date {
  return new Date(`${date}T${time}:00Z`);
}
