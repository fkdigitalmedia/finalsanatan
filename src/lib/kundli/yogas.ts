// ============================================================
// Kundli / yogas
// ------------------------------------------------------------
// Detects a curated set of classical Yogas from D1 chart.
// Each yoga has: name, sanskrit, category, strength, description.
// Not exhaustive — covers the most-cited ones in modern reports.
// ============================================================
import type { KundliChart, GrahaName } from "./types";

export type YogaCategory =
  | "Raj Yoga"
  | "Dhana Yoga"
  | "Pancha Mahapurusha"
  | "Nabhasa"
  | "Chandra Yoga"
  | "Surya Yoga"
  | "Other";

export interface YogaResult {
  name: string;
  sanskrit?: string;
  category: YogaCategory;
  isPresent: boolean;
  strength: "strong" | "moderate" | "mild";
  description: string;
}

const OWN_SIGN: Record<GrahaName, number[]> = {
  Sun: [4], // Simha
  Moon: [3], // Karka
  Mars: [0, 7], // Mesha, Vrishchika
  Mercury: [2, 5], // Mithuna, Kanya
  Jupiter: [8, 11], // Dhanu, Meena
  Venus: [1, 6], // Vrishabha, Tula
  Saturn: [9, 10], // Makara, Kumbha
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

const KENDRA = new Set([1, 4, 7, 10]);
const TRIKONA = new Set([1, 5, 9]);
const DUSTHANA = new Set([6, 8, 12]);

function planet(chart: KundliChart, g: GrahaName) {
  return chart.planets.find((p) => p.graha === g);
}

// Pancha Mahapurusha — Mars/Mercury/Jupiter/Venus/Saturn in own/exalted sign AND in a Kendra
function panchaMahapurusha(chart: KundliChart): YogaResult[] {
  const map: Array<{ graha: GrahaName; name: string; sanskrit: string }> = [
    { graha: "Mars", name: "Ruchaka Yoga", sanskrit: "रुचक योग" },
    { graha: "Mercury", name: "Bhadra Yoga", sanskrit: "भद्र योग" },
    { graha: "Jupiter", name: "Hamsa Yoga", sanskrit: "हंस योग" },
    { graha: "Venus", name: "Malavya Yoga", sanskrit: "मालव्य योग" },
    { graha: "Saturn", name: "Shasha Yoga", sanskrit: "शश योग" },
  ];
  return map.map(({ graha, name, sanskrit }) => {
    const p = planet(chart, graha);
    const inOwnOrExalted =
      !!p && (OWN_SIGN[graha].includes(p.rashiIndex) || EXALTED_SIGN[graha] === p.rashiIndex);
    const inKendra = !!p && KENDRA.has(p.house);
    const present = inOwnOrExalted && inKendra;
    return {
      name,
      sanskrit,
      category: "Pancha Mahapurusha" as const,
      isPresent: present,
      strength: "strong" as const,
      description: present
        ? `${graha} is in ${p!.rashi} (${p!.dignity}) in the ${p!.house}th house (Kendra), forming ${name}. Grants authority, confidence, and lifelong recognition of ${graha}'s qualities.`
        : `${graha} is not in own/exalted sign in a Kendra — ${name} is not formed.`,
    };
  });
}

// Gaja Kesari — Moon and Jupiter in mutual Kendra (1/4/7/10 from each other)
function gajaKesari(chart: KundliChart): YogaResult {
  const moon = planet(chart, "Moon");
  const jup = planet(chart, "Jupiter");
  let present = false;
  if (moon && jup) {
    const diff = ((jup.house - moon.house + 12) % 12) + 1; // 1..12
    present = [1, 4, 7, 10].includes(diff);
  }
  return {
    name: "Gaja Kesari Yoga",
    sanskrit: "गजकेसरी योग",
    category: "Chandra Yoga",
    isPresent: present,
    strength: "strong",
    description: present
      ? "Moon and Jupiter are in mutual Kendra positions. Bestows wisdom, fame, wealth, and a dignified personality."
      : "Moon and Jupiter are not in mutual Kendra — Gaja Kesari not formed.",
  };
}

// Budhaditya — Sun and Mercury in the same house
function budhaditya(chart: KundliChart): YogaResult {
  const sun = planet(chart, "Sun");
  const mer = planet(chart, "Mercury");
  const present = !!sun && !!mer && sun.house === mer.house;
  return {
    name: "Budhaditya Yoga",
    sanskrit: "बुधादित्य योग",
    category: "Surya Yoga",
    isPresent: present,
    strength: "moderate",
    description: present
      ? `Sun and Mercury are together in the ${sun!.house}th house. Sharp intellect, communication skills, and success in scholarly or administrative roles.`
      : "Sun and Mercury are not conjunct — Budhaditya not formed.",
  };
}

// Chandra Mangal — Moon and Mars in same house or 7th from each other
function chandraMangal(chart: KundliChart): YogaResult {
  const m = planet(chart, "Moon");
  const ma = planet(chart, "Mars");
  let present = false;
  if (m && ma) {
    const diff = Math.abs(m.house - ma.house);
    present = diff === 0 || diff === 6;
  }
  return {
    name: "Chandra-Mangal Yoga",
    sanskrit: "चन्द्र-मंगल योग",
    category: "Dhana Yoga",
    isPresent: present,
    strength: "moderate",
    description: present
      ? "Moon and Mars form a wealth-giving combination. Financial acumen, real estate gains, entrepreneurial drive."
      : "Moon and Mars are not in conjunction or opposition — Chandra-Mangal not formed.",
  };
}

// Raj Yoga — Kendra lord and Trikona lord in mutual relationship (simplified: conjunction/exchange/aspect by house)
function rajYoga(chart: KundliChart): YogaResult {
  // Simplified: if any Trikona (1,5,9) house has a Kendra-lord planet, and vice versa.
  // Detect any planet that is lord of a Kendra sitting in a Trikona, or lord of a Trikona sitting in a Kendra.
  const ascIdx = chart.ascendant.rashiIndex; // 0..11
  const houseSign = (h: number) => (ascIdx + h - 1) % 12;
  const signLord: Record<number, GrahaName> = {
    0: "Mars",
    1: "Venus",
    2: "Mercury",
    3: "Moon",
    4: "Sun",
    5: "Mercury",
    6: "Venus",
    7: "Mars",
    8: "Jupiter",
    9: "Saturn",
    10: "Saturn",
    11: "Jupiter",
  };
  const kendraLords = new Set<GrahaName>([1, 4, 7, 10].map((h) => signLord[houseSign(h)]));
  const trikonaLords = new Set<GrahaName>([1, 5, 9].map((h) => signLord[houseSign(h)]));
  const present = chart.planets.some((p) => {
    const inKendra = KENDRA.has(p.house);
    const inTrikona = TRIKONA.has(p.house);
    return (inTrikona && kendraLords.has(p.graha)) || (inKendra && trikonaLords.has(p.graha));
  });
  return {
    name: "Raj Yoga",
    sanskrit: "राज योग",
    category: "Raj Yoga",
    isPresent: present,
    strength: "strong",
    description: present
      ? "A Kendra lord occupies a Trikona (or vice versa), forming a classical Raj Yoga. Indicates authority, status, and prosperity through effort."
      : "No direct Kendra-Trikona lord placement detected — a formal Raj Yoga is not evident from house occupation alone.",
  };
}

// Neecha Bhanga — a debilitated planet whose sign lord is in a Kendra from Lagna or Moon (simplified)
function neechaBhanga(chart: KundliChart): YogaResult {
  const debilitated = chart.planets.filter((p) => p.dignity === "debilitated");
  const present = debilitated.some((d) => {
    const signLord: Record<number, GrahaName> = {
      0: "Mars",
      1: "Venus",
      2: "Mercury",
      3: "Moon",
      4: "Sun",
      5: "Mercury",
      6: "Venus",
      7: "Mars",
      8: "Jupiter",
      9: "Saturn",
      10: "Saturn",
      11: "Jupiter",
    };
    const lord = signLord[d.rashiIndex];
    const lordPlanet = planet(chart, lord);
    return !!lordPlanet && KENDRA.has(lordPlanet.house);
  });
  return {
    name: "Neecha Bhanga Raj Yoga",
    sanskrit: "नीचभंग राज योग",
    category: "Raj Yoga",
    isPresent: present,
    strength: "moderate",
    description: present
      ? "A debilitated planet's dispositor sits in a Kendra — the debilitation is cancelled, converting weakness into a rise-after-struggle Raj Yoga."
      : "No cancellation of debility detected.",
  };
}

// Vipreet Raj Yoga — lords of 6, 8, 12 in mutual exchange or in each other's houses (simplified: any two of 6/8/12 lords sit together in 6/8/12)
function vipreetRajYoga(chart: KundliChart): YogaResult {
  const ascIdx = chart.ascendant.rashiIndex;
  const signLord: Record<number, GrahaName> = {
    0: "Mars",
    1: "Venus",
    2: "Mercury",
    3: "Moon",
    4: "Sun",
    5: "Mercury",
    6: "Venus",
    7: "Mars",
    8: "Jupiter",
    9: "Saturn",
    10: "Saturn",
    11: "Jupiter",
  };
  const houseSign = (h: number) => (ascIdx + h - 1) % 12;
  const dusLords = [6, 8, 12].map((h) => signLord[houseSign(h)]);
  const inDus = dusLords.map((l) => planet(chart, l)).filter((p) => p && DUSTHANA.has(p.house));
  const present = inDus.length >= 2;
  return {
    name: "Vipreet Raj Yoga",
    sanskrit: "विपरीत राज योग",
    category: "Raj Yoga",
    isPresent: present,
    strength: "moderate",
    description: present
      ? "Lords of 6/8/12 occupy each other's houses — misfortune converts into unexpected gains, often after adversity."
      : "No Vipreet Raj Yoga configuration detected.",
  };
}

export { evaluateAllYogas, type ExtendedYogaResult, type ClassicalYogaCategory } from "./yogas/yogas-evaluator";

export function detectYogas(chart: KundliChart): YogaResult[] {
  return [
    ...panchaMahapurusha(chart),
    gajaKesari(chart),
    budhaditya(chart),
    chandraMangal(chart),
    rajYoga(chart),
    neechaBhanga(chart),
    vipreetRajYoga(chart),
  ];
}
