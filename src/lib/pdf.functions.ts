/**
 * Server functions for the Universal PDF Report Engine.
 * Template + theme management is staff-only; saved reports are per-user.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

// ---------- templates ----------

export const pdfListTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as any);
    const { data, error } = await (context as any).supabase
      .from("pdf_templates")
      .select("*")
      .order("report", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const TemplateInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  report: z.string().min(1).max(80),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  language: z.string().min(2).max(8).default("en"),
  theme: z.string().min(1).max(60).default("premium"),
  config: z.record(z.string(), z.unknown()).default({}),
  sections: z.array(z.record(z.string(), z.unknown())).default([]),
  is_default: z.boolean().default(false),
});

export const pdfUpsertTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => TemplateInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = (context as any).supabase;
    const payload = { ...data } as Record<string, unknown>;
    if (data.id) {
      const { data: row, error } = await supabase
        .from("pdf_templates")
        .update({ ...payload, version: undefined })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    delete payload.id;
    const { data: row, error } = await supabase
      .from("pdf_templates")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const pdfSetTemplateStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["draft", "published", "archived"]) })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { data: row, error } = await (context as any).supabase
      .from("pdf_templates")
      .update({ status: data.status })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const pdfDuplicateTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = (context as any).supabase;
    const { data: src, error } = await supabase
      .from("pdf_templates")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    const { id, created_at, updated_at, ...rest } = src as Record<string, unknown>;
    void id;
    void created_at;
    void updated_at;
    const { data: row, error: insertError } = await supabase
      .from("pdf_templates")
      .insert({
        ...rest,
        name: `${src.name} (copy)`,
        status: "draft",
        version: 1,
        is_default: false,
      })
      .select()
      .single();
    if (insertError) throw new Error(insertError.message);
    return row;
  });

export const pdfDeleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { error } = await (context as any).supabase
      .from("pdf_templates")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Public: the published template + enabled themes used by the client engine. */
export const pdfGetPublishedTemplate = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ report: z.string().min(1).max(80) }).parse(i))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const [{ data: template }, { data: themes }] = await Promise.all([
      supabase
        .from("pdf_templates")
        .select("id,name,report,status,version,language,theme,config,sections")
        .eq("report", data.report)
        .eq("status", "published")
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("pdf_themes").select("name,label,config").eq("enabled", true),
    ]);
    return { template: template ?? null, themes: themes ?? [] };
  });

// ---------- themes ----------

export const pdfListThemes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as any);
    const { data, error } = await (context as any).supabase
      .from("pdf_themes")
      .select("*")
      .order("label", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const pdfUpsertTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().min(1).max(60),
        label: z.string().min(1).max(80),
        config: z.record(z.string(), z.unknown()).default({}),
        enabled: z.boolean().default(true),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { data: row, error } = await (context as any).supabase
      .from("pdf_themes")
      .upsert(data, { onConflict: "name" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const pdfDeleteTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { error } = await (context as any).supabase.from("pdf_themes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- saved reports ----------

export const pdfListReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context as any).supabase
      .from("pdf_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const pdfSaveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        report: z.string().min(1).max(80),
        template_id: z.string().uuid().optional(),
        title: z.string().min(1).max(160),
        filename: z.string().min(1).max(160),
        language: z.string().min(2).max(8).default("en"),
        pages: z.number().int().min(0).max(2000).default(0),
        bytes: z.number().int().min(0).default(0),
        storage_path: z.string().max(400).optional(),
        meta: z.record(z.string(), z.unknown()).default({}),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await (context as any).supabase
      .from("pdf_reports")
      .insert({ ...data, user_id: (context as any).userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const pdfDeleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await (context as any).supabase
      .from("pdf_reports")
      .delete()
      .eq("id", data.id)
      .eq("user_id", (context as any).userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
