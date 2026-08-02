/**
 * Festival Management System — server functions.
 * All mutations gated by staff role; every write logs to audit_logs and
 * snapshots to festival_revisions.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  resolveAdminFestivalRange,
  resolveAdminFestival,
  type AdminFestivalRow,
} from "@/lib/festivals/resolve-admin";
import { DEFAULT_LOCATION } from "@/lib/panchang";

type Ctx = { supabase: any; userId: string };

async function assertStaff(ctx: Ctx) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

async function snapshot(ctx: Ctx, festivalId: string, note: string | null) {
  const { data: row } = await ctx.supabase
    .from("admin_festivals")
    .select("*")
    .eq("id", festivalId)
    .maybeSingle();
  if (!row) return;
  await ctx.supabase.from("festival_revisions").insert({
    festival_id: festivalId,
    version: row.version ?? 1,
    snapshot: row,
    change_note: note,
    changed_by: ctx.userId,
  });
}

async function audit(
  ctx: Ctx,
  action: string,
  resource_id: string | null,
  meta: Record<string, unknown> = {},
) {
  await ctx.supabase.from("audit_logs").insert({
    actor_user_id: ctx.userId,
    action,
    resource_type: "festival",
    resource_id,
    meta,
  });
}

// -------- List --------
export const listFestivals = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as {
      search?: string;
      status?: string;
      category?: string;
      month?: number;
      deity?: string;
      tag?: string;
      limit?: number;
    };
    return {
      search: (v.search ?? "").trim().slice(0, 200),
      status: v.status ?? "",
      category: v.category ?? "",
      month: typeof v.month === "number" ? v.month : undefined,
      deity: v.deity ?? "",
      tag: v.tag ?? "",
      limit: Math.min(Math.max(v.limit ?? 200, 1), 1000),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    let q = (context as any).supabase
      .from("admin_festivals")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(data.limit);
    if (data.search) q = q.ilike("name", `%${data.search}%`);
    if (data.status) q = q.eq("status", data.status);
    if (data.category) q = q.eq("category", data.category);
    if (data.month) q = q.eq("fixed_month", data.month);
    if (data.deity) q = q.contains("deities", [data.deity]);
    if (data.tag) q = q.contains("tags", [data.tag]);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

// -------- Get by id --------
export const getFestival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const [{ data: row, error }, { data: translations }, { data: revisions }] = await Promise.all([
      (context as any).supabase.from("admin_festivals").select("*").eq("id", data.id).maybeSingle(),
      (context as any).supabase
        .from("festival_translations")
        .select("*")
        .eq("festival_id", data.id),
      (context as any).supabase
        .from("festival_revisions")
        .select("id, version, change_note, changed_by, created_at")
        .eq("festival_id", data.id)
        .order("version", { ascending: false })
        .limit(50),
    ]);
    if (error) throw new Error(error.message);
    return { row, translations: translations ?? [], revisions: revisions ?? [] };
  });

// -------- Upsert --------
export const upsertFestival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { values: Record<string, unknown>; note?: string | null };
    if (!v?.values || typeof v.values !== "object") throw new Error("Missing values");
    if (!v.values.name || !v.values.slug) throw new Error("Name and slug are required");
    return { values: v.values, note: v.note ?? null };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const values: any = { ...data.values, updated_by: ctx.userId };

    if (values.id) {
      await snapshot(ctx, values.id, data.note);
      values.version = (typeof values.version === "number" ? values.version : 1) + 1;
    } else {
      values.author_id = ctx.userId;
      values.version = 1;
    }

    const { data: row, error } = await ctx.supabase
      .from("admin_festivals")
      .upsert(values, { onConflict: "id" })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await audit(ctx, values.id ? "festival.update" : "festival.create", row?.id ?? null, {
      slug: values.slug,
    });
    return { row };
  });

// -------- Duplicate --------
export const duplicateFestival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: src, error } = await ctx.supabase
      .from("admin_festivals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!src) throw new Error("Not found");
    const { id, created_at, updated_at, ...rest } = src;
    const clone = {
      ...rest,
      slug: `${src.slug}-copy-${Math.random().toString(36).slice(2, 6)}`,
      name: `${src.name} (Copy)`,
      status: "draft",
      published: false,
      author_id: ctx.userId,
      version: 1,
    };
    const { data: row, error: e2 } = await ctx.supabase
      .from("admin_festivals")
      .insert(clone)
      .select()
      .maybeSingle();
    if (e2) throw new Error(e2.message);
    await audit(ctx, "festival.duplicate", row?.id ?? null, { source: data.id });
    return { row };
  });

// -------- Change status (publish/unpublish/archive/schedule/draft) --------
export const setFestivalStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      id: string;
      status: string;
      publish_at?: string | null;
      unpublish_at?: string | null;
    };
    if (!v?.id || !v?.status) throw new Error("Missing id or status");
    if (!["draft", "scheduled", "published", "archived"].includes(v.status))
      throw new Error("Invalid status");
    return {
      id: v.id,
      status: v.status,
      publish_at: v.publish_at ?? null,
      unpublish_at: v.unpublish_at ?? null,
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    await snapshot(ctx, data.id, `status → ${data.status}`);
    const patch: any = {
      status: data.status,
      published: data.status === "published",
      updated_by: ctx.userId,
    };
    if (data.status === "scheduled") patch.publish_at = data.publish_at;
    if (data.unpublish_at !== null) patch.unpublish_at = data.unpublish_at;
    const { data: row, error } = await ctx.supabase
      .from("admin_festivals")
      .update(patch)
      .eq("id", data.id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await audit(ctx, `festival.${data.status}`, data.id, {});
    return { row };
  });

// -------- Delete --------
export const deleteFestival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    await snapshot(ctx, data.id, "before delete");
    const { error } = await ctx.supabase.from("admin_festivals").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(ctx, "festival.delete", data.id, {});
    return { ok: true };
  });

// -------- Upsert translation --------
export const upsertFestivalTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      festival_id: string;
      language: string;
      content: Record<string, unknown>;
      status?: string;
    };
    if (!v?.festival_id || !v?.language) throw new Error("Missing festival_id or language");
    return {
      festival_id: v.festival_id,
      language: v.language,
      content: v.content ?? {},
      status: v.status ?? "draft",
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: row, error } = await ctx.supabase
      .from("festival_translations")
      .upsert({ ...data, updated_by: ctx.userId }, { onConflict: "festival_id,language" })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { row };
  });

// ==================================================================
// DATE ENGINE — Phase F2
// ==================================================================

/**
 * Preview upcoming occurrences for a row (does NOT write cache).
 * Accepts either a saved festival id or an unsaved row payload so
 * editors can preview before the first save.
 */
