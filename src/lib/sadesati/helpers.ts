// ============================================================
// Sade Sati & Dhaiya Engine — Helpers
// ============================================================

import { RASHIS, type BirthInput, type Rashi } from "@/lib/kundli/types";
import { DAY_MS } from "./constants";
import type { RemainingDuration } from "./types";

export function rashiOf(index: number): Rashi {
  return RASHIS[((index % 12) + 12) % 12];
}

export function norm12(index: number): number {
  return ((index % 12) + 12) % 12;
}

/** 1..12 house counted forward from a natal reference sign index. */
export function houseFromRashi(planetRashi: number, refRashi: number): number {
  return norm12(planetRashi - refRashi) + 1;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function round(v: number, decimals = 0): number {
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

export function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
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

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function diffDays(fromISO: string, toISO: string): number {
  return (Date.parse(toISO) - Date.parse(fromISO)) / DAY_MS;
}

export function humanizeDays(days: number): RemainingDuration {
  const d = Math.max(0, Math.round(days));
  const years = Math.floor(d / 365.25);
  const months = Math.floor((d - years * 365.25) / 30.44);
  const restDays = Math.max(0, d - Math.round(years * 365.25 + months * 30.44));
  const bits: string[] = [];
  if (years) bits.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months) bits.push(`${months} month${months > 1 ? "s" : ""}`);
  if (!years && restDays) bits.push(`${restDays} day${restDays > 1 ? "s" : ""}`);
  return {
    days: d,
    months: round(d / 30.44, 1),
    years: round(d / 365.25, 2),
    humanized: bits.length ? bits.join(", ") : "0 days",
  };
}

export function statusOf(
  startISO: string,
  endISO: string,
  nowISO: string,
): "past" | "active" | "upcoming" {
  const now = Date.parse(nowISO);
  if (now < Date.parse(startISO)) return "upcoming";
  if (now >= Date.parse(endISO)) return "past";
  return "active";
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

export function sadeSatiCacheKey(
  birth: BirthInput,
  currentDate: string,
  language: string,
  windowYears: number,
): string {
  return [birthCacheKey(birth), currentDate, language, `w${windowYears}`].join("#");
}
