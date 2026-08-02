// ============================================================
// Phase 14.7 — SEO Engine.
// The single entry point every route uses. Give it a page descriptor
// and it returns everything a TanStack `head()` needs plus the
// breadcrumb/FAQ/internal-link payload the page body renders.
//
//   export const Route = createFileRoute("/tools/$slug")({
//     head: ({ params }) => seoHead(toolDescriptor(params.slug)),
//   });
//
// No route ever hand-writes a title, canonical, OG tag or JSON-LD again.
// ============================================================

import { SITE_URL, SITE_NAME, PAGE_TYPE_DEFAULTS, type PageType } from "./constants";
import { buildMetadata, type Metadata } from "./metadata";
import { canonicalUrl, paginationLinks, type CanonicalOptions } from "./canonical";
import { hreflangLinks } from "./hreflang";
import { openGraphTags, type MetaTag } from "./opengraph";
import { twitterTags } from "./twitter";
import { breadcrumbsFor, type Crumb } from "./breadcrumbs";
import { faqsFor, type Faq } from "./faq";
import { internalLinks, type LinkBlock, type LinkContext } from "./internal-links";
import {
  graph,
  ldJson,
  websiteSchema,
  organizationSchema,
  webPageSchema,
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  softwareApplicationSchema,
  collectionPageSchema,
  itemListSchema,
  howToSchema,
  productSchema,
  eventSchema,
  personSchema,
  type Json,
} from "./schema";

export interface PageDescriptor {
  type: PageType;
  path: string;
  title: string;
  description?: string;
  keywords?: string[];
  slug?: string;
  category?: string;
  tags?: string[];
  lang?: string;
  image?: string | null;
  imageAlt?: string;
  /** Content dates — drive Article schema and sitemap lastmod. */
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  noindex?: boolean;
  nofollow?: boolean;
  bareTitle?: boolean;
  /** Collections: the items listed on the page (ItemList / CollectionPage). */
  items?: { name: string; path: string }[];
  /** Step-by-step content → HowTo schema. */
  steps?: string[];
  /** Priced offering → Product + Offer schema. */
  price?: { amount: number; currency?: string };
  rating?: { value: number; count: number };
  /** Festival / event pages. */
  event?: { startDate: string; endDate?: string; locationName?: string };
  /** Author pages. */
  person?: { name: string; jobTitle?: string; sameAs?: string[] };
  /** Page-specific FAQs; derived ones are appended automatically. */
  faqs?: Faq[];
  /** Extra internal-link candidates (blog posts, festivals fetched at runtime). */
  linkCandidates?: LinkContext["candidates"];
  /** Pagination + filter handling for the canonical. */
  page?: number;
  totalPages?: number;
  search?: CanonicalOptions["search"];
  keepParams?: string[];
  /** Origin override (SSR request host); defaults to the production URL. */
  origin?: string;
  /** Skip site-wide WebSite/Organization nodes (already on the root). */
  skipSiteSchema?: boolean;
}

export interface SeoResult {
  metadata: Metadata;
  canonical: string;
  breadcrumbs: Crumb[];
  faqs: Faq[];
  links: LinkBlock[];
  schema: Json;
  meta: MetaTag[];
  headLinks: { rel: string; href: string; hrefLang?: string }[];
  scripts: { type: string; children: string }[];
}

