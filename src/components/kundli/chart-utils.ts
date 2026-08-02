// ============================================================
// Kundli Chart Rendering — shared utilities
// ------------------------------------------------------------
// Pure helpers consumed by the three chart renderers
// (North / South / East Indian).  No React, no interpretation.
// ============================================================

import type { KundliChart, PlanetChartPosition, GrahaName } from "@/lib/kundli/types";

// Vedic Rashi abbreviations (matches PDF chart legend).
// Mesha, Vrishabha, Mithuna, Karka, Simha, Kanya,
// Tula, Vrishchika, Dhanu, Makara, Kumbha, Meena
export const RASHI_SHORT = [
  "Me",
  "Vr",
  "Mi",
  "Ka",
  "Si",
  "Kn",
  "Tu",
  "Vs",
  "Dh",
  "Mk",
  "Km",
  "Mn",
] as const;

export const RASHI_LABEL_EN = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const RASHI_LABEL_SA = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
] as const;

/** 2-letter graha abbreviations used inside chart cells */
export const GRAHA_SHORT: Record<GrahaName, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

/** Group planets by their whole-sign house (1..12). */
export function planetsByHouse(
  planets: PlanetChartPosition[],
): Record<number, PlanetChartPosition[]> {
  const out: Record<number, PlanetChartPosition[]> = {};
  for (let h = 1; h <= 12; h++) out[h] = [];
  for (const p of planets) out[p.house]?.push(p);
  return out;
}

/** Sign residing in a given house (Vedic whole-sign). */
export function signInHouse(chart: KundliChart, house: number): number {
  return (chart.ascendant.rashiIndex + (house - 1)) % 12;
}

/** House number that a given sign (0..11) occupies in the chart. */
export function houseOfSign(chart: KundliChart, rashiIndex: number): number {
  return ((rashiIndex - chart.ascendant.rashiIndex + 12) % 12) + 1;
}

/** Format a degree value like 12°34'  (padded). */
export function fmtDeg(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

export interface ChartTheme {
  /** stroke color for chart lines (usually currentColor) */
  stroke?: string;
  /** background fill for the chart canvas */
  background?: string;
  /** foreground text color */
  foreground?: string;
  /** accent color for house numbers / sign labels */
  accent?: string;
  /** color for the ascendant marker */
  ascendantAccent?: string;
  /** color for planets shown as retrograde */
  retrograde?: string;
  /** stroke width */
  strokeWidth?: number;
}

export const defaultTheme: Required<ChartTheme> = {
  stroke: "currentColor",
  background: "transparent",
  foreground: "currentColor",
  accent: "hsl(var(--primary))",
  ascendantAccent: "hsl(var(--primary))",
  retrograde: "hsl(var(--destructive))",
  strokeWidth: 1.5,
};

/** Merge partial theme with defaults. */
export function withTheme(theme?: ChartTheme): Required<ChartTheme> {
  return { ...defaultTheme, ...(theme ?? {}) };
}
