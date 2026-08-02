// Rule — Adhi Yoga (benefics in 6/7/8 from the Moon)
import { clamp } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

const BENEFICS: GrahaName[] = ["Mercury", "Jupiter", "Venus"];

export const adhiYogaRule: YogaDoshaRule = {
  id: "adhi-yoga",
  name: "Adhi Yoga",
  sanskrit: "अधि योग",
  kind: "yoga",
  category: "Chandra Yoga",
  description:
    "Mercury, Jupiter and Venus occupying the 6th, 7th and 8th houses from the Moon — leadership, comfort and lasting influence.",
  evaluate(ctx) {
    const moon = ctx.planet("Moon");
    if (!moon) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Moon missing from chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const placed: Array<{ graha: GrahaName; houseFromMoon: number; house: number }> = [];
    for (const g of BENEFICS) {
      const p = ctx.planet(g);
      if (!p) continue;
      const rel = ctx.houseFrom(moon.house, p.house);
      if (rel === 6 || rel === 7 || rel === 8) {
        placed.push({ graha: g, houseFromMoon: rel, house: p.house });
      }
    }
    const detected = placed.length >= 2;
    let confidence = 0;
    if (detected) {
      confidence = placed.length === 3 ? 88 : 62;
      if (
        placed.some((p) => {
          const d = ctx.dignity(p.graha);
          return d === "exalted" || d === "own" || d === "moolatrikona";
        })
      )
        confidence += 7;
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `${placed.map((p) => `${p.graha} in the ${p.houseFromMoon}th from Moon`).join(", ")} — ${placed.length === 3 ? "complete" : "partial"} Adhi Yoga`
        : `Only ${placed.length} benefic in the 6th/7th/8th from the Moon — at least 2 required`,
      planetCombination: detected ? placed.map((p) => p.graha) : [],
      affectedHouses: detected ? placed.map((p) => p.house).sort((a, b) => a - b) : [],
      details: { placed, complete: placed.length === 3 },
    };
  },
};
