// ============================================================
// Kundli PDF — deep-meaning dictionaries (Batch 2)
// ------------------------------------------------------------
// Rule-based content that expands the Yogas / Doshas / Panchang
// / Nakshatra sections into full-fledged reference material.
// Falls back gracefully when a specific key isn't found.
// ============================================================

// ---- Yogas -------------------------------------------------
export interface YogaMeaning {
  effects: string[]; // 3-4 short bullets
  areasOfLife: string; // one-line summary
  remedy?: string; // enhancement guidance if yoga is present
}

export const YOGA_MEANINGS: Record<string, YogaMeaning> = {
  "Ruchaka Yoga": {
    areasOfLife: "Courage · Leadership · Physical vitality",
    effects: [
      "Bold, warrior-like personality with strong physical presence.",
      "Success in defence, sports, engineering, surgery or leadership roles.",
      "Excellent stamina and the ability to protect family and community.",
      "Tendency to command respect — but must guard against impulsiveness.",
    ],
    remedy: "Cultivate patience; recite Hanuman Chalisa on Tuesdays.",
  },
  "Bhadra Yoga": {
    areasOfLife: "Intellect · Communication · Trade",
    effects: [
      "Sharp analytical mind, quick learning, articulate speech.",
      "Success in writing, teaching, media, accountancy, IT and commerce.",
      "Youthful appearance and long-lasting mental clarity.",
      "Strong ethical framework — trusted advisor to peers.",
    ],
    remedy: "Green cloth donation on Wednesdays; recite Vishnu Sahasranama.",
  },
  "Hamsa Yoga": {
    areasOfLife: "Wisdom · Dharma · Prosperity",
    effects: [
      "Philosophical outlook, respect for tradition, teaching ability.",
      "Financial abundance through righteous means; devoted family life.",
      "Attractive personality and refined tastes.",
      "Natural counsellor — people seek your guidance in dharmic matters.",
    ],
    remedy: "Yellow items donation on Thursdays; worship of Guru.",
  },
  "Malavya Yoga": {
    areasOfLife: "Beauty · Luxury · Relationships",
    effects: [
      "Refined aesthetic sense, artistic talent, magnetic charm.",
      "Comfortable material life, vehicles, jewellery, quality living.",
      "Harmonious partnerships and admiration from the opposite sex.",
      "Success in arts, design, hospitality, fashion or entertainment.",
    ],
    remedy: "White/silver donation on Fridays; devotion to Lakshmi.",
  },
  "Shasha Yoga": {
    areasOfLife: "Discipline · Longevity · Endurance",
    effects: [
      "Perseverance and slow-but-steady rise to authority.",
      "Success in administration, real estate, mining, research.",
      "Ability to work with the marginalised; strong sense of justice.",
      "Late-blooming success that outlasts most peers.",
    ],
    remedy: "Black/blue donation on Saturdays; service to elders.",
  },
  "Gaja Kesari Yoga": {
    areasOfLife: "Wisdom · Fame · Wealth",
    effects: [
      "Recognition through wisdom — teacher, mentor or leader.",
      "Financial well-being with generosity toward family.",
      "Long life, good children, respect in society.",
      "Confidence balanced with humility — a signature dignified presence.",
    ],
    remedy: "Feed cows on Mondays; recite Sri Suktam.",
  },
  "Budhaditya Yoga": {
    areasOfLife: "Intellect · Government · Administration",
    effects: [
      "Bright intelligence, communication and authoritative speech.",
      "Success in administration, civil service, medicine, teaching.",
      "Early recognition by superiors and the state.",
      "Must guard against ego eclipsing collaboration.",
    ],
    remedy: "Sun namaskar at sunrise; Aditya Hridayam.",
  },
  "Chandra-Mangal Yoga": {
    areasOfLife: "Wealth · Entrepreneurship · Property",
    effects: [
      "Financial acumen and money-making instincts.",
      "Gains from real estate, trading, textiles, food business.",
      "Strong emotional drive channelled into work.",
      "Must guard against volatile spending or impulsive investments.",
    ],
    remedy: "Charity on full-moon days; donate red items on Tuesdays.",
  },
  "Raj Yoga": {
    areasOfLife: "Authority · Prosperity · Status",
    effects: [
      "Rise to positions of authority through personal effort.",
      "Recognition, awards, and social influence.",
      "Comfortable material life and supportive relationships.",
      "Best results appear during dashas of the involved planets.",
    ],
    remedy: "Regular puja of Ishta Devata; charity in ancestor's name.",
  },
  "Neecha Bhanga Raj Yoga": {
    areasOfLife: "Transformation · Late-life rise · Redemption",
    effects: [
      "Early hardships give way to unexpected success.",
      "Ability to rise from setbacks stronger than before.",
      "Wisdom born from adversity is your greatest asset.",
      "Timing matters — the reversal usually happens in the dispositor's dasha.",
    ],
    remedy: "Consistent karma-yoga; do not abandon effort during setbacks.",
  },
  "Vipreet Raj Yoga": {
    areasOfLife: "Gain from crisis · Legal wins · Hidden wealth",
    effects: [
      "Enemies, litigation and setbacks eventually favour you.",
      "Gains through unconventional or research-oriented paths.",
      "Longevity increases after mid-life challenges are resolved.",
      "Strong healing, occult or investigative capabilities.",
    ],
    remedy: "Rudra Abhishek monthly; service in hospitals or orphanages.",
  },
};

