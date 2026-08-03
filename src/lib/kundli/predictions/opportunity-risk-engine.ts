// ============================================================
// Phase 17.5 & 17.6 — Opportunity & Risk Detection Engine
// ------------------------------------------------------------
// Deterministically detects auspicious opportunity windows and
// risk alerts from planetary positions, house scores, dashas, and transits.
// ============================================================

import type { KundliResult, GrahaName } from "../types";
import { evaluatePlanetStrengths } from "../strength/planet-strength";
import { evaluateHouseAnalyses } from "../houses/house-analysis";

export interface OpportunityWindow {
  id: string;
  title: string;
  category: "Career" | "Business" | "Marriage" | "Finance" | "Travel" | "Education";
  probabilityScore: number; // 0..100
  intensity: "High" | "Moderate" | "Moderate-High";
  windowPeriod: string;
  description: string;
  supportingPlanets: GrahaName[];
  actionPlan: string[];
}

export interface RiskAlert {
  id: string;
  title: string;
  category: "Financial" | "Health" | "Career" | "Relationship" | "Legal" | "Property";
  severityScore: number; // 0..100
  severityLevel: "Mild" | "Moderate" | "Severe";
  vulnerablePeriod: string;
  description: string;
  mitigationSteps: string[];
  preventativeRemedies: string[];
}

export interface OpportunityRiskReport {
  generatedAt: string;
  opportunities: OpportunityWindow[];
  risks: RiskAlert[];
}

