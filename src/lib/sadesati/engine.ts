// ============================================================
// Sade Sati & Dhaiya Engine — Orchestrator (Phase 13.3)
// ------------------------------------------------------------
// Public entry point. Reuses the Kundli Engine (natal Moon /
// Lagna) and the Transit Engine core (Saturn ephemeris) to
// produce structured JSON. Backend-only: NO AI, NO frontend,
// NO PDF, NO SEO.
// ============================================================

import { DEFAULT_HOROSCOPE_CONFIG } from "@/lib/horoscope/config";
import { generateKundli } from "@/lib/kundli";
import { SadeSatiCache } from "./cache";
import {
  buildCycles,
  buildDhaiyaPeriods,
  buildDhaiyaStatus,
  buildSadeSatiStatus,
  pickCycle,
} from "./calculator";
import {
  DAY_MS,
  DEFAULT_WINDOW_YEARS,
  PHASE_ORDER,
  SADESATI_DATA_SOURCE,
  SADESATI_ENGINE_VERSION,
} from "./constants";
import {
  addDays,
  birthCacheKey,
  houseFromRashi,
  norm12,
  parseYmd,
  rashiOf,
  round,
  sadeSatiCacheKey,
  todayInTz,
} from "./helpers";
import { buildSaturnOccupancies, occupancyAt, saturnDailySpeed, saturnLongitude } from "./saturn";
import { validateSadeSatiInput } from "./validators";
import type {
  SadeSatiInput,
  SadeSatiOutput,
  SadeSatiPhase,
  SadeSatiValidationResult,
  SaturnTransitSummary,
} from "./types";

export { SADESATI_ENGINE_VERSION };

export interface SadeSatiEngineOptions {
  cache?: SadeSatiCache;
}

export class SadeSatiEngine {
  private readonly cache: SadeSatiCache;
  private initialized = false;

  constructor(opts: SadeSatiEngineOptions = {}) {
    this.cache = opts.cache ?? new SadeSatiCache();
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
  }

  validateInput(input: SadeSatiInput): SadeSatiValidationResult {
    return validateSadeSatiInput(input);
  }

