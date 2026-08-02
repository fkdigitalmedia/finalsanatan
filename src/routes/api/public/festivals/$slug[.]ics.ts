/**
 * Per-festival ICS download: /api/public/festivals/{slug}.ics
 * Emits one VEVENT per cached occurrence (current + next years).
 */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { buildFestivalIcs } from "@/lib/festivals/ics";

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

export const Route = createFileRoute("/api/public/festivals/$slug.ics")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const slug = String((params as any).slug ?? (params as any)["slug.ics"] ?? "").slice(
          0,
          200,
        );
        const supa = publicClient();
        const { data: row, error } = await supa
          .from("admin_festivals")
          .select("id, slug, name, short_description, category, duration_days")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();
        if (error) return new Response(error.message, { status: 500 });
        if (!row) return new Response("Not found", { status: 404 });

        const { data: cache } = await supa
          .from("festival_date_cache")
          .select("year, occurrences")
          .eq("festival_id", (row as any).id)
          .order("year", { ascending: true });

        const occs: { isoDate: string; label?: string }[] = [];
        for (const c of cache ?? []) {
          const dates = (c.occurrences as any)?.dates ?? [];
          for (const d of dates) if (d?.isoDate) occs.push({ isoDate: d.isoDate, label: d.name });
        }

        const origin = new URL(request.url).origin;
        const ics = buildFestivalIcs({
          slug: (row as any).slug,
          name: (row as any).name,
          description: (row as any).short_description,
          category: (row as any).category,
          duration_days: (row as any).duration_days,
          siteOrigin: origin,
          occurrences: occs,
        });

        return new Response(ics, {
          status: 200,
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="${(row as any).slug}.ics"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
