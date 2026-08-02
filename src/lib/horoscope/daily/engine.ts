// ============================================================
// Daily Horoscope Engine — Orchestrator
// ------------------------------------------------------------
// Public entry point for Phase 12.3. Wires validation, caching,
// transit + panchang, and scoring into a single structured JSON
// payload. Contains NO natural-language text and NO AI calls.
// ============================================================

import { TransitCache } from "@/lib/transit/cache";
import { TransitEngine } from "@/lib/transit";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { DEFAULT_HOROSCOPE_CONFIG } from "../config";
import { calculateDailyRaw } from "./calculator";
import { DAILY_DATA_SOURCE, DAILY_ENGINE_VERSION } from "./constants";
import { dailyCacheKey, localDateInTz, parseDailyDate } from "./helpers";
import { computeDailyScores } from "./score";
import { validateDailyInput } from "./validators";
import type { DailyHoroscopeInput, DailyHoroscopeOutput, DailyValidationResult } from "./types";

export class DailyHoroscopeEngine {
  private readonly transitEngine: TransitEngine;
  private readonly cache: TransitCache<DailyHoroscopeOutput>;
  private initialized = false;

  constructor(
    opts: { transitEngine?: TransitEngine; cache?: TransitCache<DailyHoroscopeOutput> } = {},
  ) {
    this.transitEngine = opts.transitEngine ?? new TransitEngine();
    this.cache =
      opts.cache ??
      new TransitCache<DailyHoroscopeOutput>({ ttlMs: 15 * 60 * 1000, maxEntries: 128 });
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
    this.transitEngine.initialize();
  }

  validateInput(input: DailyHoroscopeInput): DailyValidationResult {
    return validateDailyInput(input);
  }

  /**
   * Full daily payload — pure structured JSON. Reuses TransitEngine
   * cache internally and short-circuits identical requests via its
   * own cache (keyed on date + rashi + tz + language).
   */
  generate(input: DailyHoroscopeInput): DailyHoroscopeOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid daily horoscope input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }

    return this.cache.memoize(dailyCacheKey(input), () => this.compute(input));
  }

  private compute(input: DailyHoroscopeInput): DailyHoroscopeOutput {
    const started = Date.now();
    const tzRaw = input.timezone ?? DEFAULT_HOROSCOPE_CONFIG.defaultTimezone;
    const tzString = typeof tzRaw === "string" ? tzRaw : DEFAULT_HOROSCOPE_CONFIG.defaultTimezone;

    const location: LatLon = {
      lat: input.latitude ?? DEFAULT_HOROSCOPE_CONFIG.defaultLocation.latitude,
      lon: input.longitude ?? DEFAULT_HOROSCOPE_CONFIG.defaultLocation.longitude,
      label: input.location ?? DEFAULT_HOROSCOPE_CONFIG.defaultLocation.place,
      tz: tzString,
    };

    const referenceDate = parseDailyDate(input.date, tzString);
    const raw = calculateDailyRaw(this.transitEngine, referenceDate, input.rashi, location);
    const nowIso = new Date().toISOString();
    const scores = computeDailyScores(raw.transit.planets, input.rashi, nowIso);

    return {
      date: input.date ?? localDateInTz(referenceDate, tzString),
      rashi: input.rashi,
      planetaryInfluence: raw.planetaryInfluence,
      moonStatus: raw.moon,
      transits: {
        referenceInstant: raw.transit.date,
        ayanamsaDegrees: raw.transit.ayanamsaDegrees,
        planetCount: raw.transit.planets.length,
      },
      panchang: raw.panchang,
      luckyFactors: raw.lucky,
      scores,
      metadata: {
        calculationTimestamp: nowIso,
        timezone: tzRaw,
        engineVersion: DAILY_ENGINE_VERSION,
        language: input.language ?? DEFAULT_HOROSCOPE_CONFIG.defaultLanguage,
        dataSource: DAILY_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
      },
    };
  }
}

export function createDailyHoroscopeEngine(): DailyHoroscopeEngine {
  return new DailyHoroscopeEngine();
}

/** One-shot helper for callers who don't need to keep an instance. */
export function generateDailyHoroscope(input: DailyHoroscopeInput): DailyHoroscopeOutput {
  return createDailyHoroscopeEngine().generate(input);
}
