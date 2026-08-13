# SanatanTools — Technical SEO Architecture & Route Engine Documentation

## 1. Overview

The Technical SEO Engine provides a central, deterministic architecture for managing crawlability, indexability, canonical URLs, hreflang alternates, sitemap generation, host canonicalization, and status code handling across SanatanTools.

## 2. Architecture & Classification System

All application routes are classified using a central enumeration defined in `src/lib/seo/classification.ts`:

| Classification | Meaning | HTTP Status Target | Indexability | Sitemap Inclusion |
| :--- | :--- | :--- | :--- | :--- |
| `INDEXABLE_PUBLIC` | Public high-value SEO pages (home, tools, blog, festivals, horoscopes, legal) | `200 OK` | `index, follow` | **Yes** |
| `NOINDEX_PRIVATE` | Private, auth, dashboard, admin, API, search, or user-specific content | `200 OK` / Auth state | `noindex, nofollow` | **No** |
| `REDIRECT_PERMANENT` | Host canonicalization, legacy URLs, or path migrations | `301 / 308` | N/A | **No** |
| `REDIRECT_TEMPORARY` | Temporary auth wall gates | `307 / 302` | N/A | **No** |
| `ERROR_404` | Non-existent static files or missing routes | `404 Not Found` | `noindex, nofollow` | **No** |
| `ERROR_410` | Intentionally retired/deprecated articles or entity URLs with no replacement | `410 Gone` | `noindex, nofollow` | **No** |

## 3. Canonical URL Engine (`src/lib/seo/canonical.ts`)

- **Primary Canonical Domain**: `https://sanatantools.com`
- **Default Language Normalization**: The default language (`en`) produces un-prefixed canonical URLs (e.g. `https://sanatantools.com/tools`, `https://sanatantools.com/yearly-horoscope/aries`).
- **Tracking Parameter Stripping**: Strips tracking parameters (`utm_source`, `utm_medium`, `gclid`, `fbclid`, etc.) before canonical URLs are rendered.
- **Pagination Support**: `page=1` canonicalizes to the clean base URL; `page > 1` retains `page` while providing `rel="prev"` and `rel="next"` headers.

## 4. Redirect Management & 307 Elimination

To prevent SEO performance degradation from HTTP 307 temporary redirects:
- All permanent route migrations (e.g., `/tools/kundli-generator` → `/kundli`, `/legal/terms-conditions` → `/legal/terms-and-conditions`, `/articles/*` → `/blog/*`) pass `statusCode: 301` explicitly to TanStack Router's `throw redirect(...)`.
- The Router uses `trailingSlash: "never"` to prevent automatic 307 redirects for bare layout paths like `/tools`.
- Host canonicalization middleware in `src/start.ts` permanently redirects `www.sanatantools.com` requests to `https://sanatantools.com` with HTTP 301.

## 5. Namespace Handlers

- `/articles/`: Index redirects 301 to `/blog`.
- `/articles/$slug`: Performs dynamic lookup against `admin_articles` and `TOOLS`. If found, redirects 301 to `/blog/$slug` or `/tools/$slug`. Unmatched/retired URLs return HTTP 410 (Gone).
- `/tools`: Renders the full indexable Tools Hub with HTTP 200 OK. Flagship tool `/tools/kundli-generator` redirects 301 to `/kundli`.

## 6. Sitemap Sharding (`src/lib/seo/sitemap.ts`)

- Sitemap index served at `/sitemap.xml`.
- Shards generated: `sitemap-pages.xml`, `sitemap-tools.xml`, `sitemap-blog.xml`, `sitemap-festivals.xml`, `sitemap-horoscope.xml`, `sitemap-images.xml`, `sitemap-news.xml`, `sitemap-video.xml`.
- Entry Filtering: Every entry is filtered via `isSitemapEligible(path)`. Sitemaps contain ONLY HTTP 200 indexable self-canonical public URLs.

## 7. Verification & Audit Tools

Run the automated verification suite:
```bash
node scripts/verify-seo-crawl-clean.js
```
