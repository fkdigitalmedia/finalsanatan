# SEO, Metadata & Performance Engine

## 1. Overview & Architectural Scope

The **SEO & Performance Engine** (`src/lib/seo/`) is the centralized subsystem responsible for search engine optimization, crawl efficiency, structured data (JSON-LD), canonicalization, OpenGraph / Twitter Cards, indexing policies, sitemap generation, and Core Web Vitals performance across **SanatanTools** (`https://www.sanatantools.com`).

---

## 2. Core Modules & Directory Layout

```
src/lib/seo/
├── constants.ts         # Global defaults, primary domain, crawler lists, noindex paths
├── canonical.ts         # URL normalization, parameter stripping, pagination handling
├── schema.ts            # Schema.org JSON-LD builders (WebSite, Org, SoftwareApp, HowTo, FAQ, etc.)
├── metadata.ts          # Meta tag builders, character truncation bounds, robots directives
├── opengraph.ts         # Open Graph tag generators (type, image, locale, audio)
├── twitter.ts           # Twitter card tag generators (summary_large_image)
├── breadcrumbs.ts       # Breadcrumb path parsing and hierarchy reconstruction
├── faq.ts               # Programmatic FAQ injection and entity FAQ extraction
├── internal-links.ts    # Link graph engine and contextual relationship builder
├── classification.ts    # Route archetype classifiers and sitemap eligibility checks
├── robots.ts            # Dynamic robots.txt generation and crawler group rules
├── sitemap.ts           # XML sitemap builder, sharding, image/video extensions
└── engine.ts            # Single entry-point unifying head() descriptors across routes
```

---

## 3. Calculation & Generation Logic

### 3.1 Canonical URL Generation (`canonical.ts`)
- Forces HTTPS protocol and the primary production origin (`https://www.sanatantools.com`).
- Eliminates duplicate trailing slashes while preserving root `/`.
- Strips advertising and analytics query parameters (`utm_*`, `gclid`, `fbclid`, `msclkid`, `ref`).
- Normalizes multilingual routing prefixes (`/hi/...`, `/sa/...`) with correct fallback to default language (`en`).

### 3.2 Schema.org JSON-LD Builders (`schema.ts`)
Generates valid `@graph` JSON-LD structures matching visible on-page content:
- **`WebSite`**: Includes search action query template.
- **`Organization`**: Brand name, official logo, social links, contact info.
- **`SoftwareApplication`**: Utility category, operating system (`Any`), pricing offer (`0 INR`), ratings.
- **`BreadcrumbList`**: Accurate position ordering with absolute URLs.
- **`FAQPage`**: Dynamic Question/Answer pairs.
- **`HowTo`**: Step-by-step instructions for Vedic calculators and ritual tools.
- **`Article` / `BlogPosting`**: Publisher, author, publication date, modification date.

### 3.3 Dynamic Robots & Crawl Control (`robots.ts`)
- Welcomes search engines (`Googlebot`, `Bingbot`, `Applebot`).
- Permits ethical AI agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`).
- Disallows private, authenticated, administrative, API, and user routes (`/auth/`, `/dashboard/`, `/admin/`, `/api/`, `/billing/`, `/profile/`, `/settings/`, `/saved-mantras/`, `/my-kundlis/`, `/family/`, `/downloads/`, `/horoscope-history/`).
- Blocks unauthorized aggressive scrapers (`CCBot`, `Bytespider`, `Timpibot`).

---

## 4. Performance & Core Web Vitals Optimization

1. **Font Optimization**: Preconnect to Google Fonts domains with `crossorigin="anonymous"` and font-display swap.
2. **Code Splitting**: Route components and calculation modules (ephemeris, jspdf, recharts) are lazily loaded on demand to prevent main-thread blocking.
3. **Caching Headers**: XML responses (sitemaps) are cached with `public, max-age=3600` headers.
4. **Hydration Integrity**: Dynamic script execution for theme preferences runs before render to prevent Cumulative Layout Shift (CLS).

---

## 5. Automated Verification & Testing

The SEO subsystem is verified through automated unit tests:
- `src/lib/seo/__tests__/schema.test.ts`: Validates schema output format and absolute URL transformation.
- `scripts/generate-clean-sitemap.js`: Builds clean 300+ URL `public/sitemap.xml` and `public/robots.txt`.
