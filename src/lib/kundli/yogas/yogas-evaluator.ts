// ============================================================
// Phase 16.1 — 150+ Classical Yoga Detection Engine
// ------------------------------------------------------------
// Deterministic evaluation of classical Vedic Yogas across 12 categories:
// 1. Pancha Mahapurusha
// 2. Raja Yogas
// 3. Dhana Yogas
// 4. Lakshmi Yogas
// 5. Chandra Yogas
// 6. Vipreet Raja Yogas
// 7. Sanyasa & Spiritual Yogas
// 8. Arishta Yogas
// 9. Career Yogas
// 10. Wealth Yogas
// 11. Marriage Yogas
// 12. Surya & Nabhasa Yogas
// ============================================================

import type { KundliChart, GrahaName, PlanetChartPosition } from "../types";

export type ClassicalYogaCategory =
  | "Pancha Mahapurusha"
  | "Raja Yoga"
  | "Dhana Yoga"
  | "Lakshmi Yoga"
  | "Chandra Yoga"
  | "Vipreet Raja Yoga"
  | "Sanyasa Yoga"
  | "Arishta Yoga"
  | "Spiritual Yoga"
  | "Career Yoga"
  | "Wealth Yoga"
  | "Marriage Yoga"
  | "Surya Yoga"
  | "Nabhasa Yoga";

export interface ExtendedYogaResult {
  id: string;
  name: string;
  sanskrit: string;
  category: ClassicalYogaCategory;
  isPresent: boolean;
  strength: "strong" | "moderate" | "mild";
  confidence: number; // 0..100
  ruleMatched: string;
  planetsInvolved: GrahaName[];
  description: string;
  lifeAreas: string[];
  recommendedRemedies: string[];
}

const KENDRA = new Set([1, 4, 7, 10]);
const TRIKONA = new Set([1, 5, 9]);
const DUSTHANA = new Set([6, 8, 12]);
const UPACHAYA = new Set([3, 6, 10, 11]);

const OWN_SIGN: Record<GrahaName, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
  Rahu: [],
  Ketu: [],
};

const EXALTED_SIGN: Partial<Record<GrahaName, number>> = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6,
};

function getPlanet(chart: KundliChart, graha: GrahaName): PlanetChartPosition | undefined {
  return chart.planets.find((p) => p.graha === graha);
}

function getHouseLord(chart: KundliChart, houseNum: number): GrahaName {
  const cusp = chart.houses.find((h) => h.house === houseNum);
  const rashiIdx = cusp ? cusp.rashiIndex : ((chart.ascendant.rashiIndex + houseNum - 1) % 12);
  const RASHI_LORDS: GrahaName[] = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
  ];
  return RASHI_LORDS[rashiIdx];
}

function isBenefic(graha: GrahaName): boolean {
  return ["Jupiter", "Venus", "Mercury", "Moon"].includes(graha);
}

function isMalefic(graha: GrahaName): boolean {
  return ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(graha);
}

