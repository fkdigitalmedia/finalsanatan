/** Phase 14.7 — Google News sitemap (articles published in the last 48h). */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectNews, originFromRequest, renderUrlset, xmlResponse } from "@/lib/seo/sitemap";
import { listBlogSitemapRows } from "@/lib/blog-public.functions";

export const Route = createFileRoute("/sitemap-news.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        let rows: Awaited<ReturnType<typeof listBlogSitemapRows>> = [];
        try {
          rows = await listBlogSitemapRows();
        } catch {
          /* ignore */
        }
        return xmlResponse(renderUrlset(collectNews(rows), { origin, multilingual: false }), 900);
      },
    },
  },
});
