/**
 * Admin notification-engine server functions: channels, templates, queue,
 * schedules, analytics and test sends. Staff-gated, service-role backed.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertStaff(ctx: Ctx) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ───────────────────────── Channels ─────────────────────────

export const adminListChannels = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { data, error } = await db
      .from("notification_channels")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateChannel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    if (!v.channel) throw new Error("channel required");
    return {
      channel: String(v.channel),
      enabled: typeof v.enabled === "boolean" ? v.enabled : undefined,
      provider: typeof v.provider === "string" ? v.provider.slice(0, 60) : undefined,
      config: typeof v.config === "object" && v.config ? v.config : undefined,
      rate_limit_per_minute:
        typeof v.rate_limit_per_minute === "number"
          ? Math.max(1, v.rate_limit_per_minute)
          : undefined,
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { channel, ...patch } = data;
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    const { error } = await db
      .from("notification_channels")
      .update({
        ...clean,
        updated_by: (context as Ctx).userId,
        updated_at: new Date().toISOString(),
      })
      .eq("channel", channel);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───────────────────────── Templates ─────────────────────────

export const adminListTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { data, error } = await db
      .from("notification_templates")
      .select("*")
      .order("type", { ascending: true })
      .order("channel", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    const type = String(v.type ?? "").trim();
    const channel = String(v.channel ?? "").trim();
    if (!type || !channel) throw new Error("type and channel are required");
    return {
      id: v.id ? String(v.id) : null,
      type,
      channel,
      language: String(v.language ?? "en").slice(0, 8),
      subject: String(v.subject ?? "").slice(0, 300),
      body_md: String(v.body_md ?? "").slice(0, 8000),
      link: v.link ? String(v.link).slice(0, 500) : null,
      enabled: v.enabled !== false,
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { extractVariables } = await import("@/lib/notifications/templates");
    const variables = extractVariables({ subject: data.subject, body_md: data.body_md });

    if (data.id) {
      const { data: prev } = await db
        .from("notification_templates")
        .select("*")
        .eq("id", data.id)
        .single();
      const version = (prev?.version ?? 1) + 1;
      if (prev) {
        await db.from("notification_template_versions").insert({
          template_id: data.id,
          version: prev.version,
          snapshot: prev,
          changed_by: (context as Ctx).userId,
        });
      }
      const { error } = await db
        .from("notification_templates")
        .update({
          type: data.type,
          channel: data.channel,
          language: data.language,
          subject: data.subject,
          body_md: data.body_md,
          link: data.link,
          enabled: data.enabled,
          variables,
          version,
          updated_by: (context as Ctx).userId,
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id, version };
    }

    const { data: inserted, error } = await db
      .from("notification_templates")
      .insert({
        type: data.type,
        channel: data.channel,
        language: data.language,
        subject: data.subject,
        body_md: data.body_md,
        link: data.link,
        enabled: data.enabled,
        variables,
        updated_by: (context as Ctx).userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id, version: 1 };
  });

export const adminDeleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const id = (raw as any)?.id;
    if (!id) throw new Error("id required");
    return { id: String(id) };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { error } = await db.from("notification_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───────────────────────── Queue ─────────────────────────

export const adminListQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    return {
      status: typeof v.status === "string" ? v.status : "",
      channel: typeof v.channel === "string" ? v.channel : "",
      limit: Math.min(Math.max(Number(v.limit ?? 100), 1), 500),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    let q = db
      .from("notification_queue")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.channel) q = q.eq("channel", data.channel);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const counts: Record<string, number> = {};
    for (const status of [
      "pending",
      "processing",
      "retrying",
      "sent",
      "failed",
      "skipped",
      "cancelled",
    ]) {
      const { count } = await db
        .from("notification_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      counts[status] = count ?? 0;
    }
    return { rows: rows ?? [], counts };
  });

export const adminQueueAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    const action = String(v.action ?? "");
    if (!["retry", "cancel", "delete", "clear_completed"].includes(action)) {
      throw new Error("Invalid action");
    }
    return { action, id: v.id ? String(v.id) : null };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    if (data.action === "clear_completed") {
      const { error } = await db
        .from("notification_queue")
        .delete()
        .in("status", ["sent", "skipped", "cancelled"]);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    if (!data.id) throw new Error("id required");
    if (data.action === "delete") {
      const { error } = await db.from("notification_queue").delete().eq("id", data.id);
      if (error) throw new Error(error.message);
    } else if (data.action === "cancel") {
      const { error } = await db
        .from("notification_queue")
        .update({ status: "cancelled" })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db
        .from("notification_queue")
        .update({
          status: "pending",
          attempts: 0,
          last_error: null,
          scheduled_at: new Date().toISOString(),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/** Drain the queue immediately (admin "Process now" button). */
