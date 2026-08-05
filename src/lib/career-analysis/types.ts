import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface CareerAnalysisInput extends BirthInput {
  name: string;
}

export interface CareerScores {
  overallCareerScore: number; // 0 - 100 overall career potential
  governmentJobScore: number; // 0 - 100 civil services & public sector
  privateJobScore: number; // 0 - 100 corporate & private sector
  businessSuitabilityScore: number; // 0 - 100 entrepreneurship & trade
  leadershipScore: number; // 0 - 100 executive leadership & authority
  promotionScore: number; // 0 - 100 elevation & rank advancement
  salaryGrowthScore: number; // 0 - 100 income escalation & wealth gains
  managementPotential: number; // 0 - 100 team management & administration
  entrepreneurshipScore: number; // 0 - 100 startup & risk taking capacity
  foreignCareerScore: number; // 0 - 100 global employment & overseas postings
  careerStabilityScore: number; // 0 - 100 job retention & long-term stability
}

export interface CareerRoleRanking {
  role: string;
  category: string; // e.g. "Technology & AI", "Healthcare & Medicine", "Finance & Law", "Executive & Govt"
  suitabilityScore: number; // 0 - 100
  matchLevel: 'Top Fit' | 'High Potential' | 'Moderate Fit' | 'Not Recommended';
  astrologicalReasoning: string;
  keySkillsRequired: string[];
}

export interface IndustrySuitabilityItem {
  industry: string;
  suitabilityScore: number; // 0 - 100
  marketOutlook: 'Surging Growth' | 'Stable High Growth' | 'Moderate' | 'Cyclical';
  rulingPlanets: GrahaName[];
  description: string;
}

export interface HouseCareerAnalysis {
  house: number; // 1, 2, 5, 6, 9, 10, 11
  houseName: string;
  rashi: string;
  rashiLord: GrahaName;
  planetsInHouse: GrahaName[];
  aspectingPlanets: GrahaName[];
  careerSignificance: string;
  tendencies: string[];
}

export interface PlanetCareerRole {
  planet: GrahaName;
  house: number;
  rashi: string;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
  careerImpact: string;
  governedSectors: string[];
  score: number; // 0 - 100
}

export interface MonthlyCareerForecastItem {
  month: string; // e.g. "Month 1 - August 2026"
  monthName: string;
  focusArea: string; // e.g. "Promotion Pitch & Salary Negotiation"
  careerRating: number; // 1 - 5 stars
  promotionOutlook: string;
  salaryOutlook: string;
  learningFocus: string;
  interviewSuccess: string;
  networkingOpportunity: string;
  travelProbability: string;
  riskWarning: string;
  keyOpportunity: string;
  recommendedActions: string[];
  keyAstrologicalDriver: string;
}

export interface AnnualCareerTimelineEvent {
  year: number;
  phaseTitle: string;
  planetaryTransits: string;
  keyTheme: string;
  careerOpportunities: string;
  precautions: string;
}

export interface CareerRemedyItem {
  category: 'mantra' | 'donation' | 'temple' | 'gemstone' | 'charity' | 'meditation' | 'lifestyle' | 'professional_habits';
  title: string;
  description: string;
  instructions: string;
  bestTime: string;
}

export interface EvidenceChainItem {
  claim: string;
  astrologicalBasis: string;
  factors: {
    planet?: GrahaName;
    house?: number;
    rashi?: string;
    yoga?: string;
    dosha?: string;
    dasha?: string;
    transit?: string;
    d10?: string;
  };
  confidencePercent: number;
  actionableAdvice: string;
}

export interface AICareerCoachPlan {
  day30Plan: string[];
  day90Plan: string[];
  year1Plan: string[];
  year5Strategy: string[];
  recommendedCertifications: string[];
  skillDevelopmentAdvice: string[];
  networkingGuidance: string[];
  interviewPreparationTips: string[];
  leadershipGrowthStrategy: string[];
}

export interface CareerAnalysisResult {
  input: CareerAnalysisInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: CareerScores;
  house1: HouseCareerAnalysis;
  house2: HouseCareerAnalysis;
  house6: HouseCareerAnalysis;
  house10: HouseCareerAnalysis;
  house11: HouseCareerAnalysis;
  planets: Record<GrahaName, PlanetCareerRole>;
  d10Dashamsa: {
    ascendantSign: string;
    house10Sign: string;
    house10Lord: GrahaName;
    atmakaraka: GrahaName;
    amatyakaraka: GrahaName;
    summary: string;
  };
  topCareerRoles: CareerRoleRanking[];
  topIndustries: IndustrySuitabilityItem[];
  careerYogas: Array<{
    name: string;
    type: 'Raj Yoga' | 'Dhana Yoga' | 'Amala Yoga' | 'Career Booster';
    description: string;
    strength: number;
    evidence: string;
  }>;
  careerTimingWindows: {
    bestAgeForPeakSuccess: string;
    promotionWindow: string;
    jobChangeWindow: string;
    salaryIncrementWindow: string;
    interviewSuccessWindow: string;
    competitiveExamWindow: string;
    businessLaunchWindow: string;
  };
  monthlyForecast: MonthlyCareerForecastItem[];
  annualTimeline: AnnualCareerTimelineEvent[];
  remedies: CareerRemedyItem[];
  luckyElements: {
    colors: string[];
    days: string[];
    numbers: number[];
    directions: string[];
    favorableHoursDay: string[];
  };
  aiCareerCoach: AICareerCoachPlan;
  aiConsultantVerdict: {
    executiveSummary: string;
    careerReadiness: 'High Growth Readiness' | 'Moderate Advancement' | 'Strategic Realignment Needed';
    actionPlan: string[];
    finalVerdict: string;
  };
  evidenceChain: EvidenceChainItem[];
}
