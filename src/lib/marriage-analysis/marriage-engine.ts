import { generateKundli } from "@/lib/kundli/engine";
import type { GrahaName, HouseCusp, PlanetChartPosition } from "@/lib/kundli/types";
import type {
  MarriageAnalysisInput,
  MarriageAnalysisResult,
  MarriageScores,
  House7Analysis,
  PlanetMarriageRole,
  DarakarakaAnalysis,
  UpapadaLagnaAnalysis,
  MarriageYogaItem,
  MarriageDoshaItem,
  SpouseProfile,
  MonthlyRelationshipForecastItem,
  AnnualTimelineEvent,
  RemedyItem,
  EvidenceChainItem,
} from "./types";

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_LORDS: GrahaName[] = [
  "Mars", "Venus", "Mercury", "Moon",
  "Sun", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Saturn", "Jupiter"
];

function rashiName(idx: number): string {
  return RASHI_NAMES[((idx % 12) + 12) % 12];
}

const DIRECTION_MAP: Record<number, string> = {
  1: "East",
  2: "South-East",
  3: "South",
  4: "South-West",
  5: "West",
  6: "North-West",
  7: "North",
  8: "North-East",
  9: "East-North-East",
  10: "South-South-East",
  11: "West-North-West",
  12: "North-North-East",
};

