import type { KundliResult, GrahaName, Rashi } from "@/lib/kundli/types";

export interface MarriageAnalysisInput {
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

export interface MarriageScoreDetail {
  score: number;
  label: string;
  strength: string;
  weakness: string;
  reason: string;
  evidence: string;
  recommendation: string;
}

export interface MarriageScores {
  overallScore: number;
  marriageScore: number;
  spouseCompatibilityScore: number;
  manglikDoshaScore: number; // 0 = No dosha, 100 = Severe
  timingScore: number;
  remedyScore: number;

  details: {
    overall: MarriageScoreDetail;
    marriage: MarriageScoreDetail;
    compatibility: MarriageScoreDetail;
    manglik: MarriageScoreDetail;
    timing: MarriageScoreDetail;
    remedy: MarriageScoreDetail;
  };
}

export interface ExpandedHouse7Analysis {
  houseStrengthScore: number;
  lordDignity: string;
  lordPlacement: string;
  beneficAspects: string[];
  maleficAspects: string[];
  conjunctions: string[];
  navamsaSupport: string;
  longTermMarriageEffects: string;
  evidenceChain: string[];
  confidencePercent: number;
}

export interface ExpandedVenusAnalysis {
  loveLanguage: string;
  romanticExpression: string;
  emotionalBondingStyle: string;
  physicalAttractionIndex: number;
  marriageHappinessPotential: string;
  luxuryPreferences: string;
  relationshipExpectations: string;
  affectionStyle: string;
  compatibilityInfluence: string;
}

export interface ExpandedJupiterAnalysis {
  blessingsSummary: string;
  spouseWisdomLevel: string;
  marriageStabilityImpact: string;
  familyValuesAlignment: string;
  childrenProspects: string;
  ethicsAndMorality: string;
  supportiveRoleInCareer: string;
}

export interface ExpandedManglikAnalysis {
  hasManglikDosha: boolean;
  doshaSeverity: "None" | "Mild" | "Moderate" | "Severe";
  marsHouse: number;
  marsRashi: Rashi;
  cancellationRulesApplied: string[];
  isCancelled: boolean;
  realLifeImpact: string;
  conflictResolutionStyle: string;
  temperamentAnalysis: string;
  recommendedRemedies: string[];
  lifestyleAdvice: string;
}

export interface DetailedSpouseProfile {
  appearance: string;
  heightEstimate: string;
  bodyType: string;
  faceStructure: string;
  voiceAndTone: string;
  nature: string;
  temperament: string;
  educationBackground: string;
  likelyProfession: string;
  estimatedIncomeLevel: string;
  lifestylePreferences: string;
  habitsAndInterests: string;
  romanticNature: string;
  financialAttitude: string;
  communicationStyle: string;
  childrenPreference: string;
  familyBackground: string;
  summary: string;
}

export interface RemedyCardItem {
  title: string;
  purpose: string;
  whyRecommended: string;
  procedure: string;
  bestDay: string;
  bestTime: string;
  duration: string;
  expectedBenefit: string;
}

export interface LuckyMarriageElements {
  colours: string[];
  numbers: number[];
  gemstones: string[];
  direction: string[];
  metal: string;
  mantra: string;
  fastingDay: string;
  luckyDates: string[];
  luckyMonths: string[];
  luckyNakshatra: string[];
}

export interface EnterpriseNewChapters {
  relationshipRedFlags: string[];
  relationshipGreenFlags: string[];
  loveLanguageDetails: string;
  conflictResolutionStyle: string;
  emotionalNeeds: string;
  trustIndexScore: number;
  financialCompatibilityScore: number;
  familyCompatibilityScore: number;
  inLawCompatibilityScore: number;
  intimacyCompatibilityScore: number;
  childBirthTimingWindow: string;
  foreignSpousePossibility: string;
  loveMarriageProbabilityPercent: number;
  arrangedMarriageProbabilityPercent: number;
  secondMarriagePossibility: string;
  marriageDelayCauses: string[];
  planetWiseMarriageStrength: { planet: GrahaName; score: number; impact: string }[];
  navamsaHeatmapSummary: string;
  top10Strengths: string[];
  top10Risks: string[];
  fiveYearMarriageRoadmap: { year: number; focus: string; forecast: string }[];
}

export interface MarriageTimingInfo {
  bestMarriageWindows: string[];
  moderateMarriageWindows: string[];
  avoidPeriods: string[];
  planetaryReasons: string;
  dashaSupport: string;
  transitSupport: string;
  probableMarriagePeriod: string;
  confidenceScore: number;
}

export interface MonthlyMarriageItem {
  monthName: string;
  loveOutlook: string;
  communicationOutlook: string;
  financeOutlook: string;
  familyOutlook: string;
  romanceRating: number; // 1..5
  travelOutlook: string;
  healthOutlook: string;
  conflictCaution: string;
  remedyAction: string;
  opportunityWindow: string;
}

export interface AnnualMarriageItem {
  year: number;
  yearAge: number;
  relationshipOutlook: string;
  familyGrowthOutlook: string;
  financialHarmonization: string;
  keyMilestone: string;
}

export interface EvidenceItem {
  claim: string;
  planet: GrahaName;
  house: number;
  yoga: string;
  dasha: string;
  evidence: string;
  confidencePercent: number;
  conclusion: string;
}

export interface FinalVerdict {
  overallScore: number;
  topStrengths: string[];
  topRisks: string[];
  marriageTypeProbability: string;
  finalRecommendation: string;
}

export interface ChartVisuals {
  marriageRadarSvg: string;
  housePowerBarSvg: string;
  compatibilityWheelSvg: string;
  fiveYearRoadmapSvg: string;
}

export interface MarriageAnalysisResult {
  input: MarriageAnalysisInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: MarriageScores;
  executiveSummary: string;
  house7: ExpandedHouse7Analysis;
  venus: ExpandedVenusAnalysis;
  jupiter: ExpandedJupiterAnalysis;
  manglik: ExpandedManglikAnalysis;
  spouseProfile: DetailedSpouseProfile;
  timing: MarriageTimingInfo;
  monthlyForecast: MonthlyMarriageItem[];
  annualTimeline: AnnualMarriageItem[];
  remedies: RemedyCardItem[];
  luckyElements: LuckyMarriageElements;
  evidenceChain: EvidenceItem[];
  newChapters: EnterpriseNewChapters;
  finalVerdict: FinalVerdict;
  chartVisuals: ChartVisuals;
}
