/**
 * Server functions for the AI Provider admin panel.
 * Staff-only. All mutations go through requireSupabaseAuth + assertStaff.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

// ---------- list ----------

export const aiListProviders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as any);
    const { data, error } = await (context as any).supabase
      .from("ai_providers")
      .select("*")
      .order("priority", { ascending: true });
    if (error) throw new Error(error.message);
    // Mask keys for the UI
    return (data ?? []).map((p: any) => ({
      ...p,
      api_key_masked: p.api_key ? `${p.api_key.slice(0, 4)}••••${p.api_key.slice(-4)}` : null,
      api_key: undefined,
    }));
  });

export const aiListModels = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as any);
    const { data, error } = await (context as any).supabase
      .from("ai_models")
      .select("*, ai_providers!inner(name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const aiListMappings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as any);
    const { data, error } = await (context as any).supabase
      .from("ai_feature_mappings")
      .select("*")
      .order("feature_key", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ---------- reorder priority ----------

const ReorderInput = z.object({
  ordered_ids: z.array(z.string().uuid()),
});
export const aiReorderProviders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ReorderInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    let priority = 10;
    for (const id of data.ordered_ids) {
      const { error } = await (context as any).supabase
        .from("ai_providers")
        .update({ priority })
        .eq("id", id);
      if (error) throw new Error(error.message);
      priority += 10;
    }
    return { ok: true };
  });

// ---------- set default ----------

const SetDefaultInput = z.object({ id: z.string().uuid() });
export const aiSetDefaultProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SetDefaultInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    await (context as any).supabase
      .from("ai_providers")
      .update({ is_default: false })
      .neq("id", data.id);
    const { error } = await (context as any).supabase
      .from("ai_providers")
      .update({ is_default: true, enabled: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- test connection ----------

const TestInput = z.object({ id: z.string().uuid() });
export const aiTestProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => TestInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { testProvider } = await import("@/lib/ai-router.server");
    return await testProvider(data.id);
  });

// ---------- usage stats ----------

const StatsInput = z.object({ days: z.number().int().min(1).max(90).default(30) });
export const aiUsageStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => StatsInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const since = new Date(Date.now() - data.days * 86400_000).toISOString();
    const sb = (context as any).supabase;
    const { data: rows, error } = await sb
      .from("ai_usage_logs")
      .select(
        "provider_name, model_name, feature_key, total_tokens, latency_ms, success, cost_estimate, created_at",
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);
    const list = rows ?? [];
    const total = list.length;
    const success = list.filter((r: any) => r.success).length;
    const tokens = list.reduce((a: number, r: any) => a + (r.total_tokens ?? 0), 0);
    const cost = list.reduce((a: number, r: any) => a + (Number(r.cost_estimate) || 0), 0);
    const avgLatency = list.length
      ? Math.round(list.reduce((a: number, r: any) => a + (r.latency_ms ?? 0), 0) / list.length)
      : 0;

    const byProvider: Record<
      string,
      { requests: number; success: number; tokens: number; latency: number }
    > = {};
    for (const r of list as any[]) {
      const key = r.provider_name || "unknown";
      const b = (byProvider[key] ??= { requests: 0, success: 0, tokens: 0, latency: 0 });
      b.requests++;
      if (r.success) b.success++;
      b.tokens += r.total_tokens ?? 0;
      b.latency += r.latency_ms ?? 0;
    }
    for (const k of Object.keys(byProvider)) {
      byProvider[k].latency = Math.round(
        byProvider[k].latency / Math.max(1, byProvider[k].requests),
      );
    }

    return {
      total,
      success,
      failures: total - success,
      successRate: total ? Math.round((success / total) * 1000) / 10 : 0,
      totalTokens: tokens,
      estimatedCost: Math.round(cost * 10000) / 10000,
      avgLatencyMs: avgLatency,
      byProvider,
      recent: list.slice(0, 50),
    };
  });

// ---------- upsert provider (with real api_key) ----------

const UpsertProviderInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  provider_type: z.string().min(1),
  base_url: z.string().nullable().optional(),
  api_key: z.string().nullable().optional(),
  organization_id: z.string().nullable().optional(),
  project_id: z.string().nullable().optional(),
  default_model: z.string().nullable().optional(),
  temperature: z.number().nullable().optional(),
  top_p: z.number().nullable().optional(),
  max_tokens: z.number().int().nullable().optional(),
  timeout_ms: z.number().int().nullable().optional(),
  streaming: z.boolean().optional(),
  retry_attempts: z.number().int().optional(),
  retry_delay_ms: z.number().int().optional(),
  custom_headers: z.record(z.string(), z.string()).optional(),
  custom_params: z.record(z.string(), z.any()).optional(),
  priority: z.number().int().optional(),
  enabled: z.boolean().optional(),
  notes: z.string().nullable().optional(),
});
export const aiUpsertProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpsertProviderInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const payload: any = { ...data };
    // If api_key is empty string, treat as "leave unchanged" on update — remove field.
    if (data.id && (data.api_key === "" || data.api_key == null)) delete payload.api_key;
    const q = (context as any).supabase.from("ai_providers");
    const { data: saved, error } = data.id
      ? await q.update(payload).eq("id", data.id).select("id, name").single()
      : await q.insert(payload).select("id, name").single();
    if (error) throw new Error(error.message);
    return saved;
  });

const DeleteInput = z.object({ id: z.string().uuid() });
export const aiDeleteProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => DeleteInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { error } = await (context as any).supabase
      .from("ai_providers")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
