/**
 * Legal & Compliance — public server functions.
 *
 * - getLegalPage(slug)      → published page body, SEO fields, TOC
 * - listLegalPages()        → all published pages (for indexes, footer)
 * - submitContactMessage()  → contact-us form submission
 * - listLegalVersions(slug) → staff-only page version history
 * - rollbackLegalPage(...)  → staff-only rollback to a prior version
 */

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const SlugSchema = z.object({ slug: z.string().trim().min(1).max(80) });

export const getLegalPage = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => SlugSchema.parse(raw))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: page, error } = await sb
      .from("legal_pages")
      .select(
        "id,slug,category,title,subtitle,summary,body_md,toc,seo_title,seo_description,seo_keywords,og_image,schema_type,effective_date,last_updated_at,published_at,version",
      )
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!page) return { page: null };
    return { page };
  });

export const listLegalPages = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("legal_pages")
    .select("slug,category,title,subtitle,sort_order,last_updated_at")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return { pages: data ?? [] };
});

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  subject: z.string().trim().max(200).optional(),
  topic: z
    .enum([
      "support",
      "bug",
      "feature",
      "partnership",
      "media",
      "business",
      "general",
      "privacy",
      "copyright",
    ])
    .default("general"),
  message: z.string().trim().min(10).max(4000),
  page_url: z.string().trim().max(500).optional(),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => ContactSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("legal_contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        topic: data.topic,
        message: data.message,
        page_url: data.page_url ?? null,
        status: "new",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Notify all admins / super_admins
    try {
      const { data: staff } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .in("role", ["admin", "super_admin"] as any);
      const adminIds = Array.from(new Set((staff ?? []).map((r: any) => r.user_id)));
      if (adminIds.length) {
        const preview = data.message.length > 140 ? `${data.message.slice(0, 140)}…` : data.message;
        const rows = adminIds.map((uid) => ({
          user_id: uid,
          title: `New contact message: ${data.topic}`,
          body: `From ${data.name} <${data.email}>\n${preview}`,
          link: "/admin/legal-inbox",
          category: "system",
          read: false,
        }));
        await supabaseAdmin.from("notifications").insert(rows);
      }
    } catch {
      // don't fail the submission if notification fanout fails
    }

    return { ok: true as const, id: inserted?.id };
  });

// ---------- Staff: version history & rollback ----------

export const listLegalVersions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => SlugSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const sb = (context as any).supabase;
    const { data: page } = await sb
      .from("legal_pages")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!page) return { versions: [] };
    const { data: versions, error } = await sb
      .from("legal_page_versions")
      .select("id,version,locale,title,change_note,effective_date,created_at,created_by")
      .eq("page_id", page.id)
      .order("version", { ascending: false });
    if (error) throw new Error(error.message);
    return { versions: versions ?? [] };
  });

export const snapshotLegalVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ slug: z.string().min(1), change_note: z.string().max(500).optional() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const sb = (context as any).supabase;
    const userId = (context as any).userId as string;
    const { data: page, error: perr } = await sb
      .from("legal_pages")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (perr) throw new Error(perr.message);
    if (!page) throw new Error("Page not found");
    const nextVersion = (page.version ?? 1) + 1;
    const { error } = await sb.from("legal_page_versions").insert({
      page_id: page.id,
      version: nextVersion,
      locale: "en",
      title: page.title,
      body_md: page.body_md,
      seo_title: page.seo_title,
      seo_description: page.seo_description,
      effective_date: page.effective_date,
      snapshot: page,
      change_note: data.change_note ?? null,
      created_by: userId,
    });
    if (error) throw new Error(error.message);
    await sb.from("legal_pages").update({ version: nextVersion }).eq("id", page.id);
    return { ok: true, version: nextVersion };
  });

export const rollbackLegalPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ slug: z.string().min(1), version: z.number().int().positive() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const sb = (context as any).supabase;
    const { data: page } = await sb
      .from("legal_pages")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!page) throw new Error("Page not found");
    const { data: snap, error: verr } = await sb
      .from("legal_page_versions")
      .select("*")
      .eq("page_id", page.id)
      .eq("version", data.version)
      .maybeSingle();
    if (verr) throw new Error(verr.message);
    if (!snap) throw new Error("Version not found");
    const { error } = await sb
      .from("legal_pages")
      .update({
        title: snap.title,
        body_md: snap.body_md,
        seo_title: snap.seo_title,
        seo_description: snap.seo_description,
        effective_date: snap.effective_date,
        last_updated_at: new Date().toISOString(),
      })
      .eq("id", page.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
