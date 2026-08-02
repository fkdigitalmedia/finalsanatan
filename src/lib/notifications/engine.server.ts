/**
 * Notification engine — enqueue, dispatch, retry, analytics.
 * Server-only (uses the service-role client).
 */

import { deliver } from "./providers.server";
import { pickTemplate, renderTemplate } from "./templates";
import { deferForQuietHours, retryDelayMs, shouldSend, withDefaults } from "./preferences";
import { PRIORITY, type Channel, type EnqueueInput, type NotificationTemplate } from "./types";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function priorityValue(p: EnqueueInput["priority"]): number {
  if (typeof p === "number") return Math.min(9, Math.max(1, p));
  return PRIORITY[p ?? "normal"];
}

async function loadChannels() {
  const db = await admin();
  const { data } = await db.from("notification_channels").select("*");
  const map = new Map<string, any>();
  for (const row of data ?? []) map.set(row.channel, row);
  return map;
}

async function loadTemplates(type: string): Promise<NotificationTemplate[]> {
  const db = await admin();
  const { data } = await db
    .from("notification_templates")
    .select("id,type,channel,language,subject,body_md,link,variables,enabled")
    .eq("type", type);
  return (data ?? []) as NotificationTemplate[];
}

async function loadPreferences(userId: string | null | undefined) {
  if (!userId) return withDefaults(null);
  const db = await admin();
  const { data } = await db
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return withDefaults(data, userId);
}

