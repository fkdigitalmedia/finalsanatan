// ============================================================
// Phase 21 — Classical Knowledge Database Engine
// ------------------------------------------------------------
// Structured database mapping rules, Yogas, and Doshas to 8 classical texts:
// 1. Brihat Parashara Hora Shastra (BPHS)
// 2. Phaladeepika (Mantreswara)
// 3. Saravali (Kalyanavarma)
// 4. Jataka Parijata (Vaidyanatha)
// 5. Brihat Jataka (Varahamihira)
// 6. Uttara Kalamrita (Kalidasa)
// 7. Mansagari (Haradvata)
// 8. Hora Ratna (Balabhadra)
// ============================================================

export type ClassicalTextName =
  | "Brihat Parashara Hora Shastra"
  | "Phaladeepika"
  | "Saravali"
  | "Jataka Parijata"
  | "Brihat Jataka"
  | "Uttara Kalamrita"
  | "Mansagari"
  | "Hora Ratna";

export interface ClassicalKnowledgeEntry {
  ruleId: string;
  ruleName: string;
  sanskritName: string;
  englishName: string;
  classicalSource: ClassicalTextName;
  chapter: string;
  verseNumber: string;
  translation: string;
  ruleLogic: string;
  modernInterpretation: string;
  lifeAreas: string[];
  remedies: string[];
  confidenceScore: number;
}

export const CLASSICAL_KNOWLEDGE_DATABASE: Record<string, ClassicalKnowledgeEntry> = {
  rule_career_10th_lord_kendra: {
    ruleId: "rule_career_10th_lord_kendra",
    ruleName: "10th Lord in Kendra / Trikona",
    sanskritName: "दशमेश केन्द्र योग (Dasamesh Kendra Yoga)",
    englishName: "10th Lord Executive Honor Yoga",
    classicalSource: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 21 — Rajayoga Adhyaya",
    verseNumber: "Verse 14–16",
    translation: "If the lord of the 10th house is in a Kendra (1, 4, 7, 10) or Trikona (5, 9), the native gains executive authority, leadership status, and royal honor.",
    ruleLogic: "10th House lord positioned in angular Kendras maximizes public visibility and executive capacity.",
    modernInterpretation: "Promotes executive promotions, corporate leadership, and public status in corporate/government careers.",
    lifeAreas: ["Career", "Public Status", "Leadership"],
    remedies: ["Offer water to Sun at sunrise", "Recite Aditya Hridaya Stotra on Sundays"],
    confidenceScore: 92,
  },
  rule_career_sun_mercury_10th: {
    ruleId: "rule_career_sun_mercury_10th",
    ruleName: "Sun & Mercury Budhaditya Yoga in 10th",
    sanskritName: "बुधादित्य योग (Budhaditya Yoga)",
    englishName: "Sun-Mercury Intellect Yoga",
    classicalSource: "Saravali",
    chapter: "Chapter 32 — Rajayoga Phala",
    verseNumber: "Verse 8",
    translation: "Sun and Mercury conjunction in 10th House bestows sharp analytical foresight, administrative acclaim, and financial acumen.",
    ruleLogic: "Mercury's analytical intellect combines with Sun's executive authority in the house of action.",
    modernInterpretation: "Supports analytical careers such as finance, technology, data science, and management consulting.",
    lifeAreas: ["Career", "Education", "Intellect"],
    remedies: ["Recite Vishnu Sahasranama on Wednesdays", "Wear Emerald gemstone after consultation"],
    confidenceScore: 90,
  },
  rule_business_7th_11th_link: {
    ruleId: "rule_business_7th_11th_link",
    ruleName: "7th and 11th House Partnership Link",
    sanskritName: "सप्तम-एकादश सम्बन्ध (7th-11th Link)",
    englishName: "Commercial Trade & Gains Yoga",
    classicalSource: "Phaladeepika",
    chapter: "Chapter 10 — Kalatra & Vyapara",
    verseNumber: "Verse 22",
    translation: "When 7th lord of partnerships connects with 11th lord of gains, commerce and trade bring exponential financial profit.",
    ruleLogic: "Harmonizes commercial transactions (7th house) with income realization (11th house).",
    modernInterpretation: "Fosters profitable international trade, business partnerships, e-commerce, and commercial expansions.",
    lifeAreas: ["Business", "Finance", "Partnership"],
    remedies: ["Perform Lakshmi Puja on Friday evenings", "Donate green moong on Wednesdays"],
    confidenceScore: 88,
  },
  rule_marriage_venus_7th_benefic: {
    ruleId: "rule_marriage_venus_7th_benefic",
    ruleName: "Benefic Venus 7th House Placement",
    sanskritName: "शुभ शुक्र योग (Benefic Shukra Yoga)",
    englishName: "Matrimonial Harmony Yoga",
    classicalSource: "Jataka Parijata",
    chapter: "Chapter 14 — Vivaha Bhava",
    verseNumber: "Verse 11",
    translation: "Venus in 7th house aspected by benefics ensures an accomplished, affectionate spouse and lasting marital joy.",
    ruleLogic: "Venus as Karaka of love occupying 7th house in dignity stabilizes relationship bonding.",
    modernInterpretation: "Fosters emotional understanding, mutual respect, and long-term marital commitment.",
    lifeAreas: ["Marriage", "Love", "Family"],
    remedies: ["Chant Shukra Beej Mantra 108 times on Fridays", "Worship Goddess Parvati"],
    confidenceScore: 86,
  },
};

export function getKnowledgeEntry(ruleId: string): ClassicalKnowledgeEntry | null {
  return CLASSICAL_KNOWLEDGE_DATABASE[ruleId] || null;
}
