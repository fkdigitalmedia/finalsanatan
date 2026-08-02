// Rule — Raj Yoga (kendra lord ↔ trikona lord relationship)
import { KENDRA_HOUSES, TRIKONA_HOUSES } from "../constants";
import { clamp, uniq } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

export const rajYogaRule: YogaDoshaRule = {
  id: "raj-yoga",
  name: "Raj Yoga",
  sanskrit: "राज योग",
  kind: "yoga",
  category: "Raj Yoga",
  description:
    "A kendra lord (1/4/7/10) and a trikona lord (1/5/9) connected by conjunction, mutual aspect or exchange — the classical signature of authority and rise in status.",
  evaluate(ctx) {
    const combos: Array<{
      kendra: number;
      trikona: number;
      lords: GrahaName[];
      relation: string;
      houses: number[];
      weight: number;
    }> = [];

    for (const k of KENDRA_HOUSES) {
      for (const t of TRIKONA_HOUSES) {
        if (k === t) continue;
        const kl = ctx.lordOfHouse(k);
        const tl = ctx.lordOfHouse(t);
        if (kl === tl) {
          // Same planet owns both — yogakaraka.
          const pos = ctx.planet(kl);
          if (!pos) continue;
          combos.push({
            kendra: k,
            trikona: t,
            lords: [kl],
            relation: `${kl} is yogakaraka — lord of kendra ${k} and trikona ${t}`,
            houses: [k, t, pos.house],
            weight: 30,
          });
          continue;
        }
        const kp = ctx.planet(kl);
        const tp = ctx.planet(tl);
        if (!kp || !tp) continue;
        if (kp.house === tp.house) {
          combos.push({
            kendra: k,
            trikona: t,
            lords: [kl, tl],
            relation: `${kl} (lord of ${k}) conjoins ${tl} (lord of ${t}) in house ${kp.house}`,
            houses: [k, t, kp.house],
            weight: 28,
          });
        } else if (ctx.aspectsHouse(kl, tp.house) && ctx.aspectsHouse(tl, kp.house)) {
          combos.push({
            kendra: k,
            trikona: t,
            lords: [kl, tl],
            relation: `${kl} (lord of ${k}) and ${tl} (lord of ${t}) are in mutual aspect`,
            houses: [k, t, kp.house, tp.house],
            weight: 22,
          });
        } else if (kp.house === t && tp.house === k) {
          combos.push({
            kendra: k,
            trikona: t,
            lords: [kl, tl],
            relation: `${kl} and ${tl} exchange the ${k}th and ${t}th houses`,
            houses: [k, t],
            weight: 30,
          });
        }
      }
    }

    const detected = combos.length > 0;
    let confidence = 0;
    if (detected) {
      const best = Math.max(...combos.map((c) => c.weight));
      confidence = 45 + best + Math.min(15, (combos.length - 1) * 5);
      const strongLord = combos.some((c) =>
        c.lords.some((l) => {
          const d = ctx.dignity(l);
          return d === "exalted" || d === "own" || d === "moolatrikona";
        }),
      );
      if (strongLord) confidence += 8;
    }
    const cancellations: string[] = [];
    const weakened = combos.filter((c) =>
      c.lords.some((l) => ctx.dignity(l) === "debilitated" || ctx.isCombust(l)),
    );
    if (detected && weakened.length === combos.length) {
      cancellations.push(
        "Every participating lord is debilitated or combust — results are delayed",
      );
      confidence -= 15;
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? combos.map((c) => c.relation).join("; ")
        : "No kendra lord is connected to a trikona lord",
      planetCombination: uniq(combos.flatMap((c) => c.lords)),
      affectedHouses: uniq(combos.flatMap((c) => c.houses)).sort((a, b) => a - b),
      cancellations,
      details: { combinationCount: combos.length, combinations: combos },
    };
  },
};
