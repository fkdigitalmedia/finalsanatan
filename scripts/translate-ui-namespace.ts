/**
 * translate-ui-namespace.ts
 * ------------------------------------------------------------------
 * Translate one top-level namespace of `src/i18n/translations/en.json`
 * into every enabled language and merge the result into that language's
 * JSON file (existing keys are preserved unless --force).
 *
 * Usage:  bun run scripts/translate-ui-namespace.ts <namespace> [langs...] [--force]
 *         bun run scripts/translate-ui-namespace.ts horoscope
 *         bun run scripts/translate-ui-namespace.ts kundli hi mr --force
 * ------------------------------------------------------------------
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  "Lagna",
  "Kundli",
  "Navamsa",
  "Rashi",
  "Mahadasha",
  "Antardasha",
  "Vimshottari",
  "Dasha",
  "Gochar",
  "Sade Sati",
  "Guna Milan",
  "Ashtakoot",
  "Mangal Dosh",
  "Muhurat",
  "Varshphal",
  "Vastu",
  "Mantra",
  "Puja",
  "Graha",
  "Bhava",
  "Ayanamsa",
  "Lahiri",
  "Rashifal",
  "Horoscope",
  "Numerology",
];

const args = process.argv.slice(2);
const force = args.includes("--force");
const positional = args.filter((a) => !a.startsWith("--"));
const namespace = positional[0];
const langs = positional.slice(1).length ? positional.slice(1) : Object.keys(LANG_NAMES);

if (!namespace) {
  console.error(
    "Usage: bun run scripts/translate-ui-namespace.ts <namespace> [langs...] [--force]",
  );
  process.exit(1);
}

const API_KEY = process.env.LOVABLE_API_KEY;
if (!API_KEY) {
  console.error("LOVABLE_API_KEY missing in env");
  process.exit(1);
}

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "i18n", "translations");
const en = JSON.parse(readFileSync(join(DIR, "en.json"), "utf8")) as Record<string, unknown>;
const source = en[namespace];
if (!source) {
  console.error(`Namespace "${namespace}" not found in en.json`);
  process.exit(1);
}

type Json = unknown;

function isObj(v: Json): v is Record<string, Json> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Deep-merge translated values into an existing tree without dropping keys. */
function merge(base: Json, next: Json, overwrite: boolean): Json {
  if (isObj(base) && isObj(next)) {
    const out: Record<string, Json> = { ...base };
    for (const [k, v] of Object.entries(next)) {
      out[k] = k in out ? merge(out[k], v, overwrite) : v;
    }
    return out;
  }
  if (base === undefined || overwrite) return next;
  return base;
}

/** Keys present in `src` but missing in `have`. */
function missingSubtree(src: Json, have: Json): Json | undefined {
  if (!isObj(src)) return have === undefined ? src : undefined;
  const out: Record<string, Json> = {};
  for (const [k, v] of Object.entries(src)) {
    const h = isObj(have) ? have[k] : undefined;
    const m = missingSubtree(v, h);
    if (m !== undefined) out[k] = m;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Split a tree into chunks of at most `max` leaf strings. */
function chunk(tree: Record<string, Json>, max = 120): Record<string, Json>[] {
  const count = (v: Json): number =>
    isObj(v)
      ? Object.values(v).reduce((a: number, x) => a + count(x), 0)
      : Array.isArray(v)
        ? v.length
        : 1;
  const chunks: Record<string, Json>[] = [];
  let cur: Record<string, Json> = {};
  let n = 0;
  for (const [k, v] of Object.entries(tree)) {
    const c = count(v);
    if (n > 0 && n + c > max) {
      chunks.push(cur);
      cur = {};
      n = 0;
    }
    cur[k] = v;
    n += c;
  }
  if (Object.keys(cur).length) chunks.push(cur);
  return chunks;
}

function systemPrompt(lang: string): string {
  return `You are a professional Sanatan Dharma / Vedic astrology UI translator.
Translate the JSON string VALUES into ${LANG_NAMES[lang]}.

STRICT RULES:
1. Return VALID JSON only — exactly the same shape and the same keys, no commentary.
2. Keep all JSON keys in English. Translate only the string values.
3. Preserve these terms (transliterate the script only, meaning unchanged): ${PRESERVE.join(", ")}.
4. Preserve placeholders such as {{name}}, {{count}}, {{sign}} exactly as written.
5. Leave numbers, dates, times, URLs, HTML tags and code-like tokens unchanged.
6. Use short, natural UI wording — this is button/label/heading copy, not prose.
7. Arrays stay arrays with the same length.`;
}

async function translateChunk(
  lang: string,
  tree: Record<string, Json>,
): Promise<Record<string, Json>> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt(lang) },
        { role: "user", content: JSON.stringify(tree, null, 2) },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content) as Record<string, Json>;
}

async function runLang(lang: string) {
  const file = join(DIR, `${lang}.json`);
  const dict = existsSync(file)
    ? (JSON.parse(readFileSync(file, "utf8")) as Record<string, Json>)
    : {};
  const existing = force ? undefined : dict[namespace];
  const todo = force ? source : missingSubtree(source, existing);
  if (!todo) {
    console.log(`[${lang}] ${namespace}: up to date`);
    return;
  }
  const parts = chunk(todo as Record<string, Json>);
  let translated: Record<string, Json> = {};
  for (let i = 0; i < parts.length; i += 1) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const out = await translateChunk(lang, parts[i]);
        translated = { ...translated, ...out };
        console.log(`  [${lang}] chunk ${i + 1}/${parts.length} ok`);
        break;
      } catch (err) {
        console.error(`  [${lang}] chunk ${i + 1} attempt ${attempt}: ${(err as Error).message}`);
        if (attempt === 3) throw err;
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  dict[namespace] = merge(existing ?? {}, translated, force);
  writeFileSync(file, `${JSON.stringify(dict, null, 2)}\n`, "utf8");
  console.log(`[${lang}] ${namespace}: written`);
}

async function run() {
  await Promise.all(
    langs
      .filter((l) => LANG_NAMES[l])
      .map((l) => runLang(l).catch((e) => console.error(`[${l}] FAILED: ${(e as Error).message}`))),
  );
}

void run();
