// ============================================================
// Phase 14.7 — Internal linking engine.
// Scores every candidate page against the current page (same category,
// shared tags, popularity, freshness) and returns ranked link blocks.
// Nothing is hand-curated: new tools/entities join the graph instantly.
// ============================================================

import { TOOLS, type Tool } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { SIGNS } from "@/lib/horoscope-public";
import { ENTITY_FAMILIES, type EntityFamily } from "@/config/seo-entities";
import type { PageType } from "./constants";

export interface LinkItem {
  label: string;
  to: string;
  description?: string;
  /** Higher = more relevant. Exposed so the UI can sort or trim. */
  score?: number;
}

export interface LinkBlock {
  title: string;
  items: LinkItem[];
}

export interface LinkContext {
  type: PageType;
  path: string;
  /** Slug of the current tool / category / festival / article. */
  slug?: string;
  /** Category slug when known (tools, articles). */
  category?: string;
  /** Free-form tags of the current page (article tags, tool tags). */
  tags?: string[];
  /** Extra candidates supplied by the caller (blog posts, festivals). */
  candidates?: (LinkItem & { tags?: string[]; category?: string })[];
  limit?: number;
}

const toolLink = (t: Tool): LinkItem => ({
  label: t.title,
  to: `/tools/${t.slug}`,
  description: t.description,
});

function overlap(a: string[] = [], b: string[] = []): number {
  const set = new Set(a.map((x) => x.toLowerCase()));
  return b.reduce((n, x) => n + (set.has(x.toLowerCase()) ? 1 : 0), 0);
}

/** Rank tools by relevance to the current page. */
export function relatedTools(ctx: LinkContext, limit = 6): LinkItem[] {
  const current = ctx.slug ? TOOLS.find((t) => t.slug === ctx.slug) : undefined;
  const category = ctx.category ?? current?.category;
  const tags = ctx.tags ?? current?.tags ?? [];

  return TOOLS.filter((t) => t.slug !== ctx.slug && t.status !== "coming-soon")
    .map((t) => {
      let score = t.popularity / 100;
      if (category && t.category === category) score += 2;
      score += overlap(tags, t.tags) * 1.5;
      if (t.featured) score += 0.4;
      return { ...toolLink(t), score };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}

export function popularTools(limit = 8): LinkItem[] {
  return [...TOOLS]
    .filter((t) => t.status !== "coming-soon")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(toolLink);
}

export function latestTools(limit = 8): LinkItem[] {
  return [...TOOLS]
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
    .slice(0, limit)
    .map(toolLink);
}

/** Popularity-weighted recency — the "trending" block. */
export function trendingTools(limit = 8): LinkItem[] {
  const now = Date.now();
  return [...TOOLS]
    .filter((t) => t.status !== "coming-soon")
    .map((t) => {
      const ageDays = Math.max(1, (now - new Date(t.addedAt).getTime()) / 86_400_000);
      return { ...toolLink(t), score: t.popularity / Math.log2(ageDays + 8) };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}

export function categoryLinks(exclude?: string, limit = 10): LinkItem[] {
  return CATEGORIES.filter((c) => c.slug !== exclude)
    .slice(0, limit)
    .map((c) => ({ label: c.title, to: `/${c.slug}`, description: c.short }));
}

export function horoscopeLinks(limit = 12): LinkItem[] {
  return SIGNS.slice(0, limit).map((s) => ({
    label: `${s.english} daily horoscope`,
    to: `/daily-horoscope/${s.slug}`,
    description: `${s.hindi} · ${s.dates}`,
  }));
}

export function panchangLinks(limit = 6): LinkItem[] {
  return TOOLS.filter((t) => t.category === "panchang")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(toolLink);
}

export function entityLinks(family: EntityFamily, limit = 12): LinkItem[] {
  const fam = ENTITY_FAMILIES[family];
  return fam.items.slice(0, limit).map((e) => ({
    label: e.title,
    to: `${fam.base}/${e.slug}`,
    description: e.summary,
  }));
}

/** Rank caller-supplied candidates (blog posts, festivals) by tag overlap. */
export function relatedFrom(ctx: LinkContext, limit = 6): LinkItem[] {
  return (ctx.candidates ?? [])
    .filter((c) => c.to !== ctx.path)
    .map((c) => {
      let score = 0;
      if (ctx.category && c.category === ctx.category) score += 2;
      score += overlap(ctx.tags, c.tags) * 1.5;
      return { label: c.label, to: c.to, description: c.description, score };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}

/**
 * The full internal-link payload for a page — the UI renders whatever
 * blocks come back, so new page types need no template change.
 */
export function internalLinks(ctx: LinkContext): LinkBlock[] {
  const limit = ctx.limit ?? 6;
  const blocks: LinkBlock[] = [];
  const push = (title: string, items: LinkItem[]) => {
    if (items.length) blocks.push({ title, items });
  };

  switch (ctx.type) {
    case "tool":
      push("Related tools", relatedTools(ctx, limit));
      push("Browse categories", categoryLinks(ctx.category, 6));
      break;
    case "category":
      push("Popular in this category", relatedTools({ ...ctx, type: "tool" }, limit));
      push("Other categories", categoryLinks(ctx.slug, 8));
      break;
    case "festival":
      push("Festival tools", relatedTools({ ...ctx, category: "festivals" }, limit));
      push("Panchang for the day", panchangLinks(4));
      push("Related festivals", relatedFrom(ctx, limit));
      break;
    case "blog":
      push("Related articles", relatedFrom(ctx, limit));
      push("Tools mentioned", relatedTools(ctx, 4));
      break;
    case "horoscope":
      push("All rashis", horoscopeLinks());
      push("Go deeper", relatedTools({ ...ctx, category: "astrology" }, 4));
      break;
    case "panchang":
      push("More panchang", panchangLinks(limit));
      push("Muhurat guides", entityLinks("muhurat", 6));
      break;
    case "landing":
      push("Popular tools", popularTools(limit));
      push("Explore", categoryLinks(undefined, 8));
      break;
    case "homepage":
      push("Trending now", trendingTools(6));
      push("Newest tools", latestTools(6));
      push("Categories", categoryLinks(undefined, 10));
      break;
    default:
      push("Popular pages", popularTools(limit));
      push("Categories", categoryLinks(undefined, 6));
  }

  return blocks;
}
