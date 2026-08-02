// ============================================================
// Daily Horoscope Engine — Helpers
// ------------------------------------------------------------
// Pure utilities shared by validators / calculator / score.
// ============================================================

import { RASHIS } from "../constants";
import type { RashiKey } from "../types";

/** Clamp a value to [min, max]. */
export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

/** Normalized 0..100 rounding with 1-decimal stability. */
export function normalizeScore(n: number): number {
  return Math.round(clamp(n) * 10) / 10;
}

/** Resolve rashi index (0..11) from a machine key. */
export function rashiIndexFromKey(key: RashiKey): number {
  return RASHIS.findIndex((r) => r.key === key);
}

/**
 * House position (1..12) of `planetRashiIndex` counted from the
 * caller's natal rashi. This is Chandra-gochara when the "planet"
 * is the current Moon.
 */
export function houseFromNatal(planetRashiIndex: number, natalIndex: number): number {
  return ((planetRashiIndex - natalIndex + 12) % 12) + 1;
}

/** Return true when `houses` includes `house`. */
export function isBeneficHouse(house: number, houses: number[]): boolean {
  return houses.includes(house);
}

/** Format a Date as YYYY-MM-DD in the given IANA tz. */
export function localDateInTz(d: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD into a Date at 06:00 in the given tz (near sunrise). */
export function parseDailyDate(dateStr: string | undefined, tz: string): Date {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  // UTC noon minimizes tz-boundary drift for daily calculations.
  const utc = Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0);
  return new Date(utc);
}

/** Deterministic per-day tz-scoped cache key. */
export function dailyCacheKey(input: {
  date?: string;
  rashi: string;
  timezone?: string | number;
  language?: string;
}): string {
  return [
    input.date ?? "today",
    input.rashi,
    String(input.timezone ?? "Asia/Kolkata"),
    input.language ?? "en",
  ].join("|");
}
