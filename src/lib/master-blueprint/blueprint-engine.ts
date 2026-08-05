import { generateKundli } from "@/lib/kundli/engine";
import { computeCareerAnalysis } from "@/lib/career-analysis/career-engine";
import { computeMarriageAnalysis } from "@/lib/marriage-analysis/marriage-engine";
import { computeHealthAnalysis } from "@/lib/health-analysis/health-engine";
import { computeForeignSettlementAnalysis } from "@/lib/foreign-settlement/foreign-engine";
import type { GrahaName, HouseCusp, PlanetChartPosition } from "@/lib/kundli/types";
import type {
  MasterBlueprintInput,
  MasterBlueprintResult,
  ExecutiveLifeScores,
  SynthesizedDomainInsight,
  LifeStageTimelineEvent,
  TenYearForecastItem,
  AIDecisionItem,
  MasterActionPlan,
  MasterEvidenceItem,
} from "./types";
import { calculateVarshphal } from "@/lib/kundli/varshphal";

export function computeMasterLifeBlueprint(input: MasterBlueprintInput): MasterBlueprintResult {
  // 1. Invoke all core calculation engines
  const kundli = generateKundli(input);
  const careerRes = computeCareerAnalysis(input);
  const marriageRes = computeMarriageAnalysis(input);
  const healthRes = computeHealthAnalysis(input);
  const foreignRes = computeForeignSettlementAnalysis(input);
  
  const currentYear = new Date().getFullYear();
  const varshphalRes = calculateVarshphal(kundli, currentYear);

  // 2. Derive 14 Executive Life Scores
  const careerScore = careerRes.scores.overallCareerScore;
  const businessScore = careerRes.scores.businessSuitabilityScore;
  const marriageScore = marriageRes.scores.marriageScore;
  const financeScore = careerRes.scores.salaryGrowthScore;
  const healthScore = healthRes.scores.overallHealth;
  const foreignScore = foreignRes.scores.foreignSettlementScore;
  const educationScore = 88;
  const propertyScore = Math.min(96, Math.max(50, Math.round((financeScore + careerScore) / 2)));
  const spiritualScore = Math.min(95, Math.max(45, 76 + (kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === "Jupiter")?.house === 9 ? 12 : 2)));
  const leadershipScore = careerRes.scores.leadershipScore;
  const successProbability = Math.min(98, Math.max(55, Math.round((careerScore + financeScore + healthScore + marriageScore) / 4)));
  const riskIndex = Math.min(75, Math.max(20, 100 - healthRes.scores.immunity));
  const opportunityIndex = Math.min(98, Math.max(60, Math.round((careerScore + foreignScore) / 2 + 5)));

  const overallLifeScore = Math.min(98, Math.max(60, Math.round((careerScore + marriageScore + healthScore + foreignScore + financeScore) / 5)));

  const scores: ExecutiveLifeScores = {
    overallLifeScore,
    careerScore,
    businessScore,
    marriageScore,
    financeScore,
    healthScore,
    foreignScore,
    educationScore,
    propertyScore,
    spiritualScore,
    leadershipScore,
    successProbability,
    riskIndex,
    opportunityIndex,
  };

  // 3. Cross-Domain Synthesis (Integrated AI Reasoning)
  const synthesizedInsights: SynthesizedDomainInsight[] = [
    {
      domainName: "Career & International Expansion Synergy",
      headline: `High Global Business Potential (Business: ${businessScore}%, Foreign: ${foreignScore}%)`,
      synthesisDetails: `Your birth chart connects 10th House in ${careerRes.housesImpact[2].rashi} with 12th House (${foreignRes.house12.rashi}). Combined with Varshphal Muntha in House ${varshphalRes.muntha.house}, international business expansion or overseas corporate postings present high probability between ${currentYear} and ${currentYear + 2}.`,
      astrologicalRationale: `10th-12th Lord link + Varshapati ${varshphalRes.varshapati.lord} dignity in annual chart.`,
    },
    {
      domainName: "Marriage & Relocation Harmonization",
      headline: `Relationship Alignment (${marriageScore}%) & Shared Global Relocation`,
      synthesisDetails: `Jaimini Darakaraka (${marriageRes.darakaraka.planet}) in ${marriageRes.darakaraka.sign} aligns with Rahu foreign transits. Partnership stability supports shared international relocation post-marriage.`,
      astrologicalRationale: `Darakaraka planet + Upapada Lagna in ${marriageRes.upapadaLagna.sign} 2nd house sustenance.`,
    },
    {
      domainName: "Financial Growth & Health Preservation",
      headline: `Wealth Acceleration (${financeScore}%) with Pitta Agni Health Alignment`,
      synthesisDetails: `2nd and 11th house gains remain robust. Maintaining Ayurvedic ${healthRes.constitution.primaryDosha} daily routine prevents stress-induced metabolic fatigue during peak workload phases.`,
      astrologicalRationale: `Shadbala strength + 6th House Agni fire preservation.`,
    },
  ];

  // 4. AI Decision Engine (8 Practical Life Questions)
  const aiDecisions: AIDecisionItem[] = [
    {
      questionId: "job_change",
      questionText: "Should I change my job or seek a new role?",
      decision: careerScore >= 75 ? "YES" : "CONDITIONAL",
      verdictSummary: `Favorable planetary transits over 10th House (${careerRes.housesImpact[2].rashi}) support career progression and salary jumps.`,
      astrologicalEvidence: `Sun in ${careerRes.planetsImpact[0].planet} (House ${careerRes.planetsImpact[0].impactSummary}) & 10th Lord.`,
      confidencePercent: 95,
      recommendedTiming: `Next 3 to 6 months during ${careerRes.promotionAnalysis.bestPromotionPeriod}`,
    },
    {
      questionId: "business_launch",
      questionText: "Should I start an independent business or startup?",
      decision: businessScore >= 75 ? "YES" : "CONDITIONAL",
      verdictSummary: `Strong Mercury & 7th House trade indicators favor commercial ventures, particularly in ${careerRes.topIndustries[0].industry}.`,
      astrologicalEvidence: `Mercury in House ${careerRes.planetsImpact[3].impactSummary} & Jaimini Amatyakaraka ${careerRes.amatyakaraka.planet}.`,
      confidencePercent: 93,
      recommendedTiming: `Auspicious window between ${currentYear} and ${currentYear + 1}`,
    },
    {
      questionId: "investing",
      questionText: "Should I make major long-term financial investments?",
      decision: financeScore >= 70 ? "YES" : "CONDITIONAL",
      verdictSummary: `2nd House (${careerRes.housesImpact[0].rashi}) wealth lord alignment supports long-term equities, real estate, and mutual funds.`,
      astrologicalEvidence: `2nd Lord & 11th Lord gains connection in D1 chart.`,
      confidencePercent: 92,
      recommendedTiming: `Quarter 1 and Quarter 3 of current annual cycle`,
    },
    {
      questionId: "property",
      questionText: "Should I buy real estate or property?",
      decision: propertyScore >= 75 ? "YES" : "CONDITIONAL",
      verdictSummary: `Mars and 4th House real estate alignment supports home or commercial land acquisition.`,
      astrologicalEvidence: `4th House in ${foreignRes.house4.rashi} and Mars strength.`,
      confidencePercent: 91,
      recommendedTiming: `Within the next 12 to 18 months`,
    },
    {
      questionId: "relocation",
      questionText: "Should I relocate to a new city or state?",
      decision: "YES",
      verdictSummary: "Chara Rashi movable signs in key angles support favorable geographical movement.",
      astrologicalEvidence: "Moon & 9th House long travel indicators.",
      confidencePercent: 94,
      recommendedTiming: "Upcoming 6 months",
    },
    {
      questionId: "foreign",
      questionText: "Should I move or settle abroad (PR / Work Visa)?",
      decision: foreignScore >= 70 ? "YES" : "CONDITIONAL",
      verdictSummary: `Rahu in House ${foreignRes.planets.Rahu.house} and 12th House (${foreignRes.house12.rashi}) provide high foreign PR probability (${foreignRes.scores.prProbabilityScore}%).`,
      astrologicalEvidence: `Rahu foreign placement & 12th Lord ${foreignRes.house12.rashiLord}.`,
      confidencePercent: 96,
      recommendedTiming: `Top destination: ${foreignRes.countryRankings[0].country} (${foreignRes.countryRankings[0].suitabilityScore}% match)`,
    },
    {
      questionId: "marriage",
      questionText: "Should I get married or finalize life partnership?",
      decision: marriageScore >= 70 ? "YES" : "CONDITIONAL",
      verdictSummary: `7th House (${marriageRes.house7.rashi}) and Venus placement bestow high relationship stability (${marriageRes.scores.spouseCompatibilityScore}% compatibility).`,
      astrologicalEvidence: `Venus in ${marriageRes.venus.rashi} (House ${marriageRes.venus.house}) & 7th Lord ${marriageRes.house7.rashiLord}.`,
      confidencePercent: 94,
      recommendedTiming: `Probable marriage window: ${marriageRes.timing.probableMarriagePeriod}`,
    },
    {
      questionId: "education",
      questionText: "Should I pursue higher education or advanced certification?",
      decision: "YES",
      verdictSummary: "Jupiter and 5th/9th house academic alignment favors advanced degrees and certifications.",
      astrologicalEvidence: `Jupiter in House ${careerRes.housesImpact[4].rashi} & 5th House intellect.`,
      confidencePercent: 95,
      recommendedTiming: "Immediate 90-Day Execution Window",
    },
  ];

  // 5. 7-Stage Age-wise Life Timeline (0-10 to 60+)
  const birthYear = new Date(input.date).getFullYear() || currentYear - 30;
  const lifeStageTimeline: LifeStageTimelineEvent[] = [
    {
      ageRange: "0-10",
      stageTitle: "Foundation & Early Learning (Ages 0-10)",
      astrologicalFocus: "Lagna physical vitality, Moon emotional security, and family environment.",
      majorOpportunities: ["Strong early cognitive development", "Nurturing family support"],
      majorRisks: ["Minor childhood seasonal immunity shifts"],
      recommendedStrategy: "Focus on wholesome nutrition, joyful play, and foundational values.",
    },
    {
      ageRange: "10-20",
      stageTitle: "Academic Mastery & Identity Formation (Ages 10-20)",
      astrologicalFocus: "5th House intellect, Mercury analytical agility, and competitive exam preparation.",
      majorOpportunities: ["Excellence in STEM, entrance exams, and creative pursuits", "Leadership in sports & arts"],
      majorRisks: ["Distractions during major academic exam years"],
      recommendedStrategy: "Channel energy into structured study habits and athletic discipline.",
    },
    {
      ageRange: "20-30",
      stageTitle: "Career Launch, Marriage & Foreign Entry (Ages 20-30)",
      astrologicalFocus: "10th House Karma, 7th House Marriage, 9th/12th House Foreign travel, and D10 Dashamsa.",
      majorOpportunities: [
        `High growth in ${careerRes.topCareerRoles[0].role}`,
        `Overseas relocation to ${foreignRes.countryRankings[0].country}`,
        "Auspicious marriage timing window",
      ],
      majorRisks: ["Career adjustment friction during initial job transitions"],
      recommendedStrategy: "Execute 30-Day & 90-Day skill development; build strategic professional networks.",
    },
    {
      ageRange: "30-40",
      stageTitle: "Executive Elevation & Asset Building (Ages 30-40)",
      astrologicalFocus: "2nd & 11th Dhana houses, 4th House real estate, and permanent residency (PR).",
      majorOpportunities: ["C-suite / VP promotion or profitable business scale", "Real estate property purchase", "PR approval"],
      majorRisks: ["Work-life stress management"],
      recommendedStrategy: "Diversify investments, maintain daily Dinacharya routine, and lead teams effectively.",
    },
    {
      ageRange: "40-50",
      stageTitle: "Enterprise Leadership & Global Status (Ages 40-50)",
      astrologicalFocus: "Sun executive authority, Jupiter wisdom, and international reputation.",
      majorOpportunities: ["Managing Director / Founder status", "Multi-country business footprint", "Wealth compounding"],
      majorRisks: ["Metabolic health vigilance"],
      recommendedStrategy: "Focus on corporate governance, mentorship, and preventive Ayurvedic wellness.",
    },
    {
      ageRange: "50-60",
      stageTitle: "Legacy Building & Strategic Advisory (Ages 50-60)",
      astrologicalFocus: "9th House spirituality, 11th House cumulative gains, and family prosperity.",
      majorOpportunities: ["Board advisory positions", "Philanthropic contributions", "Children's academic success"],
      majorRisks: ["Joint stiffness & bone health vigilance"],
      recommendedStrategy: "Engage in executive mentorship, travel, and spiritual practices.",
    },
    {
      ageRange: "60+",
      stageTitle: "Spiritual Fulfillment & Elder Wisdom (Ages 60+)",
      astrologicalFocus: "12th House Moksha, Jupiter grace, and peaceful life contentment.",
      majorOpportunities: ["Deep spiritual realization", "Family legacy celebration", "Global leisure travel"],
      majorRisks: ["General geriatric wellness upkeep"],
      recommendedStrategy: "Practice daily Pranayama, meditation, and sharing wisdom with future generations.",
    },
  ];

  // 6. 10-Year Year-by-Year Forecast
  const tenYearForecast: TenYearForecastItem[] = Array.from({ length: 10 }).map((_, idx) => {
    const yr = currentYear + idx;
    const approxAge = yr - birthYear;
    return {
      year: yr,
      yearAge: approxAge,
      careerOutlook: `Year ${yr} (Age ${approxAge}): Favorable planetary alignment for professional elevation and skill mastery in ${careerRes.topCareerRoles[idx % 5].role}.`,
      financeOutlook: `Strong income gains; favorable period for wealth compounding and systematic investments.`,
      businessOutlook: `Excellent year to expand market reach in ${careerRes.topIndustries[idx % 4].industry}.`,
      marriageOutlook: `Harmonious marital bonding and supportive domestic environment.`,
      healthOutlook: `Robust vitality supported by regular ${healthRes.constitution.primaryDosha} Ayurvedic habits.`,
      foreignOutlook: `High probability of international travel or overseas business contracts.`,
      propertyOutlook: `Favorable window for real estate asset acquisition or home renovation.`,
      keyOpportunity: `Peak growth window in Q${(idx % 4) + 1} ${yr}.`,
      majorCaution: `Avoid impulsive financial commitments during Mercury retrograde phases.`,
      recommendedFocus: `Prioritize high-impact goals, skill upgrades, and family harmony.`,
    };
  });

  // 7. 7-Tier Action Plan
  const actionPlan: MasterActionPlan = {
    immediateActions: [
      `Review Master Blueprint Executive Dashboard and top career fit: ${careerRes.topCareerRoles[0].role}.`,
      "Activate East/North Vastu direction of home workspace.",
      "Initiate daily morning Sun Arghya and Anulom-Vilom Pranayama.",
    ],
    day30Plan: [
      "Audit current professional portfolio and document top ROI achievements.",
      "Optimize LinkedIn profile for high-value executive keywords.",
      "Consult personal advisor for energizing recommended gemstone.",
    ],
    day90Plan: [
      `Complete specialized certification in ${careerRes.topCareerRoles[0].keySkills[0]}.`,
      `Prepare immigration file for top destination: ${foreignRes.countryRankings[0].country}.`,
      "Establish 1-on-1 alignment with key corporate decision-makers.",
    ],
    year1Roadmap: [
      "Secure 25%+ compensation raise or launch independent business entity.",
      "Finalize real estate investment or home property purchase.",
      "Maintain 15-minute daily meditation for stress resilience.",
    ],
    year3Roadmap: [
      "Attain Senior Director / VP level position or ₹5Cr+ enterprise revenue.",
      "Complete Permanent Residence (PR) filing or international expansion.",
      "Build a high-performing cross-functional team.",
    ],
    year5Vision: [
      "Achieve C-suite rank (CEO, VP, Managing Director) or ₹10Cr+ business revenue.",
      "Acquire primary residential real estate and multi-stream investment assets.",
      "Establish strong industry thought leadership and global presence.",
    ],
    year10LifeStrategy: [
      "Consolidate lifelong wealth compounding, board advisory roles, and philanthropic foundation.",
      "Enjoy deep spiritual peace, family harmony, and vibrant health.",
      "Leave an enduring professional and personal legacy.",
    ],
  };

  // 8. Master Evidence Engine
  const evidenceChain: MasterEvidenceItem[] = [
    {
      domain: "Executive Life Blueprint",
      claim: `Overall Life Score: ${overallLifeScore}/100 | Success Index: ${successProbability}%`,
      ruleUsed: "1st, 10th, 9th, 5th & 2nd Lord Tri-Kona & Kendra Alignment",
      factors: {
        planet: "Sun",
        house: 10,
        rashi: careerRes.housesImpact[2].rashi,
        dasha: "Vimshottari Dasha Active Period",
      },
      confidencePercent: 96,
      actionableInsight: "Execute the 7-Tier Action Plan with confidence; planetary foundations are strongly supportive.",
    },
    {
      domain: "Career & Business",
      claim: `Top Profession Match: ${careerRes.topCareerRoles[0].role} (${careerRes.topCareerRoles[0].suitabilityScore}% Fit)`,
      ruleUsed: "D10 Dashamsa 10th Lord + Jaimini Amatyakaraka",
      factors: {
        planet: careerRes.amatyakaraka.planet,
        house: 10,
        varshphal: `D10 Ascendant ${careerRes.d10Dashamsa.ascendantSign}`,
      },
      confidencePercent: 95,
      actionableInsight: `Focus primary professional energy on ${careerRes.topCareerRoles[0].role} and ${careerRes.topIndustries[0].industry}.`,
    },
    {
      domain: "Foreign Relocation",
      claim: `Top Destination: ${foreignRes.countryRankings[0].country} (${foreignRes.countryRankings[0].suitabilityScore}% Match)`,
      ruleUsed: "Rahu 12th House Foreign Land & 9th House Luck Connection",
      factors: {
        planet: foreignRes.planets.Rahu.planet,
        house: 12,
        rashi: foreignRes.house12.rashi,
      },
      confidencePercent: 94,
      actionableInsight: `File visa and immigration paperwork during favorable transit windows.`,
    },
  ];

  // 9. AI Coach Final Verdict
  const aiCoachVerdict = {
    executiveSummary: `Your AI Master Life Blueprint reveals an exceptional life profile with an Overall Life Score of ${overallLifeScore}/100 and a Success Probability of ${successProbability}%. Strong alignment between 10th House in ${careerRes.housesImpact[2].rashi}, D10 Dashamsa, Rahu 12th house foreign transits, and Pitta-Vata constitution provides powerful momentum for career elevation, global relocation to ${foreignRes.countryRankings[0].country}, and wealth compounding.`,
    lifeReadiness: (overallLifeScore >= 75 ? 'Peak Growth Alignment' : overallLifeScore >= 65 ? 'Balanced Progress' : 'Strategic Caution Needed') as 'Peak Growth Alignment' | 'Balanced Progress' | 'Strategic Caution Needed',
    finalVerdict: `With an Overall Life Score of ${overallLifeScore}/100, high Success Index (${successProbability}%), and strong PR probability (${foreignRes.scores.prProbabilityScore}%), your master astrological blueprint portends an extraordinary, fulfilling, and prosperous life journey when proactive action plans and preventive remedies are maintained.`,
  };

  return {
    input,
    calculatedAt: new Date().toISOString(),
    kundli,
    scores,
    synthesizedInsights,
    lifeStageTimeline,
    tenYearForecast,
    aiDecisions,
    monthlyForecast: careerRes.monthlyTimeline.map((m) => ({
      monthName: m.monthName,
      overallRating: m.monthRating,
      focusDomain: m.careerFocus,
      keyAdvice: m.promotionOutlook,
    })),
    riskCalendar: [
      "Mercury Retrograde periods (Exercise care in contract signings & legal paperwork)",
      "Monsoon season transition (Maintain Pitta-Vata digestive hygiene)",
    ],
    opportunityCalendar: [
      `Upcoming 6 months (Peak promotion & job change window)`,
      `Q1 & Q3 of current annual cycle (Optimal for major investments)`,
    ],
    remedies: [
      {
        category: "mantra",
        title: "Gayatri & Rahu Beej Mantra Recitation",
        instructions: "Chant 108 times daily facing East during sunrise.",
        bestTime: "Daily at Sunrise & Saturday evenings",
      },
      {
        category: "temple",
        title: "Surya Arghya & Shiva-Parvati Jalabhishekam",
        instructions: "Offer water with red flowers to Sun God daily using a copper vessel.",
        bestTime: "Daily morning routine",
      },
      {
        category: "lifestyle",
        title: "Vastu & Circadian Dinacharya Alignment",
        instructions: "Face East/North while working; keep bedroom South-West.",
        bestTime: "Daily lifestyle practice",
      },
    ],
    luckyElements: {
      colors: ["Royal Blue", "Golden Yellow", "Emerald Green", "Copper Red"],
      days: ["Sunday", "Thursday", "Wednesday"],
      numbers: [1, 3, 5, 9],
      directions: ["East", "North", "North-East"],
      lifeGems: ["Ruby", "Yellow Sapphire", "Emerald"],
    },
    evidenceChain,
    actionPlan,
    aiCoachVerdict,
  };
}
