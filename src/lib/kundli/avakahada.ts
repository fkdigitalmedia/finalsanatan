// ============================================================
// Kundli / avakahada-chakra
// ------------------------------------------------------------
// Traditional classification derived from Janma Nakshatra
// (Varna, Vashya, Yoni, Gana, Nadi, Tatva, Naming letters).
// Used in matchmaking (Ashtakoot), namkaran and remedies.
// ============================================================
import type { GrahaName } from "./types";

// Naming letters (Nama-akshara) per Nakshatra × Pada — 27×4 grid.
// Standard Vedic Namkaran table (Devanagari transliterated).
const NAMING_LETTERS: string[][] = [
  ["Chu", "Che", "Cho", "La"], // Ashwini
  ["Li", "Lu", "Le", "Lo"], // Bharani
  ["A", "I", "U", "E"], // Krittika
  ["O", "Va", "Vi", "Vu"], // Rohini
  ["Ve", "Vo", "Ka", "Ki"], // Mrigashira
  ["Ku", "Gha", "Nga", "Chha"], // Ardra
  ["Ke", "Ko", "Ha", "Hi"], // Punarvasu
  ["Hu", "He", "Ho", "Da"], // Pushya
  ["Di", "Du", "De", "Do"], // Ashlesha
  ["Ma", "Mi", "Mu", "Me"], // Magha
  ["Mo", "Ta", "Ti", "Tu"], // Purva Phalguni
  ["Te", "To", "Pa", "Pi"], // Uttara Phalguni
  ["Pu", "Sha", "Na", "Tha"], // Hasta
  ["Pe", "Po", "Ra", "Ri"], // Chitra
  ["Ru", "Re", "Ro", "Ta"], // Swati
  ["Ti", "Tu", "Te", "To"], // Vishakha
  ["Na", "Ni", "Nu", "Ne"], // Anuradha
  ["No", "Ya", "Yi", "Yu"], // Jyeshtha
  ["Ye", "Yo", "Bha", "Bhi"], // Mula
  ["Bhu", "Dha", "Pha", "Dha"], // Purva Ashadha
  ["Bhe", "Bho", "Ja", "Ji"], // Uttara Ashadha
  ["Khi", "Khu", "Khe", "Kho"], // Shravana
  ["Ga", "Gi", "Gu", "Ge"], // Dhanishta
  ["Go", "Sa", "Si", "Su"], // Shatabhisha
  ["Se", "So", "Da", "Di"], // Purva Bhadrapada
  ["Du", "Tha", "Jha", "Nya"], // Uttara Bhadrapada
  ["De", "Do", "Cha", "Chi"], // Revati
];

const VARNA: Array<"Brahmin" | "Kshatriya" | "Vaishya" | "Shudra"> = [
  "Kshatriya",
  "Vaishya",
  "Vaishya",
  "Shudra",
  "Shudra", // 1-5
  "Vaishya",
  "Vaishya",
  "Shudra",
  "Shudra",
  "Kshatriya", // 6-10
  "Kshatriya",
  "Vaishya",
  "Shudra",
  "Kshatriya",
  "Shudra", // 11-15
  "Kshatriya",
  "Shudra",
  "Vaishya",
  "Kshatriya",
  "Brahmin", // 16-20
  "Kshatriya",
  "Shudra",
  "Vaishya",
  "Brahmin",
  "Brahmin", // 21-25
  "Brahmin",
  "Shudra", // 26-27
];

const VASHYA: string[] = [
  "Chatushpada",
  "Chatushpada",
  "Chatushpada",
  "Chatushpada",
  "Chatushpada",
  "Manav",
  "Manav",
  "Chatushpada",
  "Jalachar",
  "Vanachar",
  "Vanachar",
  "Manav",
  "Manav",
  "Manav",
  "Manav",
  "Manav",
  "Manav",
  "Keet",
  "Manav",
  "Chatushpada",
  "Manav",
  "Jalachar",
  "Jalachar",
  "Manav",
  "Manav",
  "Manav",
  "Jalachar",
];