// ---- Doshas ------------------------------------------------
export interface DoshaDetail {
  causes: string[];
  effects: string[];
  cancellations: string[];
  remedies: string[];
}

export const DOSHA_DETAILS: Record<string, DoshaDetail> = {
  "Mangal Dosha": {
    causes: [
      "Mars is placed in the 1st, 2nd, 4th, 7th, 8th or 12th house from Lagna.",
      "The same houses counted from the natal Moon also qualify.",
      "Severity increases when Mars is retrograde or debilitated.",
    ],
    effects: [
      "Delays or friction in marriage; strong-willed spouse selection.",
      "Impulsive decisions; sudden temper flare-ups if unchecked.",
      "Health issues linked to blood, muscles, accidents (only when severe).",
      "Ambition and drive — a positive when consciously channelled.",
    ],
    cancellations: [
      "Mars in own sign (Aries/Scorpio) or exalted in Capricorn.",
      "Jupiter or Moon conjunct or aspecting Mars.",
      "Both partners have Mangal Dosha — the effect nullifies at marriage.",
      "Mars aspected by benefics (Jupiter, Venus, waxing Moon).",
    ],
    remedies: [
      "Hanuman Chalisa daily; visit Hanuman temple on Tuesdays.",
      "Fast on Tuesdays; donate red lentils, jaggery and copper.",
      "Perform Mangal Shanti puja before marriage if severity is high.",
      "Wear red coral only after professional consultation.",
    ],
  },
  "Kaal Sarp Dosha": {
    causes: [
      "All seven visible planets lie between the Rahu–Ketu axis on one side.",
      "Ancestral karmic patterns often surface in the current life.",
      "Twelve classical types exist depending on the axis houses.",
    ],
    effects: [
      "Sudden ups and downs in career or finances.",
      "Delays in marriage, childbirth or property matters.",
      "Vivid dreams of snakes; general anxiety without visible cause.",
      "Once transcended, this yoga can produce great spiritual seekers.",
    ],
    cancellations: [
      "Retrograde Rahu/Ketu with strong Jupiter reduces severity.",
      "Rahu/Ketu in own or friendly sign softens the effect.",
      "Strong 5th and 9th lords indicate ancestral grace.",
    ],
    remedies: [
      "Nag Panchami puja every year; feed milk to Shiva-linga on Mondays.",
      "Recite Maha Mrityunjaya mantra 108 times daily.",
      "Visit Trimbakeshwar / Kalahasti for Kaal Sarp shanti.",
      "Donate to snake-conservation trusts.",
    ],
  },
  "Sade Sati (Natal)": {
    causes: [
      "Natal Saturn is placed in the 12th, 1st or 2nd sign from the natal Moon.",
      "Signals a lifelong Saturnian imprint — not merely a transit phase.",
    ],
    effects: [
      "Emphasis on responsibility, structure and delayed rewards.",
      "Strong sense of duty toward family, work and elders.",
      "Periods of introspection and slow-but-solid material progress.",
      "After the third phase, results consolidate into lasting success.",
    ],
    cancellations: [
      "Saturn exalted in Libra or in own sign softens hardship.",
      "Benefic aspect from Jupiter provides guidance and grace.",
      "Strong 10th house and dashamsa mitigate career delays.",
    ],
    remedies: [
      "Recite Shani Chalisa on Saturdays; light mustard-oil lamp.",
      "Donate black sesame, iron, mustard oil to workers or elderly.",
      "Selfless service in old-age homes or disability care.",
      "Wear blue sapphire only after strict trial period and expert advice.",
    ],
  },
  "Kemadruma Dosha": {
    causes: [
      "No planet (other than Sun) placed in the 2nd or 12th from natal Moon.",
      "No planet conjoined the Moon.",
      "Formally accepted when Moon is also devoid of Kendra support.",
    ],
    effects: [
      "Emotional highs and lows in early life; a need to build inner support.",
      "Financial ups and downs before stability sets in.",
      "Solitude that can be transformed into deep creative or spiritual work.",
      "Cancels significantly if Moon is exalted or aspected by Jupiter.",
    ],
    cancellations: [
      "Full/waxing Moon in a Kendra strongly cancels this dosha.",
      "Any benefic aspect on the Moon reduces severity.",
      "Moon in own sign (Cancer) is a natural mitigator.",
    ],
    remedies: [
      "Chandra mantra on Mondays; offer white flowers to Shiva.",
      "Fast on full-moon days; drink milk from a silver vessel.",
      "Serve mothers, women and children.",
      "Wear pearl only after gemstone trial and expert consultation.",
    ],
  },
  "Guru Chandal Dosha": {
    causes: [
      "Natal Jupiter is conjunct Rahu or Ketu in the same house.",
      "Effect intensifies in dusthana houses (6, 8, 12).",
    ],
    effects: [
      "Unconventional wisdom — may attract unorthodox mentors.",
      "Confusion between traditional and modern belief systems.",
      "Occasional lapses in judgement despite good intentions.",
      "Excellent for research, occult sciences and reformist teaching once channelled.",
    ],
    cancellations: [
      "Jupiter in own sign (Sagittarius/Pisces) or exalted (Cancer).",
      "Strong benefic aspect from Venus or a well-placed Mercury.",
      "Rahu/Ketu retrograde with high dignity softens the effect.",
    ],
    remedies: [
      "Guru mantra on Thursdays; wear yellow.",
      "Donate turmeric, yellow chana dal, books to students.",
      "Regular visit to spiritual masters; avoid instant-guru shortcuts.",
      "Recite Vishnu Sahasranama on Thursdays.",
    ],
  },
};

