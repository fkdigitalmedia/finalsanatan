import type { ComponentType } from "react";
import {
  Sun,
  CalendarHeart,
  Flame,
  Music4,
  Sparkles,
  Landmark,
  Calculator,
  BookOpenText,
  Baby,
  GraduationCap,
} from "lucide-react";

export interface Category {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  hue: "saffron" | "maroon" | "gold" | "info" | "success";
  devanagari?: string;
  plannedTools: string[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "panchang",
    title: "Daily Panchang",
    short: "Panchang",
    description:
      "Tithi, nakshatra, yoga, karana, sunrise/sunset, rahu kaal and daily muhurat for any date and location.",
    icon: Sun,
    hue: "saffron",
    devanagari: "पञ्चाङ्ग",
    plannedTools: [
      "Today's Panchang",
      "Panchang by Date",
      "Rahu Kaal Finder",
      "Choghadiya",
      "Hora Chart",
      "Sunrise & Sunset",
    ],
  },
  {
    slug: "festivals",
    title: "Festival Tools",
    short: "Festivals",
    description:
      "Every Sanatan festival — dates, vrat rules, puja vidhi, katha, mantras and reminders.",
    icon: CalendarHeart,
    hue: "maroon",
    devanagari: "उत्सव",
    plannedTools: [
      "Festival Calendar 2026",
      "Vrat Calendar",
      "Festival Countdown",
      "Ekadashi Dates",
      "Purnima & Amavasya",
      "Regional Festivals",
    ],
  },
  {
    slug: "puja",
    title: "Puja Tools",
    short: "Puja",
    description: "Puja vidhi planners, samagri lists, sankalp generators and step-by-step guides.",
    icon: Flame,
    hue: "maroon",
    devanagari: "पूजा",
    plannedTools: [
      "Puja Vidhi Planner",
      "Samagri Checklist",
      "Sankalp Generator",
      "Aarti Collection",
      "Griha Pravesh Planner",
      "Havan Guide",
    ],
  },
  {
    slug: "mantras",
    title: "Mantra Tools",
    short: "Mantras",
    description: "Curated mantras with meaning, audio, transliteration and a digital jaap counter.",
    icon: Music4,
    hue: "saffron",
    devanagari: "मन्त्र",
    plannedTools: [
      "Mantra Library",
      "Digital Jaap Counter",
      "Beej Mantras",
      "Deity Mantras",
      "Stotra Collection",
      "Mala Timer",
    ],
  },
  {
    slug: "ai",
    title: "AI Tools",
    short: "AI",
    description: "AI-powered shloka explainers, mantra suggestion, puja planning and Sanatan Q&A.",
    icon: Sparkles,
    hue: "info",
    devanagari: "कृत्रिम बुद्धि",
    plannedTools: [
      "AI Shloka Explainer",
      "Mantra Recommender",
      "Sanatan Q&A",
      "AI Puja Planner",
      "Baby Name AI",
      "Sanskrit Translator",
    ],
  },
  {
    slug: "temples",
    title: "Temple Tools",
    short: "Temples",
    description:
      "Temple directory, darshan timings, dress codes, nearby ashrams and yatra planners.",
    icon: Landmark,
    hue: "gold",
    devanagari: "मन्दिर",
    plannedTools: [
      "Temple Directory",
      "Darshan Timings",
      "Char Dham Planner",
      "Jyotirlinga Guide",
      "Shakti Peeth Guide",
      "Nearby Temples",
    ],
  },
  {
    slug: "calculators",
    title: "Calculators",
    short: "Calculators",
    description: "Kundli, dasha, nakshatra, gemstone, numerology and other Vedic calculators.",
    icon: Calculator,
    hue: "info",
    devanagari: "गणक",
    plannedTools: [
      "Kundli Generator",
      "Rashi Calculator",
      "Nakshatra Finder",
      "Dasha Calculator",
      "Gemstone Recommender",
      "Numerology",
    ],
  },
  {
    slug: "sanskrit",
    title: "Sanskrit Tools",
    short: "Sanskrit",
    description: "Sanskrit dictionary, transliteration, sandhi splitter and shloka analyzer.",
    icon: BookOpenText,
    hue: "success",
    devanagari: "संस्कृतम्",
    plannedTools: [
      "Sanskrit Dictionary",
      "Transliteration",
      "Sandhi Splitter",
      "Shloka Analyzer",
      "Devanagari Typing",
      "Verb Conjugator",
    ],
  },
  {
    slug: "baby-names",
    title: "Baby Names",
    short: "Baby Names",
    description: "Sanskrit and Sanatan baby names by nakshatra, rashi, deity and meaning.",
    icon: Baby,
    hue: "saffron",
    devanagari: "शिशु नाम",
    plannedTools: [
      "Names by Nakshatra",
      "Names by Rashi",
      "Names by Deity",
      "Names by Meaning",
      "Twin Names",
      "AI Name Suggester",
    ],
  },
  {
    slug: "learning",
    title: "Learning",
    short: "Learn",
    description:
      "Structured guides on Vedas, Upanishads, Puranas, Gita, yoga and Sanatan philosophy.",
    icon: GraduationCap,
    hue: "gold",
    devanagari: "विद्या",
    plannedTools: [
      "Bhagavad Gita",
      "Upanishads Guide",
      "Vedas Introduction",
      "Yoga Sutras",
      "Sanatan Timeline",
      "Deity Encyclopedia",
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
