// ============================================================
// Transit Engine — Helpers
// ------------------------------------------------------------
// Small pure utilities. No I/O, no astronomy — those live in core.
// ============================================================

import { NAKSHATRAS_EN, NAKSHATRA_SPAN, RASHIS_EN, RASHI_SPAN } from "./constants";

/** Normalise any angle into [0, 360). */
export function norm360(x: number): number {
  const v = x % 360;
  return v < 0 ? v + 360 : v;
}

/** Sidereal longitude → Rashi index (0..11). */
export function rashiIndex(sidereal: number): number {
  return Math.floor(norm360(sidereal) / RASHI_SPAN);
}

/** Sidereal longitude → Rashi English name. */
export function rashiName(sidereal: number): string {
  return RASHIS_EN[rashiIndex(sidereal)];
}

/** Sidereal longitude → Nakshatra index (0..26). */
export function nakshatraIndex(sidereal: number): number {
  return Math.floor(norm360(sidereal) / NAKSHATRA_SPAN);
}

/** Sidereal longitude → Nakshatra name. */
export function nakshatraName(sidereal: number): string {
  return NAKSHATRAS_EN[nakshatraIndex(sidereal)];
}

/** Sidereal longitude → Pada (1..4) inside its Nakshatra. */
export function padaOf(sidereal: number): 1 | 2 | 3 | 4 {
  const within = norm360(sidereal) - nakshatraIndex(sidereal) * NAKSHATRA_SPAN;
  return (Math.floor((within / NAKSHATRA_SPAN) * 4) + 1) as 1 | 2 | 3 | 4;
}

/** Signed angular difference (b→a) in [-180, 180]. */
export function angularDelta(a: number, b: number): number {
  let d = norm360(a - b);
  if (d > 180) d -= 360;
  return d;
}

/** Parse `YYYY-MM-DD` or a full ISO string. Returns `null` on failure. */
export function parseDate(input?: string | Date): Date | null {
  if (!input) return new Date();
  if (input instanceof Date) return isNaN(+input) ? null : input;
  const s = /^\d{4}-\d{2}-\d{2}$/.test(input) ? `${input}T00:00:00Z` : input;
  const d = new Date(s);
  return isNaN(+d) ? null : d;
}
