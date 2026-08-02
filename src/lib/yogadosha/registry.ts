// ============================================================
// Dosha & Yoga Detection Engine — Rule Registry
// ------------------------------------------------------------
// Modular plug-in point: drop a new rule file in ./rules, add it
// to DEFAULT_RULES (or call registerRule at runtime). The engine
// itself never changes.
// ============================================================

import { adhiYogaRule } from "./rules/adhi-yoga";
import { budhadityaRule } from "./rules/budhaditya";
import { chandraMangalRule } from "./rules/chandra-mangal";
import { gajKesariRule } from "./rules/gaj-kesari";
import { guruChandalRule } from "./rules/guru-chandal";
import { kaalSarpRule } from "./rules/kaal-sarp";
import { lakshmiYogaRule } from "./rules/lakshmi-yoga";
import { mangalDoshaRule } from "./rules/mangal-dosha";
import { neechBhangRule } from "./rules/neech-bhang";
import { parivartanRule } from "./rules/parivartan";
import { pitraDoshaRule } from "./rules/pitra-dosha";
import { rajYogaRule } from "./rules/raj-yoga";
import { vasumatiYogaRule } from "./rules/vasumati-yoga";
import { vipreetRajRule } from "./rules/vipreet-raj";
import type { YogaDoshaRule } from "./types";

/** Shipped rule set, evaluation order = output order. */
export const DEFAULT_RULES: YogaDoshaRule[] = [
  // Doshas
  mangalDoshaRule,
  kaalSarpRule,
  pitraDoshaRule,
  guruChandalRule,
  // Yogas
  gajKesariRule,
  rajYogaRule,
  neechBhangRule,
  vipreetRajRule,
  budhadityaRule,
  chandraMangalRule,
  parivartanRule,
  adhiYogaRule,
  lakshmiYogaRule,
  vasumatiYogaRule,
];

export class RuleRegistry {
  private readonly rules = new Map<string, YogaDoshaRule>();

  constructor(rules: YogaDoshaRule[] = DEFAULT_RULES) {
    for (const r of rules) this.register(r);
  }

  register(rule: YogaDoshaRule): this {
    if (!rule?.id) throw new Error("Rule must declare a unique id");
    if (typeof rule.evaluate !== "function") {
      throw new Error(`Rule "${rule.id}" must implement evaluate()`);
    }
    this.rules.set(rule.id, rule);
    return this;
  }

  unregister(id: string): boolean {
    return this.rules.delete(id);
  }

  get(id: string): YogaDoshaRule | undefined {
    return this.rules.get(id);
  }

  ids(): string[] {
    return [...this.rules.keys()];
  }

  list(ids?: string[]): YogaDoshaRule[] {
    if (!ids) return [...this.rules.values()];
    return ids.map((id) => this.rules.get(id)).filter((r): r is YogaDoshaRule => Boolean(r));
  }
}

/** Process-wide default registry — extend it from anywhere. */
export const defaultRegistry = new RuleRegistry();

export function registerRule(rule: YogaDoshaRule): void {
  defaultRegistry.register(rule);
}
