// Rule — Guru Chandal Yoga (Jupiter with the nodes)
import { CLOSE_CONJUNCTION_ORB } from "../constants";
import { clamp } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

export const guruChandalRule: YogaDoshaRule = {
  id: "guru-chandal-yoga",
  name: "Guru Chandal Yoga",
  sanskrit: "गुरु चांडाल योग",
  kind: "dosha",
  category: "Dosha",
  description:
    "Jupiter conjoined Rahu (or Ketu) — wisdom mixed with unorthodoxy: brilliant but rule-bending judgement, and tension around teachers, ethics and belief.",
  evaluate(ctx) {
    const jup = ctx.planet("Jupiter");
    if (!jup) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Jupiter not present in chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    let node: GrahaName | null = null;
    let orb: number | null = null;
    for (const g of ["Rahu", "Ketu"] as GrahaName[]) {
      const p = ctx.planet(g);
      if (p && p.house === jup.house) {
        node = g;
        orb = ctx.separation("Jupiter", g);
        break;
      }
    }
    const detected = node !== null;
    let confidence = 0;
    if (detected) {
      confidence = 65;
      if (orb !== null && orb <= CLOSE_CONJUNCTION_ORB) confidence += 20;
      if (node === "Rahu") confidence += 5;
    }
    const cancellations: string[] = [];
    if (detected && (jup.dignity === "exalted" || jup.dignity === "own")) {
      cancellations.push(`Jupiter is ${jup.dignity} — the guru withstands the nodal contact`);
      confidence -= 15;
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `Jupiter conjoined ${node} in house ${jup.house}${orb !== null ? ` (orb ${orb.toFixed(2)}°)` : ""}`
        : "Jupiter is not conjoined Rahu or Ketu",
      planetCombination: detected ? ["Jupiter", node as GrahaName] : [],
      affectedHouses: detected ? [jup.house] : [],
      cancellations,
      details: { node, orbDegrees: orb, jupiterHouse: jup.house, jupiterDignity: jup.dignity },
    };
  },
};
