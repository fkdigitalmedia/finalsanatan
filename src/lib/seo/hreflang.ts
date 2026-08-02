// ============================================================
// Phase 14.7 — Hreflang engine.
// The site serves 12 Indian languages under `/<code>/...` prefixes;
// every indexable page advertises all of them plus x-default.
// ============================================================

import { ENABLED_LANGUAGES, DEFAULT_LANG, SITE_URL } from "./constants";
import { splitLangPath, withLang } from "./canonical";

export interface Alternate {
  hrefLang: string;
  href: string;
  lang: string;
}

/** All language alternates for a path, including x-default. */
export function alternates(path: string, origin = SITE_URL): Alternate[] {
  const { path: bare } = splitLangPath(path);
  const base = origin.replace(/\/+$/, "");
  const list: Alternate[] = ENABLED_LANGUAGES.map((l) => ({
    hrefLang: l.htmlLang,
    lang: l.code,
    href: `${base}${withLang(bare, l.code)}`,
  }));
  list.push({
    hrefLang: "x-default",
    lang: DEFAULT_LANG,
    href: `${base}${withLang(bare, DEFAULT_LANG)}`,
  });
  return list;
}

/** `links` entries ready for a TanStack route head(). */
export function hreflangLinks(path: string, origin = SITE_URL) {
  return alternates(path, origin).map((a) => ({
    rel: "alternate",
    hrefLang: a.hrefLang,
    href: a.href,
  }));
}

/** `xhtml:link` rows for a multilingual sitemap entry. */
export function sitemapAlternates(path: string, origin = SITE_URL): string[] {
  return alternates(path, origin).map(
    (a) => `    <xhtml:link rel="alternate" hreflang="${a.hrefLang}" href="${a.href}"/>`,
  );
}

/** BCP-47 tag for a language code (falls back to the code itself). */
export function htmlLangOf(code: string): string {
  return ENABLED_LANGUAGES.find((l) => l.code === code)?.htmlLang ?? code;
}

/** OpenGraph locale (`hi_IN`) for a language code. */
export function ogLocaleOf(code: string): string {
  return htmlLangOf(code).replace("-", "_");
}