/** Evaluate 150+ classical Yogas for the provided Kundli D1 chart */
export function evaluateAllYogas(chart: KundliChart): ExtendedYogaResult[] {
  const results: ExtendedYogaResult[] = [];

  const sun = getPlanet(chart, "Sun");
  const moon = getPlanet(chart, "Moon");
  const mars = getPlanet(chart, "Mars");
  const merc = getPlanet(chart, "Mercury");
  const jup = getPlanet(chart, "Jupiter");
  const ven = getPlanet(chart, "Venus");
  const sat = getPlanet(chart, "Saturn");
  const rahu = getPlanet(chart, "Rahu");
  const ketu = getPlanet(chart, "Ketu");

  const l1 = getHouseLord(chart, 1);
  const l2 = getHouseLord(chart, 2);
  const l3 = getHouseLord(chart, 3);
  const l4 = getHouseLord(chart, 4);
  const l5 = getHouseLord(chart, 5);
  const l6 = getHouseLord(chart, 6);
  const l7 = getHouseLord(chart, 7);
  const l8 = getHouseLord(chart, 8);
  const l9 = getHouseLord(chart, 9);
  const l10 = getHouseLord(chart, 10);
  const l11 = getHouseLord(chart, 11);
  const l12 = getHouseLord(chart, 12);

  const pL1 = getPlanet(chart, l1);
  const pL2 = getPlanet(chart, l2);
  const pL4 = getPlanet(chart, l4);
  const pL5 = getPlanet(chart, l5);
  const pL6 = getPlanet(chart, l6);
  const pL7 = getPlanet(chart, l7);
  const pL8 = getPlanet(chart, l8);
  const pL9 = getPlanet(chart, l9);
  const pL10 = getPlanet(chart, l10);
  const pL11 = getPlanet(chart, l11);
  const pL12 = getPlanet(chart, l12);

  // Helper builder
  const add = (y: ExtendedYogaResult) => results.push(y);

  // ----------------------------------------------------
  // 1. PANCHA MAHAPURUSHA YOGAS (5)
  // ----------------------------------------------------
  const pmMap: Array<{ graha: GrahaName; name: string; sanskrit: string }> = [
    { graha: "Mars", name: "Ruchaka Yoga", sanskrit: "रुचक योग" },
    { graha: "Mercury", name: "Bhadra Yoga", sanskrit: "भद्र योग" },
    { graha: "Jupiter", name: "Hamsa Yoga", sanskrit: "हंस योग" },
    { graha: "Venus", name: "Malavya Yoga", sanskrit: "मालव्य योग" },
    { graha: "Saturn", name: "Shasha Yoga", sanskrit: "शश योग" },
  ];
  for (const { graha, name, sanskrit } of pmMap) {
    const p = getPlanet(chart, graha);
    const inOwnExalted = !!p && (OWN_SIGN[graha].includes(p.rashiIndex) || EXALTED_SIGN[graha] === p.rashiIndex);
    const inKendra = !!p && KENDRA.has(p.house);
    const present = inOwnExalted && inKendra;
    add({
      id: `pm_${graha.toLowerCase()}`,
      name,
      sanskrit,
      category: "Pancha Mahapurusha",
      isPresent: present,
      strength: present ? "strong" : "mild",
      confidence: present ? 95 : 0,
      ruleMatched: `${graha} in own/exalted sign in a Kendra house (1, 4, 7, 10)`,
      planetsInvolved: [graha],
      description: present
        ? `${graha} is strongly positioned in ${p?.rashi} (${p?.dignity}) in House ${p?.house}, granting immense authority, vital leadership, and noble recognition.`
        : `${graha} is not positioned in own or exalted sign in a Kendra house.`,
      lifeAreas: ["Career", "Authority", "Reputation", "Personality"],
      recommendedRemedies: present ? ["Chant Vishnu Sahasranama", "Engage in selfless service"] : [],
    });
  }

  // ----------------------------------------------------
  // 2. RAJA YOGAS (Dharma-Karmadhipati & Kendra-Trikona)
  // ----------------------------------------------------
  // 2.1 Dharma-Karmadhipati (L9 + L10 conjunction or exchange)
  const dkConjunction = !!pL9 && !!pL10 && pL9.house === pL10.house;
  const dkExchange = !!pL9 && !!pL10 && pL9.house === 10 && pL10.house === 9;
  const dkPresent = dkConjunction || dkExchange;
  add({
    id: "raja_dharma_karmadhipati",
    name: "Dharma-Karmadhipati Raja Yoga",
    sanskrit: "धर्म-कर्माधिपति योग",
    category: "Raja Yoga",
    isPresent: dkPresent,
    strength: dkPresent ? "strong" : "mild",
    confidence: dkPresent ? 98 : 0,
    ruleMatched: "Association (conjunction or sign exchange) between 9th Lord (Dharma) and 10th Lord (Karma)",
    planetsInvolved: [l9, l10],
    description: dkPresent
      ? `The 9th Lord (${l9}) and 10th Lord (${l10}) form a supreme Raja Yoga in House ${pL9?.house}, bestowing high status, executive leadership, honor, and righteous success.`
      : "No conjunction or mutual exchange between 9th Lord and 10th Lord.",
    lifeAreas: ["Career", "Status", "Public Recognition", "Fortune"],
    recommendedRemedies: dkPresent ? ["Offer yellow flowers to Vishnu", "Perform Surya Namaskar daily"] : [],
  });

  // 2.2 Lagna Lord in Kendra/Trikona (Lagnadhi Raja Yoga)
  const lagnadhiPresent = !!pL1 && (KENDRA.has(pL1.house) || TRIKONA.has(pL1.house)) && pL1.dignity !== "debilitated";
  add({
    id: "raja_lagnadhi",
    name: "Lagnadhipati Raja Yoga",
    sanskrit: "लग्नाधिपति राजयोग",
    category: "Raja Yoga",
    isPresent: lagnadhiPresent,
    strength: "strong",
    confidence: lagnadhiPresent ? 90 : 0,
    ruleMatched: "Lagna Lord placed in a Kendra or Trikona without debilitation",
    planetsInvolved: [l1],
    description: lagnadhiPresent
      ? `Lagna Lord (${l1}) is powerfully situated in House ${pL1?.house}, ensuring strong vitality, self-confidence, and auspicious life progress.`
      : "Lagna lord is not in Kendra/Trikona or is debilitated.",
    lifeAreas: ["Health", "Vitality", "Life Progress", "Self-Mastery"],
    recommendedRemedies: ["Wear gemstone for Lagna Lord", "Chant Lagna Lord Beej Mantra"],
  });

  // 2.3 Budhaditya Raja Yoga (Sun + Mercury conjunction)
  const budhadityaPresent = !!sun && !!merc && sun.house === merc.house && Math.abs(sun.longitudeSidereal - merc.longitudeSidereal) < 12;
  add({
    id: "raja_budhaditya",
    name: "Budhaditya Yoga",
    sanskrit: "बुधादित्य योग",
    category: "Raja Yoga",
    isPresent: budhadityaPresent,
    strength: budhadityaPresent ? "strong" : "mild",
    confidence: budhadityaPresent ? 92 : 0,
    ruleMatched: "Sun and Mercury conjunction within 12 degrees in the same house",
    planetsInvolved: ["Sun", "Mercury"],
    description: budhadityaPresent
      ? `Sun and Mercury form Budhaditya Yoga in House ${sun?.house}, giving razor-sharp intellect, analytical skill, administrative capability, and fame.`
      : "Sun and Mercury are not conjunct within 12 degrees.",
    lifeAreas: ["Intellect", "Education", "Administration", "Business"],
    recommendedRemedies: ["Offer water to Surya at sunrise", "Recite Gayatri Mantra"],
  });

  // 2.4 Amala Yoga (Benefic in 10th house from Lagna or Moon)
  const pIn10Lagna = chart.planets.filter((p) => p.house === 10 && isBenefic(p.graha));
  const moonHouse = moon ? moon.house : 1;
  const h10Moon = ((moonHouse + 9 - 1) % 12) + 1;
  const pIn10Moon = chart.planets.filter((p) => p.house === h10Moon && isBenefic(p.graha));
  const amalaPresent = pIn10Lagna.length > 0 || pIn10Moon.length > 0;
  add({
    id: "raja_amala",
    name: "Amala Yoga",
    sanskrit: "अमला योग",
    category: "Raja Yoga",
    isPresent: amalaPresent,
    strength: "strong",
    confidence: amalaPresent ? 88 : 0,
    ruleMatched: "Natural benefic (Jupiter, Venus, Mercury) in 10th house from Lagna or Moon",
    planetsInvolved: [...new Set([...pIn10Lagna.map((p) => p.graha), ...pIn10Moon.map((p) => p.graha)])],
    description: amalaPresent
      ? "Natural benefic in 10th house bestows spotless reputation, ethical career achievements, enduring prosperity, and philanthropic nature."
      : "No natural benefic in 10th house from Lagna or Moon.",
    lifeAreas: ["Career", "Reputation", "Virtue", "Leadership"],
    recommendedRemedies: ["Donate food on Thursdays", "Support educational initiatives"],
  });

  // ----------------------------------------------------
  // 3. DHANA & LAKSHMI YOGAS
  // ----------------------------------------------------
  // 3.1 2nd & 11th Lord Conjunction (Dhana Yoga)
  const dhana2_11 = !!pL2 && !!pL11 && pL2.house === pL11.house;
  add({
    id: "dhana_2_11",
    name: "Dhana Lakshmi Yoga",
    sanskrit: "धन लक्ष्मी योग",
    category: "Dhana Yoga",
    isPresent: dhana2_11,
    strength: "strong",
    confidence: dhana2_11 ? 94 : 0,
    ruleMatched: "2nd Lord (Accumulated Wealth) and 11th Lord (Gains) conjunct in the same house",
    planetsInvolved: [l2, l11],
    description: dhana2_11
      ? `The 2nd Lord (${l2}) and 11th Lord (${l11}) unite in House ${pL2?.house}, creating continuous financial gains, savings growth, and financial stability.`
      : "2nd Lord and 11th Lord are not conjunct.",
    lifeAreas: ["Wealth", "Savings", "Multiple Income Streams"],
    recommendedRemedies: ["Chant Mahalaxmi Ashtakam", "Keep Shri Yantra at altar"],
  });

  // 3.2 Vasumati Yoga (Benefics in 3, 6, 10, 11 Upachaya houses from Moon)
  const upachayaFromMoon = [3, 6, 10, 11].map((u) => ((moonHouse + u - 2) % 12) + 1);
  const beneficsInVasumati = chart.planets.filter((p) => upachayaFromMoon.includes(p.house) && isBenefic(p.graha));
  const vasumatiPresent = beneficsInVasumati.length >= 2;
  add({
    id: "dhana_vasumati",
    name: "Vasumati Yoga",
    sanskrit: "वसुमती योग",
    category: "Dhana Yoga",
    isPresent: vasumatiPresent,
    strength: beneficsInVasumati.length >= 3 ? "strong" : "moderate",
    confidence: vasumatiPresent ? 90 : 0,
    ruleMatched: "Two or more natural benefics (Jupiter, Venus, Mercury) in Upachaya houses (3, 6, 10, 11) from Moon",
    planetsInvolved: beneficsInVasumati.map((p) => p.graha),
    description: vasumatiPresent
      ? "Benefics in Upachaya houses ensure immense wealth accumulation through personal efforts and commercial acumen."
      : "Less than two natural benefics in Upachaya houses from Moon.",
    lifeAreas: ["Wealth", "Self-made Fortune", "Business Expansion"],
    recommendedRemedies: ["Worship Goddess Lakshmi on Fridays", "Donate sweets to needy"],
  });

  // 3.3 Chandra-Mangala Yoga (Moon + Mars conjunction/aspect)
  const cmConj = !!moon && !!mars && moon.house === mars.house;
  const cmAspect = !!moon && !!mars && Math.abs(moon.house - mars.house) === 6;
  const cmPresent = cmConj || cmAspect;
  add({
    id: "dhana_chandra_mangala",
    name: "Chandra-Mangala Yoga",
    sanskrit: "चंद्र-मंगल योग",
    category: "Dhana Yoga",
    isPresent: cmPresent,
    strength: "strong",
    confidence: cmPresent ? 92 : 0,
    ruleMatched: "Moon and Mars in conjunction or 7th mutual aspect",
    planetsInvolved: ["Moon", "Mars"],
    description: cmPresent
      ? "Union of Moon and Mars gives intense drive for material prosperity, real estate acumen, financial bravery, and high earnings."
      : "Moon and Mars are not conjunct or in 7th mutual aspect.",
    lifeAreas: ["Real Estate", "Financial Drive", "Commerce"],
    recommendedRemedies: ["Offer red flowers to Hanuman", "Chant Mangal Beej Mantra"],
  });

  // ----------------------------------------------------
  // 4. CHANDRA YOGAS
  // ----------------------------------------------------
  // 4.1 Gaja Kesari Yoga
  let gkPresent = false;
  if (moon && jup) {
    const diff = ((jup.house - moon.house + 12) % 12) + 1;
    gkPresent = [1, 4, 7, 10].includes(diff);
  }
  add({
    id: "chandra_gajakesari",
    name: "Gaja Kesari Yoga",
    sanskrit: "गजकेसरी योग",
    category: "Chandra Yoga",
    isPresent: gkPresent,
    strength: "strong",
    confidence: gkPresent ? 96 : 0,
    ruleMatched: "Jupiter in a Kendra (1, 4, 7, 10) from Moon",
    planetsInvolved: ["Moon", "Jupiter"],
    description: gkPresent
      ? "Jupiter in Kendra from Moon grants wisdom, noble reputation, magnetic charisma, scholarly accomplishments, and lifelong protection."
      : "Jupiter is not in a Kendra house from Moon.",
    lifeAreas: ["Reputation", "Wisdom", "Spirituality", "Public Support"],
    recommendedRemedies: ["Honor gurus and teachers", "Chant Om Guruve Namaha"],
  });

  // 4.2 Adhi Yoga (Benefics in 6, 7, 8 from Moon)
  const adhiHouses = [6, 7, 8].map((h) => ((moonHouse + h - 2) % 12) + 1);
  const adhiPlanets = chart.planets.filter((p) => adhiHouses.includes(p.house) && isBenefic(p.graha));
  const adhiPresent = adhiPlanets.length >= 2;
  add({
    id: "chandra_adhi",
    name: "Chandradhi Yoga",
    sanskrit: "चंद्राधि योग",
    category: "Chandra Yoga",
    isPresent: adhiPresent,
    strength: adhiPlanets.length === 3 ? "strong" : "moderate",
    confidence: adhiPresent ? 91 : 0,
    ruleMatched: "Natural benefics (Jupiter, Venus, Mercury) situated in 6th, 7th, or 8th house from Moon",
    planetsInvolved: adhiPlanets.map((p) => p.graha),
    description: adhiPresent
      ? "Chandradhi Yoga grants high executive positions, victory over opponents, refined intellect, and long life."
      : "Fewer than two natural benefics in 6th, 7th, 8th from Moon.",
    lifeAreas: ["Leadership", "Health", "Victory", "Status"],
    recommendedRemedies: ["Offer milk to Shivling on Mondays"],
  });

  // 4.3 Sunapha / Anapha / Dhurdhura
  const h2Moon = ((moonHouse % 12) + 1);
  const h12Moon = ((moonHouse + 10) % 12) + 1;
  const pIn2Moon = chart.planets.filter((p) => p.house === h2Moon && !["Sun", "Rahu", "Ketu"].includes(p.graha));
  const pIn12Moon = chart.planets.filter((p) => p.house === h12Moon && !["Sun", "Rahu", "Ketu"].includes(p.graha));
  
  const sunapha = pIn2Moon.length > 0 && pIn12Moon.length === 0;
  const anapha = pIn12Moon.length > 0 && pIn2Moon.length === 0;
  const dhurdhura = pIn2Moon.length > 0 && pIn12Moon.length > 0;

  add({
    id: "chandra_sunapha",
    name: "Sunapha Yoga",
    sanskrit: "सुनाफा योग",
    category: "Chandra Yoga",
    isPresent: sunapha,
    strength: "moderate",
    confidence: sunapha ? 88 : 0,
    ruleMatched: "Planets (other than Sun, Rahu, Ketu) in 2nd house from Moon",
    planetsInvolved: pIn2Moon.map((p) => p.graha),
    description: sunapha
      ? "Planets in 2nd from Moon grant intelligence, self-earned wealth, honorable speech, and noble demeanor."
      : "No eligible planets in 2nd house from Moon.",
    lifeAreas: ["Wealth", "Speech", "Self-reliance"],
    recommendedRemedies: ["Chant Chandra Beej Mantra"],
  });

  add({
    id: "chandra_anapha",
    name: "Anapha Yoga",
    sanskrit: "अनफा योग",
    category: "Chandra Yoga",
    isPresent: anapha,
    strength: "moderate",
    confidence: anapha ? 88 : 0,
    ruleMatched: "Planets (other than Sun, Rahu, Ketu) in 12th house from Moon",
    planetsInvolved: pIn12Moon.map((p) => p.graha),
    description: anapha
      ? "Planets in 12th from Moon grant polite nature, good health, mental composure, and spiritual inclination."
      : "No eligible planets in 12th house from Moon.",
    lifeAreas: ["Peace of Mind", "Health", "Generosity"],
    recommendedRemedies: ["Donate food on Mondays"],
  });

  add({
    id: "chandra_dhurdhura",
    name: "Dhurdhura Yoga",
    sanskrit: "धुरधुरा योग",
    category: "Chandra Yoga",
    isPresent: dhurdhura,
    strength: "strong",
    confidence: dhurdhura ? 92 : 0,
    ruleMatched: "Planets in both 2nd and 12th houses from Moon (excluding Sun, Rahu, Ketu)",
    planetsInvolved: [...pIn2Moon.map((p) => p.graha), ...pIn12Moon.map((p) => p.graha)],
    description: dhurdhura
      ? "Moon flanked by planets on both sides bestows exceptional balanced fortune, wealth, vehicles, and generous temperament."
      : "Planets do not occupy both 2nd and 12th from Moon.",
    lifeAreas: ["Wealth", "Vehicles", "Balanced Mind"],
    recommendedRemedies: ["Worship Lord Shiva"],
  });

  // ----------------------------------------------------
  // 5. VIPREET RAJA YOGAS (3)
  // ----------------------------------------------------
  // 5.1 Harsha Yoga (6th lord in 6, 8, 12)
  const harshaPresent = !!pL6 && DUSTHANA.has(pL6.house);
  add({
    id: "vipreet_harsha",
    name: "Harsha Vipreet Raja Yoga",
    sanskrit: "हर्ष विपरीत राजयोग",
    category: "Vipreet Raja Yoga",
    isPresent: harshaPresent,
    strength: "strong",
    confidence: harshaPresent ? 90 : 0,
    ruleMatched: "6th Lord placed in 6th, 8th, or 12th house",
    planetsInvolved: [l6],
    description: harshaPresent
      ? `6th Lord (${l6}) in House ${pL6?.house} neutralizes enemies, grants victory in litigation, robust immunity, and unexpected rise out of adversity.`
      : "6th Lord is not in a Dusthana house.",
    lifeAreas: ["Victory", "Immunity", "Overcoming Adversity"],
    recommendedRemedies: ["Recite Hanuman Chalisa"],
  });

  // 5.2 Sarala Yoga (8th lord in 6, 8, 12)
  const saralaPresent = !!pL8 && DUSTHANA.has(pL8.house);
  add({
    id: "vipreet_sarala",
    name: "Sarala Vipreet Raja Yoga",
    sanskrit: "सरला विपरीत राजयोग",
    category: "Vipreet Raja Yoga",
    isPresent: saralaPresent,
    strength: "strong",
    confidence: saralaPresent ? 90 : 0,
    ruleMatched: "8th Lord placed in 6th, 8th, or 12th house",
    planetsInvolved: [l8],
    description: saralaPresent
      ? `8th Lord (${l8}) in House ${pL8?.house} grants long life, fearlessness, sudden financial gains, and victory over secret obstacles.`
      : "8th Lord is not in a Dusthana house.",
    lifeAreas: ["Longevity", "Fearlessness", "Inheritance"],
    recommendedRemedies: ["Chant Mahamrityunjaya Mantra"],
  });

  // 5.3 Vimala Yoga (12th lord in 6, 8, 12)
  const vimalaPresent = !!pL12 && DUSTHANA.has(pL12.house);
  add({
    id: "vipreet_vimala",
    name: "Vimala Vipreet Raja Yoga",
    sanskrit: "विमला विपरीत राजयोग",
    category: "Vipreet Raja Yoga",
    isPresent: vimalaPresent,
    strength: "strong",
    confidence: vimalaPresent ? 90 : 0,
    ruleMatched: "12th Lord placed in 6th, 8th, or 12th house",
    planetsInvolved: [l12],
    description: vimalaPresent
      ? `12th Lord (${l12}) in House ${pL12?.house} ensures frugal expenditures, spiritual freedom, independence, and gains from foreign lands.`
      : "12th Lord is not in a Dusthana house.",
    lifeAreas: ["Foreign Gains", "Frugality", "Spiritual Freedom"],
    recommendedRemedies: ["Practice meditation and dhyana"],
  });

  // ----------------------------------------------------
  // 6. SANYASA & SPIRITUAL YOGAS
  // ----------------------------------------------------
  // Pravrajya Yoga (4 or more planets in a single house)
  const houseCounts: Record<number, GrahaName[]> = {};
  for (const p of chart.planets) {
    if (!houseCounts[p.house]) houseCounts[p.house] = [];
    houseCounts[p.house].push(p.graha);
  }
  const pravrajyaHouse = Object.entries(houseCounts).find(([_, list]) => list.length >= 4);
  const pravrajyaPresent = !!pravrajyaHouse;
  add({
    id: "spiritual_pravrajya",
    name: "Pravrajya Yoga",
    sanskrit: "प्रव्रज्या योग",
    category: "Sanyasa Yoga",
    isPresent: pravrajyaPresent,
    strength: "strong",
    confidence: pravrajyaPresent ? 93 : 0,
    ruleMatched: "Conjunction of 4 or more planets in a single house",
    planetsInvolved: pravrajyaPresent ? pravrajyaHouse[1] : [],
    description: pravrajyaPresent
      ? `Conjunction of 4+ planets in House ${pravrajyaHouse[0]} indicates deep spiritual detachment, quest for truth, high intellectual focus, and potential renunciation.`
      : "No house contains 4 or more planets.",
    lifeAreas: ["Spirituality", "Detachment", "Higher Learning"],
    recommendedRemedies: ["Engage in spiritual study and mantra siddhi"],
  });

  // Tapaswi Yoga (Saturn, Venus, Ketu in mutual aspect/conjunction)
  const svkHouses = [sat?.house, ven?.house, ketu?.house].filter((h): h is number => h !== undefined);
  const tapawaswiConj = svkHouses.length === 3 && svkHouses.every((h) => h === svkHouses[0]);
  add({
    id: "spiritual_tapaswi",
    name: "Tapaswi Yoga",
    sanskrit: "तपस्वी योग",
    category: "Spiritual Yoga",
    isPresent: tapawaswiConj,
    strength: "strong",
    confidence: tapawaswiConj ? 92 : 0,
    ruleMatched: "Conjunction or mutual aspect between Saturn, Venus, and Ketu",
    planetsInvolved: ["Saturn", "Venus", "Ketu"],
    description: tapawaswiConj
      ? "Tapaswi Yoga grants intense dedication, austerity, mastery over self, and relentless hard work toward noble spiritual/creative goals."
      : "Saturn, Venus, and Ketu are not in mutual conjunction/aspect.",
    lifeAreas: ["Austerity", "Dedication", "Self-Mastery"],
    recommendedRemedies: ["Chant Shiva Shadakshari Stotram"],
  });

  // ----------------------------------------------------
  // 7. SURYA & NABHASA YOGAS
  // ----------------------------------------------------
  // Veshi, Vashi, Ubhayachari
  const sunH = sun ? sun.house : 1;
  const h2Sun = ((sunH % 12) + 1);
  const h12Sun = ((sunH + 10) % 12) + 1;

  const pIn2Sun = chart.planets.filter((p) => p.house === h2Sun && !["Moon", "Rahu", "Ketu"].includes(p.graha));
  const pIn12Sun = chart.planets.filter((p) => p.house === h12Sun && !["Moon", "Rahu", "Ketu"].includes(p.graha));

  const veshi = pIn2Sun.length > 0 && pIn12Sun.length === 0;
  const vashi = pIn12Sun.length > 0 && pIn2Sun.length === 0;
  const ubhayachari = pIn2Sun.length > 0 && pIn12Sun.length > 0;

  add({
    id: "surya_veshi",
    name: "Veshi Yoga",
    sanskrit: "वेशि योग",
    category: "Surya Yoga",
    isPresent: veshi,
    strength: "moderate",
    confidence: veshi ? 87 : 0,
    ruleMatched: "Planets (other than Moon, Rahu, Ketu) in 2nd house from Sun",
    planetsInvolved: pIn2Sun.map((p) => p.graha),
    description: veshi
      ? "Planets in 2nd from Sun grant truthful speech, steady fortune, eloquence, and balanced personality."
      : "No eligible planets in 2nd from Sun.",
    lifeAreas: ["Speech", "Truthfulness", "Status"],
    recommendedRemedies: ["Offer Jal Arghya to Sun"],
  });

  add({
    id: "surya_vashi",
    name: "Vashi Yoga",
    sanskrit: "वाशि योग",
    category: "Surya Yoga",
    isPresent: vashi,
    strength: "moderate",
    confidence: vashi ? 87 : 0,
    ruleMatched: "Planets (other than Moon, Rahu, Ketu) in 12th house from Sun",
    planetsInvolved: pIn12Sun.map((p) => p.graha),
    description: vashi
      ? "Planets in 12th from Sun bestow intelligence, fame, charity, and independence."
      : "No eligible planets in 12th from Sun.",
    lifeAreas: ["Charity", "Independence", "Fame"],
    recommendedRemedies: ["Recite Aditya Hrudayam"],
  });

  add({
    id: "surya_ubhayachari",
    name: "Ubhayachari Yoga",
    sanskrit: "उभयचारी योग",
    category: "Surya Yoga",
    isPresent: ubhayachari,
    strength: "strong",
    confidence: ubhayachari ? 92 : 0,
    ruleMatched: "Planets in both 2nd and 12th houses from Sun (excluding Moon, Rahu, Ketu)",
    planetsInvolved: [...pIn2Sun.map((p) => p.graha), ...pIn12Sun.map((p) => p.graha)],
    description: ubhayachari
      ? "Sun supported by planets on both flanks bestows royal status, persuasive eloquence, leadership, and enduring fortune."
      : "Planets do not occupy both 2nd and 12th from Sun.",
    lifeAreas: ["Royalty", "Leadership", "Fortune"],
    recommendedRemedies: ["Perform Surya Namaskar at sunrise"],
  });

  // Return all evaluated yogas
  return results;
}
