/**
 * Translation Management System — server functions.
 *
 * All mutations are admin-only. Reads that power the public site
 * (`getPublicOverrides`) go through the anon publishable client and are
 * limited by the "public reads approved translations" RLS policy.
 */

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { LANGUAGE_CODES } from "@/i18n/config";

// ---------- Helpers ----------

function makePublicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
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

async function assertAdmin(ctx: {
  supabase: ReturnType<typeof createClient<Database>>;
  userId: string;
}) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

function isValidLang(lang: string): boolean {
  return LANGUAGE_CODES.includes(lang);
}

// ---------- Public read (used by I18nProvider) ----------

export const getPublicOverrides = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const v = raw as { lang?: string };
    if (!v?.lang || !isValidLang(v.lang)) throw new Error("Invalid language");
    return { lang: v.lang };
  })
  .handler(async ({ data }) => {
    const supabase = makePublicClient();
    const { data: rows, error } = await supabase
      .from("translations")
      .select("key,value")
      .eq("lang", data.lang)
      .eq("status", "approved");
    if (error) throw new Error(error.message);
    const map: Record<string, string> = {};
    for (const r of rows ?? []) map[r.key] = r.value;
    return { lang: data.lang, overrides: map };
  });

// ---------- Admin: list / search ----------

export const listTranslations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as {
      lang?: string;
      search?: string;
      status?: "all" | "draft" | "approved";
      limit?: number;
    };
    return {
      lang: v.lang && isValidLang(v.lang) ? v.lang : undefined,
      search: (v.search ?? "").trim().slice(0, 200),
      status: v.status ?? "all",
      limit: Math.min(Math.max(v.limit ?? 500, 1), 2000),
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("translations")
      .select("id,lang,key,value,status,version,updated_at,updated_by")
      .order("updated_at", { ascending: false })
      .limit(data.limit);
    if (data.lang) q = q.eq("lang", data.lang);
    if (data.status !== "all") q = q.eq("status", data.status);
    if (data.search) q = q.or(`key.ilike.%${data.search}%,value.ilike.%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

// ---------- Admin: upsert ----------

export const upsertTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { lang?: string; key?: string; value?: string; status?: string };
    if (!v?.lang || !isValidLang(v.lang)) throw new Error("Invalid language");
    if (!v?.key || v.key.length > 300) throw new Error("Invalid key");
    if (typeof v.value !== "string" || v.value.length > 8000) throw new Error("Invalid value");
    const status = v.status === "draft" ? "draft" : "approved";
    return { lang: v.lang, key: v.key.trim(), value: v.value, status };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: existing } = await context.supabase
      .from("translations")
      .select("id,version")
      .eq("lang", data.lang)
      .eq("key", data.key)
      .maybeSingle();

    const nextVersion = (existing?.version ?? 0) + 1;
    const { data: row, error } = await context.supabase
      .from("translations")
      .upsert(
        {
          lang: data.lang,
          key: data.key,
          value: data.value,
          status: data.status,
          version: nextVersion,
          updated_by: context.userId,
        },
        { onConflict: "lang,key" },
      )
      .select()
      .single();
    if (error) throw new Error(error.message);

    await context.supabase.from("translation_versions").insert({
      translation_id: row.id,
      lang: row.lang,
      key: row.key,
      value: row.value,
      version: row.version,
      source: "manual",
      updated_by: context.userId,
    });
    return { row };
  });

// ---------- Admin: delete ----------

export const deleteTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { id?: string };
    if (!v?.id) throw new Error("Missing id");
    return { id: v.id };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("translations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Admin: versions / rollback ----------

export const listVersions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { translationId?: string };
    if (!v?.translationId) throw new Error("Missing translationId");
    return { translationId: v.translationId };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("translation_versions")
      .select("id,version,value,source,updated_by,created_at")
      .eq("translation_id", data.translationId)
      .order("version", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { versions: rows ?? [] };
  });

export const rollbackTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { versionId?: string };
    if (!v?.versionId) throw new Error("Missing versionId");
    return { versionId: v.versionId };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: version, error: e1 } = await context.supabase
      .from("translation_versions")
      .select("translation_id,value,lang,key")
      .eq("id", data.versionId)
      .single();
    if (e1) throw new Error(e1.message);

    const { data: current, error: e2 } = await context.supabase
      .from("translations")
      .select("version")
      .eq("id", version.translation_id)
      .single();
    if (e2) throw new Error(e2.message);

    const nextVersion = current.version + 1;
    const { error: e3 } = await context.supabase
      .from("translations")
      .update({
        value: version.value,
        version: nextVersion,
        updated_by: context.userId,
      })
      .eq("id", version.translation_id);
    if (e3) throw new Error(e3.message);

    await context.supabase.from("translation_versions").insert({
      translation_id: version.translation_id,
      lang: version.lang,
      key: version.key,
      value: version.value,
      version: nextVersion,
      source: "rollback",
      updated_by: context.userId,
    });
    return { ok: true };
  });

// ---------- Admin: import / export ----------

export const exportTranslations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { lang?: string };
    if (!v?.lang || !isValidLang(v.lang)) throw new Error("Invalid language");
    return { lang: v.lang };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("translations")
      .select("key,value,status")
      .eq("lang", data.lang);
    if (error) throw new Error(error.message);
    const flat: Record<string, string> = {};
    for (const r of rows ?? []) flat[r.key] = r.value;
    return { lang: data.lang, count: rows?.length ?? 0, translations: flat };
  });

export const importTranslations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { lang?: string; entries?: Record<string, string>; status?: string };
    if (!v?.lang || !isValidLang(v.lang)) throw new Error("Invalid language");
    if (!v.entries || typeof v.entries !== "object") throw new Error("Invalid entries");
    const cleaned: Record<string, string> = {};
    for (const [k, val] of Object.entries(v.entries)) {
      if (typeof val !== "string") continue;
      if (k.length === 0 || k.length > 300) continue;
      if (val.length > 8000) continue;
      cleaned[k] = val;
    }
    const status = v.status === "draft" ? "draft" : "approved";
    return { lang: v.lang, entries: cleaned, status };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const rows = Object.entries(data.entries).map(([key, value]) => ({
      lang: data.lang,
      key,
      value,
      status: data.status,
      version: 1,
      updated_by: context.userId,
    }));
    if (rows.length === 0) return { ok: true, inserted: 0 };
    const { data: upserted, error } = await context.supabase
      .from("translations")
      .upsert(rows, { onConflict: "lang,key" })
      .select("id,lang,key,value,version");
    if (error) throw new Error(error.message);

    // Record each import as a version entry for audit.
    if (upserted?.length) {
      await context.supabase.from("translation_versions").insert(
        upserted.map((r) => ({
          translation_id: r.id,
          lang: r.lang,
          key: r.key,
          value: r.value,
          version: r.version,
          source: "import",
          updated_by: context.userId,
        })),
      );
    }
    return { ok: true, inserted: upserted?.length ?? 0 };
  });

// ---------- Admin: AI translation queue ----------

export const enqueueForAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      lang?: string;
      items?: { key: string; source_value: string }[];
    };
    if (!v?.lang || !isValidLang(v.lang)) throw new Error("Invalid language");
    if (!Array.isArray(v.items) || v.items.length === 0) throw new Error("No items");
    const items = v.items
      .filter(
        (it) =>
          it &&
          typeof it.key === "string" &&
          it.key.length <= 300 &&
          typeof it.source_value === "string" &&
          it.source_value.length <= 8000,
      )
      .slice(0, 200);
    return { lang: v.lang, items };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const rows = data.items.map((it) => ({
      lang: data.lang,
      key: it.key,
      source_lang: "en",
      source_value: it.source_value,
      status: "pending" as const,
      requested_by: context.userId,
    }));
    const { error } = await context.supabase
      .from("translation_queue")
      .upsert(rows, { onConflict: "lang,key" });
    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });

export const listQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { status?: string; lang?: string; limit?: number };
    return {
      status: v.status,
      lang: v.lang && isValidLang(v.lang) ? v.lang : undefined,
      limit: Math.min(Math.max(v.limit ?? 200, 1), 1000),
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("translation_queue")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.lang) q = q.eq("lang", data.lang);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

/** Process up to N pending queue rows: call Lovable AI, store suggestion, mark ready_for_review. */
export const processQueueBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { limit?: number };
    return { limit: Math.min(Math.max(v.limit ?? 20, 1), 50) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { data: pending, error } = await context.supabase
      .from("translation_queue")
      .select("id,lang,key,source_value")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    if (!pending?.length) return { processed: 0 };

    let processed = 0;
    let errors = 0;
    for (const row of pending) {
      await context.supabase
        .from("translation_queue")
        .update({ status: "processing" })
        .eq("id", row.id);

      try {
        const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            temperature: 0.2,
            messages: [
              {
                role: "system",
                content: `You are a professional translator for a Sanatan Dharma / Hindu spiritual utilities web platform. Translate the provided English UI string into the target language while preserving: proper nouns of deities/festivals, {{variable}} placeholders, HTML tags, punctuation and tone. Respond with the translation only — no quotes, no explanation.`,
              },
              {
                role: "user",
                content: `Target language code: ${row.lang}\nEnglish source:\n${row.source_value}`,
              },
            ],
          }),
        });
        if (!r.ok) {
          const body = await r.text();
          throw new Error(`AI Gateway ${r.status}: ${body.slice(0, 200)}`);
        }
        const json = (await r.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const suggestion = json.choices?.[0]?.message?.content?.trim() ?? "";
        if (!suggestion) throw new Error("Empty AI response");
        await context.supabase
          .from("translation_queue")
          .update({
            status: "ready_for_review",
            suggested_value: suggestion,
            error_message: null,
          })
          .eq("id", row.id);
        processed += 1;
      } catch (err) {
        errors += 1;
        await context.supabase
          .from("translation_queue")
          .update({
            status: "error",
            error_message: err instanceof Error ? err.message : String(err),
          })
          .eq("id", row.id);
      }
    }
    return { processed, errors };
  });

export const reviewQueueItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      id?: string;
      decision?: "approve" | "reject";
      override_value?: string;
    };
    if (!v?.id) throw new Error("Missing id");
    if (v.decision !== "approve" && v.decision !== "reject") throw new Error("Invalid decision");
    return {
      id: v.id,
      decision: v.decision,
      override_value:
        typeof v.override_value === "string" && v.override_value.length <= 8000
          ? v.override_value
          : undefined,
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: item, error } = await context.supabase
      .from("translation_queue")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    if (data.decision === "reject") {
      await context.supabase
        .from("translation_queue")
        .update({ status: "rejected", reviewed_by: context.userId })
        .eq("id", data.id);
      return { ok: true };
    }

    const value = data.override_value ?? item.suggested_value;
    if (!value) throw new Error("No translation to approve");

    // Promote into translations table (upsert + version)
    const { data: existing } = await context.supabase
      .from("translations")
      .select("id,version")
      .eq("lang", item.lang)
      .eq("key", item.key)
      .maybeSingle();
    const nextVersion = (existing?.version ?? 0) + 1;
    const { data: row, error: upErr } = await context.supabase
      .from("translations")
      .upsert(
        {
          lang: item.lang,
          key: item.key,
          value,
          status: "approved",
          version: nextVersion,
          updated_by: context.userId,
        },
        { onConflict: "lang,key" },
      )
      .select()
      .single();
    if (upErr) throw new Error(upErr.message);

    await context.supabase.from("translation_versions").insert({
      translation_id: row.id,
      lang: row.lang,
      key: row.key,
      value: row.value,
      version: row.version,
      source: "ai",
      updated_by: context.userId,
    });

    await context.supabase
      .from("translation_queue")
      .update({ status: "approved", reviewed_by: context.userId })
      .eq("id", data.id);
    return { ok: true };
  });

// ---------- Admin: missing-translation detector ----------

/**
 * Given a set of source keys (from the current en.json bundle), returns the
 * keys that are NOT yet present in the given language's translations table.
 * Useful for surfacing coverage gaps in the admin panel.
 */
export const detectMissingKeys = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { lang?: string; keys?: string[] };
    if (!v?.lang || !isValidLang(v.lang)) throw new Error("Invalid language");
    if (!Array.isArray(v.keys)) throw new Error("Invalid keys");
    return { lang: v.lang, keys: v.keys.slice(0, 5000) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("translations")
      .select("key")
      .eq("lang", data.lang)
      .eq("status", "approved");
    if (error) throw new Error(error.message);
    const present = new Set((rows ?? []).map((r) => r.key));
    const missing = data.keys.filter((k) => !present.has(k));
    return { lang: data.lang, total: data.keys.length, missing };
  });
