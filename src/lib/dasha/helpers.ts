// ============================================================
// Dasha Engine — Helpers
// ============================================================

import type { BirthInput } from "@/lib/kundli/types";
import { DAY_MS } from "./constants";

/** Days between two ISO instants, rounded to 2 decimals. */
export function daysBetween(startISO: string, endISO: string): number {
  return Math.round(((Date.parse(endISO) - Date.parse(startISO)) / DAY_MS) * 100) / 100;
}

/** Elapsed / remaining / progress helpers for a period. */
export function periodProgress(startISO: string, endISO: string, nowISO: string) {
  const start = Date.parse(startISO);
  const end = Date.parse(endISO);
  const now = Date.parse(nowISO);
  const durationDays = (end - start) / DAY_MS;
  const elapsedDays = Math.max(0, Math.min(durationDays, (now - start) / DAY_MS));
  const remainingDays = Math.max(0, durationDays - elapsedDays);
  const progress = durationDays > 0 ? elapsedDays / durationDays : 0;
  return {
    durationDays: round2(durationDays),
    elapsedDays: round2(elapsedDays),
    remainingDays: round2(remainingDays),
    progress: round4(progress),
  };
}

export function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
export function round4(v: number): number {
  return Math.round(v * 10_000) / 10_000;
}

/** Deterministic cache key for a birth. */
export function birthKey(birth: BirthInput): string {
  return [
    birth.date,
    birth.time,
    birth.latitude.toFixed(4),
    birth.longitude.toFixed(4),
    String(birth.timezone ?? "utc"),
  ].join("|");
}

/** Deterministic cache key for a dasha request. */
export function dashaCacheKey(
  birth: BirthInput,
  currentDate: string,
  system: string,
  language: string,
): string {
  return [birthKey(birth), currentDate, system, language].join("#");
}

/** Parse YYYY-MM-DD to UTC noon. */
export function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
}

/** Format current YYYY-MM-DD in the given IANA tz. */
export function todayInTz(tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${day}`;
}
