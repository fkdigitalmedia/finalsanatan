// ============================================================
// Kundli Matching — Ashtakoot Guna Milan (36 points)
// ------------------------------------------------------------
// Computes classical 8-koota compatibility between two natives
// using each person's Moon rashi + Nakshatra derived from the
// existing Kundli engine.
// ============================================================

import { generateKundli } from "./index";
import type { BirthInput, KundliResult } from "./types";
import { RASHIS, NAKSHATRAS } from "./types";

export type KootaKey =
  "varna" | "vashya" | "tara" | "yoni" | "grahaMaitri" | "gana" | "bhakoot" | "nadi";

export interface KootaResult {
  key: KootaKey;
  label: string;
  max: number;
  score: number;
  note: string;
}

export interface MatchingPerson {
  name: string;
  moonRashiIndex: number; // 0..11
  moonRashi: string;
  nakshatraIndex: number; // 0..26
  nakshatra: string;
  kundli: KundliResult;
}

export interface MatchingResult {
  boy: MatchingPerson;
  girl: MatchingPerson;
  kootas: KootaResult[];
  totalScore: number;
  maxScore: 36;
  verdict: "excellent" | "very_good" | "good" | "average" | "poor";
  verdictLabel: string;
  summary: string;
  doshas: {
    manglik: { boy: boolean; girl: boolean; cancelled: boolean; note: string };
    nadi: boolean;
    bhakoot: boolean;
  };
}

// ---------- Tables ----------

// Varna by rashi index (0..11): 3=Brahmin, 2=Kshatriya, 1=Vaishya, 0=Shudra
const VARNA: number[] = [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3];
const VARNA_NAME = ["Shudra", "Vaishya", "Kshatriya", "Brahmin"];

// Vashya groups: 0 Chatushpad, 1 Manav, 2 Jalachar, 3 Vanachar, 4 Keet
const VASHYA_GROUP: number[] = [0, 0, 1, 2, 3, 1, 1, 4, 1, 0, 1, 2];
const VASHYA_NAME = [
  "Chatushpad (quadruped)",
  "Manav (human)",
  "Jalachar (aquatic)",
  "Vanachar (wild)",
  "Keet (insect)",
];

// Yoni per nakshatra (0..26) — 14 animals
const YONI: number[] = [
  0, // Ashwini - Horse
  1, // Bharani - Elephant
  2, // Krittika - Sheep
  3, // Rohini - Serpent
  3, // Mrigashira - Serpent
  4, // Ardra - Dog
  5, // Punarvasu - Cat
  2, // Pushya - Sheep
  5, // Ashlesha - Cat
  6, // Magha - Rat
  6, // Purva Phalguni - Rat
  7, // Uttara Phalguni - Cow
  8, // Hasta - Buffalo
  9, // Chitra - Tiger
  8, // Swati - Buffalo
  9, // Vishakha - Tiger
  10, // Anuradha - Deer
  10, // Jyeshtha - Deer
  4, // Mula - Dog
  11, // Purva Ashadha - Monkey
  12, // Uttara Ashadha - Mongoose
  11, // Shravana - Monkey
  13, // Dhanishta - Lion
  0, // Shatabhisha - Horse
  13, // Purva Bhadrapada - Lion
  7, // Uttara Bhadrapada - Cow
  1, // Revati - Elephant
];
const YONI_NAME = [
  "Horse",
  "Elephant",
  "Sheep",
  "Serpent",
  "Dog",
  "Cat",
  "Rat",
  "Cow",
  "Buffalo",
  "Tiger",
  "Deer",
  "Monkey",
  "Mongoose",
  "Lion",
];
// Enemy pairs (bitter): traditional list
const YONI_ENEMY: Array<[number, number]> = [
  [7, 9], // Cow - Tiger
  [1, 13], // Elephant - Lion
  [0, 8], // Horse - Buffalo
  [4, 10], // Dog - Deer
  [3, 12], // Serpent - Mongoose
  [5, 6], // Cat - Rat
  [2, 11], // Sheep - Monkey
];

// Gana per nakshatra: 0 Deva, 1 Manushya, 2 Rakshasa
const GANA: number[] = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0,
];
const GANA_NAME = ["Deva", "Manushya", "Rakshasa"];

// Nadi per nakshatra: 0 Adi, 1 Madhya, 2 Antya
const NADI: number[] = [
  0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2,
];
const NADI_NAME = ["Adi", "Madhya", "Antya"];

// Rashi lord (planet key)
const RASHI_LORD = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
] as const;
type Planet = (typeof RASHI_LORD)[number];

