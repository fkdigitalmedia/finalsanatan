// ============================================================
// Phase 21 — Astrology Learning Engine & Pronunciation Glossary
// ------------------------------------------------------------
// Provides "Learn Why" educational content explaining fundamental concepts:
// - Lagna, Nakshatra, Bhava, Yoga, Dosha, Dasha, Transit
// - Sanskrit Glossary with Pronunciation Guides
// ============================================================

export interface EducationalModule {
  concept: string;
  sanskrit: string;
  pronunciation: string;
  simpleExplanation: string;
  whyItMatters: string;
}

export const ASTROLOGY_LEARNING_MODULES: EducationalModule[] = [
  {
    concept: "Lagna (Ascendant)",
    sanskrit: "लग्न",
    pronunciation: "Luhg-nuh",
    simpleExplanation: "The exact zodiac sign rising on the eastern horizon at the moment of your birth.",
    whyItMatters: "Determines your physical appearance, vitality, core personality traits, and overall life direction.",
  },
  {
    concept: "Janma Nakshatra (Lunar Mansion)",
    sanskrit: "जन्म नक्षत्र",
    pronunciation: "Juhn-muh Nuk-shuh-truh",
    simpleExplanation: "The stellar constellation occupied by the Moon at birth.",
    whyItMatters: "Sets your emotional mindset, natural talents, and Vimshottari Dasha timeline.",
  },
  {
    concept: "Bhava (Astrological House)",
    sanskrit: "भाव",
    pronunciation: "Bhaa-vuh",
    simpleExplanation: "One of the 12 divisions of the horoscope representing specific life arenas (e.g. 1st House = Self, 10th House = Career).",
    whyItMatters: "Shows where planetary energies manifest in your daily life.",
  },
  {
    concept: "Yoga (Planetary Combination)",
    sanskrit: "योग",
    pronunciation: "Yoh-guh",
    simpleExplanation: "Special planetary alignments that create auspicious outcomes like wealth, wisdom, or authority.",
    whyItMatters: "Unlocks peak potential during specific planetary Dasha cycles.",
  },
  {
    concept: "Dosha (Planetary Affliction)",
    sanskrit: "दोष",
    pronunciation: "Doh-shuh",
    simpleExplanation: "Challenging planetary configurations indicating areas requiring conscious effort and spiritual remedies.",
    whyItMatters: "Highlights life areas needing protective mantras, charity, and lifestyle adjustments.",
  },
  {
    concept: "Vimshottari Dasha (Planetary Timeline)",
    sanskrit: "विंशोत्तरी दशा",
    pronunciation: "Vim-shoh-tuh-ree Duh-shaa",
    simpleExplanation: "A 120-year planetary time sequence determining when chart potentials activate.",
    whyItMatters: "Explains timing of career promotions, marriage windows, and financial milestones.",
  },
];
