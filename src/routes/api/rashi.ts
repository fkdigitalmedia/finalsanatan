// POST /api/rashi — Moon Sign + Sun Sign
import { createFileRoute } from "@tanstack/react-router";
import { toUtcDate } from "@/lib/kundli/time";
import { nineGrahas } from "@/lib/kundli/planets";
import { rashiName } from "@/lib/kundli/strength";
import { parseBirth } from "./kundli/_shared";

export const Route = createFileRoute("/api/rashi")({
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

        const utc = toUtcDate(p.data.date, p.data.time, p.data.timezone);
        const grahas = nineGrahas(utc);
        const moon = grahas.find((g) => g.graha === "Moon")!;
        const sun = grahas.find((g) => g.graha === "Sun")!;
        return Response.json({
          ok: true,
          moon: {
            sidereal: moon.sidereal,
            rashiIndex: Math.floor(moon.sidereal / 30),
            rashi: rashiName(Math.floor(moon.sidereal / 30)),
          },
          sun: {
            sidereal: sun.sidereal,
            rashiIndex: Math.floor(sun.sidereal / 30),
            rashi: rashiName(Math.floor(sun.sidereal / 30)),
          },
        });
      },
    },
  },
});
