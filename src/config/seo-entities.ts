// ============================================================
// Phase 14.7 — Programmatic SEO entity registry.
// Every row here becomes a landing page, a sitemap entry, an internal
// link target and a schema node — automatically. Adding a new entity is
// a one-line change; no route, sitemap or metadata edit is needed.
// ============================================================

import { NAKSHATRAS } from "@/lib/kundli/types";
import { SIGNS } from "@/lib/horoscope-public";
import { slugify } from "@/lib/seo/slug";

export interface SeoEntity {
  slug: string;
  title: string;
  /** One-line summary — used verbatim as the meta description seed. */
  summary: string;
  /** Longer body copy shown on the landing page (2–4 paragraphs). */
  body: string[];
  /** Quick facts rendered as a definition list. */
  facts?: { label: string; value: string }[];
  /** Extra internal links relevant to this entity. */
  related?: { label: string; to: string }[];
}

export type EntityFamily =
  "nakshatra" | "rashi" | "yoga" | "dosha" | "muhurat" | "numerology" | "vastu";

// ── Nakshatras ──────────────────────────────────────────────
const NAKSHATRA_LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];
const NAKSHATRA_DEITIES = [
  "Ashwini Kumaras",
  "Yama",
  "Agni",
  "Brahma",
  "Soma",
  "Rudra",
  "Aditi",
  "Brihaspati",
  "Sarpa",
  "Pitrs",
  "Bhaga",
  "Aryaman",
  "Savitr",
  "Vishwakarma",
  "Vayu",
  "Indra-Agni",
  "Mitra",
  "Indra",
  "Nirriti",
  "Apas",
  "Vishvedevas",
  "Vishnu",
  "Vasus",
  "Varuna",
  "Aja Ekapada",
  "Ahir Budhnya",
  "Pushan",
];

export const NAKSHATRA_ENTITIES: SeoEntity[] = NAKSHATRAS.map((name, i) => {
  const lord = NAKSHATRA_LORDS[i];
  const deity = NAKSHATRA_DEITIES[i];
  const start = (i * 13 + i / 3).toFixed(2);
  return {
    slug: slugify(name, { keepStopWords: true }),
    title: `${name} Nakshatra`,
    summary: `${name} nakshatra — ruled by ${lord}, presided over by ${deity}. Traits, padas, compatibility and auspicious activities.`,
    body: [
      `${name} is nakshatra number ${i + 1} of the 27 lunar mansions in Vedic astrology, spanning ${start}° of the zodiac in 13°20' steps. Its planetary lord is ${lord} and its presiding deity is ${deity}.`,
      `The Moon's position in ${name} at birth shapes the Vimshottari Mahadasha sequence — a ${name} birth begins life in the ${lord} mahadasha, with the balance of that period decided by how far the Moon had travelled through the nakshatra.`,
      `Use the free Kundli generator to find whether ${name} is your janma nakshatra, and the Panchang to see exactly when the Moon transits ${name} on any date.`,
    ],
    facts: [
      { label: "Number", value: String(i + 1) },
      { label: "Ruling planet", value: lord },
      { label: "Deity", value: deity },
      { label: "Padas", value: "4" },
    ],
    related: [
      { label: "Today's Nakshatra", to: "/tools/todays-nakshatra" },
      { label: "Free Kundli", to: "/kundli" },
    ],
  };
});

// ── Rashis ──────────────────────────────────────────────────
export const RASHI_ENTITIES: SeoEntity[] = SIGNS.map((s, i) => ({
  slug: s.slug,
  title: `${s.english} (${s.hindi}) Rashi`,
  summary: `${s.english} rashi — personality, ruling planet, lucky factors and today's horoscope.`,
  body: [
    `${s.english} (${s.sanskrit}) is sign number ${i + 1} of the Vedic zodiac, ruled by ${s.rulingPlanet} with the ${s.element} element. In Jyotish the Moon sign (chandra rashi), not the Sun sign, drives daily predictions — so the horoscope below is calculated from the real position of the Moon.`,
    `Read the daily, weekly, monthly and yearly forecast for ${s.english}, or generate a full Kundli to see how ${s.english} interacts with your ascendant and current Mahadasha.`,
  ],
  related: [
    { label: `Daily horoscope`, to: `/daily-horoscope/${s.slug}` },
    { label: `Weekly horoscope`, to: `/weekly-horoscope/${s.slug}` },
    { label: `Monthly horoscope`, to: `/monthly-horoscope/${s.slug}` },
  ],
}));

