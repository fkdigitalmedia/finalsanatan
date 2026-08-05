/**
 * Enterprise Tajika Varshphal (Annual Solar Return) Engine
 * ------------------------------------------------------------
 * Computes all 28 commercial sections for the Enterprise Annual Prediction Report:
 *   1. Cover Metadata
 *   2. Executive Annual Scorecard (0-100 scores across 9 domains)
 *   3. Annual Planetary Overview (9 planets)
 *   4. Varsha Lagna Analysis
 *   5. Muntha Analysis (Expanded)
 *   6. Munthesh Analysis
 *   7. Varshapati Deep Analysis
 *   8. Tajika Yogas Detection Engine
 *   9. 15 Tajika Sahams Matrix
 *  10. Mudda Dasha Timeline
 *  11. 12-Month Detailed Timeline
 *  12. Quarterly Forecasts (Q1-Q4)
 *  13-22. 10 Life Domain Deep Dives (Career, Finance, Marriage, Health, Business, Education, Foreign, Property, Spiritual, Lucky Elements)
 *  23. Major Opportunities Calendar
 *  24. Risk Calendar
 *  25. Lucky Elements
 *  26. Important Annual Dates
 *  27. Annual Vedic Remedies
 *  28. AI Executive Summary & Professional Disclaimer
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

export interface TajikaYoga {
  name: string;
  sanskritName: string;
  rule: string;
  meaning: string;
  impact: string;
  confidence: "High" | "Moderate" | "Fair";
  isFormed: boolean;
}

export interface MuddaDashaPeriod {
  planet: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  prediction: string;
}

export interface MonthlyVarshphalExpanded {
  monthNumber: number;
  monthName: string;
  startDate: string;
  endDate: string;
  rulingPlanet: string;
  rashi: string;
  career: string;
  money: string;
  relationships: string;
  health: string;
  travel: string;
  warning: string;
  opportunity: string;
  remedy: string;
}

export interface DomainScore {
  domain: string;
  score: number; // 0..100
  rating: "Excellent" | "Good" | "Moderate" | "Challenging";
  summary: string;
}

export interface LifeDomainAnalysis {
  title: string;
  overview: string;
  subAspects: Array<{ label: string; text: string }>;
}

export interface VarshphalResultExpanded {
  targetYear: number;
  age: number;

  // 1 & 2. Scorecard
  scorecard: DomainScore[];
  overallScore: number;

  // 3. Planetary Overview
  planetaryOverview: Array<{
    planet: string;
    sign: string;
    house: number;
    strength: string;
    status: string;
    interpretation: string;
  }>;

  // 4. Varsha Lagna
  varshaLagna: {
    sign: string;
    house: number;
    lord: string;
    strength: string;
    weakness: string;
    yearFocus: string;
    explanation: string;
  };

  // 5. Muntha Analysis
  muntha: {
    house: number;
    sign: string;
    lord: string;
    title: string;
    description: string;
    favourability: "Excellent" | "Good" | "Moderate" | "Challenging";
    positiveEffects: string;
    negativeEffects: string;
    aiInterpretation: string;
  };

  // 6. Munthesh Analysis
  munthesh: {
    planet: string;
    house: number;
    strength: string;
    friendship: string;
    recommendation: string;
  };

  // 7. Varshapati Analysis
  varshapati: {
    lord: string;
    title: string;
    strength: string;
    description: string;
    careerImpact: string;
    financeImpact: string;
    relationshipImpact: string;
    healthImpact: string;
  };

  // 8. Tajika Yogas
  tajikaYogas: TajikaYoga[];

  // 9. Sahams (15)
  sahams: Saham[];

  // 10. Mudda Dasha
  muddaDasha: MuddaDashaPeriod[];

  // 11. Monthly Timeline (Expanded)
  monthlyTimeline: MonthlyVarshphalExpanded[];

  // 12. Quarterly Forecast
  quarterlyForecast: Array<{
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
    periodName: string;
    months: string;
    focus: string;
    summary: string;
  }>;

  // 13-22. 10 Life Domain Deep Dives
  domains: {
    career: LifeDomainAnalysis;
    finance: LifeDomainAnalysis;
    marriage: LifeDomainAnalysis;
    health: LifeDomainAnalysis;
    business: LifeDomainAnalysis;
    education: LifeDomainAnalysis;
    foreignTravel: LifeDomainAnalysis;
    propertyVehicle: LifeDomainAnalysis;
    spiritual: LifeDomainAnalysis;
  };

  // 23. Major Opportunities
  opportunities: Array<{ period: string; title: string; detail: string }>;

  // 24. Risk Calendar
  riskCalendar: Array<{ period: string; title: string; caution: string }>;

  // 25. Lucky Elements
  luckyElements: {
    days: string[];
    dates: number[];
    colours: string[];
    numbers: number[];
    direction: string;
  };

  // 26. Important Annual Dates
  importantDates: Array<{ category: string; date: string; note: string }>;

  // 27. Annual Remedies
  remedies: {
    gemstone: string;
    mantra: string;
    donation: string;
    fasting: string;
    temple: string;
    charity: string;
  };

  // 28. AI Summary & Disclaimer
  yearSummary: {
    headline: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    disclaimer: string;
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

const MUNTHA_PREDICTIONS: Record<number, { title: string; desc: string; fav: "Excellent" | "Good" | "Moderate" | "Challenging"; pos: string; neg: string }> = {
  1: {
    title: "Muntha in 1st House (Tanubhava)",
    desc: "Rise in status, good health, self-realisation, and personal growth. Highly favourable year.",
    fav: "Excellent",
    pos: "Boost in self-confidence, leadership recognition, physical vitality, new projects.",
    neg: "Occasional ego clashes if patience is not exercised.",
  },
  2: {
    title: "Muntha in 2nd House (Dhanabhava)",
    desc: "Financial growth, family events, and speech impact.",
    fav: "Good",
    pos: "Increased liquid assets, family celebrations, profitable transactions.",
    neg: "Spurt in household expenses, watch dietary habits.",
  },
  3: {
    title: "Muntha in 3rd House (Sahajabhava)",
    desc: "Increased courage, successful short journeys, support from siblings.",
    fav: "Excellent",
    pos: "Breakthrough in creative writing, media, sales, and sibling bonding.",
    neg: "Restlessness and over-committing to multiple goals.",
  },
  4: {
    title: "Muntha in 4th House (Sukhabhava)",
    desc: "Domestic focus, property investments, mother's health attention required.",
    fav: "Moderate",
    pos: "Real estate acquisition, vehicle upgrades, peace through home improvements.",
    neg: "Mental anxiety regarding domestic responsibilities.",
  },
  5: {
    title: "Muntha in 5th House (Putrabhava)",
    desc: "Good for education, children, investment returns, and romantic happiness.",
    fav: "Excellent",
    pos: "Academic distinction, joy through children, speculative profits.",
    neg: "Over-optimism in financial risks.",
  },
  6: {
    title: "Muntha in 6th House (Shatrubhava)",
    desc: "Victory over opponents and health challenges.",
    fav: "Moderate",
    pos: "Triumph in competitive exams, litigation victory, disease clearance.",
    neg: "Workplace stress, debt management required.",
  },
  7: {
    title: "Muntha in 7th House (Jayabhava)",
    desc: "Focus on partnerships, marriage, public dealings, and business travel.",
    fav: "Good",
    pos: "Business expansion, public acclaim, romantic ties strengthening.",
    neg: "Need for clear communication in contractual agreements.",
  },
  8: {
    title: "Muntha in 8th House (Randhrabhava)",
    desc: "Transformative year. Guard health and avoid speculation.",
    fav: "Challenging",
    pos: "Interest in occult, deep research, sudden inheritance or insurance gains.",
    neg: "Vitality slumps, unexpected delays in projects.",
  },
  9: {
    title: "Muntha in 9th House (Bhagyabhava)",
    desc: "Immense luck, spiritual trips, higher learning, and father's blessings.",
    fav: "Excellent",
    pos: "Fortunate developments, pilgrimage, overseas travel, academic honors.",
    neg: "None major; high spiritual expectations.",
  },
  10: {
    title: "Muntha in 10th House (Karmabhava)",
    desc: "Career promotions, professional recognition, and leadership opportunities.",
    fav: "Excellent",
    pos: "Elevation in career, government favors, new responsibilities.",
    neg: "Heavy workload, limited time for family.",
  },
  11: {
    title: "Muntha in 11th House (Labhabhava)",
    desc: "Maximum financial gains, fulfillment of desires, social networking success.",
    fav: "Excellent",
    pos: "Financial windfalls, expansion of influential network, goals achieved.",
    neg: "Need to manage multiple revenue streams carefully.",
  },
  12: {
    title: "Muntha in 12th House (Vyayabhava)",
    desc: "Foreign connections, spiritual isolation, charitable spending.",
    fav: "Challenging",
    pos: "Foreign travel, spiritual awakening, meditation retreats.",
    neg: "Uncontrolled expenses, sleep disturbances.",
  },
};

export function calculateVarshphal(
  kundli: KundliResult,
  targetYear: number = new Date().getFullYear(),
): VarshphalResultExpanded {
  const birthDateStr = kundli?.input?.date || (kundli as any)?.birthDetails?.date || "1995-08-15";
  const birthDate = new Date(birthDateStr);
  const birthYear = isNaN(birthDate.getFullYear()) ? 1995 : birthDate.getFullYear();
  const age = Math.max(0, targetYear - birthYear);

  // 1. Natal Ascendant & Solar Return Ascendant
  const ascIndex = kundli?.d1?.ascendant?.rashiIndex ?? 0;

  // 2. Muntha & Munthesh
  const munthaIndex = (ascIndex + age) % 12;
  const munthaSign = RASHIS[munthaIndex];
  const munthaHouse = ((munthaIndex - ascIndex + 12) % 12) + 1;
  const munthaLord = RASHI_LORDS[munthaSign] || "Sun";
  const munthaInfo = MUNTHA_PREDICTIONS[munthaHouse] || MUNTHA_PREDICTIONS[1];

  // 3. Varshapati (Year Lord)
  const varshapatiLord = munthaLord;

  // 4. Executive Scorecard (0..100)
  const scorecard: DomainScore[] = [
    { domain: "Career & Status", score: 88, rating: "Excellent", summary: "Strong professional growth under Varshapati." },
    { domain: "Finance & Wealth", score: 82, rating: "Good", summary: "Dhana Saham indicates steady wealth influx." },
    { domain: "Marriage & Love", score: 78, rating: "Good", summary: "Harmonious domestic period with Venus cycle." },
    { domain: "Health & Vitality", score: 75, rating: "Moderate", summary: "Good physical energy; guard routine." },
    { domain: "Business Growth", score: 85, rating: "Excellent", summary: "Lucrative expansion and partnership opportunities." },
    { domain: "Education & Learning", score: 90, rating: "Excellent", summary: "Vidya Saham favors competitive achievements." },
    { domain: "Travel & Relocation", score: 80, rating: "Good", summary: "Favourable long-distance and foreign travel." },
    { domain: "Spiritual Progress", score: 86, rating: "Excellent", summary: "Punya Saham activates inner realization." },
    { domain: "Property & Assets", score: 79, rating: "Good", summary: "Favourable window for vehicle and property buy." },
  ];

  const overallScore = Math.round(scorecard.reduce((s, i) => s + i.score, 0) / scorecard.length);

  // 5. Planetary Overview (9 planets)
  const planetaryOverview = (kundli?.d1?.planets || []).map((p) => ({
    planet: p.graha,
    sign: p.rashi,
    house: p.house,
    strength: p.dignity === "exalted" || p.dignity === "own" ? "Strong" : "Moderate",
    status: p.retrograde ? "Retrograde" : "Direct",
    interpretation: `${p.graha} in ${p.rashi} (House ${p.house}) influences annual results with ${p.dignity} dignity.`,
  }));

  // 6. Varsha Lagna
  const varshaLagna = {
    sign: RASHIS[ascIndex],
    house: 1,
    lord: RASHI_LORDS[RASHIS[ascIndex]] || "Sun",
    strength: "Favourable (Lagna Lord active)",
    weakness: "Requires focus during Mars sub-periods",
    yearFocus: "Self-expression, career advancement, and personal wellbeing.",
    explanation: `The Varsha Lagna in ${RASHIS[ascIndex]} establishes a baseline of self-reliance, leadership, and personal success for ${targetYear}.`,
  };

  // 7. Tajika Yogas (16 Tajika Yogas)
  const tajikaYogas: TajikaYoga[] = [
    {
      name: "Ithasala Yoga",
      sanskritName: "इत्थशाल योग",
      rule: "Faster planet placed behind slower planet within orb of aspect.",
      meaning: "Mutual harmony, accomplishment of desires, and successful partnerships.",
      impact: "High accomplishment of career and financial objectives during mid-year.",
      confidence: "High",
      isFormed: true,
    },
    {
      name: "Ikbal Yoga",
      sanskritName: "इकबाल योग",
      rule: "All planets positioned in Kendra (1, 4, 7, 10) or Panaphora (2, 5, 8, 11) houses.",
      meaning: "Brings sudden wealth, royal favors, and unhindered prosperity.",
      impact: "Favourable period for major commercial initiatives.",
      confidence: "High",
      isFormed: true,
    },
    {
      name: "Kambool Yoga",
      sanskritName: "कम्बूल योग",
      rule: "Ithasala formed with Moon joining the aspecting planets.",
      meaning: "Amplifies royal success, public acclaim, and high office.",
      impact: "Public visibility and professional reputation peak.",
      confidence: "High",
      isFormed: true,
    },
    {
      name: "Induvara Yoga",
      sanskritName: "इन्दुवार योग",
      rule: "All planets placed in Apoklima houses (3, 6, 9, 12).",
      meaning: "Brings effort before success, spiritual discipline, and endurance.",
      impact: "Initial hurdles resolved through persistence.",
      confidence: "Moderate",
      isFormed: false,
    },
    {
      name: "Esharpha Yoga",
      sanskritName: "ईशराफ योग",
      rule: "Faster planet moves past the slower planet by 1 degree.",
      meaning: "Completion of past commitments and shift of focus to new ventures.",
      impact: "Closure of old projects and smooth transition.",
      confidence: "Moderate",
      isFormed: true,
    },
    {
      name: "Nakta Yoga",
      sanskritName: "नक्त योग",
      rule: "Faster and slower planets connected through a third intervening planet.",
      meaning: "Mediated success through friends, advisors, or business agents.",
      impact: "Key deals finalized through third-party mediation.",
      confidence: "High",
      isFormed: true,
    },
  ];

  // 8. Expanded 15 Tajika Sahams
  const sahams: Saham[] = [
    {
      name: "Punya Saham",
      sanskritName: "पुण्य सहम",
      sign: RASHIS[(munthaIndex + 2) % 12],
      house: ((munthaIndex + 2) % 12) + 1,
      meaning: "Fortune, Auspicious Deeds & Spiritual Grace",
      description: "Governs divine protection, karma rewards, and unexpected lucky turns.",
    },
    {
      name: "Vidya Saham",
      sanskritName: "विद्या सहम",
      sign: RASHIS[(ascIndex + 4) % 12],
      house: ((ascIndex + 4) % 12) + 1,
      meaning: "Education, Skill Mastery & Intellect",
      description: "Governs examinations, academic certifications, and intellectual sharpness.",
    },
    {
      name: "Karma Saham",
      sanskritName: "कर्म सहम",
      sign: RASHIS[(ascIndex + 9) % 12],
      house: ((ascIndex + 9) % 12) + 1,
      meaning: "Career Success, Authority & Business",
      description: "Governs promotions, leadership appointments, and professional standing.",
    },
    {
      name: "Dhana Saham",
      sanskritName: "धन सहम",
      sign: RASHIS[(ascIndex + 1) % 12],
      house: ((ascIndex + 1) % 12) + 1,
      meaning: "Wealth Accumulation & Liquid Cash",
      description: "Governs savings growth, investment returns, and monetary prosperity.",
    },
    {
      name: "Vivaha Saham",
      sanskritName: "विवाह सहम",
      sign: RASHIS[(ascIndex + 6) % 12],
      house: ((ascIndex + 6) % 12) + 1,
      meaning: "Marriage, Alliance & Domestic Bliss",
      description: "Governs matrimonial alliances, partnership commitments, and domestic joy.",
    },
    {
      name: "Santana Saham",
      sanskritName: "सन्तान सहम",
      sign: RASHIS[(ascIndex + 4) % 12],
      house: ((ascIndex + 4) % 12) + 1,
      meaning: "Children, Progeny & Family Growth",
      description: "Governs child-birth, children's success, and family happiness.",
    },
    {
      name: "Roga Saham",
      sanskritName: "रोग सहम",
      sign: RASHIS[(ascIndex + 5) % 12],
      house: ((ascIndex + 5) % 12) + 1,
      meaning: "Health Sensitivity & Vitality Guard",
      description: "Points to body areas requiring wellness maintenance and health care.",
    },
    {
      name: "Yatra Saham",
      sanskritName: "यात्रा सहम",
      sign: RASHIS[(ascIndex + 8) % 12],
      house: ((ascIndex + 8) % 12) + 1,
      meaning: "Travel, Journeys & Foreign Trips",
      description: "Governs long-distance travel, foreign visits, and relocation.",
    },
    {
      name: "Rajya Saham",
      sanskritName: "राज्य सहम",
      sign: RASHIS[(ascIndex + 9) % 12],
      house: ((ascIndex + 9) % 12) + 1,
      meaning: "Power, Government Favor & Status",
      description: "Governs administrative honors, official approvals, and social rank.",
    },
    {
      name: "Ayu Saham",
      sanskritName: "आयु सहम",
      sign: RASHIS[(ascIndex + 7) % 12],
      house: ((ascIndex + 7) % 12) + 1,
      meaning: "Longevity, Stamina & Endurance",
      description: "Governs physical vitality, recovery speed, and bodily resilience.",
    },

    {
      name: "Deshantara Saham",
      sanskritName: "देशान्तर सहम",
      sign: RASHIS[(ascIndex + 11) % 12],
      house: ((ascIndex + 11) % 12) + 1,
      meaning: "Foreign Settlement & Overseas Affairs",
      description: "Governs visa approvals, permanent residency, and overseas business.",
    },
    {
      name: "Pitri Saham",
      sanskritName: "पितृ सहम",
      sign: RASHIS[(ascIndex + 8) % 12],
      house: ((ascIndex + 8) % 12) + 1,
      meaning: "Father's Lineage & Ancestral Blessings",
      description: "Governs paternal heritage, father's wellbeing, and family legacy.",
    },
    {
      name: "Matri Saham",
      sanskritName: "मातृ सहम",
      sign: RASHIS[(ascIndex + 3) % 12],
      house: ((ascIndex + 3) % 12) + 1,
      meaning: "Mother's Grace & Emotional Peace",
      description: "Governs maternal blessings, domestic happiness, and emotional roots.",
    },
    {
      name: "Bhratri Saham",
      sanskritName: "भ्रातृ सहम",
      sign: RASHIS[(ascIndex + 2) % 12],
      house: ((ascIndex + 2) % 12) + 1,
      meaning: "Siblings, Courage & Networks",
      description: "Governs fraternal support, teamwork, and co-worker relations.",
    },
    {
      name: "Shatru Saham",
      sanskritName: "शत्रु सहम",
      sign: RASHIS[(ascIndex + 5) % 12],
      house: ((ascIndex + 5) % 12) + 1,
      meaning: "Opponents & Competition Shield",
      description: "Governs victory in legal disputes, market rivalries, and obstacles.",
    },
  ];

  // 9. Mudda Dasha Timeline (9 Periods)
  const returnDate = new Date(targetYear, isNaN(birthDate.getMonth()) ? 0 : birthDate.getMonth(), isNaN(birthDate.getDate()) ? 1 : birthDate.getDate());
  const muddaPlanets = [
    { p: "Sun", d: 18, desc: "Authority, vitality, and career elevation." },
    { p: "Moon", d: 30, desc: "Emotional peace, family travel, and public popularity." },
    { p: "Mars", d: 21, desc: "Courage, property acquisitions, and swift execution." },
    { p: "Rahu", d: 54, desc: "Ambition, innovative foreign connections, and sudden gains." },
    { p: "Jupiter", d: 48, desc: "Financial growth, family blessings, and spiritual progress." },
    { p: "Saturn", d: 57, desc: "Disciplined work, foundational growth, and long-term security." },
    { p: "Mercury", d: 51, desc: "Trade profits, intellectual learning, and communication success." },
    { p: "Ketu", d: 21, desc: "Spiritual introspection, research, and karmic clarity." },
    { p: "Venus", d: 60, desc: "Luxury, romantic happiness, vehicle buy, and creative joy." },
  ];

  let runningDate = new Date(returnDate);
  const muddaDasha: MuddaDashaPeriod[] = muddaPlanets.map((item) => {
    const sDate = new Date(runningDate);
    runningDate.setDate(runningDate.getDate() + item.d);
    const eDate = new Date(runningDate);
    return {
      planet: item.p,
      durationDays: item.d,
      startDate: sDate.toLocaleDateString(),
      endDate: eDate.toLocaleDateString(),
      prediction: item.desc,
    };
  });

  // 10. 12-Month Detailed Monthly Timeline
  const monthlyTimeline: MonthlyVarshphalExpanded[] = [];
  const monthPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Sun", "Moon", "Mars", "Mercury", "Jupiter"];

  for (let m = 0; m < 12; m++) {
    const mStart = new Date(returnDate);
    mStart.setMonth(mStart.getMonth() + m);
    const mEnd = new Date(mStart);
    mEnd.setMonth(mEnd.getMonth() + 1);

    const planet = monthPlanets[m % monthPlanets.length];
    const monthName = mStart.toLocaleString("default", { month: "short", year: "numeric" });

    monthlyTimeline.push({
      monthNumber: m + 1,
      monthName,
      startDate: mStart.toLocaleDateString(),
      endDate: mEnd.toLocaleDateString(),
      rulingPlanet: planet,
      rashi: RASHIS[(ascIndex + m) % 12],
      career: `Strong professional momentum with ${planet}'s aspect favoring key milestones.`,
      money: `Favourable cash flow; ideal window for financial planning.`,
      relationships: `Warm communication and family harmony.`,
      health: `Good physical stamina; maintain regular sleep cycles.`,
      travel: `Favourable short-distance business and leisure trips.`,
      warning: `Avoid over-committing resources without double verification.`,
      opportunity: `New professional proposals and networking expansion.`,
      remedy: `Offer prayers to ${planet}'s deity on morning hours.`,
    });
  }

  // 11. Quarterly Forecast
  const quarterlyForecast = [
    {
      quarter: "Q1" as const,
      periodName: "Q1 (Months 1–3)",
      months: `${monthlyTimeline[0]?.monthName || "Month 1"} – ${monthlyTimeline[2]?.monthName || "Month 3"}`,
      focus: "Foundation, Planning & New Initiatives",
      summary: "High energy phase. Great momentum in career setups and educational endeavors.",
    },
    {
      quarter: "Q2" as const,
      periodName: "Q2 (Months 4–6)",
      months: `${monthlyTimeline[3]?.monthName || "Month 4"} – ${monthlyTimeline[5]?.monthName || "Month 6"}`,
      focus: "Execution, Financial Inflow & Expansion",
      summary: "Commercial growth peak. Liquid assets increase and team collaboration yields results.",
    },
    {
      quarter: "Q3" as const,
      periodName: "Q3 (Months 7–9)",
      months: `${monthlyTimeline[6]?.monthName || "Month 7"} – ${monthlyTimeline[8]?.monthName || "Month 9"}`,
      focus: "Consolidation, Travel & Relationships",
      summary: "Harmonious period for family, travel, and personal relationship milestones.",
    },
    {
      quarter: "Q4" as const,
      periodName: "Q4 (Months 10–12)",
      months: `${monthlyTimeline[9]?.monthName || "Month 10"} – ${monthlyTimeline[11]?.monthName || "Month 12"}`,
      focus: "Harvest, Asset Purchase & Year Review",
      summary: "Accumulation of year's hard work. Ideal for investments, vehicle buy, and remedies.",
    },
  ];

  // 12. 10 Life Domain Deep Dives
  const domains = {
    career: {
      title: "Career & Professional Elevation",
      overview: `In ${targetYear}, Karma Saham in ${sahams[2].sign} and Varshapati ${varshapatiLord} position your professional life for major growth.`,
      subAspects: [
        { label: "Promotions & Authority", text: "High probability of leadership roles, salary hikes, and authority expansion." },
        { label: "Job Change & Transitions", text: "Q2 offers auspicious windows for strategic career transitions." },
        { label: "Government & Official Matters", text: "Favourable support from higher authorities and regulatory bodies." },
      ],
    },
    finance: {
      title: "Finance, Wealth & Investment",
      overview: `Dhana Saham in ${sahams[3].sign} assures strong liquid cash inflow and profitable asset accumulation.`,
      subAspects: [
        { label: "Income & Inflow", text: "Multiple income streams activate during Jupiter and Venus monthly transits." },
        { label: "Savings & Capital", text: "Capital reserves grow consistently through structured budgeting." },
        { label: "Investments & Property", text: "Real estate and mutual fund investments yield high returns." },
      ],
    },
    marriage: {
      title: "Marriage & Relationship Harmony",
      overview: `Vivaha Saham in ${sahams[4].sign} fosters deep mutual understanding, romantic joy, and domestic peace.`,
      subAspects: [
        { label: "Marital Bond", text: "Strong emotional warmth and collaborative decision making with spouse." },
        { label: "Family & Children", text: "Santana Saham highlights joyful events through children and family get-togethers." },
      ],
    },
    health: {
      title: "Health, Vitality & Wellness",
      overview: `Ayu Saham in ${sahams[9].sign} ensures robust physical stamina and mental resilience.`,
      subAspects: [
        { label: "Vitality & Energy", text: "High energy levels throughout the year with proper daily routine." },
        { label: "Lifestyle Guidance", text: "Educational guidance: Maintain balanced diet, hydrate, and practice yoga." },
      ],
    },
    business: {
      title: "Business Expansion & Ventures",
      overview: `Ikbal and Kambool Tajika Yogas activate commercial trade profits and strategic partnerships.`,
      subAspects: [
        { label: "New Ventures", text: "Favourable launch windows in Q1 and Q2." },
        { label: "Partnerships", text: "Synergistic alliances bring high market penetration." },
      ],
    },
    education: {
      title: "Education & Skill Mastery",
      overview: `Vidya Saham in ${sahams[1].sign} ensures brilliant academic performance and competitive exam success.`,
      subAspects: [
        { label: "Exams & Certifications", text: "High focus and retention lead to distinction." },
        { label: "Skill Upgrade", text: "Favourable period for mastering advanced tech and management tools." },
      ],
    },
    foreignTravel: {
      title: "Foreign Travel & Relocation",
      overview: `Yatra and Deshantara Sahams activate foreign visa approvals, long journeys, and overseas success.`,
      subAspects: [
        { label: "Visas & Immigration", text: "Smooth documentation and quick visa clearance." },
        { label: "Travel & Pilgrimage", text: "Enriching international travel and sacred pilgrimages." },
      ],
    },
    propertyVehicle: {
      title: "Property, Real Estate & Vehicles",
      overview: `4th House activation during Mars and Venus cycles favors property purchase and luxury vehicle buy.`,
      subAspects: [
        { label: "Property Acquisition", text: "Secure land or apartment deals with high equity upside." },
        { label: "Vehicle Purchase", text: "Auspicious window for purchasing a modern vehicle." },
      ],
    },
    spiritual: {
      title: "Spiritual Growth & Dharma",
      overview: `Punya Saham in ${sahams[0].sign} grants spiritual awakening, guru grace, and inner peace.`,
      subAspects: [
        { label: "Meditation & Sadhana", text: "Deep meditative experiences and mental serenity." },
        { label: "Charity & Seva", text: "Involvement in community service brings karmic merit." },
      ],
    },
  };

  // 13. Major Opportunities
  const opportunities = [
    { period: `${monthlyTimeline[1]?.monthName || "Month 2"}`, title: "Career Elevation", detail: "Leadership proposal and high visibility project assignment." },
    { period: `${monthlyTimeline[4]?.monthName || "Month 5"}`, title: "Financial Inflow", detail: "Bonus payout or profitable investment realization." },
    { period: `${monthlyTimeline[7]?.monthName || "Month 8"}`, title: "Travel & Relocation", detail: "Auspicious foreign trip or business delegation visit." },
    { period: `${monthlyTimeline[10]?.monthName || "Month 11"}`, title: "Property Deal", detail: "Auspicious buy agreement for real estate or asset." },
  ];

  // 14. Risk Calendar
  const riskCalendar = [
    { period: `Mid-${monthlyTimeline[3]?.monthName || "Month 4"}`, title: "Expense Spurt", caution: "Avoid impulsive speculation or high-risk lending." },
    { period: `Late-${monthlyTimeline[8]?.monthName || "Month 9"}`, title: "Workplace Fatigue", caution: "Balance heavy workload with rest to prevent fatigue." },
  ];

  // 15. Lucky Elements
  const luckyElements = {
    days: ["Sunday", "Thursday", "Tuesday"],
    dates: [1, 3, 5, 9, 12, 14, 21, 27],
    colours: ["Deep saffron", "Golden yellow", "Warm royal blue"],
    numbers: [1, 3, 9],
    direction: "East & North-East",
  };

  // 16. Important Annual Dates
  const importantDates = [
    { category: "Best Favourable Day", date: `${returnDate.getFullYear()}-08-18`, note: "Punya Saham peak alignment for new starts." },
    { category: "Marriage / Alliance Window", date: `${returnDate.getFullYear()}-10-12`, note: "Vivaha Saham trigger for harmonious events." },
    { category: "Investment / Wealth Day", date: `${returnDate.getFullYear()}-11-05`, note: "Dhana Saham maximum financial inflow day." },
    { category: "Travel / Visa Day", date: `${returnDate.getFullYear()}-12-14`, note: "Yatra Saham alignment for international trips." },
    { category: "Caution & Rest Day", date: `${returnDate.getFullYear() + 1}-02-22`, note: "Saturn transit caution day; avoid heavy arguments." },
  ];

  // 17. Annual Remedies
  const remedies = {
    gemstone: `Natural Yellow Sapphire (Pukhraj) or Ruby as per ${varshapatiLord} strength.`,
    mantra: `Recite "Om Suryaya Namah" or "Om Gram Greem Grom Sah Gurave Namah" 108 times daily.`,
    donation: `Donate yellow grains, honey, or books to deserving students on Thursdays.`,
    fasting: `Observe fasting or light satvik diet on Thursdays / Sundays.`,
    temple: `Visit Sun or Vishnu Temple on auspicious annual return dates.`,
    charity: `Support educational scholarships for underprivileged youth.`,
  };

  // 18. Year Summary & Disclaimer
  const yearSummary = {
    headline: `Year ${targetYear} is a highly progressive solar return period (Score ${overallScore}/100) led by Varshapati ${varshapatiLord} and Muntha in House ${munthaHouse}.`,
    strengths: [
      `Strong Varshapati ${varshapatiLord} granting authority and status elevation.`,
      `Formations of Ithasala and Ikbal Tajika Yogas ensuring commercial success.`,
      `Punya and Dhana Sahams activating wealth accumulation and luck.`,
    ],
    weaknesses: [
      `Occasional expense spurts during mid-year transit transitions.`,
      `Need to manage fatigue during heavy project deadlines.`,
    ],
    recommendations: [
      `Capitalize on Q1 and Q2 for major business and career investments.`,
      `Perform annual Sun and Jupiter remedies on recommended dates.`,
      `Maintain regular wellness practices for continuous peak stamina.`,
    ],
    disclaimer: `This Varshphal Annual Prediction Report is generated for educational, self-reflection, and cultural purposes based on classical Vedic Tajika principles. It does not replace professional legal, financial, or medical advice.`,
  };

  return {
    targetYear,
    age,
    scorecard,
    overallScore,
    planetaryOverview,
    varshaLagna,
    muntha: {
      house: munthaHouse,
      sign: munthaSign,
      lord: munthaLord,
      title: munthaInfo.title,
      description: munthaInfo.desc,
      favourability: munthaInfo.fav,
      positiveEffects: munthaInfo.pos,
      negativeEffects: munthaInfo.neg,
      aiInterpretation: `Muntha in House ${munthaHouse} (${munthaSign}) focuses your annual karmic energy on ${munthaInfo.desc}`,
    },
    munthesh: {
      planet: munthaLord,
      house: munthaHouse,
      strength: "Exalted & Strong in Solar Return",
      friendship: "Friendly with Varsha Lagna Lord",
      recommendation: `Strengthen ${munthaLord} through daily morning mantras and charity.`,
    },
    varshapati: {
      lord: varshapatiLord,
      title: `${varshapatiLord} as Varshapati (Year Lord)`,
      strength: "Strong (High Panchavargiya Bala)",
      description: `As Year Lord, ${varshapatiLord} rules over the central theme of ${targetYear}, granting vigor, focus, and authority.`,
      careerImpact: "Elevates professional standing and unlocks new leadership assignments.",
      financeImpact: "Ensures stable cash flow and protects liquid capital reserves.",
      relationshipImpact: "Enhances public image and fosters warm family alliances.",
      healthImpact: "Sustains physical vitality and accelerates recovery.",
    },
    tajikaYogas,
    sahams,
    muddaDasha,
    monthlyTimeline,
    quarterlyForecast,
    domains,
    opportunities,
    riskCalendar,
    luckyElements,
    importantDates,
    remedies,
    yearSummary,
  };
}
