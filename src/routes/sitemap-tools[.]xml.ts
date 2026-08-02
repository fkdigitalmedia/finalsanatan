/** Phase 14.7 — every live tool page. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectTools, originFromRequest, renderUrlset, xmlResponse } from "@/lib/seo/sitemap";

export const Route = createFileRoute("/sitemap-tools.xml")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        xmlResponse(renderUrlset(collectTools(), { origin: originFromRequest(request) })),
    },
  },
});
