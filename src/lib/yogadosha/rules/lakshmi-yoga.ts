// Rule — Lakshmi Yoga (strong 9th lord + strong Lagna lord)
import { KENDRA_HOUSES, TRIKONA_HOUSES } from "../constants";
import { clamp, uniq } from "../helpers";
import type { YogaDoshaRule } from "../types";

const STRONG = ["exalted", "own", "moolatrikona"];

export const lakshmiYogaRule: YogaDoshaRule = {
  id: "lakshmi-yoga",
  name: "Lakshmi Yoga",
  sanskrit: "लक्ष्मी योग",
  kind: "yoga",
  category: "Dhana Yoga",
  description:
    "The 9th lord in own or exalted sign placed in a kendra/trikona while the Lagna lord is strong — enduring prosperity, grace and good fortune.",
  evaluate(ctx) {
    const ninthLord = ctx.lordOfHouse(9);
    const lagnaLord = ctx.lordOfHouse(1);
    const ninth = ctx.planet(ninthLord);
    const lagna = ctx.planet(lagnaLord);
    if (!ninth || !lagna) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "9th lord or Lagna lord missing from chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const goodHouse =
      (KENDRA_HOUSES as readonly number[]).includes(ninth.house) ||
      (TRIKONA_HOUSES as readonly number[]).includes(ninth.house);
    const ninthStrong = STRONG.includes(ninth.dignity);
    const lagnaStrong =
      STRONG.includes(lagna.dignity) ||
      (KENDRA_HOUSES as readonly number[]).includes(lagna.house) ||
      (TRIKONA_HOUSES as readonly number[]).includes(lagna.house);

    const detected = goodHouse && ninthStrong && lagnaStrong;
    let confidence = 0;
    if (detected) {
      confidence = 72;
      if (ninth.dignity === "exalted") confidence += 12;
      if (STRONG.includes(lagna.dignity)) confidence += 8;
      if (ctx.isCombust(ninthLord)) confidence -= 15;
    }
    const cancellations: string[] = [];
    if (detected && ctx.isCombust(ninthLord)) {
      cancellations.push(`9th lord ${ninthLord} is combust — fortune arrives with effort`);
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `9th lord ${ninthLord} is ${ninth.dignity} in house ${ninth.house} and Lagna lord ${lagnaLord} is well placed in house ${lagna.house}`
        : `Conditions unmet — 9th lord ${ninthLord} (${ninth.dignity}, house ${ninth.house}); Lagna lord ${lagnaLord} (${lagna.dignity}, house ${lagna.house})`,
      planetCombination: detected ? uniq([ninthLord, lagnaLord]) : [],
      affectedHouses: detected ? uniq([1, 9, ninth.house, lagna.house]).sort((a, b) => a - b) : [],
      cancellations,
      details: {
        ninthLord,
        lagnaLord,
        ninthLordDignity: ninth.dignity,
        ninthLordHouse: ninth.house,
        lagnaLordDignity: lagna.dignity,
        lagnaLordHouse: lagna.house,
      },
    };
  },
};
