// ============================================================
// Kundli / charts / divisional
// ------------------------------------------------------------
// Parashara varga formulae for D3 (Drekkana), D7 (Saptamsa),
// D10 (Dasamsa) and D12 (Dwadasamsa). Each function returns
// the destination sidereal longitude (centre of slice) for a
// given natal sidereal longitude.
// ============================================================
import type { KundliChart, PlanetChartPosition, GrahaName } from "@/lib/kundli/types";
import { NAKSHATRAS } from "@/lib/kundli/types";
import { buildHouses, houseOfLongitude } from "@/lib/kundli/houses";
import { computeDignity, strengthScore, rashiName } from "@/lib/kundli/strength";
import { norm360 } from "@/lib/astro/core";
import type { RawGrahaInput } from "./index";

// ---------- Varga long-map helpers (centre of destination slice) ----------

/** D3 — Drekkana. 10° each. 0-10° = same, 10-20° = 5th, 20-30° = 9th. */
export function drekkanaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 10); // 0,1,2
  const offset = part === 0 ? 0 : part === 1 ? 4 : 8;
  const dest = (rashi + offset) % 12;
  return dest * 30 + 15;
}

/** D7 — Saptamsa. 30/7 each. Odd sign: start same; even: start 7th. */
export function saptamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / (30 / 7)); // 0..6
  const startRashi = rashi % 2 === 0 ? rashi : (rashi + 6) % 12;
  const dest = (startRashi + part) % 12;
  return dest * 30 + 15;
}

/** D10 — Dasamsa. 3° each. Odd: start same; even: start 9th sign. */
export function dasamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 3); // 0..9
  const startRashi = rashi % 2 === 0 ? rashi : (rashi + 8) % 12;
  const dest = (startRashi + part) % 12;
  return dest * 30 + 15;
}

/** D12 — Dwadasamsa. 2.5° each. Always start same sign, count forward. */
export function dwadasamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 2.5); // 0..11
  const dest = (rashi + part) % 12;
  return dest * 30 + 15;
}

// ---------- Generic builder ----------

function packPlanet(
  graha: GrahaName,
  tropical: number,
  sidereal: number,
  retrograde: boolean,
  ascendantSidereal: number,
): PlanetChartPosition {
  const rashiIndex = Math.floor(sidereal / 30);
  const degreesInRashi = sidereal - rashiIndex * 30;
  const nakSpan = 360 / 27;
  const nakshatraIndex = Math.floor(sidereal / nakSpan);
  const within = sidereal - nakshatraIndex * nakSpan;
  const pada = (Math.floor((within / nakSpan) * 4) + 1) as 1 | 2 | 3 | 4;
  const dignity = computeDignity(graha, rashiIndex);
  return {
    graha,
    longitudeTropical: tropical,
    longitudeSidereal: sidereal,
    rashiIndex,
    rashi: rashiName(rashiIndex),
    degreesInRashi,
    nakshatraIndex,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada,
    house: houseOfLongitude(sidereal, ascendantSidereal),
    retrograde,
    dignity,
    strengthScore: strengthScore(dignity, degreesInRashi),
  };
}

function buildAscendantBlock(sidereal: number, tropical: number) {
  const rashiIndex = Math.floor(sidereal / 30);
  const degreesInRashi = sidereal - rashiIndex * 30;
  const nakSpan = 360 / 27;
  const nakshatraIndex = Math.floor(sidereal / nakSpan);
  const within = sidereal - nakshatraIndex * nakSpan;
  const pada = (Math.floor((within / nakSpan) * 4) + 1) as 1 | 2 | 3 | 4;
  return {
    longitudeTropical: tropical,
    longitudeSidereal: sidereal,
    rashiIndex,
    rashi: rashiName(rashiIndex),
    degreesInRashi,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraIndex,
    pada,
  };
}

function buildVarga(
  ascendantSidereal: number,
  ascendantTropical: number,
  planets: RawGrahaInput[],
  map: (lon: number) => number,
): KundliChart {
  const ascV = map(ascendantSidereal);
  const houses = buildHouses(ascV, "whole-sign");
  const packed = planets.map((p) =>
    packPlanet(p.graha, p.tropical, map(p.sidereal), p.retrograde, ascV),
  );
  return {
    system: "whole-sign",
    ascendant: buildAscendantBlock(ascV, norm360(ascendantTropical)),
    houses,
    planets: packed,
  };
}

