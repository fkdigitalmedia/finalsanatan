/**
 * translate-tool-content.ts
 * ------------------------------------------------------------------
 * Batch-translate every tool content pack into a target language via
 * the Lovable AI Gateway, writing one JSON per (lang, slug).
 *
 * Usage:  bun run scripts/translate-tool-content.ts <lang> [--force]
 *         bun run scripts/translate-tool-content.ts hi
 *         bun run scripts/translate-tool-content.ts mr --force
 *
 * Idempotent: skips slugs whose JSON already exists unless --force.
 * Preserves Sanskrit terms in Devanagari/native script; never uses
 * Google Translate. Uses google/gemini-2.5-flash (free tier).
 * ------------------------------------------------------------------
 */
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FLAGSHIP_CONTENT } from "../src/tools/content/flagship";
import { BATCH2_CONTENT } from "../src/tools/content/batch2";
import { BATCH3_MANTRAS } from "../src/tools/content/batch3-mantras";
import { BATCH4_CONTENT } from "../src/tools/content/batch4";
import { BATCH5_CONTENT } from "../src/tools/content/batch5";

const ALL: Record<string, unknown> = {
  ...FLAGSHIP_CONTENT,
  ...BATCH2_CONTENT,
  ...BATCH3_MANTRAS,
  ...BATCH4_CONTENT,
  ...BATCH5_CONTENT,
};

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (हिन्दी, Devanagari)",
  mr: "Marathi (मराठी, Devanagari)",
  gu: "Gujarati (ગુજરાતી)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  kn: "Kannada (ಕನ್ನಡ)",
  bn: "Bengali (বাংলা)",
  ml: "Malayalam (മലയാളം)",
  pa: "Punjabi (ਪੰਜਾਬੀ, Gurmukhi)",
  or: "Odia (ଓଡ଼ିଆ)",
  as: "Assamese (অসমীয়া)",
};

const PRESERVE = [
  "Panchang",
  "Tithi",
  "Nakshatra",
  "Yoga",
  "Karana",
  "Rahu Kaal",
  "Yamaganda",
  "Gulika Kaal",
  "Abhijit",
  "Brahma Muhurat",
  "Lagna",
  "Kundli",
  "Navamsa",
  "Rashi",
  "Mahadasha",
  "Antardasha",
  "Vimshottari",
  "Choghadiya",
  "Hora",
  "Ekadashi",
  "Pradosh",
  "Sankashti",
  "Amavasya",
  "Purnima",
  "Griha Pravesh",
  "Havan",
  "Puja",
  "Sankalp",
  "Samagri",
  "Mantra",
  "Beej",
  "Gayatri",
  "Mahamrityunjaya",
  "Aarti",
  "Chalisa",
  "Stotra",
  "Jaap",
  "Vrat",
  "Muhurat",
  "Shloka",
  "Shlok",
  "Deity",
  "Jyotirlinga",
  "Shakti Peeth",
  "Char Dham",
  "Ayanamsa",
  "Lahiri",
];

const lang = process.argv[2];
const force = process.argv.includes("--force");

if (!lang || !LANG_NAMES[lang]) {
  console.error("Usage: bun run scripts/translate-tool-content.ts <lang>");
  console.error("Langs:", Object.keys(LANG_NAMES).join(", "));
  process.exit(1);
}

const API_KEY = process.env.LOVABLE_API_KEY;
if (!API_KEY) {
  console.error("LOVABLE_API_KEY missing in env");
  process.exit(1);
}

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "tools",
  "content",
  "i18n",
  lang,
);
mkdirSync(OUT_DIR, { recursive: true });

const SYSTEM_PROMPT = `You are a professional Sanatan Dharma translator.
Translate the JSON value fields into ${LANG_NAMES[lang]}.

STRICT RULES:
1. Return VALID JSON only — same shape as input, no commentary.
2. Preserve these Sanskrit terms exactly (transliterate script only, meaning unchanged): ${PRESERVE.join(", ")}.
3. Never machine-translate literally — write like a native ${LANG_NAMES[lang]} SEO copywriter would.
4. Keep all JSON keys in English. Only translate string VALUES.
5. Arrays stay arrays; objects keep their shape.
6. Numbers, times (14:32), coordinates, code-like tokens: leave as-is.
7. Never add or remove entries from arrays.
8. Keep FAQs conversational and search-friendly in the target language.`;

async function translateOne(slug: string, spec: unknown): Promise<unknown> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Translate this content pack for the tool slug "${slug}".\n\n${JSON.stringify(spec, null, 2)}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content);
}

async function run() {
  const slugs = Object.keys(ALL);
  console.log(`[${lang}] Translating ${slugs.length} tools → ${OUT_DIR}`);
  let done = 0,
    skipped = 0,
    failed = 0;

  for (const slug of slugs) {
    const outPath = join(OUT_DIR, `${slug}.json`);
    if (!force && existsSync(outPath)) {
      skipped++;
      continue;
    }
    try {
      const translated = await translateOne(slug, ALL[slug]);
      writeFileSync(outPath, JSON.stringify(translated, null, 2), "utf8");
      done++;
      console.log(`  ✓ ${slug} (${done}/${slugs.length})`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${slug}: ${(err as Error).message}`);
    }
    // gentle pacing to avoid rate limit
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log(`[${lang}] done=${done} skipped=${skipped} failed=${failed}`);
}

run();
