import type { KundliResult, GrahaName, Rashi } from "@/lib/kundli/types";

export interface CareerAnalysisInput {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
  gender?: "male" | "female" | "other";
  language?: string;
}

export interface CareerScoreDetail {
  score: number;
  label: string;
  reason: string;
  evidence: string;
  interpretation: string;
}

export interface CareerV2Scores {
  overallCareerScore: number;
  promotionScore: number;
  leadershipScore: number;
  managementScore: number;
  businessSuitabilityScore: number;
  governmentJobScore: number;
  privateJobScore: number;
  salaryGrowthScore: number;
  foreignCareerScore: number;
  riskIndex: number;
  opportunityIndex: number;
  currentDasha: string;
  currentTransit: string;
  confidencePercent: number;

  // Breakdown details for Executive Dashboard Gauges
  details: {
    overall: CareerScoreDetail;
    promotion: CareerScoreDetail;
    leadership: CareerScoreDetail;
    management: CareerScoreDetail;
    business: CareerScoreDetail;
    government: CareerScoreDetail;
    privateJob: CareerScoreDetail;
    salary: CareerScoreDetail;
    foreign: CareerScoreDetail;
    risk: CareerScoreDetail;
    opportunity: CareerScoreDetail;
  };
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
  category: string;
  suitabilityScore: number;
  rank: number;
  astrologicalBasis: string;
}

export interface D10PlanetPlacement {
  planet: GrahaName;
  sign: Rashi;
  house: number;
  dignity: string;
  careerImpact: string;
}

export interface D10DashamsaDetailsV3 {
  ascendantSign: Rashi;
  ascendantLord: GrahaName;
  house10Sign: Rashi;
  house10Lord: GrahaName;
  house10LordPlacement: string;
  planetStrengthSummary: string;
  careerPotential: string;
  professionalGrowth: string;
  planetPlacements: D10PlanetPlacement[];
  d10Yogas: string[];
  hiddenPotential: string;
  weaknesses: string;
  corporateSuitability: number;
  governmentSuitability: number;
  entrepreneurSuitability: number;
  foreignCareerSuitability: number;
  promotionPotentialScore: number;
  executiveSummary: string;
}

export interface JaiminiKarakaDetail {
  planet: GrahaName;
  sign: Rashi;
  degreeInSign: number;
  careerSignificance: string;
  evidence: string;
}

export interface CareerYogaItem {
  yogaName: string;
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
  houseNumber: number;
  houseName: string;
  rashi: Rashi;
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
  rank: number;
  industry: string;
  suitabilityScore: number;
  confidencePercent: number;
  reason: string;
  evidence: string;
  supportingYoga: string;
  supportingHouse: string;
  supportingPlanet: string;
  businessSuitability: string;
  jobSuitability: string;
}

export interface TopCareerRoleRanking {
  rank: number;
  role: string;
  category: string;
  suitabilityScore: number;
  astrologicalWhy: string;
  keySkills: string[];
}

export interface MonthlyTimelineItem {
  monthName: string;
  monthRating: number; // 1..5
  careerFocus: string;
  promotionOutlook: string;
  salaryOutlook: string;
  interviewOutlook: string;
  businessOutlook: string;
  investmentOutlook: string;
  officePoliticsCaution: string;
  travelOutlook: string;
  warningAlert: string;
  opportunityWindow: string;
  bestDates: string;
  worstDates: string;
}

export interface AnnualTimelineItem {
  year: number;
  yearAge: number;
  careerLevel: string;
  promotionOutlook: string;
  incomeGrowth: string;
  roleChangeOutlook: string;
  businessOutlook: string;
  foreignOutlook: string;
  educationOutlook: string;
  leadershipOutlook: string;
  investmentOutlook: string;
  riskCaution: string;
  keyOpportunity: string;
}

export interface CareerRiskAnalysis {
  officePoliticsRisk: string;
  jobInstabilityRisk: string;
  careerChangeProbability: string;
  layoffProbabilityPercent: number;
  burnoutRiskLevel: string;
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

export interface LuckyCareerElements {
  colours: string[];
  days: string[];
  numbers: number[];
  direction: string[];
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

export interface FinalVerdict {
  overallScore: number;
  topStrengths: string[];
  topWeaknesses: string[];
  bestCareer: string;
  bestIndustry: string;
  bestTime: string;
  finalRecommendation: string;
}

export interface ChartVisuals {
  planetStrengthRadarSvg: string;
  houseStrengthBarSvg: string;
  careerWheelSvg: string;
  salaryGrowthGraphSvg: string;
}

export interface CareerAnalysisResultV2 {
  input: CareerAnalysisInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: CareerV2Scores;
  executiveSummary: string;
  dna: CareerDNA;
  suitabilityDomains: CareerSuitabilityDomain[];
  d10Dashamsa: D10DashamsaDetailsV3;
  house10DeepAnalysis: string;
  house10LordAnalysis: string;
  atmakaraka: JaiminiKarakaDetail;
  amatyakaraka: JaiminiKarakaDetail;
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
  luckyElements: LuckyCareerElements;
  evidenceChain: EvidenceItem[];
  aiCoach: AICareerCoachPlan;
  finalVerdict: FinalVerdict;
  chartVisuals: ChartVisuals;
}
