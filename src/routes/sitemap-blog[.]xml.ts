/** Phase 14.7 — published blog articles. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectBlog, originFromRequest, renderUrlset, xmlResponse } from "@/lib/seo/sitemap";
import { listBlogSitemapRows } from "@/lib/blog-public.functions";

export const Route = createFileRoute("/sitemap-blog.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        let rows: Awaited<ReturnType<typeof listBlogSitemapRows>> = [];
        try {
          rows = await listBlogSitemapRows();
        } catch {
          /* blog unavailable — emit an empty but valid sitemap */
        }
        return xmlResponse(renderUrlset(collectBlog(rows), { origin }));
      },
    },
  },
});
