/**
 * Admin dashboard — server functions.
 *
 * Every mutation goes through `requireSupabaseAuth` + `assertStaff` and writes
 * an entry to `audit_logs`. Reads are role-gated too so unauthenticated calls
 * cannot enumerate drafts / disabled ads / subscribers.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string; claims?: any };

// ---------- helpers ----------

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

async function audit(
  ctx: { supabase: any; userId: string },
  action: string,
  resource_type: string,
  resource_id: string | null,
  meta: Record<string, unknown> = {},
) {
  await ctx.supabase.from("audit_logs").insert({
    actor_user_id: ctx.userId,
    action,
    resource_type,
    resource_id,
    meta,
  });
}

const STAFF_ROLES = ["admin", "super_admin", "editor", "content_manager", "moderator"] as const;

const TABLES = new Set([
  "admin_articles",
  "admin_festivals",
  "admin_temples",
  "admin_ads",
  "affiliate_links",
  "tool_overrides",
  "newsletter_subscribers",
  "email_templates",
  "redirects",
  "site_settings",
  "ai_prompts",
  "panchang_providers",
  "subscription_plans",
  "coupons",
  "user_moderation",
  "user_roles",
  "audit_logs",
  "legal_pages",
  "legal_page_translations",
  "legal_contact_messages",
  "payment_gateways",
]);

function assertTable(name: string): asserts name is string {
  if (!TABLES.has(name)) throw new Error("Invalid table");
}

// ---------- Generic CRUD ----------

export const adminList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      table?: string;
      order?: string;
      ascending?: boolean;
      limit?: number;
      search?: string;
      searchColumn?: string;
    };
    if (!v?.table) throw new Error("Missing table");
    assertTable(v.table);
    const NO_CREATED_AT: Record<string, string> = {
      site_settings: "key",
      integration_settings: "key",
      translations: "key",
    };
    return {
      table: v.table,
      // Some tables have no created_at column: always force their safe order column
      order: NO_CREATED_AT[v.table] ?? v.order ?? "created_at",
      ascending: NO_CREATED_AT[v.table] ? true : (v.ascending ?? false),
      limit: Math.min(Math.max(v.limit ?? 200, 1), 1000),
      search: (v.search ?? "").trim().slice(0, 200),
      searchColumn: v.searchColumn,
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    let q = (context as any).supabase.from(data.table).select("*").limit(data.limit);
    if (data.order) q = q.order(data.order, { ascending: data.ascending });
    if (data.search && data.searchColumn) q = q.ilike(data.searchColumn, `%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const adminUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { table?: string; values?: Record<string, unknown>; onConflict?: string };
    if (!v?.table) throw new Error("Missing table");
    assertTable(v.table);
    if (!v.values || typeof v.values !== "object") throw new Error("Missing values");
    return { table: v.table, values: v.values, onConflict: v.onConflict };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { data: row, error } = await (context as any).supabase
      .from(data.table)
      .upsert(data.values, data.onConflict ? { onConflict: data.onConflict } : undefined)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await audit(context as Ctx, "upsert", data.table, row?.id ?? row?.slug ?? row?.key ?? null, {
      keys: Object.keys(data.values),
    });
    return { row };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { table?: string; column?: string; value?: string };
    if (!v?.table) throw new Error("Missing table");
    assertTable(v.table);
    if (!v.column || !v.value) throw new Error("Missing key");
    return { table: v.table, column: v.column, value: v.value };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { error } = await (context as any).supabase
      .from(data.table)
      .delete()
      .eq(data.column, data.value);
    if (error) throw new Error(error.message);
    await audit(context as Ctx, "delete", data.table, String(data.value));
    return { ok: true };
  });

// ---------- Dashboard overview ----------

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as Ctx);
    const sb = (context as any).supabase;
    const counts: Record<string, number | null> = {};
    const targets: [string, string][] = [
      ["users", "profiles"],
      ["articles", "admin_articles"],
      ["festivals", "admin_festivals"],
      ["temples", "admin_temples"],
      ["ads", "admin_ads"],
      ["affiliates", "affiliate_links"],
      ["subscribers", "newsletter_subscribers"],
      ["clicks", "affiliate_clicks"],
      ["plans", "subscription_plans"],
    ];
    await Promise.all(
      targets.map(async ([label, table]) => {
        const { count } = await sb.from(table).select("*", { count: "exact", head: true });
        counts[label] = count ?? 0;
      }),
    );
    const { data: recentActivity } = await sb
      .from("audit_logs")
      .select("id,action,resource_type,resource_id,created_at,actor_user_id")
      .order("created_at", { ascending: false })
      .limit(20);
    return { counts, recentActivity: recentActivity ?? [] };
  });

// ---------- Users & roles ----------

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { search?: string; limit?: number };
    return {
      search: (v.search ?? "").trim().slice(0, 100),
      limit: Math.min(Math.max(v.limit ?? 100, 1), 500),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    let q = (context as any).supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.search) {
      q = q.or(
        `display_name.ilike.%${data.search}%,full_name.ilike.%${data.search}%,email.ilike.%${data.search}%`,
      );
    }
    const { data: users, error } = await q;
    if (error) throw new Error(error.message);

    const ids = (users ?? []).map((u: { id: string }) => u.id);
    const [{ data: roles }, { data: mod }] = await Promise.all([
      (context as any).supabase
        .from("user_roles")
        .select("user_id,role")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
      (context as any).supabase
        .from("user_moderation")
        .select("*")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
    ]);
    const rolesByUser = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    }
    const modByUser = new Map<string, any>();
    for (const m of mod ?? []) modByUser.set(m.user_id, m);

    return {
      rows: (users ?? []).map((u: any) => ({
        ...u,
        roles: rolesByUser.get(u.id) ?? [],
        moderation: modByUser.get(u.id) ?? null,
      })),
    };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { userId?: string; role?: string; grant?: boolean };
    if (!v?.userId) throw new Error("Missing userId");
    if (!v.role || !STAFF_ROLES.concat(["user" as never]).includes(v.role as never))
      throw new Error("Invalid role");
    return { userId: v.userId, role: v.role, grant: v.grant !== false };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    // Only admin/super_admin can grant staff roles
    const { data: canGrantRoles } = await (context as any).supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", (context as any).userId);
    const canGrant = (canGrantRoles ?? []).some((r: { role: string }) =>
      ["admin", "super_admin"].includes(r.role),
    );
    if (!canGrant) throw new Error("Only admins can change roles");

    if (data.grant) {
      const { error } = await (context as any).supabase
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await (context as any).supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    await audit(
      context as Ctx,
      data.grant ? "grant_role" : "revoke_role",
      "user_roles",
      data.userId,
      {
        role: data.role,
      },
    );
    return { ok: true };
  });

export const setUserModeration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { userId?: string; banned?: boolean; warnings?: number; notes?: string };
    if (!v?.userId) throw new Error("Missing userId");
    return {
      userId: v.userId,
      banned: !!v.banned,
      warnings: typeof v.warnings === "number" ? v.warnings : 0,
      notes: (v.notes ?? "").slice(0, 2000),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { error } = await (context as any).supabase.from("user_moderation").upsert({
      user_id: data.userId,
      banned: data.banned,
      warnings: data.warnings,
      notes: data.notes,
      updated_by: (context as any).userId,
    });
    if (error) throw new Error(error.message);
    await audit(context as Ctx, "moderation_update", "user_moderation", data.userId, {
      banned: data.banned,
      warnings: data.warnings,
    });
    return { ok: true };
  });

// ---------- Analytics ----------

export const analyticsOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as Ctx);
    const sb = (context as any).supabase;
    // Top tools by history rows
    const { data: history } = await sb.from("history").select("tool_slug").limit(2000);
    const toolCounts = new Map<string, number>();
    for (const h of history ?? []) {
      toolCounts.set(h.tool_slug, (toolCounts.get(h.tool_slug) ?? 0) + 1);
    }
    const topTools = Array.from(toolCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([slug, count]) => ({ slug, count }));

    const { data: clicks } = await sb
      .from("affiliate_clicks")
      .select("link_id,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    const clicksByLink = new Map<string, number>();
    for (const c of clicks ?? []) {
      clicksByLink.set(c.link_id, (clicksByLink.get(c.link_id) ?? 0) + 1);
    }
    return {
      topTools,
      recentClicks: clicks?.length ?? 0,
      clicksByLink: Array.from(clicksByLink.entries()).map(([id, n]) => ({ id, count: n })),
    };
  });

// ---------- Backup / export ----------

export const exportTable = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { table?: string };
    if (!v?.table) throw new Error("Missing table");
    assertTable(v.table);
    return { table: v.table };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const { data: rows, error } = await (context as any).supabase.from(data.table).select("*");
    if (error) throw new Error(error.message);
    await audit(context as Ctx, "export", data.table, null, { count: rows?.length ?? 0 });
    return { table: data.table, rows: rows ?? [] };
  });

export const importTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { table?: string; rows?: Record<string, unknown>[]; onConflict?: string };
    if (!v?.table) throw new Error("Missing table");
    assertTable(v.table);
    if (!Array.isArray(v.rows)) throw new Error("Rows must be an array");
    return {
      table: v.table,
      rows: v.rows.slice(0, 5000),
      onConflict: v.onConflict,
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    if (data.rows.length === 0) return { inserted: 0 };
    const { error, count } = await (context as any).supabase
      .from(data.table)
      .upsert(
        data.rows,
        data.onConflict
          ? { onConflict: data.onConflict, count: "exact" as const }
          : { count: "exact" as const },
      );
    if (error) throw new Error(error.message);
    await audit(context as Ctx, "import", data.table, null, { count: count ?? data.rows.length });
    return { inserted: count ?? data.rows.length };
  });

// ---------- Panchang cache ----------

export const clearPanchangCache = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as Ctx);
    await audit(context as Ctx, "clear_cache", "panchang", null);
    return { ok: true, cleared_at: new Date().toISOString() };
  });
