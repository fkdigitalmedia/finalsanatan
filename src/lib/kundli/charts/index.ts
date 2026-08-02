// ============================================================
// Kundli / charts
// ------------------------------------------------------------
// Builds the D1 (Rashi) and D9 (Navamsa) divisional charts from
// a resolved planet set + ascendant. Additional vargas (D3, D10,
// D12, …) plug in via the same shape.
// ============================================================
import type { KundliChart, PlanetChartPosition, GrahaName } from "@/lib/kundli/types";
import { NAKSHATRAS } from "@/lib/kundli/types";
import { buildHouses, houseOfLongitude } from "@/lib/kundli/houses";
import { computeDignity, strengthScore, rashiName } from "@/lib/kundli/strength";
import { norm360 } from "@/lib/astro/core";

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

export interface RawGrahaInput {
  graha: GrahaName;
  tropical: number;
  sidereal: number;
  retrograde: boolean;
}

/** D1 — Rashi chart. */
export function buildD1(
  ascendantSidereal: number,
  ascendantTropical: number,
  planets: RawGrahaInput[],
): KundliChart {
  const houses = buildHouses(ascendantSidereal, "whole-sign");
  const packed = planets.map((p) =>
    packPlanet(p.graha, p.tropical, p.sidereal, p.retrograde, ascendantSidereal),
  );
  return {
    system: "whole-sign",
    ascendant: buildAscendantBlock(ascendantSidereal, ascendantTropical),
    houses,
    planets: packed,
  };
}

/** D9 — Navamsa. Each sign is split into 9 parts of 3°20'. */
function navamsaLongitude(sidereal: number): number {
  const rashi = Math.floor(sidereal / 30);
  const deg = sidereal - rashi * 30;
  const navIdx = Math.floor(deg / (30 / 9)); // 0..8
  // Starting sign of navamsa depends on element of natal sign
  //  movable (0,3,6,9) → starts from same sign
  //  fixed   (1,4,7,10) → starts from 9th sign
  //  dual    (2,5,8,11) → starts from 5th sign
  const mod = rashi % 3;
  const startRashi = mod === 0 ? rashi : mod === 1 ? (rashi + 8) % 12 : (rashi + 4) % 12;
  const navRashi = (startRashi + navIdx) % 12;
  // Represent as centre of navamsa slice for consistent house placement.
  return navRashi * 30 + 15;
}

export function buildD9(
  ascendantSidereal: number,
  ascendantTropical: number,
  planets: RawGrahaInput[],
): KundliChart {
  const ascD9 = navamsaLongitude(ascendantSidereal);
  const houses = buildHouses(ascD9, "whole-sign");
  const packed = planets.map((p) => {
    const d9lon = navamsaLongitude(p.sidereal);
    return packPlanet(p.graha, p.tropical, d9lon, p.retrograde, ascD9);
  });
  return {
    system: "whole-sign",
    ascendant: buildAscendantBlock(ascD9, norm360(ascD9)),
    houses,
    planets: packed,
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
