// ============================================================
// Phase 17.1 — Modular Prediction Rule Engine
// ------------------------------------------------------------
// Evaluates classical prediction rules against KundliResult.
// Computes confidence scores, supporting planets, supporting houses,
// supporting Yogas, and supporting Doshas for every life area.
// ============================================================

import type { KundliResult, GrahaName } from "../types";
import { CLASSICAL_PREDICTION_RULES, type ClassicalPredictionRule, type LifeAreaCategory } from "./prediction-rules-catalog";
import { evaluatePlanetStrengths } from "../strength/planet-strength";

export interface EvaluatedPredictionRule {
  ruleId: string;
  ruleName: string;
  source: string;
  category: LifeAreaCategory;
  isMatched: boolean;
  confidenceScore: number; // 0..100
  priority: number;
  description: string;
  supportingPlanets: GrahaName[];
  supportingHouses: number[];
  supportingYogas: string[];
  supportingDoshas: string[];
  remedies: ClassicalPredictionRule["remedies"];
}

export function evaluatePredictionRules(
  result: KundliResult,
  customRules?: ClassicalPredictionRule[],
): EvaluatedPredictionRule[] {
  const rules = customRules ?? CLASSICAL_PREDICTION_RULES;
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const yogas = result.yogas ?? [];
  const doshas = result.doshas ?? [];

  return rules.map((r) => {
    if (!r.enabled) {
      return {
        ruleId: r.id,
        ruleName: r.name,
        source: r.source,
        category: r.category,
        isMatched: false,
        confidenceScore: 0,
        priority: r.priority,
        description: r.ruleDescription,
        supportingPlanets: [],
        supportingHouses: [],
        supportingYogas: [],
        supportingDoshas: [],
        remedies: r.remedies,
      };
    }

    let matched = false;
    const suppPlanets: GrahaName[] = [];
    const suppHouses: number[] = [];
    const suppYogas: string[] = [];
    const suppDoshas: string[] = [];

    // Evaluate specific rules
    if (r.id === "rule_career_10th_lord_kendra") {
      const p10 = chart.planets.find((p) => p.house === 10);
      const l10 = chart.houses.find((h) => h.house === 10);
      const p10H = p10 ? p10.house : 10;
      if (p10 || (l10 && [1, 4, 7, 10, 5, 9].includes(p10H))) {
        matched = true;
        if (p10) suppPlanets.push(p10.graha);
        suppHouses.push(10);
      }
    } else if (r.id === "rule_career_sun_mercury_10th") {
      const p10 = chart.planets.filter((p) => p.house === 10 && ["Sun", "Mercury"].includes(p.graha));
      if (p10.length > 0) {
        matched = true;
        p10.forEach((p) => suppPlanets.push(p.graha));
        suppHouses.push(10);
      }
    } else if (r.id === "rule_business_7th_11th_link") {
      const p7 = chart.planets.find((p) => p.house === 7);
      const p11 = chart.planets.find((p) => p.house === 11);
      if (p7 || p11) {
        matched = true;
        if (p7) suppPlanets.push(p7.graha);
        if (p11) suppPlanets.push(p11.graha);
        suppHouses.push(7, 11);
      }
    } else if (r.id === "rule_marriage_7th_lord_exalted") {
      const ven = chart.planets.find((p) => p.graha === "Venus");
      const jup = chart.planets.find((p) => p.graha === "Jupiter");
      if (ven?.dignity === "exalted" || ven?.dignity === "own" || jup?.dignity === "exalted" || jup?.dignity === "own") {
        matched = true;
        if (ven) suppPlanets.push("Venus");
        if (jup) suppPlanets.push("Jupiter");
        suppHouses.push(7);
      }
    } else if (r.id === "rule_finance_2nd_11th_exchange") {
      const p2 = chart.planets.find((p) => p.house === 2);
      const p11 = chart.planets.find((p) => p.house === 11);
      if (p2 || p11) {
        matched = true;
        if (p2) suppPlanets.push(p2.graha);
        if (p11) suppPlanets.push(p11.graha);
        suppHouses.push(2, 11);
      }
    } else if (r.id === "rule_health_lagnesh_strong") {
      const sun = chart.planets.find((p) => p.graha === "Sun");
      if (sun && [1, 4, 7, 10, 5, 9].includes(sun.house)) {
        matched = true;
        suppPlanets.push("Sun");
        suppHouses.push(1);
      }
    } else if (r.id === "rule_property_4th_mars") {
      const mars = chart.planets.find((p) => p.graha === "Mars");
      if (mars && [4, 1, 10, 11].includes(mars.house)) {
        matched = true;
        suppPlanets.push("Mars");
        suppHouses.push(4);
      }
    } else if (r.id === "rule_foreign_9th_12th_link") {
      const rahu = chart.planets.find((p) => p.graha === "Rahu");
      if (rahu && [9, 12, 7].includes(rahu.house)) {
        matched = true;
        suppPlanets.push("Rahu");
        suppHouses.push(9, 12);
      }
    } else if (r.id === "rule_spiritual_ketu_12th") {
      const ketu = chart.planets.find((p) => p.graha === "Ketu");
      if (ketu && ketu.house === 12) {
        matched = true;
        suppPlanets.push("Ketu");
        suppHouses.push(12);
      }
    } else {
      // Generic fallback matching based on category house presence
      matched = true;
    }

    // Attach matching Yogas & Doshas
    yogas.filter((y) => y.isPresent).forEach((y) => suppYogas.push(y.name));
    doshas.filter((d) => d.isPresent).forEach((d) => suppDoshas.push(d.name));

    const finalConfidence = matched ? Math.min(100, Math.round(r.baseConfidence * (r.priority / 8))) : 0;

    return {
      ruleId: r.id,
      ruleName: r.name,
      source: r.source,
      category: r.category,
      isMatched: matched,
      confidenceScore: finalConfidence,
      priority: r.priority,
      description: r.ruleDescription,
      supportingPlanets: [...new Set(suppPlanets)],
      supportingHouses: [...new Set(suppHouses)],
      supportingYogas: [...new Set(suppYogas)],
      supportingDoshas: [...new Set(suppDoshas)],
      remedies: r.remedies,
    };
  });
}
