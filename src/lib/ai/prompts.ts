// ============================================================
// AI Interpretation Engine — Prompt system
// ------------------------------------------------------------
// One modular template per report. Nothing is hardcoded inside
// the engine: templates live in a registry that the Admin Panel
// can override at runtime (registerPrompt / setPromptOverrides).
// ============================================================

import { FEATURE_PREFIX, LANGUAGE_NAMES, MAX_TOKENS, SAFETY_RULES } from "./constants";
import { buildSkeleton, sectionsForDepth, styleFor } from "./templates";
import type {
  InterpretationLanguage,
  PromptTemplate,
  ReportDepth,
  ReportKind,
  ResolvedPrompt,
} from "./types";

const BASE_ROLE =
  "You are a senior Vedic astrologer and writer for SanatanTools. You receive already-calculated astrological data as JSON and explain it in clear, warm language.";

const HARD_RULES = `You must obey these rules:
- ${SAFETY_RULES}
- Never recompute, correct or second-guess any number in the JSON.
- Output ONLY Markdown. No JSON, no code fences, no preamble, no sign-off.`;

function t(
  id: ReportKind,
  label: string,
  instruction: string,
  sections: string[],
  extraSystem = "",
): PromptTemplate {
  return {
    id,
    label,
    version: 1,
    system: `${BASE_ROLE}${extraSystem ? ` ${extraSystem}` : ""}\n\n${HARD_RULES}`,
    instruction,
    sections,
    wordBudget: { summary: 180, beginner: 500, detailed: 750, professional: 900 },
  };
}

/** Built-in templates — 14 reports. */
export const DEFAULT_PROMPTS: Record<ReportKind, PromptTemplate> = {
  "daily-horoscope": t(
    "daily-horoscope",
    "Daily Horoscope",
    "Explain today's horoscope for this rashi using the category scores, Panchang factors and lucky elements in the JSON. Mention the strongest and weakest categories by name with their scores.",
    ["Today at a Glance", "Key Areas", "Lucky Factors", "Guidance for the Day"],
  ),
  "weekly-horoscope": t(
    "weekly-horoscope",
    "Weekly Horoscope",
    "Explain the week ahead using the weekly trend, best and challenging days, and category movement in the JSON.",
    [
      "Week Overview",
      "Day-by-Day Highlights",
      "Opportunities and Challenges",
      "Advice for the Week",
    ],
  ),
  "monthly-horoscope": t(
    "monthly-horoscope",
    "Monthly Horoscope",
    "Explain the month using the monthly trend, weekly phases and notable transit windows given in the JSON.",
    ["Month Overview", "Phase-wise Outlook", "Key Dates", "Focus Areas"],
  ),
  "yearly-horoscope": t(
    "yearly-horoscope",
    "Yearly Horoscope",
    "Explain the year using the quarterly rollups, major transits and detected events in the JSON.",
    ["Year Overview", "Quarter-wise Outlook", "Major Transits", "Themes and Advice"],
  ),
  "kundli-summary": t(
    "kundli-summary",
    "Kundli Summary",
    "Summarise this birth chart using the lagna, moon sign, planetary placements, house lords and strengths supplied. Reference houses and planets exactly as given.",
    ["Chart Snapshot", "Personality and Strengths", "Life Areas", "Remedial Guidance"],
  ),
  "career-report": t(
    "career-report",
    "Career Report",
    "Explain career direction using the 10th house data, its lord, career-related yogas and dasha periods present in the JSON.",
    ["Career Snapshot", "Suitable Fields", "Timing and Periods", "Practical Steps"],
  ),
  "marriage-compatibility": t(
    "marriage-compatibility",
    "Marriage Compatibility",
    "Explain relationship compatibility using the supplied 7th house data, Venus/Jupiter placements, doshas and compatibility scores.",
    ["Compatibility Snapshot", "Strengths of the Match", "Areas Needing Care", "Guidance"],
  ),
  "guna-milan": t(
    "guna-milan",
    "Guna Milan Summary",
    "Explain the Ashtakoot Guna Milan result. State the total score out of 36 and walk through each koota with its own score exactly as provided.",
    ["Match Score", "Koota-wise Breakdown", "Doshas and Cancellations", "Conclusion"],
  ),
  varshphal: t(
    "varshphal",
    "Varshphal Summary",
    "Explain the annual (Varshphal) chart using the Muntha, year lord and annual house data supplied.",
    ["Year Snapshot", "Muntha and Year Lord", "Month-wise Outlook", "Advice"],
  ),
  muhurat: t(
    "muhurat",
    "Muhurat Explanation",
    "Explain why the supplied time windows are auspicious or inauspicious using the tithi, nakshatra, yoga, karana and window timings given.",
    ["Recommended Windows", "Why These Timings", "Timings to Avoid", "Practical Tips"],
  ),
  numerology: t(
    "numerology",
    "Numerology Explanation",
    "Explain the numerology profile using the life path, destiny, soul urge and personality numbers supplied. Never recalculate a number.",
    ["Core Numbers", "Personality Traits", "Strengths and Challenges", "Guidance"],
  ),
  vastu: t(
    "vastu",
    "Vastu Summary",
    "Explain the Vastu analysis using the direction-wise scores and flagged issues in the JSON. Keep remedies simple and non-structural where possible.",
    ["Vastu Snapshot", "Direction-wise Analysis", "Issues Found", "Remedies"],
  ),
  dosha: t(
    "dosha",
    "Dosha Explanation",
    "Explain the detected doshas using the rule that fired, the planets involved, the affected houses, the strength and any cancellations. Be reassuring and remedy-focused.",
    ["What Was Found", "How It May Show Up", "Cancellations and Relief", "Remedies"],
  ),
  yoga: t(
    "yoga",
    "Yoga Explanation",
    "Explain the detected yogas using the rule that fired, the planets forming it, the affected houses and its strength.",
    ["Yogas Detected", "What Each Yoga Means", "How to Make the Most of It", "Guidance"],
  ),
};

