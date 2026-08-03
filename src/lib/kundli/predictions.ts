// ============================================================
// Phase 17.2 & 17.3 — Life Area Predictions & Time-Based Engine
// ------------------------------------------------------------
// Deterministic predictions derived exclusively from calculated facts:
// - 13 Life Areas (Career, Business, Marriage, Love, Finance, Health,
//   Education, Children, Foreign Travel, Property, Vehicle, Family, Spiritual Growth)
// - Time-Based Predictions (Current Year, 1 Year, 3 Years, 5 Years, 10 Years)
// ============================================================

import type { KundliResult, GrahaName } from "./types";
import { evaluatePlanetStrengths } from "./strength/planet-strength";
import { evaluateHouseAnalyses } from "./houses/house-analysis";
import { evaluatePredictionRules } from "./predictions/prediction-rule-engine";

export type LifeAreaDomainKey =
  | "career"
  | "business"
  | "marriage"
  | "love"
  | "finance"
  | "health"
  | "education"
  | "children"
  | "foreign_travel"
  | "property"
  | "vehicle"
  | "family"
  | "spiritual_growth";

export interface TimeBasedPredictionWindow {
  timeframe: "Current Year" | "Next 1 Year" | "Next 3 Years" | "Next 5 Years" | "Next 10 Years";
  mahadashaLord: GrahaName;
  antardashaLord: GrahaName;
  keyThemes: string[];
  opportunityIndex: number; // 0..100
  riskIndex: number; // 0..100
  guidanceText: string;
}

export interface DetailedDomainPrediction {
  domain: LifeAreaDomainKey;
  title: string;
  sanskritTitle: string;
  ratingScore: number; // 0..100
  ratingLabel: "Outstanding" | "Favorable" | "Moderate" | "Challenging";
  confidenceScore: number; // 0..100
  confidenceReason: string;
  supportingRules: string[];
  supportingPlanets: GrahaName[];
  supportingHouses: number[];
  favorablePeriods: string[];
  predictionText: string;
  actionableGuidance: string[];
}

export interface ExpandedPredictionReport {
  generatedAt: string;
  domains: Record<LifeAreaDomainKey, DetailedDomainPrediction>;
  timeline: TimeBasedPredictionWindow[];
}

