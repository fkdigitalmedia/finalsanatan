// ============================================================
// Gochar Engine — Helpers
// ============================================================

import type { BirthInput } from "@/lib/kundli/types";

/** 1..12 house counted forward from a natal reference sign index. */
export function houseFromRashi(planetRashi: number, refRashi: number): number {
  return ((planetRashi - refRashi + 12) % 12) + 1;
}

/** Forward-degrees travelled A → B on the 360° circle. */
export function forwardDegrees(from: number, to: number): number {
  const a = ((from % 360) + 360) % 360;
  const b = ((to % 360) + 360) % 360;
  return (b - a + 360) % 360;
}

/** Signed shortest-arc from A → B, range (-180, 180]. */
export function signedArc(from: number, to: number): number {
  const d = forwardDegrees(from, to);
  return d > 180 ? d - 360 : d;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function round(v: number, decimals = 0): number {
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

export function birthCacheKey(birth: BirthInput): string {
  return [
    birth.date,
    birth.time,
    birth.latitude.toFixed(4),
    birth.longitude.toFixed(4),
    String(birth.timezone ?? "utc"),
  ].join("|");
}

export function gocharCacheKey(
  birth: BirthInput,
  currentDate: string,
  planets: readonly string[],
  language: string,
  includeDasha: boolean,
): string {
  return [
    birthCacheKey(birth),
    currentDate,
    [...planets].sort().join(","),
    language,
    includeDasha ? "d1" : "d0",
  ].join("#");
}

export function todayInTz(tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

export function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
}

export function addDaysISO(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * 24 * 3600 * 1000).toISOString();
}
