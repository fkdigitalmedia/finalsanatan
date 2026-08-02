// ============================================================
// Personalized Horoscope Engine — Helpers
// ------------------------------------------------------------
// Pure utilities used across the personalized module.
// ============================================================

import type { BirthInput } from "@/lib/kundli/types";
import { RASHIS } from "../constants";
import { localDateInTz } from "../daily/helpers";
import type { RashiKey } from "../types";

export { localDateInTz };

/** Clamp a number into a [min,max] range. */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Round a number to a given number of decimals. */
export function round(v: number, decimals = 0): number {
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

/** 1..12 house counted from a natal reference sign index. */
export function houseFromRashi(planetRashiIndex: number, referenceRashiIndex: number): number {
  return ((planetRashiIndex - referenceRashiIndex + 12) % 12) + 1;
}

/** Map an English rashi name back to its machine key. */
export function rashiKeyFromEnglish(name: string): RashiKey {
  const hit = RASHIS.find((r) => r.english === name);
  return hit?.key ?? "mesha";
}

/** Map a sidereal longitude to its 0..11 sign index. */
export function rashiIndexFromLongitude(sidereal: number): number {
  const norm = ((sidereal % 360) + 360) % 360;
  return Math.floor(norm / 30);
}

/** Absolute forward-degrees travelled from A to B on a 360° circle. */
export function forwardDegrees(from: number, to: number): number {
  const a = ((from % 360) + 360) % 360;
  const b = ((to % 360) + 360) % 360;
  return (b - a + 360) % 360;
}

/** Deterministic cache key for a BirthInput. */
export function birthChartCacheKey(birth: BirthInput): string {
  return [
    birth.date,
    birth.time,
    birth.latitude.toFixed(4),
    birth.longitude.toFixed(4),
    String(birth.timezone ?? "utc"),
  ].join("|");
}

/** Deterministic cache key for a personalized request. */
export function personalizedCacheKey(
  birthKey: string,
  currentDate: string,
  period: string,
  language: string,
): string {
  return [birthKey, currentDate, period, language].join("#");
}

/** ISO YYYY-MM-DD for "today" in the given tz. */
export function todayInTz(tz: string): string {
  return localDateInTz(new Date(), tz);
}

/** Parse a YYYY-MM-DD (tz-neutral) into a Date at UTC noon of that day. */
export function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
}

/** First day (Monday) of the week containing `ymd`. */
export function mondayOfWeek(ymd: string): string {
  const d = parseYmd(ymd);
  const dow = d.getUTCDay(); // 0=Sun..6=Sat
  const delta = dow === 0 ? -6 : 1 - dow;
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
