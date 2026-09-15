# Master SEO Article Engine v1.0

## 1. Overview
The **Master SEO Article Engine v1.0** powers enterprise-grade, topical authority content creation and programmatic editorial integration across SanatanTools. It bridges deep Sanatan knowledge bases with computational astrology tools, ensuring high search rankings, strong user engagement, and contextual conversions.

## 2. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│               Master SEO Article Engine                │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
 [Supabase Database]                 [Static Seeds]
 (admin_articles table)              (src/content/blog/seeds.ts)
         │                                   │
         └─────────────────┬─────────────────┘
                           ▼
             [Public Blog Data Layer]
             (src/lib/blog-public.functions.ts)
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
 [TanStack Router Pages]             [SEO Sitemaps & Feeds]
 (/blog/$slug, /blog)                (sitemap.xml, RSS, JSON-LD)
```

## 3. Key Components & Responsibilities

1. **`src/content/blog/seeds.ts`**:
   - Stores pre-rendered, high-authority cornerstone pillar articles.
   - Ensures 100% uptime and instant rendering during static site generation (SSG), server-side rendering (SSR), and development without external database latency.

2. **`src/lib/blog-public.functions.ts`**:
   - Server functions for querying published articles (`getBlogPost`, `listBlogPosts`, `listBlogCategories`, `listBlogSlugs`, `listBlogSitemapRows`).
   - Merges database articles and local seeds with deduplication by slug.

3. **`src/routes/blog.$slug.tsx`**:
   - Dynamic route rendering the article with SEO metadata, Open Graph tags, JSON-LD `BlogPosting` and `BreadcrumbList` schemas.
   - Powered by `react-markdown` and `remark-gfm` for tables, callouts, and mathematical notations.

## 4. Editorial & Content Guidelines

- **Zero Superstition & Fear-Mongering**: Articles present classical Vedic astrology with psychological and philosophical nuance.
- **Accurate Sanskrit Transliteration**: Proper Devanagari and IAST terms for Bhavas, Grahas, Rashis, and Yogas.
- **High-Converting Tool Integration**: Natural internal links and interactive prompts directing users to calculation engines (Kundli, Dasha, Panchang, Nakshatra, Yoga).

## 5. APIs and Types

```typescript
export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  featured_image: string | null;
  published_at: string | null;
  lang: string;
}

export interface BlogPost extends BlogPostSummary {
  content_md: string;
  updated_at: string;
  seo: Record<string, string | number | boolean | null> | null;
}
```

## 6. Verification & Testing

- Sitemaps validate inclusion of `/blog/understanding-your-janam-kundli`.
- Route loader retrieves the post correctly and produces valid metadata and structured data.
