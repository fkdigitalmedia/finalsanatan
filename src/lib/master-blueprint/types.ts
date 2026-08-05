import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface MasterBlueprintInput extends BirthInput {
  name: string;
}

export interface ExecutiveLifeScores {
  overallLifeScore: number; // 0 - 100 overall life blueprint index
  careerScore: number; // 0 - 100 professional growth & status
  businessScore: number; // 0 - 100 trade, enterprise & commercial success
  marriageScore: number; // 0 - 100 relationship harmony & spouse bliss
  financeScore: number; // 0 - 100 wealth accumulation & liquidity
  healthScore: number; // 0 - 100 vitality, immunity & longevity
  foreignScore: number; // 0 - 100 global relocation & PR potential
  educationScore: number; // 0 - 100 academic & intellect mastery
  propertyScore: number; // 0 - 100 real estate & vehicle assets
  spiritualScore: number; // 0 - 100 inner peace & spiritual evolution
  leadershipScore: number; // 0 - 100 authority & executive command
  successProbability: number; // 0 - 100 overall success index
  riskIndex: number; // 0 - 100 risk vulnerability (lower = safer)
  opportunityIndex: number; // 0 - 100 growth window density
}

export interface LifeStageTimelineEvent {
  ageRange: '0-10' | '10-20' | '20-30' | '30-40' | '40-50' | '50-60' | '60+';
  stageTitle: string; // e.g. "Foundation & Education (0-10)", "Career Elevation & Marriage (20-30)"
  astrologicalFocus: string;
  majorOpportunities: string[];
  majorRisks: string[];
  recommendedStrategy: string;
}

export interface TenYearForecastItem {
  year: number;
  yearAge: number;
  careerOutlook: string;
  financeOutlook: string;
  businessOutlook: string;
  marriageOutlook: string;
  healthOutlook: string;
  foreignOutlook: string;
  propertyOutlook: string;
  keyOpportunity: string;
  majorCaution: string;
  recommendedFocus: string;
}

export interface AIDecisionItem {
  questionId: string; // e.g. "job_change", "business_launch", "investing", "property", "relocation", "foreign", "marriage", "education"
  questionText: string;
  decision: 'YES' | 'NO' | 'CONDITIONAL';
  verdictSummary: string;
  astrologicalEvidence: string;
  confidencePercent: number;
  recommendedTiming: string;
}

export interface MasterActionPlan {
  immediateActions: string[];
  day30Plan: string[];
  day90Plan: string[];
  year1Roadmap: string[];
  year3Roadmap: string[];
  year5Vision: string[];
  year10LifeStrategy: string[];
}

export interface MasterEvidenceItem {
  domain: string; // e.g. "Career", "Marriage", "Foreign", "Health", "Wealth"
  claim: string;
  ruleUsed: string;
  factors: {
    planet?: GrahaName;
    house?: number;
    rashi?: string;
    yoga?: string;
    dosha?: string;
    dasha?: string;
    transit?: string;
    numerology?: string;
    varshphal?: string;
  };
  confidencePercent: number;
  actionableInsight: string;
}

export interface SynthesizedDomainInsight {
  domainName: string; // e.g. "Career & Business Synthesis", "Marriage & Relocation Synergy"
  headline: string;
  synthesisDetails: string;
  astrologicalRationale: string;
}

export interface MasterBlueprintResult {
  input: MasterBlueprintInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: ExecutiveLifeScores;
  synthesizedInsights: SynthesizedDomainInsight[];
  lifeStageTimeline: LifeStageTimelineEvent[];
  tenYearForecast: TenYearForecastItem[];
  aiDecisions: AIDecisionItem[];
  monthlyForecast: Array<{
    monthName: string;
    overallRating: number; // 1 - 5 stars
    focusDomain: string;
    keyAdvice: string;
  }>;
  riskCalendar: string[];
  opportunityCalendar: string[];
  remedies: Array<{
    category: 'mantra' | 'gemstone' | 'temple' | 'charity' | 'lifestyle' | ' vastu';
    title: string;
    instructions: string;
    bestTime: string;
  }>;
  luckyElements: {
    colors: string[];
    days: string[];
    numbers: number[];
    directions: string[];
    lifeGems: string[];
  };
  evidenceChain: MasterEvidenceItem[];
  actionPlan: MasterActionPlan;
  aiCoachVerdict: {
    executiveSummary: string;
    lifeReadiness: 'Peak Growth Alignment' | 'Balanced Progress' | 'Strategic Caution Needed';
    finalVerdict: string;
  };
}