// Natural friendship: 2=friend, 1=neutral, 0=enemy
const FRIENDSHIP: Record<Planet, Record<Planet, number>> = {
  Sun: { Sun: 1, Moon: 2, Mars: 2, Mercury: 1, Jupiter: 2, Venus: 0, Saturn: 0 },
  Moon: { Sun: 2, Moon: 1, Mars: 1, Mercury: 2, Jupiter: 1, Venus: 1, Saturn: 1 },
  Mars: { Sun: 2, Moon: 2, Mars: 1, Mercury: 0, Jupiter: 2, Venus: 1, Saturn: 1 },
  Mercury: { Sun: 2, Moon: 0, Mars: 1, Mercury: 1, Jupiter: 1, Venus: 2, Saturn: 1 },
  Jupiter: { Sun: 2, Moon: 2, Mars: 2, Mercury: 0, Jupiter: 1, Venus: 0, Saturn: 1 },
  Venus: { Sun: 0, Moon: 0, Mars: 1, Mercury: 2, Jupiter: 1, Venus: 1, Saturn: 2 },
  Saturn: { Sun: 0, Moon: 0, Mars: 0, Mercury: 2, Jupiter: 1, Venus: 2, Saturn: 1 },
};

// ---------- Koota calculators ----------

function calcVarna(boyR: number, girlR: number): KootaResult {
  const b = VARNA[boyR],
    g = VARNA[girlR];
  const score = b >= g ? 1 : 0;
  return {
    key: "varna",
    label: "Varna",
    max: 1,
    score,
    note: `Boy: ${VARNA_NAME[b]}, Girl: ${VARNA_NAME[g]}. ${score ? "Compatible." : "Girl's varna is higher — not ideal, but weightage is minor."}`,
  };
}

function calcVashya(boyR: number, girlR: number): KootaResult {
  const b = VASHYA_GROUP[boyR],
    g = VASHYA_GROUP[girlR];
  let score = 0;
  if (b === g) score = 2;
  else if (
    (b === 0 && g === 1) ||
    (b === 1 && g === 0) ||
    (b === 2 && g === 0) ||
    (b === 0 && g === 2)
  )
    score = 1;
  else score = 0.5;
  return {
    key: "vashya",
    label: "Vashya",
    max: 2,
    score,
    note: `Boy: ${VASHYA_NAME[b]}, Girl: ${VASHYA_NAME[g]}. Indicates mutual influence & attraction.`,
  };
}

function calcTara(boyN: number, girlN: number): KootaResult {
  const forward = ((girlN - boyN + 27) % 9) + 1; // 1..9
  const backward = ((boyN - girlN + 27) % 9) + 1;
  const bad = new Set([3, 5, 7]);
  const favForward = !bad.has(forward);
  const favBackward = !bad.has(backward);
  let score = 0;
  if (favForward && favBackward) score = 3;
  else if (favForward || favBackward) score = 1.5;
  return {
    key: "tara",
    label: "Tara (Dina)",
    max: 3,
    score,
    note: `Boy→Girl count: ${forward} (${favForward ? "auspicious" : "inauspicious"}), Girl→Boy: ${backward} (${favBackward ? "auspicious" : "inauspicious"}). Indicates health & fortune.`,
  };
}

function calcYoni(boyN: number, girlN: number): KootaResult {
  const b = YONI[boyN],
    g = YONI[girlN];
  let score = 3; // neutral default
  if (b === g) score = 4;
  else if (YONI_ENEMY.some(([x, y]) => (x === b && y === g) || (x === g && y === b))) score = 0;
  else score = 2;
  return {
    key: "yoni",
    label: "Yoni",
    max: 4,
    score,
    note: `Boy: ${YONI_NAME[b]}, Girl: ${YONI_NAME[g]}. Indicates sexual & physical compatibility.`,
  };
}

function calcGrahaMaitri(boyR: number, girlR: number): KootaResult {
  const bL = RASHI_LORD[boyR],
    gL = RASHI_LORD[girlR];
  const a = FRIENDSHIP[bL][gL];
  const b = FRIENDSHIP[gL][bL];
  const sum = a + b; // 0..4
  const map: Record<number, number> = { 4: 5, 3: 4, 2: 3, 1: 1, 0: 0 };
  const score = map[sum] ?? 0;
  return {
    key: "grahaMaitri",
    label: "Graha Maitri",
    max: 5,
    score,
    note: `Rashi lords: ${bL} & ${gL}. Indicates mental & intellectual compatibility.`,
  };
}

function calcGana(boyN: number, girlN: number): KootaResult {
  const b = GANA[boyN],
    g = GANA[girlN];
  let score = 6;
  if (b === g) score = 6;
  else if ((b === 0 && g === 1) || (b === 1 && g === 0)) score = 5;
  else if ((b === 1 && g === 2) || (b === 2 && g === 1)) score = 1;
  else if ((b === 0 && g === 2) || (b === 2 && g === 0)) score = 0;
  return {
    key: "gana",
    label: "Gana",
    max: 6,
    score,
    note: `Boy: ${GANA_NAME[b]}, Girl: ${GANA_NAME[g]}. Indicates temperament & behaviour.`,
  };
}

