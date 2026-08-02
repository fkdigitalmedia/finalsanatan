/** Phase 14.7 — image sitemap (article cover images + festival artwork). */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectImages, originFromRequest, renderUrlset, xmlResponse } from "@/lib/seo/sitemap";
import { listBlogSitemapRows } from "@/lib/blog-public.functions";

export const Route = createFileRoute("/sitemap-images.xml")({
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
        const items = rows
          .filter((r) => !!r.featured_image)
          .map((r) => ({
            path: `/blog/${r.slug}`,
            image: /^https?:\/\//.test(r.featured_image as string)
              ? (r.featured_image as string)
              : `${origin}${r.featured_image}`,
            title: r.title,
            caption: r.excerpt ?? undefined,
          }));
        return xmlResponse(renderUrlset(collectImages(items), { origin, multilingual: false }));
      },
    },
  },
});
