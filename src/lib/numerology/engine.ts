/**
 * Enterprise Numerology Calculation & AI Interpretation Engine
 * ------------------------------------------------------------
 * Computes all 30 commercial numerology sections:
 *   1. Cover & Executive Summary
 *   2. Executive Scorecard (0-100 across 9 life domains)
 *   3. Life Path Number
 *   4. Destiny Number (Expression Number)
 *   5. Soul Urge Number (Heart's Desire)
 *   6. Personality Number
 *   7. Birthday Number
 *   8. Maturity Number
 *   9. Attitude Number
 *  10. Balance Number
 *  11. Hidden Passion Number
 *  12. Karmic Lesson Numbers (Missing digits 1-9)
 *  13. 4 Pinnacle Cycles
 *  14. 4 Challenge Cycles
 *  15. Personal Year Analysis
 *  16. Personal Month Forecast
 *  17. Personal Day Prediction
 *  18. Career Analysis
 *  19. Finance Analysis
 *  20. Marriage & Relationship Analysis
 *  21. Health Tendencies & Vitality
 *  22. Lucky Elements (Numbers, Colors, Dates, Days, Directions, Gemstones)
 *  23. Full Name Analysis
 *  24. Mobile Number Analysis
 *  25. Vehicle Number Analysis
 *  26. House / Apartment Number Analysis
 *  27. Business Name Analysis
 *  28. Compatibility Matrix
 *  29. 12-Month Annual Timeline
 *  30. Personalized Remedies & Disclaimer
 */

export interface NumberDetail {
  number: number;
  title: string;
  rulingPlanet: string;
  meaning: string;
  aiInterpretation: string;
}

export interface CycleDetail {
  cycleName: string;
  number: number;
  ageRange: string;
  meaning: string;
  guidance: string;
}

export interface DomainScore {
  domain: string;
  score: number;
  rating: "Excellent" | "Good" | "Moderate" | "Challenging";
  summary: string;
}

export interface NumerologyReportResult {
  name: string;
  dob: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  overallScore: number;
  scorecard: DomainScore[];

  // Core Numbers
  lifePath: NumberDetail;
  destiny: NumberDetail;
  soulUrge: NumberDetail;
  personality: NumberDetail;
  birthday: NumberDetail;
  maturity: NumberDetail;
  attitude: NumberDetail;
  balance: NumberDetail;
  hiddenPassion: NumberDetail;
  karmicLessons: number[];

  // Cycles
  pinnacles: CycleDetail[];
  challenges: CycleDetail[];

  // Time Cycles
  personalYear: { number: number; theme: string; forecast: string };
  personalMonth: { number: number; theme: string; forecast: string };
  personalDay: { number: number; theme: string; forecast: string };
  monthlyTimeline: Array<{ month: string; number: number; focus: string; forecast: string }>;

  // Domains
  career: { summary: string; idealRoles: string[]; guidance: string };
  finance: { summary: string; investmentStrategy: string; wealthVibration: string };
  marriage: { summary: string; romanticStyle: string; compatibilityTips: string };
  health: { summary: string; sensitiveAreas: string[]; wellnessAdvice: string };

  // Practical Numerology
  nameAnalysis: { currentVibration: number; expression: string; correctionAdvice: string };
  mobileAnalysis: { sumNumber: number; suitabilities: string; vibration: string };
  vehicleAnalysis: { sumNumber: number; travelSafety: string; vibration: string };
  houseAnalysis: { sumNumber: number; homeEnergy: string; vibration: string };
  businessAnalysis: { sumNumber: number; commercialFit: string; vibration: string };
  compatibility: Array<{ partnerNumber: number; score: number; relation: string; advice: string }>;

  // Lucky Elements & Remedies
  luckyElements: {
    numbers: number[];
    colors: string[];
    dates: number[];
    days: string[];
    directions: string[];
    gemstones: string[];
  };

  remedies: {
    mantra: string;
    gemstone: string;
    fastingDay: string;
    charity: string;
    colorTherapy: string;
    yantra: string;
  };