async function resolveRecipientEmail(userId: string | null | undefined) {
  if (!userId) return null;
  const db = await admin();
  try {
    const { data } = await db.auth.admin.getUserById(userId);
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

export interface EnqueueResult {
  queued: number;
  skipped: { channel: Channel; reason: string }[];
  ids: string[];
}

/**
 * Queue a notification for one user across the requested channels.
 * Applies preferences, quiet hours, channel availability and de-duplication.
 */
export async function enqueueNotification(input: EnqueueInput): Promise<EnqueueResult> {
  const db = await admin();
  const channels = (
    input.channels?.length ? input.channels : (["in_app"] as Channel[])
  ) as Channel[];
  const prefs = await loadPreferences(input.userId);
  const language = input.language ?? prefs.language ?? "en";
  const templates = await loadTemplates(input.type);
  const channelConfig = await loadChannels();
  const baseAt = input.scheduledAt ? new Date(input.scheduledAt) : new Date();

  const skipped: { channel: Channel; reason: string }[] = [];
  const rows: any[] = [];

  for (const channel of channels) {
    const cfg = channelConfig.get(channel);
    if (!cfg?.enabled) {
      skipped.push({ channel, reason: "channel_off" });
      continue;
    }
    const gate = shouldSend(prefs, input.type, channel);
    if (!gate.allowed) {
      skipped.push({ channel, reason: gate.reason ?? "blocked" });
      continue;
    }
    const template = pickTemplate(templates, input.type, channel, language);
    if (!template) {
      skipped.push({ channel, reason: "template_missing" });
      continue;
    }
    const rendered = renderTemplate(template, {
      ...(input.data ?? {}),
      notificationDate:
        (input.data as any)?.notificationDate ?? new Date().toLocaleDateString("en-IN"),
    });
    const when = deferForQuietHours(prefs, input.type, baseAt);

    rows.push({
      user_id: input.userId ?? null,
      recipient:
        input.recipient ?? (channel === "email" ? await resolveRecipientEmail(input.userId) : null),
      type: input.type,
      channel,
      language,
      priority: priorityValue(input.priority),
      payload: input.data ?? {},
      subject: rendered.subject,
      body: rendered.body,
      link: rendered.link,
      dedupe_key: input.dedupeKey ? `${input.dedupeKey}:${channel}` : null,
      status: "pending",
      scheduled_at: when.toISOString(),
      max_attempts: input.maxAttempts ?? 3,
      created_by: input.createdBy ?? null,
    });
  }

  if (!rows.length) return { queued: 0, skipped, ids: [] };

  const { data, error } = await db
    .from("notification_queue")
    .upsert(rows, { onConflict: "dedupe_key", ignoreDuplicates: true })
    .select("id");
  if (error) throw new Error(error.message);
  return { queued: data?.length ?? 0, skipped, ids: (data ?? []).map((r: any) => r.id) };
}

/** Fan-out helper: queue the same notification for many users. */
export async function enqueueBulk(
  userIds: string[],
  input: Omit<EnqueueInput, "userId">,
): Promise<{ queued: number; users: number }> {
  let queued = 0;
  for (const userId of userIds) {
    try {
      const res = await enqueueNotification({ ...input, userId });
      queued += res.queued;
    } catch {
      /* one bad recipient must not stop the fan-out */
    }
  }
  return { queued, users: userIds.length };
}

async function recordDelivery(row: any, result: any, startedAt: number) {
  const db = await admin();
  const now = new Date().toISOString();
  await db.from("notification_deliveries").insert({
    queue_id: row.id,
    user_id: row.user_id,
    recipient: row.recipient,
    type: row.type,
    channel: row.channel,
    language: row.language,
    provider: result.provider,
    status: result.status,
    subject: row.subject,
    sent_at: result.status === "sent" ? now : null,
    delivered_at: result.status === "sent" ? now : null,
    failed_at: result.status === "failed" ? now : null,
    retry_count: row.attempts ?? 0,
    duration_ms: Date.now() - startedAt,
    error_message: result.reason ?? null,
    meta: result.meta ?? {},
  });
}

export interface ProcessResult {
  picked: number;
  sent: number;
  failed: number;
  skipped: number;
  retrying: number;
}

/** Drain due queue items. Called by the cron hook and by admin "run now". */
export async function processQueue(limit = 100): Promise<ProcessResult> {
  const db = await admin();
  const nowIso = new Date().toISOString();

  const { data: due, error } = await db
    .from("notification_queue")
    .select("*")
    .in("status", ["pending", "retrying"])
    .lte("scheduled_at", nowIso)
    .order("priority", { ascending: true })
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);

  const out: ProcessResult = {
    picked: due?.length ?? 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    retrying: 0,
  };
  if (!due?.length) return out;

  const channelConfig = await loadChannels();

  for (const row of due) {
    await db
      .from("notification_queue")
      .update({ status: "processing", locked_at: new Date().toISOString() })
      .eq("id", row.id);

    const startedAt = Date.now();
    const cfg = channelConfig.get(row.channel);
    let result;
    if (!cfg?.enabled) {
      result = {
        status: "skipped" as const,
        provider: cfg?.provider ?? "none",
        reason: "channel_off",
      };
    } else {
      try {
        result = await deliver(row.channel as Channel, {
          userId: row.user_id,
          recipient: row.recipient,
          type: row.type,
          language: row.language,
          subject: row.subject ?? "",
          body: row.body ?? "",
          link: row.link ?? null,
          payload: (row.payload ?? {}) as Record<string, unknown>,
          channelConfig: cfg?.config ?? {},
        });
      } catch (e: any) {
        result = {
          status: "failed" as const,
          provider: cfg?.provider ?? "unknown",
          reason: e?.message ?? "error",
        };
      }
    }

    const attempts = (row.attempts ?? 0) + 1;
    if (result.status === "sent") {
      out.sent += 1;
      await db
        .from("notification_queue")
        .update({ status: "sent", attempts, locked_at: null, last_error: null })
        .eq("id", row.id);
    } else if (result.status === "skipped") {
      out.skipped += 1;
      await db
        .from("notification_queue")
        .update({ status: "skipped", attempts, locked_at: null, last_error: result.reason ?? null })
        .eq("id", row.id);
    } else if (attempts >= (row.max_attempts ?? 3)) {
      out.failed += 1;
      await db
        .from("notification_queue")
        .update({ status: "failed", attempts, locked_at: null, last_error: result.reason ?? null })
        .eq("id", row.id);
    } else {
      out.retrying += 1;
      await db
        .from("notification_queue")
        .update({
          status: "retrying",
          attempts,
          locked_at: null,
          last_error: result.reason ?? null,
          scheduled_at: new Date(Date.now() + retryDelayMs(attempts)).toISOString(),
        })
        .eq("id", row.id);
    }

    await recordDelivery(row, result, startedAt);
  }

  return out;
}

/** Release rows stuck in `processing` (e.g. a worker died mid-run). */
export async function requeueStuck(olderThanMinutes = 15) {
  const db = await admin();
  const cutoff = new Date(Date.now() - olderThanMinutes * 60_000).toISOString();
  const { data } = await db
    .from("notification_queue")
    .update({ status: "retrying", locked_at: null })
    .eq("status", "processing")
    .lt("locked_at", cutoff)
    .select("id");
  return { requeued: data?.length ?? 0 };
}