/** D2 — Hora. 15° each. Odd: 0-15° Sun (Leo=4), 15-30° Moon (Cancer=3). Even: 0-15° Moon, 15-30° Sun. */
export function horaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const odd = rashi % 2 === 0;
  const firstHalf = deg < 15;
  const dest = odd ? (firstHalf ? 4 : 3) : (firstHalf ? 3 : 4);
  return dest * 30 + 15;
}

/** D4 — Chaturthamsa. 7.5° each. 1st, 4th, 7th, 10th Kendra signs from natal sign. */
export function chaturthamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 7.5); // 0..3
  const dest = (rashi + part * 3) % 12;
  return dest * 30 + 15;
}

export function buildD2(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, horaLongitude);
}
export function buildD4(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, chaturthamsaLongitude);
}
export function buildD3(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, drekkanaLongitude);
}
export function buildD7(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, saptamsaLongitude);
}
export function buildD10(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, dasamsaLongitude);
}
export function buildD12(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, dwadasamsaLongitude);
}

// ============================================================
// Extended vargas (Premium Report)
// ------------------------------------------------------------
// Each function returns the CENTRE longitude of the destination
// varga slice. Whole-sign house placement only depends on the
// sign, so returning (sign*30 + 15) is sufficient.
// ============================================================

/** D16 — Shodasamsa. 30/16 = 1.875° slice. */
export function shodasamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / (30 / 16));
  const mod = rashi % 3;
  const start = mod === 0 ? 0 : mod === 1 ? 4 : 8;
  return ((start + part) % 12) * 30 + 15;
}

/** D20 — Vimsamsa. 1.5° slice. */
export function vimsamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 1.5);
  const mod = rashi % 3;
  const start = mod === 0 ? 0 : mod === 1 ? 8 : 4;
  return ((start + part) % 12) * 30 + 15;
}

/** D24 — Chaturvimsamsa. 1.25° slice. Odd → Leo, Even → Cancer. */
export function chaturvimsamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 1.25);
  const start = rashi % 2 === 0 ? 4 : 3;
  return ((start + part) % 12) * 30 + 15;
}

/** D27 — Bhamsa / Nakshatramsa. 30/27 ≈ 1.111° slice. */
export function bhamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / (30 / 27));
  const element = rashi % 4;
  const start = element === 0 ? 0 : element === 1 ? 3 : element === 2 ? 6 : 9;
  return ((start + part) % 12) * 30 + 15;
}

/**
 * D30 — Trimsamsa. Planetary boundaries, not equal slices.
 *   Odd sign:  0–5 Mars(0), 5–10 Saturn(10), 10–18 Jupiter(8),
 *              18–25 Mercury(2), 25–30 Venus(6).
 *   Even sign: 0–5 Venus(1), 5–12 Mercury(5), 12–20 Jupiter(11),
 *              20–25 Saturn(9), 25–30 Mars(7).
 */
export function trimsamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const odd = rashi % 2 === 0;
  let dest: number;
  if (odd) {
    if (deg < 5) dest = 0;
    else if (deg < 10) dest = 10;
    else if (deg < 18) dest = 8;
    else if (deg < 25) dest = 2;
    else dest = 6;
  } else {
    if (deg < 5) dest = 1;
    else if (deg < 12) dest = 5;
    else if (deg < 20) dest = 11;
    else if (deg < 25) dest = 9;
    else dest = 7;
  }
  return dest * 30 + 15;
}

/** D40 — Khavedamsa. 0.75° slice. */
export function khavedamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 0.75);
  const start = rashi % 2 === 0 ? 0 : 6;
  return ((start + part) % 12) * 30 + 15;
}

/** D45 — Akshavedamsa. 30/45 ≈ 0.667° slice. */
export function akshavedamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / (30 / 45));
  const mod = rashi % 3;
  const start = mod === 0 ? 0 : mod === 1 ? 4 : 8;
  return ((start + part) % 12) * 30 + 15;
}

/** D60 — Shashtiamsa. 0.5° slice (simplified). */
export function shashtiamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const part = Math.floor(deg / 0.5);
  return ((rashi + part) % 12) * 30 + 15;
}

export function buildD16(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, shodasamsaLongitude);
}
export function buildD20(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, vimsamsaLongitude);
}
export function buildD24(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, chaturvimsamsaLongitude);
}
export function buildD27(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, bhamsaLongitude);
}
export function buildD30(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, trimsamsaLongitude);
}
export function buildD40(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, khavedamsaLongitude);
}
export function buildD45(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, akshavedamsaLongitude);
}
export function buildD60(a: number, at: number, p: RawGrahaInput[]): KundliChart {
  return buildVarga(a, at, p, shashtiamsaLongitude);
}