// ── Yogas ───────────────────────────────────────────────────
const YOGA_SEED: [string, string][] = [
  [
    "Gaja Kesari Yoga",
    "Jupiter in a kendra from the Moon — grants intelligence, reputation and lasting influence.",
  ],
  [
    "Budhaditya Yoga",
    "Sun and Mercury conjunct — sharp intellect, communication skill and administrative talent.",
  ],
  [
    "Chandra Mangal Yoga",
    "Moon with Mars — earning ability, drive and resourcefulness in business.",
  ],
  [
    "Ruchaka Yoga",
    "Mars in own or exalted sign in a kendra — courage, leadership and physical strength.",
  ],
  [
    "Bhadra Yoga",
    "Mercury in own or exalted sign in a kendra — eloquence, learning and commercial success.",
  ],
  ["Hamsa Yoga", "Jupiter in own or exalted sign in a kendra — wisdom, ethics and respect."],
  [
    "Malavya Yoga",
    "Venus in own or exalted sign in a kendra — beauty, comfort and artistic gifts.",
  ],
  [
    "Shasha Yoga",
    "Saturn in own or exalted sign in a kendra — authority, discipline and endurance.",
  ],
  ["Dhana Yoga", "Wealth-giving combinations between the 2nd, 5th, 9th and 11th lords."],
  ["Raja Yoga", "Kendra and trikona lords linked — status, power and steady rise."],
  ["Viparita Raja Yoga", "Dusthana lords in dusthanas — success that arrives through adversity."],
  [
    "Neecha Bhanga Raja Yoga",
    "A cancelled debilitation that turns weakness into unusual achievement.",
  ],
  [
    "Panch Mahapurusha Yoga",
    "The five great-personality yogas formed by Mars, Mercury, Jupiter, Venus and Saturn.",
  ],
  ["Amala Yoga", "A benefic in the 10th from the Moon or lagna — spotless reputation."],
];

export const YOGA_ENTITIES: SeoEntity[] = YOGA_SEED.map(([title, summary]) => ({
  slug: slugify(title),
  title,
  summary,
  body: [
    `${title}: ${summary}`,
    `Whether ${title} is present in your chart depends on exact planetary longitudes, house lordships and strength (bala). The Kundli engine checks all of these automatically and reports the yoga only when every condition is met — no guesswork.`,
    `Generate your free Kundli to see whether ${title} is active, how strong it is, and which Mahadasha period will deliver its results.`,
  ],
  related: [
    { label: "Free Kundli", to: "/kundli" },
    { label: "Kundli & Jyotish tools", to: "/astrology" },
  ],
}));

// ── Doshas ──────────────────────────────────────────────────
const DOSHA_SEED: [string, string][] = [
  [
    "Mangal Dosha",
    "Mars in houses 1, 2, 4, 7, 8 or 12 — the classic 'Manglik' condition studied before marriage.",
  ],
  [
    "Kaal Sarp Dosha",
    "All planets hemmed between Rahu and Ketu — delays, struggle and sudden turns.",
  ],
  [
    "Pitra Dosha",
    "Afflictions to the Sun or 9th house — ancestral karma requiring shraddha remedies.",
  ],
  [
    "Shani Dosha",
    "Saturn afflicting the lagna, Moon or key lords — slow progress and hard-earned results.",
  ],
  ["Sade Sati", "Saturn's 7½-year transit over the 12th, 1st and 2nd from the natal Moon."],
  ["Guru Chandal Dosha", "Jupiter conjunct Rahu — distorted judgement and unconventional beliefs."],
  ["Grahan Dosha", "Sun or Moon with Rahu/Ketu — an eclipse-like affliction to vitality or mind."],
  ["Kemadruma Dosha", "No planet in the 2nd or 12th from the Moon — emotional isolation."],
  ["Nadi Dosha", "Same Nadi for both partners in Guna Milan — the heaviest matching penalty."],
  ["Bhakoot Dosha", "Unfavourable Moon-sign axis between partners in Ashtakoot matching."],
];

