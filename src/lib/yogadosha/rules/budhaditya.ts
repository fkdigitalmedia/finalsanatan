// Rule — Budhaditya Yoga (Sun + Mercury)
import { clamp } from "../helpers";
import type { YogaDoshaRule } from "../types";

export const budhadityaRule: YogaDoshaRule = {
  id: "budhaditya-yoga",
  name: "Budhaditya Yoga",
  sanskrit: "बुधादित्य योग",
  kind: "yoga",
  category: "Surya Yoga",
  description:
    "Sun and Mercury together in one house — sharp intellect, communication skill and recognition through knowledge or administration.",
  evaluate(ctx) {
    const sun = ctx.planet("Sun");
    const mer = ctx.planet("Mercury");
    if (!sun || !mer) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Sun or Mercury missing from chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const detected = sun.house === mer.house;
    const orb = ctx.separation("Sun", "Mercury") ?? 0;
    let confidence = 0;
    const cancellations: string[] = [];
    if (detected) {
      confidence = 70;
      if (mer.dignity === "exalted" || mer.dignity === "own" || mer.dignity === "moolatrikona")
        confidence += 12;
      if (mer.dignity === "debilitated") confidence -= 20;
      if ([1, 4, 5, 7, 9, 10, 11].includes(sun.house)) confidence += 8;
      if (orb < 3) {
        confidence -= 15;
        cancellations.push(
          `Mercury is deeply combust (orb ${orb.toFixed(2)}°) — the yoga underperforms`,
        );
      }
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `Sun and Mercury conjoin in house ${sun.house} (${sun.rashi}), orb ${orb.toFixed(2)}°`
        : `Sun in house ${sun.house}, Mercury in house ${mer.house} — no conjunction`,
      planetCombination: detected ? ["Sun", "Mercury"] : [],
      affectedHouses: detected ? [sun.house] : [],
      cancellations,
      details: {
        house: sun.house,
        orbDegrees: Number(orb.toFixed(4)),
        mercuryDignity: mer.dignity,
      },
    };
  },
};
