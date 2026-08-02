// ============================================================
// Phase 14.7 — Sitemap engine.
// Collectors turn registries into entries; renderers turn entries into
// XML (urlset, sitemapindex, image, news and video extensions).
// Every shard route is a thin wrapper over these functions.
// ============================================================

import { TOOLS } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { HOROSCOPE_PERIODS, SIGNS } from "@/lib/horoscope-public";
import { allEntityPaths } from "@/config/seo-entities";
import { ENABLED_LANGUAGES, DEFAULT_LANG, SITE_URL, SITE_NAME } from "./constants";
import { withLang } from "./canonical";

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  /** Emit hreflang alternates for every enabled language (default true). */
  alternates?: boolean;
  images?: { loc: string; caption?: string; title?: string }[];
  news?: { title: string; publishedAt: string; language?: string };
  video?: {
    thumbnail: string;
    title: string;
    description: string;
    contentUrl?: string;
    playerUrl?: string;
  };
}

export function xmlEscape(v: string): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Absolute origin derived from the incoming request (preview/custom domain safe). */
export function originFromRequest(request: Request): string {
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  return `${proto}://${host}`;
}

function alternateLinks(path: string, origin: string): string[] {
  const rows = ENABLED_LANGUAGES.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l.htmlLang}" href="${xmlEscape(origin + withLang(path, l.code))}"/>`,
  );
  rows.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(origin + withLang(path, DEFAULT_LANG))}"/>`,
  );
  return rows;
}

function renderEntry(entry: SitemapEntry, origin: string, lang: string): string {
  const loc = origin + withLang(entry.path, lang);
  const rows = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`];
  if (entry.lastmod) rows.push(`    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`);
  if (entry.changefreq) rows.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority) rows.push(`    <priority>${entry.priority}</priority>`);
  if (entry.alternates !== false) rows.push(...alternateLinks(entry.path, origin));

  for (const img of entry.images ?? []) {
    rows.push(
      `    <image:image>`,
      `      <image:loc>${xmlEscape(img.loc)}</image:loc>`,
      ...(img.title ? [`      <image:title>${xmlEscape(img.title)}</image:title>`] : []),
      ...(img.caption ? [`      <image:caption>${xmlEscape(img.caption)}</image:caption>`] : []),
      `    </image:image>`,
    );
  }

  if (entry.news) {
    rows.push(
      `    <news:news>`,
      `      <news:publication>`,
      `        <news:name>${xmlEscape(SITE_NAME)}</news:name>`,
      `        <news:language>${entry.news.language ?? "en"}</news:language>`,
      `      </news:publication>`,
      `      <news:publication_date>${xmlEscape(entry.news.publishedAt)}</news:publication_date>`,
      `      <news:title>${xmlEscape(entry.news.title)}</news:title>`,
      `    </news:news>`,
    );
  }

  if (entry.video) {
    rows.push(
      `    <video:video>`,
      `      <video:thumbnail_loc>${xmlEscape(entry.video.thumbnail)}</video:thumbnail_loc>`,
      `      <video:title>${xmlEscape(entry.video.title)}</video:title>`,
      `      <video:description>${xmlEscape(entry.video.description)}</video:description>`,
      ...(entry.video.contentUrl
        ? [`      <video:content_loc>${xmlEscape(entry.video.contentUrl)}</video:content_loc>`]
        : []),
      ...(entry.video.playerUrl
        ? [`      <video:player_loc>${xmlEscape(entry.video.playerUrl)}</video:player_loc>`]
        : []),
      `    </video:video>`,
    );
  }

  rows.push(`  </url>`);
  return rows.join("\n");
}

export interface RenderOptions {
  origin?: string;
  /** Emit one <url> per language (default true). */
  multilingual?: boolean;
}

export function renderUrlset(entries: SitemapEntry[], opts: RenderOptions = {}): string {
  const origin = (opts.origin ?? SITE_URL).replace(/\/+$/, "");
  const langs = opts.multilingual === false ? [{ code: DEFAULT_LANG }] : ENABLED_LANGUAGES;
  const urls: string[] = [];
  for (const entry of entries) {
    for (const lang of langs) urls.push(renderEntry(entry, origin, lang.code));
  }
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml"`,
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`,
    `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"`,
    `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`,
    urls.join("\n"),
    `</urlset>`,
  ].join("\n");
}

