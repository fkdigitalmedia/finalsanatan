/**
 * Festival automation tick — invoked by pg_cron every hour.
 *
 * Runs four maintenance passes:
 *   1. Auto-publish scheduled festivals whose publish_at ≤ now().
 *   2. Auto-archive festivals whose unpublish_at ≤ now().
 *   3. Refresh festival_date_cache for current + next year (published only).
 *   4. Notify users with notifications_enabled about festivals in the next 3 days.
 *
 * Security: bypasses auth on published sites via /api/public/*. We accept the
 * project's Supabase publishable key as `apikey` header (standard pg_cron
 * pattern) — mirrors the anon-key gating recommended in schedule-jobs-options.
 */
import { createFileRoute } from "@tanstack/react-router";
import { resolveAdminFestivalRange, type AdminFestivalRow } from "@/lib/festivals/resolve-admin";
import { DEFAULT_LOCATION } from "@/lib/panchang";

async function loadAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function unauthorized(msg: string) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

async function autoPublish(supabase: any): Promise<{ published: number; ids: string[] }> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("admin_festivals")
    .update({ status: "published", published: true })
    .eq("status", "scheduled")
    .lte("publish_at", nowIso)
    .select("id, slug");
  if (error) throw new Error(`autoPublish: ${error.message}`);
  return { published: (data ?? []).length, ids: (data ?? []).map((r: any) => r.id) };
}

async function autoArchive(supabase: any): Promise<{ archived: number }> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("admin_festivals")
    .update({ status: "archived", published: false })
    .in("status", ["published", "scheduled"])
    .not("unpublish_at", "is", null)
    .lte("unpublish_at", nowIso)
    .select("id");
  if (error) throw new Error(`autoArchive: ${error.message}`);
  return { archived: (data ?? []).length };
}

async function refreshCache(supabase: any): Promise<{ refreshed: number; failed: number }> {
  const { data: rows, error } = await supabase
    .from("admin_festivals")
    .select("*")
    .in("status", ["published", "scheduled"]);
  if (error) throw new Error(`refreshCache list: ${error.message}`);
  const y = new Date().getUTCFullYear();
  let refreshed = 0,
    failed = 0;
  for (const row of rows ?? []) {
    try {
      const results = resolveAdminFestivalRange(row as AdminFestivalRow, y, 2, DEFAULT_LOCATION);
      const cacheRows = results.map((r) => ({
        festival_id: row.id,
        year: r.year,
        lat: DEFAULT_LOCATION.lat,
        lng: DEFAULT_LOCATION.lon,
        occurrences: r.error
          ? { error: r.error, dates: [] }
          : {
              dates: r.occurrences.map((o) => ({
                isoDate: o.isoDate,
                name: o.name,
                notes: o.notes ?? [],
              })),
            },
      }));
      const { error: e2 } = await supabase
        .from("festival_date_cache")
        .upsert(cacheRows, { onConflict: "festival_id,year,lat,lng" });
      if (e2) throw new Error(e2.message);
      refreshed++;
    } catch {
      failed++;
    }
  }
  return { refreshed, failed };
}

