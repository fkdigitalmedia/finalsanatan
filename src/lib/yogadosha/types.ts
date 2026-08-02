// ============================================================
// Dosha & Yoga Detection Engine — Types (Phase 13.4)
// ------------------------------------------------------------
// Structural contracts only. Backend-only, JSON-only module.
// ============================================================

import type {
  BirthInput,
  GrahaName,
  KundliChart,
  PlanetChartPosition,
  PlanetDignity,
} from "@/lib/kundli/types";

export type RuleKind = "dosha" | "yoga";

export type RuleCategory =
  "Dosha" | "Raj Yoga" | "Dhana Yoga" | "Chandra Yoga" | "Surya Yoga" | "Exchange Yoga" | "Other";

export type RuleStrength = "none" | "mild" | "moderate" | "strong";

export interface YogaDoshaInput {
  birth: BirthInput;
  language?: string;
  /** Restrict detection to these rule ids. Defaults to all. */
  rules?: string[];
  /** Include rules that evaluated to `detected: false`. Default true. */
  includeUndetected?: boolean;
}

export interface YogaDoshaValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

/** What a rule returns from `evaluate()`. */
export interface RuleOutcome {
  detected: boolean;
  /** 0..100 — how strongly the classical condition is satisfied. */
  confidence: number;
  /** Human-readable statement of the rule that produced the verdict. */
  ruleApplied: string;
  planetCombination: GrahaName[];
  affectedHouses: number[];
  strength?: RuleStrength;
  /** Cancellation / mitigation clauses that fired. */
  cancellations?: string[];
  /** Free-form structured evidence (sub-yoga names, exchanges, …). */
  details?: Record<string, unknown>;
}

/** A fully-resolved detection record in the engine output. */
export interface DetectionResult extends RuleOutcome {
  id: string;
  name: string;
  sanskrit?: string;
  kind: RuleKind;
  category: RuleCategory;
  description: string;
  strength: RuleStrength;
  cancellations: string[];
  details: Record<string, unknown>;
}

/** Plug-in contract — add a rule file, register it, done. */
export interface YogaDoshaRule {
  id: string;
  name: string;
  sanskrit?: string;
  kind: RuleKind;
  category: RuleCategory;
  description: string;
  evaluate(ctx: ChartContext): RuleOutcome;
}

/** Derived, read-only view of the natal chart handed to every rule. */
export interface ChartContext {
  chart: KundliChart;
  lagnaRashiIndex: number;
  moonRashiIndex: number;
  planets: PlanetChartPosition[];
  planet(graha: GrahaName): PlanetChartPosition | undefined;
  houseOf(graha: GrahaName): number | null;
  planetsInHouse(house: number): PlanetChartPosition[];
  rashiOfHouse(house: number): number;
  lordOfHouse(house: number): GrahaName;
  lordOfRashi(rashiIndex: number): GrahaName;
  /** House number counted from another house (1..12). */
  houseFrom(reference: number, house: number): number;
  /** House of `graha` counted from the natal Moon (1..12). */
  houseFromMoon(graha: GrahaName): number | null;
  dignity(graha: GrahaName): PlanetDignity | null;
  isBenefic(graha: GrahaName): boolean;
  /** Classical graha drishti — does `graha` aspect `house`? */
  aspectsHouse(graha: GrahaName, house: number): boolean;
  /** Mutual aspect / conjunction between two planets. */
  areConnected(a: GrahaName, b: GrahaName): boolean;
  /** Shortest-arc separation in degrees. */
  separation(a: GrahaName, b: GrahaName): number | null;
  /** Is `graha` combust (too close to the Sun)? */
  isCombust(graha: GrahaName): boolean;
}

export interface YogaDoshaSummary {
  totalRulesEvaluated: number;
  detectedCount: number;
  doshaCount: number;
  yogaCount: number;
  detectedIds: string[];
  strongest: { id: string; name: string; confidence: number } | null;
  /** 0..100 — benefic yoga weight minus dosha weight, centred at 50. */
  balanceScore: number;
}

export interface YogaDoshaMetadata {
  calculationTimestamp: string;
  engineVersion: string;
  dataSource: string;
  calculationDurationMs: number;
  timezone: string | number;
  language: string;
  ruleCount: number;
  cacheHits: number;
}

export interface YogaDoshaOutput {
  profile: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string | number;
    language: string;
    lagnaRashiIndex: number;
    lagnaRashi: string;
    moonRashiIndex: number;
    moonRashi: string;
  };
  doshas: DetectionResult[];
  yogas: DetectionResult[];
  detections: DetectionResult[];
  summary: YogaDoshaSummary;
  metadata: YogaDoshaMetadata;
}