const YONI: string[] = [
  "Horse (M)",
  "Elephant (M)",
  "Sheep (F)",
  "Serpent (M)",
  "Serpent (F)",
  "Dog (F)",
  "Cat (F)",
  "Sheep (M)",
  "Cat (M)",
  "Rat (M)",
  "Rat (F)",
  "Cow (F)",
  "Buffalo (F)",
  "Tiger (F)",
  "Buffalo (M)",
  "Tiger (M)",
  "Deer (F)",
  "Deer (M)",
  "Dog (M)",
  "Monkey (M)",
  "Mongoose (M)",
  "Monkey (F)",
  "Lion (F)",
  "Horse (F)",
  "Lion (M)",
  "Cow (M)",
  "Elephant (F)",
];

const GANA: Array<"Deva" | "Manushya" | "Rakshasa"> = [
  "Deva",
  "Manushya",
  "Rakshasa",
  "Manushya",
  "Deva",
  "Manushya",
  "Deva",
  "Deva",
  "Rakshasa",
  "Rakshasa",
  "Manushya",
  "Manushya",
  "Deva",
  "Rakshasa",
  "Deva",
  "Rakshasa",
  "Deva",
  "Rakshasa",
  "Rakshasa",
  "Manushya",
  "Manushya",
  "Deva",
  "Rakshasa",
  "Rakshasa",
  "Manushya",
  "Manushya",
  "Deva",
];

const NADI: Array<"Aadi" | "Madhya" | "Antya"> = [
  "Aadi",
  "Madhya",
  "Antya",
  "Antya",
  "Madhya",
  "Aadi",
  "Aadi",
  "Madhya",
  "Antya",
  "Antya",
  "Madhya",
  "Aadi",
  "Aadi",
  "Madhya",
  "Antya",
  "Antya",
  "Madhya",
  "Aadi",
  "Aadi",
  "Madhya",
  "Antya",
  "Antya",
  "Madhya",
  "Aadi",
  "Aadi",
  "Madhya",
  "Antya",
];

const TATVA_BY_RASHI: Array<"Agni" | "Prithvi" | "Vayu" | "Jala"> = [
  "Agni",
  "Prithvi",
  "Vayu",
  "Jala",
  "Agni",
  "Prithvi",
  "Vayu",
  "Jala",
  "Agni",
  "Prithvi",
  "Vayu",
  "Jala",
];

export interface AvakahadaChakra {
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  tatva: string;
  paya: string;
  namingLetter: string;
  namingLetters: string[]; // all 4 pada options
  nakshatraLord: GrahaName;
  rashiLord: string;
}

const RASHI_LORDS = [
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
];

/** Paya = metal association based on moon rashi position from janma nakshatra rashi */
function computePaya(moonRashiIndex: number): string {
  const table = ["Swarna", "Rajat", "Tamra", "Loha"]; // Gold, Silver, Copper, Iron
  return table[moonRashiIndex % 4];
}

export function computeAvakahada(
  moonNakshatraIndex: number, // 0..26
  moonPada: 1 | 2 | 3 | 4,
  moonRashiIndex: number, // 0..11
  nakshatraLord: GrahaName,
): AvakahadaChakra {
  return {
    varna: VARNA[moonNakshatraIndex],
    vashya: VASHYA[moonNakshatraIndex],
    yoni: YONI[moonNakshatraIndex],
    gana: GANA[moonNakshatraIndex],
    nadi: NADI[moonNakshatraIndex],
    tatva: TATVA_BY_RASHI[moonRashiIndex],
    paya: computePaya(moonRashiIndex),
    namingLetter: NAMING_LETTERS[moonNakshatraIndex][moonPada - 1],
    namingLetters: NAMING_LETTERS[moonNakshatraIndex],
    nakshatraLord,
    rashiLord: RASHI_LORDS[moonRashiIndex],
  };
}