  generate(input: SadeSatiInput): SadeSatiOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid sade sati input: ${validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("; ")}`,
      );
    }

    const language =
      input.language ?? input.birth.language ?? DEFAULT_HOROSCOPE_CONFIG.defaultLanguage;
    const tz =
      typeof input.birth.timezone === "string"
        ? input.birth.timezone
        : DEFAULT_HOROSCOPE_CONFIG.defaultTimezone;
    const currentDate = input.currentDate ?? todayInTz(tz);
    const windowYears = input.windowYears ?? DEFAULT_WINDOW_YEARS;

    const key = sadeSatiCacheKey(input.birth, currentDate, language, windowYears);
    return this.cache.memoizeOutput(key, () =>
      this.compute(input, currentDate, language, windowYears),
    );
  }

  private compute(
    input: SadeSatiInput,
    currentDate: string,
    language: string,
    windowYears: number,
  ): SadeSatiOutput {
    const started = Date.now();

    // 1) Natal chart (cached) → Moon sign + Lagna.
    const natal = this.cache.memoizeBirth(birthCacheKey(input.birth), () =>
      generateKundli(input.birth),
    );
    const moonPlanet = natal.d1.planets.find((p) => p.graha === "Moon");
    const moonRashiIndex = moonPlanet ? moonPlanet.rashiIndex : natal.d1.ascendant.rashiIndex;
    const lagnaRashiIndex = natal.d1.ascendant.rashiIndex;

    // 2) Saturn sign-occupancy timeline around the current date.
    const now = parseYmd(currentDate);
    const nowISO = now.toISOString();
    const half = (windowYears / 2) * 365.25;
    const from = addDays(now, -half);
    const to = addDays(now, half);
    const occKey = `${from.toISOString().slice(0, 10)}|${to.toISOString().slice(0, 10)}`;
    const occupancies = this.cache.memoizeOccupancy(occKey, () => buildSaturnOccupancies(from, to));

    // 3) Sade Sati cycles + status.
    const cycles = buildCycles(occupancies, moonRashiIndex, nowISO);
    const currentCycle = pickCycle(cycles, "active");
    const previousCycle = pickCycle(cycles, "past");
    const nextCycle = pickCycle(cycles, "upcoming");
    const sadeSati = buildSadeSatiStatus(currentCycle, nowISO);

    const reference = currentCycle ?? nextCycle ?? previousCycle;
    const phaseByKey = (k: (typeof PHASE_ORDER)[number]): SadeSatiPhase | null =>
      reference?.phases.find((p) => p.key === k) ?? null;

    // 4) Dhaiya (Kantaka / Ashtama Shani).
    const dhaiyaPeriods = buildDhaiyaPeriods(occupancies, moonRashiIndex, nowISO);
    const dhaiya = buildDhaiyaStatus(dhaiyaPeriods, nowISO);

    // 5) Saturn transit summary.
    const saturnTransit = buildSaturnSummary(now, occupancies, moonRashiIndex, lagnaRashiIndex);

    return {
      profile: {
        birthDate: input.birth.date,
        birthTime: input.birth.time,
        birthPlace: input.birth.place,
        latitude: input.birth.latitude,
        longitude: input.birth.longitude,
        timezone: input.birth.timezone,
        currentDate,
        language,
        moonRashiIndex,
        moonRashi: rashiOf(moonRashiIndex),
        lagnaRashiIndex,
        lagnaRashi: rashiOf(lagnaRashiIndex),
      },
      sadeSati,
      phases: {
        first: phaseByKey("first"),
        second: phaseByKey("second"),
        third: phaseByKey("third"),
      },
      cycles,
      previousCycle,
      currentCycle,
      nextCycle,
      dhaiya,
      dhaiyaPeriods,
      saturnTransit,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        engineVersion: SADESATI_ENGINE_VERSION,
        dataSource: SADESATI_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        timezone: input.birth.timezone,
        language,
        windowYears,
        occupanciesScanned: occupancies.length,
        cacheHits: this.cache.hits,
      },
    };
  }
}

function buildSaturnSummary(
  now: Date,
  occupancies: ReturnType<typeof buildSaturnOccupancies>,
  moonRashiIndex: number,
  lagnaRashiIndex: number,
): SaturnTransitSummary {
  const lon = saturnLongitude(now);
  const rashiIndex = Math.floor(lon / 30) % 12;
  const speed = saturnDailySpeed(now);
  const stay = occupancyAt(occupancies, now);
  const nextIndex = norm12(rashiIndex + 1);

  return {
    siderealLongitude: round(lon, 4),
    rashiIndex,
    rashi: rashiOf(rashiIndex),
    degreesInRashi: round(lon - rashiIndex * 30, 4),
    retrograde: speed < 0,
    dailySpeed: speed,
    houseFromMoon: houseFromRashi(rashiIndex, moonRashiIndex),
    houseFromLagna: houseFromRashi(rashiIndex, lagnaRashiIndex),
    natalRashiIndex: moonRashiIndex,
    natalRashi: rashiOf(moonRashiIndex),
    currentSignStartISO: stay?.startISO ?? null,
    currentSignEndISO: stay?.endISO ?? null,
    nextSignRashiIndex: nextIndex,
    nextSignRashi: rashiOf(nextIndex),
    daysUntilNextSign: stay ? round((Date.parse(stay.endISO) - now.getTime()) / DAY_MS, 2) : null,
  };
}

export function createSadeSatiEngine(opts: SadeSatiEngineOptions = {}): SadeSatiEngine {
  return new SadeSatiEngine(opts);
}

/** One-shot helper for callers who don't need an engine instance. */
export function generateSadeSati(input: SadeSatiInput): SadeSatiOutput {
  return createSadeSatiEngine().generate(input);
}
