/**
 * Kundli AI Interpretations — Phase 12
 * ------------------------------------------------------------
 * Educational, non-deterministic explanations of a computed
 * KundliResult (from `src/lib/kundli/engine.ts`).
 *
 * Guardrails baked into every prompt:
 *   - Never state absolute future outcomes.
 *   - Frame everything as classical Vedic-astrology *interpretation*.
 *   - Always attach a clear disclaimer.
 *   - Encourage reflection and free will, never fatalism.
 *
 * Routing goes through the existing provider-agnostic router
 * (src/lib/ai-router.server.ts) so users can add / prioritise
 * providers from the Admin panel without code changes.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { KundliResult, PlanetChartPosition, GrahaName } from "@/lib/kundli/types";
import { generateKundli } from "@/lib/kundli/engine";

// ============================================================
// Section catalogue
// ============================================================

export const KUNDLI_SECTIONS = [
  "lagna",
  "moonSign",
  "sunSign",
  "nakshatra",
  "planetPlacements",
  "housePlacements",
  "yogas",
  "personality",
  "career",
  "relationships",
  "strengths",
  "reflection",
  "executiveSummary",
] as const;
export type KundliSection = (typeof KUNDLI_SECTIONS)[number];

export const SECTION_TITLES: Record<KundliSection, string> = {
  lagna: "Lagna (Ascendant)",
  moonSign: "Moon Sign (Rashi)",
  sunSign: "Sun Sign",
  nakshatra: "Birth Nakshatra",
  planetPlacements: "Planet Placements",
  housePlacements: "House Placements",
  yogas: "Notable Yogas",
  personality: "General Personality Tendencies",
  career: "General Career Themes",
  relationships: "General Relationship Themes",
  strengths: "General Strengths",
  reflection: "Areas for Self-Reflection",
  executiveSummary: "Executive Summary (2-page overview)",
};

// ============================================================
// Universal disclaimers & tone
// ============================================================

const DISCLAIMER =
  "Vedic astrology (Jyotisha) is a traditional interpretive system developed over centuries. " +
  "The reflections below are educational summaries of classical symbolism — never certainties. " +
  "They should not replace professional guidance in medical, financial, legal, or personal matters, " +
  "and they never override your own agency and free will.";

const GLOBAL_GUARDRAILS = `
CRITICAL — TONE & SAFETY RULES (non-negotiable):
1. NEVER predict specific future events, dates, ages, deaths, illnesses, marriages, divorces, accidents, or windfalls.
2. NEVER use deterministic language: "you will", "you are destined", "this guarantees", "always", "never" (about the person).
3. USE reflective language: "traditionally associated with", "may lean toward", "classical texts describe", "often correlates with", "invites reflection on".
4. FRAME everything as *classical symbolism* — an interpretive lens, not fact.
5. NEVER give medical, legal, or financial advice.
6. NEVER shame, alarm, or diagnose the reader.
7. Balance strengths and challenges honestly; astrology is not a horoscope column.
8. If a placement is classically considered difficult, frame it as an *area for growth or self-awareness*, not a curse.
9. Always end the section with a one-sentence reminder that this is an interpretive tradition, not certainty.
10. Do NOT invent shlokas, verse numbers, or Sanskrit quotes you are unsure of.
`.trim();

const VOICE =
  "You are a thoughtful Jyotisha educator writing for SanatanTools.com. " +
  "Voice: warm, precise, non-sectarian, historically grounded, gently humble. " +
  "Prefer classical Vedic terminology (Rashi, Bhava, Graha, Nakshatra) with brief English glosses.";

const FORMATTING_RULES = `
FORMATTING & STRUCTURE RULES:
1. Always format responses in clean, structured Markdown using clear section headings (##, ###).
2. Use Markdown Tables (| Header 1 | Header 2 |) for lists of planet placements, house placements, yogas, strengths/weaknesses summary, and key recommendations.
3. Use bullet points (-) for key takeaways and lists.
4. Ensure tables have proper header rows and aligned columns.
`.trim();

// ============================================================
// Chart -> compact structured summary for the LLM
// ============================================================

function grahaLine(p: PlanetChartPosition): string {
  const retro = p.retrograde ? " (Retrograde)" : "";
  return `- ${p.graha}: ${p.rashi} ${p.degreesInRashi.toFixed(2)}° · House ${p.house} · Nakshatra ${p.nakshatra} pada ${p.pada} · Dignity: ${p.dignity}${retro}`;
}

function chartSummary(k: KundliResult): string {
  const asc = k.d1.ascendant;
  const grahas = k.d1.planets.map(grahaLine).join("\n");
  const houseLines = k.d1.houses.map((h) => `H${h.house}: ${h.rashi}`).join(", ");
  return [
    `Birth: ${k.input.date} ${k.input.time} @ ${k.input.place}`,
    `Ayanamsa (Lahiri): ${k.time.ayanamsaDegrees.toFixed(4)}°`,
    `Lagna: ${asc.rashi} ${asc.degreesInRashi.toFixed(2)}° · Nakshatra ${asc.nakshatra} pada ${asc.pada}`,
    `Moon sign: ${k.moonSign} · Sun sign: ${k.sunSign}`,
    `Birth Nakshatra: ${k.birthNakshatra.nakshatra} pada ${k.birthNakshatra.pada} (Lord: ${k.birthNakshatra.lord})`,
    `Houses (Whole-sign): ${houseLines}`,
    `Planets:\n${grahas}`,
  ].join("\n");
}

// Deterministic short hash of the essential chart identity (birth inputs +
// ascendant + planet degrees). Same birth → same hash → cache hit.
export function kundliChartHash(k: KundliResult): string {
  const parts = [
    k.input.date,
    k.input.time,
    k.input.latitude.toFixed(3),
    k.input.longitude.toFixed(3),
    String(k.input.timezone),
    k.d1.ascendant.rashi,
    k.d1.ascendant.degreesInRashi.toFixed(2),
    ...k.d1.planets.map((p) => `${p.graha}:${p.rashi}:${p.degreesInRashi.toFixed(2)}`),
  ].join("|");
  // FNV-1a 32-bit → hex; short and stable enough for a cache key.
  let h = 0x811c9dc5;
  for (let i = 0; i < parts.length; i++) {
    h ^= parts.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

// ============================================================
// Prompt builder per section
// ============================================================

function sectionPrompt(section: KundliSection, k: KundliResult, language: string): string {
  const summary = chartSummary(k);
  const langLine =
    language && language.toLowerCase() !== "en"
      ? `Write the interpretation in ${language}. Keep Sanskrit terms in IAST.`
      : "Write the interpretation in clear English.";

  const per: Record<KundliSection, string> = {
    lagna:
      `Explain the significance of a ${k.d1.ascendant.rashi} Lagna (Ascendant) rising in the ${k.d1.ascendant.nakshatra} nakshatra, pada ${k.d1.ascendant.pada}. ` +
      "Cover: general temperament associated with this Lagna, the ruling planet's role, physical/outer expression, and one area of self-awareness.",
    moonSign:
      `Explain the emotional and mental themes classically associated with a ${k.moonSign} Chandra Rashi (Moon Sign). ` +
      "Include: emotional needs, inner comfort patterns, and one reflective invitation.",
    sunSign:
      `Explain the identity and vitality themes classically linked with a ${k.sunSign} Surya Rashi (Sun Sign) in Vedic tradition. ` +
      "Include: sense of self, leadership tendencies, and one reflective invitation. " +
      "Note: this is the sidereal Sun sign; do not confuse with Western tropical astrology.",
    nakshatra:
      `Explain the ${k.birthNakshatra.nakshatra} nakshatra (Janma Nakshatra), pada ${k.birthNakshatra.pada}, ruled by ${k.birthNakshatra.lord}. ` +
      "Cover: the symbolic story of this nakshatra, general temperament, and one classical guidance point.",
    planetPlacements:
      "For EACH of the 9 grahas, write 2-3 balanced sentences describing what its sign, house, and dignity classically suggest. " +
      "Include Rahu and Ketu. Keep every point interpretive, not predictive.",
    housePlacements:
      "For each of the 12 bhavas (houses), briefly note the sign occupying it and the classical life-area themes that may come into focus. " +
      "Group into 4-line bullets; do NOT predict specific events.",
    yogas:
      "Identify classical yogas that MAY be present from the chart summary (e.g. Gaja-Kesari, Chandra-Mangala, Budha-Aditya, Kemadruma, Neecha-Bhanga). " +
      "For each yoga you flag: state (a) the classical formation rule, (b) whether the current chart appears to satisfy it, (c) the general symbolism. " +
      "If unsure, say so — do NOT fabricate yogas.",
    personality:
      "Synthesize a balanced 'personality tendencies' reflection drawing from Lagna, Moon, Sun, and dominant planets. " +
      "5-7 sentences. Traits + counter-traits + one area of growth.",
    career:
      "Discuss general career THEMES suggested by the 10th house, its lord, and any planets influencing it. " +
      "Avoid predicting job titles, salaries, or timings. Offer 2-3 directional themes.",
    relationships:
      "Discuss general relationship THEMES from the 7th house, its lord, Venus (for men) or Jupiter (for women/general), and the Moon. " +
      "Avoid predicting marriage timings or partner descriptions. Offer 2-3 reflective themes.",
    strengths:
      "List 4-6 general strengths visible in the chart's stronger placements (exalted, own sign, moolatrikona, angular houses). " +
      "Frame as *potentials to cultivate*, not fixed abilities.",
    reflection:
      "Offer 3-5 gentle 'areas for self-reflection' inspired by weaker placements (debilitated, dusthana houses 6/8/12, retrogrades). " +
      "Frame every point as a growth invitation. NEVER as a warning of misfortune.",
    executiveSummary:
      "Write a two-page (approx. 900-1200 words) executive overview of this chart, synthesizing Lagna, Moon, Sun, dominant grahas, key yogas, and any doshas from the chart summary. " +
      "Structure with clear subheadings: Introduction, Core Temperament, Strengths, Growth Areas, Life Themes (Career/Relationships/Wellbeing/Dharma), Current Dasha Context (if evident), and Closing Reflection. " +
      "Balanced, calm, non-predictive. End with a one-line humility disclaimer.",
  };

  return [
    VOICE,
    GLOBAL_GUARDRAILS,
    FORMATTING_RULES,
    langLine,
    "",
    "CHART DATA:",
    summary,
    "",
    "TASK:",
    per[section],
    "",
    "FORMAT:",
    `- Start with a short header: "${SECTION_TITLES[section]}".`,
    "- Use Markdown tables for structured data and comparisons.",
    "- Use short paragraphs or bullets, easy to read on mobile.",
    "- End with a one-line reminder that Jyotisha is an interpretive tradition.",
  ].join("\n");
}

// ============================================================
// Server functions
// ============================================================

// -- Input schemas ----------------------------------------------------
const BirthInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  place: z.string().min(1).max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.union([z.string().min(1).max(64), z.number().min(-14).max(14)]),
  gender: z.enum(["male", "female", "other"]).optional(),
  language: z.string().max(32).optional(),
});

const SectionSchema = z.enum(KUNDLI_SECTIONS);

// -- Single section ---------------------------------------------------
export const interpretKundliSection = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z
      .object({
        birth: BirthInputSchema,
        section: SectionSchema,
        language: z.string().max(32).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const kundli = generateKundli(data.birth);
    const language = data.language ?? data.birth.language ?? "en";
    const chartHash = kundliChartHash(kundli);

    // -- Try cache first --------------------------------------------------
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: cached } = await supabaseAdmin
        .from("kundli_interpretations")
        .select("text,provider,model")
        .eq("chart_hash", chartHash)
        .eq("section", data.section)
        .eq("language", language)
        .maybeSingle();
      if (cached?.text) {
        return {
          section: data.section,
          title: SECTION_TITLES[data.section],
          language,
          text: cached.text,
          disclaimer: DISCLAIMER,
          provider: cached.provider ?? undefined,
          model: cached.model ?? undefined,
          latencyMs: 0,
          cached: true,
        };
      }
    } catch {
      /* cache is best-effort */
    }

    const { callAi } = await import("@/lib/ai-router.server");
    const result = await callAi({
      feature: `kundli.interpret.${data.section}`,
      system:
        "You are a thoughtful Jyotisha (Vedic astrology) educator. " +
        "Follow the guardrails in the user message exactly. Never predict specific future events. " +
        "Always include a humility disclaimer.",
      prompt: sectionPrompt(data.section, kundli, language),
    });

    // -- Best-effort write-through cache ---------------------------------
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("kundli_interpretations").upsert(
        {
          chart_hash: chartHash,
          section: data.section,
          language,
          text: result.text,
          provider: result.provider ?? null,
          model: result.model ?? null,
        },
        { onConflict: "chart_hash,section,language" },
      );
    } catch {
      /* ignore cache errors */
    }

    return {
      section: data.section,
      title: SECTION_TITLES[data.section],
      language,
      text: result.text,
      disclaimer: DISCLAIMER,
      provider: result.provider,
      model: result.model,
      latencyMs: result.latencyMs,
      cached: false,
    };
  });

