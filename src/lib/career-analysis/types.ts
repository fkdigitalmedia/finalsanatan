import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface CareerAnalysisInput extends BirthInput {
  name: string;
}

export interface CareerV2Scores {
  overallCareerScore: number; // 0 - 100
  promotionScore: number; // 0 - 100
  leadershipScore: number; // 0 - 100
  managementScore: number; // 0 - 100
  businessSuitabilityScore: number; // 0 - 100
  governmentJobScore: number; // 0 - 100
  privateJobScore: number; // 0 - 100
  salaryGrowthScore: number; // 0 - 100
  foreignCareerScore: number; // 0 - 100
  riskIndex: number; // 0 - 100 (lower is safer)
  opportunityIndex: number; // 0 - 100
  currentDasha: string;
  currentTransit: string;
  confidencePercent: number; // e.g. 95%
}

export interface CareerDNA {
  workingStyle: string;
  leadershipStyle: string;
  communicationStyle: string;
  decisionMakingStyle: string;
  learningStyle: string;
  professionalBehaviour: string;
}

export interface CareerSuitabilityDomain {
  category: string; // e.g., "Government", "Private", "Business", "Freelancing", "Startup", "Consulting", "Teaching", "Creative", "Technology", "Finance", "Medical", "Legal", "Digital", "Entrepreneurship"
  suitabilityScore: number; // 0 - 100
  rank: number; // 1 to 14
  astrologicalBasis: string;
}

export interface D10DashamsaDetails {
  ascendantSign: string;
  house10Lord: GrahaName;
  house10Sign: string;
  planetStrengthSummary: string;
  careerPotential: string;
  professionalGrowth: string;
}

export interface CareerYogaItem {
  yogaName: string; // e.g. "Raj Yoga", "Dhana Yoga", "Bhadra Yoga", "Vipreet Raj Yoga", "Neecha Bhanga Raj Yoga"
  meaning: string;
  evidence: string;
  confidencePercent: number;
}

export interface PlanetCareerImpact {
  planet: GrahaName;
  impactSummary: string;
  careerInfluence: string;
}

export interface HouseCareerImpact {
  houseNumber: number; // 2, 6, 10, 11, 5, 9
  houseName: string;
  rashi: string;
  rashiLord: GrahaName;
  careerSignificance: string;
}

export interface PromotionAnalysis {
  bestPromotionPeriod: string;
  promotionObstacles: string;
  promotionProbabilityPercent: number;
}

export interface SalaryGrowthAnalysis {
  expectedGrowthTrend: string;
  financialCareerStrength: string;
  peakEarningYears: string;
}

export interface ForeignCareerAnalysis {
  remoteWorkSuitability: string;
  mncSuitability: string;
  internationalCareerOutlook: string;
}

export interface TopIndustryRanking {
  rank: number; // 1 to 20
  industry: string;
  suitabilityScore: number; // 0 - 100
  reason: string;
  evidence: string;
}

export interface TopCareerRoleRanking {
  rank: number; // 1 to 25
  role: string;
  category: string;
  suitabilityScore: number; // 0 - 100
  astrologicalWhy: string;
  keySkills: string[];
}

export interface MonthlyTimelineItem {
  monthName: string;
  monthRating: number; // 1 to 5
  careerFocus: string;
  promotionOutlook: string;
  learningFocus: string;
  interviewOutlook: string;
  networkingFocus: string;
  travelOutlook: string;
  riskCaution: string;
  opportunityWindow: string;
}

export interface AnnualTimelineItem {
  year: number;
  yearAge: number;
  careerOutlook: string;
  salaryOutlook: string;
  businessOutlook: string;
  keyOpportunity: string;
  majorCaution: string;
}

export interface CareerRiskAnalysis {
  officePoliticsRisk: string;
  jobInstabilityRisk: string;
  careerChangeProbability: string;
  layoffProbabilityPercent: number;
  burnoutRiskLevel: 'Low' | 'Moderate' | 'High';
}

export interface CareerOpportunityAnalysis {
  promotionOpportunity: string;
  businessOpportunity: string;
  foreignOpportunity: string;
  investmentOpportunity: string;
  leadershipOpportunity: string;
}

export interface CareerRemedies {
  temples: string[];
  mantras: string[];
  donations: string[];
  gemstones: string[];
  lifestyle: string[];
  professionalHabits: string[];
}

export interface EvidenceItem {
  claim: string;
  planet: GrahaName;
  house: number;
  d10: string;
  yoga: string;
  dasha: string;
  transit: string;
  confidencePercent: number;
}

export interface AICareerCoachPlan {
  immediateActions: string[];
  day30Plan: string[];
  day90Plan: string[];
  year1Plan: string[];
  year5Plan: string[];
}

export interface CareerAnalysisResultV2 {
  input: CareerAnalysisInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: CareerV2Scores;
  executiveSummary: string;
  dna: CareerDNA;
  suitabilityDomains: CareerSuitabilityDomain[];
  d10Dashamsa: D10DashamsaDetails;
  house10DeepAnalysis: string;
  house10LordAnalysis: string;
  atmakaraka: { planet: GrahaName; sign: string; careerSignificance: string };
  amatyakaraka: { planet: GrahaName; sign: string; careerSignificance: string };
  yogas: CareerYogaItem[];
  planetsImpact: PlanetCareerImpact[];
  housesImpact: HouseCareerImpact[];
  promotionAnalysis: PromotionAnalysis;
  salaryGrowth: SalaryGrowthAnalysis;
  foreignCareer: ForeignCareerAnalysis;
  topIndustries: TopIndustryRanking[];
  topCareerRoles: TopCareerRoleRanking[];
  monthlyTimeline: MonthlyTimelineItem[];
  annualTimeline: AnnualTimelineItem[];
  riskAnalysis: CareerRiskAnalysis;
  opportunityAnalysis: CareerOpportunityAnalysis;
  remedies: CareerRemedies;
  luckyElements: {
    colours: string[];
    days: string[];
    numbers: number[];
    direction: string[];
  };
  evidenceChain: EvidenceItem[];
  aiCoach: AICareerCoachPlan;
  finalVerdict: {
    overallScore: number;
    topStrengths: string[];
    topWeaknesses: string[];
    bestCareer: string;
    bestIndustry: string;
    bestTime: string;
    finalRecommendation: string;
  };
}
