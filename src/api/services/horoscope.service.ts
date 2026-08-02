// ============================================================
// Service — Horoscope
// ============================================================

import { createHoroscopeEngine } from "@/lib/horoscope";
import type { HoroscopeInput } from "@/lib/horoscope/types";

const engine = createHoroscopeEngine();

export function horoscope(input: HoroscopeInput) {
  return engine.generate(input);
}
