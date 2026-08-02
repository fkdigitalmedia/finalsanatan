// ============================================================
// Daily Horoscope Engine — Calculator
// ------------------------------------------------------------
// Composes the Transit Engine + Panchang primitives into a
// structured "raw daily snapshot". No text, no AI.
// ============================================================

import { TransitEngine } from "@/lib/transit";
import type { PlanetTransit, TransitSnapshot } from "@/lib/transit/types";
import {
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  getChoghadiya,
  getAbhijitMuhurat,
  type LatLon,
} from "@/lib/panchang";
import { RASHIS } from "../constants";
import type { RashiKey } from "../types";
import type {
  DailyPanchangSummary,
  LuckyFactors,
  MoonStatus,
  DailyPlanetaryInfluence,
} from "./types";
import { houseFromNatal, rashiIndexFromKey } from "./helpers";
import {
  favorableActivities,
  activitiesToAvoid,
  luckyColorForRashi,
  luckyDirectionForRashi,
  luckyNumberForRashi,
} from "./rules";

export interface DailyRawSnapshot {
  transit: TransitSnapshot;
  moon: MoonStatus;
  panchang: DailyPanchangSummary;
  planetaryInfluence: DailyPlanetaryInfluence;
  lucky: LuckyFactors;
  location: LatLon;
  referenceDate: Date;
}

/**
 * Compute every structured daily field. Delegates to the shared
 * Transit Engine (so its cache is reused) and to the Panchang
 * primitives already used across the app.
 */
export function calculateDailyRaw(
  transitEngine: TransitEngine,
  referenceDate: Date,
  rashi: RashiKey,
  location: LatLon,
): DailyRawSnapshot {
  const transit = transitEngine.generateTransitSnapshot({
    date: referenceDate.toISOString(),
    location: {
      place: location.label,
      latitude: location.lat,
      longitude: location.lon,
      timezone: location.tz,
    },
  });

  const moonTransit = transit.planets.find((p) => p.name === "Moon")!;
  const natalIndex = rashiIndexFromKey(rashi);
  const moonHouse = houseFromNatal(moonTransit.rashiIndex, natalIndex);
  const moonFavorableHouses = [1, 3, 6, 7, 10, 11];

  const moon: MoonStatus = {
    rashi: moonTransit.rashi,
    rashiIndex: moonTransit.rashiIndex,
    nakshatra: moonTransit.nakshatra,
    pada: moonTransit.pada,
    degreesInRashi: moonTransit.degreesInRashi,
    houseFromNatal: moonHouse,
    favorable: moonFavorableHouses.includes(moonHouse),
  };

  const tithi = getTithi(referenceDate);
  const nak = getNakshatra(referenceDate);
  const yoga = getYoga(referenceDate);
  const karana = getKarana(referenceDate);
  const sun = getSunTimes(referenceDate, location);
  const moonPhase: DailyPanchangSummary["moonPhase"] =
    tithi.index === 15
      ? "Full"
      : tithi.index === 30
        ? "New"
        : tithi.paksha === "Shukla"
          ? "Waxing"
          : "Waning";

  const panchang: DailyPanchangSummary = {
    tithi: { index: tithi.index, name: tithi.name, paksha: tithi.paksha, percent: tithi.percent },
    nakshatra: { index: nak.index, name: nak.name, pada: nak.pada, lord: nak.lord },
    yoga: { index: yoga.index, name: yoga.name },
    karana: { index: karana.index, name: karana.name },
    sunrise: sun.sunrise?.toISOString() ?? null,
    sunset: sun.sunset?.toISOString() ?? null,
    moonPhase,
    paksha: tithi.paksha,
  };

  // Imminent sign changes: any planet ingressing within ±3 days.
  const windowMs = 3 * 24 * 3600 * 1000;
  const now = referenceDate.getTime();
  const imminent: DailyPlanetaryInfluence["imminentSignChanges"] = [];
  for (const p of transit.planets) {
    if (!p.nextSignChange) continue;
    const when = new Date(p.nextSignChange).getTime();
    if (when >= now && when - now <= windowMs) {
      const nextRashiIdx = (p.rashiIndex + 1) % 12;
      imminent.push({
        planet: p.name,
        from: p.rashi,
        to: RASHIS[nextRashiIdx].english,
        when: p.nextSignChange,
      });
    }
  }

  const planetaryInfluence: DailyPlanetaryInfluence = {
    summary: transit.summary,
    detailed: transit.planets as PlanetTransit[],
    retrograde: transit.planets.filter((p) => p.retrograde).map((p) => p.name),
    imminentSignChanges: imminent,
  };

  // Lucky time window: prefer Abhijit muhurat (when observed), else
  // the first Shubh/Amrit/Labh choghadiya slot of the day.
  const abhijit = getAbhijitMuhurat(referenceDate, location);
  let luckyWindow: LuckyFactors["timeWindow"];
  if (abhijit.observed && abhijit.start && abhijit.end) {
    luckyWindow = {
      start: abhijit.start.toISOString(),
      end: abhijit.end.toISOString(),
      label: "Abhijit Muhurat",
    };
  } else {
    const cho = getChoghadiya(referenceDate, location);
    const first = cho?.day.find((s) => s.quality === "auspicious");
    luckyWindow = first
      ? {
          start: first.start.toISOString(),
          end: first.end.toISOString(),
          label: `Choghadiya: ${first.name}`,
        }
      : { start: null, end: null, label: "Unavailable" };
  }

  const lucky: LuckyFactors = {
    number: luckyNumberForRashi(rashi),
    color: luckyColorForRashi(rashi),
    direction: luckyDirectionForRashi(rashi),
    timeWindow: luckyWindow,
    favorableActivities: favorableActivities(tithi.index, yoga.name),
    activitiesToAvoid: activitiesToAvoid(tithi.index, yoga.name),
  };

  return { transit, moon, panchang, planetaryInfluence, lucky, location, referenceDate };
}
