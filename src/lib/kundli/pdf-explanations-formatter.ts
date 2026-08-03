// ============================================================
// Phase 18.1 — PDF AI Explanations Formatter Engine
// ------------------------------------------------------------
// Formats structured educational explanations for PDF rendering:
// - Meaning & Why Detected
// - Planets & Houses Involved
// - Classical Rule Matched
// - Impacts across Career, Marriage, Finance, Health
// - Simple English & Simple Hindi summaries
// - Actionable Remedies
// ============================================================

import type { GrahaName, Rashi } from "./types";

export interface PdfExplanationCard {
  title: string;
  category: string;
  meaning: string;
  whyDetected: string;
  planetsInvolved: GrahaName[];
  housesInvolved: number[];
  careerImpact: string;
  marriageImpact: string;
  financeImpact: string;
  healthImpact: string;
  simpleEnglish: string;
  simpleHindi: string;
  actionableAdvice: string[];
}

export function formatPlanetExplanation(
  graha: GrahaName,
  rashi: Rashi,
  house: number,
  dignity: string,
  score: number,
): PdfExplanationCard {
  return {
    title: `${graha} in ${rashi} (House ${house})`,
    category: "Planet Analysis",
    meaning: `${graha} represents key life energies. Positioned in ${rashi} (${dignity}) in House ${house} with a composite strength score of ${score}/100.`,
    whyDetected: `Calculated from exact sidereal longitude and whole-sign house placement.`,
    planetsInvolved: [graha],
    housesInvolved: [house],
    careerImpact: `Influence of ${graha} in House ${house} shapes workplace communication and leadership.`,
    marriageImpact: `Harmonious aspect from ${graha} fosters emotional understanding in relationship dynamics.`,
    financeImpact: `Strength rating ${score}/100 supports financial planning relating to House ${house}.`,
    healthImpact: `Physical stamina supported when ${graha}'s energy is balanced.`,
    simpleEnglish: `${graha} is placed in ${rashi} in House ${house}. Strengthen its positive energy through daily discipline and recommended mantras.`,
    simpleHindi: `${graha} आपकी कुंडली में ${rashi} राशि और ${house}वें भाव में स्थित है। इसके सकारात्मक प्रभाव को बढ़ाने के लिए प्रतिदिन नियमित मंत्र जप करें।`,
    actionableAdvice: [`Chant ${graha} Beej Mantra`, `Engage in weekly charity on ${graha}'s dedicated day`],
  };
}

export function formatHouseExplanation(
  houseNum: number,
  rashi: Rashi,
  lord: GrahaName,
  score: number,
  occupants: GrahaName[],
): PdfExplanationCard {
  return {
    title: `House ${houseNum} (${rashi}) — Lord: ${lord}`,
    category: "House Analysis",
    meaning: `House ${houseNum} governs specific life domains. Net Ashtakavarga and planetary strength score is ${score}/100.`,
    whyDetected: `Evaluated from Lagna Rashi cusp and planetary occupant aspects.`,
    planetsInvolved: [lord, ...occupants],
    housesInvolved: [houseNum],
    careerImpact: `House ${houseNum} score ${score}/100 influences professional decisions.`,
    marriageImpact: `Aspects cast on House ${houseNum} reflect interpersonal harmony.`,
    financeImpact: `Financial capacity is supported by ${lord}'s placement.`,
    healthImpact: `Vitality remains strong when House ${houseNum} is active.`,
    simpleEnglish: `House ${houseNum} has a strength score of ${score}/100 with ${occupants.length > 0 ? occupants.join(", ") : "no occupants"}.`,
    simpleHindi: `${houseNum}वें भाव का शक्ति स्कोर ${score}/100 है। इसमें ${occupants.length > 0 ? occupants.join(", ") : "कोई ग्रह नहीं"} स्थित है।`,
    actionableAdvice: [`Strengthen ${lord} through remedies`, `Support charitable activities for House ${houseNum}`],
  };
}
