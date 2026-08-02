// Cron endpoint — sends a daily panchang notification into the in-app notifications
// table for every user with notifications_enabled + a bookmarked city.
// Trigger via pg_cron POSTing here once per day.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  getTithi,
  getNakshatra,
  getKaalWindow,
  getSunTimes,
  fmtTime,
  type LatLon,
} from "@/lib/panchang";
import { getPlanYourDayTip } from "@/lib/panchang-month";

function serviceClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const Route = createFileRoute("/api/public/hooks/daily-panchang-notify")({
  server: {
    handlers: {
      POST: async () => {
        const supa = serviceClient();
        // Users who opted-in.
        const { data: settings, error: sErr } = await supa
          .from("user_settings")
          .select("user_id, notifications_enabled")
          .eq("notifications_enabled", true);
        if (sErr) return new Response(sErr.message, { status: 500 });
        if (!settings?.length) return Response.json({ processed: 0 });

        const userIds = settings.map((s) => s.user_id);
        // Bookmarked cities per user (first bookmark used).
        const { data: favs } = await supa
          .from("favorites")
          .select("user_id, title, metadata, created_at")
          .in("user_id", userIds)
          .eq("item_type", "city")
          .order("created_at", { ascending: false });

        const firstCity = new Map<string, LatLon>();
        for (const f of favs ?? []) {
          if (firstCity.has(f.user_id as string)) continue;
          const m: any = f.metadata ?? {};
          if (typeof m.lat === "number" && typeof m.lon === "number") {
            firstCity.set(f.user_id as string, {
              lat: m.lat,
              lon: m.lon,
              tz: m.tz ?? "Asia/Kolkata",
              label: (f.title as string) ?? "",
            });
          }
        }

        const now = new Date();
        const inserts: any[] = [];
        for (const s of settings) {
          const loc = firstCity.get(s.user_id as string) ?? {
            lat: 28.6139,
            lon: 77.209,
            tz: "Asia/Kolkata",
            label: "New Delhi, India",
          };
          const t = getTithi(now);
          const n = getNakshatra(now);
          const sun = getSunTimes(now, loc);
          const rahu = getKaalWindow("rahu", now, loc);
          const tip = getPlanYourDayTip(now, loc);
          const body = [
            `${t.paksha} ${t.name} · ${n.name}`,
            sun.sunrise ? `Sunrise ${fmtTime(sun.sunrise, loc.tz)}` : "",
            rahu ? `Rahu Kaal ${fmtTime(rahu.start, loc.tz)}–${fmtTime(rahu.end, loc.tz)}` : "",
            tip.focus,
          ]
            .filter(Boolean)
            .join(" · ");
          inserts.push({
            user_id: s.user_id,
            title: `Today's Panchang — ${loc.label.split(",")[0]}`,
            body,
            link: "/tools/todays-panchang",
            category: "panchang",
            read: false,
          });
        }
        if (inserts.length) {
          const { error } = await supa.from("notifications").insert(inserts);
          if (error) return new Response(error.message, { status: 500 });
        }
        return Response.json({ processed: inserts.length });
      },
    },
  },
});
