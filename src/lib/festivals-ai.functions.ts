/**
 * Festival AI Content Studio + Multilingual server functions.
 *
 * - generateFestivalContent: enrich empty fields on a festival using Lovable AI.
 * - translateFestival: produce a full translated content JSON for one language and
 *   upsert into festival_translations.
 * - translateFestivalAllLanguages: bulk translate to every supported language.
 * - setTranslationStatus / deleteFestivalTranslation: manage published state.
 *
 * All mutations require staff role. Uses Lovable AI Gateway (google/gemini-3.5-flash)
 * with strict JSON output and Sanskrit-term preservation.
 */
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createGateway, DEFAULT_MODEL } from "@/lib/ai-gateway.server";

type Ctx = { supabase: any; userId: string };

async function assertStaff(ctx: Ctx) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

export const SUPPORTED_LANGUAGES = [
  "hi",
  "mr",
  "gu",
  "ta",
  "te",
  "kn",
  "bn",
  "ml",
  "pa",
  "or",
  "as",
] as const;

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

const PRESERVE_TERMS = [
  "Panchang",
  "Tithi",
  "Nakshatra",
  "Yoga",
  "Karana",
  "Muhurat",
  "Ekadashi",
  "Purnima",
  "Amavasya",
  "Sankranti",
  "Vrat",
  "Puja",
  "Aarti",
  "Mantra",
  "Bhajan",
  "Chalisa",
  "Stotra",
  "Prasad",
  "Samagri",
  "Sankalp",
  "Havan",
  "Kalash",
  "Deepak",
  "Gayatri",
  "Mahamrityunjaya",
  "Om",
  "Namah",
  "Namo",
  "Bhagavan",
  "Devata",
  "Devi",
  "Shiva",
  "Vishnu",
  "Ganesha",
  "Lakshmi",
  "Durga",
  "Saraswati",
  "Krishna",
  "Rama",
  "Hanuman",
  "Kartikeya",
  "Brahma",
  "Jyotirlinga",
  "Shakti Peeth",
  "Char Dham",
];

/** Extract the first JSON object/array from a possibly fenced string. */
function extractJson(text: string): any {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const src = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(src);
  } catch {
    /* try brace scan */
  }
  const start = src.search(/[{[]/);
  if (start < 0) throw new Error("AI returned no JSON");
  const opener = src[start];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0,
    inStr = false,
    esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (c === "\\") {
      esc = true;
      continue;
    }
    if (c === '"') {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (c === opener) depth++;
    else if (c === closer) {
      depth--;
      if (depth === 0) return JSON.parse(src.slice(start, i + 1));
    }
  }
  throw new Error("AI returned malformed JSON");
}

async function aiJson(system: string, user: string): Promise<any> {
  const gateway = createGateway();
  const { text } = await generateText({
    model: gateway(DEFAULT_MODEL),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return extractJson(text);
}

// ==================================================================
// AI CONTENT STUDIO — generate/enrich base festival fields (English)
// ==================================================================

const GENERATABLE_FIELDS = [
  "short_description",
  "detailed_description",
  "significance",
  "why_celebrated",
  "history",
  "mythological_story",
  "puja_vidhi",
  "preparation",
  "prasad",
  "aarti",
  "chalisa",
  "stotra",
  "samagri",
  "mantras",
  "regional_variations",
  "faqs",
  "seo",
] as const;

type GenField = (typeof GENERATABLE_FIELDS)[number];

export const generateFestivalContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string; fields?: string[]; overwrite?: boolean; instructions?: string };
    if (!v?.id) throw new Error("Missing festival id");
    const fields = (
      v.fields && v.fields.length ? v.fields : (GENERATABLE_FIELDS as unknown as string[])
    ).filter((f) => (GENERATABLE_FIELDS as readonly string[]).includes(f));
    return { id: v.id, fields, overwrite: !!v.overwrite, instructions: v.instructions ?? "" };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: row, error } = await ctx.supabase
      .from("admin_festivals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Festival not found");

    // Only generate for empty fields unless overwrite is true
    const target = data.fields.filter((f) => {
      if (data.overwrite) return true;
      const cur = (row as any)[f];
      if (cur == null) return true;
      if (typeof cur === "string") return cur.trim().length === 0;
      if (Array.isArray(cur)) return cur.length === 0;
      if (typeof cur === "object") return Object.keys(cur).length === 0;
      return false;
    });
    if (target.length === 0) {
      return {
        generated: {} as Record<string, any>,
        skipped: data.fields,
        note: "All requested fields already populated",
      };
    }

    const context_ = {
      name: row.name,
      alt_names: row.alt_names ?? [],
      deities: row.deities ?? [],
      category: row.category,
      tags: row.tags ?? [],
      short_description: row.short_description ?? "",
      date_type: row.date_type,
    };

    const system = `You are a Sanatan (Hindu) festival expert and SEO copywriter for SanatanTools.com.
Write authoritative, respectful, factually accurate content grounded in Vedic and Puranic tradition.
Preserve Sanskrit/Hindi terms in Roman transliteration (e.g. "Puja", "Vrat", "Tithi"). Do not use Google-Translate style calques.
Return ONLY a strict JSON object with the requested keys. No markdown, no commentary.

Field schemas (use exactly these shapes):
- short_description: string, 140-200 chars, plain text.
- detailed_description: string, 3-5 paragraphs, plain text separated by \\n\\n.
- significance: string, 2-3 paragraphs.
- why_celebrated: string, 2 paragraphs.
- history: string, 2-3 paragraphs, cite Puranas/scriptures where known.
- mythological_story: string, 3-4 paragraphs of narrative.
- puja_vidhi: string, numbered step-by-step ritual guide in plain text.
- preparation: string, 1 paragraph on prior-day preparation.
- prasad: string, 1 short paragraph.
- aarti: string, one traditional aarti (Roman transliteration if not English).
- chalisa: string OR "" if not applicable.
- stotra: string OR "" if not applicable.
- samagri: array of { item: string, qty?: string, notes?: string }, 8-15 items.
- mantras: array of { title: string, text: string, meaning: string }, 3-6 items.
- regional_variations: array of { region: string, name?: string, notes: string }, 3-6 items.
- faqs: array of { q: string, a: string }, 6-10 items.
- seo: { title: string (<=60 chars), description: string (<=155 chars), keywords: string[] (8-15) }.`;

    const user = `Festival context:\n${JSON.stringify(context_, null, 2)}\n\n${data.instructions ? `Editor instructions: ${data.instructions}\n\n` : ""}Generate the following fields as a single JSON object with exactly these keys: ${target.join(", ")}.`;

    const generated = await aiJson(system, user);
    // Only keep whitelisted keys
    const clean: Record<string, any> = {};
    for (const f of target) if (f in generated) clean[f] = generated[f];

    return { generated: clean, skipped: data.fields.filter((f) => !target.includes(f)) };
  });