// ------------------------------------------------------------
// Registry (admin-overridable)
// ------------------------------------------------------------

const overrides = new Map<ReportKind, PromptTemplate>();

/** Replace or add a template at runtime (Admin Panel / migration). */
export function registerPrompt(template: PromptTemplate): void {
  overrides.set(template.id, template);
}

/** Bulk-load templates, e.g. from the ai_prompts table. */
export function setPromptOverrides(templates: PromptTemplate[]): void {
  for (const tpl of templates) overrides.set(tpl.id, tpl);
}

/** Drop a single override, or all of them. */
export function clearPromptOverrides(id?: ReportKind): void {
  if (id) overrides.delete(id);
  else overrides.clear();
}

/** Current template for a report (override wins over the default). */
export function getPrompt(id: ReportKind): PromptTemplate {
  const tpl = overrides.get(id) ?? DEFAULT_PROMPTS[id];
  if (!tpl) throw new Error(`No prompt template registered for report "${id}".`);
  return tpl;
}

export function listPrompts(): PromptTemplate[] {
  return (Object.keys(DEFAULT_PROMPTS) as ReportKind[]).map(getPrompt);
}

/** Admin-facing feature key, e.g. "interpretation.daily-horoscope". */
export function featureKeyFor(id: ReportKind): string {
  return `${FEATURE_PREFIX}.${id}`;
}

// ------------------------------------------------------------
// Resolution
// ------------------------------------------------------------

export interface ResolveOptions {
  report: ReportKind;
  depth: ReportDepth;
  language: InterpretationLanguage;
  data: Record<string, unknown>;
  context?: Record<string, string | number | boolean>;
  lowConfidence?: boolean;
}

/** Build the final system + user prompt pair for a request. */
export function resolvePrompt(opts: ResolveOptions): ResolvedPrompt {
  const tpl = getPrompt(opts.report);
  const languageName = LANGUAGE_NAMES[opts.language] ?? LANGUAGE_NAMES.en;
  const sections = sectionsForDepth(tpl, opts.depth);

  const contextBlock =
    opts.context && Object.keys(opts.context).length
      ? `\n\nAdditional non-astrological context (for tone only):\n${JSON.stringify(opts.context, null, 2)}`
      : "";

  const confidenceBlock = opts.lowConfidence
    ? "\n\nThe calculation engine reported LOW confidence. Say clearly, early in the report, that the reading is indicative rather than conclusive."
    : "";

  const prompt =
    [
      tpl.instruction,
      `Write the entire response in ${languageName}. Keep Sanskrit terms in their traditional form.`,
      styleFor(tpl, opts.depth),
      `Use exactly these Markdown sections, in this order:\n${sections.map((s) => `- ## ${s}`).join("\n")}`,
      `Follow this skeleton:\n\n${buildSkeleton(tpl, opts.depth)}`,
      `Calculated engine data (authoritative — do not alter):\n\`\`\`json\n${JSON.stringify(opts.data, null, 2)}\n\`\`\``,
    ].join("\n\n") +
    contextBlock +
    confidenceBlock;

  return {
    templateId: tpl.id,
    version: tpl.version,
    featureKey: featureKeyFor(tpl.id),
    system: tpl.system,
    prompt,
    maxTokens: MAX_TOKENS[opts.depth],
  };
}
