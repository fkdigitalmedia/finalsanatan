/**
 * AI Content Studio — server functions.
 *
 * Generates articles, festival pages, FAQs, meta/schema, and social copy
 * via the Lovable AI Gateway, then (optionally) publishes to the admin tables.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const STUDIO_MODES = [
  "article",
  "festival",
  "faq",
  "meta",
  "schema",
  "pinterest",
  "facebook",
  "twitter",
  "instagram",
  "newsletter",
] as const;
export type StudioMode = (typeof STUDIO_MODES)[number];

// ---------- prompt registry ----------

const SANATAN_TONE =
  "You write for SanatanTools.com, a premium Sanatan Dharma utility platform. Voice: reverent, precise, non-sectarian, historically accurate. Never invent shlokas, verse numbers, or traditions. When quoting Sanskrit, use Devanagari + IAST + English meaning.";

const PROMPTS: Record<StudioMode, { system: string; user: (t: string, extra?: string) => string }> =
  {
    article: {
      system: `${SANATAN_TONE} Produce a long-form Sanatan article as strict JSON.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON with keys:
{"slug":"kebab-case","title":"","excerpt":"<160 chars","content_md":"800-1400 words Markdown with H2/H3, lists, no H1","tags":["..."],"category":"one of: panchang|festival|puja|mantra|ai|temple|calculators|sanskrit|baby-names|learning","seo":{"title":"<60ch","description":"<160ch","keywords":["..."],"og_title":"","og_description":""},"schema_json":{"@context":"https://schema.org","@type":"Article","headline":"","description":"","author":{"@type":"Organization","name":"SanatanTools"}}}`,
    },
    festival: {
      system: `${SANATAN_TONE} Produce a Sanatan festival page as strict JSON.`,
      user: (festival, extra) =>
        `Festival: ${festival}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"slug":"kebab-case","name":"","description":"600-1000 words Markdown covering significance, story, tithi/date logic, puja vidhi (steps), samagri, key mantras (Devanagari+IAST+meaning), regional variations, dos & don'ts","event_date":"YYYY-MM-DD or null","is_recurring":true,"seo":{"title":"<60ch","description":"<160ch","keywords":["..."]}}`,
    },
    faq: {
      system: `${SANATAN_TONE} Generate authentic FAQs.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"faqs":[{"q":"","a":"2-4 sentence answer"}],"schema_json":{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"","acceptedAnswer":{"@type":"Answer","text":""}}]}}
Provide 8 FAQs.`,
    },
    meta: {
      system: `${SANATAN_TONE} You are an SEO strategist.`,
      user: (topic, extra) =>
        `Page: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"title":"<60ch, keyword-first","description":"<160ch","keywords":["8-12 items"],"og_title":"","og_description":"","twitter_title":"","twitter_description":"","canonical_hint":""}`,
    },
    schema: {
      system: `${SANATAN_TONE} Emit valid schema.org JSON-LD.`,
      user: (topic, extra) =>
        `Entity: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON containing a single "schema_json" key holding a complete valid schema.org JSON-LD object best suited to the entity (Article, Event, HowTo, FAQPage, Place, or SoftwareApplication).`,
    },
    pinterest: {
      system: `${SANATAN_TONE} You create Pinterest pin copy.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"pins":[{"title":"<100ch clickable","description":"200-500ch keyword-rich","hashtags":["#Sanatan","..."],"image_prompt":"detailed visual prompt"}]}
Provide 5 pins.`,
    },
    facebook: {
      system: `${SANATAN_TONE} You write Facebook posts.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"posts":[{"text":"80-150 words, warm, respectful","hashtags":["..."],"cta":""}]}
Provide 3 posts.`,
    },
    twitter: {
      system: `${SANATAN_TONE} You write X/Twitter posts.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"tweets":[{"text":"<=270 chars","hashtags":["..."]}],"thread":["tweet 1 <=270","tweet 2 <=270","..."]}
Provide 5 standalone tweets and one 4-tweet thread.`,
    },
    instagram: {
      system: `${SANATAN_TONE} You write Instagram captions.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"captions":[{"caption":"120-220 words with line breaks + emojis (sparingly, reverent)","hashtags":["20 relevant Sanatan hashtags"]}]}
Provide 3 captions.`,
    },
    newsletter: {
      system: `${SANATAN_TONE} You write email newsletters.`,
      user: (topic, extra) =>
        `Topic: ${topic}\n${extra ? `Notes: ${extra}\n` : ""}Return ONLY minified JSON:
{"subject":"<60ch","preheader":"<100ch","html":"clean semantic HTML body, single column, no <html>/<head>, ~400 words with H2, P, UL and one CTA button placeholder [[CTA]]","plain_text":"same content as plain text"}`,
    },
  };

// ---------- helpers ----------

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

function extractJson(text: string): any {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1) throw new Error("Model did not return JSON");
  const candidate = end > start ? cleaned.slice(start, end + 1) : cleaned.slice(start);
  try {
    return JSON.parse(candidate);
  } catch {
    // Attempt to repair a truncated JSON stream (missing closing brackets/quotes).
    return JSON.parse(repairJson(candidate));
  }
}

function repairJson(src: string): string {
  let s = src;
  // Drop dangling trailing comma
  s = s.replace(/,\s*$/, "");
  // Balance quotes: if odd number of unescaped quotes, close the string.
  const quoteCount = (s.match(/(?<!\\)"/g) ?? []).length;
  if (quoteCount % 2 === 1) s += '"';
  // Balance braces/brackets.
  const stack: string[] = [];
  let inStr = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"' && s[i - 1] !== "\\") inStr = !inStr;
    if (inStr) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" && stack[stack.length - 1] === "{") stack.pop();
    else if (ch === "]" && stack[stack.length - 1] === "[") stack.pop();
  }
  // Remove trailing incomplete key/value fragments like `,"foo` or `,"foo":`
  s = s.replace(/,\s*"[^"]*"?\s*:?\s*$/, "");
  s = s.replace(/,\s*$/, "");
  while (stack.length) {
    const open = stack.pop();
    s += open === "{" ? "}" : "]";
  }
  return s;
}

// ---------- generate ----------

const GenerateInput = z.object({
  mode: z.enum(STUDIO_MODES),
  topic: z.string().min(2).max(500),
  notes: z.string().max(2000).optional(),
  lang: z.string().min(2).max(8).default("en"),
});

export const studioGenerate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const cfg = PROMPTS[data.mode];
    const langNote = data.lang !== "en" ? ` Write output in language code: ${data.lang}.` : "";
    const { callAi } = await import("@/lib/ai-router.server");
    const result = await callAi({
      feature: `studio:${data.mode}`,
      system: cfg.system + langNote,
      prompt: cfg.user(data.topic, data.notes),
      userId: (context as any).userId,
      maxTokens: data.mode === "article" || data.mode === "festival" ? 8000 : 4000,
    });
    const text = result.text;
    let payload: any;
    let parseError: string | null = null;
    try {
      payload = extractJson(text);
    } catch (e) {
      parseError = e instanceof Error ? e.message : "Failed to parse AI JSON";
      payload = { raw: text, parseError };
    }
    return { mode: data.mode, payload, raw: text, provider: result.provider, model: result.model };
  });

// ---------- publish ----------

const PublishArticleInput = z.object({
  payload: z.record(z.string(), z.any()),
  lang: z.string().default("en"),
  publish: z.boolean().default(false),
});

export const studioPublishArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => PublishArticleInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const p = data.payload;
    if (!p?.slug || !p?.title) throw new Error("Payload missing slug/title");
    const row = {
      slug: String(p.slug),
      title: String(p.title),
      excerpt: p.excerpt ?? null,
      content_md: p.content_md ?? "",
      category: p.category ?? null,
      tags: Array.isArray(p.tags) ? p.tags : [],
      seo: p.seo ?? {},
      schema_json: p.schema_json ?? {},
      lang: data.lang,
      status: data.publish ? "published" : "draft",
      published_at: data.publish ? new Date().toISOString() : null,
      author_id: (context as any).userId,
    };
    const { data: saved, error } = await (context as any).supabase
      .from("admin_articles")
      .upsert(row, { onConflict: "slug" })
      .select("id, slug, status")
      .single();
    if (error) throw new Error(error.message);
    await (context as any).supabase.from("audit_logs").insert({
      actor_user_id: (context as any).userId,
      action: data.publish ? "ai_publish" : "ai_draft",
      resource_type: "admin_articles",
      resource_id: saved.id,
      meta: { source: "ai-studio" },
    });
    return saved;
  });

const PublishFestivalInput = z.object({
  payload: z.record(z.string(), z.any()),
  publish: z.boolean().default(false),
});

export const studioPublishFestival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => PublishFestivalInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const p = data.payload;
    if (!p?.slug || !p?.name) throw new Error("Payload missing slug/name");
    const row = {
      slug: String(p.slug),
      name: String(p.name),
      description: p.description ?? null,
      event_date: p.event_date ?? null,
      is_recurring: p.is_recurring ?? true,
      seo: p.seo ?? {},
      published: !!data.publish,
    };
    const { data: saved, error } = await (context as any).supabase
      .from("admin_festivals")
      .upsert(row, { onConflict: "slug" })
      .select("id, slug, published")
      .single();
    if (error) throw new Error(error.message);
    await (context as any).supabase.from("audit_logs").insert({
      actor_user_id: (context as any).userId,
      action: data.publish ? "ai_publish" : "ai_draft",
      resource_type: "admin_festivals",
      resource_id: saved.id,
      meta: { source: "ai-studio" },
    });
    return saved;
  });
