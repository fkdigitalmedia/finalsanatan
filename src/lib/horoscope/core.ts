// ============================================================
// Horoscope Engine — Core
// ------------------------------------------------------------
// Thin bridge over the shared astronomical + panchang + kundli
// engines. This file never talks to `astronomy-engine` directly —
// it composes existing project primitives so the horoscope module
// stays a pure orchestrator.
// ============================================================

import { planetSnapshot, ayanamsaLahiri } from "@/lib/astro/core";
import type { PlanetSummary, TransitData } from "./types";
import { RASHIS } from "./constants";

/**
 * Load current planetary data (sidereal, Lahiri) for a given instant.
 * Delegates to the shared astro core — no local ephemeris code.
 */
export function loadPlanetaryData(at: Date = new Date()): TransitData {
  const snap = planetSnapshot(at);
  const planets: PlanetSummary[] = snap.map((p) => ({
    graha: p.body,
    sidereal: p.sidereal,
    rashi: RASHIS[p.rashi].english,
    rashiIndex: p.rashi,
    degreesInRashi: p.rashiDeg,
    retrograde: false, // retrograde detection lands with Phase 12.2 transit module
  }));
  return {
    referenceDate: at.toISOString(),
    planets,
    ayanamsaDegrees: ayanamsaLahiri(at),
  };
}
