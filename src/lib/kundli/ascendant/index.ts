// ============================================================
// Kundli / ascendant (Lagna)
// ------------------------------------------------------------
// Standard astronomical formula:
//   tan(Asc_trop) = -cos(LST) / (sin(ε)·tan(φ) + cos(ε)·sin(LST))
// Then sidereal Asc = norm360(Asc_trop − ayanamsa).
// ============================================================
import { DEG, norm360 } from "@/lib/astro/core";
import { lstHours, meanObliquityDeg } from "@/lib/kundli/time";
import { ayanamsa } from "@/lib/kundli/ayanamsa";

export interface AscendantResult {
  longitudeTropical: number;
  longitudeSidereal: number;
  lstHours: number;
  obliquityDeg: number;
}

export function computeAscendant(
  utcDate: Date,
  latDeg: number,
  eastLonDeg: number,
): AscendantResult {
  const lst = lstHours(utcDate, eastLonDeg); // hours 0..24
  const ramc = lst * 15; // RAMC in deg
  const eps = meanObliquityDeg(utcDate);
  const sinE = Math.sin(eps * DEG);
  const cosE = Math.cos(eps * DEG);
  const tanPhi = Math.tan(latDeg * DEG);
  const sinR = Math.sin(ramc * DEG);
  const cosR = Math.cos(ramc * DEG);

  // Meeus, Astronomical Algorithms, formula 14.5
  let asc = Math.atan2(-cosR, sinE * tanPhi + cosE * sinR) / DEG;
  asc = norm360(asc);
  // The ascendant must lie in the eastern hemisphere:
  // it should be within (RAMC, RAMC + 180°) mod 360.
  const diff = norm360(asc - ramc);
  if (diff > 180) asc = norm360(asc + 180);

  const sid = norm360(asc - ayanamsa(utcDate));
  return {
    longitudeTropical: asc,
    longitudeSidereal: sid,
    lstHours: lst,
    obliquityDeg: eps,
  };
}