// -- Full report (sequential to preserve provider quota) --------------
export const interpretKundliFull = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z
      .object({
        birth: BirthInputSchema,
        language: z.string().max(32).optional(),
        sections: z.array(SectionSchema).min(1).max(KUNDLI_SECTIONS.length).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const kundli = generateKundli(data.birth);
    const language = data.language ?? data.birth.language ?? "en";
    const wanted: KundliSection[] = data.sections ?? [...KUNDLI_SECTIONS];

    const { callAi } = await import("@/lib/ai-router.server");
    const results: Array<{
      section: KundliSection;
      title: string;
      text: string;
      provider?: string;
      model?: string;
      error?: string;
    }> = [];

    for (const section of wanted) {
      try {
        const r = await callAi({
          feature: `kundli.interpret.${section}`,
          system:
            "You are a thoughtful Jyotisha educator. Follow guardrails. Never predict specific future events. Always include a humility disclaimer.",
          prompt: sectionPrompt(section, kundli, language),
        });
        results.push({
          section,
          title: SECTION_TITLES[section],
          text: r.text,
          provider: r.provider,
          model: r.model,
        });
      } catch (err) {
        results.push({
          section,
          title: SECTION_TITLES[section],
          text: "",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return {
      language,
      disclaimer: DISCLAIMER,
      generatedAt: new Date().toISOString(),
      kundli: {
        lagna: kundli.d1.ascendant.rashi,
        moonSign: kundli.moonSign,
        sunSign: kundli.sunSign,
        nakshatra: kundli.birthNakshatra,
      },
      sections: results,
    };
  });

// ============================================================
// Phase 16.8 — AI Explainable Astrology Engine
// ------------------------------------------------------------
// Accepts pre-calculated facts (Yogas, Doshas, Strengths, Predictions).
// Generates clear explanations WITHOUT performing any calculations:
// 1. Why this was detected
// 2. Which rule matched
// 3. Which planets created it
// 4. Confidence level
// 5. Practical meaning
// 6. Suggested actions
// ============================================================

export const explainCalculatedAstrology = createServerFn({ method: "POST" })
  .validator((v: unknown) => {
    return z
      .object({
        itemType: z.enum(["yoga", "dosha", "prediction", "strength"]),
        itemData: z.record(z.unknown()),
        language: z.string().default("en"),
      })
      .parse(v);
  })
  .handler(async ({ data }) => {
    const { itemType, itemData, language } = data;
    const { callAi } = await import("@/lib/ai-router.server");

    const prompt = `
Explain the following PRE-CALCULATED Vedic Astrology fact in a clear, educational, non-fatalistic manner.
IMPORTANT: Do NOT perform any astronomical or astrological calculations yourself. Explain ONLY the provided fact.

FACT DATA:
${JSON.stringify(itemData, null, 2)}

Provide your response in structured Markdown with the following exact subheadings:
1. **Why This Was Detected**
2. **Which Rule Matched**
3. **Planets Involved**
4. **Confidence & Severity Level**
5. **Practical Life Meaning**
6. **Suggested Actions & Remedies**

Language: ${language}. Keep Sanskrit terms in standard IAST with brief explanations.
`.trim();

    const r = await callAi({
      feature: `kundli.explain.${itemType}`,
      system: `${VOICE}\n${GLOBAL_GUARDRAILS}`,
      prompt,
    });

    return {
      itemType,
      explanation: r.text,
      provider: r.provider,
      model: r.model,
    };
  });

// Re-export for convenience
export const KUNDLI_INTERPRETATION_DISCLAIMER = DISCLAIMER;

export type KundliInterpretationResponse = Awaited<ReturnType<typeof interpretKundliFull>>;
export type KundliSectionInterpretationResponse = Awaited<
  ReturnType<typeof interpretKundliSection>
>;

// Suppress unused-type warning if GrahaName isn't referenced elsewhere yet.
export type _KundliInterpretGrahaName = GrahaName;
