// ============================================================
// Personalized Horoscope Engine — Birth Chart Loader
// ------------------------------------------------------------
// Thin wrapper around the existing Kundli engine. Returns the
// cached natal chart plus a compact JSON snapshot suitable for
// downstream serialization.
// ============================================================

import { generateKundli } from "@/lib/kundli";
import type { BirthInput, KundliResult } from "@/lib/kundli/types";
import { birthChartCacheKey, rashiKeyFromEnglish } from "./helpers";
import type { BirthChartSnapshot } from "./types";
import type { PersonalizedCache } from "./cache";

/** Fetch (or compute + cache) the full Kundli result for a birth. */
export function loadNatalChart(birth: BirthInput, cache?: PersonalizedCache): KundliResult {
  const key = birthChartCacheKey(birth);
  if (cache) return cache.memoizeBirth(key, () => generateKundli(birth));
  return generateKundli(birth);
}

/** Compact serialization of the natal chart for API responses. */
export function snapshotBirthChart(result: KundliResult): BirthChartSnapshot {
  const asc = result.d1.ascendant;
  return {
    ascendant: {
      rashi: asc.rashi,
      rashiIndex: asc.rashiIndex,
      degreesInRashi: asc.degreesInRashi,
      nakshatra: asc.nakshatra,
      pada: asc.pada,
    },
    moonSign: result.moonSign,
    moonRashiKey: rashiKeyFromEnglish(englishFromSanskrit(result.moonSign)),
    sunSign: result.sunSign,
    sunRashiKey: rashiKeyFromEnglish(englishFromSanskrit(result.sunSign)),
    birthNakshatra: {
      nakshatra: result.birthNakshatra.nakshatra,
      pada: result.birthNakshatra.pada,
      lord: result.birthNakshatra.lord,
    },
    planets: result.d1.planets.map((p) => ({
      graha: p.graha,
      rashi: p.rashi,
      rashiIndex: p.rashiIndex,
      house: p.house,
      degreesInRashi: p.degreesInRashi,
      nakshatra: p.nakshatra,
      pada: p.pada,
      retrograde: p.retrograde,
      dignity: p.dignity,
      strengthScore: p.strengthScore,
      longitudeSidereal: p.longitudeSidereal,
    })),
  };
}

/**
 * Kundli stores rashi names in Sanskrit (e.g. "Mesha"); the
 * horoscope RASHIS table uses English (e.g. "Aries"). This map
 * bridges the two so lookup stays exact.
 */
const SANSKRIT_TO_ENGLISH: Record<string, string> = {
  Mesha: "Aries",
  Vrishabha: "Taurus",
  Mithuna: "Gemini",
  Karka: "Cancer",
  Simha: "Leo",
  Kanya: "Virgo",
  Tula: "Libra",
  Vrishchika: "Scorpio",
  Dhanu: "Sagittarius",
  Makara: "Capricorn",
  Kumbha: "Aquarius",
  Meena: "Pisces",
};

function englishFromSanskrit(name: string): string {
  return SANSKRIT_TO_ENGLISH[name] ?? name;
}