/** Apply AI-generated fields to a festival (writes to admin_festivals). */
export const applyGeneratedFestivalContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string; patch: Record<string, any> };
    if (!v?.id || !v?.patch) throw new Error("Missing id or patch");
    return { id: v.id, patch: v.patch };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const clean: Record<string, any> = {};
    for (const f of GENERATABLE_FIELDS) if (f in data.patch) clean[f] = (data.patch as any)[f];
    if (!Object.keys(clean).length) throw new Error("No valid fields in patch");
    (clean as any).updated_by = ctx.userId;
    const { data: row, error } = await ctx.supabase
      .from("admin_festivals")
      .update(clean)
      .eq("id", data.id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { row };
  });

// ==================================================================
// TRANSLATION — one language
// ==================================================================

const TRANSLATABLE_KEYS = [
  "name",
  "alt_names",
  "short_description",
  "detailed_description",
  "history",
  "significance",
  "why_celebrated",
  "mythological_story",
  "puja_vidhi",
  "preparation",
  "prasad",
  "aarti",
  "chalisa",
  "stotra",
  "samagri",
  "mantras",
  "regional_variations",
  "faqs",
  "seo_title",
  "seo_description",
  "seo_keywords",
] as const;

function buildTranslationPayload(row: any) {
  return {
    name: row.name ?? "",
    alt_names: row.alt_names ?? [],
    short_description: row.short_description ?? "",
    detailed_description: row.detailed_description ?? "",
    history: row.history ?? "",
    significance: row.significance ?? "",
    why_celebrated: row.why_celebrated ?? "",
    mythological_story: row.mythological_story ?? "",
    puja_vidhi: row.puja_vidhi ?? "",
    preparation: row.preparation ?? "",
    prasad: row.prasad ?? "",
    aarti: row.aarti ?? "",
    chalisa: row.chalisa ?? "",
    stotra: row.stotra ?? "",
    samagri: row.samagri ?? [],
    mantras: row.mantras ?? [],
    regional_variations: row.regional_variations ?? [],
    faqs: row.faqs ?? [],
    seo_title: row.seo?.title ?? "",
    seo_description: row.seo?.description ?? "",
    seo_keywords: row.seo?.keywords ?? [],
  };
}

