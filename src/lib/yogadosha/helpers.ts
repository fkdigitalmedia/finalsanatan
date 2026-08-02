// ============================================================
// Dosha & Yoga Detection Engine — Helpers
// ============================================================

import { RASHIS, type BirthInput, type Rashi } from "@/lib/kundli/types";

export function rashiOf(index: number): Rashi {
  return RASHIS[((index % 12) + 12) % 12];
}

export function norm12(index: number): number {
  return ((index % 12) + 12) % 12;
}

/** 1..12 house counted forward from a reference house. */
export function houseFrom(reference: number, house: number): number {
  return norm12(house - reference) + 1;
}

/** Shortest-arc separation between two ecliptic longitudes. */
export function arcBetween(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function round(v: number, decimals = 0): number {
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

export function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
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

export function yogaDoshaCacheKey(
  birth: BirthInput,
  language: string,
  rules: readonly string[] | undefined,
  includeUndetected: boolean,
): string {
  return [
    birthCacheKey(birth),
    language,
    rules ? [...rules].sort().join(",") : "*",
    includeUndetected ? "u1" : "u0",
  ].join("#");
}

/** Map a 0..100 confidence onto the shared strength vocabulary. */
export function strengthFromConfidence(
  confidence: number,
  detected: boolean,
): "none" | "mild" | "moderate" | "strong" {
  if (!detected) return "none";
  if (confidence >= 80) return "strong";
  if (confidence >= 60) return "moderate";
  return "mild";
}
