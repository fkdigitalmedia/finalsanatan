// ============================================================
// Phase 14.6 — Schema.org builders for the public website.
// Pure functions: every route composes the graph it needs and
// drops it into `head().scripts`.
// ============================================================

export type Json = Record<string, unknown>;

export const SITE_NAME = "SanatanTools";
export const SITE_URL = "https://dharma-divine-tools.lovable.app";

export function abs(path: string, origin: string = SITE_URL): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function websiteSchema(origin = SITE_URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: origin,
    potentialAction: {
      "@type": "SearchAction",
      target: `${origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema(origin = SITE_URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: origin,
    logo: abs("/favicon.ico", origin),
  };
}

export function webPageSchema(input: {
  name: string;
  description: string;
  path: string;
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: abs(input.path, origin),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], origin = SITE_URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path, origin),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function howToSchema(input: { name: string; steps: string[]; description?: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    step: input.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
  };
}

export function itemListSchema(items: { name: string; path: string }[], origin = SITE_URL): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: abs(item.path, origin),
    })),
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: abs(input.path, origin),
    mainEntity: itemListSchema(input.items, origin),
  };
}

export function articleSchema(input: {
  type?: "Article" | "BlogPosting";
  headline: string;
  description?: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "Article",
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    mainEntityOfPage: abs(input.path, origin),
    ...(input.image ? { image: abs(input.image, origin) } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: { "@type": "Organization", name: input.author ?? SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function softwareApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
  category?: string;
  price?: number;
  currency?: string;
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: abs(input.path, origin),
    applicationCategory: input.category ?? "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: String(input.price ?? 0),
      priceCurrency: input.currency ?? "INR",
    },
  };
}

/** Wrap several schemas into one @graph script payload. */
export function graph(...nodes: Json[]): Json {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.map((n) => {
      const { "@context": _ctx, ...rest } = n as Json & { "@context"?: string };
      return rest;
    }),
  };
}

/** Convenience for route `head().scripts`. */
export function ldJson(payload: Json) {
  return { type: "application/ld+json", children: JSON.stringify(payload) };
}

// ============================================================
// Phase 14.7 additions — the remaining schema.org types the engine
// emits automatically. All builders return plain objects so `graph()`
// can merge them into a single @graph script.
// ============================================================

export function productSchema(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: string;
  rating?: { value: number; count: number };
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: abs(input.path, origin),
    ...(input.image ? { image: abs(input.image, origin) } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: offerSchema({
      price: input.price ?? 0,
      currency: input.currency,
      path: input.path,
      availability: input.availability,
      origin,
    }),
    ...(input.rating ? { aggregateRating: aggregateRatingSchema(input.rating) } : {}),
  };
}

export function offerSchema(input: {
  price: number;
  currency?: string;
  path: string;
  availability?: string;
  validUntil?: string;
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@type": "Offer",
    price: String(input.price),
    priceCurrency: input.currency ?? "INR",
    url: abs(input.path, origin),
    availability: `https://schema.org/${input.availability ?? "InStock"}`,
    ...(input.validUntil ? { priceValidUntil: input.validUntil } : {}),
  };
}

export function aggregateRatingSchema(input: { value: number; count: number }): Json {
  return {
    "@type": "AggregateRating",
    ratingValue: String(input.value),
    reviewCount: String(input.count),
    bestRating: "5",
    worstRating: "1",
  };
}

export function reviewSchema(input: {
  itemName: string;
  author: string;
  rating: number;
  body: string;
  datePublished?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Thing", name: input.itemName },
    author: { "@type": "Person", name: input.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(input.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: input.body,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
  };
}

export function personSchema(input: {
  name: string;
  path?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    ...(input.path ? { url: abs(input.path, origin) } : {}),
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: abs(input.image, origin) } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    worksFor: { "@type": "Organization", name: SITE_NAME },
  };
}

export function eventSchema(input: {
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
  path: string;
  image?: string;
  locationName?: string;
  origin?: string;
}): Json {
  const origin = input.origin ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    startDate: input.startDate,
    ...(input.endDate ? { endDate: input.endDate } : {}),
    ...(input.description ? { description: input.description } : {}),
    url: abs(input.path, origin),
    ...(input.image ? { image: abs(input.image, origin) } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: input.locationName
      ? { "@type": "Place", name: input.locationName }
      : { "@type": "VirtualLocation", url: abs(input.path, origin) },
    organizer: { "@type": "Organization", name: SITE_NAME, url: origin },
  };
}

/** Sitelinks search box — attached to the WebSite node. */
export function searchActionSchema(origin = SITE_URL): Json {
  return {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${origin}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  };
}