export const adminProcessQueue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ({
    limit: Math.min(Math.max(Number((raw as any)?.limit ?? 100), 1), 500),
  }))
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { processQueue, requeueStuck } = await import("@/lib/notifications/engine.server");
    await requeueStuck();
    return processQueue(data.limit);
  });

// ───────────────────────── Dispatch / test send ─────────────────────────

export const adminDispatchNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    const type = String(v.type ?? "").trim();
    if (!type) throw new Error("type is required");
    const channels: string[] =
      Array.isArray(v.channels) && v.channels.length ? v.channels.map(String) : ["in_app"];
    const audience = v.audience ?? { kind: "self" };
    if (!["self", "all", "role", "user"].includes(audience.kind))
      throw new Error("Invalid audience");
    return {
      type,
      channels,
      audience,
      language: String(v.language ?? "en").slice(0, 8),
      priority: typeof v.priority === "number" ? v.priority : 5,
      data: typeof v.data === "object" && v.data ? v.data : {},
      scheduledAt: v.scheduledAt ? String(v.scheduledAt) : null,
      dedupeKey: v.dedupeKey ? String(v.dedupeKey).slice(0, 200) : undefined,
    };
  })
  .handler(async ({ data, context }) => {
    const ctx = context as Ctx;
    await assertStaff(ctx);
    const db = await admin();
    const { enqueueBulk, enqueueNotification, processQueue } =
      await import("@/lib/notifications/engine.server");

    let userIds: string[] = [];
    if (data.audience.kind === "self") userIds = [ctx.userId];
    else if (data.audience.kind === "user") userIds = [String(data.audience.userId)];
    else if (data.audience.kind === "role") {
      const { data: rows } = await db
        .from("user_roles")
        .select("user_id")
        .eq("role", data.audience.role);
      userIds = Array.from(new Set((rows ?? []).map((r: any) => r.user_id)));
    } else {
      const { data: rows } = await db.from("profiles").select("id");
      userIds = (rows ?? []).map((r: any) => r.id);
    }

    const base = {
      type: data.type,
      channels: data.channels as any,
      language: data.language,
      priority: data.priority,
      data: data.data,
      scheduledAt: data.scheduledAt ?? undefined,
      dedupeKey: data.dedupeKey,
      createdBy: ctx.userId,
    };

    let queued = 0;
    let skipped: any[] = [];
    if (userIds.length === 1) {
      const res = await enqueueNotification({ ...base, userId: userIds[0] });
      queued = res.queued;
      skipped = res.skipped;
    } else {
      const res = await enqueueBulk(userIds, base);
      queued = res.queued;
    }

    // Immediate delivery for anything already due.
    const processed = await processQueue(Math.min(500, Math.max(queued, 1)));
    await db.from("audit_logs").insert({
      actor_user_id: ctx.userId,
      action: "dispatch_notification",
      resource_type: "notification_queue",
      meta: { type: data.type, channels: data.channels, recipients: userIds.length, queued },
    });
    return { recipients: userIds.length, queued, skipped, processed };
  });

// ───────────────────────── Schedules ─────────────────────────

