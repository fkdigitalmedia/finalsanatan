// ============================================================
// Phase 17.1 — Classical Prediction Rules Catalog
// ------------------------------------------------------------
// Defines structured rules originating from classical Vedic texts:
// - Brihat Parasara Hora Sastra (BPHS)
// - Phaladeepika
// - Saravali
// - Jataka Parijata
// ============================================================

import type { GrahaName } from "../types";

export type LifeAreaCategory =
  | "Career"
  | "Business"
  | "Marriage"
  | "Love"
  | "Finance"
  | "Health"
  | "Education"
  | "Children"
  | "Foreign Travel"
  | "Property"
  | "Vehicle"
  | "Family"
  | "Spiritual Growth";

export interface ClassicalPredictionRule {
  id: string;
  name: string;
  source: "Brihat Parasara Hora Sastra" | "Phaladeepika" | "Saravali" | "Jataka Parijata";
  category: LifeAreaCategory;
  priority: number; // 1 (lowest) .. 10 (highest)
  baseConfidence: number; // 0..100
  enabled: boolean;
  ruleDescription: string;
  affectedHouses: number[];
  affectedPlanets: GrahaName[];
  remedies: {
    mantras?: string[];
    charity?: string[];
    templeVisits?: string[];
    gemstones?: string[];
    fasting?: string[];
    pujas?: string[];
  };
}

export const CLASSICAL_PREDICTION_RULES: ClassicalPredictionRule[] = [
  // CAREER RULES
  {
    id: "rule_career_10th_lord_kendra",
    name: "10th Lord in Kendra/Trikona",
    source: "Brihat Parasara Hora Sastra",
    category: "Career",
    priority: 9,
    baseConfidence: 92,
    enabled: true,
    ruleDescription: "Lord of 10th house situated in a Kendra (1, 4, 7, 10) or Trikona (1, 5, 9) bestows high executive authority, professional recognition, and career stability.",
    affectedHouses: [10, 1, 4, 7, 5, 9],
    affectedPlanets: [],
    remedies: {
      mantras: ["Chant 10th Lord Beej Mantra 108 times"],
      charity: ["Donate food to workers on Saturdays"],
      templeVisits: ["Visit Lord Vishnu Temple"],
    },
  },
  {
    id: "rule_career_sun_mercury_10th",
    name: "Sun/Mercury in 10th House",
    source: "Phaladeepika",
    category: "Career",
    priority: 8,
    baseConfidence: 88,
    enabled: true,
    ruleDescription: "Sun or Mercury in 10th house gives administrative acumen, government patronage, public respect, and managerial success.",
    affectedHouses: [10],
    affectedPlanets: ["Sun", "Mercury"],
    remedies: {
      mantras: ["Recite Aditya Hrudaya Stotram"],
      charity: ["Offer water and copper to temple"],
    },
  },

  // BUSINESS RULES
  {
    id: "rule_business_7th_11th_link",
    name: "7th & 11th Lord Association",
    source: "Saravali",
    category: "Business",
    priority: 9,
    baseConfidence: 90,
    enabled: true,
    ruleDescription: "Conjunction or mutual aspect between 7th Lord (Partnerships) and 11th Lord (Gains) generates high commercial profit and successful trade.",
    affectedHouses: [7, 11],
    affectedPlanets: [],
    remedies: {
      mantras: ["Chant Mahalaxmi Mantra on Fridays"],
      pujas: ["Perform Kuber-Lakshmi Puja"],
    },
  },

  // MARRIAGE RULES
  {
    id: "rule_marriage_7th_lord_exalted",
    name: "7th Lord Exalted/Own Sign",
    source: "Brihat Parasara Hora Sastra",
    category: "Marriage",
    priority: 9,
    baseConfidence: 94,
    enabled: true,
    ruleDescription: "7th Lord in exalted or own sign brings a noble, loving, and supportive spouse with lifelong marital harmony.",
    affectedHouses: [7],
    affectedPlanets: ["Venus", "Jupiter"],
    remedies: {
      mantras: ["Chant Shukra Beej Mantra"],
      templeVisits: ["Visit Lakshmi-Narayan Temple on Fridays"],
    },
  },

  // FINANCE RULES
  {
    id: "rule_finance_2nd_11th_exchange",
    name: "2nd and 11th Lord Exchange",
    source: "Jataka Parijata",
    category: "Finance",
    priority: 10,
    baseConfidence: 95,
    enabled: true,
    ruleDescription: "Sign exchange between 2nd Lord (Wealth) and 11th Lord (Gains) creates massive, continuous accumulation of wealth and assets.",
    affectedHouses: [2, 11],
    affectedPlanets: [],
    remedies: {
      charity: ["Donate yellow sweets on Thursdays"],
      pujas: ["Shri Yantra Puja"],
    },
  },

  // HEALTH RULES
  {
    id: "rule_health_lagnesh_strong",
    name: "Lagna Lord Strong",
    source: "Phaladeepika",
    category: "Health",
    priority: 9,
    baseConfidence: 91,
    enabled: true,
    ruleDescription: "Strong Lagna Lord in Kendra/Trikona protects health, grants high immunity, longevity, and fast recovery from ailments.",
    affectedHouses: [1],
    affectedPlanets: ["Sun"],
    remedies: {
      mantras: ["Recite Mahamrityunjaya Mantra"],
      fasting: ["Fast on Lagna Lord day"],
    },
  },

  // PROPERTY & VEHICLE RULES
  {
    id: "rule_property_4th_mars",
    name: "4th Lord with Mars",
    source: "Brihat Parasara Hora Sastra",
    category: "Property",
    priority: 8,
    baseConfidence: 87,
    enabled: true,
    ruleDescription: "Strong 4th Lord associated with Mars brings land ownership, real estate gains, and multiple properties.",
    affectedHouses: [4],
    affectedPlanets: ["Mars"],
    remedies: {
      charity: ["Donate red lentils on Tuesdays"],
      templeVisits: ["Visit Hanuman Temple"],
    },
  },

  // FOREIGN TRAVEL RULES
  {
    id: "rule_foreign_9th_12th_link",
    name: "9th & 12th Lord Connection",
    source: "Saravali",
    category: "Foreign Travel",
    priority: 8,
    baseConfidence: 89,
    enabled: true,
    ruleDescription: "Connection between 9th Lord (Long Travel) and 12th Lord (Foreign Land) grants long-term overseas settlement and international gains.",
    affectedHouses: [9, 12],
    affectedPlanets: ["Rahu"],
    remedies: {
      mantras: ["Chant Rahu Beej Mantra"],
      charity: ["Feed birds on Saturdays"],
    },
  },

  // SPIRITUAL GROWTH RULES
  {
    id: "rule_spiritual_ketu_12th",
    name: "Ketu in 12th House",
    source: "Brihat Parasara Hora Sastra",
    category: "Spiritual Growth",
    priority: 10,
    baseConfidence: 96,
    enabled: true,
    ruleDescription: "Ketu in 12th house (Moksha Sthana) is the supreme classic placement for spiritual enlightenment, meditation mastery, and ultimate liberation.",
    affectedHouses: [12],
    affectedPlanets: ["Ketu", "Jupiter"],
    remedies: {
      mantras: ["Chant Om Namah Shivaya"],
      fasting: ["Pradosham fast"],
    },
  },
];
