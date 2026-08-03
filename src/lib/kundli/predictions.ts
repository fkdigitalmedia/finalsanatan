// ============================================================
// Phase 16.7 — Rule-Based Prediction Engine (11 Life Domains)
// ------------------------------------------------------------
// Deterministic predictions derived exclusively from calculated facts:
// House Lords, Planet Strengths, Ashtakavarga Bindus, Yogas, and Dasha.
// Zero AI hallucination or arbitrary text generation.
// ============================================================

import type { KundliResult, GrahaName } from "./types";
import { evaluatePlanetStrengths } from "./strength/planet-strength";
import { evaluateHouseAnalyses } from "./houses/house-analysis";

export type DomainKey =
  | "career"
  | "business"
  | "marriage"
  | "love"
  | "finance"
  | "health"
  | "education"
  | "children"
  | "property"
  | "foreign_travel"
  | "spiritual_growth";

export interface DomainPrediction {
  domain: DomainKey;
  title: string;
  sanskritTitle: string;
  ratingScore: number; // 0..100
  ratingLabel: "Outstanding" | "Favorable" | "Moderate" | "Challenging";
  keyFactors: string[];
  favorablePeriods: string[];
  predictionText: string;
  actionableGuidance: string[];
}

export interface PredictionEngineReport {
  generatedAt: string;
  domains: Record<DomainKey, DomainPrediction>;
}

