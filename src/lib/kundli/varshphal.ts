/**
 * Tajika Varshphal (Annual Horoscope) Calculation & Analysis Engine
 * Computes Age, Muntha House/Sign/Lord, Varshapati (Year Lord),
 * Tajika Sahams (Punya, Vidya, Karma, Dhana), and 12-Month Predictions.
 */

import type { KundliResult } from "./types";

export interface Saham {
  name: string;
  sanskritName: string;
  sign: string;
  house: number;
  meaning: string;
  description: string;
}

export interface MonthlyVarshphal {
  monthNumber: number;
  monthName: string;
  startDate: string;
  endDate: string;
  rulingPlanet: string;
  rashi: string;
  prediction: string;
  focusArea: string;
}

export interface VarshphalResult {
  targetYear: number;
  age: number;
  muntha: {
    house: number;
    sign: string;
    lord: string;
    title: string;
    description: string;
    favourability: "Excellent" | "Good" | "Moderate" | "Challenging";
  };
  varshapati: {
    lord: string;
    title: string;
    strength: string;
    description: string;
  };
  sahams: Saham[];
  monthlyTimeline: MonthlyVarshphal[];
  yearSummary: {
    headline: string;
    career: string;
    finance: string;
    health: string;
    relationship: string;
    remedy: string;
  };
}

const RASHIS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const RASHI_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const MUNTHA_PREDICTIONS: Record<number, { title: string; desc: string; fav: "Excellent" | "Good" | "Moderate" | "Challenging" }> = {
  1: {
    title: "Muntha in 1st House (Tanubhava)",
    desc: "Rise in status, good health, self-realisation, and personal growth. A highly favourable year for new initiatives.",
    fav: "Excellent",
  },
  2: {
    title: "Muntha in 2nd House (Dhanabhava)",
    desc: "Financial growth, family events, and speech impact. Watch out for unnecessary expenditures.",
    fav: "Good",
  },
  3: {
    title: "Muntha in 3rd House (Sahajabhava)",
    desc: "Increased courage, successful short journeys, support from siblings, and creative breakthroughs.",
    fav: "Excellent",
  },
  4: {
    title: "Muntha in 4th House (Sukhabhava)",
    desc: "Domestic focus, property investments, mother's health attention required. Inner peace develops.",
    fav: "Moderate",
  },
  5: {
    title: "Muntha in 5th House (Putrabhava)",
    desc: "Good for education, children, investment returns, and romantic happiness. Creative projects flourish.",
    fav: "Excellent",
  },
  6: {
    title: "Muntha in 6th House (Shatrubhava)",
    desc: "Victory over opponents and health challenges, but requires disciplined work and stress management.",
    fav: "Moderate",
  },
  7: {
    title: "Muntha in 7th House (Jayabhava)",
    desc: "Focus on partnerships, marriage, public dealings, and business travel. Diplomacy yields dividends.",
    fav: "Good",
  },
  8: {
    title: "Muntha in 8th House (Randhrabhava)",
    desc: "Transformative year. Guard health, avoid high-risk financial speculation, focus on spiritual practices.",
    fav: "Challenging",
  },
  9: {
    title: "Muntha in 9th House (Bhagyabhava)",
    desc: "Immense luck, spiritual trips, higher learning, and father's blessings. Major fortune highlights this year.",
    fav: "Excellent",
  },
  10: {
    title: "Muntha in 10th House (Karmabhava)",
    desc: "Career promotions, professional recognition, leadership opportunities, and public acclaim.",
    fav: "Excellent",
  },
  11: {
    title: "Muntha in 11th House (Labhabhava)",
    desc: "Maximum financial gains, fulfillment of desires, social networking success, and wealth accumulation.",
    fav: "Excellent",
  },
  12: {
    title: "Muntha in 12th House (Vyayabhava)",
    desc: "Foreign connections, spiritual isolation, charitable spending. High travel and rest needed.",
    fav: "Challenging",
  },
};

const VARSHAPATI_THEMES: Record<string, { title: string; desc: string }> = {
  Sun: {
    title: "Sun as Year Lord (Surya)",
    desc: "Brings authority, recognition, leadership positions, government support, and vitality.",
  },
  Moon: {
    title: "Moon as Year Lord (Chandra)",
    desc: "Brings emotional stability, public popularity, travel, mother's happiness, and mental peace.",
  },
  Mars: {
    title: "Mars as Year Lord (Mangala)",
    desc: "Brings energy, drive, real estate gains, and athletic vigor. Requires anger management.",
  },
  Mercury: {
    title: "Mercury as Year Lord (Budha)",
    desc: "Brings intellectual success, commercial profits, writing, networking, and skill expansion.",
  },
  Jupiter: {
    title: "Jupiter as Year Lord (Guru)",
    desc: "Brings auspicious events, marriage/births in family, financial abundance, and spiritual wisdom.",
  },
  Venus: {
    title: "Venus as Year Lord (Shukra)",
    desc: "Brings romantic fulfillment, luxury, artistic success, vehicle purchase, and comfort.",
  },
  Saturn: {
    title: "Saturn as Year Lord (Shani)",
    desc: "Brings long-term stability, discipline, karmic rewards, hard work, and foundational growth.",
  },
};

