// ============================================================
// Phase 18 — PDF v2 Meanings, Glossary, FAQ & Appendix Catalog
// ------------------------------------------------------------
// Defines structured content for PDF v2 Sections 25, 26, 27:
// - Frequently Asked Questions (FAQ)
// - Complete Sanskrit Term Glossary
// - Calculation Method Appendix & Ephemeris Information
// ============================================================

export interface PdfFaqItem {
  question: string;
  answer: string;
}

export interface PdfGlossaryItem {
  term: string;
  sanskrit: string;
  category: "Graha" | "Rashi" | "Bhava" | "Varga" | "Yoga/Dosha" | "General";
  definition: string;
}

export const PDF_V2_FAQS: PdfFaqItem[] = [
  {
    question: "What is the difference between Exalted and Debilitated planets?",
    answer: "An Exalted planet (Uchcha) is in its sign of maximum positive expression, strength, and grace. A Debilitated planet (Neecha) is in its sign of lowest strength, requiring conscious effort and specific remedies to harmonize its energy.",
  },
  {
    question: "What does a Retrograde (Vakra) planet mean in a Kundli?",
    answer: "A Retrograde planet appears to move backwards from Earth's viewpoint. Classically, it increases the planet's internal strength (Cheshta Bala) and indicates deep karmic focus on that planet's significations.",
  },
  {
    question: "What is Combustion (Astangata)?",
    answer: "Combustion occurs when a planet is very close to the Sun in degrees. The Sun's intense brightness absorbs the outer light of the planet, requiring internal spiritual focus to manifest that planet's qualities.",
  },
  {
    question: "How do Vimshottari Dashas affect daily life?",
    answer: "Vimshottari Dasha is a 120-year planetary timeline. The Mahadasha (major period) sets the overarching life theme, while the Antardasha (sub-period) highlights specific events during that time.",
  },
  {
    question: "What are Yogas and Doshas?",
    answer: "Yogas are auspicious planetary combinations that grant success, wealth, wisdom, or authority. Doshas are challenging planetary configurations that indicate areas requiring spiritual remedies and conscious growth.",
  },
];

export const PDF_V2_GLOSSARY: PdfGlossaryItem[] = [
  { term: "Lagna", sanskrit: "लग्न", category: "Bhava", definition: "The Ascendant sign rising on the eastern horizon at the exact moment of birth; represents self, body, and vitality." },
  { term: "Rashi", sanskrit: "राशि", category: "Rashi", definition: "Zodiac sign (12 signs from Mesha/Aries to Meena/Pisces)." },
  { term: "Bhava", sanskrit: "भाव", category: "Bhava", definition: "Astrological house (12 houses representing distinct domains of life)." },
  { term: "Graha", sanskrit: "ग्रह", category: "Graha", definition: "Planetary energy point (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)." },
  { term: "Nakshatra", sanskrit: "नक्षत्र", category: "General", definition: "Lunar mansion (27 stellar constellations forming the cosmic background of Vedic astrology)." },
  { term: "Dasha", sanskrit: "दशा", category: "General", definition: "Planetary time period determining when specific natal chart potentials manifest." },
  { term: "Varga", sanskrit: "वर्ग", category: "Varga", definition: "Divisional chart derived by dividing zodiac signs into equal harmonic slices for micro-analysis." },
  { term: "Yuti", sanskrit: "युति", category: "General", definition: "Planetary conjunction (two or more planets occupying the same sign/house)." },
  { term: "Drishti", sanskrit: "दृष्टि", category: "General", definition: "Planetary aspect (influence cast by a planet onto other houses or planets)." },
  { term: "Gochar", sanskrit: "गोचर", category: "General", definition: "Planetary transit (current real-time movement of planets through zodiac signs)." },
];

export const PDF_V2_APPENDIX = {
  ayanamsaSystem: "Chitra Paksha / Lahiri Ayanamsa (Standard Indian Official Ephemeris)",
  houseSystem: "Whole Sign House System (Parashari Classical Standard)",
  ephemerisEngine: "VSOP87 & ELP2000-82 High-Precision Swiss Planetary Ephemeris Engine",
  timeCalculation: "Apparent Sidereal Time (GAST & LST) computed at exact coordinates",
  softwareVersion: "SanatanTools Professional Vedic Astronomy Engine v2.4.0",
};