export function renderSitemapIndex(
  shards: { path: string; lastmod?: string }[],
  origin = SITE_URL,
): string {
  const base = origin.replace(/\/+$/, "");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...shards.map((s) =>
      [
        `  <sitemap>`,
        `    <loc>${xmlEscape(base + s.path)}</loc>`,
        ...(s.lastmod ? [`    <lastmod>${xmlEscape(s.lastmod)}</lastmod>`] : []),
        `  </sitemap>`,
      ].join("\n"),
    ),
    `</sitemapindex>`,
  ].join("\n");
}

export function xmlResponse(xml: string, maxAge = 3600): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}`,
    },
  });
}

// ── Collectors ──────────────────────────────────────────────

export const LEGAL_SLUGS = [
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "cookie-policy",
  "ai-disclaimer",
  "religious-content-disclaimer",
  "astrology-kundli-disclaimer",
  "copyright-policy",
  "dmca-policy",
  "refund-policy",
  "affiliate-disclosure",
  "accessibility-statement",
  "editorial-policy",
  "community-guidelines",
];

/** Static pages, categories, legal and every programmatic entity page. */
export function collectPages(): SitemapEntry[] {
  return [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/tools", changefreq: "weekly", priority: "0.9" },
    { path: "/astrology", changefreq: "weekly", priority: "0.9" },
    { path: "/temples", changefreq: "weekly", priority: "0.7" },
    { path: "/blog", changefreq: "daily", priority: "0.8" },
    { path: "/faq", changefreq: "monthly", priority: "0.6" },
    { path: "/support", changefreq: "monthly", priority: "0.6" },
    { path: "/about", changefreq: "monthly", priority: "0.6" },
    { path: "/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/pricing", changefreq: "weekly", priority: "0.7" },
    { path: "/legal", changefreq: "monthly", priority: "0.5" },
    ...LEGAL_SLUGS.map((slug) => ({
      path: `/legal/${slug}`,
      changefreq: "monthly",
      priority: "0.4",
    })),
    ...CATEGORIES.map((c) => ({ path: `/${c.slug}`, changefreq: "weekly", priority: "0.8" })),
    ...allEntityPaths().map((path) => ({
      path,
      changefreq: "monthly",
      priority: path.split("/").length > 2 ? "0.6" : "0.75",
    })),
  ];
}

export function collectTools(): SitemapEntry[] {
  return TOOLS.filter((t) => t.status !== "coming-soon").map((t) => ({
    path: `/tools/${t.slug}`,
    changefreq: t.category === "panchang" ? "daily" : "weekly",
    priority: t.featured ? "0.9" : t.popularity >= 70 ? "0.8" : "0.7",
    lastmod: t.addedAt,
  }));
}

export function collectHoroscopes(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const period of HOROSCOPE_PERIODS) {
    const changefreq = period === "daily" ? "daily" : period === "weekly" ? "weekly" : "monthly";
    entries.push({ path: `/${period}-horoscope`, changefreq, priority: "0.9" });
    for (const sign of SIGNS) {
      entries.push({ path: `/${period}-horoscope/${sign.slug}`, changefreq, priority: "0.8" });
    }
  }
  return entries;
}

export function collectBlog(
  posts: { slug: string; updated_at?: string | null; published_at?: string | null }[],
): SitemapEntry[] {
  return posts.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.6",
    lastmod: (p.updated_at ?? p.published_at ?? undefined) || undefined,
  }));
}

/** Google News accepts articles published in the last 48 hours only. */
export function collectNews(
  posts: { slug: string; title: string; published_at?: string | null }[],
): SitemapEntry[] {
  const cutoff = Date.now() - 48 * 3600 * 1000;
  return posts
    .filter((p) => p.published_at && new Date(p.published_at).getTime() >= cutoff)
    .map((p) => ({
      path: `/blog/${p.slug}`,
      alternates: false,
      news: { title: p.title, publishedAt: new Date(p.published_at as string).toISOString() },
    }));
}

export function collectImages(
  items: { path: string; image: string; title?: string; caption?: string }[],
): SitemapEntry[] {
  return items.map((i) => ({
    path: i.path,
    alternates: false,
    images: [{ loc: i.image, title: i.title, caption: i.caption }],
  }));
}
