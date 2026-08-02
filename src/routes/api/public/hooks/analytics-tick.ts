/**
 * Analytics tick — invoked by pg_cron (recommended: every 15 minutes).
 *
 * 1. Evaluates every enabled alert rule and persists firings to `alert_events`.
 * 2. Notifies staff (in-app) for newly triggered rules.
 *
 * Gated with the project publishable key as `apikey`, matching the other hooks.
 */
import { createFileRoute } from "@tanstack/react-router";

async function notifyStaff(messages: { name: string; message: string }[]) {
  if (!messages.length) return 0;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { enqueueBulk } = await import("@/lib/notifications/engine.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "super_admin"]);
    const userIds = Array.from(new Set((data ?? []).map((r) => r.user_id)));
    if (!userIds.length) return 0;
    const res = await enqueueBulk(userIds, {
      type: "system_alert",
      channels: ["in_app"] as never,
      data: {
        title: `Analytics alert: ${messages.length} rule(s) triggered`,
        body: messages.map((m) => `${m.name}: ${m.message}`).join("\n"),
      },
      dedupeKey: `analytics-alert:${new Date().toISOString().slice(0, 13)}`,
    });
    return res.queued;
  } catch {
    return 0;
  }
}

export const Route = createFileRoute("/api/public/hooks/analytics-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided = request.headers.get("apikey") ?? request.headers.get("x-apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected)
          return Response.json({ ok: false, error: "Server not configured" }, { status: 401 });
        if (!provided || provided !== expected) {
          return Response.json({ ok: false, error: "Invalid apikey" }, { status: 401 });
        }

        const started = Date.now();
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { runAlerts } = await import("@/lib/analytics/bi.server");
          const results = await runAlerts(supabaseAdmin as never, true);
          const fired = results.filter((r) => r.triggered);
          const notified = await notifyStaff(
            fired.map((f) => ({ name: f.ruleName, message: f.message })),
          );
          return Response.json({
            ok: true,
            ms: Date.now() - started,
            evaluated: results.length,
            triggered: fired.length,
            notified,
          });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "tick failed" },
            { status: 500 },
          );
        }
      },
      GET: async () =>
        Response.json({ ok: true, hint: "POST with apikey header to evaluate analytics alerts" }),
    },
  },
});