// ---- Panchang limbs ---------------------------------------
export const TITHI_MEANING: Record<string, string> = {
  Pratipada: "New beginnings, ceremonial starts, seeding of ideas.",
  Dwitiya: "Building relationships, contracts, gentle progress.",
  Tritiya: "Courage and action; excellent for creative launches.",
  Chaturthi: "Removal of obstacles; Ganesha worship favoured.",
  Panchami: "Learning, education, artistic and spiritual pursuits.",
  Shashti: "Strength, valour, health and martial matters.",
  Saptami: "Movement, travel, socialising and change of direction.",
  Ashtami: "Deep transformation, discipline, shakti worship.",
  Navami: "Devotion, dharmic study, connection with divine feminine.",
  Dashami: "Duty, stability, established authority.",
  Ekadashi: "Fasting, purification, moksha-oriented practices.",
  Dwadashi: "Preservation, Vishnu worship, forgiveness.",
  Trayodashi: "Reflection, remedial rituals, Shiva-Rudra worship.",
  Chaturdashi: "Endings, letting go, tantric or ancestral work.",
  Purnima: "Fullness, celebration, expansion, culmination.",
  Amavasya: "Introspection, ancestor rites, deep reset.",
};

export const YOGA_LIMB_MEANING: Record<string, string> = {
  Vishkambha: "Firm resolve; overcoming obstacles by will.",
  Priti: "Loving connection; excellent for relationships.",
  Ayushmana: "Long life, vitality, healing energy.",
  Saubhagya: "Good fortune, comforts, harmonious growth.",
  Shobhana: "Beauty, celebration, auspicious ceremonies.",
  Atiganda: "Caution advised; consult before big decisions.",
  Sukarma: "Right action, service, karmic rewards.",
  Dhriti: "Steadiness, endurance, holding one's ground.",
  Shoola: "Sharpness; friction if impatience isn't guarded.",
  Ganda: "Delays likely; patience is the antidote.",
  Vriddhi: "Growth, expansion, learning and prosperity.",
  Dhruva: "Stability, permanent gains, foundation-building.",
  Vyaghata: "Conflict energy; channel it into disciplined effort.",
  Harshana: "Joy, humour, festivals, uplifting company.",
  Vajra: "Cutting through, strong focus, decisive action.",
  Siddhi: "Fulfilment, mantra siddhi, spiritual attainment.",
  Vyatipata: "Turbulence; postpone new starts if possible.",
  Variyana: "Choice-making, comfort, refined enjoyment.",
  Parigha: "Barriers turn into opportunities with persistence.",
  Shiva: "Auspicious for worship, remedy, and moksha work.",
  Siddha: "Perfection of intent; excellent for accomplishments.",
  Sadhya: "Achievable goals with steady application.",
  Shubha: "Bright, auspicious, favourable to most karyas.",
  Shukla: "Purity, clarity, sattvic activities.",
  Brahma: "Wisdom, creation, higher intellectual pursuits.",
  Aindra: "Royal favour, leadership, big-scale action.",
  Vaidhriti: "Divided attention; simplify, don't over-commit.",
};

