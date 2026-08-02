// Rule — Pitra Dosha (ancestral affliction), traditional rule-based
import { DUSTHANA_HOUSES } from "../constants";
import { clamp, uniq } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

const AFFLICTORS: GrahaName[] = ["Saturn", "Rahu", "Ketu"];

export const pitraDoshaRule: YogaDoshaRule = {
  id: "pitra-dosha",
  name: "Pitra Dosha",
  sanskrit: "पितृ दोष",
  kind: "dosha",
  category: "Dosha",
  description:
    "Affliction of the Sun (father/lineage karaka) or of the 9th house and its lord by Saturn, Rahu or Ketu — classically read as unfinished ancestral obligations.",
  evaluate(ctx) {
    const sun = ctx.planet("Sun");
    const ninthLord = ctx.lordOfHouse(9);
    const ninthLordPos = ctx.planet(ninthLord);
    const reasons: string[] = [];
    const combo = new Set<GrahaName>();
    const houses: number[] = [];
    let score = 0;

    // 1) Sun conjoined or aspected by Saturn / Rahu / Ketu.
    if (sun) {
      for (const g of AFFLICTORS) {
        const p = ctx.planet(g);
        if (!p) continue;
        if (p.house === sun.house) {
          reasons.push(`Sun conjoined ${g} in house ${sun.house}`);
          score += 30;
          combo.add("Sun").add(g);
          houses.push(sun.house);
        } else if (ctx.aspectsHouse(g, sun.house)) {
          reasons.push(`${g} aspects the Sun in house ${sun.house}`);
          score += 18;
          combo.add("Sun").add(g);
          houses.push(sun.house);
        }
      }
      // 2) Sun placed in the 9th and afflicted, or in a dusthana.
      if (sun.house === 9 && reasons.length > 0) {
        reasons.push("Afflicted Sun occupies the 9th house of ancestors");
        score += 15;
        houses.push(9);
      }
    }

    // 3) Nodes occupying the 9th house.
    for (const g of ["Rahu", "Ketu"] as GrahaName[]) {
      const p = ctx.planet(g);
      if (p && p.house === 9) {
        reasons.push(`${g} occupies the 9th house`);
        score += 22;
        combo.add(g);
        houses.push(9);
      }
    }

    // 4) 9th lord in a dusthana or debilitated.
    if (ninthLordPos) {
      if ((DUSTHANA_HOUSES as readonly number[]).includes(ninthLordPos.house)) {
        reasons.push(`9th lord ${ninthLord} placed in dusthana house ${ninthLordPos.house}`);
        score += 20;
        combo.add(ninthLord);
        houses.push(9, ninthLordPos.house);
      }
      if (ninthLordPos.dignity === "debilitated") {
        reasons.push(`9th lord ${ninthLord} is debilitated in ${ninthLordPos.rashi}`);
        score += 15;
        combo.add(ninthLord);
        houses.push(9);
      }
    }

    const detected = score >= 30;
    const cancellations: string[] = [];
    if (detected) {
      if (ctx.aspectsHouse("Jupiter", 9)) {
        cancellations.push("Jupiter aspects the 9th house — ancestral merit protects");
        score -= 12;
      }
      if (sun && (sun.dignity === "exalted" || sun.dignity === "own")) {
        cancellations.push(`Sun is ${sun.dignity} — the karaka remains strong`);
        score -= 10;
      }
    }

    return {
      detected,
      confidence: clamp(Math.round(detected ? score : score / 2), 0, 100),
      ruleApplied: detected
        ? reasons.join("; ")
        : "Sun, 9th house and 9th lord are free of Saturn/Rahu/Ketu affliction",
      planetCombination: [...combo],
      affectedHouses: detected ? uniq(houses).sort((a, b) => a - b) : [],
      cancellations,
      details: { reasons, ninthLord, score },
    };
  },
};