export const DOSHA_ENTITIES: SeoEntity[] = DOSHA_SEED.map(([title, summary]) => ({
  slug: slugify(title),
  title,
  summary,
  body: [
    `${title}: ${summary}`,
    `Most "dosha" scares online come from a single rule applied without cancellation checks. The engine here evaluates the classical exceptions too — sign placement, aspects, strength and matching cancellations — so you see whether the dosha is genuinely active or already neutralised.`,
    `Check your chart free, and if the dosha is present the report lists the traditional remedies along with the exact period when its effect peaks.`,
  ],
  related: [
    { label: "Free Kundli", to: "/kundli" },
    { label: "Kundli Matching", to: "/tools/kundli-matching" },
  ],
}));

// ── Muhurat types ───────────────────────────────────────────
const MUHURAT_SEED: [string, string][] = [
  [
    "Marriage Muhurat",
    "Vivah muhurat dates chosen from tithi, nakshatra, yoga and the Guru/Shukra positions.",
  ],
  ["Griha Pravesh Muhurat", "Auspicious windows for entering a new home."],
  ["Vehicle Purchase Muhurat", "Best days and choghadiya windows for buying a car or two-wheeler."],
  ["Property Purchase Muhurat", "Timing for registry, agreement and possession."],
  ["Business Opening Muhurat", "Shubh muhurat for a new shop, office or venture launch."],
  ["Namkaran Muhurat", "Naming-ceremony timing based on the child's janma nakshatra."],
  ["Annaprashan Muhurat", "First-rice ceremony windows."],
  ["Mundan Muhurat", "Tonsure ceremony timing."],
  ["Bhoomi Pujan Muhurat", "Ground-breaking timing for construction."],
  ["Abhijit Muhurat", "The most auspicious 48 minutes around solar noon, valid almost every day."],
  ["Brahma Muhurat", "The pre-dawn window ideal for sadhana, japa and study."],
  ["Choghadiya Muhurat", "The eight day and night divisions used for quick day-to-day decisions."],
];

export const MUHURAT_ENTITIES: SeoEntity[] = MUHURAT_SEED.map(([title, summary]) => ({
  slug: slugify(title),
  title,
  summary,
  body: [
    `${title}: ${summary}`,
    `Every muhurat here is computed live for your city — real sunrise, sunset and tithi transitions, not a generic table. Change the location and the windows shift accordingly.`,
    `Open the Muhurat Dashboard for today's live windows, or the Monthly Panchang to plan weeks ahead and export the dates to your calendar.`,
  ],
  related: [
    { label: "Muhurat Dashboard", to: "/tools/muhurat-dashboard" },
    { label: "Monthly Panchang", to: "/tools/monthly-panchang" },
  ],
}));

// ── Numerology numbers ──────────────────────────────────────
const NUMEROLOGY_MEANINGS: Record<number, [string, string]> = {
  1: ["Sun", "Leadership, originality and the will to begin."],
  2: ["Moon", "Sensitivity, partnership and intuition."],
  3: ["Jupiter", "Expansion, teaching, optimism and creativity."],
  4: ["Rahu", "Unconventional thinking, structure and sudden change."],
  5: ["Mercury", "Communication, commerce, agility and wit."],
  6: ["Venus", "Beauty, comfort, relationships and the arts."],
  7: ["Ketu", "Research, detachment, spirituality and depth."],
  8: ["Saturn", "Discipline, endurance, karma and slow-built wealth."],
  9: ["Mars", "Energy, courage, competition and service."],
};

export const NUMEROLOGY_ENTITIES: SeoEntity[] = Object.entries(NUMEROLOGY_MEANINGS).map(
  ([n, [planet, meaning]]) => ({
    slug: `number-${n}`,
    title: `Numerology Number ${n}`,
    summary: `Numerology number ${n} — ruled by ${planet}. ${meaning}`,
    body: [
      `Number ${n} is governed by ${planet} in Vedic numerology (ank jyotish). Its core signature: ${meaning.toLowerCase()}`,
      `Your Mulank (root number) comes from the date of birth, while the Bhagyank (destiny number) reduces the full date. When either equals ${n}, the qualities of ${planet} colour your temperament, career direction and the years that turn out most eventful.`,
      `Run the free Numerology report to get your Mulank, Bhagyank, name number, lucky dates, colours and the remedies traditionally prescribed for ${planet}.`,
    ],
    facts: [
      { label: "Ruling planet", value: planet },
      { label: "Number", value: n },
    ],
    related: [
      { label: "Numerology Report", to: "/tools/numerology" },
      { label: "Baby Name Suggestions", to: "/tools/baby-name-ai" },
    ],
  }),
);

