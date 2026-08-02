/** Phase 14.7 — festival landing pages. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { originFromRequest, renderUrlset, xmlResponse, type SitemapEntry } from "@/lib/seo/sitemap";
import { listFestivalSlugs } from "@/lib/festivals-public.functions";

export const Route = createFileRoute("/sitemap-festivals.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        let entries: SitemapEntry[] = [
          { path: "/festivals", changefreq: "daily", priority: "0.8" },
        ];
        try {
          const { rows } = await listFestivalSlugs();
          entries = entries.concat(
            (rows as { slug: string; updated_at?: string | null }[]).map((r) => ({
              path: `/festivals/${r.slug}`,
              lastmod: r.updated_at ?? undefined,
              changefreq: "weekly" as const,
              priority: "0.7",
            })),
          );
        } catch {
          /* festivals unavailable — still emit a valid sitemap */
        }
        return xmlResponse(renderUrlset(entries, { origin }));
      },
    },
  },
});
