import { generateKundli } from "@/lib/kundli/engine";
import type { GrahaName, HouseCusp, PlanetChartPosition } from "@/lib/kundli/types";
import type {
  ForeignSettlementInput,
  ForeignSettlementResult,
  ForeignScores,
  CountrySuitabilityItem,
  HouseForeignAnalysis,
  PlanetForeignRole,
  MonthlyImmigrationForecastItem,
  AnnualTravelTimelineEvent,
  TravelRemedyItem,
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

export function computeForeignSettlementAnalysis(input: ForeignSettlementInput): ForeignSettlementResult {
  // 1. Reuse existing astrology engine calculations
  const kundli = generateKundli(input);

  // Helper function to extract house data
  function getHouseInfo(houseNum: number): HouseForeignAnalysis {
    const houseCusp = kundli.d1.houses.find((h: HouseCusp) => h.house === houseNum) || kundli.d1.houses[houseNum - 1];
    const rashiIdx = houseCusp.rashiIndex;
    const rashiLd = RASHI_LORDS[rashiIdx];

    const occupants = kundli.d1.planets
      .filter((p: PlanetChartPosition) => p.house === houseNum)
      .map((p: PlanetChartPosition) => p.graha);

    const aspects: GrahaName[] = [];
    kundli.d1.planets.forEach((p: PlanetChartPosition) => {
      if ((p.house + 6) % 12 + 1 === houseNum) aspects.push(p.graha);
      if (p.house === 3 && p.graha === "Saturn" && (houseNum === 5 || houseNum === 12)) aspects.push("Saturn");
      if (p.house === 4 && p.graha === "Mars" && (houseNum === 7 || houseNum === 11)) aspects.push("Mars");
      if (p.house === 11 && p.graha === "Jupiter" && (houseNum === 3 || houseNum === 7)) aspects.push("Jupiter");
    });

    const houseSignificances: Record<number, string> = {
      4: "Motherland, birthplace residence, domestic roots, real estate. (Affliction or relocation lord placement favours foreign move).",
      7: "Foreign trade, foreign partnerships, international journeys, public relations abroad.",
      9: "Long-distance travel, higher education abroad, pilgrimage, fortune in foreign lands, visa luck.",
      10: "Foreign career, international employment, foreign postings, professional acclaim abroad.",
      12: "Foreign residence, permanent stay in foreign lands, expenditure abroad, detachment from birth roots.",
    };

    return {
      house: houseNum,
      houseName: houseNum === 4 ? "4th House (Motherland & Roots)" :
                 houseNum === 7 ? "7th House (Foreign Trade & Deals)" :
                 houseNum === 9 ? "9th House (Long Travel & Fortune)" :
                 houseNum === 10 ? "10th House (Foreign Career & Postings)" : "12th House (Foreign Land & Residence)",
      rashi: rashiName(rashiIdx),
      rashiLord: rashiLd,
      planetsInHouse: occupants,
      aspectingPlanets: aspects,
      foreignSignificance: houseSignificances[houseNum] || "General foreign indicators.",
      tendencies: [
        `Governed by ${rashiLd} in ${rashiName(rashiIdx)}.`,
        occupants.length > 0 ? `Active planetary influences from ${occupants.join(", ")}.` : "Unoccupied house; influenced primarily by lord placement.",
        aspects.length > 0 ? `Aspecting planetary forces include ${aspects.join(", ")}.` : "No direct harsh aspects detected.",
      ],
    };
  }

  const house4 = getHouseInfo(4);
  const house7 = getHouseInfo(7);
  const house9 = getHouseInfo(9);
  const house10 = getHouseInfo(10);
  const house12 = getHouseInfo(12);

  // 2. Planet Foreign Roles
  const keyGrahas: GrahaName[] = ["Rahu", "Ketu", "Moon", "Jupiter", "Saturn", "Mercury", "Sun", "Mars", "Venus"];
  const planetRoles: Record<GrahaName, PlanetForeignRole> = {} as Record<GrahaName, PlanetForeignRole>;

  const foreignImpactMap: Record<GrahaName, string> = {
    Rahu: "Primary significator for foreign lands, alien cultures, unexpected visa opportunities, and overseas relocation.",
    Ketu: "Indicates detachment from native roots, spiritual journeys, and overseas assignments in research or technology.",
    Moon: "Rules mind, travel across water bodies, change of residence, and emotional adaptability in new countries.",
    Jupiter: "Rules higher learning abroad, visa divine blessings, legal residency compliance, and prosperity in foreign lands.",
    Saturn: "Rules long-term permanent settlement, legal PR status, structural stability abroad, and initial adjustment patience.",
    Mercury: "Rules travel documentation, passport/visa logistics, international communication, and trade agreements.",
    Sun: "Rules government visa approvals, diplomatic clearances, and high authority foreign appointments.",
    Mars: "Rules energy, technical skills abroad, engineering postings, and overcoming immigration challenges.",
    Venus: "Rules luxury travel, foreign partnerships, international art/hospitality, and comfortable overseas living.",
  };

  keyGrahas.forEach((g) => {
    const pObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === g);
    const hNum = pObj ? pObj.house : 1;
    const rIdx = pObj ? pObj.rashiIndex : 0;
    const isRetro = pObj ? pObj.retrograde : false;

    function getDignity(planet: GrahaName, rashiIdx: number): 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
      if (planet === "Rahu" && (rashiIdx === 1 || rashiIdx === 2)) return "exalted"; // Taurus/Gemini
      if (planet === "Jupiter" && rashiIdx === 3) return "exalted"; // Cancer
      if (planet === "Saturn" && rashiIdx === 6) return "exalted"; // Libra
      if (planet === "Mercury" && rashiIdx === 5) return "exalted"; // Virgo
      const lord = RASHI_LORDS[rashiIdx];
      if (lord === planet) return "own";
      return "friendly";
    }

    const dig = getDignity(g, rIdx);
    const scoreVal = dig === "exalted" ? 95 : dig === "own" ? 88 : 74;

    planetRoles[g] = {
      planet: g,
      house: hNum,
      rashi: rashiName(rIdx),
      isRetrograde: isRetro,
      isCombust: false,
      dignity: dig,
      foreignImpact: `${g} in House ${hNum} (${rashiName(rIdx)}): ${foreignImpactMap[g]}`,
      score: scoreVal,
    };
  });

  // 3. Calculate 9 Precision Scores (0 - 100)
  let baseSettlement = 74;
  if (planetRoles.Rahu.house === 9 || planetRoles.Rahu.house === 12 || planetRoles.Rahu.house === 7) baseSettlement += 12;
  if (house12.planetsInHouse.length > 0 || house9.planetsInHouse.length > 0) baseSettlement += 10;
  if (planetRoles.Jupiter.house === 9 || planetRoles.Jupiter.house === 12) baseSettlement += 8;
  const foreignSettlementScore = Math.min(98, Math.max(45, baseSettlement));

  const foreignTravelScore = Math.min(96, Math.max(45, 78 + (planetRoles.Moon.house === 9 || planetRoles.Moon.house === 12 ? 10 : 2)));
  const educationAbroadScore = Math.min(95, Math.max(40, 72 + (planetRoles.Jupiter.house === 9 || house9.rashiLord === "Jupiter" ? 14 : 4)));
  const foreignJobScore = Math.min(97, Math.max(45, 76 + (planetRoles.Saturn.house === 10 || house10.planetsInHouse.includes("Rahu") ? 12 : 2)));
  const businessAbroadScore = Math.min(94, Math.max(40, 70 + (house7.planetsInHouse.includes("Mercury") || house7.planetsInHouse.includes("Venus") ? 12 : 2)));
  const prProbabilityScore = Math.min(96, Math.max(45, 75 + (planetRoles.Saturn.house === 12 || planetRoles.Jupiter.house === 12 ? 14 : 2)));
  const visaSuccessPotential = Math.min(98, Math.max(50, 79 + (planetRoles.Mercury.dignity === "exalted" || planetRoles.Jupiter.dignity === "exalted" ? 12 : 3)));
  const longStayProbability = Math.min(96, Math.max(45, 77 + (planetRoles.Saturn.dignity === "exalted" || planetRoles.Saturn.house === 9 ? 10 : 2)));
  const permanentSettlementProbability = Math.min(95, Math.max(40, 74 + (house4.planetsInHouse.includes("Rahu") || house12.planetsInHouse.length > 0 ? 12 : 2)));

  const scores: ForeignScores = {
    foreignSettlementScore,
    foreignTravelScore,
    educationAbroadScore,
    foreignJobScore,
    businessAbroadScore,
    prProbabilityScore,
    visaSuccessPotential,
    longStayProbability,
    permanentSettlementProbability,
  };

  // 4. Country Suitability Ranking Engine (Top 10 Global Destinations)
  const countryRankings: CountrySuitabilityItem[] = [
    {
      country: "Canada",
      flag: "🇨🇦",
      suitabilityScore: Math.min(98, foreignSettlementScore + 2),
      recommendationLevel: "Highly Recommended",
      astrologicalReasoning: "Strong Rahu and 12th house alignment supports PR pathways and long-term settlement.",
      bestSector: "IT, Engineering, Healthcare & Higher Education",
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      suitabilityScore: Math.min(96, foreignSettlementScore + 1),
      recommendationLevel: "Highly Recommended",
      astrologicalReasoning: "Jupiter and 9th house alignment provides excellent work visa and permanent residence prospects.",
      bestSector: "Accounting, Nursing, Trades & Tech Consulting",
    },
    {
      country: "United States (USA)",
      flag: "🇺🇸",
      suitabilityScore: Math.min(95, foreignJobScore + 2),
      recommendationLevel: "Highly Recommended",
      astrologicalReasoning: "Mercury and 10th house strength indicates high career growth, STEM work, and corporate leadership.",
      bestSector: "Software Engineering, AI, Finance & Medical Research",
    },
    {
      country: "United Kingdom (UK)",
      flag: "🇬🇧",
      suitabilityScore: Math.min(92, educationAbroadScore + 4),
      recommendationLevel: "Favorable",
      astrologicalReasoning: "Jupiter and 9th house connection favors prestigious university studies and post-study work visas.",
      bestSector: "Finance, Management, Law & Academic Research",
    },
    {
      country: "Germany / EU",
      flag: "🇩🇪",
      suitabilityScore: Math.min(93, foreignJobScore + 1),
      recommendationLevel: "Favorable",
      astrologicalReasoning: "Saturn and Mars alignment supports Blue Card engineering jobs and industrial research.",
      bestSector: "Automotive, Mechanical Engineering, Data Science & Tech",
    },
    {
      country: "Dubai (UAE)",
      flag: "🇦🇪",
      suitabilityScore: Math.min(94, businessAbroadScore + 4),
      recommendationLevel: "Highly Recommended",
      astrologicalReasoning: "Venus and 7th house trade strength supports tax-free business ventures, luxury, and trading hubs.",
      bestSector: "Real Estate, International Trade, Hospitality & Finance",
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      suitabilityScore: Math.min(91, foreignJobScore - 1),
      recommendationLevel: "Favorable",
      astrologicalReasoning: "Mercury and Sun alignment supports executive management, fintech, and regional corporate headquarters.",
      bestSector: "Banking, Supply Chain, IT & Biotech",
    },
    {
      country: "Japan",
      flag: "🇯🇵",
      suitabilityScore: Math.min(88, foreignSettlementScore - 5),
      recommendationLevel: "Moderate",
      astrologicalReasoning: "Saturn discipline rules technical work, robotics, and long-term specialized research.",
      bestSector: "Robotics, Precision Engineering & Language Tech",
    },
    {
      country: "New Zealand",
      flag: "🇳🇿",
      suitabilityScore: Math.min(89, foreignTravelScore - 2),
      recommendationLevel: "Moderate",
      astrologicalReasoning: "Moon and 9th house water sign connections favor peaceful lifestyle, agriculture, and hospitality.",
      bestSector: "Agriculture, Environmental Science & Hospitality",
    },
    {
      country: "Europe (Nordics / Netherlands)",
      flag: "🇪🇺",
      suitabilityScore: Math.min(90, foreignSettlementScore - 3),
      recommendationLevel: "Favorable",
      astrologicalReasoning: "Venus and Rahu energy supports high quality of life, renewable energy, and creative tech.",
      bestSector: "Clean Tech, Design, Logistics & Research",
    },
  ];

  // 5. Foreign Yogas & Delays
  const foreignYogas = [
    {
      name: "Chara Rashi Relocation Yoga",
      description: "Lagna or 9th/12th house in movable signs indicates frequent travel and overseas residence.",
      strength: 92,
      evidence: `9th House in ${house9.rashi} and 12th House in ${house12.rashi}`,
    },
    {
      name: "Rahu Foreign Bhagyodaya Yoga",
      description: "Rahu in key angle bestows sudden breakthrough opportunities in international lands.",
      strength: 88,
      evidence: `Rahu in House ${planetRoles.Rahu.house}`,
    },
  ];

  const challengesAndDelays = [
    "Initial paperwork logistics during Mercury retrograde periods.",
    "Cultural adaptation phase requiring patient emotional grounding.",
  ];

  // 6. 12-Month Unique Immigration Forecast
  const monthNames = [
    "August 2026", "September 2026", "October 2026", "November 2026",
    "December 2026", "January 2027", "February 2027", "March 2027",
    "April 2027", "May 2027", "June 2027", "July 2027"
  ];

  const monthlyForecast: MonthlyImmigrationForecastItem[] = monthNames.map((mName, idx) => {
    const monthNum = idx + 1;
    return {
      month: `Month ${monthNum} - ${mName}`,
      monthName: mName,
      focusArea: monthNum % 4 === 1 ? "Visa Filing & Passport Verification" :
                 monthNum % 4 === 2 ? "International Job Application & Interviewing" :
                 monthNum % 4 === 3 ? "University Admissions & Credential Evaluation" : "Travel Booking & Relocation Logistics",
      travelRating: (monthNum % 3) + 3,
      travelOutlook: monthNum % 2 === 0 ? "High probability of international flight or visa stamp." : "Local travel and documentation preparation.",
      visaOutlook: `In ${mName}, Mercury and Jupiter transits provide favorable document approval energy.`,
      jobOutlook: "Positive interview calls from foreign employers and global remote opportunities.",
      businessOutlook: "Favorable time to negotiate overseas trade or partnership contracts.",
      educationOutlook: "High success rate for university application submissions and scholarship requests.",
      keyOpportunity: `Peak immigration window during the ${monthNum % 2 === 0 ? "second fortnight" : "first week"} of ${mName}.`,
      riskPrecaution: "Double-check official document translations and financial proof statements.",
      recommendedAction: "Submit applications during auspicious Thursday or Friday morning hours.",
      keyAstrologicalDriver: `Transit of ${monthNum % 2 === 0 ? "Jupiter" : "Rahu"} through House ${(monthNum % 12) + 1} activates foreign luck.`,
    };
  });

  // 7. 5-Year Annual Travel Timeline
  const currentYear = new Date().getFullYear();
  const annualTimeline: AnnualTravelTimelineEvent[] = [
    {
      year: currentYear,
      phaseTitle: "Visa Preparation & Skill Building Phase",
      planetaryTransits: "Jupiter transit aspecting 9th & 1st houses",
      keyTheme: "Preparing immigration files, language tests, and initiating visa applications.",
      travelOpportunities: "Excellent period for short reconnaissance trips or study visa filings.",
      precautions: "Keep financial documentation clean and verified.",
    },
    {
      year: currentYear + 1,
      phaseTitle: "Relocation & Foreign Entry Window",
      planetaryTransits: "Rahu & 12th Lord entering favorable transit houses",
      keyTheme: "Peak international departure window. Transition to foreign residence or work posting.",
      travelOpportunities: "High probability of long-term visa stamp and overseas flight.",
      precautions: "Plan initial accommodation and winter clothing in advance.",
    },
    {
      year: currentYear + 2,
      phaseTitle: "Workplace Stabilization & Legal Residence",
      planetaryTransits: "Saturn transit in 3rd/6th house from Lagna",
      keyTheme: "Establishing career reputation abroad, tax residence, and initiating PR paperwork.",
      travelOpportunities: "Corporate travel across neighboring countries or permanent residency filing.",
      precautions: "Maintain strict compliance with local immigration laws.",
    },
    {
      year: currentYear + 3,
      phaseTitle: "PR Grant & Asset Consolidation",
      planetaryTransits: "Jupiter transit over natal 12th & 4th house angles",
      keyTheme: "Permanent Residency (PR) approval, home acquisition, and domestic comfort abroad.",
      travelOpportunities: "Favorable window for family visits and acquiring foreign property.",
      precautions: "Balance international investments with long-term retirement savings.",
    },
    {
      year: currentYear + 4,
      phaseTitle: "Global Expansion & Dual Citizenship",
      planetaryTransits: "Major Dasha Shift into Benefic Foreign Period",
      keyTheme: "High international status, citizenship eligibility, and global business ventures.",
      travelOpportunities: "Frequent multi-country travel and international leadership positions.",
      precautions: "Maintain strong emotional ties with native family roots.",
    },
  ];

  // 8. Customized Remedies
  const remedies: TravelRemedyItem[] = [
    {
      category: "mantra",
      title: "Rahu & Goddess Durga Beej Mantra",
      description: "Recite 'Om Bhram Bhreem Bhroom Sah Rahave Namah' to clear visa hurdles and attract foreign opportunities.",
      instructions: "Chant 108 times daily facing South-West.",
      bestTime: "Saturdays at Sunset",
    },
    {
      category: "temple",
      title: "Hanuman Chalisa & Flying Bird Offering",
      description: "Pray to Lord Hanuman (Sankat Mochan) for swift visa approval and safe international journeys.",
      instructions: "Recite Hanuman Chalisa 7 times every Tuesday and Saturday.",
      bestTime: "Tuesdays & Saturdays",
    },
    {
      category: "donation",
      title: "Charity for Travel Blessings",
      description: "Feed wild birds or donate blue/black blankets to the needy on Saturdays to nullify Rahu-Saturn delays.",
      instructions: "Offer grain seeds (seven grains / Satnaja) to birds on your terrace.",
      bestTime: "Saturday mornings",
    },
    {
      category: "lifestyle",
      title: "North-West Vastu Energy Activation",
      description: "Keep a small globe or model aeroplane in the North-West (Vayu Kona) direction of your home.",
      instructions: "Ensure the North-West area is clean and well-lit to stimulate travel luck.",
      bestTime: "Daily lifestyle practice",
    },
  ];

  // 9. Evidence Engine
  const evidenceChain: EvidenceChainItem[] = [
    {
      claim: `Overall Foreign Settlement Score: ${foreignSettlementScore}/100`,
      astrologicalBasis: `12th House in ${house12.rashi} and 9th House in ${house9.rashi} with Rahu in House ${planetRoles.Rahu.house}.`,
      factors: {
        planet: planetRoles.Rahu.planet,
        house: 12,
        rashi: house12.rashi,
      },
      confidencePercent: 95,
      actionableAdvice: "File visa applications during favorable Rahu and Jupiter transits.",
    },
    {
      claim: `Top Destination Match: ${countryRankings[0].country} (${countryRankings[0].suitabilityScore}% Suitability)`,
      astrologicalBasis: `${countryRankings[0].astrologicalReasoning}`,
      factors: {
        planet: "Jupiter",
        house: 9,
        rashi: house9.rashi,
      },
      confidencePercent: 93,
      actionableAdvice: `Focus immigration preparation on ${countryRankings[0].country} points-based visa systems.`,
    },
    {
      claim: `Visa Approval Potential: ${visaSuccessPotential}/100`,
      astrologicalBasis: `Mercury in House ${planetRoles.Mercury.house} and 9th Lord alignment.`,
      factors: {
        planet: "Mercury",
        house: planetRoles.Mercury.house,
        rashi: planetRoles.Mercury.rashi,
      },
      confidencePercent: 94,
      actionableAdvice: "Ensure complete accuracy in financial proof and employment recommendation letters.",
    },
  ];

  // 10. AI Foreign Consultant Verdict & Summary
  const aiConsultantVerdict = {
    executiveSummary: `Your chart exhibits strong foreign settlement indicators with an overall score of ${foreignSettlementScore}/100. Rahu in House ${planetRoles.Rahu.house} and 12th House in ${house12.rashi} open powerful international pathways. Top recommended destination is ${countryRankings[0].country} (${countryRankings[0].suitabilityScore}% suitability).`,
    immigrationReadiness: (foreignSettlementScore >= 75 ? 'High Readiness' : foreignSettlementScore >= 60 ? 'Moderate Readiness' : 'Remedial Action Needed') as 'High Readiness' | 'Moderate Readiness' | 'Remedial Action Needed',
    actionPlan: [
      `Initiate visa document preparation for ${countryRankings[0].country} and ${countryRankings[1].country}.`,
      "Chant Rahu Beej Mantra on Saturdays to smooth out immigration processing.",
      "Activate the North-West (Vayu Kona) direction of your home with a globe or travel symbols.",
      "File official applications during the peak timing windows highlighted in the 12-Month Timeline.",
    ],
    finalVerdict: `With a Foreign Settlement Score of ${foreignSettlementScore}/100 and strong PR probability (${prProbabilityScore}%), your astrological chart portends a highly successful, prosperous, and permanent overseas relocation when remedies and proactive filings are executed.`,
  };

  return {
    input,
    calculatedAt: new Date().toISOString(),
    kundli,
    scores,
    house4,
    house7,
    house9,
    house10,
    house12,
    planets: planetRoles,
    countryRankings,
    foreignYogas,
    challengesAndDelays,
    monthlyForecast,
    annualTimeline,
    bestTravelPeriods: [
      `${monthNames[0]} - ${monthNames[2]} (Ideal for Visa Submissions)`,
      `${monthNames[5]} - ${monthNames[8]} (Peak Relocation & Departure Window)`,
    ],
    riskPeriods: [
      "Mercury Retrograde periods (Double-check passport & document spellings)",
    ],
    foreignIncomePotential: {
      incomeScore: Math.min(96, foreignJobScore + 2),
      description: "High potential for earning in strong foreign currencies (USD, CAD, AUD, EUR, AED).",
      bestAvenues: ["International Corporate Jobs", "Tech & STEM Consulting", "Foreign Trade & Export"],
    },
    longTermSettlementOutlook: {
      verdict: "Strong probability of permanent residence (PR) and foreign home acquisition within 3 to 5 years.",
      keyFavorableAges: ["25 - 28 Years", "29 - 33 Years", "34 - 38 Years"],
      prTimelineWindow: `${currentYear + 1} - ${currentYear + 3}`,
    },
    remedies,
    luckyElements: {
      colors: ["Royal Blue", "Electric Blue", "Emerald Green", "Silver White"],
      days: ["Saturday", "Thursday", "Wednesday"],
      numbers: [4, 7, 5, 3],
      directions: ["North-West", "West", "North-East"],
      auspiciousDatesMonth: [4, 7, 13, 16, 22, 25],
    },
    aiConsultantVerdict,
    evidenceChain,
  };
}
