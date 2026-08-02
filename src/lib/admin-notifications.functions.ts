/**
 * Admin notifications — broadcast composer + inbox viewer.
 * Uses supabaseAdmin inside handler bodies to bypass RLS (the notifications
 * table's SELECT/INSERT policies are scoped to auth.uid() = user_id).
 * Caller is verified as staff via has_role/is_staff against the auth-scoped
 * supabase client BEFORE any admin work.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertStaff(ctx: Ctx) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

async function audit(ctx: Ctx, action: string, meta: Record<string, unknown> = {}) {
  await ctx.supabase.from("audit_logs").insert({
    actor_user_id: ctx.userId,
    action,
    resource_type: "notifications",
    resource_id: null,
    meta,
  });
}

// ---------- List (admin inbox) ----------

export const adminListNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as {
      search?: string;
      category?: string;
      unreadOnly?: boolean;
      limit?: number;
    };
    return {
      search: (v.search ?? "").trim().slice(0, 200),
      category: (v.category ?? "").trim().slice(0, 60),
      unreadOnly: !!v.unreadOnly,
      limit: Math.min(Math.max(v.limit ?? 100, 1), 500),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let q = supabaseAdmin
      .from("notifications")
      .select("id,user_id,title,body,link,category,read,created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.category) q = q.eq("category", data.category);
    if (data.unreadOnly) q = q.eq("read", false);
    if (data.search) q = q.ilike("title", `%${data.search}%`);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const userIds = Array.from(new Set((rows ?? []).map((r: any) => r.user_id)));
    const { data: profiles } = userIds.length
      ? await supabaseAdmin.from("profiles").select("id,display_name,avatar_url").in("id", userIds)
      : { data: [] as any[] };
    const byId = new Map<string, any>();
    for (const p of profiles ?? []) byId.set(p.id, p);

    // Category facets + unread count for header
    const { count: totalCount } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true });
    const { count: unreadCount } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("read", false);

    return {
      rows: (rows ?? []).map((r: any) => ({
        ...r,
        profile: byId.get(r.user_id) ?? null,
      })),
      totalCount: totalCount ?? 0,
      unreadCount: unreadCount ?? 0,
    };
  });

// ---------- Delete ----------

export const adminDeleteNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id?: string };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("notifications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context as Ctx, "delete_notification", { id: data.id });
    return { ok: true };
  });

// ---------- Broadcast ----------

const CATEGORIES = ["general", "system", "announcement", "product", "billing"] as const;

export const adminBroadcastNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      title?: string;
      body?: string;
      link?: string;
      category?: string;
      target?: { kind?: string; role?: string; userId?: string };
    };
    const title = (v?.title ?? "").trim();
    if (!title) throw new Error("Title is required");
    if (title.length > 160) throw new Error("Title too long (max 160)");
    const body = (v?.body ?? "").trim().slice(0, 2000) || null;
    const link = (v?.link ?? "").trim().slice(0, 500) || null;
    const category = (v?.category ?? "general").trim();
    const target = v?.target ?? { kind: "all" };
    if (!["all", "role", "user"].includes(target.kind ?? "")) {
      throw new Error("Invalid target");
    }
    if (target.kind === "user" && !target.userId) {
      throw new Error("target.userId is required for user target");
    }
    if (target.kind === "role" && !target.role) {
      throw new Error("target.role is required for role target");
    }
    return { title, body, link, category, target };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Resolve recipient user_ids
    let userIds: string[] = [];
    if (data.target.kind === "user") {
      userIds = [data.target.userId!];
    } else if (data.target.kind === "role") {
      const { data: rows, error } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", data.target.role as any);
      if (error) throw new Error(error.message);
      userIds = Array.from(new Set((rows ?? []).map((r: any) => r.user_id)));
    } else {
      // all — use profiles as canonical user list
      const { data: rows, error } = await supabaseAdmin.from("profiles").select("id");
      if (error) throw new Error(error.message);
      userIds = (rows ?? []).map((r: any) => r.id);
    }

    if (userIds.length === 0) {
      return { sent: 0, target: data.target };
    }

    // Insert in chunks of 500
    const CHUNK = 500;
    let sent = 0;
    for (let i = 0; i < userIds.length; i += CHUNK) {
      const chunk = userIds.slice(i, i + CHUNK).map((uid) => ({
        user_id: uid,
        title: data.title,
        body: data.body,
        link: data.link,
        category: data.category,
        read: false,
      }));
      const { error } = await supabaseAdmin.from("notifications").insert(chunk);
      if (error) throw new Error(error.message);
      sent += chunk.length;
    }

    await audit(context as Ctx, "broadcast_notification", {
      title: data.title,
      category: data.category,
      target: data.target,
      sent,
    });
    return { sent, target: data.target };
  });

export const notificationCategories = CATEGORIES;
