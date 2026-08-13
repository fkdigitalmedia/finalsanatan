// ============================================================
// Phase 14.7 — Enterprise SEO Engine · constants
// Every other module in src/lib/seo reads its defaults from here.
// Nothing in this file may import from the app (keep it pure).
// ============================================================

import { LANGUAGES, DEFAULT_LANGUAGE } from "@/i18n/config";

export const SITE_NAME = "SanatanTools";
export const SITE_LEGAL_NAME = "SanatanTools";
export const SITE_URL = process.env.VITE_SITE_URL ?? "https://www.sanatantools.com";
export const SITE_TAGLINE = "Panchang, Kundli, Festivals & Vedic AI tools";
export const SITE_DESCRIPTION =
  "The largest Sanatan Dharma utility platform — live Panchang, Kundli & matching reports, festival calendars, horoscopes, mantras and Sanskrit learning, in 12 Indian languages.";

export const TWITTER_SITE = "@sanatantools";
export const TWITTER_CREATOR = "@sanatantools";

export const DEFAULT_OG_IMAGE = "/og-default.jpg";
export const DEFAULT_LOCALE = "en_IN";

/** Google truncates around these widths — the quality checker uses them. */
export const TITLE_MIN = 25;
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 70;
export const DESCRIPTION_MAX = 160;
export const MIN_WORD_COUNT = 250;
export const MAX_KEYWORDS = 12;

/** Page archetypes the engine knows how to describe. */
export const PAGE_TYPES = [
  "homepage",
  "tool",
  "category",
  "festival",
  "blog",
  "horoscope",
  "panchang",
  "report",
  "landing",
  "search",
  "author",
  "static",
] as const;
export type PageType = (typeof PAGE_TYPES)[number];

/** Per-archetype crawl hints used by the sitemap + metadata builders. */
export const PAGE_TYPE_DEFAULTS: Record<
  PageType,
  { changefreq: string; priority: string; ogType: string; indexable: boolean }
> = {
  homepage: { changefreq: "daily", priority: "1.0", ogType: "website", indexable: true },
  tool: { changefreq: "weekly", priority: "0.8", ogType: "website", indexable: true },
  category: { changefreq: "weekly", priority: "0.8", ogType: "website", indexable: true },
  festival: { changefreq: "weekly", priority: "0.8", ogType: "article", indexable: true },
  blog: { changefreq: "monthly", priority: "0.7", ogType: "article", indexable: true },
  horoscope: { changefreq: "daily", priority: "0.9", ogType: "article", indexable: true },
  panchang: { changefreq: "daily", priority: "0.9", ogType: "website", indexable: true },
  report: { changefreq: "monthly", priority: "0.6", ogType: "article", indexable: true },
  landing: { changefreq: "weekly", priority: "0.7", ogType: "website", indexable: true },
  search: { changefreq: "weekly", priority: "0.3", ogType: "website", indexable: false },
  author: { changefreq: "monthly", priority: "0.5", ogType: "profile", indexable: true },
  static: { changefreq: "monthly", priority: "0.5", ogType: "website", indexable: true },
};

/** Paths that must never be indexed, whatever a page descriptor says. */
export const NOINDEX_PREFIXES = [
  "/auth",
  "/reset-password",
  "/dashboard",
  "/bookmarks",
  "/favorites",
  "/history",
  "/notifications",
  "/profile",
  "/settings",
  "/saved-mantras",
  "/my-kundlis",
  "/family",
  "/downloads",
  "/horoscope-history",
  "/billing",
  "/reports",
  "/admin",
  "/api",
  "/search",
];

/** Query params stripped before a canonical URL is emitted. */
export const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ref",
  "referrer",
  "mc_cid",
  "mc_eid",
];

/** Classic search-engine crawlers we explicitly welcome. */
export const SEARCH_CRAWLERS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "Slurp",
  "Baiduspider",
  "YandexBot",
  "Applebot",
];

/** AI / answer-engine crawlers allowed to read the site (llms.txt + robots). */
export const AI_CRAWLERS_ALLOWED = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "Claude-Web",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot-Extended",
  "cohere-ai",
  "YouBot",
  "Bingbot",
  "Amazonbot",
];

/** Crawlers blocked by default (scrapers with no search or answer surface). */
export const AI_CRAWLERS_BLOCKED = [
  "CCBot",
  "Bytespider",
  "Diffbot",
  "ImagesiftBot",
  "omgili",
  "Timpibot",
];

export const ENABLED_LANGUAGES = LANGUAGES.filter((l) => l.enabled);
export const DEFAULT_LANG = DEFAULT_LANGUAGE;

/** Sitemap shards served by the app; the index route lists these. */
export const SITEMAP_SHARDS = [
  "sitemap-pages.xml",
  "sitemap-tools.xml",
  "sitemap-blog.xml",
  "sitemap-festivals.xml",
  "sitemap-horoscope.xml",
  "sitemap-images.xml",
  "sitemap-news.xml",
  "sitemap-video.xml",
] as const;
