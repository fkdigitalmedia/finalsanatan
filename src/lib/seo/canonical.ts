// ============================================================
// Phase 14.7 — Canonical URL engine.
// One place decides what the "real" URL of a page is: tracking params
// stripped, filters dropped, pagination kept, language prefix honoured.
// ============================================================

import { SITE_URL, TRACKING_PARAMS, DEFAULT_LANG, ENABLED_LANGUAGES } from "./constants";

const LANG_CODES = new Set(ENABLED_LANGUAGES.map((l) => l.code));

/** Collapse slashes, force a leading slash, drop the trailing one (except root). */
export function normalizePath(path: string): string {
  const clean = `/${String(path ?? "")}`.replace(/\/{2,}/g, "/").split("#")[0];
  const [p, q] = clean.split("?");
  const trimmed = p.length > 1 ? p.replace(/\/+$/, "") : "/";
  return q ? `${trimmed}?${q}` : trimmed;
}

/** Split `/hi/tools/kundli` into `{ lang: "hi", path: "/tools/kundli" }`. */
export function splitLangPath(path: string): { lang: string; path: string } {
  const norm = normalizePath(path);
  const [, first, ...rest] = norm.split("/");
  if (LANG_CODES.has(first)) {
    return { lang: first, path: normalizePath(`/${rest.join("/")}`) };
  }
  return { lang: DEFAULT_LANG, path: norm };
}

/** Inverse of splitLangPath — format localized path with language prefix. */
export function withLang(path: string, lang: string): string {
  const { path: bare } = splitLangPath(path);
  const code = lang || DEFAULT_LANG;
  return normalizePath(`/${code}${bare === "/" ? "" : bare}`);
}

export interface CanonicalOptions {
  /** Absolute origin; defaults to the production site URL. */
  origin?: string;
  /** Query params worth keeping (e.g. `page`, `q`). Everything else is dropped. */
  keepParams?: string[];
  /** Raw search string or object of the current request. */
  search?: string | Record<string, unknown>;
  /** Page number for paginated collections — page 1 canonicalises to the bare URL. */
  page?: number;
  /** Language code; the canonical always points at the same-language URL. */
  lang?: string;
}

function toEntries(search: CanonicalOptions["search"]): [string, string][] {
  if (!search) return [];
  if (typeof search === "string") return [...new URLSearchParams(search).entries()];
  return Object.entries(search)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [k, String(v)]);
}

/** The canonical (absolute) URL for a page. */
export function canonicalUrl(path: string, opts: CanonicalOptions = {}): string {
  const origin = (opts.origin ?? SITE_URL).replace(/\/+$/, "");
  const { path: bare, lang: pathLang } = splitLangPath(path);
  const lang = opts.lang ?? pathLang;
  const keep = new Set(opts.keepParams ?? []);

  const params = new URLSearchParams();
  for (const [k, v] of toEntries(opts.search)) {
    if (TRACKING_PARAMS.includes(k)) continue;
    if (keep.has(k)) params.set(k, v);
  }
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));

  const qs = params.toString();
  return `${origin}${withLang(bare, lang)}${qs ? `?${qs}` : ""}`;
}

/** rel="prev"/rel="next" link objects for a paginated collection. */
export function paginationLinks(
  path: string,
  page: number,
  totalPages: number,
  opts: CanonicalOptions = {},
): { rel: "prev" | "next"; href: string }[] {
  const links: { rel: "prev" | "next"; href: string }[] = [];
  if (page > 1) links.push({ rel: "prev", href: canonicalUrl(path, { ...opts, page: page - 1 }) });
  if (page < totalPages)
    links.push({ rel: "next", href: canonicalUrl(path, { ...opts, page: page + 1 }) });
  return links;
}

/** True when a URL only differs from its canonical by junk params (a duplicate). */
export function isDuplicateUrl(path: string, opts: CanonicalOptions = {}): boolean {
  const raw = `${(opts.origin ?? SITE_URL).replace(/\/+$/, "")}${normalizePath(path)}`;
  const withSearch = toEntries(opts.search).length
    ? `${raw}?${new URLSearchParams(toEntries(opts.search)).toString()}`
    : raw;
  return withSearch !== canonicalUrl(path, opts);
}
