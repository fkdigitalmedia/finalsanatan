// ============================================================
// Yearly Horoscope Engine — Composition layer
// ------------------------------------------------------------
// Runs the Monthly engine once per calendar month and rolls the
// results up. No astronomy here — this file only orchestrates.
// ============================================================

import type { MonthlyHoroscopeOutput } from "../monthly/types";
import { MonthlyHoroscopeEngine } from "../monthly/engine";
import type { YearlyHoroscopeInput } from "./types";

export function runMonthlyForYear(
  monthly: MonthlyHoroscopeEngine,
  input: YearlyHoroscopeInput,
): MonthlyHoroscopeOutput[] {
  const out: MonthlyHoroscopeOutput[] = [];
  for (let m = 1; m <= 12; m++) {
    out.push(
      monthly.generate({
        year: input.year,
        month: m,
        rashi: input.rashi,
        timezone: input.timezone,
        language: input.language,
        latitude: input.latitude,
        longitude: input.longitude,
        location: input.location,
      }),
    );
  }
  return out;
}
