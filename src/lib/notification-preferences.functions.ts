/**
 * User-facing notification server functions: preferences + inbox summary.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEFAULT_PREFERENCES } from "@/lib/notifications/types";

type Ctx = { supabase: any; userId: string };

const BOOL_KEYS = [
  "email_enabled",
  "push_enabled",
  "in_app_enabled",
  "browser_enabled",
  "festival_alerts",
  "horoscope_alerts",
  "muhurat_alerts",
  "panchang_alerts",
  "report_alerts",
  "billing_alerts",
  "marketing_emails",
  "ai_recommendations",
  "weekly_digest",
  "monthly_digest",
  "quiet_hours_enabled",
  "unsubscribed_all",
] as const;

export const getMyNotificationPreferences = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as Ctx;
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { user_id: userId, ...DEFAULT_PREFERENCES, ...(data ?? {}) };
  });

export const updateMyNotificationPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as Record<string, unknown>;
    const patch: Record<string, unknown> = {};
    for (const key of BOOL_KEYS) {
      if (typeof v[key] === "boolean") patch[key] = v[key];
    }
    if (typeof v.quiet_hours_start === "number") {
      patch.quiet_hours_start = Math.min(23, Math.max(0, Math.round(v.quiet_hours_start)));
    }
    if (typeof v.quiet_hours_end === "number") {
      patch.quiet_hours_end = Math.min(23, Math.max(0, Math.round(v.quiet_hours_end)));
    }
    if (typeof v.timezone === "string" && v.timezone.length < 64) patch.timezone = v.timezone;
    if (typeof v.language === "string" && v.language.length <= 8) patch.language = v.language;
    return patch;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as Ctx;
    const { data: row, error } = await supabase
      .from("notification_preferences")
      .upsert({ user_id: userId, ...DEFAULT_PREFERENCES, ...data }, { onConflict: "user_id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

/** Delivery history for the signed-in user (dashboard "activity" view). */
export const getMyDeliveryHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ({
    limit: Math.min(Math.max(Number((raw as any)?.limit ?? 50), 1), 200),
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as Ctx;
    const { data: rows, error } = await supabase
      .from("notification_deliveries")
      .select("id,type,channel,status,subject,sent_at,created_at,error_message")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
