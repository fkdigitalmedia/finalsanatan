// ============================================================
// AI Interpretation Engine — Orchestrator
// ------------------------------------------------------------
// validate -> resolve prompt -> cache lookup -> provider ->
// validate output -> format Markdown -> cache store.
//
// This layer performs ZERO astrology. Every number it narrates
// comes from the calculation engines (Kundli, Horoscope, Dasha,
// Gochar, Panchang, Muhurat, Numerology, Vastu, Yoga/Dosha).
// ============================================================

import { measure } from "@/lib/perf/metrics";
import { interpretationCache, buildCacheKey, InterpretationCache } from "./cache";
import {
  DEFAULT_DEPTH,
  DEFAULT_LANGUAGE,
  ENGINE_VERSION,
  LOW_CONFIDENCE_THRESHOLD,
} from "./constants";
import { formatReport } from "./formatter";
import { getPrompt, resolvePrompt } from "./prompts";
import { completeWithFallback } from "./providers";
import { assertValidInput, validateProviderOutput } from "./validators";
import type { InterpretationInput, InterpretationResult } from "./types";

export interface EngineOptions {
  /** Bring your own cache (tests, per-request isolation). */
  cache?: InterpretationCache;
  /** Disable caching entirely. */
  cacheEnabled?: boolean;
}

export class AiInterpretationEngine {
  readonly version = ENGINE_VERSION;
  private readonly cache: InterpretationCache;
  private readonly cacheEnabled: boolean;

  constructor(opts: EngineOptions = {}) {
    this.cache = opts.cache ?? interpretationCache;
    this.cacheEnabled = opts.cacheEnabled ?? true;
  }

  /** Generate a Markdown interpretation from structured engine JSON. */
  async generate(rawInput: InterpretationInput): Promise<InterpretationResult> {
    const started = Date.now();
    assertValidInput(rawInput);

    const depth = rawInput.depth ?? DEFAULT_DEPTH;
    const language = rawInput.language ?? DEFAULT_LANGUAGE;
    const template = getPrompt(rawInput.report);
    const lowConfidence =
      typeof rawInput.confidence === "number" && rawInput.confidence < LOW_CONFIDENCE_THRESHOLD;

    const cacheKey = buildCacheKey({
      report: rawInput.report,
      depth,
      language,
      templateVersion: template.version,
      data: rawInput.data,
      context: rawInput.context,
    });

    const useCache = this.cacheEnabled && !rawInput.bypassCache;
    if (useCache) {
      const hit = this.cache.get(cacheKey);
      if (hit) {
        return {
          ...hit,
          meta: { ...hit.meta, cached: true, durationMs: Date.now() - started },
        };
      }
    }

    const resolved = resolvePrompt({
      report: rawInput.report,
      depth,
      language,
      data: rawInput.data,
      context: rawInput.context,
      lowConfidence,
    });

    const completion = await completeWithFallback({
      featureKey: resolved.featureKey,
      system: resolved.system,
      prompt: resolved.prompt,
      maxTokens: resolved.maxTokens,
      model: rawInput.model,
      userId: rawInput.userId ?? null,
    });

    const outputCheck = validateProviderOutput(completion.text);
    if (!outputCheck.valid) {
      throw new Error(
        `AI provider returned an unusable response: ${outputCheck.issues
          .map((i) => i.message)
          .join("; ")}`,
      );
    }

    const formatted = formatReport(completion.text, {
      title: template.label,
      language,
      lowConfidence,
    });

    const result: InterpretationResult = {
      report: rawInput.report,
      depth,
      language,
      markdown: formatted.markdown,
      sections: formatted.sections,
      meta: {
        templateId: resolved.templateId,
        templateVersion: resolved.version,
        featureKey: resolved.featureKey,
        provider: completion.provider,
        model: completion.model,
        adapter: completion.adapter,
        cached: false,
        cacheKey,
        wordCount: formatted.wordCount,
        durationMs: Date.now() - started,
        lowConfidence,
        generatedAt: new Date().toISOString(),
      },
    };

    if (useCache) this.cache.set(cacheKey, result);
    return result;
  }

  /** Drop every cached narration for one report kind. */
  invalidate(report: InterpretationInput["report"]): number {
    return this.cache.invalidateReport(report);
  }

  clearCache(): void {
    this.cache.clear();
  }

  cacheStats(): { size: number; hits: number; misses: number } {
    return { size: this.cache.size, hits: this.cache.hits, misses: this.cache.misses };
  }
}

/** Shared instance for app code. */
export const aiInterpretationEngine = new AiInterpretationEngine();

/** One-shot helper. Timed so the AI budget is graded on real completions. */
export function interpret(input: InterpretationInput): Promise<InterpretationResult> {
  return measure("ai", input.report ?? "interpretation", () =>
    aiInterpretationEngine.generate(input),
  );
}

export function createAiInterpretationEngine(opts?: EngineOptions): AiInterpretationEngine {
  return new AiInterpretationEngine(opts);
}
