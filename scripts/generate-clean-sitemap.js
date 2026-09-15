import fs from "node:fs";

const DOMAIN = "https://www.sanatantools.com";
const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/kundli", priority: "1.0", changefreq: "daily" },
  { path: "/tools", priority: "0.9", changefreq: "daily" },
  { path: "/astrology", priority: "0.9", changefreq: "daily" },
  { path: "/panchang", priority: "0.9", changefreq: "daily" },
  { path: "/mantras", priority: "0.9", changefreq: "daily" },
  { path: "/festivals", priority: "0.9", changefreq: "daily" },
  { path: "/temples", priority: "0.9", changefreq: "daily" },
  { path: "/calculators", priority: "0.9", changefreq: "daily" },
  { path: "/sanskrit", priority: "0.9", changefreq: "daily" },
  { path: "/baby-names", priority: "0.9", changefreq: "daily" },
  { path: "/puja", priority: "0.9", changefreq: "daily" },
  { path: "/learning", priority: "0.9", changefreq: "daily" },
  { path: "/ai", priority: "0.9", changefreq: "daily" },
  { path: "/pricing", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/blog/understanding-your-janam-kundli", priority: "0.8", changefreq: "monthly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/support", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/festivals/year/2026", priority: "0.9", changefreq: "daily" },
  { path: "/festivals/year/2027", priority: "0.8", changefreq: "weekly" },
];

const legalSlugs = [
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "cookie-policy",
  "ai-disclaimer",
  "religious-content-disclaimer",
  "astrology-kundli-disclaimer",
  "copyright-policy",
  "dmca-policy",
  "refund-policy",
  "affiliate-disclosure",
  "accessibility-statement",
  "editorial-policy",
  "community-guidelines",
];

const legalPages = [
  { path: "/legal", priority: "0.7", changefreq: "monthly" },
  ...legalSlugs.map((s) => ({ path: `/legal/${s}`, priority: "0.6", changefreq: "monthly" })),
];

const horoscopeSigns = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

