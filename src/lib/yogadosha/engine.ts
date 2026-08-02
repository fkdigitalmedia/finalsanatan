// ============================================================
// Dosha & Yoga Detection Engine — Orchestrator (Phase 13.4)
// ------------------------------------------------------------
// Public entry point. Reuses the Kundli Engine for the natal
// chart, then runs every registered rule against a derived,
// read-only ChartContext. Backend-only: NO AI, NO frontend,
// NO PDF, NO SEO. JSON only.
// ============================================================

import { DEFAULT_HOROSCOPE_CONFIG } from "@/lib/horoscope/config";
import { generateKundli } from "@/lib/kundli";
import { YogaDoshaCache } from "./cache";
import { BALANCE_WEIGHTS, YOGADOSHA_DATA_SOURCE, YOGADOSHA_ENGINE_VERSION } from "./constants";
import { buildChartContext } from "./context";
import {
  birthCacheKey,
  clamp,
  rashiOf,
  round,
  strengthFromConfidence,
  yogaDoshaCacheKey,
} from "./helpers";
import { RuleRegistry, defaultRegistry } from "./registry";
import { validateRuleOutcome, validateYogaDoshaInput } from "./validators";
import type {
  DetectionResult,
  YogaDoshaInput,
  YogaDoshaOutput,
  YogaDoshaSummary,
  YogaDoshaValidationResult,
} from "./types";

export { YOGADOSHA_ENGINE_VERSION };

export interface YogaDoshaEngineOptions {
  cache?: YogaDoshaCache;
  registry?: RuleRegistry;
}

export class YogaDoshaEngine {
  private readonly cache: YogaDoshaCache;
  private readonly registry: RuleRegistry;
  private initialized = false;

  constructor(opts: YogaDoshaEngineOptions = {}) {
    this.cache = opts.cache ?? new YogaDoshaCache();
    this.registry = opts.registry ?? defaultRegistry;
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
  }

  /** All rule ids currently registered. */
  ruleIds(): string[] {
    return this.registry.ids();
  }

  validateInput(input: YogaDoshaInput): YogaDoshaValidationResult {
    return validateYogaDoshaInput(input, this.registry.ids());
  }

  generate(input: YogaDoshaInput): YogaDoshaOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid yoga/dosha input: ${validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("; ")}`,
      );
    }
    const language =
      input.language ?? input.birth.language ?? DEFAULT_HOROSCOPE_CONFIG.defaultLanguage;
    const includeUndetected = input.includeUndetected !== false;
    const key = yogaDoshaCacheKey(input.birth, language, input.rules, includeUndetected);
    return this.cache.memoizeOutput(key, () => this.compute(input, language, includeUndetected));
  }

  private compute(
    input: YogaDoshaInput,
    language: string,
    includeUndetected: boolean,
  ): YogaDoshaOutput {
    const started = Date.now();

    const natal = this.cache.memoizeBirth(birthCacheKey(input.birth), () =>
      generateKundli(input.birth),
    );
    const ctx = buildChartContext(natal.d1);
    const rules = this.registry.list(input.rules);

    const all: DetectionResult[] = [];
    for (const rule of rules) {
      let outcome;
      try {
        outcome = rule.evaluate(ctx);
      } catch (e) {
        outcome = {
          detected: false,
          confidence: 0,
          ruleApplied: `Rule failed: ${e instanceof Error ? e.message : "unknown error"}`,
          planetCombination: [],
          affectedHouses: [],
        };
      }
      const check = validateRuleOutcome(rule.id, outcome);
      if (!check.ok) {
        outcome = {
          detected: false,
          confidence: 0,
          ruleApplied: `Rule produced an invalid outcome: ${check.errors
            .map((e) => `${e.field} ${e.message}`)
            .join(", ")}`,
          planetCombination: [],
          affectedHouses: [],
        };
      }
      all.push({
        id: rule.id,
        name: rule.name,
        sanskrit: rule.sanskrit,
        kind: rule.kind,
        category: rule.category,
        description: rule.description,
        detected: outcome.detected,
        confidence: round(clamp(outcome.confidence, 0, 100)),
        ruleApplied: outcome.ruleApplied,
        planetCombination: outcome.planetCombination,
        affectedHouses: outcome.affectedHouses,
        strength: outcome.strength ?? strengthFromConfidence(outcome.confidence, outcome.detected),
        cancellations: outcome.cancellations ?? [],
        details: outcome.details ?? {},
      });
    }

    const visible = includeUndetected ? all : all.filter((d) => d.detected);
    const summary = summarize(all);

    return {
      profile: {
        birthDate: input.birth.date,
        birthTime: input.birth.time,
        birthPlace: input.birth.place,
        latitude: input.birth.latitude,
        longitude: input.birth.longitude,
        timezone: input.birth.timezone,
        language,
        lagnaRashiIndex: ctx.lagnaRashiIndex,
        lagnaRashi: rashiOf(ctx.lagnaRashiIndex),
        moonRashiIndex: ctx.moonRashiIndex,
        moonRashi: rashiOf(ctx.moonRashiIndex),
      },
      doshas: visible.filter((d) => d.kind === "dosha"),
      yogas: visible.filter((d) => d.kind === "yoga"),
      detections: visible,
      summary,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        engineVersion: YOGADOSHA_ENGINE_VERSION,
        dataSource: YOGADOSHA_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        timezone: input.birth.timezone,
        language,
        ruleCount: rules.length,
        cacheHits: this.cache.hits,
      },
    };
  }
}

function summarize(all: DetectionResult[]): YogaDoshaSummary {
  const detected = all.filter((d) => d.detected);
  const doshas = detected.filter((d) => d.kind === "dosha");
  const yogas = detected.filter((d) => d.kind === "yoga");
  const strongest = detected.reduce<DetectionResult | null>(
    (best, d) => (!best || d.confidence > best.confidence ? d : best),
    null,
  );
  const weighted =
    yogas.reduce((s, y) => s + (y.confidence / 100) * BALANCE_WEIGHTS.yoga, 0) +
    doshas.reduce((s, d) => s + (d.confidence / 100) * BALANCE_WEIGHTS.dosha, 0);

  return {
    totalRulesEvaluated: all.length,
    detectedCount: detected.length,
    doshaCount: doshas.length,
    yogaCount: yogas.length,
    detectedIds: detected.map((d) => d.id),
    strongest: strongest
      ? { id: strongest.id, name: strongest.name, confidence: strongest.confidence }
      : null,
    balanceScore: round(clamp(50 + weighted * 10, 0, 100)),
  };
}

export function createYogaDoshaEngine(opts: YogaDoshaEngineOptions = {}): YogaDoshaEngine {
  return new YogaDoshaEngine(opts);
}

/** One-shot helper for callers who don't need an engine instance. */
export function detectYogasAndDoshas(input: YogaDoshaInput): YogaDoshaOutput {
  return createYogaDoshaEngine().generate(input);
}
