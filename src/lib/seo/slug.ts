// ============================================================
// Phase 14.7 — Slug engine.
// Deterministic, SEO-friendly slugs with transliteration for the
// Indic scripts the site publishes in, duplicate resolution and
// redirect suggestions when a slug changes.
// ============================================================

/** Minimal Devanagari → Latin map (enough for titles and festival names). */
const DEVANAGARI: Record<string, string> = {
  अ: "a",
  आ: "aa",
  इ: "i",
  ई: "ii",
  उ: "u",
  ऊ: "uu",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "au",
  क: "k",
  ख: "kh",
  ग: "g",
  घ: "gh",
  ङ: "n",
  च: "ch",
  छ: "chh",
  ज: "j",
  झ: "jh",
  ञ: "n",
  ट: "t",
  ठ: "th",
  ड: "d",
  ढ: "dh",
  ण: "n",
  त: "t",
  थ: "th",
  द: "d",
  ध: "dh",
  न: "n",
  प: "p",
  फ: "ph",
  ब: "b",
  भ: "bh",
  म: "m",
  य: "y",
  र: "r",
  ल: "l",
  व: "v",
  श: "sh",
  ष: "sh",
  स: "s",
  ह: "h",
  ळ: "l",
  "ा": "a",
  "ि": "i",
  "ी": "i",
  "ु": "u",
  "ू": "u",
  "े": "e",
  "ै": "ai",
  "ो": "o",
  "ौ": "au",
  "ं": "n",
  "ः": "h",
  "्": "",
  "़": "",
  "ृ": "ri",
};

function transliterate(input: string): string {
  let out = "";
  for (const ch of input) out += DEVANAGARI[ch] ?? ch;
  return out;
}

export interface SlugifyOptions {
  /** Hard cap on slug length (default 80 chars, never cuts mid-word). */
  maxLength?: number;
  /** Keep stop words (default false — they dilute the slug). */
  keepStopWords?: boolean;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "with",
]);

/** Convert any human string into a lowercase, hyphenated, ASCII slug. */
export function slugify(input: string, opts: SlugifyOptions = {}): string {
  const maxLength = opts.maxLength ?? 80;
  const base = transliterate(String(input ?? ""))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!base) return "";

  let words = base.split("-").filter(Boolean);
  if (!opts.keepStopWords && words.length > 3) {
    const trimmed = words.filter((w) => !STOP_WORDS.has(w));
    if (trimmed.length >= 2) words = trimmed;
  }

  const out: string[] = [];
  for (const w of words) {
    const next = out.length ? `${out.join("-")}-${w}`.length : w.length;
    if (next > maxLength && out.length) break;
    out.push(w);
  }
  return out.join("-");
}

/** True when a slug is already in canonical form. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Return a slug that does not collide with `taken`, appending -2, -3, …
 * (never a random suffix — regenerating must stay deterministic).
 */
export function uniqueSlug(desired: string, taken: Iterable<string>): string {
  const base = isValidSlug(desired) ? desired : slugify(desired);
  const set = new Set(taken);
  if (!set.has(base)) return base;
  let n = 2;
  while (set.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Build a full path for a content kind + slug (single place that knows URL shape). */
export function pathFor(kind: string, slug: string): string {
  const map: Record<string, (s: string) => string> = {
    tool: (s) => `/tools/${s}`,
    category: (s) => `/${s}`,
    festival: (s) => `/festivals/${s}`,
    blog: (s) => `/blog/${s}`,
    legal: (s) => `/legal/${s}`,
    rashi: (s) => `/daily-horoscope/${s}`,
    nakshatra: (s) => `/nakshatra/${s}`,
    yoga: (s) => `/yoga/${s}`,
    dosha: (s) => `/dosha/${s}`,
    muhurat: (s) => `/muhurat/${s}`,
    numerology: (s) => `/numerology/${s}`,
    vastu: (s) => `/vastu/${s}`,
  };
  const fn = map[kind];
  return fn ? fn(slug) : `/${slug}`;
}

/**
 * When content is renamed the old URL must keep working.
 * Returns a row ready for the `redirects` table, or null when nothing changed.
 */
export function suggestRedirect(
  kind: string,
  oldSlug: string,
  newSlug: string,
): { from_path: string; to_path: string; code: number } | null {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return null;
  return { from_path: pathFor(kind, oldSlug), to_path: pathFor(kind, newSlug), code: 301 };
}
