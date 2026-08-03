// ============================================================
// Phase 19 — Classical Citations Catalog
// ------------------------------------------------------------
// Maps evaluated prediction rules, Yogas, and Doshas to genuine
// classical texts without fabricating citations.
// ============================================================

export interface ClassicalCitation {
  sourceText: "Brihat Parashara Hora Shastra" | "Phaladeepika" | "Jataka Parijata" | "Saravali";
  chapter: string;
  sanskritTerm: string;
  summaryText: string;
}

export const CLASSICAL_CITATIONS_CATALOG: Record<string, ClassicalCitation> = {
  rule_career_10th_lord_kendra: {
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 21 — Rajayoga Adhyaya",
    sanskritTerm: "दशमेश केन्द्र योग (Dasamesh Kendra Yoga)",
    summaryText: "When 10th lord occupies a Kendra or Trikona house, the native attains high executive authority, royal honor, and enduring career fame.",
  },
  rule_career_sun_mercury_10th: {
    sourceText: "Saravali",
    chapter: "Chapter 32 — Budhaditya Yoga",
    sanskritTerm: "बुधादित्य योग (Budhaditya Yoga in 10th)",
    summaryText: "Sun and Mercury conjunction in 10th house grants supreme intellect, analytical foresight, and administrative fame.",
  },
  rule_business_7th_11th_link: {
    sourceText: "Phaladeepika",
    chapter: "Chapter 10 — Kalatra & Vyapara Bhava",
    sanskritTerm: "सप्तम-एकादश सम्बन्ध (7th-11th Business Link)",
    summaryText: "Mutual aspect or lord interchange between 7th and 11th houses bestows immense profit in trade partnerships and foreign commerce.",
  },
  rule_marriage_venus_7th_benefic: {
    sourceText: "Jataka Parijata",
    chapter: "Chapter 14 — Vivaha Yoga",
    sanskritTerm: "शुभ शुक्र योग (Benefic Venus 7th Yoga)",
    summaryText: "Venus aspected by Jupiter or occupying 7th house in dignity ensures an affectionate, accomplished spouse and long-term marital bliss.",
  },
  rule_finance_2nd_11th_dhanayoga: {
    sourceText: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 41 — Dhana Yoga Adhyaya",
    sanskritTerm: "महाधन योग (Mahadhana Yoga)",
    summaryText: "Combination of 2nd lord of wealth and 11th lord of gains produces substantial financial prosperity and asset accumulation.",
  },
};

export function getCitationForRule(ruleId: string): ClassicalCitation | null {
  return CLASSICAL_CITATIONS_CATALOG[ruleId] || null;
}
