/** Phase 14.7 — llms.txt for AI answer engines. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildLlmsTxt } from "@/lib/seo/llms";
import { originFromRequest } from "@/lib/seo/sitemap";
import { listFestivalSlugs } from "@/lib/festivals-public.functions";

async function festivals() {
  try {
    const { rows } = await listFestivalSlugs();
    return (rows as { slug: string; updated_at?: string | null }[]).slice(0, 30).map((r) => ({
      slug: r.slug,
      name: r.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      date: null,
    }));
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        const body = buildLlmsTxt({ festivals: await festivals() }, origin);
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
