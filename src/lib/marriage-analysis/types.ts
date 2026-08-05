import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface MarriageAnalysisInput extends BirthInput {
  name: string;
}

export interface MarriageScores {
  marriageScore: number; // 0 - 100 overall marriage quality
  relationshipScore: number; // 0 - 100 emotional & romantic bonding
  loveMarriageScore: number; // 0 - 100 feasibility of love marriage
  arrangedMarriageScore: number; // 0 - 100 feasibility of arranged marriage
  marriageDelayScore: number; // 0 - 100 risk/probability of delay (higher = more delay)
  spouseCompatibilityScore: number; // 0 - 100 alignment with ideal partner
  communicationScore: number; // 0 - 100 intellectual & dialogue harmony
  familyHarmonyScore: number; // 0 - 100 in-laws & family acceptance
  longTermStabilityScore: number; // 0 - 100 marital longevity & endurance
}

export interface House7Analysis {
  rashi: string;
  rashiLord: GrahaName;
  planetsInHouse: GrahaName[];
  aspectingPlanets: GrahaName[];
  strengthScore: number; // 0 - 100
  summary: string;
}

export interface PlanetMarriageRole {
  planet: GrahaName;
  house: number;
  rashi: string;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
  impactOnMarriage: string;
  score: number; // 0 - 100
}

export interface DarakarakaAnalysis {
  planet: GrahaName;
  degree: number;
  sign: string;
  house: number;
  significance: string;
  spouseTraits: string[];
}

export interface UpapadaLagnaAnalysis {
  sign: string;
  houseInD1: number;
  lord: GrahaName;
  lordPlacement: number;
  sustenanceHouseSign: string; // 2nd house from UL
  marriageStabilityStatus: string;
}

export interface MarriageYogaItem {
  name: string;
  type: 'auspicious' | 'challenging';
  description: string;
  influencingPlanets: GrahaName[];
  strength: number; // 0 - 100
  evidence: string;
}

export interface MarriageDoshaItem {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  afflictedHouses: number[];
  afflictedPlanets: GrahaName[];
  cancellationFactors: string[];
  remedyRecommendation: string;
}

export interface SpouseProfile {
  physicalAppearance: string;
  natureAndTemperament: string;
  probableProfessions: string[];
  financialStanding: string;
  directionOfOrigin: string; // e.g. North-East from birthplace
  distanceOfOrigin: string; // e.g. Nearby city or Same state
  communicationStyle: string;
}

export interface MonthlyRelationshipForecastItem {
  month: string;
  monthName: string;
  focusArea: string;
  relationshipRating: number;
  careerImpact: string;
  relationshipInsight: string;
  familyHarmony: string;
  communicationTip: string;
  travelProbability: string;
  financeAdvice: string;
  keyAstrologicalDriver: string;
}

export interface AnnualTimelineEvent {
  year: number;
  phaseTitle: string;
  planetaryTransits: string;
  keyTheme: string;
  opportunities: string;
  precautions: string;
}

export interface RemedyItem {
  category: 'temple' | 'donation' | 'mantra' | 'gemstone' | 'charity' | 'lifestyle' | 'meditation' | 'rudraksha';
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
  };
  confidencePercent: number;
  actionableInsight: string;
}

export interface MarriageAnalysisResult {
  input: MarriageAnalysisInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: MarriageScores;
  house7: House7Analysis;
  house7Lord: PlanetMarriageRole;
  venus: PlanetMarriageRole;
  jupiter: PlanetMarriageRole;
  moon: PlanetMarriageRole;
  mars: PlanetMarriageRole;
  navamsaD9: {
    ascendantSign: string;
    house7Sign: string;
    house7Lord: GrahaName;
    venusPosition: string;
    jupiterPosition: string;
    d9Summary: string;
  };
  darakaraka: DarakarakaAnalysis;
  upapadaLagna: UpapadaLagnaAnalysis;
  yogas: MarriageYogaItem[];
  doshas: MarriageDoshaItem[];
  loveVsArranged: {
    loveScore: number;
    arrangedScore: number;
    verdict: 'Strong Love Marriage' | 'Inclined to Love Marriage' | 'Balanced Love & Arranged' | 'Inclined to Arranged Marriage' | 'Strong Arranged Marriage';
    keyFactors: string[];
  };
  timing: {
    favorableAgeWindows: string[];
    currentDashaAnalysis: string;
    nextFavorableTransits: string[];
    probableMarriagePeriod: string;
  };
  spouseProfile: SpouseProfile;
  behaviorAndCommunication: {
    postMarriageBehavior: string;
    conflictResolutionStyle: string;
    familyAndInLawsHarmony: string;
    childrenAndLineage: string;
  };
  strengthsAndChallenges: {
    strengths: string[];
    challenges: string[];
  };
  monthlyForecast: MonthlyRelationshipForecastItem[];
  annualTimeline: AnnualTimelineEvent[];
  remedies: RemedyItem[];
  luckyElements: {
    colors: string[];
    days: string[];
    numbers: number[];
    directions: string[];
    gemstones: string[];
  };
  aiCoachVerdict: {
    executiveSummary: string;
    readinessLevel: 'High Readiness' | 'Moderate Readiness' | 'Remedial Action Needed';
    actionPlan: string[];
    finalVerdict: string;
  };
  evidenceChain: EvidenceChainItem[];
}
