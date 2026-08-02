/** Phase 14.7 — llms-full.txt: the exhaustive AI-readable site index. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildLlmsFullTxt } from "@/lib/seo/llms";
import { originFromRequest } from "@/lib/seo/sitemap";
import { listBlogSitemapRows } from "@/lib/blog-public.functions";
import { listFestivalSlugs } from "@/lib/festivals-public.functions";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);

        const [articles, fests] = await Promise.all([
          listBlogSitemapRows()
            .then((rows) => rows.map((r) => ({ slug: r.slug, title: r.title, summary: r.excerpt })))
            .catch(() => []),
          listFestivalSlugs()
            .then(({ rows }) =>
              (rows as { slug: string }[]).map((r) => ({
                slug: r.slug,
                name: r.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                date: null,
              })),
            )
            .catch(() => []),
        ]);

        const body = buildLlmsFullTxt({ articles, festivals: fests }, origin);
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