export function detectOpportunitiesAndRisks(result: KundliResult): OpportunityRiskReport {
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const houseAnalyses = evaluateHouseAnalyses(chart);

  const getPlanetStr = (g: GrahaName) => planetStrengths.find((p) => p.graha === g)?.score ?? 50;
  const getHouseScore = (hNum: number) => houseAnalyses.find((h) => h.house === hNum)?.strengthScore ?? 50;

  const currentDashaM = result.vimshottari?.current?.mahadasha?.lord ?? "Jupiter";

  const opportunities: OpportunityWindow[] = [];
  const risks: RiskAlert[] = [];

  // 1. Opportunity — Career Promotion & Growth
  const h10Score = getHouseScore(10);
  if (h10Score >= 60) {
    opportunities.push({
      id: "opp_career_growth",
      title: "Career Growth & Promotion Window",
      category: "Career",
      probabilityScore: Math.min(95, h10Score + 15),
      intensity: h10Score >= 75 ? "High" : "Moderate-High",
      windowPeriod: `Active during ${currentDashaM} Dasha cycle`,
      description: `High 10th house strength (${h10Score}/100) indicates an auspicious window for professional promotion, higher executive status, and leadership recognition.`,
      supportingPlanets: ["Sun", "Jupiter", "Saturn"],
      actionPlan: ["Proactively initiate key projects", "Seek leadership roles and mentorship"],
    });
  }

  // 2. Opportunity — Business Expansion
  const h7Score = getHouseScore(7);
  const h11Score = getHouseScore(11);
  if (h7Score >= 60 && h11Score >= 60) {
    opportunities.push({
      id: "opp_business_expansion",
      title: "Business Expansion & Trade Gains",
      category: "Business",
      probabilityScore: Math.round((h7Score + h11Score) / 2 + 10),
      intensity: "High",
      windowPeriod: "Next 12–18 Months",
      description: "Strong 7th & 11th house coordination signals major trade expansions, commercial profits, and fruitful partnerships.",
      supportingPlanets: ["Mercury", "Venus"],
      actionPlan: ["Expand trade networks", "Finalize commercial agreements"],
    });
  }

  // 3. Opportunity — Marriage Window
  if (h7Score >= 65) {
    opportunities.push({
      id: "opp_marriage_window",
      title: "Auspicious Marriage & Partnership Window",
      category: "Marriage",
      probabilityScore: Math.min(92, h7Score + 10),
      intensity: "High",
      windowPeriod: "Upcoming Jupiter & Venus Sub-Periods",
      description: "High 7th house strength and benefic aspects open an auspicious window for marriage or long-term partnership commitment.",
      supportingPlanets: ["Venus", "Jupiter"],
      actionPlan: ["Engage in matrimony talks", "Perform Guna Milan matching"],
    });
  }

  // 4. Opportunity — Investment & Wealth Creation
  const h2Score = getHouseScore(2);
  if (h2Score >= 60 && h11Score >= 60) {
    opportunities.push({
      id: "opp_investment_window",
      title: "High-Gain Investment Window",
      category: "Finance",
      probabilityScore: Math.round((h2Score + h11Score) / 2),
      intensity: "High",
      windowPeriod: "Current Financial Quarter",
      description: "Coordinated strength in 2nd and 11th houses signals optimal conditions for wealth accumulation and long-term asset investments.",
      supportingPlanets: ["Jupiter", "Venus"],
      actionPlan: ["Invest in diversified low-risk portfolios", "Build long-term savings"],
    });
  }

  // 5. Opportunity — Foreign Travel Window
  const h9Score = getHouseScore(9);
  const h12Score = getHouseScore(12);
  if (h9Score >= 60 || h12Score >= 60) {
    opportunities.push({
      id: "opp_travel_window",
      title: "Overseas Travel & Settlement Window",
      category: "Travel",
      probabilityScore: Math.round((h9Score + h12Score) / 2 + 10),
      intensity: "Moderate-High",
      windowPeriod: "Next 1 to 2 Years",
      description: "Strong 9th and 12th house placements facilitate visa approvals, foreign higher education, or international relocation.",
      supportingPlanets: ["Rahu", "Jupiter"],
      actionPlan: ["Apply for travel documentation", "Explore global education/career options"],
    });
  }

  // ----------------------------------------------------
  // RISKS & CHALLENGES DETECTION
  // ----------------------------------------------------
  // 1. Risk — Financial Risk Alert
  if (h2Score < 50 || h11Score < 50) {
    risks.push({
      id: "risk_financial",
      title: "Financial Vulnerability Alert",
      category: "Financial",
      severityScore: Math.round(100 - (h2Score + h11Score) / 2),
      severityLevel: "Moderate",
      vulnerablePeriod: "During Rahu/Saturn Sub-Periods",
      description: "Fluctuations in 2nd or 11th house strength advise caution against speculative ventures or unhedged loans.",
      mitigationSteps: ["Avoid high-risk speculative investments", "Maintain emergency liquid fund"],
      preventativeRemedies: ["Chant Mahalaxmi Mantra on Fridays", "Donate yellow sweets on Thursdays"],
    });
  }

  // 2. Risk — Health Risk Alert
  const h6Score = getHouseScore(6);
  if (h6Score > 65 || getPlanetStr("Sun") < 45) {
    risks.push({
      id: "risk_health",
      title: "Health & Immunity Vulnerability",
      category: "Health",
      severityScore: Math.round(h6Score),
      severityLevel: h6Score > 75 ? "Severe" : "Moderate",
      vulnerablePeriod: "Seasonal transitions & Sun/Saturn Antardasha",
      description: "Elevated 6th house influence requires conscious attention to digestive health, stamina, and stress management.",
      mitigationSteps: ["Adopt balanced diet & daily exercise", "Undergo routine preventive health checkups"],
      preventativeRemedies: ["Offer water to Sun at sunrise (Surya Arghya)", "Recite Mahamrityunjaya Mantra"],
    });
  }

  // 3. Risk — Relationship Challenges
  if (h7Score < 50 || getPlanetStr("Venus") < 45) {
    risks.push({
      id: "risk_relationship",
      title: "Relationship Friction Alert",
      category: "Relationship",
      severityScore: Math.round(100 - h7Score),
      severityLevel: "Moderate",
      vulnerablePeriod: "Mars/Venus square transit periods",
      description: "Subtle friction potential in interpersonal relationships; demands patience, open dialogue, and empathy.",
      mitigationSteps: ["Practice active listening with partner", "Avoid impulsive arguments"],
      preventativeRemedies: ["Worship Goddess Parvati on Fridays", "Chant Shukra Beej Mantra"],
    });
  }

  // If no major risks detected, add a mild general caution
  if (risks.length === 0) {
    risks.push({
      id: "risk_general_mild",
      title: "General Maintenance Caution",
      category: "Health",
      severityScore: 20,
      severityLevel: "Mild",
      vulnerablePeriod: "Standard seasonal transits",
      description: "Overall chart exhibits low vulnerability. Standard preventive health routines are recommended.",
      mitigationSteps: ["Maintain regular sleep schedule", "Stay well hydrated"],
      preventativeRemedies: ["Recite Hanuman Chalisa weekly"],
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    opportunities,
    risks,
  };
}
