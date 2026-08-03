// ============================================================
// Kundli Engine — Shared Types
// ------------------------------------------------------------
// Structural contracts consumed by all sub-modules
// (ascendant, houses, planets, charts, strength, validation).
// ============================================================

export interface BirthInput {
  /** ISO date string YYYY-MM-DD (local to birth place) */
  date: string;
  /** 24-h time string HH:mm (local to birth place) */
  time: string;
  /** Free-form place name (for display) */
  place: string;
  latitude: number; // decimal degrees, N positive
  longitude: number; // decimal degrees, E positive
  /** IANA tz name e.g. "Asia/Kolkata"  OR  numeric offset hours */
  timezone: string | number;
  gender?: "male" | "female" | "other";
  language?: string;
}

export type GrahaName =
  "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

export const RASHIS = [
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
export type Rashi = (typeof RASHIS)[number];

export const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;
export type Nakshatra = (typeof NAKSHATRAS)[number];

export interface PlanetChartPosition {
  graha: GrahaName;
  longitudeTropical: number; // 0..360
  longitudeSidereal: number; // 0..360
  rashiIndex: number; // 0..11
  rashi: Rashi;
  degreesInRashi: number; // 0..30
  nakshatraIndex: number; // 0..26
  nakshatra: Nakshatra;
  pada: 1 | 2 | 3 | 4;
  house: number; // 1..12 (whole-sign)
  retrograde: boolean;
  dignity: PlanetDignity;
  strengthScore: number; // 0..1 normalized
}

export type PlanetDignity =
  "exalted" | "moolatrikona" | "own" | "friend" | "neutral" | "enemy" | "debilitated";

export interface HouseCusp {
  house: number; // 1..12
  rashiIndex: number;
  rashi: Rashi;
  startDegree: number; // sidereal longitude at cusp
}

export interface KundliChart {
  system: "whole-sign" | "equal-house";
  ascendant: {
    longitudeTropical: number;
    longitudeSidereal: number;
    rashiIndex: number;
    rashi: Rashi;
    degreesInRashi: number;
    nakshatra: Nakshatra;
    nakshatraIndex: number;
    pada: 1 | 2 | 3 | 4;
  };
  houses: HouseCusp[];
  planets: PlanetChartPosition[];
}

export interface KundliResult {
  input: BirthInput;
  computedAt: string; // ISO instant
  time: {
    utcISO: string;
    julianDay: number;
    siderealTimeHours: number; // Greenwich apparent sidereal time
    localSiderealTimeHours: number;
    ayanamsaDegrees: number;
  };
  moonSign: Rashi;
  sunSign: Rashi;
  birthNakshatra: {
    nakshatra: Nakshatra;
    pada: 1 | 2 | 3 | 4;
    lord: GrahaName;
  };
  d1: KundliChart; // Rashi chart
  d9: KundliChart; // Navamsa chart
  // Phase 1 — Panchang at birth + Avakahada Chakra
  birthPanchang?: import("./panchang-at-birth").BirthPanchang;
  avakahada?: import("./avakahada").AvakahadaChakra;
  // Phase 2 — Vimshottari Dasha
  vimshottari?: import("./dasha/vimshottari").VimshottariReport;
  // Sprint 2 — Yogas / Doshas / Remedies
  yogas?: import("./yogas").YogaResult[];
  doshas?: import("./doshas").DoshaResult[];
  remedies?: import("./remedies").Remedy[];
  // Sprint 3 — Divisional charts + Shadbala + Ashtakvarga
  d2?: KundliChart;
  d3?: KundliChart;
  d4?: KundliChart;
  d7?: KundliChart;
  d10?: KundliChart;
  d12?: KundliChart;
  // Premium report — extended vargas
  d16?: KundliChart;
  d20?: KundliChart;
  d24?: KundliChart;
  d27?: KundliChart;
  d30?: KundliChart;
  d40?: KundliChart;
  d45?: KundliChart;
  d60?: KundliChart;
  shadbala?: import("./strength/shadbala").ShadbalaReport;
  ashtakvarga?: import("./strength/ashtakvarga").AshtakvargaReport;
}
