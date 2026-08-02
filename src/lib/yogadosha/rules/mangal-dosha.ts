// Rule — Mangal Dosha (Kuja / Manglik Dosha)
import { MANGAL_HOUSES } from "../constants";
import { clamp, uniq } from "../helpers";
import type { YogaDoshaRule } from "../types";

export const mangalDoshaRule: YogaDoshaRule = {
  id: "mangal-dosha",
  name: "Mangal Dosha",
  sanskrit: "मंगल दोष",
  kind: "dosha",
  category: "Dosha",
  description:
    "Mars occupying the 1st, 2nd, 4th, 7th, 8th or 12th house from the Lagna, Moon or Venus — classically linked to friction in marriage and temperament.",
  evaluate(ctx) {
    const mars = ctx.planet("Mars");
    if (!mars) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Mars not present in chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const refs: Array<{ label: string; house: number | null }> = [
      { label: "Lagna", house: mars.house },
      { label: "Moon", house: ctx.houseFromMoon("Mars") },
      {
        label: "Venus",
        house: (() => {
          const v = ctx.planet("Venus");
          return v ? ctx.houseFrom(v.house, mars.house) : null;
        })(),
      },
    ];
    const hits = refs.filter((r) => r.house !== null && MANGAL_HOUSES.includes(r.house));
    const detected = hits.length > 0;

    let confidence = detected ? 50 + hits.length * 15 : 0;
    const cancellations: string[] = [];
    if (detected) {
      if (mars.dignity === "exalted" || mars.dignity === "own" || mars.dignity === "moolatrikona") {
        cancellations.push(
          `Mars is ${mars.dignity} in ${mars.rashi} — dosha is substantially reduced`,
        );
        confidence -= 20;
      }
      const pacifier = ctx
        .planetsInHouse(mars.house)
        .find((p) => p.graha === "Jupiter" || p.graha === "Moon");
      if (pacifier) {
        cancellations.push(`${pacifier.graha} conjoins Mars — classical pacification`);
        confidence -= 12;
      }
      if (ctx.aspectsHouse("Jupiter", mars.house)) {
        cancellations.push("Jupiter aspects Mars — dosha is mitigated");
        confidence -= 8;
      }
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `Mars in house ${mars.house} — dosha house from ${hits.map((h) => h.label).join(", ")}`
        : "Mars is outside 1/2/4/7/8/12 from Lagna, Moon and Venus",
      planetCombination: detected ? (["Mars"] as const).slice() : [],
      affectedHouses: detected
        ? uniq(hits.map((h) => h.house as number)).sort((a, b) => a - b)
        : [],
      cancellations,
      details: {
        marsHouse: mars.house,
        marsRashi: mars.rashi,
        references: hits.map((h) => h.label),
      },
    };
  },
};