export function calculateVarshphal(kundli: KundliResult, targetYear: number = new Date().getFullYear()): VarshphalResult {
  const birthYear = new Date(kundli.birthDetails.date).getFullYear();
  const age = Math.max(0, targetYear - birthYear);

  // 1. Natal Ascendant
  const ascendantSign = kundli.d1.ascendant.rashi;
  const ascIndex = Math.max(0, RASHIS.indexOf(ascendantSign));

  // 2. Muntha Calculation
  const munthaIndex = (ascIndex + age) % 12;
  const munthaSign = RASHIS[munthaIndex];
  const munthaHouse = (munthaIndex - ascIndex + 12) % 12 + 1;
  const munthaLord = RASHI_LORDS[munthaSign] || "Sun";
  const munthaInfo = MUNTHA_PREDICTIONS[munthaHouse] || MUNTHA_PREDICTIONS[1];

  // 3. Varshapati (Year Lord)
  const varshapatiLord = munthaLord;
  const varshapatiInfo = VARSHAPATI_THEMES[varshapatiLord] || VARSHAPATI_THEMES.Sun;

  // 4. Tajika Sahams
  const sahams: Saham[] = [
    {
      name: "Punya Saham",
      sanskritName: "पुण्य सहम",
      sign: RASHIS[(munthaIndex + 2) % 12],
      house: ((munthaIndex + 2) % 12) + 1,
      meaning: "Fortune, Auspicious Deeds & Spiritual Grace",
      description: "Indicates the level of unexpected blessings, protection from obstacles, and spiritual alignment for the year.",
    },
    {
      name: "Vidya Saham",
      sanskritName: "विद्या सहम",
      sign: RASHIS[(ascIndex + 4) % 12],
      house: ((ascIndex + 4) % 12) + 1,
      meaning: "Education, Skill Mastery & Knowledge",
      description: "Highlights key learning periods, exam/certification success, and mental acuity.",
    },
    {
      name: "Karma Saham",
      sanskritName: "कर्म सहम",
      sign: RASHIS[(ascIndex + 9) % 12],
      house: ((ascIndex + 9) % 12) + 1,
      meaning: "Career Success, Authority & Projects",
      description: "Points to major professional triumphs, new business ventures, and career growth.",
    },
    {
      name: "Dhana Saham",
      sanskritName: "धन सहम",
      sign: RASHIS[(ascIndex + 1) % 12],
      house: ((ascIndex + 1) % 12) + 1,
      meaning: "Wealth Accumulation & Financial Inflow",
      description: "Governs financial liquid gains, savings growth, and profitable investment windows.",
    },
  ];

  // 5. 12-Month Timeline
  const monthPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Sun", "Moon", "Mars", "Mercury", "Jupiter"];
  const monthlyTimeline: MonthlyVarshphal[] = [];

  const returnDate = new Date(targetYear, new Date(kundli.birthDetails.date).getMonth(), new Date(kundli.birthDetails.date).getDate());

  for (let m = 0; m < 12; m++) {
    const mStart = new Date(returnDate);
    mStart.setMonth(mStart.getMonth() + m);
    const mEnd = new Date(mStart);
    mEnd.setMonth(mEnd.getMonth() + 1);

    const rulingPlanet = monthPlanets[m % monthPlanets.length];
    const rashi = RASHIS[(ascIndex + m) % 12];

    const monthName = mStart.toLocaleString("default", { month: "short", year: "numeric" });

    let pred = `Focus on ${rulingPlanet}-ruled domain. Strategic decisions bring positive outcomes.`;
    let focus = "Career & Focus";

    if (rulingPlanet === "Sun") {
      pred = "High energy and professional visibility. Excellent month for leadership and health.";
      focus = "Career & Status";
    } else if (rulingPlanet === "Moon") {
      pred = "Family bonding, emotional balance, and travel. Favourable for public relations.";
      focus = "Family & Peace";
    } else if (rulingPlanet === "Mars") {
      pred = "High ambition and swift execution. Favourable for property and physical fitness.";
      focus = "Action & Energy";
    } else if (rulingPlanet === "Mercury") {
      pred = "Great for financial trade, communication, writing, and networking.";
      focus = "Finance & Learning";
    } else if (rulingPlanet === "Jupiter") {
      pred = "Wisdom, expansion, and spiritual grace. Prosperity and luck highlight this month.";
      focus = "Wealth & Growth";
    } else if (rulingPlanet === "Venus") {
      pred = "Harmony in relationships, creative pursuits, luxury, and social gatherings.";
      focus = "Love & Comfort";
    } else if (rulingPlanet === "Saturn") {
      pred = "Disciplined hard work and long-term planning. Patience brings solid rewards.";
      focus = "Structure & Discipline";
    }

    monthlyTimeline.push({
      monthNumber: m + 1,
      monthName,
      startDate: mStart.toLocaleDateString(),
      endDate: mEnd.toLocaleDateString(),
      rulingPlanet,
      rashi,
      prediction: pred,
      focusArea: focus,
    });
  }

  return {
    targetYear,
    age,
    muntha: {
      house: munthaHouse,
      sign: munthaSign,
      lord: munthaLord,
      title: munthaInfo.title,
      description: munthaInfo.desc,
      favourability: munthaInfo.fav,
    },
    varshapati: {
      lord: varshapatiLord,
      title: varshapatiInfo.title,
      strength: "Strong (High Tajika Bala)",
      description: varshapatiInfo.desc,
    },
    sahams,
    monthlyTimeline,
    yearSummary: {
      headline: `Year ${targetYear} promises significant progress led by ${varshapatiLord} and Muntha in House ${munthaHouse}.`,
      career: `Strong professional momentum with ${varshapatiLord}'s influence, bringing leadership and milestone projects.`,
      finance: `Dhana Saham in ${sahams[3].sign} indicates stable wealth creation and profitable opportunities.`,
      health: `Generally strong vitality. Maintain balanced routines during Saturn month transitions.`,
      relationship: `Venus and Moon monthly cycles highlight domestic harmony and fruitful partnerships.`,
      remedy: `Offer prayers to ${varshapatiLord}'s deity on auspicious days for amplified success throughout the year.`,
    },
  };
}