export const translateFestival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string; language: string; publish?: boolean };
    if (!v?.id || !v?.language) throw new Error("Missing id or language");
    if (!(SUPPORTED_LANGUAGES as readonly string[]).includes(v.language))
      throw new Error("Unsupported language");
    return { id: v.id, language: v.language, publish: !!v.publish };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: row, error } = await ctx.supabase
      .from("admin_festivals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Festival not found");

    const payload = buildTranslationPayload(row);

    const system = `You are a professional translator specialising in Sanatan (Hindu) religious content.
Translate every value in the given JSON object into ${LANG_NAMES[data.language]}.
Rules:
1. Preserve the native script of Sanskrit mantras, shlokas, and aartis — do NOT re-translate them; keep them in Devanagari or their traditional native script.
2. Preserve these tradition-specific terms unchanged when they appear: ${PRESERVE_TERMS.join(", ")}. Transliterate them to the target script when natural, but never render them as generic dictionary equivalents.
3. Keep JSON structure IDENTICAL — same keys, same array shapes, same object shapes.
4. Do not add, remove, or reorder keys.
5. Do not use Google-Translate style literal rendering; use natural, devout, respectful voice.
6. Return ONLY the translated JSON object. No markdown, no commentary.`;

    const user = `Translate this festival content to ${LANG_NAMES[data.language]}:\n${JSON.stringify(payload, null, 2)}`;

    const translated = await aiJson(system, user);

    // Store translation; keep only known keys
    const content: Record<string, any> = {};
    for (const k of TRANSLATABLE_KEYS) if (k in translated) content[k] = translated[k];

    const { data: saved, error: e2 } = await ctx.supabase
      .from("festival_translations")
      .upsert(
        {
          festival_id: data.id,
          language: data.language,
          content,
          status: data.publish ? "published" : "draft",
          updated_by: ctx.userId,
        },
        { onConflict: "festival_id,language" },
      )
      .select()
      .maybeSingle();
    if (e2) throw new Error(e2.message);
    return { row: saved };
  });

export const translateFestivalAllLanguages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string; publish?: boolean; onlyMissing?: boolean };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id, publish: !!v.publish, onlyMissing: v.onlyMissing !== false };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;

    const { data: row } = await ctx.supabase
      .from("admin_festivals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) throw new Error("Festival not found");

    const { data: existing } = await ctx.supabase
      .from("festival_translations")
      .select("language")
      .eq("festival_id", data.id);
    const have = new Set((existing ?? []).map((r: any) => r.language));

    const targets = SUPPORTED_LANGUAGES.filter((l) => (data.onlyMissing ? !have.has(l) : true));

    const payload = buildTranslationPayload(row);
    const results: { language: string; ok: boolean; error?: string }[] = [];

    for (const lang of targets) {
      try {
        const system = `You are a professional translator specialising in Sanatan (Hindu) religious content.
Translate every value in the given JSON object into ${LANG_NAMES[lang]}.
Preserve native script for mantras and aartis. Preserve these terms: ${PRESERVE_TERMS.join(", ")}.
Keep the JSON structure identical. Return ONLY the translated JSON.`;
        const user = `Translate to ${LANG_NAMES[lang]}:\n${JSON.stringify(payload, null, 2)}`;
        const translated = await aiJson(system, user);
        const content: Record<string, any> = {};
        for (const k of TRANSLATABLE_KEYS) if (k in translated) content[k] = translated[k];
        const { error: e2 } = await ctx.supabase.from("festival_translations").upsert(
          {
            festival_id: data.id,
            language: lang,
            content,
            status: data.publish ? "published" : "draft",
            updated_by: ctx.userId,
          },
          { onConflict: "festival_id,language" },
        );
        if (e2) throw new Error(e2.message);
        results.push({ language: lang, ok: true });
      } catch (e: any) {
        results.push({ language: lang, ok: false, error: e?.message ?? "unknown" });
      }
    }
    return {
      results,
      ok: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
    };
  });

export const setTranslationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { festival_id: string; language: string; status: string };
    if (!v?.festival_id || !v?.language || !v?.status) throw new Error("Missing fields");
    if (!["draft", "published", "archived"].includes(v.status)) throw new Error("Invalid status");
    return v;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: row, error } = await ctx.supabase
      .from("festival_translations")
      .update({ status: data.status, updated_by: ctx.userId })
      .eq("festival_id", data.festival_id)
      .eq("language", data.language)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { row };
  });

export const deleteFestivalTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { festival_id: string; language: string };
    if (!v?.festival_id || !v?.language) throw new Error("Missing fields");
    return v;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { error } = await ctx.supabase
      .from("festival_translations")
      .delete()
      .eq("festival_id", data.festival_id)
      .eq("language", data.language);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
