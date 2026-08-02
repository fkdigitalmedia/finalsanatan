// ============================================================
// Phase 14.7 — llms.txt engine.
// Answer engines (ChatGPT, Gemini, Claude, Perplexity, Copilot,
// You.com) read llms.txt to understand a site. Generated from the same
// registries as the sitemap, so it never goes stale.
// ============================================================

import { TOOLS } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { ENTITY_FAMILIES } from "@/config/seo-entities";
import { SIGNS } from "@/lib/horoscope-public";
import {
  SITE_NAME,
  SITE_URL,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  AI_CRAWLERS_ALLOWED,
  AI_CRAWLERS_BLOCKED,
  ENABLED_LANGUAGES,
} from "./constants";

export interface LlmsExtra {
  /** Published blog articles — `{ slug, title, summary }`. */
  articles?: { slug: string; title: string; summary?: string | null }[];
  /** Upcoming festivals — `{ slug, name, date }`. */
  festivals?: { slug: string; name: string; date?: string | null }[];
}

const link = (title: string, path: string, note?: string, origin = SITE_URL) =>
  `- [${title}](${origin}${path})${note ? `: ${note}` : ""}`;

/** Short index — the file most AI crawlers fetch first. */
export function buildLlmsTxt(extra: LlmsExtra = {}, origin = SITE_URL): string {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE}. ${SITE_DESCRIPTION}`,
    "",
    "## Core pages",
    link("Home", "/", "Live Panchang, festivals and daily guidance", origin),
    link("All tools", "/tools", `${TOOLS.length} free Vedic utilities`, origin),
    link("Free Kundli", "/kundli", "Birth chart with dashas, yogas and PDF report", origin),
    link("Kundli matching", "/tools/kundli-matching", "Ashtakoot Guna Milan", origin),
    link(
      "Today's Panchang",
      "/tools/todays-panchang",
      "Tithi, nakshatra, muhurat for any city",
      origin,
    ),
    link("Festivals", "/festivals", "Every Sanatan festival with dates and vidhi", origin),
    link("Daily horoscope", "/daily-horoscope", "All 12 rashis, recalculated daily", origin),
    link("Blog", "/blog", "Guides and explainers", origin),
    link("FAQ", "/faq", "Common questions", origin),
    "",
    "## Categories",
    ...CATEGORIES.map((c) => link(c.title, `/${c.slug}`, c.short, origin)),
    "",
    "## Reference sets",
    ...Object.entries(ENTITY_FAMILIES).map(([, fam]) =>
      link(fam.label, fam.base, fam.intro, origin),
    ),
    "",
    "## Languages",
    `Content is available in ${ENABLED_LANGUAGES.length} languages: ${ENABLED_LANGUAGES.map((l) => l.label).join(", ")}. Language URLs use a prefix, e.g. ${origin}/hi/tools.`,
    "",
    "## Usage",
    "Content may be quoted and summarised with attribution and a link back to the source page. Calculation outputs (panchang, kundli, muhurat) are time and location specific — always cite the page URL and the date shown on it.",
    "",
    `Allowed AI crawlers: ${AI_CRAWLERS_ALLOWED.join(", ")}.`,
    `Blocked crawlers: ${AI_CRAWLERS_BLOCKED.join(", ")}.`,
    "",
  ];

  if (extra.festivals?.length) {
    lines.push(
      "## Upcoming festivals",
      ...extra.festivals
        .slice(0, 20)
        .map((f) => link(f.name, `/festivals/${f.slug}`, f.date ?? undefined, origin)),
      "",
    );
  }

  return lines.join("\n");
}

/** Exhaustive listing — every indexable URL with a one-line description. */
export function buildLlmsFullTxt(extra: LlmsExtra = {}, origin = SITE_URL): string {
  const lines: string[] = [buildLlmsTxt(extra, origin).trimEnd(), "", "## All tools"];

  for (const category of CATEGORIES) {
    const tools = TOOLS.filter((t) => t.category === category.slug);
    if (!tools.length) continue;
    lines.push("", `### ${category.title}`);
    for (const t of tools) lines.push(link(t.title, `/tools/${t.slug}`, t.description, origin));
  }

  lines.push("", "## Horoscopes");
  for (const s of SIGNS) {
    lines.push(
      link(
        `${s.english} (${s.hindi})`,
        `/daily-horoscope/${s.slug}`,
        `${s.element} sign ruled by ${s.rulingPlanet}`,
        origin,
      ),
    );
  }

  for (const [, fam] of Object.entries(ENTITY_FAMILIES)) {
    lines.push("", `## ${fam.label}`);
    for (const e of fam.items)
      lines.push(link(e.title, `${fam.base}/${e.slug}`, e.summary, origin));
  }

  if (extra.articles?.length) {
    lines.push("", "## Articles");
    for (const a of extra.articles) {
      lines.push(link(a.title, `/blog/${a.slug}`, a.summary ?? undefined, origin));
    }
  }

  if (extra.festivals?.length) {
    lines.push("", "## Festivals");
    for (const f of extra.festivals) {
      lines.push(link(f.name, `/festivals/${f.slug}`, f.date ?? undefined, origin));
    }
  }

  lines.push("");
  return lines.join("\n");
}