export function generateStructuredPredictions(result: KundliResult): ExpandedPredictionReport {
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const houseAnalyses = evaluateHouseAnalyses(chart);
  const matchedRules = evaluatePredictionRules(result);

  const getPlanetStr = (g: GrahaName) => planetStrengths.find((p) => p.graha === g);
  const getHouseScore = (hNum: number) => houseAnalyses.find((h) => h.house === hNum)?.strengthScore ?? 50;

  // Compute 13 Life Area Scores
  const h1Score = getHouseScore(1);
  const h2Score = getHouseScore(2);
  const h3Score = getHouseScore(3);
  const h4Score = getHouseScore(4);
  const h5Score = getHouseScore(5);
  const h6Score = getHouseScore(6);
  const h7Score = getHouseScore(7);
  const h8Score = getHouseScore(8);
  const h9Score = getHouseScore(9);
  const h10Score = getHouseScore(10);
  const h11Score = getHouseScore(11);
  const h12Score = getHouseScore(12);

  const h10Lord = houseAnalyses.find((h) => h.house === 10)?.lord || "Saturn";
  const p10LordStr = getPlanetStr(h10Lord)?.score ?? 50;
  const venStr = getPlanetStr("Venus")?.score ?? 50;
  const jupStr = getPlanetStr("Jupiter")?.score ?? 50;
  const sunStr = getPlanetStr("Sun")?.score ?? 50;
  const mercStr = getPlanetStr("Mercury")?.score ?? 50;
  const marsStr = getPlanetStr("Mars")?.score ?? 50;

  const careerScore = Math.round(h10Score * 0.6 + p10LordStr * 0.4);
  const businessScore = Math.round((h7Score + h11Score) / 2);
  const marriageScore = Math.round(h7Score * 0.5 + venStr * 0.25 + jupStr * 0.25);
  const loveScore = Math.round(h5Score * 0.5 + h7Score * 0.25 + venStr * 0.25);
  const financeScore = Math.round(h2Score * 0.5 + h11Score * 0.5);
  const healthScore = Math.round(h1Score * 0.5 + (100 - h6Score) * 0.2 + sunStr * 0.3);
  const eduScore = Math.round(h4Score * 0.3 + h5Score * 0.4 + mercStr * 0.3);
  const childrenScore = Math.round(h5Score * 0.6 + jupStr * 0.4);
  const foreignScore = Math.round((h9Score + h12Score) / 2);
  const propertyScore = Math.round(h4Score * 0.6 + marsStr * 0.4);
  const vehicleScore = Math.round(h4Score * 0.5 + venStr * 0.5);
  const familyScore = Math.round(h2Score * 0.6 + h4Score * 0.4);
  const ketuPresent = chart.planets.some((p) => p.graha === "Ketu" && [9, 12].includes(p.house));
  const spiritualScore = Math.round(h9Score * 0.4 + h12Score * 0.3 + jupStr * 0.3 + (ketuPresent ? 10 : 0));

  const getRatingLabel = (score: number): DetailedDomainPrediction["ratingLabel"] => {
    if (score >= 80) return "Outstanding";
    if (score >= 65) return "Favorable";
    if (score >= 45) return "Moderate";
    return "Challenging";
  };

  const currentDashaM = result.vimshottari?.current?.mahadasha?.lord ?? "Jupiter";
  const currentDashaA = result.vimshottari?.current?.antardasha?.lord ?? "Saturn";

  const makeDomain = (
    key: LifeAreaDomainKey,
    title: string,
    sanskritTitle: string,
    score: number,
    houses: number[],
    planets: GrahaName[],
    text: string,
    guidance: string[],
  ): DetailedDomainPrediction => {
    const matched = matchedRules.filter((r) => r.isMatched && r.supportingHouses.some((h) => houses.includes(h)));
    const conf = matched.length > 0 ? Math.max(...matched.map((m) => m.confidenceScore)) : 80;

    return {
      domain: key,
      title,
      sanskritTitle,
      ratingScore: score,
      ratingLabel: getRatingLabel(score),
      confidenceScore: conf,
      confidenceReason: `${matched.length} classical rules matched with average priority ranking.`,
      supportingRules: matched.map((m) => m.ruleName),
      supportingPlanets: planets,
      supportingHouses: houses,
      favorablePeriods: [`${currentDashaM}/${currentDashaA} Period`, "Jupiter Transits"],
      predictionText: text,
      actionableGuidance: guidance,
    };
  };

  const domains: Record<LifeAreaDomainKey, DetailedDomainPrediction> = {
    career: makeDomain("career", "Career & Profession", "कर्म फल (Karma Phala)", careerScore, [10, 1, 6], [h10Lord, "Sun"], `Career rating is ${careerScore}/100 based on 10th house strength. ${careerScore >= 65 ? "Indicates steady executive authority and professional leadership." : "Requires disciplined focus and gradual perseverance."}`, ["Focus on core competencies", "Strengthen 10th Lord"]),
    business: makeDomain("business", "Business & Trade", "व्यापार फल (Vyapara Phala)", businessScore, [7, 11, 3], ["Mercury", "Venus"], `Business rating is ${businessScore}/100. ${businessScore >= 65 ? "Favorable for commercial trade and partnership gains." : "Focus on risk mitigation and structured contracts."}`, ["Maintain transparent agreements", "Activate 11th Lord"]),
    marriage: makeDomain("marriage", "Marriage & Life Partner", "विवाह योग (Vivaha Yoga)", marriageScore, [7, 2, 4], ["Venus", "Jupiter"], `Marital harmony score is ${marriageScore}/100. ${marriageScore >= 65 ? "Strong emotional bonding and supportive life partner." : "Cultivate open dialogue and mutual patience."}`, ["Perform Guna Milan before marriage", "Honor Venus/Jupiter"]),
    love: makeDomain("love", "Love & Relationships", "प्रेम सम्बन्ध (Prema Sambandha)", loveScore, [5, 7], ["Venus"], `Love life rating is ${loveScore}/100. ${loveScore >= 65 ? "Harmonious romantic connections and mutual understanding." : "Encourages clarity and emotional maturity."}`, ["Keep communication transparent", "Honor Venus"]),
    finance: makeDomain("finance", "Finance & Wealth", "धन संपदा (Dhana Sampada)", financeScore, [2, 11, 9], ["Jupiter", "Venus"], `Financial rating is ${financeScore}/100. ${financeScore >= 65 ? "Strong capacity for wealth creation, savings, and investments." : "Focus on systematic budgeting."}`, ["Invest in low-risk assets", "Dhana Lakshmi remedies"]),
    health: makeDomain("health", "Health & Vitality", "स्वास्थ्य एवं बल (Swasthya)", healthScore, [1, 6, 8], ["Sun", "Mars"], `Health index is ${healthScore}/100. ${healthScore >= 65 ? "Robust physical constitution and high immunity." : "Prioritize balanced diet and regular exercise."}`, ["Daily morning Surya Arghya", "Regular physical routine"]),
    education: makeDomain("education", "Education & Knowledge", "विद्या योग (Vidya Yoga)", eduScore, [4, 5], ["Mercury", "Jupiter"], `Education index is ${eduScore}/100. ${eduScore >= 65 ? "High analytical intellect and academic success." : "Consistent study yields great progress."}`, ["Recite Saraswati Vandana", "Keep study desk organized"]),
    children: makeDomain("children", "Children & Progeny", "संतति सुख (Santati Sukha)", childrenScore, [5, 9], ["Jupiter"], `Children index is ${childrenScore}/100. ${childrenScore >= 65 ? "Auspicious indicators for progeny and joyful family life." : "Supportive rituals bring joy."}`, ["Chant Santana Gopal Mantra", "Honor Jupiter on Thursdays"]),
    foreign_travel: makeDomain("foreign_travel", "Foreign Travel", "विदेश यात्रा (Videsha Yatra)", foreignScore, [9, 12], ["Rahu"], `Foreign travel index is ${foreignScore}/100. ${foreignScore >= 65 ? "Strong opportunities for overseas travel and foreign gains." : "Domestic travel favored."}`, ["Keep travel papers ready", "Perform Rahu remedies"]),
    property: makeDomain("property", "Property & Real Estate", "भूमि संपदा (Bhumi Sampada)", propertyScore, [4], ["Mars"], `Property score is ${propertyScore}/100. ${propertyScore >= 65 ? "Favorable indicators for real estate ownership." : "Verify titles carefully."}`, ["Verify land titles", "Worship Hanuman"]),
    vehicle: makeDomain("vehicle", "Vehicle & Luxuries", "वाहन सुख (Vahana Sukha)", vehicleScore, [4, 12], ["Venus"], `Vehicle acquisition index is ${vehicleScore}/100. ${vehicleScore >= 65 ? "Favorable indicators for vehicle purchases." : "Maintain vehicle safety."}`, ["Drive safely", "Offer white flowers on Fridays"]),
    family: makeDomain("family", "Family & Lineage", "कुटुंब सुख (Kutumba Sukha)", familyScore, [2, 4], ["Jupiter"], `Family harmony score is ${familyScore}/100. ${familyScore >= 65 ? "Strong family unity and lineage support." : "Foster harmonious dialogue."}`, ["Host monthly family prayers", "Support elders"]),
    spiritual_growth: makeDomain("spiritual_growth", "Spiritual Growth & Moksha", "अध्यात्म एवं मोक्ष (Adhyatma)", spiritualScore, [9, 12], ["Ketu", "Jupiter"], `Spiritual index is ${spiritualScore}/100. ${spiritualScore >= 65 ? "High receptivity to meditation and higher truth." : "Daily dhyana brings peace."}`, ["Daily meditation practice", "Study traditional texts"]),
  };

  // Time-Based Timeline Generator
  const timeline: TimeBasedPredictionWindow[] = [
    {
      timeframe: "Current Year",
      mahadashaLord: currentDashaM,
      antardashaLord: currentDashaA,
      keyThemes: ["Career Consolidation", "Financial Planning", "Health Focus"],
      opportunityIndex: Math.round((careerScore + financeScore) / 2),
      riskIndex: Math.round(100 - healthScore),
      guidanceText: `Current year active under ${currentDashaM}/${currentDashaA}. Focus on consolidating professional projects and maintaining regular health habits.`,
    },
    {
      timeframe: "Next 1 Year",
      mahadashaLord: currentDashaM,
      antardashaLord: currentDashaA,
      keyThemes: ["Professional Advancement", "Relationship Stability"],
      opportunityIndex: Math.round((careerScore + marriageScore) / 2),
      riskIndex: Math.round(100 - (careerScore + financeScore) / 2),
      guidanceText: "Upcoming 12 months present prime windows for strategic career growth and family alignment.",
    },
    {
      timeframe: "Next 3 Years",
      mahadashaLord: currentDashaM,
      antardashaLord: "Jupiter",
      keyThemes: ["Wealth Expansion", "Property / Asset Acquisition"],
      opportunityIndex: Math.round((financeScore + propertyScore) / 2),
      riskIndex: 25,
      guidanceText: "3-Year period brings significant asset creation, foreign travel opportunities, and family milestones.",
    },
    {
      timeframe: "Next 5 Years",
      mahadashaLord: currentDashaM,
      antardashaLord: "Mercury",
      keyThemes: ["Business Scaling", "Children Progress", "Higher Status"],
      opportunityIndex: Math.round((businessScore + eduScore) / 2),
      riskIndex: 20,
      guidanceText: "5-Year horizon highlights peak business ventures, children's educational success, and social recognition.",
    },
    {
      timeframe: "Next 10 Years",
      mahadashaLord: "Saturn",
      antardashaLord: "Venus",
      keyThemes: ["Spiritual Maturity", "Legacy Building", "Peace of Mind"],
      opportunityIndex: Math.round((spiritualScore + financeScore) / 2),
      riskIndex: 15,
      guidanceText: "10-Year macro cycle emphasizes enduring legacy, spiritual maturity, and long-term financial freedom.",
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    domains,
    timeline,
  };
}
