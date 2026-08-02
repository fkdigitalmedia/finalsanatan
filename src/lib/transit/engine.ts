// ============================================================
// Transit Engine — Orchestrator
// ------------------------------------------------------------
// Public entry point. Wires validation, caching, and per-planet
// calculation into a single `generateTransitSnapshot()` call.
// UI code (routes / components / PDFs) MUST talk to this module,
// never to `calculator.ts` or `core.ts` directly.
// ============================================================

import {
  DEFAULT_TRANSIT_LOCATION,
  TRANSIT_ENGINE_VERSION,
  TRANSIT_PLANET_NAMES,
} from "./constants";
import { ayanamsaAt } from "./core";
import { calculatePlanetTransit } from "./calculator";
import { TransitCache, cacheKey } from "./cache";
import { parseDate } from "./helpers";
import { validateTransitInput } from "./validators";
import type {
  PlanetMetadata,
  PlanetTransit,
  TransitInput,
  TransitLocation,
  TransitPlanetName,
  TransitSnapshot,
  TransitValidationResult,
} from "./types";

export class TransitEngine {
  private readonly cache: TransitCache<PlanetTransit>;
  private initialized = false;

  constructor(cache?: TransitCache<PlanetTransit>) {
    this.cache = cache ?? new TransitCache<PlanetTransit>({ ttlMs: 60_000 });
  }

  /** Reset cached calculations. Idempotent. */
  initialize(): void {
    this.initialized = true;
    this.cache.clear();
  }

  /** Validate a caller-supplied TransitInput. */
  validateInput(input: TransitInput = {}): TransitValidationResult {
    return validateTransitInput(input);
  }

  /**
   * Load raw astronomical data — currently just the ayanamsa. Kept
   * as a distinct step so future phases (nutation, refraction, etc.)
   * can plug in without changing the public surface.
   */
  loadAstronomyData(date: Date): { ayanamsaDegrees: number } {
    return { ayanamsaDegrees: ayanamsaAt(date) };
  }

  /** Per-planet transit — cached by `(planet, minute-bucketed date)`. */
  calculatePlanetPositions(planets: TransitPlanetName[], date: Date): PlanetTransit[] {
    const bucketMs = 60_000;
    const bucket = Math.floor(date.getTime() / bucketMs) * bucketMs;
    return planets.map((planet) =>
      this.cache.memoize(cacheKey({ planet, bucket }), () => calculatePlanetTransit(planet, date)),
    );
  }

  /** Convenience wrappers around calculator primitives. */
  calculateCurrentRashi(planet: TransitPlanetName, date: Date): string {
    return calculatePlanetTransit(planet, date).rashi;
  }
  calculateNakshatra(planet: TransitPlanetName, date: Date): string {
    return calculatePlanetTransit(planet, date).nakshatra;
  }
  calculatePada(planet: TransitPlanetName, date: Date): 1 | 2 | 3 | 4 {
    return calculatePlanetTransit(planet, date).pada;
  }
  detectRetrograde(planet: TransitPlanetName, date: Date): boolean {
    return calculatePlanetTransit(planet, date).retrograde;
  }
  calculateNextIngress(planet: TransitPlanetName, date: Date): string | null {
    return calculatePlanetTransit(planet, date).nextSignChange;
  }

  /**
   * Full snapshot: validated inputs → per-planet compute → summary.
   * Throws on invalid input; returns pure JSON otherwise.
   */
  generateTransitSnapshot(input: TransitInput = {}): TransitSnapshot {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid transit input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }

    const date = parseDate(input.date) ?? new Date();
    const location: TransitLocation = {
      place: input.location?.place ?? DEFAULT_TRANSIT_LOCATION.place,
      latitude: input.location?.latitude ?? DEFAULT_TRANSIT_LOCATION.latitude,
      longitude: input.location?.longitude ?? DEFAULT_TRANSIT_LOCATION.longitude,
      timezone: input.location?.timezone ?? DEFAULT_TRANSIT_LOCATION.timezone,
    };
    const planets = input.planets ?? [...TRANSIT_PLANET_NAMES];
    const positions = this.calculatePlanetPositions(planets, date);
    const summary: PlanetMetadata[] = positions.map((p) => ({
      name: p.name,
      rashi: p.rashi,
      nakshatra: p.nakshatra,
      retrograde: p.retrograde,
    }));

    return {
      date: date.toISOString(),
      location,
      timezone: location.timezone,
      planets: positions,
      summary,
      ayanamsaDegrees: this.loadAstronomyData(date).ayanamsaDegrees,
      computedAt: new Date().toISOString(),
      engineVersion: TRANSIT_ENGINE_VERSION,
    };
  }
}

/** Convenience factory. */
export function createTransitEngine(): TransitEngine {
  return new TransitEngine();
}

/** One-shot helper for callers who don't need to keep an instance. */
export function generateTransitSnapshot(input?: TransitInput): TransitSnapshot {
  return createTransitEngine().generateTransitSnapshot(input);
}
