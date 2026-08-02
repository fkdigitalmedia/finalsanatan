/**
 * Phase 14.7 — dynamic robots.txt.
 * Rendered by the SEO engine; the admin panel can override any part via
 * the `seo.robots` setting (groups, sitemaps, extra lines, block-all).
 */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildRobotsTxt, type RobotsConfig } from "@/lib/seo/robots";
import { readSeoSetting } from "@/lib/seo/settings.server";
import { originFromRequest } from "@/lib/seo/sitemap";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        const override = await readSeoSetting<Partial<RobotsConfig>>("seo.robots");
        return new Response(buildRobotsTxt(override, origin), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
