// ============================================================
// Horoscope Engine — Skeleton
// ------------------------------------------------------------
// Foundation only. Content generation, AI interpretation, and
// SEO surfacing land in later phases (12.2+). This class wires
// together validation, transits, panchang, and (optionally) a
// birth chart so downstream phases can plug narrative + rules
// on top without reworking the plumbing.
// ============================================================

import {
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  type LatLon,
} from "@/lib/panchang";
import { generateKundli } from "@/lib/kundli";
import type { BirthInput, KundliResult } from "@/lib/kundli/types";

import { loadPlanetaryData } from "./core";
import { DEFAULT_HOROSCOPE_CONFIG, resolveHoroscopeConfig, type HoroscopeConfig } from "./config";
import { validateHoroscopeInput } from "./validators";
import { combineDateTime } from "./helpers";
import type { HoroscopeInput, HoroscopeOutput, TransitData, ValidationResult } from "./types";

export const HOROSCOPE_ENGINE_VERSION = "0.1.0-foundation";

interface PanchangSnapshot {
  date: string;
  tithi: ReturnType<typeof getTithi>;
  nakshatra: ReturnType<typeof getNakshatra>;
  yoga: ReturnType<typeof getYoga>;
  karana: ReturnType<typeof getKarana>;
  sun: ReturnType<typeof getSunTimes>;
}

/**
 * HoroscopeEngine orchestrates the pieces required to build any
 * horoscope (daily → personalized). Each method is intentionally
 * small so Phase 12.2+ can slot in content generators without
 * touching the plumbing.
 */
export class HoroscopeEngine {
  readonly config: HoroscopeConfig;

  private initialized = false;
  private transit?: TransitData;
  private panchang?: PanchangSnapshot;
  private birthChart?: KundliResult;

  constructor(config: Partial<HoroscopeConfig> = {}) {
    this.config = resolveHoroscopeConfig(config);
  }

  /** Reset internal caches. Idempotent. */
  initialize(): void {
    this.initialized = true;
    this.transit = undefined;
    this.panchang = undefined;
    this.birthChart = undefined;
  }

  /** Validate a caller-supplied HoroscopeInput. */
  validateInput(input: HoroscopeInput): ValidationResult {
    return validateHoroscopeInput(input);
  }

  /** Cache and return current sidereal planetary data. */
  loadCurrentPlanetaryData(at: Date = new Date()): TransitData {
    this.transit = loadPlanetaryData(at);
    return this.transit;
  }

  /** Cache and return today's Panchang for the caller's location. */
  loadPanchang(input: HoroscopeInput): PanchangSnapshot {
    const loc = this.config.defaultLocation;
    const latLon: LatLon = {
      label: input.place ?? loc.place,
      lat: input.latitude ?? loc.latitude,
      lon: input.longitude ?? loc.longitude,
      tz: String(input.timezone ?? this.config.defaultTimezone),
    };
    const date = input.date ? new Date(`${input.date}T00:00:00Z`) : new Date();
    this.panchang = {
      date: date.toISOString(),
      tithi: getTithi(date),
      nakshatra: getNakshatra(date),
      yoga: getYoga(date),
      karana: getKarana(date),
      sun: getSunTimes(date, latLon),
    };
    return this.panchang;
  }

  /** Cache and return a natal chart when the input carries full birth data. */
  loadBirthChart(input: HoroscopeInput): KundliResult | undefined {
    if (input.type !== "personalized") return undefined;
    if (
      !input.date ||
      !input.time ||
      input.latitude === undefined ||
      input.longitude === undefined ||
      input.timezone === undefined
    ) {
      return undefined;
    }
    const birth: BirthInput = {
      date: input.date,
      time: input.time,
      place: input.place ?? "Unknown",
      latitude: input.latitude,
      longitude: input.longitude,
      timezone: input.timezone,
      gender: input.gender,
      language: input.language,
    };
    this.birthChart = generateKundli(birth);
    return this.birthChart;
  }

  /**
   * Foundation-phase generate(): validates the request, loads the
   * astronomical inputs, and returns a placeholder envelope. Content
   * strings and AI interpretations arrive in Phase 12.2+.
   */
  generate(input: HoroscopeInput): HoroscopeOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid horoscope input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }

    const referenceDate =
      input.date && input.time ? combineDateTime(input.date, input.time) : new Date();

    const transit = this.loadCurrentPlanetaryData(referenceDate);
    // Panchang + birth chart are loaded eagerly so downstream phases
    // can rely on them being cached on the engine instance.
    try {
      this.loadPanchang(input);
    } catch {
      /* non-fatal for foundation */
    }
    try {
      this.loadBirthChart(input);
    } catch {
      /* non-fatal for foundation */
    }

    return {
      metadata: {
        type: input.type,
        rashi: input.rashi,
        language: input.language ?? this.config.defaultLanguage,
        timezone: input.timezone ?? this.config.defaultTimezone,
        generatedAt: new Date().toISOString(),
        engineVersion: HOROSCOPE_ENGINE_VERSION,
        source: "engine",
      },
      transit,
      lucky: undefined,
      content: undefined,
      placeholder: true,
    };
  }
}

/** Convenience factory. */
export function createHoroscopeEngine(config?: Partial<HoroscopeConfig>): HoroscopeEngine {
  return new HoroscopeEngine(config ?? DEFAULT_HOROSCOPE_CONFIG);
}
