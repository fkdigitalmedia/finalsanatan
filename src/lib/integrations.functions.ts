import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// ---------- Public (unauthenticated) ---------------------------------------
export const getPublicIntegrations = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const supa = createClient<Database>(url, key, {
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
  const { data, error } = await supa.rpc("get_public_integrations");
  if (error) return { ga4_measurement_id: "", clarity_project_id: "" };
  return (data ?? { ga4_measurement_id: "", clarity_project_id: "" }) as {
    ga4_measurement_id: string;
    clarity_project_id: string;
  };
});

// ---------- Admin: list all integration settings ---------------------------
export const getAdminIntegrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("integration_settings")
      .select("key, config, enabled, updated_at")
      .order("key");
    if (error) throw error;
    return data ?? [];
  });

// ---------- Admin: upsert one integration ----------------------------------
export const upsertAdminIntegration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        key: z.string().min(1).max(64),
        config: z.record(z.string(), z.any()),
        enabled: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("integration_settings").upsert({
      key: data.key,
      config: data.config,
      enabled: data.enabled,
      updated_by: context.userId,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return { ok: true };
  });

// ---------- Google Search Console (via connector gateway) ------------------
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

async function gscFetch(path: string, init?: RequestInit) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gscKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableKey || !gscKey) {
    throw new Error("Google Search Console is not connected. Ask the assistant to connect it.");
  }
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gscKey,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GSC ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

export const getGscStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden");
    if (!process.env.LOVABLE_API_KEY || !process.env.GOOGLE_SEARCH_CONSOLE_API_KEY) {
      return { connected: false, sites: [] as { siteUrl: string; permissionLevel: string }[] };
    }
    try {
      const data = await gscFetch("/webmasters/v3/sites");
      return {
        connected: true,
        sites: ((data.siteEntry as Array<{ siteUrl: string; permissionLevel: string }>) ?? []).map(
          (s) => ({ siteUrl: s.siteUrl, permissionLevel: s.permissionLevel }),
        ),
      };
    } catch (e) {
      return {
        connected: false,
        sites: [] as { siteUrl: string; permissionLevel: string }[],
        error: e instanceof Error ? e.message : String(e),
      };
    }
  });

const gscQueryInput = z.object({
  siteUrl: z.string().min(1),
  days: z.number().int().min(1).max(90).default(28),
  dimension: z.enum(["query", "page", "country", "device"]).default("query"),
  rowLimit: z.number().int().min(1).max(1000).default(25),
});

export const getGscAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => gscQueryInput.parse(i))
  .handler(async ({ context, data }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden");
    const end = new Date();
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - data.days);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const encoded = encodeURIComponent(data.siteUrl);
    const body = {
      startDate: iso(start),
      endDate: iso(end),
      dimensions: [data.dimension],
      rowLimit: data.rowLimit,
    };
    const res = await gscFetch(`/webmasters/v3/sites/${encoded}/searchAnalytics/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    type Row = {
      keys: string[];
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
    const rows: Row[] = res.rows ?? [];
    const totals = rows.reduce(
      (a, r) => ({
        clicks: a.clicks + (r.clicks || 0),
        impressions: a.impressions + (r.impressions || 0),
      }),
      { clicks: 0, impressions: 0 },
    );
    return {
      rows: rows.map((r) => ({
        key: r.keys[0] ?? "",
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      totals,
    };
  });
