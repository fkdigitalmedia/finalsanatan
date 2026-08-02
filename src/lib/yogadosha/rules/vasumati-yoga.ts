// Rule — Vasumati Yoga (benefics in upachaya houses)
import { UPACHAYA_HOUSES } from "../constants";
import { clamp } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

const BENEFICS: GrahaName[] = ["Mercury", "Jupiter", "Venus"];

export const vasumatiYogaRule: YogaDoshaRule = {
  id: "vasumati-yoga",
  name: "Vasumati Yoga",
  sanskrit: "वसुमति योग",
  kind: "yoga",
  category: "Dhana Yoga",
  description:
    "Natural benefics occupying the upachaya houses (3, 6, 10, 11) from the Lagna or the Moon — self-made wealth that grows with time.",
  evaluate(ctx) {
    const moon = ctx.planet("Moon");
    const fromLagna: Array<{ graha: GrahaName; house: number }> = [];
    const fromMoon: Array<{ graha: GrahaName; houseFromMoon: number; house: number }> = [];

    for (const g of BENEFICS) {
      const p = ctx.planet(g);
      if (!p) continue;
      if ((UPACHAYA_HOUSES as readonly number[]).includes(p.house)) {
        fromLagna.push({ graha: g, house: p.house });
      }
      if (moon) {
        const rel = ctx.houseFrom(moon.house, p.house);
        if ((UPACHAYA_HOUSES as readonly number[]).includes(rel)) {
          fromMoon.push({ graha: g, houseFromMoon: rel, house: p.house });
        }
      }
    }

    const count = Math.max(fromLagna.length, fromMoon.length);
    const detected = count >= 2;
    let confidence = 0;
    if (detected) {
      confidence = count === 3 ? 82 : 60;
      if (fromLagna.length >= 2 && fromMoon.length >= 2) confidence += 8;
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `${count} benefics occupy upachaya houses (from Lagna: ${fromLagna.map((f) => `${f.graha}/${f.house}`).join(", ") || "none"}; from Moon: ${fromMoon.map((f) => `${f.graha}/${f.houseFromMoon}`).join(", ") || "none"})`
        : `Only ${count} benefic in upachaya houses — at least 2 required`,
      planetCombination: detected
        ? (fromLagna.length >= fromMoon.length ? fromLagna : fromMoon).map((f) => f.graha)
        : [],
      affectedHouses: detected
        ? Array.from(
            new Set(
              (fromLagna.length >= fromMoon.length ? fromLagna : fromMoon).map((f) => f.house),
            ),
          ).sort((a, b) => a - b)
        : [],
      details: { fromLagna, fromMoon, count },
    };
  },
};
