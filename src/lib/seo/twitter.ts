// ============================================================
// Phase 14.7 — Twitter / X card builder.
// ============================================================

import { TWITTER_SITE, TWITTER_CREATOR, DEFAULT_OG_IMAGE, SITE_URL } from "./constants";
import { absoluteUrl, type MetaTag } from "./opengraph";

export interface TwitterInput {
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string;
  creator?: string;
  /** Force a card type; otherwise a large image card is used when an image exists. */
  card?: "summary" | "summary_large_image";
}

export function twitterTags(input: TwitterInput, origin = SITE_URL): MetaTag[] {
  const image = absoluteUrl(input.image ?? DEFAULT_OG_IMAGE, origin);
  const card = input.card ?? (image ? "summary_large_image" : "summary");
  const tags: MetaTag[] = [
    { name: "twitter:card", content: card },
    { name: "twitter:site", content: TWITTER_SITE },
    { name: "twitter:creator", content: input.creator ?? TWITTER_CREATOR },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
  ];
  if (image) {
    tags.push({ name: "twitter:image", content: image });
    tags.push({ name: "twitter:image:alt", content: input.imageAlt ?? input.title });
  }
  return tags;
}
