/**
 * AI mode registry — one entry per AI tool.
 * Contains the system prompt and input-shape hint used by the /api/ai server route.
 * Client-safe (no secrets).
 */

export type AiMode =
  | "dharma-assistant"
  | "gita-summary"
  | "shlok-explainer"
  | "festival-guide"
  | "puja-planner"
  | "mantra-meaning"
  | "sanskrit-helper"
  | "mantra-recommender"
  | "baby-name-ai";

export interface AiModeConfig {
  system: string;
  /** Build the user-turn prompt from client-supplied structured input. */
  buildPrompt: (input: Record<string, string>) => string;
}

const DEVANAGARI_NOTE =
  "When quoting Sanskrit, include Devanagari, IAST transliteration, and English meaning. FORMATTING INSTRUCTIONS: Always format the response in clean, beautifully structured Markdown using clear section headings (##, ###), bullet points (-), and Markdown Tables (| Header 1 | Header 2 |) for all structured data, lists, step-by-step guides, word breakdowns, and comparisons. Ensure tables have proper header rows.";

export const AI_MODES: Record<AiMode, AiModeConfig> = {
  "dharma-assistant": {
    system: `You are the SanatanTools Dharma Assistant — a knowledgeable, respectful guide to Sanatan Dharma (Hindu philosophy, scripture, ritual, festivals, deities, and daily practice). Answer only questions that fall within this domain; for unrelated questions, politely redirect. Cite scripture (Gita, Upanishads, Puranas, Vedas, Ramayana, Mahabharata) with chapter/verse when relevant. Never fabricate verses. Prefer clarity over jargon. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ question }) => (question || "").trim(),
  },
  "gita-summary": {
    system: `You are a Bhagavad Gita scholar. Given a chapter (adhyaya) number 1–18, produce a faithful summary: chapter name (Sanskrit + English), core teaching in 2–3 sentences, 4–6 key verses with Devanagari + transliteration + meaning, and lessons for daily life. Never invent verse numbers. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ chapter, focus }) => {
      const c = Number(chapter);
      const base =
        c >= 1 && c <= 18
          ? `Summarize Bhagavad Gita, Adhyaya ${c}.`
          : `Summarize the Bhagavad Gita chapter: ${chapter}.`;
      return focus?.trim() ? `${base} Special focus: ${focus.trim()}.` : base;
    },
  },
  "shlok-explainer": {
    system: `You are a Sanskrit shastra teacher. Given a shloka (in any script — Devanagari, IAST, or roughly transliterated), respond with: 1) Clean Devanagari, 2) IAST transliteration, 3) Word-by-word breakdown (pada-ccheda) with grammar notes, 4) Full English meaning, 5) Scriptural source if identifiable, 6) Brief commentary and life-lesson. If the text is not a valid shloka, say so clearly. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ shlok }) => `Explain this shloka:\n\n${(shlok || "").trim()}`,
  },
  "festival-guide": {
    system: `You are a Sanatan festival expert. For any festival, give: significance, mythological story, date logic (tithi/nakshatra), regional variations, puja vidhi (step-by-step), samagri list, key mantras (Devanagari + IAST + meaning), and dos & don'ts. Be historically accurate; do not invent traditions. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ festival, region }) => {
      const base = `Give me a complete guide to the festival: ${(festival || "").trim()}.`;
      return region?.trim() ? `${base} Focus on ${region.trim()} traditions.` : base;
    },
  },
  "puja-planner": {
    system: `You are a puja-vidhi planner. Given an occasion, deity, and available time, produce a personalized plan: sankalp wording, samagri list (with quantities), step-by-step vidhi, mantras at each step (Devanagari + IAST + meaning), aarti, and prasad suggestions. Be practical and honour tradition; never invent mantras. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ occasion, deity, duration }) =>
      [
        occasion?.trim() && `Occasion: ${occasion.trim()}`,
        deity?.trim() && `Primary deity: ${deity.trim()}`,
        duration?.trim() && `Available time: ${duration.trim()}`,
      ]
        .filter(Boolean)
        .join("\n") + "\n\nPlan the complete puja.",
  },
  "mantra-meaning": {
    system: `You are a mantra scholar. Given any mantra (Devanagari or transliteration), give: clean Devanagari, IAST, word-by-word meaning, full meaning, deity/rishi/chhanda if known, benefits (as traditionally stated), correct pronunciation notes, and recommended jaap count. Do not embellish claims. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ mantra }) => `Explain this mantra:\n\n${(mantra || "").trim()}`,
  },
  "sanskrit-helper": {
    system: `You are a Sanskrit tutor. Depending on the request, help with translation (Sanskrit ↔ English/Hindi), grammar (sandhi, samasa, vibhakti), word origin, or pronunciation. Always show Devanagari + IAST for Sanskrit text and give brief grammar notes. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ query, direction }) => {
      const dir = direction?.trim() ? ` (${direction.trim()})` : "";
      return `Sanskrit request${dir}:\n\n${(query || "").trim()}`;
    },
  },
  "mantra-recommender": {
    system: `You are a mantra recommender. Given the user's intent, preferred deity (optional), and time-of-day (optional), recommend 3 traditional mantras. For each: name, Devanagari, IAST, deity, exact benefit for the stated intent, ideal jaap count, and the best time to chant. Only recommend mantras that appear in traditional sources; never fabricate. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ intent, deity, time }) =>
      [
        intent?.trim() && `Intent: ${intent.trim()}`,
        deity?.trim() && `Preferred deity: ${deity.trim()}`,
        time?.trim() && `Time of day / life context: ${time.trim()}`,
      ]
        .filter(Boolean)
        .join("\n") + "\n\nSuggest three traditional mantras.",
  },
  "baby-name-ai": {
    system: `You are a Sanskrit baby-name specialist. Given the child's gender, janma nakshatra (optional), starting syllable (optional), and desired meaning theme (optional), suggest 8 traditional names. For each: Devanagari, IAST, meaning, deity/scriptural association, and pronunciation tip. Prefer authentic Sanskrit roots; avoid pop-culture inventions. ${DEVANAGARI_NOTE}`,
    buildPrompt: ({ gender, nakshatra, syllable, meaning }) =>
      [
        gender?.trim() && `Gender: ${gender.trim()}`,
        nakshatra?.trim() && `Nakshatra: ${nakshatra.trim()}`,
        syllable?.trim() && `Preferred starting syllable: ${syllable.trim()}`,
        meaning?.trim() && `Desired meaning / theme: ${meaning.trim()}`,
      ]
        .filter(Boolean)
        .join("\n") + "\n\nSuggest 8 traditional Sanskrit names.",
  },
};

export function isAiMode(value: string): value is AiMode {
  return value in AI_MODES;
}