export const adminListSchedules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { data, error } = await db
      .from("notification_schedules")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveSchedule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    const name = String(v.name ?? "").trim();
    const type = String(v.type ?? "").trim();
    if (!name || !type) throw new Error("name and type are required");
    return {
      id: v.id ? String(v.id) : null,
      name: name.slice(0, 120),
      type,
      channels:
        Array.isArray(v.channels) && v.channels.length ? v.channels.map(String) : ["in_app"],
      cadence: ["daily", "weekly", "monthly", "yearly"].includes(v.cadence) ? v.cadence : "daily",
      run_at_hour: Math.min(23, Math.max(0, Number(v.run_at_hour ?? 6))),
      run_at_minute: Math.min(59, Math.max(0, Number(v.run_at_minute ?? 0))),
      day_of_week:
        v.day_of_week === null || v.day_of_week === undefined ? null : Number(v.day_of_week),
      day_of_month:
        v.day_of_month === null || v.day_of_month === undefined ? null : Number(v.day_of_month),
      timezone: String(v.timezone ?? "Asia/Kolkata").slice(0, 60),
      audience: typeof v.audience === "object" && v.audience ? v.audience : { kind: "all" },
      payload: typeof v.payload === "object" && v.payload ? v.payload : {},
      enabled: v.enabled !== false,
    };
  })
  .handler(async ({ data, context }) => {
    const ctx = context as Ctx;
    await assertStaff(ctx);
    const db = await admin();
    const { id, ...row } = data;
    if (id) {
      const { error } = await db.from("notification_schedules").update(row).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: ins, error } = await db
      .from("notification_schedules")
      .insert({ ...row, created_by: ctx.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: ins.id };
  });

export const adminDeleteSchedule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const id = (raw as any)?.id;
    if (!id) throw new Error("id required");
    return { id: String(id) };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const { error } = await db.from("notification_schedules").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───────────────────────── Analytics ─────────────────────────

export const adminNotificationAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ({
    days: Math.min(Math.max(Number((raw as any)?.days ?? 30), 1), 180),
  }))
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    const since = new Date(Date.now() - data.days * 86_400_000).toISOString();
    const { data: rows, error } = await db
      .from("notification_deliveries")
      .select("type,channel,status,created_at,read_at,clicked_at,duration_ms,error_message")
      .gte("created_at", since)
      .limit(5000);
    if (error) throw new Error(error.message);

    const list = rows ?? [];
    const byChannel: Record<string, { sent: number; failed: number; skipped: number }> = {};
    const byType: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    let sent = 0;
    let failed = 0;
    let skipped = 0;
    let read = 0;
    let clicked = 0;
    let totalMs = 0;

    for (const r of list) {
      const c = (byChannel[r.channel] ??= { sent: 0, failed: 0, skipped: 0 });
      if (r.status === "sent") {
        sent += 1;
        c.sent += 1;
      } else if (r.status === "failed") {
        failed += 1;
        c.failed += 1;
      } else {
        skipped += 1;
        c.skipped += 1;
      }
      byType[r.type] = (byType[r.type] ?? 0) + 1;
      const day = String(r.created_at).slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
      if (r.read_at) read += 1;
      if (r.clicked_at) clicked += 1;
      totalMs += r.duration_ms ?? 0;
    }

    const errors: Record<string, number> = {};
    for (const r of list) {
      if (r.status === "failed" && r.error_message) {
        const key = r.error_message.slice(0, 80);
        errors[key] = (errors[key] ?? 0) + 1;
      }
    }

    return {
      total: list.length,
      sent,
      failed,
      skipped,
      read,
      clicked,
      deliveryRate: list.length ? Math.round((sent / list.length) * 100) : 0,
      openRate: sent ? Math.round((read / sent) * 100) : 0,
      clickRate: sent ? Math.round((clicked / sent) * 100) : 0,
      avgDurationMs: list.length ? Math.round(totalMs / list.length) : 0,
      byChannel,
      byType: Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12),
      byDay: Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0])),
      topErrors: Object.entries(errors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8),
    };
  });

export const adminListDeliveries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as any;
    return {
      status: typeof v.status === "string" ? v.status : "",
      channel: typeof v.channel === "string" ? v.channel : "",
      limit: Math.min(Math.max(Number(v.limit ?? 100), 1), 500),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const db = await admin();
    let q = db
      .from("notification_deliveries")
      .select(
        "id,user_id,recipient,type,channel,provider,status,subject,sent_at,created_at,error_message",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.channel) q = q.eq("channel", data.channel);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
