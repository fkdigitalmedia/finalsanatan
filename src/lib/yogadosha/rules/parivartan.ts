// Rule — Parivartan Yoga (mutual sign exchange between house lords)
import { DUSTHANA_HOUSES } from "../constants";
import { clamp, uniq } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

function classify(a: number, b: number): "Maha" | "Dainya" | "Khala" {
  const dust = (h: number) => (DUSTHANA_HOUSES as readonly number[]).includes(h);
  if (dust(a) || dust(b)) return "Dainya";
  if (a === 3 || b === 3) return "Khala";
  return "Maha";
}

export const parivartanRule: YogaDoshaRule = {
  id: "parivartan-yoga",
  name: "Parivartan Yoga",
  sanskrit: "परिवर्तन योग",
  kind: "yoga",
  category: "Exchange Yoga",
  description:
    "Two house lords occupying each other's signs — the two life areas become permanently linked (Maha, Dainya and Khala varieties).",
  evaluate(ctx) {
    const exchanges: Array<{
      houseA: number;
      houseB: number;
      lordA: GrahaName;
      lordB: GrahaName;
      variety: string;
    }> = [];
    for (let a = 1; a <= 12; a++) {
      for (let b = a + 1; b <= 12; b++) {
        const lordA = ctx.lordOfHouse(a);
        const lordB = ctx.lordOfHouse(b);
        if (lordA === lordB) continue;
        const pa = ctx.planet(lordA);
        const pb = ctx.planet(lordB);
        if (!pa || !pb) continue;
        if (pa.house === b && pb.house === a) {
          exchanges.push({
            houseA: a,
            houseB: b,
            lordA,
            lordB,
            variety: `${classify(a, b)} Parivartan`,
          });
        }
      }
    }

    const detected = exchanges.length > 0;
    let confidence = 0;
    if (detected) {
      confidence = 60 + exchanges.length * 10;
      if (exchanges.some((e) => e.variety.startsWith("Maha"))) confidence += 10;
      if (exchanges.every((e) => e.variety.startsWith("Dainya"))) confidence -= 10;
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? exchanges
            .map(
              (e) =>
                `${e.variety}: ${e.lordA} (lord of ${e.houseA}) ↔ ${e.lordB} (lord of ${e.houseB})`,
            )
            .join("; ")
        : "No two house lords occupy each other's signs",
      planetCombination: uniq(exchanges.flatMap((e) => [e.lordA, e.lordB])),
      affectedHouses: uniq(exchanges.flatMap((e) => [e.houseA, e.houseB])).sort((a, b) => a - b),
      details: { exchangeCount: exchanges.length, exchanges },
    };
  },
};
