// POST /api/nakshatra — birth nakshatra + pada + lord
import { createFileRoute } from "@tanstack/react-router";
import { toUtcDate } from "@/lib/kundli/time";
import { nineGrahas } from "@/lib/kundli/planets";
import { NAKSHATRAS } from "@/lib/kundli/types";
import { NAKSHATRA_LORDS } from "@/lib/kundli/strength";
import { parseBirth } from "./kundli/_shared";

export const Route = createFileRoute("/api/nakshatra")({
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
        const moon = nineGrahas(utc).find((g) => g.graha === "Moon")!;
        const nakSpan = 360 / 27;
        const idx = Math.floor(moon.sidereal / nakSpan);
        const within = moon.sidereal - idx * nakSpan;
        const pada = Math.floor((within / nakSpan) * 4) + 1;
        return Response.json({
          ok: true,
          nakshatra: {
            index: idx,
            name: NAKSHATRAS[idx],
            pada,
            lord: NAKSHATRA_LORDS[idx],
            moonSidereal: moon.sidereal,
          },
        });
      },
    },
  },
});
