/**
 * Full festivals calendar subscription: /api/public/festivals/calendar.ics
 * Optional query: ?category=vrat, ?year=2026
 */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { buildMultiFestivalIcs, type FestivalIcsInput } from "@/lib/festivals/ics";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const Route = createFileRoute("/api/public/festivals/calendar.ics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const category = url.searchParams.get("category") ?? "";
        const yearFilter = url.searchParams.get("year");
        const supa = publicClient();

        let q = supa
          .from("admin_festivals")
          .select("id, slug, name, short_description, category, duration_days")
          .eq("status", "published")
          .limit(500);
        if (category) q = q.eq("category", category);
        const { data: rows, error } = await q;
        if (error) return new Response(error.message, { status: 500 });

        const ids = (rows ?? []).map((r: any) => r.id);
        if (ids.length === 0) {
          return new Response(
            "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SanatanTools//Festivals//EN\r\nEND:VCALENDAR",
            {
              headers: { "Content-Type": "text/calendar; charset=utf-8" },
            },
          );
        }

        let cq = supa
          .from("festival_date_cache")
          .select("festival_id, year, occurrences")
          .in("festival_id", ids);
        if (yearFilter && /^\d{4}$/.test(yearFilter)) cq = cq.eq("year", Number(yearFilter));
        const { data: cache } = await cq;

        const byId = new Map<string, FestivalIcsInput>();
        for (const r of rows ?? []) {
          byId.set((r as any).id, {
            slug: (r as any).slug,
            name: (r as any).name,
            description: (r as any).short_description,
            category: (r as any).category,
            duration_days: (r as any).duration_days,
            siteOrigin: url.origin,
            occurrences: [],
          });
        }
        for (const c of cache ?? []) {
          const entry = byId.get((c as any).festival_id);
          if (!entry) continue;
          const dates = ((c as any).occurrences?.dates ?? []) as {
            isoDate: string;
            name?: string;
          }[];
          for (const d of dates)
            if (d?.isoDate) entry.occurrences.push({ isoDate: d.isoDate, label: d.name });
        }

        const ics = buildMultiFestivalIcs(
          url.origin,
          Array.from(byId.values()).filter((f) => f.occurrences.length),
        );
        return new Response(ics, {
          status: 200,
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="sanatantools-festivals.ics"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
