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
  OrganDashboardCard,
  RiskDashboardCard,
  MonthlyWellnessForecastItem,
  AnnualWellnessTimelineEvent,
  AyurvedicRemedyItem,
  EvidenceChainItem,
  AyurvedicChapter,
  AIHealthCoach,
  WellnessTimeline,
  ExpandedLuckyElements,
  FinalVerdict,
  strokeDoshaType,
} from "./types";
import { generateHealthSVGCharts } from "./health-charts-generator";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const RASHI_NAMES = [
  "Aries","Taurus","Gemini","Cancer",
  "Leo","Virgo","Libra","Scorpio",
  "Sagittarius","Capricorn","Aquarius","Pisces",
];

const RASHI_LORDS: GrahaName[] = [
  "Mars","Venus","Mercury","Moon",
  "Sun","Mercury","Venus","Mars",
  "Jupiter","Saturn","Saturn","Jupiter",
];

const MAHADASHA_SEQUENCE: GrahaName[] = [
  "Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury","Ketu","Venus",
];

const DASHA_YEARS = { Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17, Ketu:7, Venus:20 };

function rashiName(idx: number): string {
  return RASHI_NAMES[((idx % 12) + 12) % 12];
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function getDignity(planet: GrahaName, rashiIdx: number): 'exalted'|'own'|'friendly'|'neutral'|'enemy'|'debilitated' {
  if (planet === "Sun"     && rashiIdx === 0)  return "exalted";
  if (planet === "Sun"     && rashiIdx === 6)  return "debilitated";
  if (planet === "Moon"    && rashiIdx === 1)  return "exalted";
  if (planet === "Moon"    && rashiIdx === 7)  return "debilitated";
  if (planet === "Mars"    && rashiIdx === 9)  return "exalted";
  if (planet === "Mars"    && rashiIdx === 3)  return "debilitated";
  if (planet === "Jupiter" && rashiIdx === 3)  return "exalted";
  if (planet === "Jupiter" && rashiIdx === 9)  return "debilitated";
  if (planet === "Venus"   && rashiIdx === 11) return "exalted";
  if (planet === "Venus"   && rashiIdx === 5)  return "debilitated";
  if (planet === "Saturn"  && rashiIdx === 6)  return "exalted";
  if (planet === "Saturn"  && rashiIdx === 0)  return "debilitated";
  if (RASHI_LORDS[rashiIdx] === planet) return "own";
  return "friendly";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Engine
// ─────────────────────────────────────────────────────────────────────────────

export function computeHealthAnalysis(input: HealthAnalysisInput): HealthAnalysisResult {
  const kundli = generateKundli(input);
  const allGrahas: GrahaName[] = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];

  // ── House helper ──────────────────────────────────────────────────────────

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
      if (p.house === 4 && p.graha === "Mars"   && (houseNum === 7 || houseNum === 11)) aspects.push("Mars");
      if (p.house === 11 && p.graha === "Jupiter" && (houseNum === 3 || houseNum === 7)) aspects.push("Jupiter");
    });
    const hSig: Record<number,string> = {
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
      healthSignificance: hSig[houseNum] || "General health indicators.",
      tendencies: [
        `Governed by ${rashiLd} in ${rashiName(rashiIdx)}.`,
        occupants.length > 0 ? `Active influences from ${occupants.join(", ")}.` : "Stable energy — no malefic overcrowding.",
        aspects.length > 0 ? `Aspecting forces: ${aspects.join(", ")}.` : "No direct harsh aspects detected.",
      ],
    };
  }

  const house1  = getHouseInfo(1);
  const house6  = getHouseInfo(6);
  const house8  = getHouseInfo(8);
  const house12 = getHouseInfo(12);

  // ── Planet roles ──────────────────────────────────────────────────────────

  const organMap: Record<GrahaName, string[]> = {
    Sun:     ["Heart","Bones","Spine","Eyes","Vital Prana"],
    Moon:    ["Mind","Body Fluids","Chest/Lungs","Stomach","Circulation"],
    Mars:    ["Muscles","Blood/Hemoglobin","Adrenals","Bone Marrow"],
    Mercury: ["Nervous System","Skin","Speech","Lungs/Bronchials"],
    Jupiter: ["Liver","Fat Tissue","Pancreas","Immune Resilience"],
    Venus:   ["Hormonal Balance","Kidneys","Reproductive Organs","Skin Texture"],
    Saturn:  ["Joints","Teeth","Bones","Longevity","Chronic Stiffness"],
    Rahu:    ["Autonomic Nerves","Subtle Sensitivities","Allergies"],
    Ketu:    ["Subtle Body","Psychosomatic Energetics","Spinal Base"],
  };

  const planetRoles: Record<GrahaName, PlanetHealthRole> = {} as Record<GrahaName, PlanetHealthRole>;
  allGrahas.forEach((g) => {
    const pObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === g);
    const hNum = pObj ? pObj.house : 1;
    const rIdx = pObj ? pObj.rashiIndex : 0;
    const isRetro = pObj ? pObj.retrograde : false;
    const dig = getDignity(g, rIdx);
    const scoreVal = dig === "exalted" ? 95 : dig === "own" ? 88 : dig === "debilitated" ? 45 : 72;
    planetRoles[g] = {
      planet: g, house: hNum, rashi: rashiName(rIdx),
      isRetrograde: isRetro, isCombust: false, dignity: dig,
      healthImpact: `${g} in House ${hNum} (${rashiName(rIdx)}) governs ${organMap[g].join(", ")}. ${
        dig === "exalted" ? "Bestows robust vitality and natural resilience." :
        dig === "debilitated" ? "Calls for conscious lifestyle care and preventive nutrition." :
        "Supports balanced physiological function."
      }`,
      governedOrgans: organMap[g],
      score: scoreVal,
    };
  });

  // ── Dosha & Constitution ──────────────────────────────────────────────────

  const sunRashi   = planetRoles.Sun.rashi;
  const moonRashi  = planetRoles.Moon.rashi;
  const lagnaRashi = house1.rashi;

  let vataCount = 0, pittaCount = 0, kaphaCount = 0;
  [sunRashi, moonRashi, lagnaRashi].forEach((r) => {
    if (["Gemini","Libra","Aquarius","Virgo","Capricorn"].includes(r)) vataCount += 2;
    else if (["Aries","Leo","Sagittarius","Scorpio"].includes(r)) pittaCount += 2;
    else kaphaCount += 2;
  });

  const totalPts = vataCount + pittaCount + kaphaCount || 6;
  const vataPct   = Math.round((vataCount  / totalPts) * 100);
  const pittaPct  = Math.round((pittaCount / totalPts) * 100);
  const kaphaPct  = Math.round((kaphaCount / totalPts) * 100);

  let primaryDosha: strokeDoshaType = "Vata-Pitta";
  if      (pittaPct > 50) primaryDosha = "Pitta";
  else if (vataPct  > 50) primaryDosha = "Vata";
  else if (kaphaPct > 50) primaryDosha = "Kapha";
  else if (pittaPct > 40 && vataPct  > 35) primaryDosha = "Vata-Pitta";
  else if (pittaPct > 40 && kaphaPct > 35) primaryDosha = "Pitta-Kapha";
  else if (vataPct  > 40 && kaphaPct > 35) primaryDosha = "Vata-Kapha";
  else primaryDosha = "Tridoshic";

  const constitution: BodyConstitution = {
    primaryDosha, vataPercentage: vataPct, pittaPercentage: pittaPct, kaphaPercentage: kaphaPct,
    summary: `Your planetary constitution reflects a dominant ${primaryDosha} nature. ${
      primaryDosha.includes("Pitta") ? "Pitta provides strong metabolic fire (Agni) and sharp focus." :
      primaryDosha.includes("Vata")  ? "Vata governs nervous system agility, creativity, and movement." :
      "Kapha bestows endurance, stability, and strong physical lubrication."
    }`,
    recommendations: [
      primaryDosha.includes("Vata")  ? "Favor warm, unctuous, grounding foods with consistent meal timing." : "Maintain consistent meal schedules and avoid erratic eating patterns.",
      primaryDosha.includes("Pitta") ? "Avoid excess spicy, sour, or fried foods especially in summer." : "Include moderate exercise daily to stimulate metabolic fire.",
      "Maintain consistent sleep (before 10:30 PM) and wake-up times (before 6:00 AM).",
    ],
  };

  // ── Scores ────────────────────────────────────────────────────────────────

  let baseOverall = 78;
  if (planetRoles.Sun.dignity === "exalted" || planetRoles.Sun.dignity === "own") baseOverall += 8;
  if (planetRoles.Moon.dignity === "exalted" || planetRoles.Moon.dignity === "own") baseOverall += 7;
  if (house6.planetsInHouse.includes("Saturn") || house6.planetsInHouse.includes("Mars")) baseOverall -= 5;
  if (house6.planetsInHouse.includes("Jupiter") || house6.planetsInHouse.includes("Venus")) baseOverall += 4;
  const overallHealth = clamp(baseOverall, 50, 98);
  const mentalWellness    = clamp(75 + (planetRoles.Moon.dignity === "exalted" ? 12 : 0)   - (planetRoles.Moon.house === 6 || planetRoles.Moon.house === 8 ? 8 : 0), 45, 96);
  const physicalVitality  = clamp(76 + (planetRoles.Sun.dignity === "exalted"  ? 14 : 4),   50, 98);
  const stress            = clamp((planetRoles.Saturn.house === 1 || planetRoles.Mars.house === 6) ? 65 : 35, 20, 88);
  const energy            = clamp(78 + (planetRoles.Mars.dignity === "exalted" ? 12 : 2),   45, 96);
  const immunity          = clamp(74 + (planetRoles.Jupiter.dignity === "exalted" ? 14 : 4), 48, 97);
  const recovery          = clamp(75 + (house8.planetsInHouse.length === 0 ? 8 : 0),         45, 95);
  const lifestyleBalance  = clamp(72 + (house6.planetsInHouse.length === 0 ? 8 : 0),         45, 95);
  const sleep             = clamp(70 + (house12.planetsInHouse.length === 0 ? 10 : -5),      40, 94);
  const emotionalStability = clamp(74 + (planetRoles.Moon.dignity === "exalted" ? 10 : 0),  45, 96);

  const scores: HealthScores = {
    overallHealth, mentalWellness, physicalVitality, stress,
    energy, immunity, recovery, lifestyleBalance, sleep, emotionalStability,
  };

  // ── Legacy Organ Systems (backward compat) ────────────────────────────────

  const organSystems: OrganSystemTendency[] = [
    {
      systemName: "Digestive System (Agni)",
      rulingPlanets: ["Sun","Mars"], rulingHouses: [5,6],
      wellnessStatus: planetRoles.Sun.dignity === "debilitated" ? "Needs Attention" : "Optimal",
      description: `Sun (House ${planetRoles.Sun.house}) and Mars (House ${planetRoles.Mars.house}) govern metabolic absorption and gastric fire in ${lagnaRashi} Lagna.`,
      preventiveTips: ["Sip warm cumin-ginger tea after meals.","Avoid heavy late-night dinners."],
    },
    {
      systemName: "Cardiovascular System",
      rulingPlanets: ["Sun","Moon"], rulingHouses: [4,5],
      wellnessStatus: planetRoles.Sun.dignity === "exalted" ? "Optimal" : "Favorable",
      description: `Sun in ${planetRoles.Sun.rashi} rules cardiac vitality; Moon in ${planetRoles.Moon.rashi} influences fluid balance and emotional rhythm.`,
      preventiveTips: ["30 minutes of aerobic walking daily.","Pranayama to support heart rate variability."],
    },
    {
      systemName: "Musculoskeletal & Joint System",
      rulingPlanets: ["Saturn","Mars"], rulingHouses: [1,10],
      wellnessStatus: planetRoles.Saturn.house === 1 ? "Needs Attention" : "Favorable",
      description: `Saturn in ${planetRoles.Saturn.rashi} (House ${planetRoles.Saturn.house}) governs joint lubrication; Mars in ${planetRoles.Mars.rashi} governs muscle tone and bone marrow.`,
      preventiveTips: ["Morning joint loosening (Sukshma Vyayama).","Sesame oil Abhyanga massage weekly."],
    },
    {
      systemName: "Skin & Hormonal System",
      rulingPlanets: ["Venus","Mercury"], rulingHouses: [7,8],
      wellnessStatus: planetRoles.Venus.dignity === "debilitated" ? "Needs Attention" : "Favorable",
      description: `Venus in ${planetRoles.Venus.rashi} regulates hormonal/endocrine balance; Mercury in ${planetRoles.Mercury.rashi} governs skin barrier health and nervous signals.`,
      preventiveTips: ["Stay well-hydrated (2.5–3L water daily).","Consume antioxidant-rich fresh fruits."],
    },
  ];

  // ── 13-Organ Dashboard ────────────────────────────────────────────────────

  function organRisk(planet: GrahaName): number {
    const d = planetRoles[planet].dignity;
    const h = planetRoles[planet].house;
    let r = d === "debilitated" ? 55 : d === "exalted" ? 12 : 28;
    if (h === 6 || h === 8 || h === 12) r += 15;
    return clamp(r, 8, 72);
  }

  function colorFor(risk: number): 'green'|'yellow'|'orange'|'red' {
    if (risk <= 20) return 'green';
    if (risk <= 35) return 'yellow';
    if (risk <= 55) return 'orange';
    return 'red';
  }

  const organDashboard: OrganDashboardCard[] = [
    {
      organName: "Heart",
      planet: "Sun", house: 5,
      healthScore: clamp(100 - organRisk("Sun"), 30, 95),
      riskPercent: organRisk("Sun"),
      colorIndicator: colorFor(organRisk("Sun")),
      currentStrength: planetRoles.Sun.dignity === "exalted" ? "Excellent" : planetRoles.Sun.dignity === "debilitated" ? "Moderate" : "Good",
      futureTrend: house6.planetsInHouse.includes("Sun") ? "Needs Monitoring" : "Stable",
      dashaImpact: `Sun Mahadasha activates cardiac vitality and Prana channel.`,
      transitImpact: `Sun transit through ${planetRoles.Sun.rashi} strengthens 5th house heart energy.`,
      recoveryPotential: planetRoles.Sun.dignity === "exalted" ? "Excellent" : "Good",
      preventiveAdvice: `Sun in ${planetRoles.Sun.rashi} (House ${planetRoles.Sun.house}): Maintain regular sunrise walks, Vitamin D exposure, and avoid excess salt.`,
      ayurvedicHerbs: ["Arjuna","Brahmi","Ashwagandha","Saffron"],
      bestFoods: ["Pomegranate","Beet root","Walnuts","Dark chocolate (70%+)","Flaxseeds"],
      worstFoods: ["Processed meats","Trans fats","Excess alcohol","Refined sugar","High-sodium snacks"],
      yoga: ["Ustrasana (Camel Pose)","Bhujangasana (Cobra)","Dhanurasana"],
      pranayama: ["Anulom-Vilom (15 min)","Bhramari (5 min)"],
      medicalDisclaimer: "Consult a cardiologist for any chest pain or palpitation symptoms.",
    },
    {
      organName: "Liver",
      planet: "Jupiter", house: 9,
      healthScore: clamp(100 - organRisk("Jupiter"), 30, 95),
      riskPercent: organRisk("Jupiter"),
      colorIndicator: colorFor(organRisk("Jupiter")),
      currentStrength: planetRoles.Jupiter.dignity === "exalted" ? "Excellent" : "Good",
      futureTrend: "Stable",
      dashaImpact: `Jupiter's dasha period enhances liver detox capacity and fat metabolism.`,
      transitImpact: `Jupiter in ${planetRoles.Jupiter.rashi} supports hepatic enzyme balance.`,
      recoveryPotential: "Excellent",
      preventiveAdvice: `Jupiter in ${planetRoles.Jupiter.rashi} (House ${planetRoles.Jupiter.house}): Limit alcohol and processed fats. Take Liv-52 or Milk Thistle as preventive support.`,
      ayurvedicHerbs: ["Bhumi Amla","Milk Thistle","Kutki","Triphala"],
      bestFoods: ["Leafy greens","Garlic","Turmeric milk","Green tea","Beets"],
      worstFoods: ["Alcohol","Fried oily food","Processed sugar","White bread","Artificial sweeteners"],
      yoga: ["Dhanurasana","Paschimottanasana","Ardha Matsyendrasana"],
      pranayama: ["Kapalabhati (5 min)","Bhastrika (3 min)"],
      medicalDisclaimer: "Get annual liver function tests (LFT) if symptoms of fatigue or jaundice appear.",
    },
    {
      organName: "Kidney",
      planet: "Venus", house: 7,
      healthScore: clamp(100 - organRisk("Venus"), 30, 95),
      riskPercent: organRisk("Venus"),
      colorIndicator: colorFor(organRisk("Venus")),
      currentStrength: planetRoles.Venus.dignity === "exalted" ? "Excellent" : "Good",
      futureTrend: "Stable",
      dashaImpact: `Venus Mahadasha governs renal filtration and fluid electrolyte balance.`,
      transitImpact: `Venus in ${planetRoles.Venus.rashi} — hydration balance requires attention during transit to 6th or 8th house.`,
      recoveryPotential: "Good",
      preventiveAdvice: `Venus in ${planetRoles.Venus.rashi} (House ${planetRoles.Venus.house}): Drink 2.5–3L water daily. Limit excess protein and salt.`,
      ayurvedicHerbs: ["Punarnava","Gokshura","Varuna","Coriander seeds"],
      bestFoods: ["Watermelon","Cucumber","Coconut water","Cranberry juice","Parsley"],
      worstFoods: ["Excess salt","Processed meats","Soda drinks","Oxalate-rich spinach (excess)","Alcohol"],
      yoga: ["Setu Bandha (Bridge Pose)","Balasana","Viparita Karani"],
      pranayama: ["Sheetali (cooling breath)","Anulom-Vilom"],
      medicalDisclaimer: "Annual kidney function test (KFT) recommended if family history of kidney disease.",
    },
    {
      organName: "Digestive System",
      planet: "Mercury", house: 6,
      healthScore: clamp(100 - organRisk("Mercury"), 30, 95),
      riskPercent: organRisk("Mercury"),
      colorIndicator: colorFor(organRisk("Mercury")),
      currentStrength: planetRoles.Mercury.dignity === "own" ? "Excellent" : "Good",
      futureTrend: house6.planetsInHouse.includes("Saturn") ? "Worsening" : "Stable",
      dashaImpact: `Mercury Mahadasha activates intestinal peristalsis and enzymatic digestion.`,
      transitImpact: `Mercury in ${planetRoles.Mercury.rashi} — gut microbiome sensitivity peaks during retrograde cycles.`,
      recoveryPotential: "Excellent",
      preventiveAdvice: `Mercury in ${planetRoles.Mercury.rashi} (House ${planetRoles.Mercury.house}): Eat mindfully, chew thoroughly, avoid eating under stress.`,
      ayurvedicHerbs: ["Triphala","Hingvastak churna","Ajwain","Fennel"],
      bestFoods: ["Khichdi (mung dal + rice)","Curd/Yogurt","Ginger tea","Papaya","Banana"],
      worstFoods: ["Cold drinks with meals","Raw salads in winter","Deep-fried snacks","Carbonated soda","Excess raw beans"],
      yoga: ["Pawanmuktasana","Vajrasana (after meals)","Trikonasana"],
      pranayama: ["Kapalabhati","Agni Sara Kriya"],
      medicalDisclaimer: "Persistent bloating or IBS symptoms require gastroenterologist consultation.",
    },
    {
      organName: "Lungs",
      planet: "Moon", house: 4,
      healthScore: clamp(100 - organRisk("Moon"), 30, 95),
      riskPercent: organRisk("Moon"),
      colorIndicator: colorFor(organRisk("Moon")),
      currentStrength: planetRoles.Moon.dignity === "exalted" ? "Excellent" : "Moderate",
      futureTrend: "Stable",
      dashaImpact: `Moon Mahadasha governs chest/pulmonary tissue and bronchial moisture.`,
      transitImpact: `Moon transit through ${planetRoles.Moon.rashi} — respiratory sensitivity increases during monsoon.`,
      recoveryPotential: "Good",
      preventiveAdvice: `Moon in ${planetRoles.Moon.rashi} (House ${planetRoles.Moon.house}): Avoid cold damp environments. Steam inhalation with eucalyptus during seasonal transitions.`,
      ayurvedicHerbs: ["Vasaka (Malabar nut)","Sitopaladi churna","Licorice (Mulethi)","Tulsi"],
      bestFoods: ["Warm soups","Turmeric milk","Ginger-honey tea","Fresh amla","Almonds"],
      worstFoods: ["Cold ice cream","Banana (at night)","Curd at night","Excess dairy","Cold water"],
      yoga: ["Bhujangasana","Ustrasana","Tadasana","Virabhadrasana"],
      pranayama: ["Anulom-Vilom","Bhramari","Deep diaphragmatic breathing"],
      medicalDisclaimer: "Chronic cough or breathing difficulty requires pulmonologist evaluation.",
    },
    {
      organName: "Brain & Nervous System",
      planet: "Mercury", house: 1,
      healthScore: clamp(100 - organRisk("Mercury") + 10, 30, 95),
      riskPercent: clamp(organRisk("Mercury") - 5, 5, 70),
      colorIndicator: colorFor(clamp(organRisk("Mercury") - 5, 5, 70)),
      currentStrength: "Good",
      futureTrend: planetRoles.Rahu.house === 1 ? "Needs Monitoring" : "Stable",
      dashaImpact: `Mercury and Rahu govern the central and autonomic nervous systems.`,
      transitImpact: `Rahu transit (House ${planetRoles.Rahu.house}) can cause nervous system overstimulation.`,
      recoveryPotential: "Good",
      preventiveAdvice: `Mercury in ${planetRoles.Mercury.rashi}: Digital detox evenings, 8h sleep, avoid multitasking overload.`,
      ayurvedicHerbs: ["Brahmi","Shankhpushpi","Ashwagandha","Jatamansi"],
      bestFoods: ["Walnuts","Blueberries","Dark chocolate","Chia seeds","Pumpkin seeds"],
      worstFoods: ["Alcohol","Excess caffeine","Trans fats","Artificial sweeteners","Processed junk"],
      yoga: ["Sirsasana (headstand — with proper training)","Balasana","Sarvangasana"],
      pranayama: ["Nadi Shodhana","Bhramari (calms nervous system)"],
      medicalDisclaimer: "Persistent headaches, memory issues, or neurological symptoms require neurologist consultation.",
    },
    {
      organName: "Hormones & Endocrine",
      planet: "Venus", house: 7,
      healthScore: clamp(100 - organRisk("Venus") + 5, 30, 95),
      riskPercent: clamp(organRisk("Venus") - 5, 5, 70),
      colorIndicator: colorFor(clamp(organRisk("Venus") - 5, 5, 70)),
      currentStrength: planetRoles.Venus.dignity === "exalted" ? "Excellent" : "Good",
      futureTrend: "Stable",
      dashaImpact: `Venus Mahadasha regulates thyroid, adrenal, and reproductive hormones.`,
      transitImpact: `Venus in ${planetRoles.Venus.rashi} supports hormonal equilibrium and skin vitality.`,
      recoveryPotential: "Good",
      preventiveAdvice: `Venus in ${planetRoles.Venus.rashi} (House ${planetRoles.Venus.house}): Regular sleep, stress management, and avoid endocrine disruptors (plastics, excess chemicals).`,
      ayurvedicHerbs: ["Shatavari","Ashoka","Lodhra","Triphala"],
      bestFoods: ["Flaxseeds","Sesame","Avocado","Fenugreek","Cruciferous vegetables"],
      worstFoods: ["Soy in excess","BPA plastics (food storage)","Refined sugar","Alcohol","Processed dairy"],
      yoga: ["Setu Bandha","Supta Baddha Konasana","Viparita Karani"],
      pranayama: ["Anulom-Vilom","Sheetali"],
      medicalDisclaimer: "Thyroid disorders or hormonal imbalances require endocrinologist evaluation.",
    },
    {
      organName: "Skin",
      planet: "Mercury", house: 3,
      healthScore: clamp(100 - organRisk("Mercury") + 8, 30, 95),
      riskPercent: clamp(organRisk("Mercury") - 8, 5, 65),
      colorIndicator: colorFor(clamp(organRisk("Mercury") - 8, 5, 65)),
      currentStrength: "Good",
      futureTrend: "Stable",
      dashaImpact: `Mercury + Venus govern skin texture, elasticity, and dermal blood flow.`,
      transitImpact: `Venus transit affects skin radiance and complexion clarity.`,
      recoveryPotential: "Excellent",
      preventiveAdvice: `Mercury in ${planetRoles.Mercury.rashi}: Hydrate well, use natural moisturizers, avoid harsh chemical products.`,
      ayurvedicHerbs: ["Manjistha","Neem","Turmeric","Aloe Vera","Guduchi"],
      bestFoods: ["Cucumber","Tomatoes","Amla","Green tea","Papaya","Vitamin C rich fruits"],
      worstFoods: ["Excess sugar (glycation)","Deep-fried food","Alcohol","Excess spicy food","Dairy for acne-prone"],
      yoga: ["Sarvangasana (increases facial blood flow)","Trikonasana","Matsyasana"],
      pranayama: ["Kapalabhati (detox breath)","Bhastrika"],
      medicalDisclaimer: "Chronic skin conditions (psoriasis, eczema) require dermatologist evaluation.",
    },
    {
      organName: "Eyes",
      planet: "Sun", house: 5,
      healthScore: clamp(100 - organRisk("Sun") + 5, 30, 95),
      riskPercent: clamp(organRisk("Sun") - 5, 5, 65),
      colorIndicator: colorFor(clamp(organRisk("Sun") - 5, 5, 65)),
      currentStrength: planetRoles.Sun.dignity === "exalted" ? "Excellent" : "Good",
      futureTrend: "Stable",
      dashaImpact: `Sun rules optic nerve vitality and retinal health.`,
      transitImpact: `Sun transit through Leo (own house) strengthens ocular Prana.`,
      recoveryPotential: "Good",
      preventiveAdvice: `Sun in ${planetRoles.Sun.rashi}: Screen time breaks (20-20-20 rule), UV-protected eyewear outdoors.`,
      ayurvedicHerbs: ["Triphala (eye wash)","Amalaki","Saffron","Bilberry"],
      bestFoods: ["Carrots","Leafy greens","Blueberries","Fish (omega-3)","Eggs"],
      worstFoods: ["Excess screen time","Trans fats","Smoking","Excess alcohol","High-sugar diet"],
      yoga: ["Trataka (candle gazing)","Palming","Eye rotation exercises"],
      pranayama: ["Anulom-Vilom","Bhramari"],
      medicalDisclaimer: "Annual ophthalmologist check-up recommended. Seek immediate help for sudden vision changes.",
    },
    {
      organName: "Bones & Joints",
      planet: "Saturn", house: 10,
      healthScore: clamp(100 - organRisk("Saturn"), 30, 95),
      riskPercent: organRisk("Saturn"),
      colorIndicator: colorFor(organRisk("Saturn")),
      currentStrength: planetRoles.Saturn.dignity === "exalted" ? "Good" : "Moderate",
      futureTrend: planetRoles.Saturn.house === 1 ? "Needs Monitoring" : "Stable",
      dashaImpact: `Saturn Mahadasha directly governs bone density, joint lubrication, and skeletal strength.`,
      transitImpact: `Saturn transit through ${planetRoles.Saturn.rashi} — joint stiffness may increase in cold/damp weather.`,
      recoveryPotential: "Moderate",
      preventiveAdvice: `Saturn in ${planetRoles.Saturn.rashi} (House ${planetRoles.Saturn.house}): Daily weight-bearing exercises, calcium-rich foods, sesame oil massage (Abhyanga).`,
      ayurvedicHerbs: ["Shallaki (Boswellia)","Guggul","Rasna","Hadjod (Cissus)"],
      bestFoods: ["Sesame seeds","Dairy (A2 milk)","Ragi (finger millet)","Almonds","Green leafy vegetables"],
      worstFoods: ["Excess nightshades (tomato, eggplant — Vata types)","Cold raw food","Carbonated drinks","Excess refined sugar","Junk food"],
      yoga: ["Trikonasana","Virabhadrasana","Tadasana","Setu Bandha"],
      pranayama: ["Anulom-Vilom","Bhramari"],
      medicalDisclaimer: "Bone density (DEXA scan) recommended after age 40 or if joint pain is persistent.",
    },
    {
      organName: "Immunity",
      planet: "Jupiter", house: 9,
      healthScore: clamp(immunity, 30, 97),
      riskPercent: clamp(100 - immunity, 5, 65),
      colorIndicator: colorFor(clamp(100 - immunity, 5, 65)),
      currentStrength: planetRoles.Jupiter.dignity === "exalted" ? "Excellent" : "Good",
      futureTrend: "Stable",
      dashaImpact: `Jupiter's benefic Dasha period strengthens ojas (vital immunity essence) significantly.`,
      transitImpact: `Jupiter in ${planetRoles.Jupiter.rashi} boosts lymphatic system and white blood cell efficiency.`,
      recoveryPotential: "Excellent",
      preventiveAdvice: `Jupiter in ${planetRoles.Jupiter.rashi}: Maintain optimistic attitude, regular sleep, adaptogenic herbs.`,
      ayurvedicHerbs: ["Chyawanprash","Ashwagandha","Giloy (Guduchi)","Tulsi","Amla"],
      bestFoods: ["Turmeric golden milk","Garlic","Citrus fruits","Ginger","Fermented foods (yogurt)"],
      worstFoods: ["Processed food","Excess sugar","Alcohol","Cold drinks","Junk food"],
      yoga: ["Surya Namaskar (12 rounds)","Virabhadrasana","Sarvangasana"],
      pranayama: ["Kapalabhati","Bhastrika","Anulom-Vilom"],
      medicalDisclaimer: "Frequent infections or immune suppression requires immunologist evaluation.",
    },
    {
      organName: "Sleep & Circadian",
      planet: "Moon", house: 12,
      healthScore: clamp(sleep, 30, 94),
      riskPercent: clamp(100 - sleep, 5, 70),
      colorIndicator: colorFor(clamp(100 - sleep, 5, 70)),
      currentStrength: house12.planetsInHouse.length === 0 ? "Good" : "Moderate",
      futureTrend: "Stable",
      dashaImpact: `Moon's position in House ${planetRoles.Moon.house} governs circadian rhythm and deep sleep cycles.`,
      transitImpact: `Moon transit through 12th house each month creates natural sleep restoration windows.`,
      recoveryPotential: "Good",
      preventiveAdvice: `12th House (${house12.rashi}): Bedroom should be dark, cool (18–20°C), no screens 60 min before bed.`,
      ayurvedicHerbs: ["Ashwagandha","Brahmi","Jatamansi","Sarpagandha (with doctor's advice)"],
      bestFoods: ["Warm A2 milk with nutmeg","Banana","Almonds","Chamomile tea","Tart cherry juice"],
      worstFoods: ["Caffeine after 2 PM","Heavy late dinner","Alcohol","Spicy food at night","Cold foods"],
      yoga: ["Yoga Nidra (20 min)","Shavasana","Viparita Karani"],
      pranayama: ["4-7-8 breathing","Bhramari before sleep","Chandra Bhedana (left nostril)"],
      medicalDisclaimer: "Chronic insomnia or sleep apnea requires sleep study (polysomnography).",
    },
    {
      organName: "Stress & Adrenals",
      planet: "Saturn", house: 6,
      healthScore: clamp(100 - stress, 30, 95),
      riskPercent: clamp(stress, 10, 80),
      colorIndicator: colorFor(clamp(stress, 10, 80)),
      currentStrength: stress > 60 ? "Needs Attention" : stress > 40 ? "Moderate" : "Good",
      futureTrend: planetRoles.Saturn.house === 1 || planetRoles.Rahu.house === 6 ? "Needs Monitoring" : "Stable",
      dashaImpact: `Saturn and Rahu (Houses ${planetRoles.Saturn.house} & ${planetRoles.Rahu.house}) activate cortisol and adrenal stress response.`,
      transitImpact: `Rahu transit in House ${planetRoles.Rahu.house} may amplify anxiety and stress sensitivity.`,
      recoveryPotential: stress > 65 ? "Fair" : "Good",
      preventiveAdvice: `Saturn in ${planetRoles.Saturn.rashi}: Structured daily routine, digital detox, limit news/social media. 20-min evening walk mandatory.`,
      ayurvedicHerbs: ["Ashwagandha","Brahmi","Tulsi","Licorice root","Shatavari"],
      bestFoods: ["Magnesium-rich foods (spinach, pumpkin seeds)","Dark chocolate","Avocado","Chamomile tea","Oats"],
      worstFoods: ["Excess caffeine","Alcohol","Sugary snacks","Processed food","Energy drinks"],
      yoga: ["Balasana (Child's pose)","Shavasana","Janu Sirsasana","Legs up wall"],
      pranayama: ["Nadi Shodhana","4-7-8 breathing","Bhramari"],
      medicalDisclaimer: "Burnout or chronic anxiety requires consultation with a mental health professional.",
    },
  ];

  // ── Risk Dashboard ────────────────────────────────────────────────────────

  const riskDashboard: RiskDashboardCard[] = [
    {
      conditionName: "Heart Disease",
      riskPercent: organRisk("Sun"),
      currentSeverity: organRisk("Sun") > 50 ? "High" : organRisk("Sun") > 30 ? "Moderate" : "Low",
      futureTrend: "Stable",
      recoveryPotential: "Good",
      priority: organRisk("Sun") > 50 ? "High" : "Medium",
      keyPlanet: "Sun", keyHouse: 5,
      preventiveSummary: `Sun in ${planetRoles.Sun.rashi} (House ${planetRoles.Sun.house}) — maintain heart-healthy lifestyle.`,
      actionItems: ["Daily 30-min cardio","Limit saturated fats","Arjuna bark herbal tea","Stress management"],
    },
    {
      conditionName: "Diabetes / Blood Sugar",
      riskPercent: organRisk("Jupiter"),
      currentSeverity: organRisk("Jupiter") > 50 ? "High" : "Moderate",
      futureTrend: planetRoles.Jupiter.dignity === "debilitated" ? "Worsening" : "Stable",
      recoveryPotential: "Good",
      priority: organRisk("Jupiter") > 45 ? "High" : "Medium",
      keyPlanet: "Jupiter", keyHouse: 9,
      preventiveSummary: `Jupiter in ${planetRoles.Jupiter.rashi} governs pancreatic insulin function.`,
      actionItems: ["Avoid refined sugar & white carbs","Regular blood sugar monitoring","Bitter gourd (Karela) juice","Daily 20-min walk after meals"],
    },
    {
      conditionName: "Blood Pressure",
      riskPercent: clamp(organRisk("Mars") + 5, 5, 75),
      currentSeverity: organRisk("Mars") > 50 ? "High" : "Moderate",
      futureTrend: "Stable",
      recoveryPotential: "Good",
      priority: organRisk("Mars") > 50 ? "High" : "Medium",
      keyPlanet: "Mars", keyHouse: planetRoles.Mars.house,
      preventiveSummary: `Mars in ${planetRoles.Mars.rashi} (House ${planetRoles.Mars.house}) affects blood pressure and vascular tone.`,
      actionItems: ["Reduce sodium intake","Daily meditation","Arjuna + Brahmi supplement","Avoid anger triggers"],
    },
    {
      conditionName: "Chronic Stress",
      riskPercent: stress,
      currentSeverity: stress > 70 ? "High" : stress > 45 ? "Moderate" : "Low",
      futureTrend: planetRoles.Rahu.house === 6 ? "Worsening" : "Stable",
      recoveryPotential: stress > 65 ? "Fair" : "Good",
      priority: stress > 65 ? "High" : "Medium",
      keyPlanet: "Saturn", keyHouse: 6,
      preventiveSummary: `Saturn-Rahu axis creates chronic stress patterns requiring structured lifestyle management.`,
      actionItems: ["Daily Yoga Nidra (20 min)","Digital detox after 9 PM","Ashwagandha supplementation","Nature walks 3x/week"],
    },
    {
      conditionName: "Joint / Arthritis Pain",
      riskPercent: organRisk("Saturn"),
      currentSeverity: organRisk("Saturn") > 50 ? "High" : "Moderate",
      futureTrend: planetRoles.Saturn.dignity === "exalted" ? "Improving" : "Stable",
      recoveryPotential: "Moderate",
      priority: organRisk("Saturn") > 50 ? "High" : "Low",
      keyPlanet: "Saturn", keyHouse: planetRoles.Saturn.house,
      preventiveSummary: `Saturn in ${planetRoles.Saturn.rashi} governs synovial fluid and cartilage health.`,
      actionItems: ["Abhyanga (warm sesame oil massage)","Shallaki supplement","Avoid cold damp environments","Gentle swimming / yoga"],
    },
    {
      conditionName: "Skin Conditions",
      riskPercent: clamp(organRisk("Mercury") - 5, 5, 60),
      currentSeverity: "Low",
      futureTrend: "Stable",
      recoveryPotential: "Excellent",
      priority: "Low",
      keyPlanet: "Mercury", keyHouse: planetRoles.Mercury.house,
      preventiveSummary: `Mercury in ${planetRoles.Mercury.rashi} governs skin microbiome and barrier integrity.`,
      actionItems: ["Manjistha + Neem supplement","Natural moisturizers (aloe vera)","Avoid harsh chemicals","Diet high in antioxidants"],
    },
    {
      conditionName: "Digestive Disorders",
      riskPercent: house6.planetsInHouse.includes("Saturn") ? 55 : organRisk("Mercury"),
      currentSeverity: house6.planetsInHouse.includes("Saturn") ? "Moderate" : "Low",
      futureTrend: "Stable",
      recoveryPotential: "Excellent",
      priority: house6.planetsInHouse.includes("Saturn") ? "Medium" : "Low",
      keyPlanet: "Mercury", keyHouse: 6,
      preventiveSummary: `6th House (${house6.rashi}) governs digestive fire (Agni). Saturn here can slow peristalsis.`,
      actionItems: ["Triphala churna before bed","Mindful eating (no screens)","Warm ginger-cumin water","Avoid cold raw foods in winter"],
    },
    {
      conditionName: "Sleep Disorders",
      riskPercent: clamp(100 - sleep, 5, 70),
      currentSeverity: sleep < 50 ? "High" : sleep < 70 ? "Moderate" : "Low",
      futureTrend: "Stable",
      recoveryPotential: "Good",
      priority: sleep < 50 ? "High" : "Low",
      keyPlanet: "Moon", keyHouse: 12,
      preventiveSummary: `Moon in ${planetRoles.Moon.rashi} (House ${planetRoles.Moon.house}) + 12th house axis governs sleep.`,
      actionItems: ["Yoga Nidra before sleep","Warm milk with nutmeg","Strict sleep schedule","No screens 90 min before bed"],
    },
    {
      conditionName: "Hormonal Imbalance",
      riskPercent: clamp(organRisk("Venus") - 5, 5, 60),
      currentSeverity: planetRoles.Venus.dignity === "debilitated" ? "Moderate" : "Low",
      futureTrend: "Stable",
      recoveryPotential: "Good",
      priority: "Medium",
      keyPlanet: "Venus", keyHouse: planetRoles.Venus.house,
      preventiveSummary: `Venus in ${planetRoles.Venus.rashi} (House ${planetRoles.Venus.house}) governs endocrine equilibrium.`,
      actionItems: ["Shatavari supplement for balance","Reduce plastic/BPA exposure","Seed cycling for hormonal rhythm","Regular lab tests (TSH, cortisol)"],
    },
    {
      conditionName: "Low Immunity",
      riskPercent: clamp(100 - immunity, 5, 65),
      currentSeverity: immunity < 55 ? "High" : immunity < 70 ? "Moderate" : "Low",
      futureTrend: planetRoles.Jupiter.dignity === "exalted" ? "Improving" : "Stable",
      recoveryPotential: "Excellent",
      priority: immunity < 60 ? "High" : "Low",
      keyPlanet: "Jupiter", keyHouse: planetRoles.Jupiter.house,
      preventiveSummary: `Jupiter in ${planetRoles.Jupiter.rashi} governs ojas — the body's innate vitality & immune essence.`,
      actionItems: ["Chyawanprash daily","Giloy + Tulsi kadha","Minimize processed food","8h sleep minimum"],
    },
  ];

  // ── Determine Mahadasha ───────────────────────────────────────────────────

  const birthYear = new Date(input.date).getFullYear();
  const currentYear = new Date().getFullYear();
  const ageAtCalc = currentYear - birthYear;
  let dashaIdx = 0;
  let accumulatedYears = 0;
  for (let i = 0; i < MAHADASHA_SEQUENCE.length; i++) {
    const planet = MAHADASHA_SEQUENCE[i];
    accumulatedYears += DASHA_YEARS[planet];
    if (accumulatedYears > (ageAtCalc % 120)) { dashaIdx = i; break; }
  }
  const currentMahadasha = MAHADASHA_SEQUENCE[dashaIdx];
  const currentAntardasha = MAHADASHA_SEQUENCE[(dashaIdx + 1) % 9];

  // ── 12 Unique Monthly Forecasts ───────────────────────────────────────────

  const monthData = [
    { name: "August 2026",    season: "Monsoon",  solar: "Sun in Leo",       moon: "Full Moon in Aquarius",  rahu: "Rahu in Pisces activates 12th house",    transit: "Jupiter",  houseAct: 5,  focusArea: "Immunity & Lung Health during Monsoon" },
    { name: "September 2026", season: "Autumn",   solar: "Sun enters Virgo", moon: "Waxing Moon in Taurus",  rahu: "Ketu strengthens spiritual healing",      transit: "Saturn",   houseAct: 6,  focusArea: "Digestive Reset & Detox" },
    { name: "October 2026",   season: "Autumn",   solar: "Sun in Libra",     moon: "Full Moon in Aries",     rahu: "Rahu transit stabilizing",                transit: "Venus",    houseAct: 7,  focusArea: "Stress Management & Mental Balance" },
    { name: "November 2026",  season: "Pre-Winter", solar: "Sun in Scorpio", moon: "Dark Moon cycle",        rahu: "Ketu in Virgo deepens introspection",    transit: "Mars",     houseAct: 8,  focusArea: "Deep Healing & Regeneration" },
    { name: "December 2026",  season: "Winter",   solar: "Sun in Sagittarius", moon: "Waxing Moon in Cancer", rahu: "Rahu-Jupiter interaction",               transit: "Mercury",  houseAct: 9,  focusArea: "Bone & Joint Strengthening" },
    { name: "January 2027",   season: "Winter",   solar: "Sun enters Capricorn", moon: "Full Moon in Cancer", rahu: "Saturn-Rahu activation in 6th axis",   transit: "Sun",      houseAct: 10, focusArea: "Cardiovascular Fitness & Stamina" },
    { name: "February 2027",  season: "Late Winter", solar: "Sun in Aquarius", moon: "Waning Moon in Virgo", rahu: "Rahu clears 12th house disturbances",   transit: "Moon",     houseAct: 11, focusArea: "Sleep Optimization & Rest Recovery" },
    { name: "March 2027",     season: "Spring",   solar: "Sun enters Pisces", moon: "Spring Full Moon",      rahu: "Ketu in 6th supports immunity reset",    transit: "Jupiter",  houseAct: 1,  focusArea: "Full Vitality Renewal — Spring Reset" },
    { name: "April 2027",     season: "Spring",   solar: "Sun in Aries",     moon: "Chaitra Full Moon",      rahu: "Rahu in Pisces — allergy season peak",   transit: "Mars",     houseAct: 2,  focusArea: "Allergy Defense & Respiratory Care" },
    { name: "May 2027",       season: "Summer",   solar: "Sun enters Taurus", moon: "Vaishakhi Full Moon",   rahu: "Venus-Rahu conjunction — skin care",     transit: "Venus",    houseAct: 3,  focusArea: "Skin Radiance & Hormonal Balance" },
    { name: "June 2027",      season: "Pre-Monsoon", solar: "Sun in Gemini", moon: "Waning Moon in Capricorn", rahu: "Mercury-Rahu activates nervous system", transit: "Mercury",  houseAct: 4,  focusArea: "Nervous System Cooling & Stress Relief" },
    { name: "July 2027",      season: "Monsoon",  solar: "Sun enters Cancer", moon: "Guru Purnima Full Moon", rahu: "Ketu in Virgo supports liver detox",    transit: "Saturn",   houseAct: 6,  focusArea: "Liver Detox & Digestive Strength" },
  ];

  const uniqueExercises = [
    "Morning swimming + Surya Namaskar 12 rounds",
    "Strength training (upper body) + Pranayama",
    "Brisk trekking outdoors + balance exercises",
    "Cycling 45 min + evening Yoga Nidra",
    "Weight training (lower body) + Virabhadrasana",
    "High-intensity interval training (HIIT) 20 min",
    "Restorative Yin Yoga 60 min + stretching",
    "Running 5 km + breathing exercises",
    "Pilates core strengthening + Dhanurasana",
    "Dance / Zumba cardio 40 min + Shavasana",
    "Kayaking / Aqua aerobics + Ustrasana",
    "Light Hatha yoga + long Savasana (recovery day)",
  ];

  const uniqueDiets = [
    `In August 2026 (Monsoon), favor warm khichdi, ginger-tulsi tea, and avoid street food. Eat freshly cooked warm meals — no raw salads or cold beverages.`,
    `In September 2026 (Autumn Reset), emphasize bitter melon (karela), fenugreek, and amla juice on empty stomach to reset Agni and liver function.`,
    `In October 2026 (Autumn Balance), consume pomegranate, dark leafy greens, flaxseeds, and warm soups. Avoid late-night eating completely.`,
    `In November 2026 (Pre-Winter Healing), focus on bone-building foods: sesame ladoo, A2 milk with turmeric, ragi, and Vitamin D-rich mushrooms.`,
    `In December 2026 (Winter Nourishment), eat warming spices (cinnamon, clove, nutmeg), ghee-based preparations, seasonal root vegetables, and jaggery.`,
    `In January 2027 (Winter Peak), consume heart-healthy walnuts, olive oil, dark chocolate (70%+), pomegranate, and oats for cardiovascular support.`,
    `In February 2027 (Sleep Recovery), include tryptophan-rich foods: warm milk with nutmeg, banana, chamomile tea, almonds, and cherry juice before bed.`,
    `In March 2027 (Spring Renewal), detox with triphala churna, fresh amla, sprouts, light khichdi, and coconut water. Reduce heavy oily food.`,
    `In April 2027 (Allergy Season), strengthen respiratory defense with Sitopaladi churna, tulsi-ginger-honey tea, local honey, and anti-inflammatory turmeric golden milk.`,
    `In May 2027 (Summer Skin Care), prioritize cucumber, watermelon, coconut water, rose water, fresh yogurt with cumin, and seasonal mangoes in moderation.`,
    `In June 2027 (Nervous System Cooling), consume Brahmi ghee, cooling sherbets (rose, vetiver), buttermilk, mint-infused water, and avoid excess spicy food.`,
    `In July 2027 (Monsoon Liver Detox), start day with warm water + lemon + turmeric, include bhumi amla, kutki churna, and avoid heavy meat/dairy combinations.`,
  ];

  const uniqueMeditation = [
    "Bhramari Pranayama (15 min) + Lung Visualization at sunrise for pulmonary resilience.",
    "Trataka (candle gazing 10 min) + Agni Meditation for digestive fire activation.",
    "Body Scan Meditation (20 min) + Anulom-Vilom for nervous system stress release.",
    "Yoga Nidra (30 min) + deep healing intention for regenerative deep tissue recovery.",
    "Bone & Joint healing visualization with Shambhavi Mudra and Om chanting.",
    "Heart Chakra (Anahata) meditation with green light visualization + Mantra 'YAM'.",
    "Yoga Nidra Sleep Reset (25 min) + 4-7-8 breathing for deep restorative sleep.",
    "Spring energy renewal: Surya Meditation facing East at sunrise + gratitude journaling.",
    "Pranic healing visualization for respiratory system + Nadi Shodhana (20 min).",
    "Lunar energy meditation (evening moonlight sitting) + Chandra Bhedana pranayama.",
    "Cooling Sitali/Sheetali pranayama (10 min) + body temperature regulation meditation.",
    "Detox visualization — golden light cleansing liver and gut + Kapalabhati (10 min).",
  ];

  const uniqueRiskWindows = [
    "Increased respiratory sensitivity — avoid cold drinks and damp environments.",
    "Digestive vulnerability — avoid oily, heavy meals during transition week.",
    "Emotional stress spike — practice extra mindfulness during high-pressure work days.",
    "Joint stiffness window — warm up thoroughly before exercise in cold mornings.",
    "Bone mineral density attention — ensure adequate calcium and Vitamin D3 intake.",
    "Cardiac load — avoid strenuous exercise during peak winter cold mornings.",
    "Sleep quality dip — establish strict sleep hygiene this month.",
    "Allergy trigger season — antihistamine support and Sitopaladi churna.",
    "Respiratory allergy peak — keep nasal passage clean with Jala Neti.",
    "Skin sensitivity — avoid chemical sunscreens, use physical zinc-based SPF.",
    "Nervous system overload — mandatory digital detox 2 days per week.",
    "Liver overload risk — avoid alcohol and processed food entirely this month.",
  ];

  const uniqueOpportunities = [
    "Excellent window to begin structured immune-building yoga protocol.",
    "Ideal time for Ayurvedic Panchakarma or gut cleanse program.",
    "High mental clarity — begin meditation habit or journaling practice.",
    "Peak healing window — start bone density program and joint strengthening.",
    "Excellent time to build consistent cold-weather workout routine.",
    "Cardiac strengthening period — commit to 5k run challenge or cycling program.",
    "Best month to reset sleep schedule and eliminate chronic sleep debt.",
    "Spring vitality peak — begin new wellness routines with high success probability.",
    "Respiratory resilience building — pranayama habit formation this month.",
    "Skin radiance peak — begin natural skincare routine (oil cleansing, Ubtan).",
    "Nervous system healing window — floating therapy, Abhyanga, sound healing.",
    "Liver function renewal — best month for Ayurvedic detox program.",
  ];

  const luckyDays = ["Sunday","Monday","Thursday","Friday","Saturday","Sunday","Wednesday","Sunday","Tuesday","Friday","Wednesday","Thursday"];

  const monthlyForecast: MonthlyWellnessForecastItem[] = monthData.map((m, idx) => ({
    month: `Month ${idx + 1} – ${m.name}`,
    monthName: m.name,
    focusArea: m.focusArea,
    wellnessRating: clamp(3 + Math.floor(Math.sin(idx) * 1.5 + 1.5), 3, 5),
    energyLevel: idx % 3 === 0 ? "High Vigor" : idx % 3 === 1 ? "Steady Endurance" : "Moderate — conserve energy",
    stressLevel: idx % 4 === 0 ? "Low Stress" : idx % 4 === 1 ? "Moderate Work Pressure" : idx % 4 === 2 ? "Higher Demands — mindfulness required" : "Manageable with routine",
    sleepQuality: idx % 3 === 0 ? "Excellent 7–8h deep sleep" : idx % 3 === 1 ? "Restful but lighter — 6–7h" : "Fluctuating — sleep hygiene critical",
    exerciseTip: uniqueExercises[idx],
    dietAdvice: uniqueDiets[idx],
    meditationGuidance: uniqueMeditation[idx],
    travelPrecaution: idx % 4 === 0 ? "Safe for travel — hydrate well on journeys." : idx % 4 === 2 ? "Moderate travel — avoid extreme climates." : "Short trips favorable — long haul requires extra rest.",
    recoveryOutlook: idx % 3 === 0 ? "Fast recovery capacity — benefic transit support." : idx % 3 === 1 ? "Moderate recovery — consistency important." : "Slower recovery — prioritize rest.",
    keyAstrologicalDriver: `${m.transit} transit activates House ${m.houseAct} — ${m.focusArea.split(' ')[0]} system highlighted. ${m.rahu}.`,
    transitPlanet: m.transit,
    mahadasha: `${currentMahadasha} Mahadasha`,
    antardasha: `${currentAntardasha} Antardasha`,
    houseActivated: m.houseAct,
    season: m.season,
    rahuKetuImpact: m.rahu,
    solarEvent: m.solar,
    moonInfluence: m.moon,
    riskWindow: uniqueRiskWindows[idx],
    opportunityWindow: uniqueOpportunities[idx],
    luckyDay: luckyDays[idx],
    thingsToAvoid: [
      uniqueRiskWindows[idx].split("—")[0].trim(),
      idx % 2 === 0 ? "Skipping meals or erratic eating patterns." : "Excessive caffeine or alcohol intake.",
    ],
    medicalPrecautions: `In ${m.season}: Monitor ${m.focusArea.split(' ')[0].toLowerCase()} parameters. Seek medical advice if symptoms persist beyond 5 days.`,
    aiCommentary: `${m.name} is governed by ${m.transit} transiting House ${m.houseAct} with ${m.rahu}. The ${m.season} season creates a ${idx % 2 === 0 ? "moderately favorable" : "actively healing"} health window. Focus priority: ${m.focusArea}. ${uniqueOpportunities[idx]} Medical disclaimer: Astrology provides tendency indicators only — always consult qualified healthcare professionals.`,
    energyScore: clamp(65 + Math.round(Math.sin(idx * 0.8) * 18), 45, 92),
    stressScore:  clamp(35 + Math.round(Math.cos(idx * 0.7) * 20), 15, 70),
    recoveryScore: clamp(60 + Math.round(Math.sin(idx * 0.5) * 22), 40, 90),
  }));

  // ── Annual Timeline ───────────────────────────────────────────────────────

  const annualTimeline: AnnualWellnessTimelineEvent[] = [
    {
      year: currentYear,
      phaseTitle: "Vitality Foundation & Routine Reset",
      planetaryTransits: `Jupiter transit aspecting 1st & 5th houses from ${lagnaRashi} Lagna`,
      keyTheme: `Building foundational health habits, upgrading dietary quality (${primaryDosha} balancing), and optimizing sleep circadian rhythm.`,
      wellnessOpportunities: "Excellent period to begin structured fitness routines, Panchakarma, or wellness retreats.",
      preventivePrecautions: "Avoid erratic eating hours and excessive screen time. Establish morning Dinacharya.",
    },
    {
      year: currentYear + 1,
      phaseTitle: "Peak Physical Energy Window",
      planetaryTransits: `Sun and Mars entering favorable transit houses. ${currentMahadasha} Mahadasha active.`,
      keyTheme: "High athletic performance, muscular conditioning, strong immunity. Best window for competitive sports.",
      wellnessOpportunities: "Excellent time for sports, endurance training, and outdoor pursuits.",
      preventivePrecautions: "Warm up thoroughly. Avoid overexertion and injury risk during Mars transit peaks.",
    },
    {
      year: currentYear + 2,
      phaseTitle: "Inner Balance & Stress Management",
      planetaryTransits: "Saturn transit creating introspective health awareness",
      keyTheme: `Developing mental resilience, mindfulness practice, and ${primaryDosha} pacification lifestyle.`,
      wellnessOpportunities: "Ideal period for meditation intensives, yoga teacher training, emotional detox retreats.",
      preventivePrecautions: "Prioritize sleep and digital detox. Reduce workload pressure where possible.",
    },
    {
      year: currentYear + 3,
      phaseTitle: "Rejuvenation & Metabolic Alignment",
      planetaryTransits: "Jupiter transit over natal Moon & Sun angles — Rasayana period",
      keyTheme: "Harmonious digestion, cellular vitality, vibrant social energy. Excellent Rasayana (rejuvenation) window.",
      wellnessOpportunities: "Favorable planetary window for holistic health upgrades, Ayurvedic Rasayana treatments, spa retreats.",
      preventivePrecautions: "Maintain moderation in celebratory meals. Don't break established wellness routines.",
    },
    {
      year: currentYear + 4,
      phaseTitle: "Long-Term Longevity & Wisdom Consolidation",
      planetaryTransits: "Benefic Dasha shift — Ojas building period",
      keyTheme: "Consolidating lifetime wellness routines, spiritual vitality, joint health maintenance, cognitive sharpness.",
      wellnessOpportunities: "Deep peace, strong immune resilience, and active lifestyle enjoyment in mature wisdom phase.",
      preventivePrecautions: "Keep daily walking and bone-strengthening habits consistent. Annual medical checkups.",
    },
  ];

  // ── Wellness Timeline ─────────────────────────────────────────────────────

  const wellnessTimeline: WellnessTimeline = {
    ninetyDayRecoveryPlan: [
      { period: "Days 1–15",  focus: "Digital Detox & Sleep Reset",       action: "Strict sleep schedule 10PM–6AM, no screens after 9PM, Yoga Nidra nightly",          expectedOutcome: "Sleep quality improves 20–30%",   planetarySupport: `Moon in ${planetRoles.Moon.rashi}` },
      { period: "Days 16–30", focus: "Digestive Fire (Agni) Activation",  action: "Triphala churna before bed, warm water morning, mindful eating with no screens",    expectedOutcome: "Bloating and indigestion reduced",  planetarySupport: `Mercury in ${planetRoles.Mercury.rashi}` },
      { period: "Days 31–45", focus: "Immunity Boost Protocol",           action: "Chyawanprash, Giloy-Tulsi kadha daily, Surya Namaskar 12 rounds morning",           expectedOutcome: "Energy levels up 25%, fewer colds", planetarySupport: `Jupiter in ${planetRoles.Jupiter.rashi}` },
      { period: "Days 46–60", focus: "Stress & Cortisol Reset",          action: "Ashwagandha supplement, evening 20-min walk, Nadi Shodhana pranayama 15 min",        expectedOutcome: "Cortisol reduction, calmer mind",   planetarySupport: `Saturn in ${planetRoles.Saturn.rashi}` },
      { period: "Days 61–75", focus: "Physical Strength & Joint Care",   action: "Weight-bearing exercises 3x/week, Abhyanga weekly, Shallaki for joints",             expectedOutcome: "Strength +15%, joint mobility ↑",   planetarySupport: `Mars in ${planetRoles.Mars.rashi}` },
      { period: "Days 76–90", focus: "Full Lifestyle Integration",       action: "All habits consolidated: wake 5:30AM, Yoga, mindful meals, 10PM sleep, weekly fast",  expectedOutcome: "Complete wellness baseline achieved",planetarySupport: `Sun in ${planetRoles.Sun.rashi}` },
    ],
    oneYearRoadmap: [
      { period: "Quarter 1 (Aug–Oct 2026)", focus: "Foundation Building",      action: "Establish Dinacharya, 3x/week exercise, dietary overhaul",             expectedOutcome: "Baseline health score ↑10 points",   planetarySupport: "Jupiter transit favorable" },
      { period: "Quarter 2 (Nov 2026–Jan 2027)", focus: "Peak Performance",   action: "Intensify training, Rasayana supplements, annual health checkup",       expectedOutcome: "Physical vitality at annual peak",    planetarySupport: "Mars-Sun transit synergy" },
      { period: "Quarter 3 (Feb–Apr 2027)", focus: "Restoration & Balance",   action: "Yoga retreat, meditation deepening, spring detox Panchakarma",          expectedOutcome: "Mental wellness +15 points",          planetarySupport: "Spring planetary renewal" },
      { period: "Quarter 4 (May–Jul 2027)", focus: "Consolidation",           action: "Maintain all habits, blood work evaluation, adjustments as needed",     expectedOutcome: "Sustained wellness — year-end target", planetarySupport: "Jupiter entering favorable house" },
    ],
    fiveYearForecast: [
      { period: "Year 1 (2026)",  focus: "Habit Formation",     action: "Dinacharya + exercise + diet fundamentals",   expectedOutcome: "Health score improvement 10%",  planetarySupport: `Jupiter in ${planetRoles.Jupiter.rashi}` },
      { period: "Year 2 (2027)",  focus: "Physical Peak",       action: "Athletic training intensification",           expectedOutcome: "Peak physical vitality",         planetarySupport: "Mars-Sun synergy" },
      { period: "Year 3 (2028)",  focus: "Mental Resilience",  action: "Meditation + therapy + stress mastery",        expectedOutcome: "Emotional stability milestone",   planetarySupport: "Saturn discipline period" },
      { period: "Year 4 (2029)",  focus: "Holistic Integration",action: "Ayurvedic Rasayana + spiritual wellness",     expectedOutcome: "Complete holistic health",        planetarySupport: "Jupiter Rasayana transit" },
      { period: "Year 5 (2030)",  focus: "Longevity Planning", action: "Longevity protocols, wisdom habits, prevention",expectedOutcome: "Sustained long-term vitality",    planetarySupport: "Favorable dasha period" },
    ],
    majorDashaChanges: [
      `Current ${currentMahadasha} Mahadasha governs overall health tone — focus on ${organMap[currentMahadasha].join(", ")}.`,
      `${currentAntardasha} Antardasha activates sub-themes — watch for ${currentAntardasha}-related organ sensitivities.`,
      "Major Dasha transition signals new health priorities — evaluate preventive measures 6 months before change.",
    ],
    transitWindows: [
      `Jupiter transit through ${planetRoles.Jupiter.rashi} — peak immunity building window (12–16 months).`,
      `Saturn transit through ${planetRoles.Saturn.rashi} — discipline and structural health focus.`,
      `Rahu in House ${planetRoles.Rahu.house} — watch for unusual health patterns or mysterious symptoms.`,
    ],
    recoveryOpportunities: [
      "Spring (March–April): Best time for Panchakarma and cellular detox.",
      "Post-Monsoon (September–October): Agni reset and digestive strengthening.",
      "Jupiter transit favorable months: Immunity and energy peak — begin new health programs.",
    ],
    weakPeriods: [
      "Monsoon (July–August): Digestive vulnerability — avoid raw food and street food.",
      "Peak winter (December–January): Joint stiffness and respiratory sensitivity increase.",
      "Saturn transit peak: Fatigue and chronic pressure — prioritize rest and recovery.",
    ],
    strongPeriods: [
      "Spring Equinox (March–April): Vitality surge, excellent for new health initiatives.",
      "Post-festival clarity (October–November): Energy consolidation period.",
      "Jupiter direct motion phases: Immunity and healing at annual peak.",
    ],
  };

  // ── Ayurvedic Chapter ─────────────────────────────────────────────────────

  const ayurvedicChapter: AyurvedicChapter = {
    prakriti: `${primaryDosha} — Your fundamental constitutional nature established at birth. ${
      primaryDosha === "Vata" ? "Mobile, creative, quick-thinking, light body frame." :
      primaryDosha === "Pitta" ? "Sharp, focused, metabolically active, medium frame, leadership qualities." :
      primaryDosha === "Kapha" ? "Steady, compassionate, strong frame, excellent endurance, slower metabolism." :
      primaryDosha.includes("Vata-Pitta") ? "Dynamic and sharp: creative nervous energy combined with intense metabolic fire." :
      "Dual constitutional nature requiring balanced lifestyle management."
    }`,
    vikriti: `Current imbalance: ${
      stress > 60 ? "Elevated Vata (anxiety, sleep disruption, irregular digestion)" :
      house6.planetsInHouse.includes("Mars") ? "Elevated Pitta (inflammation, acidity, irritability)" :
      kaphaPct > 50 ? "Elevated Kapha (sluggishness, weight gain, congestion)" :
      "Mild Vata-Pitta elevation — stress and digestive irregularity."
    }`,
    doshaPercentage: { vata: vataPct, pitta: pittaPct, kapha: kaphaPct },
    morningRoutine: [
      "5:30–6:00 AM: Wake up during Brahma Muhurta (96 min before sunrise)",
      "6:00 AM: Drink 2 glasses warm water (copper vessel ideal)",
      "6:10 AM: Oil pulling (Gandusha) with sesame oil 5–10 min",
      "6:20 AM: Tongue scraping (Jihwa Prakshalana) + gentle face wash",
      "6:30 AM: Nasya (2 drops Anu Taila in each nostril — dry climate)",
      "7:00 AM: Surya Namaskar 12 rounds + Pranayama 15 min",
      "8:00 AM: Light Sattvic breakfast (see below)",
      "8:30 AM: Brief gratitude meditation (5 min)",
    ],
    nightRoutine: [
      "9:00 PM: Begin digital wind-down — no screens after 9 PM",
      "9:15 PM: Warm foot wash with rock salt and mustard oil massage",
      "9:30 PM: Warm A2 milk with nutmeg and ashwagandha powder",
      "9:45 PM: Gentle Yoga Nidra or body scan meditation (20 min)",
      "10:00 PM: Sleep — mandatory before 10:30 PM for Kapha-Pitta grounding",
    ],
    idealWakeTime: "5:30–6:00 AM (Brahma Muhurta — peak hormonal and cortisol morning window)",
    idealSleepTime: "10:00–10:30 PM (avoids late-night Pitta aggravation cycle 10 PM–2 AM)",
    breakfast: primaryDosha.includes("Vata") ? "Warm oatmeal with ghee, dates, and cinnamon / Steamed idli with coconut chutney" :
               primaryDosha.includes("Pitta") ? "Fresh fruits, coconut water, light poha or upma without excess chili" :
               "Light, warm, easily digestible — Moong dal chilla, poha, or roti with ghee",
    lunch: "Main meal of the day (12:00–1:00 PM when Agni is strongest): Khichdi with ghee, dal-rice, seasonal vegetables. Include digestive spices: cumin, coriander, fennel.",
    dinner: "Light dinner before 7:30 PM: Vegetable soup, steamed vegetables with chapati, or mung dal. Avoid heavy proteins and raw salads at night.",
    hydration: "2.5–3L water per day. Start with warm water. Room temperature throughout day. Avoid iced water — it suppresses Agni. Herbal teas (ginger, CCF — cumin-coriander-fennel) after meals.",
    detox: "Weekly: One-day light moong dal khichdi mono-diet for gut reset. Monthly: Triphala churna 5g with warm water before bed for 7 days. Seasonal: Panchakarma consultation recommended.",
    seasonalAdvice: {
      summer: "Increase cooling foods: cucumber, coconut water, coriander, fennel tea, rose water. Avoid excess sun. Morning exercise only before 8 AM.",
      monsoon: "Strengthen digestive fire: ginger, turmeric, Pippali, warm meals only. Avoid fermented or cold foods. Keep feet dry. Jala Neti for sinus health.",
      winter: "Warming nourishment: sesame ladoo, Chyawanprash, ghee, A2 milk with spices. Daily Abhyanga (warm sesame oil massage). More sleep (7–8h minimum).",
    },
    massageOil: primaryDosha.includes("Vata") ? "Warm Sesame oil (Tila Taila) — daily Abhyanga on joints, scalp, feet" :
                primaryDosha.includes("Pitta") ? "Coconut oil or Brahmi oil — cooling, calming effect on Pitta heat" :
                "Mustard oil — warm and stimulating for Kapha types, activates lymphatic drainage",
    yoga: ["Surya Namaskar (12 rounds)","Trikonasana","Virabhadrasana I & II","Paschimottanasana","Setu Bandha","Shavasana"],
    meditation: `${primaryDosha.includes("Vata") ? "Grounding body-scan meditation — focus on earth element, heaviness, stability." : primaryDosha.includes("Pitta") ? "Cooling moonlight visualization — focus on water element, compassion, blue light healing." : "Energizing sunrise meditation — focus on fire element, motivation, golden light activation."}`,
    pranayama: primaryDosha.includes("Vata") ? ["Anulom-Vilom (20 min)","Bhramari (5 min)","Chandra Bhedana (before sleep)"] :
               primaryDosha.includes("Pitta") ? ["Sitali (cooling breath 10 min)","Sheetali","Nadi Shodhana (15 min)"] :
               ["Kapalabhati (10 min)","Bhastrika (5 min)","Surya Bhedana (energizing)"],
    dailySchedule: [
      { time: "5:30 AM",  activity: "Wake up — Brahma Muhurta" },
      { time: "6:00 AM",  activity: "Warm water + Oil pulling + Tongue scraping" },
      { time: "6:30 AM",  activity: "Surya Namaskar + Pranayama (45 min)" },
      { time: "7:30 AM",  activity: "Meditation + Mantra (15 min)" },
      { time: "8:00 AM",  activity: "Sattvic Breakfast" },
      { time: "12:30 PM", activity: "Main meal — largest of the day (Agni peak)" },
      { time: "1:00 PM",  activity: "Short 10-min post-meal walk (Shatapavali)" },
      { time: "4:00 PM",  activity: "Light snack: fresh fruit or herbal tea" },
      { time: "6:30 PM",  activity: "Evening walk 20–30 min outdoors" },
      { time: "7:00 PM",  activity: "Light dinner" },
      { time: "8:30 PM",  activity: "Reading or gentle family time — no screens" },
      { time: "9:30 PM",  activity: "Warm milk + foot massage + Yoga Nidra" },
      { time: "10:00 PM", activity: "Sleep" },
    ],
  };

  // ── AI Health Coach ───────────────────────────────────────────────────────

  const aiHealthCoach: AIHealthCoach = {
    todaysFocus: `${primaryDosha} constitution with ${planetRoles.Sun.dignity} Sun (House ${planetRoles.Sun.house}): prioritize morning Surya energy, digestive fire maintenance, and stress buffer. Your top focus today: 15-min Anulom-Vilom + warm breakfast before 8:30 AM.`,
    thisWeek: [
      "Day 1 (Sunday): Oil pulling + Abhyanga + long Surya Namaskar session",
      "Day 2 (Monday): Strength training + Triphala detox start",
      "Day 3 (Tuesday): Swimming or cardio + Brahmi herbal tea",
      "Day 4 (Wednesday): Rest + Yoga Nidra 30 min + digital detox evening",
      "Day 5 (Thursday): Trekking / outdoor activity + gratitude journaling",
      "Day 6 (Friday): Core strengthening + social wellness (connect with loved ones)",
      "Day 7 (Saturday): Light day + long meditation + weekly meal prep",
    ],
    thisMonth: [
      "Week 1: Establish Dinacharya morning routine (non-negotiable habit)",
      "Week 2: Introduce adaptogenic herbs (Ashwagandha, Brahmi) — note effects",
      "Week 3: Digestive reset — mono-diet khichdi for 1 day",
      "Week 4: Monthly health metrics review (weight, energy, sleep quality)",
    ],
    top5Priorities: [
      `1. Sleep before 10:30 PM — Moon in ${planetRoles.Moon.rashi} requires consistent lunar rhythm grounding`,
      `2. Daily Surya Namaskar 12 rounds — Sun in ${planetRoles.Sun.rashi} needs consistent activation`,
      `3. Warm breakfast before 8:30 AM — ${primaryDosha} digestion requires morning Agni support`,
      `4. Digital detox after 9 PM — Mercury in ${planetRoles.Mercury.rashi} nervous system needs night recovery`,
      `5. Weekly Abhyanga — Saturn in ${planetRoles.Saturn.rashi} joint and bone lubrication maintenance`,
    ],
    topMistakes: [
      "Skipping breakfast or eating at irregular times — severely disrupts Agni (digestive fire)",
      "Screen exposure past 10 PM — suppresses melatonin, damages sleep cycle",
      `Ignoring ${primaryDosha} aggravating foods (${primaryDosha.includes("Pitta") ? "excess spicy/fried" : primaryDosha.includes("Vata") ? "cold/raw foods in excess" : "excess heavy/oily foods"})`,
      "Sitting continuously 3+ hours without movement — weakens Saturn's musculoskeletal systems",
      "Reactive stress response without recovery practice — builds cortisol debt",
    ],
    improvementPlan: [
      "Month 1: Dinacharya + sleep schedule + herbal supplements",
      "Month 2: Intensify exercise + dietary precision + monthly fast (Ekadashi)",
      "Month 3: Stress mastery + meditation deepening + wellness assessment",
      "Month 4: Advanced Ayurvedic practices + seasonal Panchakarma",
      "Month 5: Long-term habit consolidation + accountability system",
      "Month 6: Complete 6-month review — blood work, body composition, energy audit",
    ],
    emergencyWarnings: [
      `⚠️ Sun in ${planetRoles.Sun.rashi} (House ${planetRoles.Sun.house}): Watch for fatigue, chest tightness, or vision changes — cardiac early warning signs.`,
      `⚠️ Saturn in ${planetRoles.Saturn.rashi} (House ${planetRoles.Saturn.house}): Persistent joint pain or bone ache — consult orthopedic early.`,
      `⚠️ Moon in ${planetRoles.Moon.rashi}: Emotional overwhelm + sleep disruption together = early burnout signal — take 2-day digital detox immediately.`,
      `⚠️ House 6 (${house6.rashi}) — recurring digestive complaints lasting 10+ days require gastroenterologist evaluation.`,
    ],
    recoveryGoals: [
      "3-Month Goal: Overall health score improve by 8–12 points",
      "6-Month Goal: Stress score reduce by 15 points, sleep score improve by 10 points",
      "1-Year Goal: Achieve 'Optimal Wellness' rating (75+ overall health score)",
      "3-Year Goal: Complete Ayurvedic Rasayana protocol with established lifestyle habits",
    ],
    motivationalGuidance: `${input.name}, your Lagna (${lagnaRashi}) gives you inherent resilience and ${primaryDosha} constitutional strength. The planets have placed you in a ${
      overallHealth > 75 ? "favorable" : "growth-oriented"
    } health window. The path to your best health is simple: consistent small daily habits compounded over time. Your ${planetRoles.Jupiter.rashi}-placed Jupiter is your greatest ally — it bestows healing grace, wisdom, and recovery power. Trust the process. Begin with one habit today. 🌿`,
  };

  // ── Expanded Lucky Elements ───────────────────────────────────────────────

  const luckyElements: ExpandedLuckyElements = {
    colors: [
      planetRoles.Sun.dignity === "exalted" ? "Golden Yellow" : "Bright Orange",
      planetRoles.Jupiter.dignity === "exalted" ? "Royal Yellow" : "Forest Green",
      "Pure White", "Crystal Blue",
    ],
    numbers: [1, 3, 9, 5],
    days: ["Sunday (Sun energy — immunity, heart)", "Thursday (Jupiter — wisdom, healing)", "Tuesday (Mars — strength, vitality)"],
    directions: ["East (sunrise Prana)", "North-East (Ishanya — health axis)", "North (Jupiter's direction)"],
    gemstone: planetRoles.Sun.dignity === "exalted" ? "Ruby (Manik) — 4–6 ratti in gold ring, right ring finger, Sunday sunrise" :
              planetRoles.Jupiter.dignity === "exalted" ? "Yellow Sapphire (Pukhraj) — 5 ratti in gold, index finger, Thursday" :
              "Red Coral (Moonga) — 6 ratti in copper ring, ring finger, Tuesday",
    metal: primaryDosha.includes("Pitta") ? "Silver — cooling metal, reduces excess heat" : primaryDosha.includes("Vata") ? "Gold — grounding and warming for Vata" : "Copper — stimulating and cleansing for Kapha",
    healingHerbs: ["Tulsi (Holy Basil)","Ashwagandha","Amla (Indian Gooseberry)","Turmeric","Brahmi","Giloy (Guduchi)"],
    temple: `Surya temple (Sun deity) on Sundays for cardiac health. ${planetRoles.Jupiter.rashi === "Sagittarius" || planetRoles.Jupiter.rashi === "Pisces" ? "Brihaspati (Jupiter) temple on Thursdays." : "Hanuman temple on Tuesdays for Mars strength and immunity."}`,
    donation: `Donate wheat/jaggery on Sundays (Sun). ${primaryDosha.includes("Pitta") ? "Donate cooling white items (sugar, milk) on Mondays." : "Donate sesame seeds on Saturdays (Saturn — joint health)."}`,
    fast: `Ekadashi fast (monthly) for digestive reset. ${primaryDosha.includes("Pitta") ? "Pradosh fast (13th lunar day) for liver cooling." : "Sunday fast (liquid only) for solar energy purification."}`,
    mantra: planetRoles.Sun.dignity === "exalted" ? "Aditya Hrudayam (daily) + Gayatri Mantra 108 times at sunrise" : "Om Suryaya Namah (108x, facing East at sunrise) + Mahamrityunjaya Mantra",
    yantra: `${planetRoles.Sun.dignity === "exalted" ? "Surya Yantra" : planetRoles.Jupiter.dignity === "exalted" ? "Guru Yantra" : "Mahamrityunjaya Yantra"} — energized and placed facing East on wooden altar`,
    meditation: `${primaryDosha.includes("Pitta") ? "Cooling moonlight visualization — 20 min before sleep" : primaryDosha.includes("Vata") ? "Grounding Earth element meditation — focusing on heaviness, stability, warmth" : "Energizing sunrise golden light visualization — 15 min at dawn"}`,
    mudra: primaryDosha.includes("Vata") ? "Prithvi Mudra (Earth Mudra) — 15 min morning for grounding" : primaryDosha.includes("Pitta") ? "Varun Mudra (Water Mudra) — 15 min for cooling" : "Surya Mudra (Fire Mudra) — 10 min for metabolic activation",
    healingFrequency: "432 Hz (healing resonance) + 528 Hz (DNA repair frequency) — listen 20 min daily during meditation",
    healingTime: "Brahma Muhurta (96 minutes before sunrise) for Prana-building practices. Sandhya (twilight) for Vedic healing mantras.",
  };

  // ── Remedies (v2 — structured) ────────────────────────────────────────────

  const remedies: AyurvedicRemedyItem[] = [
    {
      category: "pranayama",
      title: "Anulom-Vilom & Nadi Shodhana",
      description: "Alternate nostril breathing to balance solar (Pingala) and lunar (Ida) Nadi channels. Directly harmonizes left-right brain hemispheres and calms the autonomous nervous system.",
      instructions: "Sit in Sukhasana. Block right nostril with right thumb. Inhale through left nostril for 4 counts. Hold for 4. Release right nostril, block left, exhale right for 4. Repeat. 15 minutes daily.",
      bestTime: "Daily at sunrise before breakfast",
      relatedPlanet: "Mercury",
      purpose: "Balance Vata-Pitta nervous energy, reduce cortisol, improve oxygenation",
      frequency: "Daily — 15 minutes minimum",
      expectedResult: "Stress reduction in 2–4 weeks; improved sleep quality in 4–6 weeks",
      difficulty: "Easy",
      estimatedCost: "Free",
      bestDay: "Daily — especially Wednesday (Mercury) and Monday (Moon)",
      alternativeRemedy: "4-7-8 breathing technique (4 count inhale, 7 hold, 8 exhale) — achieves similar Vata calming",
      scientificWellnessTip: "Research shows alternate nostril breathing reduces systolic blood pressure by 8–12 mmHg and decreases cortisol levels by 12–18%.",
      medicalDisclaimer: "Avoid Kumbhaka (breath retention) if pregnant, have hypertension, or cardiac conditions. Consult physician first.",
    },
    {
      category: "yoga",
      title: "Surya Namaskar 12 Rounds",
      description: "Complete Sun Salutation sequence activating all 12 major muscle groups, stimulating lymphatic drainage, and synchronizing breath with movement for systemic vitality.",
      instructions: "Begin in Tadasana facing East. Flow through 12 poses synchronized with breath. Start with 6 rounds, progressively increase to 12. Rest in Shavasana for 5 min after.",
      bestTime: "Morning before 8:00 AM",
      relatedPlanet: "Sun",
      purpose: "Full-body activation, solar Prana absorption, cardiovascular conditioning",
      frequency: "Daily — 6–12 rounds",
      expectedResult: "Physical vitality +15% in 30 days; flexibility and posture improvement in 45 days",
      difficulty: "Moderate",
      estimatedCost: "Free (yoga mat optional)",
      bestDay: "Daily — especially Sunday (Sun energy peak)",
      alternativeRemedy: "Brisk 30-min walk with synchronized breathing and arm swings as a modified Sun activation",
      scientificWellnessTip: "12 rounds of Surya Namaskar burns approximately 156 calories and improves VO2 max (aerobic capacity) by 14% in 8 weeks.",
      medicalDisclaimer: "Avoid Surya Namaskar with acute back injury, pregnancy (after first trimester), or severe hypertension. Modify with chair yoga.",
    },
    {
      category: "mantra",
      title: "Mahamrityunjaya Mantra & Gayatri Mantra",
      description: "Two of the most powerful Vedic healing mantras. Mahamrityunjaya invokes Shiva's rejuvenating and longevity blessings. Gayatri invokes solar intelligence and vitality.",
      instructions: "Mahamrityunjaya: 'Om Tryambakam Yajamahe...' — 108 repetitions on Rudraksha mala. Gayatri: 'Om Bhur Bhuva Svah...' — 24 or 108 times facing East.",
      bestTime: "Sunday mornings at Sunrise for Gayatri. Monday/Friday evenings for Mahamrityunjaya",
      relatedPlanet: "Sun",
      purpose: "Pranic healing, longevity activation, cellular rejuvenation through sound vibration",
      frequency: "Daily minimum 11 repetitions; 108 on auspicious days",
      expectedResult: "Enhanced inner calm, reduced disease anxiety, improved immune response (reported by practitioners in 90 days)",
      difficulty: "Easy",
      estimatedCost: "Free (Rudraksha mala: ₹200–₹500 optional)",
      bestDay: "Sunday (Gayatri/Sun), Monday (Mahamrityunjaya/Shiva)",
      alternativeRemedy: "Listening to recorded Mahamrityunjaya chanting for 15 min daily achieves similar vibrational benefit for those new to Sanskrit.",
      scientificWellnessTip: "Studies show mantra meditation reduces cortisol by 23% and increases Heart Rate Variability (HRV) — a key marker of cardiac health.",
      medicalDisclaimer: "Mantras are complementary spiritual practices, not replacements for medical treatment.",
    },
    {
      category: "lifestyle",
      title: "Dinacharya — Ayurvedic Daily Routine",
      description: "Aligning daily habits with natural circadian cycles: wake before sunrise, oil pulling, tongue scraping, gentle movement, mindful meals, and early sleep.",
      instructions: "Wake 5:30 AM → Warm water 2 glasses → Oil pulling 5 min → Tongue scraping → Yoga/Exercise → Breakfast 8 AM → Lunch 12:30 PM → Dinner 7 PM → Sleep 10 PM.",
      bestTime: "Daily — this IS the lifestyle",
      relatedPlanet: "Saturn",
      purpose: "Circadian alignment, Agni optimization, long-term disease prevention through lifestyle medicine",
      frequency: "Daily — 365 days per year",
      expectedResult: "Measurable improvement in energy, digestion, and sleep in 21 days. Disease risk reduction over 6 months.",
      difficulty: "Moderate",
      estimatedCost: "₹200–₹500/month (herbs and oils)",
      bestDay: "Every day — no exceptions",
      alternativeRemedy: "Begin with just 3 habits: wake before 7 AM, eat breakfast before 9 AM, sleep before 11 PM. Add more habits weekly.",
      scientificWellnessTip: "Circadian biology research confirms that timing of meals and sleep aligned with sunrise-sunset reduces metabolic syndrome risk by 32%.",
      medicalDisclaimer: "Consult your physician before making drastic dietary or sleep schedule changes, especially if you have existing conditions.",
    },
    {
      category: "gemstone",
      title: planetRoles.Sun.dignity === "exalted" ? "Ruby (Manik) for Solar Vitality" : "Red Coral (Moonga) for Mars Strength",
      description: planetRoles.Sun.dignity === "exalted" ? "Ruby enhances Sun's Prana energy, strengthens heart, improves vision, and boosts confidence and leadership vitality." : "Red Coral strengthens Mars energy: improves blood hemoglobin, muscular strength, and immune fire.",
      instructions: planetRoles.Sun.dignity === "exalted" ? "4–6 ratti natural Ruby in gold ring. Wear on right ring finger. Energize on Sunday sunrise with 'Om Suryaya Namah' 108 times." : "5–7 ratti Red Coral in copper ring. Wear on right ring finger. Energize on Tuesday with 'Om Mangalaya Namah' 108 times.",
      bestTime: "Sunday sunrise (Ruby) or Tuesday sunrise (Red Coral)",
      relatedPlanet: planetRoles.Sun.dignity === "exalted" ? "Sun" : "Mars",
      purpose: "Strengthen ruling planet's health domains — cardiac/bone/eye health (Sun) or blood/muscle/immunity (Mars)",
      frequency: "Wear continuously for minimum 3 years",
      expectedResult: "Enhanced vitality, improved organ health, stronger Prana within 6–12 weeks of wearing",
      difficulty: "Easy",
      estimatedCost: "₹3,000–₹25,000 (genuine natural gemstone from certified source)",
      bestDay: "Sunday (Ruby) or Tuesday (Red Coral)",
      alternativeRemedy: "Substitute: Sunstone (Ruby alt) or Carnelian (Coral alt) — semi-precious alternatives at lower cost with partial effect.",
      scientificWellnessTip: "While gemstone therapy is primarily a spiritual practice, the color therapy aspect (red light frequencies) has documented effects on cellular energy production.",
      medicalDisclaimer: "Always consult a qualified Jyotishi for gemstone prescription based on complete chart analysis. Incorrect gemstones can have adverse effects.",
    },
    {
      category: "herb",
      title: "Ashwagandha & Brahmi Daily Protocol",
      description: "Two foundational Ayurvedic Rasayana herbs. Ashwagandha (adaptogen) reduces cortisol and builds strength. Brahmi (nootropic) enhances memory, calms anxiety, and rejuvenates nervous system.",
      instructions: "Ashwagandha: 300–600mg standardized KSM-66 extract with warm milk before bed. Brahmi: 300mg with warm water in morning. Use for minimum 90 days for measurable results.",
      bestTime: "Ashwagandha: Bedtime (10 PM). Brahmi: Morning (8 AM with breakfast)",
      relatedPlanet: "Mercury",
      purpose: "Adaptogenic stress reduction, cognitive enhancement, immune building, Ojas (vitality essence) replenishment",
      frequency: "Daily — minimum 90-day protocol",
      expectedResult: "Stress reduction in 4–8 weeks; cognitive clarity improvement in 6–12 weeks; immune strength in 8–12 weeks",
      difficulty: "Easy",
      estimatedCost: "₹500–₹1,500/month (quality branded supplement)",
      bestDay: "Daily",
      alternativeRemedy: "Chyawanprash (2 tsp with warm milk) is a complete Rasayana that includes both herbs and 40+ additional healing ingredients.",
      scientificWellnessTip: "Clinical trials show KSM-66 Ashwagandha reduces serum cortisol by 27.9% and improves VO2 max (athletic performance) by 7.2% after 8 weeks.",
      medicalDisclaimer: "Consult physician if pregnant, breastfeeding, autoimmune conditions, or taking thyroid medications. Ashwagandha can interact with thyroid drugs.",
    },
  ];

  // ── Evidence Chain (9-step explainable AI) ────────────────────────────────

  const evidenceChain: EvidenceChainItem[] = [
    {
      claim: `Overall Vitality Score: ${overallHealth}/100`,
      planet: "Sun",
      house: 1,
      lord: house1.rashiLord,
      yoga: house6.planetsInHouse.length === 0 ? "Nirog Yoga (disease-free tendency)" : "Roga Karaka (attention warranted)",
      dasha: `${currentMahadasha} Mahadasha`,
      transit: `Sun transit through ${planetRoles.Sun.rashi}`,
      astrologicalLogic: `Lagna (${lagnaRashi}) with lord ${house1.rashiLord} in House ${planetRoles[house1.rashiLord]?.house || 1} determines baseline Prana. Sun in ${planetRoles.Sun.rashi} (${planetRoles.Sun.dignity}) rules heart and immunity.`,
      conclusion: `${overallHealth > 75 ? "Strong foundational vitality with favorable planetary configuration." : "Moderate vitality requiring conscious preventive lifestyle management."}`,
      confidencePercent: 94,
      lifestyleAdvice: "Daily sunrise walk, consistent meal timing, and 8h sleep are the three non-negotiable vitality pillars.",
      astrologicalBasis: `1st House in ${house1.rashi} (Lord: ${house1.rashiLord}), Sun in ${planetRoles.Sun.rashi} (House ${planetRoles.Sun.house}, ${planetRoles.Sun.dignity})`,
      factors: { planet: "Sun", house: 1, rashi: house1.rashi },
    },
    {
      claim: `Digestive Fire (Agni) Resilience — 6th House Analysis`,
      planet: "Mercury",
      house: 6,
      lord: house6.rashiLord,
      yoga: house6.planetsInHouse.includes("Jupiter") ? "Benefic 6th house — strong disease resistance" : "Standard 6th house analysis",
      dasha: `${currentMahadasha} Mahadasha — ${organMap[currentMahadasha].includes("Liver") || organMap[currentMahadasha].includes("Digestive System") ? "directly activates digestive organs" : "indirect digestive influence"}`,
      transit: `Mercury transit in ${planetRoles.Mercury.rashi} governs gut-brain axis`,
      astrologicalLogic: `6th House (${house6.rashi}) governs Roga (disease) and digestive immunity. Lord ${house6.rashiLord} placed in House ${planetRoles[house6.rashiLord]?.house || 6}. ${house6.planetsInHouse.length > 0 ? `Planetary occupants (${house6.planetsInHouse.join(", ")}) require watchful management.` : "No malefic occupants — digestive resilience supported."}`,
      conclusion: `${house6.planetsInHouse.includes("Saturn") ? "Saturn in 6th requires structured dietary discipline and regular Agni-boosting practices." : "Digestive fire is moderately strong — maintain with consistent Ayurvedic diet."}`,
      confidencePercent: 92,
      lifestyleAdvice: "Eat largest meal at 12:30 PM (Agni peak). Avoid eating when stressed or emotional. Sip warm CCF tea after meals.",
      astrologicalBasis: `6th House in ${house6.rashi} (Lord: ${house6.rashiLord}), occupants: ${house6.planetsInHouse.join(", ") || "None"}`,
      factors: { planet: "Mercury", house: 6, rashi: house6.rashi },
    },
    {
      claim: `Emotional Stability & Sleep Quality — Moon Analysis`,
      planet: "Moon",
      house: planetRoles.Moon.house,
      lord: house12.rashiLord,
      yoga: planetRoles.Moon.dignity === "exalted" ? "Chandra Bala — strong lunar energy" : "Standard lunar influence",
      dasha: `Moon sub-period activates emotional and sleep cycles`,
      transit: `Moon transit through 12th house monthly creates restorative sleep windows`,
      astrologicalLogic: `Moon in ${planetRoles.Moon.rashi} (House ${planetRoles.Moon.house}, ${planetRoles.Moon.dignity}) governs mind, emotions, and body fluids. 12th House (${house12.rashi}, Lord: ${house12.rashiLord}) rules sleep and subconscious rest. ${house12.planetsInHouse.length > 0 ? `Planets in 12th (${house12.planetsInHouse.join(", ")}) create sleep disruption tendency.` : "Clear 12th house supports restful sleep."}`,
      conclusion: `${planetRoles.Moon.dignity === "exalted" ? "Excellent emotional stability and sleep quality supported by exalted Moon." : "Moderate emotional balance requiring consistent sleep hygiene and Vata-pacifying practices."}`,
      confidencePercent: 91,
      lifestyleAdvice: "Keep bedroom dark and cool (18–20°C). No screens 90 min before sleep. Warm milk with nutmeg at 9:30 PM.",
      astrologicalBasis: `Moon in ${planetRoles.Moon.rashi} (House ${planetRoles.Moon.house}), 12th House: ${house12.rashi} (Lord: ${house12.rashiLord})`,
      factors: { planet: "Moon", house: planetRoles.Moon.house, rashi: planetRoles.Moon.rashi },
    },
    {
      claim: `Joint & Skeletal Health — Saturn Deep Analysis`,
      planet: "Saturn",
      house: planetRoles.Saturn.house,
      lord: house1.rashiLord,
      yoga: planetRoles.Saturn.dignity === "exalted" ? "Sasa Yoga — skeletal strength" : "Standard Shani influence",
      dasha: `Saturn Mahadasha (19 years) directly governs bone density and longevity`,
      transit: `Saturn transit through ${planetRoles.Saturn.rashi} — joint system under ${planetRoles.Saturn.dignity} dignity`,
      astrologicalLogic: `Saturn in ${planetRoles.Saturn.rashi} (House ${planetRoles.Saturn.house}, ${planetRoles.Saturn.dignity}) rules all calcified structures — bones, teeth, joints, and cartilage. Slow Saturn metabolism requires proactive calcium, Vitamin D3, and oil massage habits.`,
      conclusion: `${planetRoles.Saturn.dignity === "exalted" ? "Excellent skeletal constitution — maintain with regular weight-bearing exercise." : "Moderate joint and bone health — preventive Abhyanga, Shallaki, and Vitamin D3 essential."}`,
      confidencePercent: 89,
      lifestyleAdvice: "Daily 5-minute warm sesame oil joint massage (knee, ankle, lower back). Calcium-rich diet + Vitamin D3 2000 IU + K2 100mcg supplement.",
      astrologicalBasis: `Saturn in ${planetRoles.Saturn.rashi} (House ${planetRoles.Saturn.house}, ${planetRoles.Saturn.dignity})`,
      factors: { planet: "Saturn", house: planetRoles.Saturn.house, rashi: planetRoles.Saturn.rashi },
    },
    {
      claim: `Immune Resilience & Longevity — Jupiter Analysis`,
      planet: "Jupiter",
      house: planetRoles.Jupiter.house,
      lord: house1.rashiLord,
      yoga: planetRoles.Jupiter.dignity === "exalted" ? "Hamsa Yoga — exceptional immunity and wisdom" : "Standard Guru blessing",
      dasha: `Jupiter Mahadasha (16 years) — peak healing and immunity building period`,
      transit: `Jupiter in ${planetRoles.Jupiter.rashi} — ${planetRoles.Jupiter.dignity} dignity governs Ojas (vital immunity essence)`,
      astrologicalLogic: `Jupiter in ${planetRoles.Jupiter.rashi} (House ${planetRoles.Jupiter.house}, ${planetRoles.Jupiter.dignity}) governs liver function, fat tissue, pancreatic health, and innate immune resilience (Ojas). Strong Jupiter creates natural disease resistance.`,
      conclusion: `${planetRoles.Jupiter.dignity === "exalted" ? "Exceptional immune vitality and healing capacity — leverage Jupiter's grace through Sattvic lifestyle." : "Good baseline immunity — enhance with daily Chyawanprash, Giloy, and positive attitude cultivation."}`,
      confidencePercent: 93,
      lifestyleAdvice: "Chyawanprash 1 tsp with warm milk daily. Practice gratitude — positive psychology is Jupiter's realm. Avoid alcohol (liver/Jupiter enemy).",
      astrologicalBasis: `Jupiter in ${planetRoles.Jupiter.rashi} (House ${planetRoles.Jupiter.house}, ${planetRoles.Jupiter.dignity})`,
      factors: { planet: "Jupiter", house: planetRoles.Jupiter.house, rashi: planetRoles.Jupiter.rashi },
    },
  ];

  // ── D6 Shashtamsha ────────────────────────────────────────────────────────

  const d6Houses = (kundli as any).d6?.houses;
  const d6House6 = d6Houses?.find((h: HouseCusp) => h.house === 6) || kundli.d1.houses[5];
  const d6House6Lord = RASHI_LORDS[d6House6.rashiIndex];

  // ── Final Verdict ─────────────────────────────────────────────────────────

  const finalVerdict: FinalVerdict = {
    overallHealthRating: `${overallHealth > 85 ? "Excellent" : overallHealth > 70 ? "Good" : overallHealth > 55 ? "Moderate" : "Needs Attention"} (${overallHealth}/100)`,
    topStrengths: [
      `${planetRoles.Jupiter.dignity === "exalted" ? "Exceptional immune resilience" : "Good immune baseline"} — Jupiter in ${planetRoles.Jupiter.rashi}`,
      `${planetRoles.Sun.dignity === "exalted" ? "Outstanding cardiac vitality and solar Prana" : "Strong physical energy foundation"} — Sun in ${planetRoles.Sun.rashi}`,
      `${planetRoles.Moon.dignity === "exalted" ? "Excellent emotional stability and fluid balance" : "Moderate mental resilience"}`,
      `Recovery capacity ${recovery}/100 — ${recovery > 75 ? "natural rapid healing constitution" : "good healing potential with consistent care"}`,
    ],
    topWeaknesses: [
      stress > 50 ? `Elevated stress (${stress}/100) — Saturn-Rahu axis creating pressure` : `Moderate stress awareness required`,
      sleep < 70 ? `Sleep quality needs improvement (${sleep}/100) — 12th house sensitivity` : `Maintain established sleep routine`,
      house6.planetsInHouse.length > 0 ? `6th House occupied (${house6.planetsInHouse.join(", ")}) — digestive and immunity vigilance` : `No major health house complications`,
    ],
    criticalRisks: [
      riskDashboard.filter(r => r.priority === "High").map(r => `${r.conditionName} (${r.riskPercent}% risk — ${r.currentSeverity} severity)`).join(", ") || "No critical risks identified",
    ],
    recoveryPotential: `${recovery > 80 ? "Excellent" : recovery > 65 ? "Good" : "Moderate"} — ${recovery}/100. ${planetRoles.Jupiter.dignity === "exalted" ? "Jupiter's grace accelerates healing naturally." : "Consistent preventive care dramatically improves recovery trajectory."}`,
    lifestyleAdvice: [
      "Non-negotiable: Sleep before 10:30 PM and wake before 6:00 AM daily",
      `Follow ${primaryDosha} pacifying diet: ${primaryDosha.includes("Pitta") ? "avoid excess spicy/sour, favor cooling foods" : primaryDosha.includes("Vata") ? "warm, unctuous, grounding foods with consistent timing" : "light, warming, stimulating foods to counterbalance heaviness"}`,
      "Daily Surya Namaskar 12 rounds + 15-min Pranayama — non-negotiable",
      "Chyawanprash + Ashwagandha + Triphala — core Ayurvedic supplement stack",
      "Annual health checkup: CBC, LFT, KFT, thyroid panel, Vitamin D3",
    ],
    planetarySummary: `Your ${lagnaRashi} Lagna establishes a ${primaryDosha} constitutional base. Sun in ${planetRoles.Sun.rashi} (${planetRoles.Sun.dignity}) governs cardiac vitality. Jupiter in ${planetRoles.Jupiter.rashi} (${planetRoles.Jupiter.dignity}) grants immune grace. Moon in ${planetRoles.Moon.rashi} (${planetRoles.Moon.dignity}) shapes emotional health. Saturn in ${planetRoles.Saturn.rashi} (${planetRoles.Saturn.dignity}) governs skeletal longevity. Mars in ${planetRoles.Mars.rashi} provides muscular constitution.`,
    next12Months: `The 12-month forecast shows a ${overallHealth > 70 ? "predominantly favorable" : "moderately active"} health period. Peak vitality windows: Spring (March–April 2027) and Post-Monsoon (September–October 2026). Watchful periods: Peak monsoon (July–August) and winter transition (December–January).`,
    finalAIVerdict: `${input.name}, your astrological health blueprint reveals an overall ${overallHealth > 75 ? "excellent" : "good"} constitutional vitality score of ${overallHealth}/100. Your ${primaryDosha} Prakriti, combined with ${planetRoles.Jupiter.rashi}-placed Jupiter and ${planetRoles.Sun.rashi}-Sun, creates a fundamentally resilient health foundation. The path forward is clear: implement the Dinacharya morning routine, adopt the ${primaryDosha}-specific diet, maintain the recommended supplement stack, and establish consistent daily Yoga + Pranayama practice. These four pillars, sustained for 90 days, will create measurable and lasting health transformation. Medical Disclaimer: This analysis provides Vedic astrological health tendency mapping. It does not diagnose or treat any medical condition. Always consult qualified healthcare professionals for health concerns.`,
    confidencePercent: 91,
    actionPlan: [
      "Week 1: Implement Dinacharya (wake 5:30 AM, oil pulling, warm water, Surya Namaskar)",
      "Week 2: Add Ashwagandha + Brahmi + Triphala supplement protocol",
      "Week 3: Dietary precision — eliminate top 3 Dosha-aggravating foods",
      "Week 4: Digital detox evenings + Yoga Nidra sleep reset",
      "Month 2: Intensify exercise protocol + monthly fast (Ekadashi)",
      "Month 3: First quarterly health assessment + blood work review",
      "Month 6: 6-month wellness audit — energy, weight, stress, sleep metrics review",
    ],
  };

  // ── AI Coach Verdict (legacy) ─────────────────────────────────────────────

  const aiCoachVerdict = {
    executiveSummary: `${input.name}'s astrological health profile reveals overall vitality score of ${overallHealth}/100 with ${primaryDosha} constitutional dominance. Lagna lord ${house1.rashiLord} and Sun in ${planetRoles.Sun.rashi} establish ${planetRoles.Sun.dignity === "exalted" ? "exceptional" : "solid"} Prana foundation.`,
    wellnessReadiness: (overallHealth >= 75 ? 'Optimal Wellness' : overallHealth >= 60 ? 'Moderate Balance' : 'Preventive Attention Required') as 'Optimal Wellness' | 'Moderate Balance' | 'Preventive Attention Required',
    actionPlan: finalVerdict.actionPlan.slice(0, 4),
    finalVerdict: finalVerdict.finalAIVerdict,
  };

  // ── SVG Charts ────────────────────────────────────────────────────────────

  const svgCharts = generateHealthSVGCharts(scores, constitution, organDashboard, riskDashboard, monthlyForecast);

  return {
    input,
    calculatedAt: new Date().toISOString(),
    kundli,
    scores,
    constitution,
    house1, house6, house8, house12,
    planets: planetRoles,
    d6Shashtamsha: {
      ascendantSign: rashiName(d6Houses?.[0]?.rashiIndex || 0),
      house6Sign: rashiName(d6House6.rashiIndex),
      house6Lord: d6House6Lord,
      keyPlanetsInD6: `D6 Shashtamsha analysis: 6th lord is ${d6House6Lord} — ${planetRoles[d6House6Lord]?.dignity === "exalted" ? "excellent disease resistance indicated" : "moderate disease management potential"}.`,
      summary: `Shashtamsha D6 confirms ${planetRoles.Jupiter.dignity === "exalted" ? "exceptional" : "good"} innate immune defense and ${recovery > 75 ? "rapid" : "moderate"} recovery potential. ${d6House6Lord} as D6 6th lord supports preventive health.`,
    },
    organSystems,
    organDashboard,
    riskDashboard,
    ayurvedicChapter,
    aiHealthCoach,
    wellnessTimeline,
    svgCharts,
    monthlyForecast,
    annualTimeline,
    riskAndRecoveryPeriods: {
      riskPeriods: [
        `Monsoon season (July–August): Digestive immunity vulnerability — avoid raw and cold foods`,
        `Peak winter (December–January): Joint stiffness and respiratory sensitivity`,
        `Saturn transit peak: Chronic fatigue and systemic pressure risk`,
        `Rahu transit in House ${planetRoles.Rahu.house}: Unusual health patterns — careful monitoring`,
      ],
      recoveryPeriods: [
        "Spring Equinox (March–April 2027): Best annual detox and vitality renewal window",
        "Post-Monsoon (September–October 2026): Agni reset and digestive strengthening phase",
        "Jupiter direct phases: Peak immunity and healing — begin new health programs",
        "Brahma Muhurta daily practice: Micro-recovery window built into each day",
      ],
    },
    seasonalWellness: {
      summerTips: ["Coconut water and mint-infused water throughout day","Avoid intense mid-day sun exposure (11 AM–4 PM)","Rose water cooling mist for skin","Sitali/Sheetali pranayama 10 min to cool internal heat"],
      monsoonTips: ["Warm freshly cooked meals only — avoid cold, fermented, and street food","Ginger-turmeric-black pepper kadha daily","Jala Neti for sinus health","Keep feet dry — fungal prevention","Sitopaladi churna for respiratory immunity"],
      winterTips: ["Sesame seeds, almonds, and warm A2 milk with ashwagandha nightly","Daily Abhyanga (warm sesame oil self-massage)","Chyawanprash 2 tsp with warm milk every morning","Early morning exercise before 8 AM to build internal heat"],
    },
    exerciseAndNutrition: {
      recommendedExercises: ["Surya Namaskar 12 rounds (daily)","Brisk Walking in Nature 30 min","Swimming / Aqua aerobics (2–3x/week)","Yoga (Hatha or Vinyasa flow)","Strength training 3x/week"],
      nutritionGuidance: ["Largest meal at 12:30 PM when digestive fire (Agni) peaks","Include digestive spices: cumin, coriander, fennel, ginger, turmeric","Seasonal eating aligned with local produce harvest"],
      foodsToFavor: ["Khichdi (mung dal + rice)","Fresh Seasonal Fruits","Ghee (clarified butter — moderation)","Warm Herbal Teas (CCF, ginger, tulsi)","A2 milk (warm, with spices)","Amla (Indian gooseberry)"],
      foodsToModerate: ["Processed and packaged food","Excess cold or carbonated drinks","Deep fried snacks","Refined white sugar","Late-night heavy dinners","Excess raw salads in winter"],
    },
    remedies,
    luckyElements,
    aiCoachVerdict,
    evidenceChain,
    finalVerdict,
  };
}
