// Rule — Neech Bhang Raj Yoga (cancellation of debilitation)
import { KENDRA_HOUSES, SIGN_LORDS } from "../constants";
import { clamp, uniq } from "../helpers";
import type { GrahaName } from "@/lib/kundli/types";
import type { YogaDoshaRule } from "../types";

const EXALTATION_SIGN: Partial<Record<GrahaName, number>> = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6,
};

export const neechBhangRule: YogaDoshaRule = {
  id: "neech-bhang-raj-yoga",
  name: "Neech Bhang Raj Yoga",
  sanskrit: "नीचभंग राज योग",
  kind: "yoga",
  category: "Raj Yoga",
  description:
    "A debilitated planet whose debilitation is cancelled — the lord of its sign or of its exaltation sign sits in a kendra from the Lagna or Moon — converting weakness into eventual eminence.",
  evaluate(ctx) {
    const moon = ctx.planet("Moon");
    const cancelled: Array<{
      graha: GrahaName;
      reasons: string[];
      houses: number[];
      helpers: GrahaName[];
    }> = [];
    const debilitated = ctx.planets.filter((p) => p.dignity === "debilitated");

    for (const p of debilitated) {
      const reasons: string[] = [];
      const helpers: GrahaName[] = [];
      const dispositor = SIGN_LORDS[p.rashiIndex];
      const dispositorPos = ctx.planet(dispositor);
      if (dispositorPos) {
        if ((KENDRA_HOUSES as readonly number[]).includes(dispositorPos.house)) {
          reasons.push(
            `dispositor ${dispositor} is in kendra house ${dispositorPos.house} from Lagna`,
          );
          helpers.push(dispositor);
        }
        if (
          moon &&
          (KENDRA_HOUSES as readonly number[]).includes(
            ctx.houseFrom(moon.house, dispositorPos.house),
          )
        ) {
          reasons.push(`dispositor ${dispositor} is in a kendra from the Moon`);
          helpers.push(dispositor);
        }
      }
      const exSign = EXALTATION_SIGN[p.graha];
      if (exSign !== undefined) {
        const exLord = SIGN_LORDS[exSign];
        const exLordPos = ctx.planet(exLord);
        if (exLordPos && (KENDRA_HOUSES as readonly number[]).includes(exLordPos.house)) {
          reasons.push(`exaltation lord ${exLord} is in kendra house ${exLordPos.house}`);
          helpers.push(exLord);
        }
        if (exLordPos && exLordPos.house === p.house) {
          reasons.push(`exaltation lord ${exLord} conjoins the debilitated ${p.graha}`);
          helpers.push(exLord);
        }
      }
      if (
        moon &&
        (KENDRA_HOUSES as readonly number[]).includes(ctx.houseFrom(moon.house, p.house))
      ) {
        reasons.push(`${p.graha} itself occupies a kendra from the Moon`);
      }
      if (reasons.length > 0) {
        cancelled.push({ graha: p.graha, reasons, houses: [p.house], helpers: uniq(helpers) });
      }
    }

    const detected = cancelled.length > 0;
    const confidence = detected
      ? clamp(50 + cancelled.reduce((s, c) => s + c.reasons.length * 12, 0), 0, 100)
      : 0;

    return {
      detected,
      confidence,
      ruleApplied: detected
        ? cancelled
            .map((c) => `${c.graha} debilitation cancelled: ${c.reasons.join(", ")}`)
            .join("; ")
        : debilitated.length === 0
          ? "No debilitated planet in the chart"
          : `Debilitated ${debilitated.map((d) => d.graha).join(", ")} — no classical cancellation condition met`,
      planetCombination: uniq([
        ...cancelled.map((c) => c.graha),
        ...cancelled.flatMap((c) => c.helpers),
      ]),
      affectedHouses: uniq(cancelled.flatMap((c) => c.houses)).sort((a, b) => a - b),
      details: {
        debilitatedPlanets: debilitated.map((d) => d.graha),
        cancellations: cancelled,
      },
    };
  },
};