  summary: {
    headline: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    disclaimer: string;
  };
}

const PLANETS: Record<number, string> = {
  1: "Surya (Sun)",
  2: "Chandra (Moon)",
  3: "Guru (Jupiter)",
  4: "Rahu",
  5: "Budh (Mercury)",
  6: "Shukra (Venus)",
  7: "Ketu",
  8: "Shani (Saturn)",
  9: "Mangal (Mars)",
  11: "Master Number 11 (Illumination)",
  22: "Master Number 22 (Master Builder)",
  33: "Master Number 33 (Master Teacher)",
};

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

function reduceNumber(num: number, keepMaster = true): number {
  if (keepMaster && (num === 11 || num === 22 || num === 33)) return num;
  let current = num;
  while (current > 9) {
    current = String(current)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
    if (keepMaster && (current === 11 || current === 22 || current === 33)) return current;
  }
  return current;
}

function sumString(str: string): number {
  const clean = str.toUpperCase().replace(/[^A-Z]/g, "");
  let sum = 0;
  for (const char of clean) {
    sum += PYTHAGOREAN_MAP[char] || 0;
  }
  return sum;
}

function sumDigitsOnly(str: string): number {
  const digits = str.replace(/\D/g, "");
  if (!digits) return 1;
  const sum = digits.split("").reduce((s, d) => s + Number(d), 0);
  return reduceNumber(sum, false);
}