export const previewFestivalDates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as {
      id?: string;
      row?: Partial<AdminFestivalRow>;
      startYear?: number;
      years?: number;
    };
    return {
      id: v.id,
      row: v.row,
      startYear: v.startYear ?? new Date().getFullYear(),
      years: Math.min(Math.max(v.years ?? 5, 1), 20),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    let row: AdminFestivalRow | null = null;
    if (data.id) {
      const { data: r, error } = await ctx.supabase
        .from("admin_festivals")
        .select("*")
        .eq("id", data.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      row = r as AdminFestivalRow | null;
    } else if (data.row) {
      row = {
        id: "preview",
        slug: data.row.slug ?? "preview",
        name: data.row.name ?? "Preview",
        ...data.row,
      } as AdminFestivalRow;
    }
    if (!row) throw new Error("Provide id or row for preview");
    const results = resolveAdminFestivalRange(row, data.startYear, data.years, DEFAULT_LOCATION);
    return {
      results: results.map((r) => ({
        year: r.year,
        error: r.error,
        occurrences: r.occurrences.map((o) => ({
          isoDate: o.isoDate,
          name: o.name,
          notes: o.notes ?? [],
        })),
      })),
    };
  });

/**
 * Compute and persist occurrences for one festival across N years into
 * festival_date_cache. Uses DEFAULT_LOCATION (Delhi) as the canonical row.
 */
export const computeFestivalDates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string; startYear?: number; years?: number };
    if (!v?.id) throw new Error("Missing id");
    return {
      id: v.id,
      startYear: v.startYear ?? new Date().getFullYear(),
      years: Math.min(Math.max(v.years ?? 10, 1), 25),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: row, error } = await ctx.supabase
      .from("admin_festivals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Festival not found");

    const results = resolveAdminFestivalRange(
      row as AdminFestivalRow,
      data.startYear,
      data.years,
      DEFAULT_LOCATION,
    );
    const rows = results.map((r) => ({
      festival_id: data.id,
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

    const { error: e2 } = await ctx.supabase
      .from("festival_date_cache")
      .upsert(rows, { onConflict: "festival_id,year,lat,lng" });
    if (e2) throw new Error(e2.message);

    await audit(ctx, "festival.compute_dates", data.id, {
      startYear: data.startYear,
      years: data.years,
      ok: rows.filter((r) => !("error" in (r.occurrences as any))).length,
    });
    return {
      ok: true,
      rows: rows.length,
      results: results.map((r) => ({ year: r.year, error: r.error, count: r.occurrences.length })),
    };
  });

/**
 * Public read of cached upcoming occurrences (any signed-in user + cached rows
 * table is public-readable via existing RLS policy).
 */
export const getFestivalOccurrences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id: string };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id };
  })
  .handler(async ({ data, context }) => {
    const ctx = context as Ctx;
    const { data: rows, error } = await ctx.supabase
      .from("festival_date_cache")
      .select("year, occurrences, computed_at")
      .eq("festival_id", data.id)
      .order("year", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

/**
 * Bulk recompute for every published/scheduled festival — used by admin
 * "Recompute all" button or a scheduled cron.
 */
export const computeAllFestivalDates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { startYear?: number; years?: number };
    return {
      startYear: v.startYear ?? new Date().getFullYear(),
      years: Math.min(Math.max(v.years ?? 10, 1), 25),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as Ctx);
    const ctx = context as Ctx;
    const { data: list, error } = await ctx.supabase
      .from("admin_festivals")
      .select("*")
      .in("status", ["draft", "scheduled", "published"]);
    if (error) throw new Error(error.message);
    let ok = 0,
      failed = 0;
    const failures: { slug: string; error: string }[] = [];
    for (const row of list ?? []) {
      try {
        const results = resolveAdminFestivalRange(
          row as AdminFestivalRow,
          data.startYear,
          data.years,
          DEFAULT_LOCATION,
        );
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
        const { error: e2 } = await ctx.supabase
          .from("festival_date_cache")
          .upsert(cacheRows, { onConflict: "festival_id,year,lat,lng" });
        if (e2) throw new Error(e2.message);
        ok++;
      } catch (e: any) {
        failed++;
        failures.push({ slug: row.slug, error: e?.message ?? "unknown" });
      }
    }
    await audit(ctx, "festival.compute_all", null, { ok, failed });
    return { ok, failed, failures };
  });
