// POST /api/planets — 9 grahas with house placement + dignity
import { createFileRoute } from "@tanstack/react-router";
import { generateKundli } from "@/lib/kundli";
import { parseBirth } from "./kundli/_shared";

export const Route = createFileRoute("/api/planets")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const p = parseBirth(body);
        if (!p.ok) return Response.json({ error: p.error }, { status: 400 });

        const k = generateKundli(p.data);
        return Response.json({ ok: true, planets: k.d1.planets });
      },
    },
  },
});
