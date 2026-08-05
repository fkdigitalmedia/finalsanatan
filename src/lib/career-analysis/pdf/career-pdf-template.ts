/**
 * Dedicated Section Presets for Career Analysis Report Pro v2.0.
 * Isolated from Universal PDF Engine's default-templates.ts.
 */

export interface CareerSectionPreset {
  id: string;
  sectionNumber: number;
  title: string;
  description: string;
  inToc: boolean;
  breakAfter: boolean;
}

export const CAREER_SECTION_PRESETS: CareerSectionPreset[] = [
  { id: "cover", sectionNumber: 1, title: "Luxury Cover", description: "Title, user details, and primary overall career score badge", inToc: false, breakAfter: true },
  { id: "toc", sectionNumber: 2, title: "Table of Contents", description: "Comprehensive 28-chapter report directory", inToc: false, breakAfter: true },
  { id: "executive-dashboard", sectionNumber: 3, title: "Executive Dashboard", description: "11 Precision Career Scores, Dasha, Transit & Confidence Rating", inToc: true, breakAfter: true },
  { id: "executive-summary", sectionNumber: 4, title: "Executive AI Summary", description: "High-level non-generic career synthesis", inToc: true, breakAfter: false },
  { id: "career-dna", sectionNumber: 5, title: "Career DNA Profile", description: "Working style, leadership, communication, decision making, learning", inToc: true, breakAfter: true },
  { id: "suitability-domains", sectionNumber: 6, title: "14 Career Suitability Domains", description: "Ranked domain fit scores across Govt, Private, Tech, Finance, etc.", inToc: true, breakAfter: true },
  { id: "d10-dashamsa", sectionNumber: 7, title: "D10 Dashamsa Analysis", description: "D10 Ascendant, 10th Lord placement, strength & growth potential", inToc: true, breakAfter: false },
  { id: "house10-deep", sectionNumber: 8, title: "10th House Deep Analysis", description: "Kendra house sign placement & public recognition strength", inToc: true, breakAfter: false },
  { id: "house10-lord", sectionNumber: 9, title: "10th Lord Analysis", description: "10th Lord dignity and house placement effects", inToc: true, breakAfter: false },
  { id: "atmakaraka", sectionNumber: 10, title: "Jaimini Atmakaraka", description: "Highest degree planet & core soul career ambition", inToc: true, breakAfter: false },
  { id: "amatyakaraka", sectionNumber: 11, title: "Jaimini Amatyakaraka", description: "Second highest degree planet & career minister role", inToc: true, breakAfter: true },
  { id: "career-yogas", sectionNumber: 12, title: "Career Yogas Identified", description: "Raj, Dhana, Bhadra, Vipreet & Neecha Bhanga Yogas", inToc: true, breakAfter: true },
  { id: "planet-impacts", sectionNumber: 13, title: "Planet Career Analysis", description: "Career impact of all 9 Grahas", inToc: true, breakAfter: false },
  { id: "house-impacts", sectionNumber: 14, title: "House Career Analysis", description: "Significance of 2nd, 6th, 10th, 11th, 5th, 9th houses", inToc: true, breakAfter: true },
  { id: "promotion-analysis", sectionNumber: 15, title: "Promotion Analysis", description: "Best period, obstacles, and promotion probability %", inToc: true, breakAfter: false },
  { id: "salary-growth", sectionNumber: 16, title: "Salary Growth Analysis", description: "Expected growth trend, financial strength, peak earning years", inToc: true, breakAfter: false },
  { id: "foreign-career", sectionNumber: 17, title: "Foreign Career & MNC", description: "Remote work, MNC governance, international relocation score", inToc: true, breakAfter: true },
  { id: "industry-rankings", sectionNumber: 18, title: "Top 20 Industry Rankings", description: "Ranked industries with suitability score, reason & evidence", inToc: true, breakAfter: true },
  { id: "career-role-rankings", sectionNumber: 19, title: "Top 25 Career Role Rankings", description: "Ranked career roles with astrological WHY & required skills", inToc: true, breakAfter: true },
  { id: "monthly-timeline", sectionNumber: 20, title: "12-Month Unique Forecast", description: "Month-by-month career, promotion, interview & travel outlook", inToc: true, breakAfter: true },
  { id: "annual-timeline", sectionNumber: 21, title: "10-Year Annual Timeline", description: "Next 10 years annual career progression and salary trends", inToc: true, breakAfter: false },
  { id: "career-risks", sectionNumber: 22, title: "Career Risk Analysis", description: "Office politics, instability, layoff probability %, burnout level", inToc: true, breakAfter: false },
  { id: "career-opportunities", sectionNumber: 23, title: "Career Opportunity Analysis", description: "Promotion, business, foreign, investment & leadership vectors", inToc: true, breakAfter: true },
  { id: "career-remedies", sectionNumber: 24, title: "Vedic Career Remedies", description: "Temples, Mantras, Donations, Gemstones, Lifestyle, Habits", inToc: true, breakAfter: false },
  { id: "lucky-elements", sectionNumber: 25, title: "Lucky Elements", description: "Colours, Days, Numbers, Directions", inToc: true, breakAfter: true },
  { id: "evidence-engine", sectionNumber: 26, title: "Evidence Engine", description: "Planet, House, D10, Yoga, Dasha, Transit & Confidence %", inToc: true, breakAfter: false },
  { id: "ai-career-coach", sectionNumber: 27, title: "AI Career Coach Roadmap", description: "Immediate, 30-Day, 90-Day, 1-Year, 5-Year Action Plan", inToc: true, breakAfter: false },
  { id: "final-verdict", sectionNumber: 28, title: "Final Astrological Verdict", description: "Overall score, strengths, weaknesses, best career & final advice", inToc: true, breakAfter: false },
];
