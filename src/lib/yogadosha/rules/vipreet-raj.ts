// Rule — Vipreet Raj Yoga (Harsha / Sarala / Vimala)
import { DUSTHANA_HOUSES, VIPREET_NAMES } from "../constants";
import { clamp, uniq } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

export const vipreetRajRule: YogaDoshaRule = {
  id: "vipreet-raj-yoga",
  name: "Vipreet Raj Yoga",
  sanskrit: "विपरीत राज योग",
  kind: "yoga",
  category: "Raj Yoga",
  description:
    "A lord of the 6th, 8th or 12th placed in another dusthana — adversity turned into advantage (Harsha, Sarala and Vimala variants).",
  evaluate(ctx) {
    const found: Array<{ variant: string; lord: GrahaName; from: number; to: number }> = [];
    for (const house of DUSTHANA_HOUSES) {
      const lord = ctx.lordOfHouse(house);
      const pos = ctx.planet(lord);
      if (!pos) continue;
      if ((DUSTHANA_HOUSES as readonly number[]).includes(pos.house) && pos.house !== house) {
        found.push({ variant: VIPREET_NAMES[house], lord, from: house, to: pos.house });
      } else if (pos.house === house) {
        // Own dusthana placement — weaker but classically accepted.
        found.push({
          variant: `${VIPREET_NAMES[house]} (own house)`,
          lord,
          from: house,
          to: pos.house,
        });
      }
    }

    const detected = found.length > 0;
    const confidence = detected
      ? clamp(55 + found.reduce((s, f) => s + (f.variant.includes("own") ? 8 : 15), 0), 0, 100)
      : 0;

    return {
      detected,
      confidence,
      ruleApplied: detected
        ? found
            .map((f) => `${f.variant}: lord of ${f.from} (${f.lord}) placed in house ${f.to}`)
            .join("; ")
        : "No 6th/8th/12th lord occupies a dusthana house",
      planetCombination: uniq(found.map((f) => f.lord)),
      affectedHouses: uniq(found.flatMap((f) => [f.from, f.to])).sort((a, b) => a - b),
      details: { variants: found.map((f) => f.variant), placements: found },
    };
  },
};