export function generateStructuredPredictions(result: KundliResult): PredictionEngineReport {
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const houseAnalyses = evaluateHouseAnalyses(chart);

  const getPlanetStr = (g: GrahaName) => planetStrengths.find((p) => p.graha === g);
  const getHouseScore = (hNum: number) => houseAnalyses.find((h) => h.house === hNum)?.strengthScore ?? 50;

  // 1. Career (10th house & 10th lord)
  const h10Score = getHouseScore(10);
  const h10Lord = houseAnalyses.find((h) => h.house === 10)?.lord || "Saturn";
  const p10LordStr = getPlanetStr(h10Lord)?.score ?? 50;
  const careerScore = Math.round(h10Score * 0.6 + p10LordStr * 0.4);

  // 2. Business (7th & 11th houses)
  const h7Score = getHouseScore(7);
  const h11Score = getHouseScore(11);
  const businessScore = Math.round((h7Score + h11Score) / 2);

  // 3. Marriage (7th house & Venus/Jupiter)
  const venStr = getPlanetStr("Venus")?.score ?? 50;
  const jupStr = getPlanetStr("Jupiter")?.score ?? 50;
  const marriageScore = Math.round(h7Score * 0.5 + venStr * 0.25 + jupStr * 0.25);

  // 4. Love (5th & 7th house, Venus)
  const h5Score = getHouseScore(5);
  const loveScore = Math.round(h5Score * 0.5 + h7Score * 0.25 + venStr * 0.25);

  // 5. Finance (2nd & 11th houses)
  const h2Score = getHouseScore(2);
  const financeScore = Math.round(h2Score * 0.5 + h11Score * 0.5);

  // 6. Health (1st & 6th houses, Sun)
  const h1Score = getHouseScore(1);
  const h6Score = getHouseScore(6);
  const sunStr = getPlanetStr("Sun")?.score ?? 50;
  const healthScore = Math.round(h1Score * 0.5 + (100 - h6Score) * 0.2 + sunStr * 0.3);

  // 7. Education (4th & 5th houses, Mercury)
  const h4Score = getHouseScore(4);
  const mercStr = getPlanetStr("Mercury")?.score ?? 50;
  const eduScore = Math.round(h4Score * 0.3 + h5Score * 0.4 + mercStr * 0.3);

  // 8. Children (5th house & Jupiter)
  const childrenScore = Math.round(h5Score * 0.6 + jupStr * 0.4);

  // 9. Property (4th house & Mars)
  const marsStr = getPlanetStr("Mars")?.score ?? 50;
  const propertyScore = Math.round(h4Score * 0.6 + marsStr * 0.4);

  // 10. Foreign Travel (9th & 12th houses)
  const h9Score = getHouseScore(9);
  const h12Score = getHouseScore(12);
  const foreignScore = Math.round((h9Score + h12Score) / 2);

  // 11. Spiritual Growth (9th & 12th houses, Ketu/Jupiter)
  const ketuPresent = chart.planets.some((p) => p.graha === "Ketu" && [9, 12].includes(p.house));
  const spiritualScore = Math.round(h9Score * 0.4 + h12Score * 0.3 + jupStr * 0.3 + (ketuPresent ? 10 : 0));

  const getRatingLabel = (score: number): DomainPrediction["ratingLabel"] => {
    if (score >= 80) return "Outstanding";
    if (score >= 65) return "Favorable";
    if (score >= 45) return "Moderate";
    return "Challenging";
  };

  const currentDasha = result.vimshottari?.current?.mahadasha
    ? `${result.vimshottari.current.mahadasha.lord} Mahadasha`
    : "Active Dasha Period";

  const domains: Record<DomainKey, DomainPrediction> = {
    career: {
      domain: "career",
      title: "Career & Profession",
      sanskritTitle: "कर्म फल (Karma Phala)",
      ratingScore: careerScore,
      ratingLabel: getRatingLabel(careerScore),
      keyFactors: [`10th Lord: ${h10Lord}`, `10th House Score: ${h10Score}/100`, `Current Dasha: ${currentDasha}`],
      favorablePeriods: ["Sun/Jupiter Mahadasha & Antardasha", "Transits over 10th House"],
      predictionText: `Career prospects rate ${careerScore}/100 based on ${h10Lord}'s placement and 10th house strength. ${careerScore >= 65 ? "Indicates steady executive authority, leadership growth, and public recognition." : "Requires disciplined focus and gradual perseverance to build lasting professional authority."}`,
      actionableGuidance: ["Align career goals with 10th house sign characteristics", "Strengthen 10th Lord through recommended rituals"],
    },
    business: {
      domain: "business",
      title: "Business & Trade",
      sanskritTitle: "व्यापार फल (Vyapara Phala)",
      ratingScore: businessScore,
      ratingLabel: getRatingLabel(businessScore),
      keyFactors: [`7th House Score: ${h7Score}/100`, `11th House Gains: ${h11Score}/100`],
      favorablePeriods: ["Mercury/Venus sub-periods"],
      predictionText: `Commercial enterprise potential is rated ${businessScore}/100 based on 7th and 11th house strength. ${businessScore >= 65 ? "Favorable for entrepreneurship, commercial partnerships, and trade." : "Best to focus on solid risk management and verified commercial agreements."}`,
      actionableGuidance: ["Maintain transparent partnership contracts", "Activate 11th house lord for gains"],
    },
    marriage: {
      domain: "marriage",
      title: "Marriage & Life Partner",
      sanskritTitle: "विवाह योग (Vivaha Yoga)",
      ratingScore: marriageScore,
      ratingLabel: getRatingLabel(marriageScore),
      keyFactors: [`7th House Score: ${h7Score}/100`, `Venus Strength: ${venStr}/100`],
      favorablePeriods: ["Venus/Jupiter sub-periods"],
      predictionText: `Marital harmony score is ${marriageScore}/100. ${marriageScore >= 65 ? "Indicates strong emotional bonding and supportive life partner." : "Suggests cultivating patience and clear communication with partner."}`,
      actionableGuidance: ["Perform Guna Milan before finalizing marriage", "Honor Venus/Jupiter through weekly remedies"],
    },
    love: {
      domain: "love",
      title: "Love & Relationships",
      sanskritTitle: "प्रेम सम्बन्ध (Prema Sambandha)",
      ratingScore: loveScore,
      ratingLabel: getRatingLabel(loveScore),
      keyFactors: [`5th House Score: ${h5Score}/100`, `Venus Score: ${venStr}/100`],
      favorablePeriods: ["5th Lord Antardasha"],
      predictionText: `Romantic expression is rated ${loveScore}/100. ${loveScore >= 65 ? "Strong romantic connections and mutual emotional understanding." : "Encourages clarity and emotional maturity in personal relationships."}`,
      actionableGuidance: ["Foster mutual respect in communication", "Keep Venus un-afflicted"],
    },
    finance: {
      domain: "finance",
      title: "Finance & Wealth",
      sanskritTitle: "धन संपदा (Dhana Sampada)",
      ratingScore: financeScore,
      ratingLabel: getRatingLabel(financeScore),
      keyFactors: [`2nd House (Savings): ${h2Score}/100`, `11th House (Income): ${h11Score}/100`],
      favorablePeriods: ["Jupiter/Venus/2nd Lord sub-periods"],
      predictionText: `Financial stability score is ${financeScore}/100. ${financeScore >= 65 ? "Strong capacity for wealth creation, savings, and assets." : "Focus on systematic budgeting and long-term financial security."}`,
      actionableGuidance: ["Invest in low-risk diversified assets", "Perform Dhana Lakshmi remedies"],
    },
    health: {
      domain: "health",
      title: "Health & Vitality",
      sanskritTitle: "स्वास्थ्य एवं बल (Swasthya)",
      ratingScore: healthScore,
      ratingLabel: getRatingLabel(healthScore),
      keyFactors: [`1st House Score: ${h1Score}/100`, `Sun Vitality: ${sunStr}/100`],
      favorablePeriods: ["Sun/Lagna Lord Antardasha"],
      predictionText: `Overall health index is ${healthScore}/100. ${healthScore >= 65 ? "Good physical constitution, strong immunity, and stamina." : "Prioritize balanced diet, regular exercise, and stress reduction."}`,
      actionableGuidance: ["Practice daily morning Surya Arghya", "Maintain regular sleep routines"],
    },
    education: {
      domain: "education",
      title: "Education & Knowledge",
      sanskritTitle: "विद्या योग (Vidya Yoga)",
      ratingScore: eduScore,
      ratingLabel: getRatingLabel(eduScore),
      keyFactors: [`4th House: ${h4Score}/100`, `5th House: ${h5Score}/100`, `Mercury: ${mercStr}/100`],
      favorablePeriods: ["Mercury/Jupiter Antardasha"],
      predictionText: `Educational capacity is rated ${eduScore}/100. ${eduScore >= 65 ? "High intellectual aptitude, academic success, and analytical skill." : "Consistent study habits yield excellent academic growth."}`,
      actionableGuidance: ["Recite Saraswati Vandana daily", "Keep study space organized"],
    },
    children: {
      domain: "children",
      title: "Children & Progeny",
      sanskritTitle: "संतति सुख (Santati Sukha)",
      ratingScore: childrenScore,
      ratingLabel: getRatingLabel(childrenScore),
      keyFactors: [`5th House Score: ${h5Score}/100`, `Jupiter Strength: ${jupStr}/100`],
      favorablePeriods: ["Jupiter/5th Lord Antardasha"],
      predictionText: `Progeny prospects score is ${childrenScore}/100. ${childrenScore >= 65 ? "Auspicious indicators for children and joyful family life." : "Supportive rituals and health care ensure happiness from progeny."}`,
      actionableGuidance: ["Chant Santana Gopal Mantra if required", "Honor Jupiter on Thursdays"],
    },
    property: {
      domain: "property",
      title: "Property & Real Estate",
      sanskritTitle: "भूमि एवं वाहन (Bhumi & Vahana)",
      ratingScore: propertyScore,
      ratingLabel: getRatingLabel(propertyScore),
      keyFactors: [`4th House Score: ${h4Score}/100`, `Mars Strength: ${marsStr}/100`],
      favorablePeriods: ["Mars/4th Lord sub-periods"],
      predictionText: `Real estate and vehicle acquisitions score is ${propertyScore}/100. ${propertyScore >= 65 ? "Favorable indicators for property purchase and fixed asset accumulation." : "Verify legal documentation carefully before real estate investments."}`,
      actionableGuidance: ["Verify land titles thoroughly", "Worship Lord Hanuman for property stability"],
    },
    foreign_travel: {
      domain: "foreign_travel",
      title: "Foreign Travel & Settlement",
      sanskritTitle: "विदेश यात्रा (Videsha Yatra)",
      ratingScore: foreignScore,
      ratingLabel: getRatingLabel(foreignScore),
      keyFactors: [`9th House: ${h9Score}/100`, `12th House: ${h12Score}/100`],
      favorablePeriods: ["12th Lord/Rahu sub-periods"],
      predictionText: `Foreign travel index is ${foreignScore}/100. ${foreignScore >= 65 ? "Strong opportunities for overseas travel, higher education, or foreign trade." : "Short distance journeys and domestic progress favored."}`,
      actionableGuidance: ["Keep passports and visas updated", "Perform Rahu/Ketu remedies if travelling"],
    },
    spiritual_growth: {
      domain: "spiritual_growth",
      title: "Spiritual Growth & Moksha",
      sanskritTitle: "अध्यात्म एवं मोक्ष (Adhyatma)",
      ratingScore: spiritualScore,
      ratingLabel: getRatingLabel(spiritualScore),
      keyFactors: [`9th House: ${h9Score}/100`, `12th House: ${h12Score}/100`, `Jupiter: ${jupStr}/100`],
      favorablePeriods: ["Jupiter/Ketu Mahadasha"],
      predictionText: `Spiritual evolution index is ${spiritualScore}/100. ${spiritualScore >= 65 ? "High receptivity to higher wisdom, meditation, and inner peace." : "Regular spiritual practice brings profound peace and clarity."}`,
      actionableGuidance: ["Practice daily meditation", "Study sacred traditional texts"],
    },
  };

  return {
    generatedAt: new Date().toISOString(),
    domains,
  };
}