function calcBhakoot(boyR: number, girlR: number): KootaResult {
  const d1 = ((girlR - boyR + 12) % 12) + 1;
  const d2 = ((boyR - girlR + 12) % 12) + 1;
  const bad = new Set([2, 5, 6, 8, 9, 12]);
  // Standard rule: 6/8, 2/12, 5/9 = 0; else 7
  const score = bad.has(d1) && bad.has(d2) ? 0 : 7;
  return {
    key: "bhakoot",
    label: "Bhakoot",
    max: 7,
    score,
    note: `Rashis: ${RASHIS[boyR]} & ${RASHIS[girlR]}. Governs family life, finance & progeny.`,
  };
}

function calcNadi(boyN: number, girlN: number): KootaResult {
  const b = NADI[boyN],
    g = NADI[girlN];
  const score = b === g ? 0 : 8;
  return {
    key: "nadi",
    label: "Nadi",
    max: 8,
    score,
    note: `Boy: ${NADI_NAME[b]}, Girl: ${NADI_NAME[g]} Nadi. ${score === 0 ? "Nadi Dosha present — governs health & progeny; consult an astrologer for remedies." : "No Nadi Dosha — excellent for health & progeny."}`,
  };
}

// Manglik check: Mars in 1,2,4,7,8,12
function isManglik(k: KundliResult): boolean {
  const mars = k.d1.planets.find((p) => p.graha === "Mars");
  if (!mars) return false;
  return [1, 2, 4, 7, 8, 12].includes(mars.house);
}

function verdictFor(total: number): {
  verdict: MatchingResult["verdict"];
  verdictLabel: string;
  summary: string;
} {
  if (total >= 32)
    return {
      verdict: "excellent",
      verdictLabel: "Excellent Match",
      summary:
        "An outstanding compatibility. This union is highly recommended by classical Vedic scriptures.",
    };
  if (total >= 26)
    return {
      verdict: "very_good",
      verdictLabel: "Very Good Match",
      summary: "A very compatible pairing. Marriage is recommended with normal precautions.",
    };
  if (total >= 18)
    return {
      verdict: "good",
      verdictLabel: "Good Match",
      summary: "Acceptable compatibility. Address specific koota shortcomings with an astrologer.",
    };
  if (total >= 12)
    return {
      verdict: "average",
      verdictLabel: "Average Match",
      summary:
        "Below the classical minimum threshold (18). Detailed review and remedies recommended.",
    };
  return {
    verdict: "poor",
    verdictLabel: "Not Recommended",
    summary:
      "Compatibility is very low. A trained astrologer should evaluate the full charts before proceeding.",
  };
}

export function computeMatching(boy: BirthInput, girl: BirthInput): MatchingResult {
  const boyK = generateKundli({ ...boy, gender: "male" });
  const girlK = generateKundli({ ...girl, gender: "female" });

  const bMoon = boyK.d1.planets.find((p) => p.graha === "Moon")!;
  const gMoon = girlK.d1.planets.find((p) => p.graha === "Moon")!;

  const boyR = bMoon.rashiIndex,
    boyN = bMoon.nakshatraIndex;
  const girlR = gMoon.rashiIndex,
    girlN = gMoon.nakshatraIndex;

  const kootas: KootaResult[] = [
    calcVarna(boyR, girlR),
    calcVashya(boyR, girlR),
    calcTara(boyN, girlN),
    calcYoni(boyN, girlN),
    calcGrahaMaitri(boyR, girlR),
    calcGana(boyN, girlN),
    calcBhakoot(boyR, girlR),
    calcNadi(boyN, girlN),
  ];

  const totalScore = Math.round(kootas.reduce((s, k) => s + k.score, 0) * 10) / 10;
  const v = verdictFor(totalScore);

  const bManglik = isManglik(boyK);
  const gManglik = isManglik(girlK);
  const cancelled = bManglik && gManglik;

  const bhakootDosha = kootas.find((k) => k.key === "bhakoot")!.score === 0;
  const nadiDosha = kootas.find((k) => k.key === "nadi")!.score === 0;

  return {
    boy: {
      name: boy.place || "Boy",
      moonRashiIndex: boyR,
      moonRashi: RASHIS[boyR],
      nakshatraIndex: boyN,
      nakshatra: NAKSHATRAS[boyN],
      kundli: boyK,
    },
    girl: {
      name: girl.place || "Girl",
      moonRashiIndex: girlR,
      moonRashi: RASHIS[girlR],
      nakshatraIndex: girlN,
      nakshatra: NAKSHATRAS[girlN],
      kundli: girlK,
    },
    kootas,
    totalScore,
    maxScore: 36,
    ...v,
    doshas: {
      manglik: {
        boy: bManglik,
        girl: gManglik,
        cancelled,
        note: cancelled
          ? "Both partners are Manglik — the dosha is mutually cancelled."
          : bManglik || gManglik
            ? `${bManglik ? "Boy" : "Girl"} has Mangal Dosha (Mars in 1/2/4/7/8/12). Consider remedies or matching with another Manglik.`
            : "Neither partner has Mangal Dosha.",
      },
      nadi: nadiDosha,
      bhakoot: bhakootDosha,
    },
  };
}
