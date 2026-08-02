# Enterprise SEO Engine (Phase 14.7)

Everything under `src/lib/seo/` is data-driven: add a tool, festival, blog
post or registry entity and its metadata, schema, canonical, hreflang,
breadcrumbs, internal links, FAQs and sitemap entries are generated
automatically — no per-page SEO code.

## Modules

| File                          | Responsibility                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constants.ts`                | Site identity, crawler lists, languages, per-page-type defaults                                                                                                                                                              |
| `engine.ts`                   | `buildSeo()` / `seoHead()` — the single entry point for a page                                                                                                                                                               |
| `metadata.ts`                 | Title, description, keywords, robots (length-clamped)                                                                                                                                                                        |
| `schema.ts`                   | JSON-LD builders (Organization, WebSite, WebPage, SoftwareApplication, FAQPage, HowTo, BreadcrumbList, Article, BlogPosting, CollectionPage, ItemList, Product, Offer, Review, AggregateRating, Person, Event, SearchAction) |
| `canonical.ts`                | Canonical URLs, tracking-param stripping, pagination, filters                                                                                                                                                                |
| `hreflang.ts`                 | Alternates for every enabled language + `x-default`                                                                                                                                                                          |
| `opengraph.ts` / `twitter.ts` | Social cards                                                                                                                                                                                                                 |
| `breadcrumbs.ts`              | Trails derived from the tool/category registries                                                                                                                                                                             |
| `faq.ts`                      | FAQs per page type and slug                                                                                                                                                                                                  |
| `internal-links.ts`           | Related tools/blogs/festivals/horoscope/panchang, popular, latest, trending                                                                                                                                                  |
| `slug.ts`                     | Slugify with Indic transliteration, dedupe, rename→redirect suggestions                                                                                                                                                      |
| `redirects.ts`                | 301/302/307/308/410 matching, chain resolution, CSV import/export, validation                                                                                                                                                |
| `robots.ts`                   | robots.txt generation with admin overrides                                                                                                                                                                                   |
| `llms.ts`                     | `llms.txt` and `llms-full.txt` for AI answer engines                                                                                                                                                                         |
| `sitemap.ts`                  | Collectors + renderers for urlset, index, image, news, video                                                                                                                                                                 |
| `quality.ts`                  | Page audit: title/description length, headings, alt text, links, density, readability, thin content                                                                                                                          |
| `validator.ts`                | Schema + metadata validation and duplicate detection                                                                                                                                                                         |
| `cache.ts`                    | TTL memoisation for metadata, schema and settings                                                                                                                                                                            |
| `settings.server.ts`          | Server-only reader for admin-editable `seo.*` settings                                                                                                                                                                       |

## Usage in a route

```tsx
export const Route = createFileRoute("/tools/$slug")({
  head: ({ params }) =>
    seoHead({ type: "tool", path: `/tools/${params.slug}`, slug: params.slug, title }),
});
```

`buildSeo()` returns the same payload plus `breadcrumbs`, `faqs` and `links`
so the page body can render what the head advertises.

## Endpoints

- `/sitemap.xml` — index of every shard
- `/sitemap-pages.xml`, `-tools`, `-blog`, `-festivals`, `-horoscope`,
  `-images`, `-news`, `-video`
- `/robots.txt` — dynamic, overridable via the `seo.robots` setting
- `/llms.txt`, `/llms-full.txt`

## Programmatic SEO

`src/config/seo-entities.ts` holds the entity families (nakshatra, rashi,
yoga, dosha, muhurat, numerology, vastu). Each family is served by
`/{family}` and `/{family}/$slug` through the shared
`EntityLanding` components; adding an item to the registry publishes a new
indexed landing page with links, FAQs and schema.

## Admin settings

`site_settings` keys read by the engine: `seo.robots` (robots override) and
`seo.videos` (video sitemap rows).
