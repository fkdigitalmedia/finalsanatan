// ============================================================
// Phase 14.7 — OpenGraph builder.
// ============================================================

import { SITE_NAME, DEFAULT_OG_IMAGE, SITE_URL } from "./constants";
import { ogLocaleOf } from "./hreflang";
import { ENABLED_LANGUAGES } from "./constants";

export interface OgInput {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string | null;
  imageAlt?: string;
  lang?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

function absolute(url: string, origin = SITE_URL): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${origin.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

/** All `og:*` meta tags for a page. */
export function openGraphTags(input: OgInput, origin = SITE_URL): MetaTag[] {
  const image = absolute(input.image ?? DEFAULT_OG_IMAGE, origin);
  const tags: MetaTag[] = [
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: input.url },
    { property: "og:locale", content: ogLocaleOf(input.lang ?? "en") },
  ];

  for (const l of ENABLED_LANGUAGES) {
    if (l.code === (input.lang ?? "en")) continue;
    tags.push({ property: "og:locale:alternate", content: ogLocaleOf(l.code) });
  }

  if (image) {
    tags.push(
      { property: "og:image", content: image },
      { property: "og:image:alt", content: input.imageAlt ?? input.title },
    );
  }
  if (input.publishedTime)
    tags.push({ property: "article:published_time", content: input.publishedTime });
  if (input.modifiedTime)
    tags.push({ property: "article:modified_time", content: input.modifiedTime });
  if (input.author) tags.push({ property: "article:author", content: input.author });
  if (input.section) tags.push({ property: "article:section", content: input.section });
  for (const t of input.tags ?? []) tags.push({ property: "article:tag", content: t });

  return tags;
}

export { absolute as absoluteUrl };
