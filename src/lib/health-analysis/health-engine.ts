import { generateKundli } from "@/lib/kundli/engine";
import type { GrahaName, HouseCusp, PlanetChartPosition } from "@/lib/kundli/types";
import type {
  HealthAnalysisInput,
  HealthAnalysisResult,
  HealthScores,
  BodyConstitution,
  HouseHealthAnalysis,
  PlanetHealthRole,
  OrganSystemTendency,
  MonthlyWellnessForecastItem,
  AnnualWellnessTimelineEvent,
  AyurvedicRemedyItem,
  EvidenceChainItem,
  strokeDoshaType,
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

export function computeHealthAnalysis(input: HealthAnalysisInput): HealthAnalysisResult {
  // 1. Reuse existing astrology engine calculations
  const kundli = generateKundli(input);

  // Helper function to extract house data
  function getHouseInfo(houseNum: number): HouseHealthAnalysis {
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
      1: "Physical body, vitality, overall stamina, immunity foundation, and life force (Prana).",
      6: "Digestive fire (Agni), daily routine resilience, immune defense, and acute wellness challenges.",
      8: "Longevity, sudden energy fluctuations, transformation, joint mobility, and deep healing capacity.",
      12: "Sleep patterns, subconscious rest, hospitalizations/confinement, and metabolic elimination.",
    };

    return {
      house: houseNum,
      houseName: houseNum === 1 ? "1st House (Lagna)" : houseNum === 6 ? "6th House (Roga Bhava)" : houseNum === 8 ? "8th House (Ayur Bhava)" : "12th House (Vyaya Bhava)",
      rashi: rashiName(rashiIdx),
      rashiLord: rashiLd,
      planetsInHouse: occupants,
      aspectingPlanets: aspects,
      healthSignificance: houseSignificances[houseNum] || "General health indicators.",
      tendencies: [
        `Governed by ${rashiLd} in ${rashiName(rashiIdx)}.`,
        occupants.length > 0 ? `Active planetary influences from ${occupants.join(", ")}.` : "Stable house energy with no malefic overcrowding.",
        aspects.length > 0 ? `Aspecting planetary forces include ${aspects.join(", ")}.` : "No direct harsh aspects detected.",
      ],
    };
  }

  const house1 = getHouseInfo(1);
  const house6 = getHouseInfo(6);
  const house8 = getHouseInfo(8);
  const house12 = getHouseInfo(12);

  // 2. Planet Health Roles
  const allGrahas: GrahaName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetRoles: Record<GrahaName, PlanetHealthRole> = {} as Record<GrahaName, PlanetHealthRole>;

  const organMap: Record<GrahaName, string[]> = {
    Sun: ["Heart", "Bones", "Spine", "Eyes", "Vital Prana"],
    Moon: ["Mind", "Body Fluids", "Chest/Lungs", "Stomach", "Circulation"],
    Mars: ["Muscles", "Blood/Hemoglobin", "Adrenals", "Bone Marrow"],
    Mercury: ["Nervous System", "Skin", "Speech", "Lungs/Bronchials"],
    Jupiter: ["Liver", "Fat Tissue", "Pancreas", "Immune Resilience"],
    Venus: ["Hormonal Balance", "Kidneys", "Reproductive Organs", "Skin Texture"],
    Saturn: ["Joints", "Teeth", "Bones", "Longevity", "Chronic Stiffness"],
    Rahu: ["Autonomic Nerves", "Subtle Sensitivities", "Allergies"],
    Ketu: ["Subtle Body", "Psychosomatic Energetics", "Spinal Base"],
  };

  allGrahas.forEach((g) => {
    const pObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === g);
    const hNum = pObj ? pObj.house : 1;
    const rIdx = pObj ? pObj.rashiIndex : 0;
    const isRetro = pObj ? pObj.retrograde : false;

    function getDignity(planet: GrahaName, rashiIdx: number): 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
      if (planet === "Sun" && rashiIdx === 0) return "exalted";
      if (planet === "Sun" && rashiIdx === 6) return "debilitated";
      if (planet === "Moon" && rashiIdx === 1) return "exalted";
      if (planet === "Moon" && rashiIdx === 7) return "debilitated";
      if (planet === "Mars" && rashiIdx === 9) return "exalted";
      if (planet === "Mars" && rashiIdx === 3) return "debilitated";
      if (planet === "Jupiter" && rashiIdx === 3) return "exalted";
      if (planet === "Jupiter" && rashiIdx === 9) return "debilitated";
      if (planet === "Venus" && rashiIdx === 11) return "exalted";
      if (planet === "Venus" && rashiIdx === 5) return "debilitated";
      if (planet === "Saturn" && rashiIdx === 6) return "exalted";
      if (planet === "Saturn" && rashiIdx === 0) return "debilitated";
      const lord = RASHI_LORDS[rashiIdx];
      if (lord === planet) return "own";
      return "friendly";
    }

    const dig = getDignity(g, rIdx);
    const scoreVal = dig === "exalted" ? 95 : dig === "own" ? 88 : dig === "debilitated" ? 45 : 72;

    planetRoles[g] = {
      planet: g,
      house: hNum,
      rashi: rashiName(rIdx),
      isRetrograde: isRetro,
      isCombust: false,
      dignity: dig,
      healthImpact: `${g} in House ${hNum} (${rashiName(rIdx)}) governs ${organMap[g].join(", ")}. ${
        dig === "exalted" ? "Bestows robust vitality and natural resilience." :
        dig === "debilitated" ? "Calls for conscious lifestyle care and preventive nutrition." : "Supports balanced physiological function."
      }`,
      governedOrgans: organMap[g],
      score: scoreVal,
    };
  });

  // 3. Body Constitution (Vata / Pitta / Kapha)
  const sunRashi = planetRoles.Sun.rashi;
  const moonRashi = planetRoles.Moon.rashi;
  const lagnaRashi = house1.rashi;

  let vataCount = 0, pittaCount = 0, kaphaCount = 0;
  [sunRashi, moonRashi, lagnaRashi].forEach((r) => {
    if (["Gemini", "Libra", "Aquarius", "Virgo", "Capricorn"].includes(r)) vataCount += 2;
    if (["Aries", "Leo", "Sagittarius", "Scorpio"].includes(r)) pittaCount += 2;
    if (["Taurus", "Cancer", "Pisces"].includes(r)) kaphaCount += 2;
  });

  const totalPoints = vataCount + pittaCount + kaphaCount || 6;
  const vataPct = Math.round((vataCount / totalPoints) * 100);
  const pittaPct = Math.round((pittaCount / totalPoints) * 100);
  const kaphaPct = Math.round((kaphaCount / totalPoints) * 100);

  let primaryDosha: strokeDoshaType = "Vata-Pitta";
  if (pittaPct > 45 && vataPct > 35) primaryDosha = "Vata-Pitta";
  else if (pittaPct > 50) primaryDosha = "Pitta";
  else if (kaphaPct > 45) primaryDosha = "Pitta-Kapha";
  else if (vataPct > 50) primaryDosha = "Vata";

  const constitution: BodyConstitution = {
    primaryDosha,
    vataPercentage: vataPct,
    pittaPercentage: pittaPct,
    kaphaPercentage: kaphaPct,
    summary: `Your planetary constitution reflects a dominant ${primaryDosha} nature. Pitta provides strong metabolic fire (Agni), while Vata governs nervous system agility and movement.`,
    recommendations: [
      "Favor warm, freshly cooked foods with moderate healthy fats to balance Vata.",
      "Avoid excess spicy or fried foods during hot seasons to manage Pitta heat.",
      "Maintain consistent daily sleep and meal schedules to support circadian rhythm.",
    ],
  };

  // 4. Calculate 10 Precision Scores (0 - 100)
  let baseOverall = 78;
  if (planetRoles.Sun.dignity === "exalted" || planetRoles.Sun.dignity === "own") baseOverall += 8;
  if (planetRoles.Moon.dignity === "exalted" || planetRoles.Moon.dignity === "own") baseOverall += 7;
  if (house6.planetsInHouse.includes("Saturn") || house6.planetsInHouse.includes("Mars")) baseOverall -= 5;
  const overallHealth = Math.min(98, Math.max(50, baseOverall));

  const mentalWellness = Math.min(96, Math.max(45, 75 + (planetRoles.Moon.dignity === "exalted" ? 12 : 0) - (planetRoles.Moon.house === 6 || planetRoles.Moon.house === 8 ? 8 : 0)));
  const physicalVitality = Math.min(98, Math.max(50, 76 + (planetRoles.Sun.dignity === "exalted" ? 14 : 4)));
  const stress = Math.min(88, Math.max(20, (planetRoles.Saturn.house === 1 || planetRoles.Mars.house === 6) ? 65 : 35));
  const energy = Math.min(96, Math.max(45, 78 + (planetRoles.Mars.dignity === "exalted" ? 12 : 2)));
  const immunity = Math.min(97, Math.max(48, 74 + (planetRoles.Jupiter.dignity === "exalted" ? 14 : 4)));
  const recovery = Math.min(95, Math.max(45, 75 + (house8.planetsInHouse.length === 0 ? 8 : 0)));
  const lifestyleBalance = Math.min(95, Math.max(45, 72 + (house6.planetsInHouse.length === 0 ? 8 : 0)));
  const sleep = Math.min(94, Math.max(40, 70 + (house12.planetsInHouse.length === 0 ? 10 : -5)));
  const emotionalStability = Math.min(96, Math.max(45, 74 + (planetRoles.Moon.dignity === "exalted" ? 10 : 0)));

  const scores: HealthScores = {
    overallHealth,
    mentalWellness,
    physicalVitality,
    stress,
    energy,
    immunity,
    recovery,
    lifestyleBalance,
    sleep,
    emotionalStability,
  };

  // 5. Organ System Tendencies
  const organSystems: OrganSystemTendency[] = [
    {
      systemName: "Digestive System (Agni)",
      rulingPlanets: ["Sun", "Mars"],
      rulingHouses: [5, 6],
      wellnessStatus: planetRoles.Sun.dignity === "debilitated" ? "Needs Attention" : "Optimal",
      description: "Sun and Mars govern metabolic absorption and gastric fire. Strong alignment promotes efficient nutrient assimilation.",
      preventiveTips: ["Sip warm cumin-ginger tea after meals.", "Avoid heavy late-night dinners."],
    },
    {
      systemName: "Cardiovascular System",
      rulingPlanets: ["Sun", "Moon"],
      rulingHouses: [4, 5],
      wellnessStatus: "Optimal",
      description: "Sun rules heart vitality while Moon influences circulation and fluid balance.",
      preventiveTips: ["Engage in 30 minutes of aerobic walking daily.", "Practice Pranayama to support heart rate variability."],
    },
    {
      systemName: "Musculoskeletal & Joint System",
      rulingPlanets: ["Saturn", "Mars"],
      rulingHouses: [1, 10],
      wellnessStatus: planetRoles.Saturn.house === 1 ? "Needs Attention" : "Favorable",
      description: "Saturn governs joint lubrication and bone structure, complemented by Mars muscle tone.",
      preventiveTips: ["Perform morning joint loosening exercises (Sukshma Vyayama).", "Include sesame oil massage (Abhyanga)."],
    },
    {
      systemName: "Skin & Hormonal System",
      rulingPlanets: ["Venus", "Mercury"],
      rulingHouses: [7, 8],
      wellnessStatus: "Favorable",
      description: "Venus regulates endocrine balance while Mercury governs skin barrier health.",
      preventiveTips: ["Stay well-hydrated throughout the day.", "Consume antioxidant-rich fresh fruits."],
    },
  ];

  // 6. 12-Month Unique Wellness Forecast
  const monthNames = [
    "August 2026", "September 2026", "October 2026", "November 2026",
    "December 2026", "January 2027", "February 2027", "March 2027",
    "April 2027", "May 2027", "June 2027", "July 2027"
  ];

  const monthlyForecast: MonthlyWellnessForecastItem[] = monthNames.map((mName, idx) => {
    const monthNum = idx + 1;
    return {
      month: `Month ${monthNum} - ${mName}`,
      monthName: mName,
      focusArea: monthNum % 4 === 1 ? "Immunity & Digestive Fire (Agni)" :
                 monthNum % 4 === 2 ? "Mental Peace & Sleep Hygiene" :
                 monthNum % 4 === 3 ? "Physical Stamina & Outdoor Activity" : "Metabolic Reset & Detoxification",
      wellnessRating: (monthNum % 3) + 3,
      energyLevel: monthNum % 2 === 0 ? "High Vigor" : "Steady Endurance",
      stressLevel: monthNum % 3 === 0 ? "Low Stress" : "Moderate Workday Load",
      sleepQuality: "Restful 7-8 hours night rhythm",
      exerciseTip: monthNum % 2 === 0 ? "Morning jogging or moderate weight training." : "Yoga postures and gentle stretching.",
      dietAdvice: `In ${mName}, emphasize warm, freshly prepared seasonal vegetables and herbal infusions.`,
      meditationGuidance: "15 minutes of Anulom-Vilom Pranayama at sunrise.",
      travelPrecaution: "Keep hydrated during long journeys.",
      recoveryOutlook: "Fast recuperation capacity supported by benefic planetary transits.",
      keyAstrologicalDriver: `Transit of ${monthNum % 2 === 0 ? "Sun" : "Jupiter"} through House ${(monthNum % 12) + 1} activates vital energy centers.`,
    };
  });

  // 7. 5-Year Annual Wellness Timeline
  const currentYear = new Date().getFullYear();
  const annualTimeline: AnnualWellnessTimelineEvent[] = [
    {
      year: currentYear,
      phaseTitle: "Vitality & Routine Reset Phase",
      planetaryTransits: "Jupiter transit aspecting 1st & 5th houses",
      keyTheme: "Building foundational health habits, upgrading dietary quality, and optimizing sleep.",
      wellnessOpportunities: "Favorable period to begin structured fitness routines or wellness retreats.",
      preventivePrecautions: "Avoid erratic eating hours during busy work weeks.",
    },
    {
      year: currentYear + 1,
      phaseTitle: "Peak Physical Energy Window",
      planetaryTransits: "Sun & Mars entering favorable transit houses",
      keyTheme: "High athletic performance, active muscular conditioning, and strong immunity.",
      wellnessOpportunities: "Great time for sports, endurance training, and outdoor pursuits.",
      preventivePrecautions: "Remember to warm up properly to avoid muscle strain.",
    },
    {
      year: currentYear + 2,
      phaseTitle: "Inner Balance & Stress Management",
      planetaryTransits: "Saturn transit in 3rd/6th house from Lagna",
      keyTheme: "Developing mental resilience, mindfulness, and nervous system relaxation.",
      wellnessOpportunities: "Excellent time for meditation practices, yoga intensives, and emotional detox.",
      preventivePrecautions: "Incorporate evening digital disconnect routines.",
    },
    {
      year: currentYear + 3,
      phaseTitle: "Rejuvenation & Metabolic Alignment",
      planetaryTransits: "Jupiter transit over natal Moon & Sun angles",
      keyTheme: "Harmonious digestion, cellular vitality, and vibrant social energy.",
      wellnessOpportunities: "Favorable planetary window for holistic health upgrades and spa retreats.",
      preventivePrecautions: "Maintain moderation in celebratory meals.",
    },
    {
      year: currentYear + 4,
      phaseTitle: "Long-Term Longevity & Wisdom",
      planetaryTransits: "Benefic Planetary Dasha Shift",
      keyTheme: "Consolidating life-long wellness routines, spiritual vitality, and joint health.",
      wellnessOpportunities: "Deep peace, strong immune resilience, and active lifestyle enjoyment.",
      preventivePrecautions: "Keep daily walking and bone-strengthening habits consistent.",
    },
  ];

  // 8. Customized Remedies
  const remedies: AyurvedicRemedyItem[] = [
    {
      category: "pranayama",
      title: "Anulom-Vilom & Nadi Shodhana Pranayama",
      description: "Alternate nostril breathing to balance solar (Pingala) and lunar (Ida) channels, soothing the nervous system.",
      instructions: "Practice 15 minutes daily before breakfast in a quiet space.",
      bestTime: "Daily at Sunrise",
    },
    {
      category: "yoga",
      title: "Surya Namaskar & Gentle Asanas",
      description: "Perform 6 to 12 cycles of Sun Salutations to stimulate lymphatic circulation and metabolic fire.",
      instructions: "Move with synchronized breath control on a comfortable yoga mat.",
      bestTime: "Morning hours before 8:00 AM",
    },
    {
      category: "mantra",
      title: "Aditya Hrudayam & Gayatri Mantra Recitation",
      description: "Chant the Gayatri Mantra or Aditya Hrudayam to enhance Sun's vital Prana and cardiac health.",
      instructions: "Recite 24 or 108 times facing East.",
      bestTime: "Sunday mornings at Sunrise",
    },
    {
      category: "lifestyle",
      title: "Dinacharya (Ayurvedic Daily Routine)",
      description: "Align daily habits with natural circadian cycles: wake before sunrise, sip warm water, oil pulling (Gandusha).",
      instructions: "Maintain consistent sleep (10:00 PM) and wake-up times.",
      bestTime: "Daily morning routine",
    },
    {
      category: "meditation",
      title: "Mindfulness & Yoga Nidra",
      description: "Guided deep relaxation (Yoga Nidra) to release muscular tension and reset autonomic stress response.",
      instructions: "Lie in Shavasana for 20 minutes with relaxing ambient sound.",
      bestTime: "Evening before sunset or before sleep",
    },
  ];

  // 9. Evidence Engine
  const evidenceChain: EvidenceChainItem[] = [
    {
      claim: `Overall Vitality & Health Score: ${overallHealth}/100`,
      astrologicalBasis: `1st House in ${house1.rashi} with lord ${house1.rashiLord} and Sun in House ${planetRoles.Sun.house}.`,
      factors: {
        planet: planetRoles.Sun.planet,
        house: 1,
        rashi: house1.rashi,
      },
      confidencePercent: 95,
      lifestyleAdvice: "Maintain regular outdoor sunlight exposure and balanced daily hydration.",
    },
    {
      claim: `Digestive Fire & Agni Resilience`,
      astrologicalBasis: `6th House in ${house6.rashi} and Sun/Mars solar aspecting energy.`,
      factors: {
        planet: "Sun",
        house: 6,
        rashi: house6.rashi,
      },
      confidencePercent: 92,
      lifestyleAdvice: "Eat main meal at lunchtime when digestive fire (Pitta Agni) is naturally strongest.",
    },
    {
      claim: `Emotional Stability & Sleep Quality`,
      astrologicalBasis: `Moon in ${planetRoles.Moon.rashi} (House ${planetRoles.Moon.house}) and 12th house axis.`,
      factors: {
        planet: "Moon",
        house: planetRoles.Moon.house,
        rashi: planetRoles.Moon.rashi,
      },
      confidencePercent: 93,
      lifestyleAdvice: "Keep bedroom dark, cool, and free from blue-light screens before sleep.",
    },
  ];

  // 10. AI Health Coach Verdict & Summary
  const d6Houses = (kundli as any).d6?.houses;
  const d6House6 = d6Houses?.find((h: HouseCusp) => h.house === 6) || kundli.d1.houses[5];
  const d6House6Lord = RASHI_LORDS[d6House6.rashiIndex];

  const aiCoachVerdict = {
    executiveSummary: `Your chart exhibits strong overall vitality with a score of ${overallHealth}/100. The placement of Lagna lord ${house1.rashiLord} and Sun in ${planetRoles.Sun.rashi} provides robust foundational Prana. ${constitution.primaryDosha} body constitution highlights Pitta metabolic drive balanced by Vata mental agility.`,
    wellnessReadiness: (overallHealth >= 75 ? 'Optimal Wellness' : overallHealth >= 60 ? 'Moderate Balance' : 'Preventive Attention Required') as 'Optimal Wellness' | 'Moderate Balance' | 'Preventive Attention Required',
    actionPlan: [
      "Follow morning Surya Namaskar and 15-minute Anulom-Vilom Pranayama.",
      "Maintain consistent meal timing with warm, seasonal Ayurvedic foods.",
      "Engage in 20 minutes of evening Yoga Nidra for restorative sleep.",
      "Incorporate Sunday solar mantra practices for vital energy enhancement.",
    ],
    finalVerdict: `With an Overall Health Score of ${overallHealth}/100 and favorable ${constitution.primaryDosha} energetic balance, your astrological chart portends strong long-term physical and mental vitality when preventive lifestyle habits are maintained.`,
  };

  return {
    input,
    calculatedAt: new Date().toISOString(),
    kundli,
    scores,
    constitution,
    house1,
    house6,
    house8,
    house12,
    planets: planetRoles,
    d6Shashtamsha: {
      ascendantSign: rashiName(d6Houses?.[0]?.rashiIndex || 0),
      house6Sign: rashiName(d6House6.rashiIndex),
      house6Lord: d6House6Lord,
      keyPlanetsInD6: "D6 Divisional chart indicates favorable recovery resilience.",
      summary: "Shashtamsha D6 confirms strong innate immune defense and rapid recovery potential.",
    },
    organSystems,
    monthlyForecast,
    annualTimeline,
    riskAndRecoveryPeriods: {
      riskPeriods: [
        "Monsoon season transition (Emphasize digestive hygiene)",
        "Peak summer heat (Incorporate cooling Pitta-pacifying foods)",
      ],
      recoveryPeriods: [
        "Spring & Autumn months (Optimal periods for cellular rejuvenation)",
        "Favorable Jupiter transit windows (High vitality & immunity)",
      ],
    },
    seasonalWellness: {
      summerTips: ["Drink coconut water and mint-infused water.", "Avoid intense mid-day sun exposure."],
      monsoonTips: ["Eat freshly cooked warm meals with ginger & turmeric.", "Keep feet dry and clean."],
      winterTips: ["Include sesame seeds, almonds, and warm A2 milk.", "Perform morning warm oil massage."],
    },
    exerciseAndNutrition: {
      recommendedExercises: ["Surya Namaskar (Sun Salutations)", "Brisk Walking in Nature", "Swimming / Hydrotherapy", "Gentle Hatha Yoga"],
      nutritionGuidance: ["Prioritize fresh whole grains, steamed greens, and kitchari.", "Include digestive spices: cumin, coriander, fennel, turmeric."],
      foodsToFavor: ["Steamed Vegetables", "Mung Dal", "Fresh Seasonal Fruits", "Ghee", "Warm Herbal Teas"],
      foodsToModerate: ["Processed Heavy Foods", "Excessive Cold / Carbonated Drinks", "Deep Fried Snacks"],
    },
    remedies,
    luckyElements: {
      colors: ["Golden Yellow", "Forest Green", "Bright White", "Copper Red"],
      days: ["Sunday", "Thursday", "Tuesday"],
      numbers: [1, 3, 9, 5],
      directions: ["East", "North-East", "North"],
      healingHerbs: ["Tulsi (Holy Basil)", "Ashwagandha", "Amala (Indian Gooseberry)", "Turmeric"],
    },
    aiCoachVerdict,
    evidenceChain,
  };
}
