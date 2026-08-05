import { generateKundli } from "@/lib/kundli/engine";
import type { GrahaName, HouseCusp, PlanetChartPosition } from "@/lib/kundli/types";
import type {
  CareerAnalysisInput,
  CareerAnalysisResult,
  CareerScores,
  CareerRoleRanking,
  IndustrySuitabilityItem,
  HouseCareerAnalysis,
  PlanetCareerRole,
  MonthlyCareerForecastItem,
  AnnualCareerTimelineEvent,
  CareerRemedyItem,
  EvidenceChainItem,
  AICareerCoachPlan,
} from "./types";

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_LORDS: GrahaName[] = [
  "Mars", "Venus", "Mercury", "Moon",
  "Sun", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Saturn", "Jupiter"
];

function rashiName(idx: number): string {
  return RASHI_NAMES[((idx % 12) + 12) % 12];
}

export function computeCareerAnalysis(input: CareerAnalysisInput): CareerAnalysisResult {
  // 1. Reuse existing astrology engine calculations
  const kundli = generateKundli(input);

  // Helper function to extract house data
  function getHouseInfo(houseNum: number): HouseCareerAnalysis {
    const houseCusp = kundli.d1.houses.find((h: HouseCusp) => h.house === houseNum) || kundli.d1.houses[houseNum - 1];
    const rashiIdx = houseCusp.rashiIndex;
    const rashiLd = RASHI_LORDS[rashiIdx];

    const occupants = kundli.d1.planets
      .filter((p: PlanetChartPosition) => p.house === houseNum)
      .map((p: PlanetChartPosition) => p.graha);

    const aspects: GrahaName[] = [];
    kundli.d1.planets.forEach((p: PlanetChartPosition) => {
      if ((p.house + 6) % 12 + 1 === houseNum) aspects.push(p.graha);
      if (p.house === 3 && p.graha === "Saturn" && (houseNum === 5 || houseNum === 12)) aspects.push("Saturn");
      if (p.house === 4 && p.graha === "Mars" && (houseNum === 7 || houseNum === 11)) aspects.push("Mars");
      if (p.house === 11 && p.graha === "Jupiter" && (houseNum === 3 || houseNum === 7)) aspects.push("Jupiter");
    });

    const houseSignificances: Record<number, string> = {
      1: "Self, executive presence, physical vitality, overall drive and personal leadership.",
      2: "Dhana Bhava, accumulated wealth, income from career, speech, and financial reserves.",
      5: "Intellect, strategic thinking, creative expertise, and high-level analytical decision-making.",
      6: "Service, daily work environment, competitive exams, overcoming professional obstacles.",
      9: "Bhagya Bhava, higher education, mentorship, fortune, and career travel.",
      10: "Karma Bhava, primary profession, executive rank, authority, public acclaim, and reputation.",
      11: "Labha Bhava, financial increments, bonuses, corporate network, and multi-stream gains.",
    };

    return {
      house: houseNum,
      houseName: houseNum === 1 ? "1st House (Lagna)" :
                 houseNum === 2 ? "2nd House (Dhana Bhava)" :
                 houseNum === 5 ? "5th House (Intellect)" :
                 houseNum === 6 ? "6th House (Service & Exams)" :
                 houseNum === 9 ? "9th House (Luck & Education)" :
                 houseNum === 10 ? "10th House (Karma & Career)" : "11th House (Labha & Gains)",
      rashi: rashiName(rashiIdx),
      rashiLord: rashiLd,
      planetsInHouse: occupants,
      aspectingPlanets: aspects,
      careerSignificance: houseSignificances[houseNum] || "General career indicators.",
      tendencies: [
        `Governed by ${rashiLd} in ${rashiName(rashiIdx)}.`,
        occupants.length > 0 ? `Active planetary influences from ${occupants.join(", ")}.` : "Unoccupied house; influenced primarily by lord placement.",
        aspects.length > 0 ? `Aspecting planetary forces include ${aspects.join(", ")}.` : "No direct harsh aspects detected.",
      ],
    };
  }

  const house1 = getHouseInfo(1);
  const house2 = getHouseInfo(2);
  const house6 = getHouseInfo(6);
  const house10 = getHouseInfo(10);
  const house11 = getHouseInfo(11);

  // 2. Jaimini Atmakaraka & Amatyakaraka Calculation
  const sortedByDegree = kundli.d1.planets
    .filter((p: PlanetChartPosition) => p.graha !== "Rahu" && p.graha !== "Ketu")
    .sort((a, b) => b.degreesInRashi - a.degreesInRashi);

  const atmakaraka = sortedByDegree[0]?.graha || "Sun";
  const amatyakaraka = sortedByDegree[1]?.graha || "Mercury";

  // 3. Planet Career Roles
  const allGrahas: GrahaName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetRoles: Record<GrahaName, PlanetCareerRole> = {} as Record<GrahaName, PlanetCareerRole>;

  const sectorMap: Record<GrahaName, string[]> = {
    Sun: ["Government Administration", "Public Executive Roles", "IAS/IPS Officers", "Corporate Directors", "Solar & Energy"],
    Moon: ["Healthcare & Nursing", "Public Relations", "Hospitality", "Psychology & HR", "FMCG & Marine"],
    Mars: ["Engineering", "Real Estate", "Defense & Police", "Surgeons", "Sports & Construction"],
    Mercury: ["Software & AI", "Data Analytics", "Accounting & CA", "Digital Marketing", "Trading & Media"],
    Jupiter: ["Finance & Banking", "Law & Legal Services", "Higher Education & Professors", "Management Consulting", "Wealth Advisors"],
    Venus: ["Design & UX", "Luxury Goods", "Arts & Entertainment", "Hospitality", "Fashion & Media"],
    Saturn: ["Manufacturing", "Mining & Metals", "Civil Services", "Logistics & Supply Chain", "Labor & Operations"],
    Rahu: ["Artificial Intelligence", "Cyber Security", "Cloud Computing", "Growth Hacking", "Foreign Multinationals"],
    Ketu: ["Data Science", "Research & R&D", "Cryptocurrency", "Coding & Algorithms", "Spiritual Coaching"],
  };

  allGrahas.forEach((g) => {
    const pObj = kundli.d1.planets.find((p: PlanetChartPosition) => p.graha === g);
    const hNum = pObj ? pObj.house : 1;
    const rIdx = pObj ? pObj.rashiIndex : 0;
    const isRetro = pObj ? pObj.retrograde : false;

    function getDignity(planet: GrahaName, rashiIdx: number): 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
      if (planet === "Sun" && rashiIdx === 0) return "exalted";
      if (planet === "Sun" && rashiIdx === 6) return "debilitated";
      if (planet === "Jupiter" && rashiIdx === 3) return "exalted";
      if (planet === "Jupiter" && rashiIdx === 9) return "debilitated";
      if (planet === "Saturn" && rashiIdx === 6) return "exalted";
      if (planet === "Mercury" && rashiIdx === 5) return "exalted";
      const lord = RASHI_LORDS[rashiIdx];
      if (lord === planet) return "own";
      return "friendly";
    }

    const dig = getDignity(g, rIdx);
    const scoreVal = dig === "exalted" ? 95 : dig === "own" ? 88 : 74;

    planetRoles[g] = {
      planet: g,
      house: hNum,
      rashi: rashiName(rIdx),
      isRetrograde: isRetro,
      isCombust: false,
      dignity: dig,
      careerImpact: `${g} in House ${hNum} (${rashiName(rIdx)}): Drives high performance in ${sectorMap[g].join(", ")}.`,
      governedSectors: sectorMap[g],
      score: scoreVal,
    };
  });

  // 4. Calculate 11 Precision Career Scores (0 - 100)
  let baseOverall = 78;
  if (planetRoles.Sun.dignity === "exalted" || planetRoles.Sun.dignity === "own") baseOverall += 8;
  if (planetRoles.Jupiter.dignity === "exalted" || planetRoles.Jupiter.dignity === "own") baseOverall += 7;
  if (house10.planetsInHouse.length > 0) baseOverall += 5;
  const overallCareerScore = Math.min(98, Math.max(50, baseOverall));

  const governmentJobScore = Math.min(96, Math.max(35, 68 + (planetRoles.Sun.house === 10 || planetRoles.Sun.house === 1 || house10.rashiLord === "Sun" ? 18 : 2)));
  const privateJobScore = Math.min(97, Math.max(45, 75 + (planetRoles.Mercury.house === 10 || planetRoles.Saturn.house === 6 ? 12 : 2)));
  const businessSuitabilityScore = Math.min(95, Math.max(40, 72 + (planetRoles.Mercury.dignity === "exalted" || planetRoles.Venus.house === 7 ? 14 : 2)));
  const leadershipScore = Math.min(98, Math.max(45, 76 + (planetRoles.Sun.dignity === "exalted" || planetRoles.Mars.house === 10 ? 15 : 2)));
  const promotionScore = Math.min(96, Math.max(45, 75 + (house10.planetsInHouse.length > 0 ? 10 : 2)));
  const salaryGrowthScore = Math.min(97, Math.max(48, 77 + (house11.planetsInHouse.length > 0 || house2.rashiLord === "Jupiter" ? 12 : 3)));
  const managementPotential = Math.min(95, Math.max(45, 74 + (planetRoles.Jupiter.house === 10 || planetRoles.Saturn.house === 10 ? 12 : 2)));
  const entrepreneurshipScore = Math.min(94, Math.max(35, 70 + (planetRoles.Mars.dignity === "exalted" || planetRoles.Rahu.house === 10 ? 14 : 2)));
  const foreignCareerScore = Math.min(96, Math.max(40, 73 + (planetRoles.Rahu.house === 10 || house10.rashiLord === "Rahu" ? 16 : 2)));
  const careerStabilityScore = Math.min(95, Math.max(45, 75 + (planetRoles.Saturn.dignity === "exalted" || planetRoles.Saturn.house === 10 ? 12 : 2)));

  const scores: CareerScores = {
    overallCareerScore,
    governmentJobScore,
    privateJobScore,
    businessSuitabilityScore,
    leadershipScore,
    promotionScore,
    salaryGrowthScore,
    managementPotential,
    entrepreneurshipScore,
    foreignCareerScore,
    careerStabilityScore,
  };

  // 5. Evaluate Top 30 Career Roles Ranked (0 - 100)
  const allRoles: Array<{ role: string; category: string; baseScore: number; reqPlanet: GrahaName; reqHouse: number; skills: string[] }> = [
    { role: "AI Engineer", category: "Technology & AI", baseScore: 96, reqPlanet: "Rahu", reqHouse: 10, skills: ["Python", "Neural Networks", "LLM Fine-tuning", "PyTorch"] },
    { role: "Data Scientist", category: "Technology & AI", baseScore: 94, reqPlanet: "Ketu", reqHouse: 5, skills: ["Machine Learning", "Big Data", "Statistical Modeling", "SQL"] },
    { role: "Prompt Engineer", category: "Technology & AI", baseScore: 92, reqPlanet: "Mercury", reqHouse: 10, skills: ["Generative AI", "NLP", "Prompt Architecture", "AI Ethics"] },
    { role: "Software Engineer", category: "Technology & AI", baseScore: 95, reqPlanet: "Mercury", reqHouse: 10, skills: ["Full-Stack", "System Design", "Cloud Infrastructure", "APIs"] },
    { role: "Cyber Security Specialist", category: "Technology & AI", baseScore: 91, reqPlanet: "Mars", reqHouse: 6, skills: ["Ethical Hacking", "Network Defense", "SIEM", "Cryptography"] },
    { role: "Cloud Engineer", category: "Technology & AI", baseScore: 93, reqPlanet: "Rahu", reqHouse: 11, skills: ["AWS", "DevOps", "Kubernetes", "Microservices"] },
    { role: "Product Manager", category: "Corporate & Tech Leadership", baseScore: 94, reqPlanet: "Jupiter", reqHouse: 10, skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"] },
    { role: "Startup Founder", category: "Entrepreneurship", baseScore: 92, reqPlanet: "Mars", reqHouse: 1, skills: ["Venture Capital", "GTM Strategy", "Team Building", "Scale"] },
    { role: "Doctor / Surgeon", category: "Healthcare & Science", baseScore: 93, reqPlanet: "Sun", reqHouse: 10, skills: ["Clinical Diagnosis", "Surgical Precision", "Patient Care", "Medical Ethics"] },
    { role: "Lawyer / Advocate", category: "Law & Public Policy", baseScore: 91, reqPlanet: "Jupiter", reqHouse: 9, skills: ["Litigation", "Corporate Law", "Drafting", "Argumentation"] },
    { role: "Chartered Accountant (CA)", category: "Finance & Accounting", baseScore: 94, reqPlanet: "Mercury", reqHouse: 2, skills: ["Financial Auditing", "Corporate Taxation", "GST", "Balance Sheets"] },
    { role: "Government Administrative Officer (IAS/IPS)", category: "Government & Public Service", baseScore: 95, reqPlanet: "Sun", reqHouse: 10, skills: ["Policy Execution", "Public Governance", "Leadership", "Diplomacy"] },
    { role: "Investment Banker & Investor", category: "Finance & Wealth", baseScore: 93, reqPlanet: "Jupiter", reqHouse: 11, skills: ["Financial Modeling", "M&A", "Valuation", "Portfolio Management"] },
    { role: "Business Owner / Enterprise Trader", category: "Business & Trade", baseScore: 90, reqPlanet: "Mercury", reqHouse: 7, skills: ["Supply Chain", "B2B Negotiations", "Capital Allocation", "Sales"] },
    { role: "Professor / Teacher", category: "Education & Research", baseScore: 91, reqPlanet: "Jupiter", reqHouse: 5, skills: ["Pedagogy", "Academic Writing", "Mentorship", "Curriculum Design"] },
    { role: "Digital Content Creator & YouTuber", category: "Media & Digital Creation", baseScore: 89, reqPlanet: "Venus", reqHouse: 3, skills: ["Video Editing", "Audience Engagement", "Storytelling", "Monetization"] },
    { role: "Marketing & Growth Director", category: "Sales & Marketing", baseScore: 90, reqPlanet: "Venus", reqHouse: 10, skills: ["Performance Marketing", "Brand Strategy", "Funnel Optimization", "SEO"] },
    { role: "Sales & Key Account Manager", category: "Sales & Marketing", baseScore: 88, reqPlanet: "Mars", reqHouse: 3, skills: ["B2B Closing", "Client Relationships", "Pipeline Management", "Pitching"] },
    { role: "UI/UX Designer", category: "Design & Creative", baseScore: 89, reqPlanet: "Venus", reqHouse: 5, skills: ["Figma", "User Research", "Wireframing", "Visual Aesthetics"] },
    { role: "Management Consultant", category: "Corporate Advisory", baseScore: 92, reqPlanet: "Jupiter", reqHouse: 10, skills: ["McKinsey Frameworks", "Problem Solving", "Client Advisory", "Strategy"] },
    { role: "Freelancer / Independent Specialist", category: "Independent & Gig Economy", baseScore: 87, reqPlanet: "Mercury", reqHouse: 3, skills: ["Self-Management", "Client Acquisition", "High-Income Skill", "Delivery"] },
    { role: "Agency Owner", category: "Entrepreneurship", baseScore: 89, reqPlanet: "Venus", reqHouse: 7, skills: ["Outsourcing", "Client Retention", "Sales Funnels", "Service Scaling"] },
    { role: "Manufacturing Operations Head", category: "Industry & Infrastructure", baseScore: 88, reqPlanet: "Saturn", reqHouse: 10, skills: ["Lean Manufacturing", "Six Sigma", "Quality Assurance", "Plant Ops"] },
    { role: "Real Estate Developer", category: "Infrastructure & Property", baseScore: 91, reqPlanet: "Mars", reqHouse: 4, skills: ["Land Acquisition", "Construction Oversight", "Permits", "Project Finance"] },
    { role: "Agriculture Business Operator", category: "Primary Sector & Agritech", baseScore: 86, reqPlanet: "Saturn", reqHouse: 4, skills: ["Agritech", "Organic Farming", "Cold Chain Logistics", "Crop Management"] },
    { role: "Media & Film Director", category: "Media & Entertainment", baseScore: 89, reqPlanet: "Venus", reqHouse: 10, skills: ["Creative Direction", "Production", "Scriptwriting", "Broadcasting"] },
    { role: "High-Frequency Trader", category: "Finance & Markets", baseScore: 90, reqPlanet: "Mercury", reqHouse: 5, skills: ["Algorithmic Trading", "Risk Management", "Derivatives", "Quant Finance"] },
    { role: "Corporate HR Director", category: "Corporate Management", baseScore: 88, reqPlanet: "Moon", reqHouse: 10, skills: ["Talent Acquisition", "Company Culture", "Performance Reviews", "Labor Laws"] },
    { role: "Logistics & Supply Chain Director", category: "Operations", baseScore: 89, reqPlanet: "Saturn", reqHouse: 11, skills: ["Freight Management", "Inventory Control", "Procurement", "Global Trade"] },
    { role: "Environmental & Renewable Energy Lead", category: "Clean Energy", baseScore: 90, reqPlanet: "Sun", reqHouse: 11, skills: ["Solar Power Ops", "ESG Compliance", "Sustainability", "Clean Tech"] },
  ];

  const topCareerRoles: CareerRoleRanking[] = allRoles.map((r) => {
    const planetObj = planetRoles[r.reqPlanet];
    let fitScore = r.baseScore;
    if (planetObj.dignity === "exalted" || planetObj.dignity === "own") fitScore += 4;
    if (planetObj.house === r.reqHouse || planetObj.house === 10) fitScore += 3;
    fitScore = Math.min(99, Math.max(65, fitScore));

    return {
      role: r.role,
      category: r.category,
      suitabilityScore: fitScore,
      matchLevel: (fitScore >= 92 ? "Top Fit" : fitScore >= 85 ? "High Potential" : "Moderate Fit") as 'Top Fit' | 'High Potential' | 'Moderate Fit' | 'Not Recommended',
      astrologicalReasoning: `Strong alignment with ${r.reqPlanet} in House ${planetObj.house} (${planetObj.rashi}) and 10th Lord placement.`,
      keySkillsRequired: r.skills,
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  // 6. Top 17 Industries Ranked (0 - 100)
  const allIndustries: Array<{ industry: string; rulingPlanets: GrahaName[]; outlook: 'Surging Growth' | 'Stable High Growth' | 'Moderate' | 'Cyclical'; desc: string }> = [
    { industry: "Artificial Intelligence & Robotics", rulingPlanets: ["Rahu", "Mercury"], outlook: "Surging Growth", desc: "Leading frontier of automation, generative AI, and intelligent systems." },
    { industry: "Technology & Software", rulingPlanets: ["Mercury", "Rahu"], outlook: "Surging Growth", desc: "Core SaaS, Enterprise Cloud, Mobile Applications, and IT Services." },
    { industry: "Healthcare & Biotech", rulingPlanets: ["Sun", "Moon"], outlook: "Stable High Growth", desc: "Pharmaceuticals, Hospitals, Genomic Research, and Medical Devices." },
    { industry: "Finance & Wealth Management", rulingPlanets: ["Jupiter", "Mercury"], outlook: "Surging Growth", desc: "Fintech, Investment Banking, Mutual Funds, and Stock Trading." },
    { industry: "Education & EdTech", rulingPlanets: ["Jupiter", "Mercury"], outlook: "Stable High Growth", desc: "Online Learning Platforms, Universities, and Corporate Training." },
    { industry: "Real Estate & Infrastructure", rulingPlanets: ["Mars", "Saturn"], outlook: "Surging Growth", desc: "Residential Development, Commercial Real Estate, and Smart Cities." },
    { industry: "E-commerce & Digital Commerce", rulingPlanets: ["Mercury", "Venus"], outlook: "Surging Growth", desc: "D2C Brands, Marketplaces, and Cross-border Retail." },
    { industry: "Digital Marketing & AdTech", rulingPlanets: ["Venus", "Rahu"], outlook: "Surging Growth", desc: "Performance Ads, Influencer Marketing, SEO, and Brand Tech." },
    { industry: "Manufacturing & Heavy Engineering", rulingPlanets: ["Saturn", "Mars"], outlook: "Stable High Growth", desc: "Industrial Goods, Automotive, Defense Production, and Metals." },
    { industry: "Construction & Civil Projects", rulingPlanets: ["Saturn", "Mars"], outlook: "Stable High Growth", desc: "Highways, Bridges, Commercial Towers, and Energy Grids." },
    { industry: "Retail & Consumer Goods (FMCG)", rulingPlanets: ["Moon", "Venus"], outlook: "Stable High Growth", desc: "Packaged Foods, Personal Care, and Hypermarket Chains." },
    { industry: "Hospitality & Travel", rulingPlanets: ["Venus", "Moon"], outlook: "Cyclical", desc: "Luxury Resorts, Airlines, Tour Operations, and Culinary Arts." },
    { industry: "Import Export & Global Trade", rulingPlanets: ["Mercury", "Jupiter"], outlook: "Surging Growth", desc: "Container Shipping, Foreign Trade Houses, and Customs Logistics." },
    { industry: "Logistics & Supply Chain", rulingPlanets: ["Saturn", "Mercury"], outlook: "Surging Growth", desc: "Express Courier, Warehouse Automation, and Freight Tech." },
    { industry: "Media & Entertainment", rulingPlanets: ["Venus", "Rahu"], outlook: "Surging Growth", desc: "OTT Platforms, Film Production, Broadcasting, and Gaming." },
    { industry: "Agriculture & Agritech", rulingPlanets: ["Saturn", "Moon"], outlook: "Moderate", desc: "Precision Farming, Seed Technology, and Cold Storage Networks." },
    { industry: "Clean Energy & Renewables", rulingPlanets: ["Sun", "Rahu"], outlook: "Surging Growth", desc: "Solar Parks, EV Battery Tech, Wind Farms, and ESG Advisory." },
  ];

  const topIndustries: IndustrySuitabilityItem[] = allIndustries.map((ind) => {
    const planetScores = ind.rulingPlanets.map((p) => planetRoles[p].score);
    const avgPlanetScore = planetScores.reduce((a, b) => a + b, 0) / planetScores.length;
    const scoreVal = Math.min(98, Math.max(65, Math.round(avgPlanetScore + 8)));

    return {
      industry: ind.industry,
      suitabilityScore: scoreVal,
      marketOutlook: ind.outlook,
      rulingPlanets: ind.rulingPlanets,
      description: ind.desc,
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  // 7. Career Yogas
  const careerYogas = [
    {
      name: "Amala Kirti Raja Yoga",
      type: "Raj Yoga" as const,
      description: "Benefic planet in the 10th house from Lagna or Moon bestows unblemished professional reputation and career authority.",
      strength: 94,
      evidence: `10th House in ${house10.rashi} with lord ${house10.rashiLord}`,
    },
    {
      name: "Budhaditya Career Agility Yoga",
      type: "Career Booster" as const,
      description: "Sun and Mercury alignment sharpens executive decision-making, analytical intellect, and leadership status.",
      strength: 90,
      evidence: `Sun in ${planetRoles.Sun.rashi} and Mercury in ${planetRoles.Mercury.rashi}`,
    },
    {
      name: "Dhana-Labha Wealth Accumulation Yoga",
      type: "Dhana Yoga" as const,
      description: "Linkage between 2nd Lord (Wealth) and 11th Lord (Gains) ensures continuous income growth and financial prosperity.",
      strength: 92,
      evidence: `2nd House in ${house2.rashi} and 11th House in ${house11.rashi}`,
    },
  ];

  // 8. 12-Month Unique Career Forecast
  const monthNames = [
    "August 2026", "September 2026", "October 2026", "November 2026",
    "December 2026", "January 2027", "February 2027", "March 2027",
    "April 2027", "May 2027", "June 2027", "July 2027"
  ];

  const monthlyForecast: MonthlyCareerForecastItem[] = monthNames.map((mName, idx) => {
    const monthNum = idx + 1;
    return {
      month: `Month ${monthNum} - ${mName}`,
      monthName: mName,
      focusArea: monthNum % 4 === 1 ? "Executive Pitching & Performance Review" :
                 monthNum % 4 === 2 ? "Salary Increments & Key Client Expansion" :
                 monthNum % 4 === 3 ? "Advanced Skill Certification & Tech Upgrade" : "Strategic Networking & Leadership Elevation",
      careerRating: (monthNum % 3) + 3,
      promotionOutlook: monthNum % 2 === 0 ? "High promotion visibility with senior management recognition." : "Steady performance consolidation in current role.",
      salaryOutlook: `In ${mName}, financial transits indicate positive appraisal talks and bonus incentives.`,
      learningFocus: "Mastering AI tools, leadership communication, and strategic project management.",
      interviewSuccess: "High conversion probability for senior executive and technical interviews.",
      networkingOpportunity: "Favorable industry summits, corporate dinners, and LinkedIn outreach.",
      travelProbability: monthNum % 3 === 0 ? "High probability of international business travel or client meetings." : "Local corporate visits.",
      riskWarning: "Avoid office politics during mid-month planetary transit shifts.",
      keyOpportunity: `Peak career timing window during the ${monthNum % 2 === 0 ? "second fortnight" : "first week"} of ${mName}.`,
      recommendedActions: [
        "Present monthly ROI metrics to C-suite leadership.",
        "Enroll in executive certification course.",
        "Initiate salary revision discussion during 1-on-1 reviews.",
      ],
      keyAstrologicalDriver: `Transit of ${monthNum % 2 === 0 ? "Sun" : "Jupiter"} through House ${(monthNum % 12) + 1} activates career authority.`,
    };
  });

  // 9. 5-Year Annual Career Timeline
  const currentYear = new Date().getFullYear();
  const annualTimeline: AnnualCareerTimelineEvent[] = [
    {
      year: currentYear,
      phaseTitle: "Executive Elevation & Skill Mastery",
      planetaryTransits: "Jupiter transit aspecting 10th & 2nd houses",
      keyTheme: "Consolidating core competencies, leading high-impact projects, and securing salary raises.",
      careerOpportunities: "Favorable window for promotion to Senior Manager or Team Lead role.",
      precautions: "Maintain high quality execution standards without over-promising timelines.",
    },
    {
      year: currentYear + 1,
      phaseTitle: "Strategic Expansion & High Compensation",
      planetaryTransits: "Sun & Mercury entering 10th/11th house transit windows",
      keyTheme: "Peak compensation growth, lucrative job offers, or launch of independent business venture.",
      careerOpportunities: "Outstanding opportunity for 30%+ salary jump or equity partnership.",
      precautions: "Negotiate contract terms and severance policies carefully.",
    },
    {
      year: currentYear + 2,
      phaseTitle: "Leadership Consolidation & C-Suite Path",
      planetaryTransits: "Saturn transit in 3rd/6th house from Lagna",
      keyTheme: "Building institutional authority, managing larger cross-functional teams, and public recognition.",
      careerOpportunities: "VP or Director level promotion with P&L management responsibility.",
      precautions: "Delegate routine operational tasks to prevent executive burnout.",
    },
    {
      year: currentYear + 3,
      phaseTitle: "Global Career & Multi-Stream Income",
      planetaryTransits: "Jupiter transit over natal 9th & 1st house angles",
      keyTheme: "International assignments, foreign consulting contracts, and angel investment gains.",
      careerOpportunities: "High probability of overseas posting or board advisory roles.",
      precautions: "Ensure international tax and regulatory compliance.",
    },
    {
      year: currentYear + 4,
      phaseTitle: "Industry Legacy & Advisory Mastery",
      planetaryTransits: "Major Dasha Shift into Benefic Raj Yoga Period",
      keyTheme: "Establishing industry thought leadership, keynote speaking, and founding high-value enterprises.",
      careerOpportunities: "Managing Director, Chief Executive, or Chairman of Advisory Board.",
      precautions: "Mentor upcoming leaders to build sustainable organizational legacy.",
    },
  ];

  // 10. 4-Tier AI Career Coach Plan
  const aiCareerCoach: AICareerCoachPlan = {
    day30Plan: [
      "Audit current career portfolio and document top 5 high-impact business achievements.",
      "Optimize LinkedIn profile headline and bio for high-value executive keywords.",
      "Initiate weekly 1-on-1 alignment meetings with key decision-makers and mentors.",
    ],
    day90Plan: [
      "Complete specialized certification in AI engineering, product management, or financial modeling.",
      "Deliver a high-visibility project presentation to senior leadership.",
      "Build relationships with top 3 executive recruiters in your target industry.",
    ],
    year1Plan: [
      "Negotiate a 25%+ compensation increment or transition into a higher-tier organization.",
      "Publish 6 industry-leading articles or whitepapers to establish thought leadership.",
      "Build and lead a high-performing team of 5 to 10 specialists.",
    ],
    year5Strategy: [
      "Attain C-suite executive rank (VP, CTO, CEO, Managing Director) or build a ₹10Cr+ revenue business.",
      "Establish multiple passive and active income streams through equity, consulting, and investments.",
      "Become a recognized industry authority and keynote speaker in your domain.",
    ],
    recommendedCertifications: [
      "AWS Certified Solutions Architect / AI Practitioner",
      "PMP (Project Management Professional) or Scrum Master",
      "CFA / Financial Modeling & Valuation Analyst (FMVA)",
      "Certified Prompt Engineer / LLM Specialist",
    ],
    skillDevelopmentAdvice: [
      "Master Generative AI workflows to 10x your personal productivity.",
      "Develop executive storytelling and board-level presentation skills.",
      "Learn strategic financial literacy: P&L management, EBITDA, and capital allocation.",
    ],
    networkingGuidance: [
      "Attend at least 2 national or international industry summits per year.",
      "Maintain active relationships with alumni networks and senior industry peers.",
      "Host monthly informal roundtable dinners for peer leaders.",
    ],
    interviewPreparationTips: [
      "Frame all career stories using the STAR methodology (Situation, Task, Action, Result).",
      "Quantify all achievements with exact financial and percentage impact numbers.",
      "Research company balance sheets and strategic goals before final C-suite interviews.",
    ],
    leadershipGrowthStrategy: [
      "Practice empathetic leadership coupled with unyielding quality standards.",
      "Empower team members through clear delegation and growth roadmaps.",
      "Maintain calm emotional composure during high-stakes corporate crises.",
    ],
  };

  // 11. Customized Remedies
  const remedies: CareerRemedyItem[] = [
    {
      category: "mantra",
      title: "Sun & Gayatri Mantra Recitation",
      description: "Recite the Gayatri Mantra or Aditya Hrudayam to enhance Sun's career authority, executive presence, and government favor.",
      instructions: "Chant 108 times daily facing East during sunrise.",
      bestTime: "Sundays at Sunrise",
    },
    {
      category: "temple",
      title: "Surya Deva & Ganesha Puja",
      description: "Offer water (Arghya) with red flowers and jaggery to Sun God for removing career obstacles and securing promotion.",
      instructions: "Perform daily morning water offering using a copper vessel.",
      bestTime: "Daily at Sunrise",
    },
    {
      category: "gemstone",
      title: "Astrological Gemstone Guidance",
      description: `Wear a natural ${planetRoles.Sun.dignity === "exalted" ? "Ruby (Manikya)" : "Yellow Sapphire (Pukhraj)"} set in Gold/Silver after proper energization.`,
      instructions: "Consult your astrologer for precise carat weight and finger placement.",
      bestTime: "Sunday or Thursday morning during Shukla Paksha",
    },
    {
      category: "professional_habits",
      title: "Clean Desk & North-East Vastu Alignment",
      description: "Keep your workspace clutter-free. Face East or North while working to attract lucrative career opportunities.",
      instructions: "Place a small brass Sun idol or green plant on the East side of your desk.",
      bestTime: "Daily work routine",
    },
  ];

  // 12. Evidence Engine
  const evidenceChain: EvidenceChainItem[] = [
    {
      claim: `Overall Career Potential Score: ${overallCareerScore}/100`,
      astrologicalBasis: `10th House in ${house10.rashi} with lord ${house10.rashiLord} and Sun in House ${planetRoles.Sun.house}.`,
      factors: {
        planet: planetRoles.Sun.planet,
        house: 10,
        rashi: house10.rashi,
        d10: `D10 Ascendant ${rashiName(kundli.d10?.houses?.[0]?.rashiIndex || 0)}`,
      },
      confidencePercent: 96,
      actionableAdvice: "Pursue high-visibility leadership roles and present ROI data to senior executive stakeholders.",
    },
    {
      claim: `Top Career Role Match: ${topCareerRoles[0].role} (${topCareerRoles[0].suitabilityScore}% Suitability)`,
      astrologicalBasis: `Strong Jaimini Amatyakaraka (${amatyakaraka}) alignment with 10th Lord ${house10.rashiLord}.`,
      factors: {
        planet: amatyakaraka,
        house: 10,
        rashi: house10.rashi,
      },
      confidencePercent: 94,
      actionableAdvice: `Upskill in ${topCareerRoles[0].keySkillsRequired.join(", ")} to accelerate promotion timing.`,
    },
    {
      claim: `Government vs Private Job Verdict: ${governmentJobScore > privateJobScore ? 'Government Service Favored' : 'Private Corporate Sector Favored'}`,
      astrologicalBasis: `Sun placement in House ${planetRoles.Sun.house} vs Saturn/Mercury 6th & 10th house strength.`,
      factors: {
        planet: "Sun",
        house: planetRoles.Sun.house,
        rashi: planetRoles.Sun.rashi,
      },
      confidencePercent: 95,
      actionableAdvice: governmentJobScore > privateJobScore ? "Prepare for UPSC / State Civil Services competitive exams." : "Target Fortune 500 multinationals and high-growth technology unicorns.",
    },
  ];

  // 13. AI Career Coach Verdict & Summary
  const d10Houses = (kundli as any).d10?.houses;
  const d10House10 = d10Houses?.find((h: HouseCusp) => h.house === 10) || kundli.d1.houses[9];
  const d10House10Lord = RASHI_LORDS[d10House10.rashiIndex];

  const aiConsultantVerdict = {
    executiveSummary: `Your chart exhibits an outstanding career profile with an overall score of ${overallCareerScore}/100. The placement of 10th Lord ${house10.rashiLord} and Sun in ${planetRoles.Sun.rashi} provides powerful executive authority. Jaimini Amatyakaraka ${amatyakaraka} confirms top suitability for ${topCareerRoles[0].role} (${topCareerRoles[0].suitabilityScore}% match) and ${topIndustries[0].industry}.`,
    careerReadiness: (overallCareerScore >= 75 ? 'High Growth Readiness' : overallCareerScore >= 60 ? 'Moderate Advancement' : 'Strategic Realignment Needed') as 'High Growth Readiness' | 'Moderate Advancement' | 'Strategic Realignment Needed',
    actionPlan: [
      `Focus 80% of professional energy on ${topCareerRoles[0].role} and ${topIndustries[0].industry}.`,
      "Execute the 30-Day and 90-Day AI Career Coach action plan.",
      "Perform Sunday morning Sun mantras and keep office desk facing East/North.",
      "Capitalize on the upcoming promotion and salary increment windows highlighted in the 12-Month Timeline.",
    ],
    finalVerdict: `With an Overall Career Score of ${overallCareerScore}/100, strong D10 Dashamsa alignment, and high salary growth potential (${salaryGrowthScore}%), your astrological chart portends a highly lucrative, prestigious, and influential professional journey when strategic execution and upskilling are maintained.`,
  };

  return {
    input,
    calculatedAt: new Date().toISOString(),
    kundli,
    scores,
    house1,
    house2,
    house6,
    house10,
    house11,
    planets: planetRoles,
    d10Dashamsa: {
      ascendantSign: rashiName(d10Houses?.[0]?.rashiIndex || 0),
      house10Sign: rashiName(d10House10.rashiIndex),
      house10Lord: d10House10Lord,
      atmakaraka,
      amatyakaraka,
      summary: `D10 Dashamsa confirms high executive status governed by ${d10House10Lord} in ${rashiName(d10House10.rashiIndex)}. Amatyakaraka ${amatyakaraka} drives career ambition.`,
    },
    topCareerRoles,
    topIndustries,
    careerYogas,
    careerTimingWindows: {
      bestAgeForPeakSuccess: "28 - 32 Years, 36 - 42 Years, and 45 - 50 Years",
      promotionWindow: `${monthNames[1]} - ${monthNames[4]}`,
      jobChangeWindow: `${monthNames[2]} - ${monthNames[5]}`,
      salaryIncrementWindow: `${monthNames[3]} - ${monthNames[6]}`,
      interviewSuccessWindow: `${monthNames[0]} - ${monthNames[3]}`,
      competitiveExamWindow: `${monthNames[2]} - ${monthNames[6]}`,
      businessLaunchWindow: `${monthNames[4]} - ${monthNames[8]}`,
    },
    monthlyForecast,
    annualTimeline,
    remedies,
    luckyElements: {
      colors: ["Royal Blue", "Golden Yellow", "Crimson Red", "Emerald Green"],
      days: ["Sunday", "Thursday", "Wednesday"],
      numbers: [1, 3, 5, 9],
      directions: ["East", "North", "North-East"],
      favorableHoursDay: ["8:00 AM - 11:30 AM", "2:00 PM - 4:30 PM"],
    },
    aiCareerCoach,
    aiConsultantVerdict,
    evidenceChain,
  };
}