// ── Vastu directions ────────────────────────────────────────
const VASTU_SEED: [string, string, string][] = [
  ["North", "Kubera", "Wealth, career flow and opportunity — keep it light, open and uncluttered."],
  [
    "North-East",
    "Ishanya",
    "The most sacred zone — ideal for the puja room, water and morning light.",
  ],
  ["East", "Indra", "Health and social standing — main doors and windows do well here."],
  [
    "South-East",
    "Agneya",
    "The fire zone — the correct place for the kitchen and electrical equipment.",
  ],
  ["South", "Yama", "Fame and stability — best kept heavy, with storage and tall furniture."],
  [
    "South-West",
    "Nairutya",
    "The heaviest zone — master bedroom, safes and structural mass belong here.",
  ],
  ["West", "Varuna", "Gains and children — dining and study areas suit this direction."],
  ["North-West", "Vayavya", "Movement and relationships — guest rooms, garages and stores."],
];

export const VASTU_ENTITIES: SeoEntity[] = VASTU_SEED.map(([dir, lord, meaning]) => ({
  slug: slugify(`${dir} direction`),
  title: `${dir} Direction Vastu`,
  summary: `${dir} (${lord}) in Vastu Shastra — ${meaning}`,
  body: [
    `In Vastu Shastra the ${dir} direction is governed by ${lord}. ${meaning}`,
    `Vastu works on balance rather than superstition: each of the eight directions carries an element and a natural function, and a room placed against that function creates friction you feel daily — poor sleep, money that never settles, arguments in the kitchen.`,
    `Use the free Vastu analyser to check your floor plan direction by direction and get corrections that do not require demolition.`,
  ],
  facts: [
    { label: "Direction", value: dir },
    { label: "Presiding lord", value: lord },
  ],
  related: [
    { label: "Vastu Analyser", to: "/tools/vastu-report" },
    { label: "Griha Pravesh Planner", to: "/tools/griha-pravesh-planner" },
  ],
}));

export const ENTITY_FAMILIES: Record<
  EntityFamily,
  { base: string; label: string; intro: string; items: SeoEntity[] }
> = {
  nakshatra: {
    base: "/nakshatra",
    label: "Nakshatras",
    intro: "All 27 lunar mansions — ruling planet, deity, padas and what each means in your chart.",
    items: NAKSHATRA_ENTITIES,
  },
  rashi: {
    base: "/rashi",
    label: "Rashis",
    intro: "The 12 Vedic Moon signs with daily, weekly, monthly and yearly forecasts.",
    items: RASHI_ENTITIES,
  },
  yoga: {
    base: "/yoga",
    label: "Yogas",
    intro: "Classical planetary yogas — what forms them and what they deliver.",
    items: YOGA_ENTITIES,
  },
  dosha: {
    base: "/dosha",
    label: "Doshas",
    intro: "Every major dosha explained honestly, with cancellations and real remedies.",
    items: DOSHA_ENTITIES,
  },
  muhurat: {
    base: "/muhurat",
    label: "Muhurat",
    intro: "Auspicious timing for every important occasion, computed live for your city.",
    items: MUHURAT_ENTITIES,
  },
  numerology: {
    base: "/numerology",
    label: "Numerology",
    intro: "Numbers 1–9, their ruling planets and what they say about you.",
    items: NUMEROLOGY_ENTITIES,
  },
  vastu: {
    base: "/vastu",
    label: "Vastu",
    intro: "The eight directions of Vastu Shastra and how to use each one.",
    items: VASTU_ENTITIES,
  },
};

export function findEntity(family: EntityFamily, slug: string): SeoEntity | undefined {
  return ENTITY_FAMILIES[family]?.items.find((e) => e.slug === slug);
}

/** Every programmatic landing path on the site (index pages + detail pages). */
export function allEntityPaths(): string[] {
  const out: string[] = [];
  for (const fam of Object.values(ENTITY_FAMILIES)) {
    out.push(fam.base);
    for (const item of fam.items) out.push(`${fam.base}/${item.slug}`);
  }
  return out;
}
