// ============================================================
// Dasha Engine — Orchestrator (Phase 13.1)
// ------------------------------------------------------------
// Public entry point. Reuses the Kundli engine for the natal
// chart, delegates system-specific math to a DashaSystem, then
// derives current/previous/next slices in a system-agnostic way.
// Backend-only. NO AI text, NO frontend, NO PDF, NO SEO.
// ============================================================

import { generateKundli } from "@/lib/kundli";
import { toUtcDate } from "@/lib/kundli/time";
import { DEFAULT_HOROSCOPE_CONFIG } from "@/lib/horoscope/config";
import { DashaCache } from "./cache";
import { resolveTimelinePosition } from "./calculator";
import { DASHA_DATA_SOURCE, DASHA_ENGINE_VERSION, IMPLEMENTED_SYSTEMS } from "./constants";
import { birthKey as computeBirthKey, dashaCacheKey, parseYmd, todayInTz } from "./helpers";
import { VimshottariSystem } from "./vimshottari";
import { validateDashaInput } from "./validators";
import type {
  DashaInput,
  DashaOutput,
  DashaSystem,
  DashaSystemKey,
  DashaValidationResult,
} from "./types";

export { DASHA_ENGINE_VERSION };

export interface DashaEngineOptions {
  cache?: DashaCache;
  /** Custom systems to register beyond the built-in Vimshottari. */
  systems?: DashaSystem[];
}

export class DashaEngine {
  private readonly cache: DashaCache;
  private readonly systems = new Map<DashaSystemKey, DashaSystem>();
  private initialized = false;

  constructor(opts: DashaEngineOptions = {}) {
    this.cache = opts.cache ?? new DashaCache();
    this.registerSystem(VimshottariSystem);
    for (const s of opts.systems ?? []) this.registerSystem(s);
  }

  /** Register (or override) a dasha system implementation. */
  registerSystem(system: DashaSystem): void {
    this.systems.set(system.key, system);
  }

  /** List keys of systems currently available on this engine instance. */
  listSystems(): DashaSystemKey[] {
    return Array.from(this.systems.keys());
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
  }

  validateInput(input: DashaInput): DashaValidationResult {
    return validateDashaInput(input);
  }

  generate(input: DashaInput): DashaOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid dasha input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }

    const systemKey: DashaSystemKey = input.system ?? "vimshottari";
    if (!IMPLEMENTED_SYSTEMS.includes(systemKey)) {
      throw new Error(`Dasha system not implemented: ${systemKey}`);
    }
    const system = this.systems.get(systemKey);
    if (!system) throw new Error(`Dasha system not registered: ${systemKey}`);

    const language =
      input.language ?? input.birth.language ?? DEFAULT_HOROSCOPE_CONFIG.defaultLanguage;
    const tz =
      typeof input.birth.timezone === "string"
        ? input.birth.timezone
        : DEFAULT_HOROSCOPE_CONFIG.defaultTimezone;
    const currentDate = input.currentDate ?? todayInTz(tz);
    const key = dashaCacheKey(input.birth, currentDate, systemKey, language);

    return this.cache.memoizeOutput(key, () =>
      this.compute(input, system, systemKey, currentDate, language),
    );
  }

  private compute(
    input: DashaInput,
    system: DashaSystem,
    systemKey: DashaSystemKey,
    currentDate: string,
    language: string,
  ): DashaOutput {
    const started = Date.now();

    // 1) Natal chart (cached).
    const bKey = computeBirthKey(input.birth);
    const natal = this.cache.memoizeBirth(bKey, () => generateKundli(input.birth));

    // 2) System-specific timeline.
    const birthUtc = toUtcDate(input.birth.date, input.birth.time, input.birth.timezone);
    const currentUtc = parseYmd(currentDate);
    const { balanceAtBirth, timeline } = system.compute({
      natal,
      birthUtc,
      currentUtc,
    });

    // 3) Shared current/prev/next resolution.
    const position = resolveTimelinePosition(timeline, currentUtc.toISOString());

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
        system: systemKey,
      },
      balanceAtBirth,
      currentMahadasha: position.current,
      currentAntardasha: position.currentAd,
      currentPratyantar: position.currentPd,
      previousMahadasha: position.previous,
      nextMahadasha: position.next,
      timeline,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        timezone: input.birth.timezone,
        language,
        engineVersion: DASHA_ENGINE_VERSION,
        dataSource: DASHA_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        system: systemKey,
        cacheHits: this.cache.hits,
      },
    };
  }
}

export function createDashaEngine(): DashaEngine {
  return new DashaEngine();
}

/** One-shot helper for callers who don't need to keep an instance. */
export function generateDasha(input: DashaInput): DashaOutput {
  return createDashaEngine().generate(input);
}