const horoscopePages = [
  { path: "/daily-horoscope", priority: "0.9", changefreq: "daily" },
  ...horoscopeSigns.map((s) => ({ path: `/daily-horoscope/${s}`, priority: "0.9", changefreq: "daily" })),
  { path: "/weekly-horoscope", priority: "0.8", changefreq: "weekly" },
  ...horoscopeSigns.map((s) => ({ path: `/weekly-horoscope/${s}`, priority: "0.8", changefreq: "weekly" })),
  { path: "/monthly-horoscope", priority: "0.8", changefreq: "monthly" },
  ...horoscopeSigns.map((s) => ({ path: `/monthly-horoscope/${s}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/yearly-horoscope", priority: "0.8", changefreq: "monthly" },
  ...horoscopeSigns.map((s) => ({ path: `/yearly-horoscope/${s}`, priority: "0.8", changefreq: "monthly" })),
];

const toolSlugs = [
  "todays-panchang",
  "muhurat-dashboard",
  "advanced-panchang",
  "personal-guidance",
  "monthly-panchang",
  "panchang-compare",
  "plan-your-day",
  "todays-tithi",
  "todays-nakshatra",
  "todays-yoga",
  "todays-karana",
  "todays-sunrise",
  "todays-sunset",
  "rahu-kaal",
  "gulika-kaal",
  "yamaganda",
  "choghadiya",
  "panchang-by-date",
  "hora-chart",
  "sunrise-sunset-atlas",
  "moon-phase",
  "abhijit-muhurat",
  "brahma-muhurat",
  "festival-calendar-2026",
  "vrat-calendar",
  "festival-countdown",
  "ekadashi-dates",
  "purnima-amavasya",
  "regional-festivals",
  "upcoming-festivals",
  "festival-finder",
  "festival-of-the-day",
  "pradosh-vrat",
  "sankashti-chaturthi",
  "puja-vidhi-planner",
  "samagri-checklist",
  "sankalp-generator",
  "aarti-collection",
  "griha-pravesh-planner",
  "havan-guide",
  "puja-checklist-generator",
  "aarti-thali-guide",
  "prasad-recipes",
  "mantra-library",
  "digital-jaap-counter",
  "beej-mantras",
  "deity-mantras",
  "stotra-collection",
  "mantra-timer",
  "mala-counter",
  "om-counter",
  "chalisa-collection",
  "gayatri-mantra",
  "mahamrityunjaya-mantra",
  "mantra-of-the-day",
  "ai-shlok-explainer",
  "mantra-recommender",
  "ai-dharma-assistant",
  "ai-puja-planner",
  "baby-name-ai",
  "ai-sanskrit-helper",
  "ai-mantra-meaning",
  "ai-name-suggester",
  "ai-gita-summary",
  "ai-festival-guide",
  "temple-directory",
  "darshan-timings",
  "char-dham-planner",
  "jyotirlinga-guide",
  "shakti-peeth-guide",
  "nearby-temples",
  "temple-finder",
  "deity-of-the-day",
  "rashi-calculator",
  "nakshatra-finder",
  "dasha-calculator",
  "gemstone-recommender",
  "numerology",
  "birthstone-finder",
  "name-numerology",
  "kundli-matching",
  "love-compatibility",
  "rashi-guide",
  "nakshatra-guide",
  "varshphal",
  "numerology-report",
  "career-report",
  "vastu-report",
  "baby-name-generator",
  "names-by-nakshatra",
  "names-by-rashi",
  "names-by-deity",
  "names-by-meaning",
  "twin-names",
  "bhagavad-gita",
  "upanishads-guide",
  "vedas-introduction",
  "yoga-sutras",
  "sanatan-timeline",
  "deity-encyclopedia",
  "ramayana-summary",
  "mahabharata-summary",
  "puranas-overview",
  "daily-quote",
  "daily-shlok",
  "sanskrit-dictionary",
  "transliteration",
  "sandhi-splitter",
  "shloka-analyzer",
  "devanagari-typing",
  "verb-conjugator",
  "sanskrit-word-of-day",
];

const toolPages = toolSlugs.map((s) => ({
  path: `/tools/${s}`,
  priority: "0.85",
  changefreq: "weekly",
}));

const nakshatras = [
  "ashwini", "bharani", "krittika", "rohini", "mrigashirsha", "ardra",
  "punarvasu", "pushya", "ashlesha", "magha", "purva-phalguni", "uttara-phalguni",
  "hasta", "chitra", "swati", "vishakha", "anuradha", "jyeshtha", "mula",
  "purva-ashadha", "uttara-ashadha", "shravana", "dhanishta", "shatabhisha",
  "purva-bhadrapada", "uttara-bhadrapada", "revati",
];

const rashis = [
  "mesha", "vrishabha", "mithuna", "karka", "simha", "kanya",
  "tula", "vrishchika", "dhanu", "makara", "kumbha", "meena",
];

const yogas = [
  "gaja-kesari", "budhaditya-yoga", "panch-mahapurusha-yoga", "ruchaka-yoga",
  "bhadra-yoga", "hamsa-yoga", "malavya-yoga", "shasha-yoga", "dhana-yoga",
  "raja-yoga", "viparita-raja-yoga", "neecha-bhanga-raja-yoga", "amala-yoga",
];

const doshas = [
  "mangal-dosha", "kaal-sarp-dosha", "pitra-dosha", "shani-dosha", "sade-sati",
  "guru-chandal-dosha", "grahan-dosha", "kemadruma-dosha", "nadi-dosha", "bhakoot-dosha",
];

const muhurats = [
  "marriage-muhurat", "griha-pravesh-muhurat", "vehicle-purchase-muhurat",
  "property-purchase-muhurat", "business-opening-muhurat", "namkaran-muhurat",
  "annaprashan-muhurat", "mundan-muhurat", "bhoomi-pujan-muhurat",
  "abhijit-muhurat", "brahma-muhurat", "choghadiya-muhurat",
];

const numerologyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const vastuDirections = [
  "north-direction", "north-east-direction", "east-direction", "south-east-direction",
  "south-direction", "south-west-direction", "west-direction", "north-west-direction",
];

const entityPages = [
  { path: "/nakshatra", priority: "0.8", changefreq: "weekly" },
  ...nakshatras.map((n) => ({ path: `/nakshatra/${n}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/rashi", priority: "0.8", changefreq: "weekly" },
  ...rashis.map((r) => ({ path: `/rashi/${r}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/yoga", priority: "0.8", changefreq: "weekly" },
  ...yogas.map((y) => ({ path: `/yoga/${y}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/dosha", priority: "0.8", changefreq: "weekly" },
  ...doshas.map((d) => ({ path: `/dosha/${d}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/muhurat", priority: "0.8", changefreq: "weekly" },
  ...muhurats.map((m) => ({ path: `/muhurat/${m}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/numerology", priority: "0.8", changefreq: "weekly" },
  ...numerologyNumbers.map((num) => ({ path: `/numerology/number-${num}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/vastu", priority: "0.8", changefreq: "weekly" },
  ...vastuDirections.map((v) => ({ path: `/vastu/${v}`, priority: "0.8", changefreq: "monthly" })),
];

const allEntries = [
  ...staticPages,
  ...toolPages,
  ...entityPages,
  ...horoscopePages,
  ...legalPages,
];

// Deduplicate by path
const seen = new Set();
const uniqueEntries = [];
for (const entry of allEntries) {
  if (!seen.has(entry.path)) {
    seen.add(entry.path);
    uniqueEntries.push(entry);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniqueEntries
  .map(
    (e) => `  <url>
    <loc>${DOMAIN}${e.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`Generated public/sitemap.xml with ${uniqueEntries.length} canonical URLs.`);

const robotsTxt = `# robots.txt for SanatanTools (https://www.sanatantools.com)
User-agent: *
Allow: /
Disallow: /auth/
Disallow: /auth
Disallow: /reset-password/
Disallow: /reset-password
Disallow: /dashboard/
Disallow: /dashboard
Disallow: /admin/
Disallow: /admin
Disallow: /api/
Disallow: /api
Disallow: /profile/
Disallow: /profile
Disallow: /settings/
Disallow: /settings
Disallow: /billing/
Disallow: /billing
Disallow: /bookmarks/
Disallow: /bookmarks
Disallow: /favorites/
Disallow: /favorites
Disallow: /history/
Disallow: /history
Disallow: /notifications/
Disallow: /notifications
Disallow: /saved-mantras/
Disallow: /saved-mantras
Disallow: /my-kundlis/
Disallow: /my-kundlis
Disallow: /family/
Disallow: /family
Disallow: /downloads/
Disallow: /downloads
Disallow: /horoscope-history/
Disallow: /horoscope-history
Disallow: /reports/shared/
Disallow: /*?*utm_
Disallow: /*?*fbclid
Disallow: /*?*gclid
Disallow: /*?*ref=

# AI & Search crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

# Block abusive scrapers
User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Timpibot
Disallow: /

Sitemap: https://www.sanatantools.com/sitemap.xml
`;

fs.writeFileSync("public/robots.txt", robotsTxt, "utf-8");
console.log(`Generated public/robots.txt with strict indexing rules.`);

