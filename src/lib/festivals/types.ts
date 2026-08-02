// ============================================================
// Festival Rules Engine — Types
// ------------------------------------------------------------
// Every festival is a self-contained rule module that declares
// its astronomical dependencies, traditional rule, regional
// variations, validation dataset, edge-cases and localization
// hooks. The engine consumes rules; rules NEVER duplicate
// panchang math — they call helpers that call the Panchang
// engine (`src/lib/panchang.ts`) which in turn uses the shared
// astronomical core (`src/lib/astro/core.ts`).
// ============================================================
import type { LatLon } from "@/lib/panchang";

export type FestivalCategory =
  "Major" | "Vrat" | "Ekadashi" | "Purnima" | "Amavasya" | "Sankranti" | "Regional";

export type PakshaName = "Shukla" | "Krishna";
export type TimeAnchor =
  | "sunrise-vyapini" // tithi prevailing at sunrise (most common)
  | "night-vyapini" // tithi prevailing at midnight / pradosh
  | "moonrise" // festival keyed to moonrise (Karva Chauth)
  | "sankranti" // solar-ingress based
  | "custom"; // rule module handles its own resolution

export interface RegionalVariation {
  region: string; // e.g. "North India", "Maharashtra", "Tamil Nadu"
  note: string; // human-readable difference
  overrideAnchor?: TimeAnchor; // e.g. Krishna Janmashtami — Smarta vs Vaishnava
}

export interface EdgeCase {
  scenario: string; // e.g. "two sunrises span target tithi"
  handling: string; // how the rule resolves it
}

export interface KnownDate {
  year: number;
  date: string; // ISO YYYY-MM-DD, in IST unless region-specific
  source: string; // where the reference came from
  note?: string;
}

export interface FestivalRule {
  slug: string;
  name: string; // English
  devanagari?: string; // Sanskrit / Hindi name
  category: FestivalCategory;
  deity?: string;

  // ---- Astronomical dependencies (declarative, for docs & audits) ----
  dependencies: {
    tithi?: { paksha: PakshaName; index: number }; // 1..15
    nakshatra?: string;
    lunarMonth?: string; // e.g. "Kartika", "Chaitra" (Purnimanta unless noted)
    solarRashi?: number; // 0..11 (Aries=0) — for Sankranti
    anchor: TimeAnchor;
  };

  // ---- Traditional rule (human-readable) ----
  traditionalRule: string;

  // ---- Regional variations ----
  regionalVariations?: RegionalVariation[];

  // ---- Edge cases ----
  edgeCases?: EdgeCase[];

  // ---- Localization keys (consumed by i18n layer later) ----
  i18n: {
    nameKey: string; // e.g. "festivals.diwali.name"
    descriptionKey: string; // e.g. "festivals.diwali.description"
  };

  // ---- Validation dataset (used by scripts/validate-festivals.ts) ----
  validation: {
    knownDates: KnownDate[];
    tolerance?: 0 | 1; // days; 1 = allow ±1 day drift for known edge years
  };

  // ---- Resolver: compute the Gregorian date(s) for a given year ----
  resolve: (year: number, loc: LatLon) => ResolvedFestival[];
}

export interface ResolvedFestival {
  slug: string;
  name: string;
  date: Date; // local-day Date (midnight local)
  isoDate: string; // YYYY-MM-DD (local)
  window?: { start: Date; end: Date }; // moonrise/pradosh/etc.
  notes?: string[]; // e.g. "resolved via sunrise-vyapini rule"
}