export const KARANA_MEANING: Record<string, string> = {
  Bava: "Steady, favourable for starts and health.",
  Balava: "Strong growth; excellent for construction and study.",
  Kaulava: "Friendly, sociable; good for partnerships.",
  Taitila: "Auspicious for ceremonies and beauty-related work.",
  Gara: "Land-related activities, agriculture, real estate.",
  Vanija: "Trade, commerce, negotiation and travel.",
  Vishti: "Bhadra — avoid new starts, ideal for closure work.",
  Shakuni: "Fixed karana; medicine, healing, rest and recovery.",
  Chatushpada: "Cattle, transport, foundational institutional work.",
  Naga: "Fixed karana; occult study, transformation.",
  Kimstughna: "Fixed; excellent for spiritual initiation and sadhana.",
};

// Nakshatra effects — used in panchang narrative
export interface NakshatraMeaning {
  nature: string;
  strengths: string;
  cautions: string;
}
export const NAKSHATRA_MEANING: Record<string, NakshatraMeaning> = {
  Ashwini: {
    nature: "Swift, healing, pioneering",
    strengths: "Medicine, sports, quick learning.",
    cautions: "Impatience, restlessness.",
  },
  Bharani: {
    nature: "Intense, transformative",
    strengths: "Endurance, creative gestation.",
    cautions: "Extremes in likes/dislikes.",
  },
  Krittika: {
    nature: "Sharp, purifying",
    strengths: "Cutting through illusion, disciplined action.",
    cautions: "Critical tongue.",
  },
  Rohini: {
    nature: "Nurturing, sensual, creative",
    strengths: "Art, beauty, growth, luxury.",
    cautions: "Possessiveness.",
  },
  Mrigashira: {
    nature: "Curious, searching",
    strengths: "Research, communication, travel.",
    cautions: "Indecision, wanderlust.",
  },
  Ardra: {
    nature: "Stormy, transformative",
    strengths: "Renewal after grief; deep insight.",
    cautions: "Emotional turbulence.",
  },
  Punarvasu: {
    nature: "Restorative, hopeful",
    strengths: "Return to purity; teaching.",
    cautions: "Repetitive patterns.",
  },
  Pushya: {
    nature: "Nourishing, protective",
    strengths: "Wisdom, stability, priesthood.",
    cautions: "Over-caution.",
  },
  Ashlesha: {
    nature: "Penetrating, hypnotic",
    strengths: "Occult, healing, strategy.",
    cautions: "Deceptive currents.",
  },
  Magha: {
    nature: "Regal, ancestral",
    strengths: "Leadership, tradition, honours.",
    cautions: "Pride.",
  },
  "Purva Phalguni": {
    nature: "Playful, romantic",
    strengths: "Arts, hospitality, partnership.",
    cautions: "Indulgence.",
  },
  "Uttara Phalguni": {
    nature: "Generous, contractual",
    strengths: "Alliances, philanthropy.",
    cautions: "Rigid loyalties.",
  },
  Hasta: {
    nature: "Skilful, dexterous",
    strengths: "Crafts, healing hands, precision work.",
    cautions: "Perfectionism.",
  },
  Chitra: {
    nature: "Brilliant, artistic",
    strengths: "Design, architecture, allure.",
    cautions: "Vanity.",
  },
  Swati: {
    nature: "Independent, adaptive",
    strengths: "Commerce, diplomacy, flexibility.",
    cautions: "Uprootedness.",
  },
  Vishakha: {
    nature: "Determined, goal-oriented",
    strengths: "Achievement, long-term projects.",
    cautions: "Obsessive drive.",
  },
  Anuradha: {
    nature: "Devoted, friendly",
    strengths: "Group leadership, devotion.",
    cautions: "People-pleasing.",
  },
  Jyeshtha: {
    nature: "Elder, protective",
    strengths: "Authority, courage, responsibility.",
    cautions: "Isolation.",
  },
  Mula: {
    nature: "Root-seeking, investigative",
    strengths: "Research, philosophy, healing.",
    cautions: "Uprooting phases.",
  },
  "Purva Ashadha": {
    nature: "Invincible, purifying",
    strengths: "Debate, public speaking, reform.",
    cautions: "Zealotry.",
  },
  "Uttara Ashadha": {
    nature: "Enduring victory",
    strengths: "Long-lasting achievement.",
    cautions: "Slow start.",
  },
  Shravana: {
    nature: "Listening, connecting",
    strengths: "Learning, music, communication.",
    cautions: "Gossip vulnerability.",
  },
  Dhanishta: {
    nature: "Rhythmic, prosperous",
    strengths: "Wealth, music, group action.",
    cautions: "Materialism.",
  },
  Shatabhisha: {
    nature: "Healing, mystical",
    strengths: "Medicine, research, secrets.",
    cautions: "Isolation.",
  },
  "Purva Bhadrapada": {
    nature: "Fiery, unconventional",
    strengths: "Transformation, occult, reform.",
    cautions: "Anxiety.",
  },
  "Uttara Bhadrapada": {
    nature: "Depth, wisdom",
    strengths: "Compassion, mysticism.",
    cautions: "Withdrawal.",
  },
  Revati: {
    nature: "Nourishing, transitional",
    strengths: "Care, art, spiritual guidance.",
    cautions: "Over-sensitivity.",
  },
};

// Convenient fallback used by PDF when a key is missing.
export function safeMeaning<T>(dict: Record<string, T>, key: string | undefined): T | undefined {
  if (!key) return undefined;
  return dict[key];
}
