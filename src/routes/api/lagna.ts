// POST /api/lagna — ascendant only
import { createFileRoute } from "@tanstack/react-router";
import { computeAscendant } from "@/lib/kundli/ascendant";
import { toUtcDate } from "@/lib/kundli/time";
import { rashiName } from "@/lib/kundli/strength";
import { parseBirth } from "./kundli/_shared";

export const Route = createFileRoute("/api/lagna")({
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
        const asc = computeAscendant(utc, p.data.latitude, p.data.longitude);
        const rashiIndex = Math.floor(asc.longitudeSidereal / 30);
        return Response.json({
          ok: true,
          lagna: {
            ...asc,
            rashiIndex,
            rashi: rashiName(rashiIndex),
            degreesInRashi: asc.longitudeSidereal - rashiIndex * 30,
          },
        });
      },
    },
  },
});