async function pushUpcomingNotifications(
  supabase: any,
): Promise<{ notified: number; festivals: number }> {
  // 1. Read cache for current/next year, pick occurrences up to 30 days out
  //    (max reminder lead time we support). Per-user filtering happens below.
  const y = new Date().getUTCFullYear();
  const { data: cacheRows, error: e1 } = await supabase
    .from("festival_date_cache")
    .select("festival_id, occurrences")
    .in("year", [y, y + 1]);
  if (e1) throw new Error(`upcoming cache: ${e1.message}`);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const maxHorizon = new Date(today.getTime() + 30 * 86_400_000);
  const upcoming: { festival_id: string; isoDate: string; name: string; daysAway: number }[] = [];
  for (const row of cacheRows ?? []) {
    const dates = (row.occurrences?.dates ?? []) as { isoDate: string; name: string }[];
    for (const d of dates) {
      const dt = new Date(d.isoDate + "T00:00:00Z");
      if (dt >= today && dt <= maxHorizon) {
        const daysAway = Math.round((dt.getTime() - today.getTime()) / 86_400_000);
        upcoming.push({ festival_id: row.festival_id, isoDate: d.isoDate, name: d.name, daysAway });
      }
    }
  }
  if (upcoming.length === 0) return { notified: 0, festivals: 0 };

  // 2. Load festival metadata (only published).
  const ids = Array.from(new Set(upcoming.map((u) => u.festival_id)));
  const { data: fests, error: e2 } = await supabase
    .from("admin_festivals")
    .select("id, slug, name, short_description")
    .in("id", ids)
    .eq("status", "published");
  if (e2) throw new Error(`upcoming meta: ${e2.message}`);
  const meta = new Map<string, any>((fests ?? []).map((f: any) => [f.id, f]));

  // 3. Load opted-in users with their reminder lead-day prefs.
  const { data: users, error: e3 } = await supabase
    .from("user_settings")
    .select("user_id, festival_reminder_lead_days")
    .eq("notifications_enabled", true)
    .eq("festival_reminders_enabled", true);
  if (e3) throw new Error(`upcoming users: ${e3.message}`);
  const userPrefs: { user_id: string; leadDays: Set<number> }[] = (users ?? []).map((u: any) => {
    const arr = (u.festival_reminder_lead_days ?? [1, 3]) as number[];
    const set = new Set<number>(arr);
    set.add(0); // always notify on the day itself
    return { user_id: u.user_id, leadDays: set };
  });
  if (userPrefs.length === 0) return { notified: 0, festivals: meta.size };

  // 4. For each upcoming occurrence, notify users whose leadDays include daysAway.
  //    Dedup against same title in the last 7 days.
  let notified = 0;
  for (const u of upcoming) {
    const f = meta.get(u.festival_id);
    if (!f) continue;
    const title = `${f.name} — ${u.isoDate}`;
    const body =
      u.daysAway === 0
        ? `${f.name} is today. ${f.short_description ?? ""}`.trim()
        : `${f.name} is in ${u.daysAway} day${u.daysAway === 1 ? "" : "s"} (${u.isoDate}). ${f.short_description ?? ""}`.trim();
    const link = `/festivals/${f.slug}`;

    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const { data: existing } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("title", title)
      .gte("created_at", sevenDaysAgo);
    const already = new Set<string>((existing ?? []).map((e: any) => e.user_id));

    const rows = userPrefs
      .filter((p) => p.leadDays.has(u.daysAway) && !already.has(p.user_id))
      .map((p) => ({
        user_id: p.user_id,
        title,
        body,
        link,
        category: "festival",
        read: false,
      }));
    if (rows.length === 0) continue;
    const { error: e4 } = await supabase.from("notifications").insert(rows);
    if (e4) throw new Error(`notify insert: ${e4.message}`);
    notified += rows.length;
  }
  return { notified, festivals: meta.size };
}

export const Route = createFileRoute("/api/public/hooks/festivals-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Gate with the project publishable key so random public callers
        // can't trigger the tick from the wide internet.
        const provided = request.headers.get("apikey") ?? request.headers.get("x-apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected) return unauthorized("Server not configured");
        if (!provided || provided !== expected) return unauthorized("Invalid apikey");

        const supabase = await loadAdmin();
        const started = Date.now();
        try {
          const [pub, arc, cache] = await Promise.all([
            autoPublish(supabase),
            autoArchive(supabase),
            refreshCache(supabase),
          ]);
          const notif = await pushUpcomingNotifications(supabase);
          return Response.json({
            ok: true,
            ms: Date.now() - started,
            published: pub.published,
            archived: arc.archived,
            cache,
            notifications: notif,
          });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e?.message ?? "tick failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      GET: async () => Response.json({ ok: true, hint: "POST with apikey header to run the tick" }),
    },
  },
});
