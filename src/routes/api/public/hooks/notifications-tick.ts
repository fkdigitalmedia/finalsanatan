/**
 * Notification engine tick — invoked by pg_cron (recommended: every 5 minutes).
 *
 * 1. Requeues rows stuck in `processing`.
 * 2. Evaluates recurring notification_schedules and fans them out.
 * 3. Drains the due queue through the channel providers.
 *
 * Gated with the project publishable key as `apikey`, matching the other hooks.
 */
import { createFileRoute } from "@tanstack/react-router";
import { isScheduleDue } from "@/lib/notifications/schedules";

async function loadAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function runSchedules() {
  const db = await loadAdmin();
  const { enqueueBulk } = await import("@/lib/notifications/engine.server");
  const { data: schedules } = await db
    .from("notification_schedules")
    .select("*")
    .eq("enabled", true);
  const now = new Date();
  let ran = 0;
  let queued = 0;

  for (const s of schedules ?? []) {
    if (!isScheduleDue(s as any, now)) continue;
    let userIds: string[] = [];
    const audience = (s.audience ?? { kind: "all" }) as any;
    if (audience.kind === "user" && audience.userId) userIds = [audience.userId];
    else if (audience.kind === "role" && audience.role) {
      const { data } = await db.from("user_roles").select("user_id").eq("role", audience.role);
      userIds = Array.from(new Set((data ?? []).map((r: any) => r.user_id)));
    } else {
      const { data } = await db.from("profiles").select("id");
      userIds = (data ?? []).map((r: any) => r.id);
    }

    const res = await enqueueBulk(userIds, {
      type: s.type,
      channels: (s.channels ?? ["in_app"]) as any,
      data: {
        ...((s.payload ?? {}) as Record<string, unknown>),
        notificationDate: now.toISOString().slice(0, 10),
      },
      dedupeKey: `schedule:${s.id}:${now.toISOString().slice(0, 10)}`,
    });
    queued += res.queued;
    ran += 1;
    await db
      .from("notification_schedules")
      .update({ last_run_at: now.toISOString() })
      .eq("id", s.id);
  }
  return { ran, queued };
}

export const Route = createFileRoute("/api/public/hooks/notifications-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided = request.headers.get("apikey") ?? request.headers.get("x-apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected) {
          return Response.json({ ok: false, error: "Server not configured" }, { status: 401 });
        }
        if (!provided || provided !== expected) {
          return Response.json({ ok: false, error: "Invalid apikey" }, { status: 401 });
        }

        const started = Date.now();
        try {
          const { processQueue, requeueStuck } = await import("@/lib/notifications/engine.server");
          const stuck = await requeueStuck();
          const schedules = await runSchedules();
          const processed = await processQueue(200);
          return Response.json({ ok: true, ms: Date.now() - started, stuck, schedules, processed });
        } catch (e: any) {
          return Response.json({ ok: false, error: e?.message ?? "tick failed" }, { status: 500 });
        }
      },
      GET: async () =>
        Response.json({ ok: true, hint: "POST with apikey header to run the notification tick" }),
    },
  },
});
