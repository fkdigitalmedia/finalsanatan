// ============================================================
// Gochar Engine — Orchestrator (Phase 13.2)
// ------------------------------------------------------------
// Public entry point. Reuses Kundli, Transit, and Dasha engines
// to produce structured JSON describing how current planetary
// transits influence the user's natal chart. Backend-only.
// NO AI text, NO frontend, NO PDF, NO SEO.
// ============================================================

import { DEFAULT_HOROSCOPE_CONFIG } from "@/lib/horoscope/config";
import { generateKundli } from "@/lib/kundli";
import { DashaEngine } from "@/lib/dasha";
import { TransitEngine } from "@/lib/transit/engine";
import { TRANSIT_PLANET_NAMES } from "@/lib/transit/constants";
import type { TransitPlanetName, TransitSnapshot } from "@/lib/transit/types";
import { GocharCache } from "./cache";
import { buildComparison } from "./comparison";
import { buildInfluence, type DashaOverlay } from "./calculator";
import { GOCHAR_DATA_SOURCE, GOCHAR_ENGINE_VERSION } from "./constants";
import { birthCacheKey, gocharCacheKey, parseYmd, round, todayInTz } from "./helpers";
import { validateGocharInput } from "./validators";
import type {
  GocharInput,
  GocharOutput,
  GocharPlanetInfluence,
  GocharSummary,
  GocharValidationResult,
  GocharVerdict,
} from "./types";

export { GOCHAR_ENGINE_VERSION };

export interface GocharEngineOptions {
  cache?: GocharCache;
  transitEngine?: TransitEngine;
  dashaEngine?: DashaEngine;
}

export class GocharEngine {
  private readonly cache: GocharCache;
  private readonly transitEngine: TransitEngine;
  private readonly dashaEngine: DashaEngine;
  private initialized = false;

  constructor(opts: GocharEngineOptions = {}) {
    this.cache = opts.cache ?? new GocharCache();
    this.transitEngine = opts.transitEngine ?? new TransitEngine();
    this.dashaEngine = opts.dashaEngine ?? new DashaEngine();
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
    this.transitEngine.initialize();
    this.dashaEngine.initialize();
  }

  validateInput(input: GocharInput): GocharValidationResult {
    return validateGocharInput(input);
  }

  generate(input: GocharInput): GocharOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid gochar input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }

    const language =
      input.language ?? input.birth.language ?? DEFAULT_HOROSCOPE_CONFIG.defaultLanguage;
    const tz =
      typeof input.birth.timezone === "string"
        ? input.birth.timezone
        : DEFAULT_HOROSCOPE_CONFIG.defaultTimezone;
    const currentDate = input.currentDate ?? todayInTz(tz);
    const includeDasha = input.includeDasha !== false;
    const planets = (input.planets ?? [...TRANSIT_PLANET_NAMES]) as TransitPlanetName[];

    const key = gocharCacheKey(input.birth, currentDate, planets, language, includeDasha);
    return this.cache.memoizeOutput(key, () =>
      this.compute(input, currentDate, language, includeDasha, planets),
    );
  }

  private compute(
    input: GocharInput,
    currentDate: string,
    language: string,
    includeDasha: boolean,
    planets: TransitPlanetName[],
  ): GocharOutput {
    const started = Date.now();

    // 1) Natal chart (cached).
    const bKey = birthCacheKey(input.birth);
    const natal = this.cache.memoizeBirth(bKey, () => generateKundli(input.birth));

    // 2) Current transit snapshot at noon of currentDate.
    const currentUtc = parseYmd(currentDate);
    const transit: TransitSnapshot = this.transitEngine.generateTransitSnapshot({
      date: currentUtc.toISOString(),
      planets,
      location: {
        latitude: input.birth.latitude,
        longitude: input.birth.longitude,
        timezone: input.birth.timezone,
      },
    });

    // 3) Optional dasha overlay — current MD/AD/PD lords.
    const dasha: DashaOverlay = includeDasha
      ? (() => {
          const d = this.dashaEngine.generate({
            birth: input.birth,
            currentDate,
            system: "vimshottari",
            language,
          });
          return {
            mahadashaLord: d.currentMahadasha?.lord ?? null,
            antardashaLord: d.currentAntardasha?.lord ?? null,
            pratyantarLord: d.currentPratyantar?.lord ?? null,
          };
        })()
      : {};

    // 4) Comparison + influence.
    const nowISO = currentUtc.toISOString();
    const comparisons = buildComparison(natal.d1, transit);
    const influences: GocharPlanetInfluence[] = comparisons.map((cmp) =>
      buildInfluence(cmp, transit, nowISO, dasha),
    );

    // 5) Summary rollup.
    const summary = summarize(influences);

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
      },
      influences,
      summary,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        engineVersion: GOCHAR_ENGINE_VERSION,
        dataSource: GOCHAR_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        timezone: input.birth.timezone,
        language,
        cacheHits: this.cache.hits,
        planetCount: influences.length,
      },
    };
  }
}

function summarize(influences: GocharPlanetInfluence[]): GocharSummary {
  if (influences.length === 0) {
    return {
      overallScore: 0,
      verdict: "neutral",
      positivePlanets: [],
      neutralPlanets: [],
      sensitivePlanets: [],
      strongestInfluence: null,
      weakestInfluence: null,
      activeDashaLords: [],
    };
  }
  const avg = round(influences.reduce((s, i) => s + i.influenceScore, 0) / influences.length);
  const strongest = influences.reduce((a, b) => (b.influenceScore > a.influenceScore ? b : a));
  const weakest = influences.reduce((a, b) => (b.influenceScore < a.influenceScore ? b : a));
  const bucket = (v: GocharVerdict) =>
    influences.filter((i) => i.verdict === v).map((i) => i.planet);
  const activeDashaLords = influences
    .filter((i) => i.dashaActive.mahadasha || i.dashaActive.antardasha || i.dashaActive.pratyantar)
    .map((i) => i.planet);
  let overallVerdict: GocharVerdict = "neutral";
  if (avg >= 62) overallVerdict = "positive";
  else if (avg < 42) overallVerdict = "sensitive";
  return {
    overallScore: avg,
    verdict: overallVerdict,
    positivePlanets: bucket("positive"),
    neutralPlanets: bucket("neutral"),
    sensitivePlanets: bucket("sensitive"),
    strongestInfluence: strongest.planet,
    weakestInfluence: weakest.planet,
    activeDashaLords,
  };
}

export function createGocharEngine(opts: GocharEngineOptions = {}): GocharEngine {
  return new GocharEngine(opts);
}

/** One-shot helper for callers who don't need an engine instance. */
export function generateGochar(input: GocharInput): GocharOutput {
  return createGocharEngine().generate(input);
}
