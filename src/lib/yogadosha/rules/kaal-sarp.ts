// Rule — Kaal Sarp Yoga (Dosha)
import { KAAL_SARP_TYPES } from "../constants";
import { clamp } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

const SEVEN: GrahaName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

export const kaalSarpRule: YogaDoshaRule = {
  id: "kaal-sarp-yoga",
  name: "Kaal Sarp Yoga",
  sanskrit: "कालसर्प योग",
  kind: "dosha",
  category: "Dosha",
  description:
    "All seven classical planets hemmed between Rahu and Ketu — the chart's energy is funnelled through the nodal axis, producing delays followed by sudden results.",
  evaluate(ctx) {
    const rahu = ctx.planet("Rahu");
    const ketu = ctx.planet("Ketu");
    if (!rahu || !ketu) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Nodal positions unavailable",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const start = rahu.longitudeSidereal;
    const arcFromRahu = (lon: number) => (((lon - start) % 360) + 360) % 360;

    const inRahuKetuHalf: GrahaName[] = [];
    const inKetuRahuHalf: GrahaName[] = [];
    let onAxis = 0;
    for (const g of SEVEN) {
      const p = ctx.planet(g);
      if (!p) continue;
      const arc = arcFromRahu(p.longitudeSidereal);
      if (arc < 0.5 || Math.abs(arc - 180) < 0.5) onAxis++;
      if (arc < 180) inRahuKetuHalf.push(g);
      else inKetuRahuHalf.push(g);
    }

    const full = inRahuKetuHalf.length === 0 || inKetuRahuHalf.length === 0;
    const partial = !full && (inRahuKetuHalf.length === 1 || inKetuRahuHalf.length === 1);
    const detected = full;

    let confidence = 0;
    if (full) confidence = onAxis > 0 ? 80 : 92;
    else if (partial) confidence = 35;

    const type = KAAL_SARP_TYPES[rahu.house] ?? "Kaal Sarp";
    const cancellations: string[] = [];
    if (full && onAxis > 0) {
      cancellations.push("A planet sits on the nodal axis — the hemming is not airtight");
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: full
        ? `All seven grahas lie in the ${inKetuRahuHalf.length === 0 ? "Rahu→Ketu" : "Ketu→Rahu"} half — ${type} (Rahu in house ${rahu.house})`
        : partial
          ? "Only one graha falls outside the nodal axis — partial (Aanshik) Kaal Sarp"
          : "Grahas are distributed on both sides of the Rahu–Ketu axis",
      planetCombination: detected ? (["Rahu", "Ketu", ...SEVEN] as GrahaName[]) : [],
      affectedHouses: detected ? [rahu.house, ketu.house].sort((a, b) => a - b) : [],
      cancellations,
      details: {
        type: detected ? type : null,
        partial,
        rahuHouse: rahu.house,
        ketuHouse: ketu.house,
        planetsRahuToKetu: inRahuKetuHalf,
        planetsKetuToRahu: inKetuRahuHalf,
      },
    };
  },
};
