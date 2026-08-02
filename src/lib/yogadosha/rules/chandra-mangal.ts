// Rule — Chandra Mangal Yoga (Moon + Mars)
import { clamp } from "../helpers";
import type { YogaDoshaRule } from "../types";

export const chandraMangalRule: YogaDoshaRule = {
  id: "chandra-mangal-yoga",
  name: "Chandra Mangal Yoga",
  sanskrit: "चन्द्र मंगल योग",
  kind: "yoga",
  category: "Dhana Yoga",
  description:
    "Moon and Mars conjoined or in mutual aspect — enterprise, earning power and the drive to convert emotion into material results.",
  evaluate(ctx) {
    const moon = ctx.planet("Moon");
    const mars = ctx.planet("Mars");
    if (!moon || !mars) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Moon or Mars missing from chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const conjunct = moon.house === mars.house;
    const mutual = !conjunct && ctx.areConnected("Moon", "Mars");
    const detected = conjunct || mutual;
    let confidence = 0;
    if (conjunct) confidence = 78;
    else if (mutual) confidence = 60;
    if (detected) {
      if ([2, 5, 9, 11].includes(moon.house)) confidence += 8;
      if (mars.dignity === "debilitated" || moon.dignity === "debilitated") confidence -= 15;
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: conjunct
        ? `Moon and Mars conjoin in house ${moon.house}`
        : mutual
          ? `Moon (house ${moon.house}) and Mars (house ${mars.house}) are in mutual aspect`
          : "Moon and Mars are neither conjoined nor in mutual aspect",
      planetCombination: detected ? ["Moon", "Mars"] : [],
      affectedHouses: detected ? [moon.house, mars.house].sort((a, b) => a - b) : [],
      details: { conjunct, mutualAspect: mutual },
    };
  },
};
