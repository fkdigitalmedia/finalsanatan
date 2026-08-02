// ============================================================
// Personalized Horoscope Engine — Orchestrator (Phase 12.6)
// ------------------------------------------------------------
// Public entry point. Composes natal chart + live transits +
// daily/weekly/monthly/yearly rollups into a single structured
// personalized payload. Backend only — NO AI text, NO frontend,
// NO PDF, NO SEO.
// ============================================================

import { TransitEngine } from "@/lib/transit";
import { DailyHoroscopeEngine } from "../daily/engine";
import { WeeklyHoroscopeEngine } from "../weekly/engine";
import { MonthlyHoroscopeEngine } from "../monthly/engine";
import { YearlyHoroscopeEngine } from "../yearly/engine";
import { DEFAULT_HOROSCOPE_CONFIG } from "../config";
import { loadNatalChart, snapshotBirthChart } from "./birthchart";
import { PersonalizedCache } from "./cache";
import { computePersonalizedScores } from "./calculator";
import { buildComparison, buildPlanetInfluence } from "./comparison";
import { PERSONALIZED_DATA_SOURCE, PERSONALIZED_ENGINE_VERSION } from "./constants";
import { birthChartCacheKey, parseYmd, personalizedCacheKey, todayInTz } from "./helpers";
import { buildTimeline, runTimelineEngines, TimelineEngines } from "./timeline";
import { loadCurrentTransits } from "./transits";
import { validatePersonalizedInput } from "./validators";
import type {
  PersonalizedHoroscopeOutput,
  PersonalizedInput,
  PersonalizedValidationResult,
} from "./types";

export { PERSONALIZED_ENGINE_VERSION };

export interface PersonalizedEngineOptions {
  transitEngine?: TransitEngine;
  daily?: DailyHoroscopeEngine;
  weekly?: WeeklyHoroscopeEngine;
  monthly?: MonthlyHoroscopeEngine;
  yearly?: YearlyHoroscopeEngine;
  cache?: PersonalizedCache;
}

export class PersonalizedHoroscopeEngine {
  private readonly transitEngine: TransitEngine;
  private readonly engines: TimelineEngines;
  private readonly cache: PersonalizedCache;
  private initialized = false;

  constructor(opts: PersonalizedEngineOptions = {}) {
    this.transitEngine = opts.transitEngine ?? new TransitEngine();
    this.engines = {
      daily: opts.daily ?? new DailyHoroscopeEngine(),
      weekly: opts.weekly ?? new WeeklyHoroscopeEngine(),
      monthly: opts.monthly ?? new MonthlyHoroscopeEngine(),
      yearly: opts.yearly ?? new YearlyHoroscopeEngine(),
    };
    this.cache = opts.cache ?? new PersonalizedCache();
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
    this.transitEngine.initialize();
    this.engines.daily.initialize();
    this.engines.weekly.initialize();
    this.engines.monthly.initialize();
    this.engines.yearly.initialize();
  }

  validateInput(input: PersonalizedInput): PersonalizedValidationResult {
    return validatePersonalizedInput(input);
  }

  generate(input: PersonalizedInput): PersonalizedHoroscopeOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid personalized horoscope input: ${validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("; ")}`,
      );
    }

    const period = input.period ?? "daily";
    const language =
      input.language ?? input.birth.language ?? DEFAULT_HOROSCOPE_CONFIG.defaultLanguage;
    const tz =
      typeof input.birth.timezone === "string"
        ? input.birth.timezone
        : DEFAULT_HOROSCOPE_CONFIG.defaultTimezone;
    const currentDate = input.currentDate ?? todayInTz(tz);
    const birthKey = birthChartCacheKey(input.birth);
    const cacheKey = personalizedCacheKey(birthKey, currentDate, period, language);

    return this.cache.memoizeOutput(cacheKey, () =>
      this.compute({ ...input, period, language, currentDate }),
    );
  }

  private compute(
    input: PersonalizedInput & {
      period: NonNullable<PersonalizedInput["period"]>;
      language: string;
      currentDate: string;
    },
  ): PersonalizedHoroscopeOutput {
    const started = Date.now();
    const nowIso = new Date().toISOString();

    // 1) Natal chart (cached).
    const natal = loadNatalChart(input.birth, this.cache);
    const chartSnapshot = snapshotBirthChart(natal);

    // 2) Live transits at currentDate noon (cached per minute-bucket).
    const referenceInstant = parseYmd(input.currentDate);
    const transitSnapshot = loadCurrentTransits(
      this.transitEngine,
      referenceInstant,
      input.birth,
      this.cache,
    );

    // 3) Comparison + planet influence.
    const comparison = buildComparison(natal.d1, transitSnapshot);
    const planetInfluence = buildPlanetInfluence(comparison);

    // 4) Timeline via existing engines.
    const payloads = runTimelineEngines(
      this.engines,
      chartSnapshot.moonRashiKey,
      input.birth,
      input.currentDate,
      input.period,
    );
    const timeline = buildTimeline(payloads, planetInfluence);

    // 5) Personalized scores.
    const daily = payloads.daily!;
    const scores = computePersonalizedScores(daily, chartSnapshot, planetInfluence, nowIso);

    // 6) Lucky factors: reuse daily engine output.
    const luckyFactors = daily.luckyFactors;

    return {
      profile: {
        birthDate: input.birth.date,
        birthTime: input.birth.time,
        birthPlace: input.birth.place,
        latitude: input.birth.latitude,
        longitude: input.birth.longitude,
        timezone: input.birth.timezone,
        language: input.language,
        currentDate: input.currentDate,
        period: input.period,
        moonRashiKey: chartSnapshot.moonRashiKey,
        sunRashiKey: chartSnapshot.sunRashiKey,
        ascendantRashi: chartSnapshot.ascendant.rashi,
      },
      birthChart: chartSnapshot,
      transits: transitSnapshot,
      comparison,
      planetInfluence,
      scores,
      timeline,
      luckyFactors,
      raw: {
        daily: payloads.daily,
        weekly: payloads.weekly,
        monthly: payloads.monthly,
        yearly: payloads.yearly,
      },
      metadata: {
        calculationTimestamp: nowIso,
        timezone: input.birth.timezone,
        engineVersion: PERSONALIZED_ENGINE_VERSION,
        language: input.language,
        dataSource: PERSONALIZED_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        period: input.period,
        cacheHits: this.cache.hits,
      },
    };
  }
}

export function createPersonalizedHoroscopeEngine(): PersonalizedHoroscopeEngine {
  return new PersonalizedHoroscopeEngine();
}

/** One-shot helper for callers who don't need to keep an instance. */
export function generatePersonalizedHoroscope(
  input: PersonalizedInput,
): PersonalizedHoroscopeOutput {
  return createPersonalizedHoroscopeEngine().generate(input);
}
