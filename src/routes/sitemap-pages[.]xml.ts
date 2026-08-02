/** Phase 14.7 — static pages, categories, legal and programmatic entity pages. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectPages, originFromRequest, renderUrlset, xmlResponse } from "@/lib/seo/sitemap";

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        xmlResponse(renderUrlset(collectPages(), { origin: originFromRequest(request) })),
    },
  },
});
