/**
 * Phase 14.7 — Sitemap index.
 * /sitemap.xml now points crawlers at the per-type shards, each of which
 * is generated from the registries by src/lib/seo/sitemap.ts.
 */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { originFromRequest, renderSitemapIndex, xmlResponse } from "@/lib/seo/sitemap";

const SHARDS = [
  "/sitemap-pages.xml",
  "/sitemap-tools.xml",
  "/sitemap-blog.xml",
  "/sitemap-festivals.xml",
  "/sitemap-horoscope.xml",
  "/sitemap-images.xml",
  "/sitemap-news.xml",
  "/sitemap-video.xml",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        return xmlResponse(
          renderSitemapIndex(
            SHARDS.map((path) => ({ path })),
            origin,
          ),
        );
      },
    },
  },
});
