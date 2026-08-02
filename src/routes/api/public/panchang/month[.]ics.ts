// Downloadable month panchang ICS.
// Query: ?year=2026&month=8&lat=28.61&lon=77.21&tz=Asia/Kolkata&label=Delhi
import { createFileRoute } from "@tanstack/react-router";
import { getMonthCells, buildMonthPanchangIcs } from "@/lib/panchang-month";
import type { LatLon } from "@/lib/panchang";

export const Route = createFileRoute("/api/public/panchang/month.ics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const u = new URL(request.url);
        const now = new Date();
        const year = Number(u.searchParams.get("year") ?? now.getUTCFullYear());
        const month = Math.max(
          1,
          Math.min(12, Number(u.searchParams.get("month") ?? now.getUTCMonth() + 1)),
        );
        const lat = Number(u.searchParams.get("lat") ?? 28.6139);
        const lon = Number(u.searchParams.get("lon") ?? 77.209);
        const tz = u.searchParams.get("tz") ?? "Asia/Kolkata";
        const label = u.searchParams.get("label") ?? "New Delhi, India";
        const loc: LatLon = { lat, lon, tz, label };
        const cells = getMonthCells(year, month - 1, loc);
        const ics = buildMonthPanchangIcs(cells, loc, u.origin);
        return new Response(ics, {
          status: 200,
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="panchang-${year}-${String(month).padStart(2, "0")}.ics"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
