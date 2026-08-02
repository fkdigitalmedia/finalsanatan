// ============================================================
// AI Interpretation Engine — Types
// ------------------------------------------------------------
// The AI layer NEVER calculates astrology. It only converts
// structured JSON produced by the internal engines into human
// readable Markdown.
// ============================================================

/** Every report the interpretation layer can narrate. */
export type ReportKind =
  | "daily-horoscope"
  | "weekly-horoscope"
  | "monthly-horoscope"
  | "yearly-horoscope"
  | "kundli-summary"
  | "career-report"
  | "marriage-compatibility"
  | "guna-milan"
  | "varshphal"
  | "muhurat"
  | "numerology"
  | "vastu"
  | "dosha"
  | "yoga";

/** Output style requested by the caller. */
export type ReportDepth = "summary" | "detailed" | "professional" | "beginner";

/** Languages the narration supports (extendable). */
export type InterpretationLanguage =
  "en" | "hi" | "mr" | "gu" | "ta" | "te" | "kn" | "ml" | "pa" | "bn";

/** Structured payload coming from a calculation engine. */
export type EngineData = Record<string, unknown>;

export interface InterpretationInput {
  /** Which report to narrate. */
  report: ReportKind;
  /** Structured engine JSON. Must already be calculated. */
  data: EngineData;
  /** Output style. Defaults to "summary". */
  depth?: ReportDepth;
  /** Output language. Defaults to "en". */
  language?: InterpretationLanguage;
  /** Optional non-calculated context (user first name, tone hints). */
  context?: Record<string, string | number | boolean>;
  /** Engine-reported confidence 0..100; low values trigger a caveat. */
  confidence?: number;
  /** Skip cache read/write for this call. */
  bypassCache?: boolean;
  /** Override the resolved model for this call. */
  model?: string;
  /** Attribution for usage logging. */
  userId?: string | null;
}

/** A single prompt template — editable from the Admin Panel later. */
export interface PromptTemplate {
  /** Stable id, also used as the AI router feature key suffix. */
  id: ReportKind;
  /** Human label for the admin UI. */
  label: string;
  /** Template revision — part of the cache key. */
  version: number;
  /** Role/behaviour instructions. */
  system: string;
  /** Instruction block placed above the engine JSON. */
  instruction: string;
  /** Ordered Markdown headings the model must emit. */
  sections: string[];
  /** Soft word budget per depth. */
  wordBudget?: Partial<Record<ReportDepth, number>>;
}

/** Resolved prompt ready to be sent to a provider. */
export interface ResolvedPrompt {
  templateId: ReportKind;
  version: number;
  featureKey: string;
  system: string;
  prompt: string;
  maxTokens: number;
}

/** Minimal provider contract — implemented by the AI router adapter. */
export interface AiProviderAdapter {
  /** Adapter id, e.g. "ai-router" or "static-test". */
  id: string;
  complete(request: {
    featureKey: string;
    system: string;
    prompt: string;
    maxTokens: number;
    model?: string;
    userId?: string | null;
  }): Promise<{ text: string; provider: string; model: string; latencyMs?: number }>;
}

export interface InterpretationSection {
  heading: string;
  body: string;
}

export interface InterpretationResult {
  report: ReportKind;
  depth: ReportDepth;
  language: InterpretationLanguage;
  /** Clean Markdown, safety footer included. */
  markdown: string;
  sections: InterpretationSection[];
  meta: {
    templateId: ReportKind;
    templateVersion: number;
    featureKey: string;
    provider: string;
    model: string;
    adapter: string;
    cached: boolean;
    cacheKey: string;
    wordCount: number;
    durationMs: number;
    lowConfidence: boolean;
    generatedAt: string;
  };
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