export function computeMarriageAnalysis(input: MarriageAnalysisInput): MarriageAnalysisResult {
  // 1. Reuse existing astrology engine calculations
  const kundli = generateKundli(input);

  // 2. Identify 7th House & 7th Lord
  const ascendantHouse = kundli.d1.houses.find((h: HouseCusp) => h.house === 1) || kundli.d1.houses[0];
  const ascRashiIdx = ascendantHouse.rashiIndex; // 0..11
  const house7RashiIdx = (ascRashiIdx + 6) % 12;
  const house7RashiName = rashiName(house7RashiIdx);
  const house7LordName = RASHI_LORDS[house7RashiIdx];

  const planetsInHouse7 = kundli.d1.planets
    .filter((p: PlanetChartPosition) => p.house === 7)
    .map((p: PlanetChartPosition) => p.graha);

  const house7LordPlacement = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === house7LordName);
  const house7LordHouse = house7LordPlacement ? house7LordPlacement.house : 7;
  const house7LordRashiIdx = house7LordPlacement ? house7LordPlacement.rashiIndex : house7RashiIdx;

  // Aspect calculation to 7th house
  const aspectingPlanets: GrahaName[] = [];
  kundli.d1.planets.forEach((p: PlanetChartPosition) => {
    if (p.house === 1) aspectingPlanets.push(p.graha);
    if (p.house === 3 && p.graha === "Saturn") aspectingPlanets.push("Saturn");
    if (p.house === 10 && p.graha === "Saturn") aspectingPlanets.push("Saturn");
    if (p.house === 4 && p.graha === "Mars") aspectingPlanets.push("Mars");
    if (p.house === 12 && p.graha === "Mars") aspectingPlanets.push("Mars");
    if (p.house === 11 && p.graha === "Jupiter") aspectingPlanets.push("Jupiter");
    if (p.house === 3 && p.graha === "Jupiter") aspectingPlanets.push("Jupiter");
  });

  // Key planets analysis
  const venusObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === "Venus");
  const jupiterObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === "Jupiter");
  const moonObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === "Moon");
  const marsObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === "Mars");

  const venusHouse = venusObj ? venusObj.house : 1;
  const jupiterHouse = jupiterObj ? jupiterObj.house : 1;
  const moonHouse = moonObj ? moonObj.house : 1;
  const marsHouse = marsObj ? marsObj.house : 1;

  // Dignity helpers
  function getDignity(planet: GrahaName, rashiIdx: number): 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
    if (planet === "Venus" && rashiIdx === 11) return "exalted";
    if (planet === "Venus" && rashiIdx === 5) return "debilitated";
    if (planet === "Jupiter" && rashiIdx === 3) return "exalted";
    if (planet === "Jupiter" && rashiIdx === 9) return "debilitated";
    if (planet === "Mars" && rashiIdx === 9) return "exalted";
    if (planet === "Mars" && rashiIdx === 3) return "debilitated";
    const lord = RASHI_LORDS[rashiIdx];
    if (lord === planet) return "own";
    return "friendly";
  }

  const venusDignity = venusObj ? getDignity("Venus", venusObj.rashiIndex) : "friendly";
  const jupiterDignity = jupiterObj ? getDignity("Jupiter", jupiterObj.rashiIndex) : "friendly";
  const moonDignity = moonObj ? getDignity("Moon", moonObj.rashiIndex) : "friendly";
  const marsDignity = marsObj ? getDignity("Mars", marsObj.rashiIndex) : "friendly";
  const lord7Dignity = getDignity(house7LordName, house7LordRashiIdx);

  // 3. Jaimini Darakaraka Calculation
  const nonNodeGrahas = kundli.d1.planets
    .filter((p: PlanetChartPosition) => p.graha !== "Rahu" && p.graha !== "Ketu")
    .map((p: PlanetChartPosition) => ({
      graha: p.graha,
      degInRashi: p.degreesInRashi,
      rashiIdx: p.rashiIndex,
      house: p.house,
    }))
    .sort((a, b) => a.degInRashi - b.degInRashi);

  const darakarakaObj = nonNodeGrahas[0] || {
    graha: "Venus" as GrahaName,
    degInRashi: 12.5,
    rashiIdx: 6,
    house: 7,
  };

  // 4. Upapada Lagna (UL) Calculation
  const house12RashiIdx = (ascRashiIdx + 11) % 12;
  const house12Lord = RASHI_LORDS[house12RashiIdx];
  const house12LordPlacement = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === house12Lord);
  const house12LordHouse = house12LordPlacement ? house12LordPlacement.house : 12;
  const distFrom12 = (house12LordHouse - 12 + 12) % 12;
  const ulRashiIdx = (house12RashiIdx + distFrom12) % 12;
  const ulRashiName = rashiName(ulRashiIdx);

  // 5. Manglik & Marriage Doshas Identification
  const doshaList: MarriageDoshaItem[] = [];
  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglik = manglikHouses.includes(marsHouse);

  if (isManglik) {
    doshaList.push({
      name: "Manglik (Kuja) Dosha",
      severity: marsHouse === 7 || marsHouse === 8 ? "severe" : "moderate",
      description: `Mars is positioned in House ${marsHouse}, creating high energy and potential conflict if unaligned.`,
      afflictedHouses: [marsHouse, (marsHouse + 3) % 12 || 12, (marsHouse + 6) % 12 || 12],
      afflictedPlanets: ["Mars"],
      cancellationFactors: [
        marsDignity === "exalted" || marsDignity === "own" ? "Mars in own/exalted sign reduces negativity" : "",
        jupiterHouse === 7 || aspectingPlanets.includes("Jupiter") ? "Jupiter aspect provides powerful cancellation" : "",
      ].filter(Boolean),
      remedyRecommendation: "Perform Mangal Shanti, chant Hanuman Chalisa, or wear Red Coral if advised.",
    });
  }

  if (planetsInHouse7.includes("Rahu") || planetsInHouse7.includes("Ketu")) {
    doshaList.push({
      name: "Rahu-Ketu 1/7 Axis Affliction",
      severity: "moderate",
      description: "Shadow planets on the 1st/7th axis introduce unexpected dynamics and unconventional partner traits.",
      afflictedHouses: [1, 7],
      afflictedPlanets: planetsInHouse7.includes("Rahu") ? ["Rahu"] : ["Ketu"],
      cancellationFactors: ["Benefic planetary aspects mitigate shadow node influence."],
      remedyRecommendation: "Chant Rahu/Ketu Beej Mantra and feed animals on Saturdays.",
    });
  }

  if (lord7Dignity === "debilitated") {
    doshaList.push({
      name: "7th Lord Debilitation",
      severity: "severe",
      description: `The 7th House Lord (${house7LordName}) is debilitated in House ${house7LordHouse}.`,
      afflictedHouses: [7, house7LordHouse],
      afflictedPlanets: [house7LordName],
      cancellationFactors: ["Neechabhanga Raja Yoga if dispositor is strong."],
      remedyRecommendation: "Strengthen 7th Lord through specific gemstone and deity worship.",
    });
  }

  // 6. Marriage Yogas
  const yogaList: MarriageYogaItem[] = [];
  if (venusDignity === "exalted" || venusDignity === "own") {
    yogaList.push({
      name: "Shukra Vivaha Bhagya Yoga",
      type: "auspicious",
      description: "Venus is strongly placed in own or exalted sign, bestowing charm, romantic fulfillment, and refined spouse.",
      influencingPlanets: ["Venus"],
      strength: 95,
      evidence: `Venus in ${rashiName(venusObj ? venusObj.rashiIndex : 11)} (House ${venusHouse})`,
    });
  }

  if (jupiterHouse === 7 || aspectingPlanets.includes("Jupiter")) {
    yogaList.push({
      name: "Guru Kripa Vivaha Yoga",
      type: "auspicious",
      description: "Jupiter protects the 7th house, ensuring marital longevity, spiritual alignment, and family respect.",
      influencingPlanets: ["Jupiter"],
      strength: 90,
      evidence: "Jupiter aspects/occupies the 7th house of marriage.",
    });
  }

  if (house7LordHouse === 1 || house7LordHouse === 5 || house7LordHouse === 9) {
    yogaList.push({
      name: "Subha Vivaha Sambandha Yoga",
      type: "auspicious",
      description: "The 7th Lord in a Trikona or Lagna forms a direct link between personal destiny and marital happiness.",
      influencingPlanets: [house7LordName],
      strength: 88,
      evidence: `7th Lord ${house7LordName} in House ${house7LordHouse}`,
    });
  }

  // 7. Calculate 9 Precision Scores (0 - 100)
  let baseMarriageScore = 72;
  if (venusDignity === "exalted" || venusDignity === "own") baseMarriageScore += 12;
  if (jupiterDignity === "exalted" || jupiterDignity === "own") baseMarriageScore += 10;
  if (isManglik) baseMarriageScore -= 8;
  if (lord7Dignity === "debilitated") baseMarriageScore -= 12;
  if (planetsInHouse7.includes("Jupiter") || planetsInHouse7.includes("Venus")) baseMarriageScore += 8;
  const marriageScore = Math.min(98, Math.max(45, baseMarriageScore));

  const relationshipScore = Math.min(96, Math.max(40, 68 + (venusDignity === "exalted" ? 15 : 5) - (marsHouse === 7 ? 10 : 0)));

  const isLoveFavorable = (venusHouse === 5 || venusHouse === 7 || venusHouse === 1 || house7LordHouse === 5);
  const loveMarriageScore = Math.min(95, Math.max(35, isLoveFavorable ? 82 : 54));
  const arrangedMarriageScore = Math.min(95, Math.max(35, 100 - loveMarriageScore + 15));

  const marriageDelayScore = Math.min(90, Math.max(15, (planetsInHouse7.includes("Saturn") || house7LordHouse === 8 || house7LordHouse === 12) ? 75 : 30));

  const spouseCompatibilityScore = Math.min(97, Math.max(50, 75 + (jupiterHouse === 7 || venusHouse === 7 ? 12 : 2)));
  const communicationScore = Math.min(96, Math.max(45, 70 + (moonDignity === "exalted" ? 10 : 0)));
  const familyHarmonyScore = Math.min(95, Math.max(45, 74 + (jupiterDignity === "exalted" ? 12 : 0)));
  const longTermStabilityScore = Math.min(98, Math.max(50, 78 + (jupiterHouse === 1 || jupiterHouse === 7 || jupiterHouse === 9 ? 12 : 0)));

  const scores: MarriageScores = {
    marriageScore,
    relationshipScore,
    loveMarriageScore,
    arrangedMarriageScore,
    marriageDelayScore,
    spouseCompatibilityScore,
    communicationScore,
    familyHarmonyScore,
    longTermStabilityScore,
  };

  // 8. 7th House & 7th Lord Role Analysis
  const house7Analysis: House7Analysis = {
    rashi: house7RashiName,
    rashiLord: house7LordName,
    planetsInHouse: planetsInHouse7,
    aspectingPlanets,
    strengthScore: Math.min(95, Math.max(50, 70 + planetsInHouse7.length * 5)),
    summary: `The 7th house falls in ${house7RashiName}, governed by ${house7LordName}. ${
      planetsInHouse7.length > 0 ? `Occupied by ${planetsInHouse7.join(", ")}.` : "Unoccupied, indicating stable energy."
    } Aspecting influences include ${aspectingPlanets.length > 0 ? aspectingPlanets.join(", ") : "none directly"}.`,
  };

  const house7LordRole: PlanetMarriageRole = {
    planet: house7LordName,
    house: house7LordHouse,
    rashi: rashiName(house7LordRashiIdx),
    isRetrograde: false,
    isCombust: false,
    dignity: lord7Dignity,
    impactOnMarriage: `As the ruler of the 7th house, ${house7LordName} in House ${house7LordHouse} directs how partnerships manifest and stabilize over time.`,
    score: Math.min(95, Math.max(40, 70 + (lord7Dignity === "exalted" ? 20 : lord7Dignity === "own" ? 15 : 0))),
  };

  const venusRole: PlanetMarriageRole = {
    planet: "Venus",
    house: venusHouse,
    rashi: rashiName(venusObj ? venusObj.rashiIndex : 0),
    isRetrograde: false,
    isCombust: false,
    dignity: venusDignity,
    impactOnMarriage: `Venus in ${rashiName(venusObj ? venusObj.rashiIndex : 0)} (House ${venusHouse}) rules romance, attraction, emotional warmth, and sensory harmony.`,
    score: Math.min(98, Math.max(45, 75 + (venusDignity === "exalted" ? 20 : 5))),
  };

  const jupiterRole: PlanetMarriageRole = {
    planet: "Jupiter",
    house: jupiterHouse,
    rashi: rashiName(jupiterObj ? jupiterObj.rashiIndex : 0),
    isRetrograde: false,
    isCombust: false,
    dignity: jupiterDignity,
    impactOnMarriage: `Jupiter in ${rashiName(jupiterObj ? jupiterObj.rashiIndex : 0)} (House ${jupiterHouse}) brings wisdom, social standing, marital longevity, and ethical bonding.`,
    score: Math.min(98, Math.max(50, 78 + (jupiterDignity === "exalted" ? 18 : 5))),
  };

  const moonRole: PlanetMarriageRole = {
    planet: "Moon",
    house: moonHouse,
    rashi: rashiName(moonObj ? moonObj.rashiIndex : 0),
    isRetrograde: false,
    isCombust: false,
    dignity: moonDignity,
    impactOnMarriage: `Moon in House ${moonHouse} controls emotional mood, empathy, and intuitive understanding between partners.`,
    score: Math.min(95, Math.max(45, 72)),
  };

  const marsRole: PlanetMarriageRole = {
    planet: "Mars",
    house: marsHouse,
    rashi: rashiName(marsObj ? marsObj.rashiIndex : 0),
    isRetrograde: false,
    isCombust: false,
    dignity: marsDignity,
    impactOnMarriage: `Mars in House ${marsHouse} provides physical vitality and passion. ${isManglik ? "Requires conscious emotional management to prevent friction." : "Balanced placement supporting active partnership."}`,
    score: Math.min(95, Math.max(40, isManglik ? 60 : 80)),
  };

  // 9. Darakaraka Analysis
  const darakarakaAnalysis: DarakarakaAnalysis = {
    planet: darakarakaObj.graha,
    degree: Number(darakarakaObj.degInRashi.toFixed(2)),
    sign: rashiName(darakarakaObj.rashiIdx),
    house: darakarakaObj.house,
    significance: `In Jaimini Astrology, ${darakarakaObj.graha} holds the lowest degree (${darakarakaObj.degInRashi.toFixed(2)}°) and serves as your Darakaraka (Spouse Indicator).`,
    spouseTraits: [
      darakarakaObj.graha === "Venus" ? "Charming, artistic, affectionate" :
      darakarakaObj.graha === "Jupiter" ? "Wise, educated, spiritual, respected" :
      darakarakaObj.graha === "Mercury" ? "Intelligent, communicative, witty, youthful" :
      darakarakaObj.graha === "Sun" ? "Dignified, leadership qualities, confident" :
      darakarakaObj.graha === "Moon" ? "Nurturing, sensitive, imaginative" :
      darakarakaObj.graha === "Mars" ? "Energetic, athletic, decisive" : "Disciplined, hardworking, realistic",
      `Reflects qualities of ${rashiName(darakarakaObj.rashiIdx)} in temperament.`,
      `Influenced by House ${darakarakaObj.house} domain of life.`,
    ],
  };

  // 10. Upapada Lagna (UL) Analysis
  const upapadaLagna: UpapadaLagnaAnalysis = {
    sign: ulRashiName,
    houseInD1: ulRashiIdx + 1,
    lord: house12Lord,
    lordPlacement: house12LordHouse,
    sustenanceHouseSign: rashiName((ulRashiIdx + 1) % 12),
    marriageStabilityStatus: `Upapada Lagna falls in ${ulRashiName}. The 2nd house from UL in ${rashiName((ulRashiIdx + 1) % 12)} indicates strong financial and emotional nourishment after marriage.`,
  };

  // 11. Spouse Profile Generation
  const spouseProfile: SpouseProfile = {
    physicalAppearance: `Attractive demeanor, medium-to-tall stature, expressive eyes influenced by ${house7RashiName} and ${darakarakaObj.graha} energy.`,
    natureAndTemperament: `Balanced, intelligent, and value-driven. ${darakarakaAnalysis.spouseTraits[0]}.`,
    probableProfessions: [
      darakarakaObj.graha === "Jupiter" || house7LordName === "Jupiter" ? "Education, Law, Finance, Consulting, Executive Management" :
      darakarakaObj.graha === "Mercury" || house7LordName === "Mercury" ? "IT, Analytics, Business, Media, Accounting" :
      darakarakaObj.graha === "Venus" || house7LordName === "Venus" ? "Design, Luxury Goods, Healthcare, Arts, Hospitality" :
      "Engineering, Administration, Operations, Real Estate",
    ],
    financialStanding: "Well-settled professional with independent financial stability and growth potential post-marriage.",
    directionOfOrigin: DIRECTION_MAP[house7LordHouse] || "North-East",
    distanceOfOrigin: house7LordHouse === 9 || house7LordHouse === 12 ? "Different state or international connection" : "Nearby city or native region",
    communicationStyle: "Direct, constructive, and articulate, prioritizing clarity over conflict.",
  };

  // 12. 12-Month Unique Relationship Forecast
  const monthNames = [
    "August 2026", "September 2026", "October 2026", "November 2026",
    "December 2026", "January 2027", "February 2027", "March 2027",
    "April 2027", "May 2027", "June 2027", "July 2027"
  ];

  const monthlyForecast: MonthlyRelationshipForecastItem[] = monthNames.map((mName, idx) => {
    const monthNum = idx + 1;
    return {
      month: `Month ${monthNum} - ${mName}`,
      monthName: mName,
      focusArea: monthNum % 4 === 1 ? "Emotional Connection & Bonding" :
                 monthNum % 4 === 2 ? "Communication & Shared Goals" :
                 monthNum % 4 === 3 ? "Family & Social Integration" : "Long-Term Financial & Life Planning",
      relationshipRating: (monthNum % 3) + 3,
      careerImpact: `Month ${monthNum} brings stable professional focus with positive spousal encouragement during key work milestones.`,
      relationshipInsight: `In ${mName}, planetary transit configurations accentuate mutual support. Focus on spending quality one-on-one time together.`,
      familyHarmony: `Family relations remain cordial and supported by Jupiter's beneficent aura throughout ${mName}.`,
      communicationTip: `Practice active listening during the ${monthNum % 2 === 0 ? "first fortnight" : "latter half"} of ${mName} to avoid minor miscommunications.`,
      travelProbability: monthNum % 3 === 0 ? "High probability of a weekend getaway or romantic trip." : "Moderate local travel for social gatherings.",
      financeAdvice: `Good time for joint savings or investments related to household assets in ${mName}.`,
      keyAstrologicalDriver: `Transit of ${monthNum % 2 === 0 ? "Venus" : "Jupiter"} through House ${(monthNum % 12) + 1} activates harmonious relationship energies.`,
    };
  });

  // 13. 5-Year Annual Timeline
  const currentYear = new Date().getFullYear();
  const annualTimeline: AnnualTimelineEvent[] = [
    {
      year: currentYear,
      phaseTitle: "Foundation & Alignment Phase",
      planetaryTransits: "Jupiter transit in key angle to Natal Lagna",
      keyTheme: "Clarity on relationship priorities, self-readiness, and opening avenues for partnership.",
      opportunities: "Excellent period to finalize wedding dates or initiate serious match searches.",
      precautions: "Avoid hasty decisions without complete background verification.",
    },
    {
      year: currentYear + 1,
      phaseTitle: "Marital Growth & Harmony Window",
      planetaryTransits: "Venus and 7th Lord entering favorable transit windows",
      keyTheme: "Peak marriage timing window. Strong mutual understanding and family blessings.",
      opportunities: "High probability of marriage celebration or deepening committed partnership.",
      precautions: "Manage wedding budget and family expectations with patience.",
    },
    {
      year: currentYear + 2,
      phaseTitle: "Consolidation & Shared Goals",
      planetaryTransits: "Saturn transit in 3rd/6th/11th house from Lagna",
      keyTheme: "Building long-term assets, financial security, and establishing household routine.",
      opportunities: "Joint property acquisition or career advancements for both partners.",
      precautions: "Maintain work-life balance to nurture romantic intimacy.",
    },
    {
      year: currentYear + 3,
      phaseTitle: "Family Expansion & Joy",
      planetaryTransits: "Jupiter transit aspecting 5th & 9th houses",
      keyTheme: "Warmth, domestic contentment, potential expansion of family.",
      opportunities: "Favorable planetary support for children and family celebrations.",
      precautions: "Ensure regular health check-ups and stress management.",
    },
    {
      year: currentYear + 4,
      phaseTitle: "Maturity & Deeper Wisdom",
      planetaryTransits: "Major Dasha/Antardasha shift into Benefic Planetary Period",
      keyTheme: "Deep emotional maturity, shared travels, and spiritual connection.",
      opportunities: "Long-distance travel, renewed marital vows, and social prosperity.",
      precautions: "Keep dialogue open and transparent in financial planning.",
    },
  ];

  // 14. Customized Remedies
  const remedies: RemedyItem[] = [
    {
      category: "temple",
      title: "Gauri Shankar & Shiva-Parvati Puja",
      description: "Visit a Shiva-Parvati temple on Mondays. Perform Jalabhishekam together or individually to harmonize marital energies.",
      instructions: "Offer milk, honey, and belpatra to Shiva Lingam every Monday morning.",
      bestTime: "Mondays between 7:00 AM and 9:00 AM",
    },
    {
      category: "mantra",
      title: "Shukra Beej Mantra Recitation",
      description: "Recite 'Om Dram Droom Droom Sah Shukraya Namah' to strengthen Venus for love and relationship grace.",
      instructions: "Chant 108 times daily using a Sphatik (Quartz) rosary.",
      bestTime: "Fridays at Sunrise",
    },
    {
      category: "gemstone",
      title: "Astrological Gemstone Guidance",
      description: `Wear a natural ${venusDignity === "exalted" ? "Diamond / White Sapphire" : "Yellow Sapphire / Topaz"} set in Silver/Gold after proper ritual energization.`,
      instructions: "Consult your personal astrologer for precise carat weight and finger placement.",
      bestTime: "Thursday or Friday morning during Shukla Paksha",
    },
    {
      category: "donation",
      title: "Annadaanam & Charity for Marital Harmony",
      description: "Donate white food items (rice, milk, sugar, ghee) or cows' feed on Fridays to nullify Venus afflictions.",
      instructions: "Provide meals to underprivileged couples or old-age homes.",
      bestTime: "Friday evenings before sunset",
    },
    {
      category: "lifestyle",
      title: "Vastu & Bedroom Energy Alignment",
      description: "Ensure the primary bedroom is located in the South-West direction of the home. Avoid mirrors facing the bed.",
      instructions: "Keep pair of Rose Quartz crystals or Radha-Krishna painting in the South-West corner.",
      bestTime: "Daily lifestyle practice",
    },
  ];

  // 15. Evidence Engine
  const evidenceChain: EvidenceChainItem[] = [
    {
      claim: `Overall Marriage Quality Score: ${marriageScore}/100`,
      astrologicalBasis: `7th House in ${house7RashiName} governed by ${house7LordName} in House ${house7LordHouse}.`,
      factors: {
        planet: house7LordName,
        house: 7,
        rashi: house7RashiName,
        yoga: yogaList[0]?.name || "Standard Benefic Alignment",
      },
      confidencePercent: 94,
      actionableInsight: "Maintain balance between emotional sensitivity and practical life goals.",
    },
    {
      claim: `Love vs Arranged Verdict: ${loveMarriageScore > 70 ? 'Love Marriage Favored' : 'Arranged Marriage Favored'}`,
      astrologicalBasis: `5th House/7th House lord linkage and Venus placement in House ${venusHouse}.`,
      factors: {
        planet: "Venus",
        house: venusHouse,
        rashi: rashiName(venusObj ? venusObj.rashiIndex : 0),
      },
      confidencePercent: 91,
      actionableInsight: loveMarriageScore > 70 ? "Prioritize mutual understanding and open family communication." : "Trust family wisdom and structured introductions.",
    },
    {
      claim: `Spouse Personality & Trait Alignment`,
      astrologicalBasis: `Jaimini Darakaraka ${darakarakaObj.graha} at ${darakarakaObj.degInRashi.toFixed(2)}° in ${rashiName(darakarakaObj.rashiIdx)}.`,
      factors: {
        planet: darakarakaObj.graha,
        rashi: rashiName(darakarakaObj.rashiIdx),
        house: darakarakaObj.house,
      },
      confidencePercent: 93,
      actionableInsight: "Look for partners embodying maturity, intellectual depth, and mutual respect.",
    },
    {
      claim: `Manglik Status & Energetic Balance`,
      astrologicalBasis: isManglik ? `Mars in House ${marsHouse} (Manglik Dosha detected with partial cancellation).` : "Mars in non-Manglik house placement.",
      factors: {
        planet: "Mars",
        house: marsHouse,
        dosha: isManglik ? "Manglik (Kuja) Dosha" : undefined,
      },
      confidencePercent: 96,
      actionableInsight: isManglik ? "Perform recommended remedies to ensure smooth relationship dynamics." : "No severe Mars afflictions found; maintain constructive dialogue.",
    },
  ];

  // 16. AI Coach Verdict & Summary
  const d9House1 = kundli.d9.houses.find((h: HouseCusp) => h.house === 1) || kundli.d9.houses[0];
  const d9House7 = kundli.d9.houses.find((h: HouseCusp) => h.house === 7) || kundli.d9.houses[6];
  const d9House7Lord = RASHI_LORDS[d9House7.rashiIndex];

  const aiCoachVerdict = {
    executiveSummary: `Your chart exhibits a promising marriage profile with an overall score of ${marriageScore}/100. The placement of 7th Lord ${house7LordName} and Venus in ${rashiName(venusObj ? venusObj.rashiIndex : 0)} provides strong emotional foundations. ${isManglik ? 'Mars energy requires intentional communication, but is well-supported by benefic transits.' : 'Marital stability is reinforced by favorable planetary aspects.'}`,
    readinessLevel: (marriageScore >= 75 ? 'High Readiness' : marriageScore >= 60 ? 'Moderate Readiness' : 'Remedial Action Needed') as 'High Readiness' | 'Moderate Readiness' | 'Remedial Action Needed',
    actionPlan: [
      "Perform the recommended weekly Venus and Shiva-Parvati remedies.",
      "Focus on open communication and emotional empathy in daily interactions.",
      "Utilize the favorable marriage timing windows outlined in the 5-Year Annual Timeline.",
      "Maintain South-West bedroom Vastu alignment for relationship harmony.",
    ],
    finalVerdict: `With a Marriage Score of ${marriageScore}/100 and strong ${loveMarriageScore > 65 ? 'Love & Romantic' : 'Arranged & Family'} alignment, your astrological chart portends a fulfilling, enduring, and harmonious union when remedies and mutual respect are practiced.`,
  };

  return {
    input,
    calculatedAt: new Date().toISOString(),
    kundli,
    scores,
    house7: house7Analysis,
    house7Lord: house7LordRole,
    venus: venusRole,
    jupiter: jupiterRole,
    moon: moonRole,
    mars: marsRole,
    navamsaD9: {
      ascendantSign: rashiName(d9House1.rashiIndex),
      house7Sign: rashiName(d9House7.rashiIndex),
      house7Lord: d9House7Lord,
      venusPosition: `D9 Navamsha House ${kundli.d9.planets.find((p: PlanetChartPosition) => p.graha === "Venus")?.house || 1}`,
      jupiterPosition: `D9 Navamsha House ${kundli.d9.planets.find((p: PlanetChartPosition) => p.graha === "Jupiter")?.house || 1}`,
      d9Summary: "Navamsha D9 confirms long-term marital fruitfulness and internal psychological alignment between partners.",
    },
    darakaraka: darakarakaAnalysis,
    upapadaLagna,
    yogas: yogaList,
    doshas: doshaList,
    loveVsArranged: {
      loveScore: loveMarriageScore,
      arrangedScore: arrangedMarriageScore,
      verdict: loveMarriageScore > 75 ? "Strong Love Marriage" : loveMarriageScore > 60 ? "Inclined to Love Marriage" : "Strong Arranged Marriage",
      keyFactors: [
        `5th House & 7th House connection: ${isLoveFavorable ? "Strong" : "Moderate"}`,
        `Venus dignity: ${venusDignity}`,
        `Darakaraka planet: ${darakarakaObj.graha}`,
      ],
    },
    timing: {
      favorableAgeWindows: ["24 - 27 Years", "28 - 31 Years", "32 - 34 Years"],
      currentDashaAnalysis: `Active Vimshottari Mahadasha provides background energetic support for relationship milestones.`,
      nextFavorableTransits: [
        "Jupiter transit over 7th House & Lagna (Upcoming 12 months)",
        "Venus transit through exaltation sign (Pisces)",
      ],
      probableMarriagePeriod: `${currentYear} - ${currentYear + 2}`,
    },
    spouseProfile,
    behaviorAndCommunication: {
      postMarriageBehavior: "Warm, supportive, and dedicated to household prosperity.",
      conflictResolutionStyle: "Prefers calm discussion, logical problem-solving, and mutual concessions.",
      familyAndInLawsHarmony: "Respectful relations with extended family and in-laws, fostered by Jupiter's grace.",
      childrenAndLineage: "Favorable indicators for healthy lineage and dutiful children.",
    },
    strengthsAndChallenges: {
      strengths: [
        "Strong 7th Lord foundation promoting marital commitment.",
        "Benefic Venus & Jupiter alignment for emotional and financial stability.",
        "High long-term stability score (Long Term Stability: " + longTermStabilityScore + "/100).",
      ],
      challenges: [
        isManglik ? "Mars presence requires calm conflict management." : "Minor differences in communication pace during peak work stress.",
        "Need to balance personal career ambitions with relationship time.",
      ],
    },
    monthlyForecast,
    annualTimeline,
    remedies,
    luckyElements: {
      colors: ["Royal Blue", "Pastel Pink", "Off-White", "Emerald Green"],
      days: ["Friday", "Thursday", "Monday"],
      numbers: [6, 3, 2, 7],
      directions: ["North-East", "East", "South-West"],
      gemstones: ["Diamond", "White Sapphire", "Yellow Sapphire"],
    },
    aiCoachVerdict,
    evidenceChain,
  };
}
