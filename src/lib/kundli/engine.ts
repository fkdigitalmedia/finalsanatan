// ============================================================
// Kundli / engine
// ------------------------------------------------------------
// Top-level orchestrator. Given `BirthInput`, returns a fully
// resolved `KundliResult`. All astronomical work is delegated to
// smaller modules (time, ayanamsa, ascendant, planets, charts).
// ============================================================
import type { BirthInput, KundliResult, GrahaName } from "./types";
import { toUtcDate, julianDayUT, gastHours, lstHours } from "./time";
import { ayanamsa } from "./ayanamsa";
import { computeAscendant } from "./ascendant";
import { nineGrahas } from "./planets";
import { buildD1, buildD9 } from "./charts";
import {
  buildD3,
  buildD7,
  buildD10,
  buildD12,
  buildD16,
  buildD20,
  buildD24,
  buildD27,
  buildD30,
  buildD40,
  buildD45,
  buildD60,
} from "./charts/divisional";
import { NAKSHATRA_LORDS, rashiName } from "./strength";
import { computeShadbala } from "./strength/shadbala";
import { computeAshtakvarga } from "./strength/ashtakvarga";
import { computeBirthPanchang } from "./panchang-at-birth";
import { computeAvakahada } from "./avakahada";
import { computeVimshottari } from "./dasha/vimshottari";
import { detectYogas } from "./yogas";
import { detectDoshas } from "./doshas";
import { suggestRemedies } from "./remedies";

export function generateKundli(input: BirthInput): KundliResult {
  if (!input.date || !input.time) throw new Error("date and time are required");
  if (input.latitude < -90 || input.latitude > 90) throw new Error("latitude out of range");
  if (input.longitude < -180 || input.longitude > 180) throw new Error("longitude out of range");

  const utc = toUtcDate(input.date, input.time, input.timezone);
  const jd = julianDayUT(utc);
  const gast = gastHours(utc);
  const lst = lstHours(utc, input.longitude);
  const ayan = ayanamsa(utc);

  const asc = computeAscendant(utc, input.latitude, input.longitude);
  const grahas = nineGrahas(utc);
  const d1 = buildD1(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d9 = buildD9(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d3 = buildD3(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d7 = buildD7(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d10 = buildD10(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d12 = buildD12(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d16 = buildD16(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d20 = buildD20(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d24 = buildD24(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d27 = buildD27(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d30 = buildD30(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d40 = buildD40(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d45 = buildD45(asc.longitudeSidereal, asc.longitudeTropical, grahas);
  const d60 = buildD60(asc.longitudeSidereal, asc.longitudeTropical, grahas);

  const moon = grahas.find((p) => p.graha === "Moon")!;
  const sun = grahas.find((p) => p.graha === "Sun")!;
  const nakSpan = 360 / 27;
  const moonNakIdx = Math.floor(moon.sidereal / nakSpan);
  const within = moon.sidereal - moonNakIdx * nakSpan;
  const pada = (Math.floor((within / nakSpan) * 4) + 1) as 1 | 2 | 3 | 4;
  const moonRashiIdx = Math.floor(moon.sidereal / 30);
  const nakLord = NAKSHATRA_LORDS[moonNakIdx] as GrahaName;

  // Phase 1 additions
  const birthPanchang = computeBirthPanchang(utc);
  const avakahada = computeAvakahada(moonNakIdx, pada, moonRashiIdx, nakLord);
  // Phase 2 — Vimshottari
  const fractionElapsed = within / nakSpan;
  const vimshottari = computeVimshottari(utc, nakLord, fractionElapsed);
  // Sprint 2
  const yogas = detectYogas(d1);
  const doshas = detectDoshas(d1);
  const remedies = suggestRemedies(d1, doshas);
  // Sprint 3 — strength
  const shadbala = computeShadbala(d1);
  const ashtakvarga = computeAshtakvarga(d1);

  return {
    input,
    computedAt: new Date().toISOString(),
    time: {
      utcISO: utc.toISOString(),
      julianDay: jd,
      siderealTimeHours: gast,
      localSiderealTimeHours: lst,
      ayanamsaDegrees: ayan,
    },
    moonSign: rashiName(moonRashiIdx),
    sunSign: rashiName(Math.floor(sun.sidereal / 30)),
    birthNakshatra: {
      nakshatra: d1.planets.find((p) => p.graha === "Moon")!.nakshatra,
      pada,
      lord: nakLord,
    },
    d1,
    d9,
    birthPanchang,
    avakahada,
    vimshottari,
    yogas,
    doshas,
    remedies,
    d3,
    d7,
    d10,
    d12,
    d16,
    d20,
    d24,
    d27,
    d30,
    d40,
    d45,
    d60,
    shadbala,
    ashtakvarga,
  };
}

// Re-export the whole public surface for consumers.
export * from "./types";
export { computeAscendant } from "./ascendant";
export { nineGrahas } from "./planets";
export { buildHouses } from "./houses";
export { ayanamsa } from "./ayanamsa";
export { computeBirthPanchang } from "./panchang-at-birth";
export { computeAvakahada } from "./avakahada";
export { computeVimshottari } from "./dasha/vimshottari";
export { detectYogas } from "./yogas";
export { detectDoshas } from "./doshas";
export { suggestRemedies } from "./remedies";