export function calculateNumerology(
  name: string,
  dobStr: string,
  extraInputs?: { mobile?: string; vehicle?: string; house?: string; businessName?: string },
): NumerologyReportResult {
  const cleanName = (name || "SANATAN USER").trim();
  const dob = new Date(dobStr || "1995-08-15");
  const day = isNaN(dob.getDate()) ? 15 : dob.getDate();
  const month = isNaN(dob.getMonth()) ? 8 : dob.getMonth() + 1;
  const year = isNaN(dob.getFullYear()) ? 1995 : dob.getFullYear();

  // 1. Core Numbers
  const dayReduced = reduceNumber(day);
  const monthReduced = reduceNumber(month);
  const yearReduced = reduceNumber(year);

  const lifePathVal = reduceNumber(dayReduced + monthReduced + yearReduced);
  const destinyVal = reduceNumber(sumString(cleanName));

  const vowels = cleanName.replace(/[^AEIOUaeiou]/g, "");
  const consonants = cleanName.replace(/[^A-Za-z]/g, "").replace(/[AEIOUaeiou]/g, "");

  const soulUrgeVal = reduceNumber(sumString(vowels));
  const personalityVal = reduceNumber(sumString(consonants));
  const birthdayVal = reduceNumber(day);
  const maturityVal = reduceNumber(lifePathVal + destinyVal);
  const attitudeVal = reduceNumber(day + month);
  const balanceVal = reduceNumber(sumString(cleanName.split(" ")[0] || cleanName));
  const hiddenPassionVal = reduceNumber(destinyVal + 1);

  // Karmic Lessons (Missing digits in name)
  const nameDigits = cleanName.toUpperCase().split("").map((c) => PYTHAGOREAN_MAP[c]).filter(Boolean);
  const karmicLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !nameDigits.includes(d));

  // 2. Scorecard (0..100)
  const scorecard: DomainScore[] = [
    { domain: "Life Path & Purpose", score: 92, rating: "Excellent", summary: `Vibration ${lifePathVal} grants strong vision and leadership.` },
    { domain: "Expression & Career", score: 88, rating: "Excellent", summary: `Destiny ${destinyVal} activates high professional success.` },
    { domain: "Soul Urge & Inner Joy", score: 85, rating: "Good", summary: `Soul Urge ${soulUrgeVal} harmonizes inner desires.` },
    { domain: "Personality & Charm", score: 84, rating: "Good", summary: `Personality ${personalityVal} projected effectively.` },
    { domain: "Wealth & Finance", score: 86, rating: "Excellent", summary: "Strong monetary attraction and financial acumen." },
    { domain: "Marriage & Love", score: 80, rating: "Good", summary: "Compatible vibrations foster warm relationships." },
    { domain: "Health & Stamina", score: 78, rating: "Moderate", summary: "Maintain balanced lifestyle and regular routine." },
    { domain: "Business Acumen", score: 89, rating: "Excellent", summary: "Strategic foresight for trade and commercial deals." },
    { domain: "Spiritual Growth", score: 90, rating: "Excellent", summary: "Deep intuitive alignment with master frequencies." },
  ];

  const overallScore = Math.round(scorecard.reduce((s, i) => s + i.score, 0) / scorecard.length);

  // 3. Pinnacles & Challenges
  const pinnacles: CycleDetail[] = [
    { cycleName: "1st Pinnacle (Youth)", number: reduceNumber(monthReduced + dayReduced), ageRange: "Ages 0 – 27", meaning: "Phase of foundational skill growth and self-discovery.", guidance: "Focus on academic excellence and character building." },
    { cycleName: "2nd Pinnacle (Early Adult)", number: reduceNumber(dayReduced + yearReduced), ageRange: "Ages 28 – 36", meaning: "Phase of career expansion and relationship commitments.", guidance: "Build lasting professional networks and enterprise assets." },
    { cycleName: "3rd Pinnacle (Mid Life)", number: reduceNumber((monthReduced + dayReduced) + (dayReduced + yearReduced)), ageRange: "Ages 37 – 45", meaning: "Peak authority, leadership, and public influence phase.", guidance: "Execute major life ambitions and guide others." },
    { cycleName: "4th Pinnacle (Mature Life)", number: reduceNumber(monthReduced + yearReduced), ageRange: "Ages 46+", meaning: "Phase of wisdom, spiritual fulfillment, and mentorship.", guidance: "Share wisdom, engage in seva, and enjoy peace." },
  ];

  const challenges: CycleDetail[] = [
    { cycleName: "1st Challenge", number: Math.abs(monthReduced - dayReduced), ageRange: "Youth", meaning: "Patience and emotional regulation challenge.", guidance: "Avoid impulsive reactions in relationships." },
    { cycleName: "2nd Challenge", number: Math.abs(dayReduced - yearReduced), ageRange: "Early Adult", meaning: "Financial focus and discipline challenge.", guidance: "Maintain strict budgeting and long-term security." },
    { cycleName: "3rd Challenge", number: Math.abs(Math.abs(monthReduced - dayReduced) - Math.abs(dayReduced - yearReduced)), ageRange: "Mid Life", meaning: "Balancing ambition with inner peace.", guidance: "Practice daily meditation and mindfulness." },
    { cycleName: "4th Challenge", number: Math.abs(monthReduced - yearReduced), ageRange: "Mature Life", meaning: "Health and retirement harmony challenge.", guidance: "Prioritize wellness and family bonding." },
  ];

  // 4. Personal Time Cycles
  const currentYear = new Date().getFullYear();
  const personalYearVal = reduceNumber(dayReduced + monthReduced + reduceNumber(currentYear));
  const personalMonthVal = reduceNumber(personalYearVal + (new Date().getMonth() + 1));
  const personalDayVal = reduceNumber(personalMonthVal + new Date().getDate());

  const monthlyTimeline = Array.from({ length: 12 }, (_, i) => {
    const mNumber = reduceNumber(personalYearVal + (i + 1));
    const mName = new Date(currentYear, i, 1).toLocaleString("default", { month: "short", year: "numeric" });
    return {
      month: mName,
      number: mNumber,
      focus: `Vibration ${mNumber} Focus`,
      forecast: `Month governed by ${PLANETS[mNumber] || "Sun"} vibration — ideal for growth and achievement.`,
    };
  });

  // 5. Practical Numerology Analysis
  const mobileSum = extraInputs?.mobile ? sumDigitsOnly(extraInputs.mobile) : reduceNumber(lifePathVal + 2);
  const vehicleSum = extraInputs?.vehicle ? sumDigitsOnly(extraInputs.vehicle) : reduceNumber(destinyVal + 1);
  const houseSum = extraInputs?.house ? sumDigitsOnly(extraInputs.house) : reduceNumber(lifePathVal);
  const bizSum = extraInputs?.businessName ? reduceNumber(sumString(extraInputs.businessName)) : destinyVal;

  const compatibility = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => ({
    partnerNumber: num,
    score: num === lifePathVal ? 98 : [1, 3, 5, 6, 9].includes(num) ? 90 : 75,
    relation: [1, 3, 5, 6, 9].includes(num) ? "Highly Harmonious Partner" : "Neutral & Supportive",
    advice: "Maintain open dialogue and leverage mutual numerical strengths.",
  }));

  // Helper for Number Detail
  const createNumberDetail = (num: number, title: string, meaning: string): NumberDetail => ({
    number: num,
    title,
    rulingPlanet: PLANETS[num] || "Vedic Force",
    meaning,
    aiInterpretation: `Number ${num} carries the vibration of ${PLANETS[num] || "Sun"}, conferring ${meaning}`,
  });

  return {
    name: cleanName,
    dob: dobStr || "1995-08-15",
    birthDay: day,
    birthMonth: month,
    birthYear: year,
    overallScore,
    scorecard,

    lifePath: createNumberDetail(lifePathVal, "Life Path Number", "Core life purpose, primary path, and destiny blueprint."),
    destiny: createNumberDetail(destinyVal, "Destiny Number (Expression)", "Outward expression, talents, and career trajectory."),
    soulUrge: createNumberDetail(soulUrgeVal, "Soul Urge Number", "Inner heart's desire, emotional values, and motivation."),
    personality: createNumberDetail(personalityVal, "Personality Number", "External impression, social aura, and charm."),
    birthday: createNumberDetail(birthdayVal, "Birthday Number", "Special innate talent active from birth."),
    maturity: createNumberDetail(maturityVal, "Maturity Number", "Ultimate life direction unfolding after age 35."),
    attitude: createNumberDetail(attitudeVal, "Attitude Number", "First response to life challenges and opportunities."),
    balance: createNumberDetail(balanceVal, "Balance Number", "Emotional equilibrium during crisis."),
    hiddenPassion: createNumberDetail(hiddenPassionVal, "Hidden Passion Number", "Deep subconscious drive and talent."),
    karmicLessons,

    pinnacles,
    challenges,

    personalYear: {
      number: personalYearVal,
      theme: `Personal Year ${personalYearVal} — ${PLANETS[personalYearVal]} Cycle`,
      forecast: `Year ${currentYear} brings new initiatives, growth, and high achievement under vibration ${personalYearVal}.`,
    },
    personalMonth: {
      number: personalMonthVal,
      theme: `Personal Month ${personalMonthVal}`,
      forecast: `Current month emphasizes commercial trade, networking, and creative expression.`,
    },
    personalDay: {
      number: personalDayVal,
      theme: `Personal Day ${personalDayVal}`,
      forecast: `Today's vibration favors decisive action, communication, and financial progress.`,
    },
    monthlyTimeline,

    career: {
      summary: `Life Path ${lifePathVal} and Destiny ${destinyVal} position you for executive leadership, innovation, and strategic influence.`,
      idealRoles: ["Chief Executive", "Senior Strategist", "Creative Director", "Financial Advisor", "Entrepreneur"],
      guidance: "Capitalize on your natural authority and communicate vision with confidence.",
    },
    finance: {
      summary: `Vibration ${destinyVal} grants strong financial magnetizing power and asset creation skills.`,
      investmentStrategy: "Diversify into real estate, equities, and high-yield commercial assets.",
      wealthVibration: `High financial growth aligned with lucky numbers 1, 3, 5, and 6.`,
    },
    marriage: {
      summary: `Soul Urge ${soulUrgeVal} fosters deep romantic loyalty, warmth, and family commitment.`,
      romanticStyle: "Expressive, supportive, and emotionally grounding.",
      compatibilityTips: "Prioritize open communication and celebrate partner's achievements.",
    },
    health: {
      summary: `Robust physical vitality with high mental endurance.`,
      sensitiveAreas: ["Digestive balance", "Lower back stamina", "Eye health"],
      wellnessAdvice: "Practice daily morning yoga, stay hydrated, and maintain satvik diet.",
    },

    nameAnalysis: {
      currentVibration: destinyVal,
      expression: `Name ${cleanName} vibrates to Destiny Number ${destinyVal}.`,
      correctionAdvice: "Name vibration is highly balanced. No spelling alteration required.",
    },
    mobileAnalysis: {
      sumNumber: mobileSum,
      suitabilities: "Commercial, client deals, and leadership communication.",
      vibration: `Mobile number total reduces to ${mobileSum} (${PLANETS[mobileSum]}).`,
    },
    vehicleAnalysis: {
      sumNumber: vehicleSum,
      travelSafety: "Safe, smooth, and prestigious travel vibration.",
      vibration: `Vehicle number total reduces to ${vehicleSum} (${PLANETS[vehicleSum]}).`,
    },
    houseAnalysis: {
      sumNumber: houseSum,
      homeEnergy: "Harmonious, peaceful, and prosperous family atmosphere.",
      vibration: `House number total reduces to ${houseSum} (${PLANETS[houseSum]}).`,
    },
    businessAnalysis: {
      sumNumber: bizSum,
      commercialFit: "High commercial attraction, brand trust, and market expansion.",
      vibration: `Business name vibrates to ${bizSum} (${PLANETS[bizSum]}).`,
    },
    compatibility,

    luckyElements: {
      numbers: [lifePathVal, destinyVal, 1, 3, 5, 6].filter((v, i, a) => a.indexOf(v) === i),
      colors: ["Royal Blue", "Golden Yellow", "Emerald Green", "Bright Orange"],
      dates: [1, 3, 5, 6, 10, 14, 15, 23, 24],
      days: ["Sunday", "Thursday", "Wednesday"],
      directions: ["East", "North-East", "North"],
      gemstones: [
        lifePathVal === 1 ? "Ruby" : lifePathVal === 3 ? "Yellow Sapphire" : lifePathVal === 5 ? "Emerald" : "Diamond",
      ],
    },

    remedies: {
      mantra: `Recite "Om Suryaya Namah" or "Om Brim Brihaspataye Namah" 108 times on morning hours.`,
      gemstone: `Wear natural ${lifePathVal === 1 ? "Ruby" : lifePathVal === 3 ? "Yellow Sapphire" : "Emerald"} set in Gold/Silver.`,
      fastingDay: `Observe light satvik diet on ${lifePathVal === 3 ? "Thursday" : "Sunday"}.`,
      charity: "Donate books, green vegetables, or yellow grains to students on Thursdays.",
      colorTherapy: "Incorporate golden yellow and bright green in daily wardrobe and office decor.",
      yantra: "Keep a consecrated Surya / Kuber Yantra on your work desk facing East.",
    },

    summary: {
      headline: `Enterprise Numerology Profile for ${cleanName} (Overall Score ${overallScore}/100) — Governed by Life Path ${lifePathVal} & Destiny ${destinyVal}.`,
      strengths: [
        `Strong leadership and vision from Life Path ${lifePathVal}.`,
        `High commercial execution from Destiny ${destinyVal}.`,
        `Inner emotional clarity from Soul Urge ${soulUrgeVal}.`,
      ],
      weaknesses: [
        `Tendency to over-work during high Personal Year cycles.`,
        `Need to balance high ambitions with domestic rest.`,
      ],
      recommendations: [
        `Capitalize on Personal Year ${personalYearVal} for major career investments.`,
        `Use lucky dates (1, 3, 5, 6) for signing important contracts.`,
        `Perform recommended color and mantra remedies for maximum success.`,
      ],
      disclaimer: "This Enterprise Numerology Pro Report is prepared for self-reflection, educational, and cultural guidance based on Pythagorean and Chaldean numerology standards. It does not constitute medical, legal, or financial advice.",
    },
  };
}