/** Schema nodes appropriate to the descriptor's page type. */
function schemaFor(d: PageDescriptor, meta: Metadata, canonical: string, faqs: Faq[]): Json[] {
  const origin = d.origin ?? SITE_URL;
  const nodes: Json[] = [];

  if (!d.skipSiteSchema) nodes.push(websiteSchema(origin), organizationSchema(origin));

  nodes.push(
    webPageSchema({ name: meta.title, description: meta.description, path: d.path, origin }),
  );

  const crumbs = breadcrumbsFor(d.path, { leaf: d.title });
  if (crumbs.length > 1) nodes.push(breadcrumbSchema(crumbs, origin));

  switch (d.type) {
    case "tool":
      nodes.push(
        softwareApplicationSchema({
          name: d.title,
          description: meta.description,
          path: d.path,
          category: "UtilitiesApplication",
          price: d.price?.amount ?? 0,
          currency: d.price?.currency,
          origin,
        }),
      );
      break;
    case "blog":
    case "report":
      nodes.push(
        articleSchema({
          type: d.type === "blog" ? "BlogPosting" : "Article",
          headline: d.title,
          description: meta.description,
          path: d.path,
          image: d.image ?? undefined,
          datePublished: d.publishedAt,
          dateModified: d.updatedAt ?? d.publishedAt,
          author: d.author,
          origin,
        }),
      );
      break;
    case "festival":
      if (d.event) {
        nodes.push(
          eventSchema({
            name: d.title,
            description: meta.description,
            path: d.path,
            image: d.image ?? undefined,
            startDate: d.event.startDate,
            endDate: d.event.endDate,
            locationName: d.event.locationName,
            origin,
          }),
        );
      }
      nodes.push(
        articleSchema({
          headline: d.title,
          description: meta.description,
          path: d.path,
          datePublished: d.publishedAt,
          dateModified: d.updatedAt,
          origin,
        }),
      );
      break;
    case "horoscope":
      nodes.push(
        articleSchema({
          headline: d.title,
          description: meta.description,
          path: d.path,
          datePublished: d.publishedAt,
          dateModified: d.updatedAt ?? new Date().toISOString().slice(0, 10),
          origin,
        }),
      );
      break;
    case "author":
      if (d.person) nodes.push(personSchema({ ...d.person, path: d.path, origin }));
      break;
    case "category":
    case "landing":
    case "homepage":
      if (d.items?.length) {
        nodes.push(
          collectionPageSchema({
            name: meta.title,
            description: meta.description,
            path: d.path,
            items: d.items,
            origin,
          }),
        );
      }
      break;
    default:
      if (d.items?.length) nodes.push(itemListSchema(d.items, origin));
  }

  if (d.steps?.length) {
    nodes.push(howToSchema({ name: d.title, description: meta.description, steps: d.steps }));
  }
  if (d.price) {
    nodes.push(
      productSchema({
        name: d.title,
        description: meta.description,
        path: d.path,
        price: d.price.amount,
        currency: d.price.currency,
        rating: d.rating,
        origin,
      }),
    );
  }
  if (faqs.length) nodes.push(faqSchema(faqs));

  void canonical;
  return nodes;
}

/** Full SEO payload for a page. */
export function buildSeo(d: PageDescriptor): SeoResult {
  const origin = d.origin ?? SITE_URL;
  const metadata = buildMetadata({
    type: d.type,
    path: d.path,
    title: d.title,
    description: d.description,
    keywords: d.keywords,
    bareTitle: d.bareTitle,
    noindex: d.noindex,
    nofollow: d.nofollow,
  });

  const canonical = canonicalUrl(d.path, {
    origin,
    lang: d.lang,
    page: d.page,
    search: d.search,
    keepParams: d.keepParams,
  });

  const faqs =
    d.faqs?.length || d.type === "tool" || d.type === "category"
      ? faqsFor({ type: d.type, slug: d.slug, extra: d.faqs })
      : (d.faqs ?? []);

  const links = internalLinks({
    type: d.type,
    path: d.path,
    slug: d.slug,
    category: d.category,
    tags: d.tags,
    candidates: d.linkCandidates,
  });

  const breadcrumbs = breadcrumbsFor(d.path, { leaf: d.title });
  const nodes = schemaFor(d, metadata, canonical, faqs);

  const meta: MetaTag[] = [
    { title: metadata.title } as unknown as MetaTag,
    { name: "description", content: metadata.description },
    { name: "robots", content: metadata.robots },
    ...(metadata.keywords.length
      ? [{ name: "keywords", content: metadata.keywords.join(", ") }]
      : []),
    ...openGraphTags(
      {
        title: metadata.title,
        description: metadata.description,
        url: canonical,
        type: PAGE_TYPE_DEFAULTS[d.type]?.ogType,
        image: d.image,
        imageAlt: d.imageAlt,
        lang: d.lang,
        publishedTime: d.publishedAt,
        modifiedTime: d.updatedAt,
        author: d.author,
        section: d.category,
        tags: d.tags,
      },
      origin,
    ),
    ...twitterTags(
      {
        title: metadata.title,
        description: metadata.description,
        image: d.image,
        imageAlt: d.imageAlt,
      },
      origin,
    ),
  ];

  const headLinks: SeoResult["headLinks"] = [
    { rel: "canonical", href: canonical },
    ...(metadata.indexable ? hreflangLinks(d.path, origin) : []),
    ...(d.page && d.totalPages
      ? paginationLinks(d.path, d.page, d.totalPages, {
          origin,
          search: d.search,
          keepParams: d.keepParams,
        })
      : []),
  ];

  return {
    metadata,
    canonical,
    breadcrumbs,
    faqs,
    links,
    schema: graph(...nodes),
    meta,
    headLinks,
    scripts: [ldJson(graph(...nodes))],
  };
}

/** Ready-to-spread return value for a TanStack route `head()`. */
export function seoHead(d: PageDescriptor) {
  const seo = buildSeo(d);
  return { meta: seo.meta, links: seo.headLinks, scripts: seo.scripts };
}

export { SITE_NAME, SITE_URL };
