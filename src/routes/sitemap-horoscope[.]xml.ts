/** Phase 14.7 — horoscope hubs and all 48 rashi/period pages. */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectHoroscopes, originFromRequest, renderUrlset, xmlResponse } from "@/lib/seo/sitemap";

export const Route = createFileRoute("/sitemap-horoscope.xml")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        xmlResponse(renderUrlset(collectHoroscopes(), { origin: originFromRequest(request) })),
    },
  },
});
