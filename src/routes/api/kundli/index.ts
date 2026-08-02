// POST /api/kundli — full natal chart
import { createFileRoute } from "@tanstack/react-router";
import { generateKundli } from "@/lib/kundli";
import { parseBirth } from "./_shared";

export const Route = createFileRoute("/api/kundli/")({
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

        try {
          const result = generateKundli(p.data);
          return Response.json({ ok: true, kundli: result });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "compute error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
