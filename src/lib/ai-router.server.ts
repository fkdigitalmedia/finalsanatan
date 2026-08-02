/**
 * AI Router — server-side, provider-agnostic.
 *
 * Resolves the right provider (feature mapping -> default -> priority list),
 * calls it via the correct wire protocol (OpenAI-compatible or Anthropic
 * messages), retries + fails over across the priority list, logs every
 * attempt to ai_usage_logs.
 *
 * NEVER import this file from client code.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface AiProviderRow {
  id: string;
  name: string;
  provider_type: string;
  base_url: string | null;
  api_key: string | null;
  organization_id: string | null;
  project_id: string | null;
  default_model: string | null;
  temperature: number | null;
  top_p: number | null;
  max_tokens: number | null;
  timeout_ms: number | null;
  retry_attempts: number;
  retry_delay_ms: number;
  custom_headers: Record<string, string>;
  custom_params: Record<string, unknown>;
  priority: number;
  enabled: boolean;
  is_default: boolean;
  status: string;
}

export interface AiCallInput {
  feature: string;
  system?: string;
  prompt: string;
  overrideModel?: string;
  userId?: string | null;
  maxTokens?: number;
}

export interface AiCallResult {
  text: string;
  provider: string;
  model: string;
  latencyMs: number;
  tokens: { input?: number; output?: number; total?: number };
}

function admin(): SupabaseClient {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function apiKeyFor(p: AiProviderRow): string | null {
  if (p.api_key && p.api_key.trim()) return p.api_key.trim();
  // Environment-variable fallback keyed by provider_type.
  const envMap: Record<string, string | undefined> = {
    lovable: process.env.LOVABLE_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    groq: process.env.GROQ_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    cohere: process.env.COHERE_API_KEY,
  };
  return envMap[p.provider_type] ?? null;
}

function authHeaders(p: AiProviderRow, key: string): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (p.provider_type === "lovable") {
    h["Lovable-API-Key"] = key;
    h["X-Lovable-AIG-SDK"] = "sanatan-router";
  } else if (p.provider_type === "anthropic") {
    h["x-api-key"] = key;
    h["anthropic-version"] = "2023-06-01";
  } else {
    h["Authorization"] = `Bearer ${key}`;
  }
  if (p.provider_type === "openai" && p.organization_id)
    h["OpenAI-Organization"] = p.organization_id;
  if (p.provider_type === "openai" && p.project_id) h["OpenAI-Project"] = p.project_id;
  return { ...h, ...(p.custom_headers ?? {}) };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function callOnce(
  p: AiProviderRow,
  model: string,
  system: string | undefined,
  prompt: string,
  maxTokensOverride?: number,
): Promise<{
  text: string;
  usage?: { input?: number; output?: number; total?: number };
}> {
  const key = apiKeyFor(p);
  if (!key) throw new Error(`No API key configured for ${p.name}`);
  const timeout = p.timeout_ms ?? 60000;

  if (p.provider_type === "anthropic") {
    const url = `${(p.base_url ?? "https://api.anthropic.com/v1").replace(/\/$/, "")}/messages`;
    const body = {
      model,
      max_tokens: maxTokensOverride ?? p.max_tokens ?? 2048,
      temperature: p.temperature ?? undefined,
      top_p: p.top_p ?? undefined,
      system,
      messages: [{ role: "user", content: prompt }],
      ...(p.custom_params ?? {}),
    };
    const res = await fetchWithTimeout(
      url,
      { method: "POST", headers: authHeaders(p, key), body: JSON.stringify(body) },
      timeout,
    );
    if (!res.ok) throw new Error(`${p.name} ${res.status}: ${(await res.text()).slice(0, 400)}`);
    const data: any = await res.json();
    const text = (data.content ?? [])
      .map((c: any) => c.text ?? "")
      .join("")
      .trim();
    return {
      text,
      usage: {
        input: data.usage?.input_tokens,
        output: data.usage?.output_tokens,
        total: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
      },
    };
  }

  // OpenAI-compatible (lovable, openai, gemini, deepseek, groq, openrouter, mistral, cohere, custom)
  const url = `${(p.base_url ?? "https://api.openai.com/v1").replace(/\/$/, "")}/chat/completions`;
  const messages: any[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: p.temperature ?? undefined,
    top_p: p.top_p ?? undefined,
    max_tokens: maxTokensOverride ?? p.max_tokens ?? undefined,
    ...(p.custom_params ?? {}),
  };
  const res = await fetchWithTimeout(
    url,
    { method: "POST", headers: authHeaders(p, key), body: JSON.stringify(body) },
    timeout,
  );
  if (!res.ok) throw new Error(`${p.name} ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const data: any = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  return {
    text,
    usage: {
      input: data.usage?.prompt_tokens,
      output: data.usage?.completion_tokens,
      total: data.usage?.total_tokens,
    },
  };
}

async function logUsage(row: {
  provider?: AiProviderRow | null;
  model: string;
  feature: string;
  userId?: string | null;
  usage?: { input?: number; output?: number; total?: number };
  latencyMs: number;
  success: boolean;
  error?: string;
}) {
  try {
    const sb = admin();
    const cost = costEstimate(row.provider?.provider_type, row.model, row.usage);
    await sb.from("ai_usage_logs").insert({
      provider_id: row.provider?.id ?? null,
      provider_name: row.provider?.name ?? null,
      model_name: row.model,
      feature_key: row.feature,
      user_id: row.userId ?? null,
      input_tokens: row.usage?.input ?? null,
      output_tokens: row.usage?.output ?? null,
      total_tokens: row.usage?.total ?? null,
      latency_ms: row.latencyMs,
      cost_estimate: cost,
      success: row.success,
      error_message: row.error ?? null,
    });
  } catch {
    // swallow — logging must never break a request
  }
}

function costEstimate(
  _type: string | undefined,
  _model: string,
  usage?: { input?: number; output?: number },
): number | null {
  // Optional model-level pricing lives in ai_models; for a fast baseline
  // approximation with unknown per-model pricing we return null and let the
  // usage dashboard aggregate only when ai_models.input/output_cost_per_1k is set.
  if (!usage) return null;
  return null;
}

async function resolveChain(
  feature: string,
  sb: SupabaseClient,
): Promise<{ provider: AiProviderRow; model: string }[]> {
  // 1. Feature mapping (if any).
  const { data: mapping } = await sb
    .from("ai_feature_mappings")
    .select("provider_id, model_name, fallback_provider_ids, enabled")
    .eq("feature_key", feature)
    .eq("enabled", true)
    .maybeSingle();

  // 2. All enabled providers, sorted by priority.
  const { data: providers } = await sb
    .from("ai_providers")
    .select("*")
    .eq("enabled", true)
    .order("priority", { ascending: true });
  const all = (providers ?? []) as AiProviderRow[];
  if (!all.length) return [];

  const byId = new Map(all.map((p) => [p.id, p]));
  const chain: { provider: AiProviderRow; model: string }[] = [];

  if (mapping?.provider_id) {
    const primary = byId.get(mapping.provider_id);
    if (primary)
      chain.push({ provider: primary, model: mapping.model_name || primary.default_model || "" });
    for (const fid of mapping.fallback_provider_ids ?? []) {
      const p = byId.get(fid);
      if (p) chain.push({ provider: p, model: p.default_model || "" });
    }
  }

  // Append remaining enabled providers (default first, then priority order) as final fallbacks.
  const seen = new Set(chain.map((c) => c.provider.id));
  const rest = [...all].sort(
    (a, b) => Number(b.is_default) - Number(a.is_default) || a.priority - b.priority,
  );
  for (const p of rest)
    if (!seen.has(p.id)) chain.push({ provider: p, model: p.default_model || "" });

  return chain.filter((c) => c.model);
}

/** Main entry point. Handles retries + failover + logging. */
export async function callAi(input: AiCallInput): Promise<AiCallResult> {
  const sb = admin();
  const chain = await resolveChain(input.feature, sb);
  if (!chain.length)
    throw new Error("No enabled AI providers configured. Add one in Admin → AI Providers.");

  let lastError: string | null = null;

  for (const link of chain) {
    const model = input.overrideModel || link.model;
    const attempts = Math.max(1, link.provider.retry_attempts ?? 1);
    for (let attempt = 0; attempt < attempts; attempt++) {
      const started = Date.now();
      try {
        const { text, usage } = await callOnce(
          link.provider,
          model,
          input.system,
          input.prompt,
          input.maxTokens,
        );
        const latencyMs = Date.now() - started;
        await logUsage({
          provider: link.provider,
          model,
          feature: input.feature,
          userId: input.userId,
          usage,
          latencyMs,
          success: true,
        });
        return { text, provider: link.provider.name, model, latencyMs, tokens: usage ?? {} };
      } catch (err) {
        const latencyMs = Date.now() - started;
        lastError = err instanceof Error ? err.message : String(err);
        await logUsage({
          provider: link.provider,
          model,
          feature: input.feature,
          userId: input.userId,
          latencyMs,
          success: false,
          error: lastError,
        });
        if (attempt < attempts - 1) {
          await new Promise((r) => setTimeout(r, link.provider.retry_delay_ms ?? 500));
        }
      }
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError ?? "unknown"}`);
}

/** Quick connectivity probe — used by the admin "Test Connection" button. */
export async function testProvider(
  providerId: string,
): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const sb = admin();
  const { data, error } = await sb.from("ai_providers").select("*").eq("id", providerId).single();
  if (error || !data)
    return { ok: false, message: error?.message || "Provider not found", latencyMs: 0 };
  const p = data as AiProviderRow;
  const model = p.default_model || "";
  if (!model) return { ok: false, message: "No default model set", latencyMs: 0 };
  const started = Date.now();
  try {
    const { text } = await callOnce(p, model, "Reply with the single word: OK", "Say OK.");
    const latencyMs = Date.now() - started;
    await sb
      .from("ai_providers")
      .update({ status: "healthy", last_tested_at: new Date().toISOString() })
      .eq("id", providerId);
    return { ok: true, message: text.slice(0, 200) || "OK", latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const message = err instanceof Error ? err.message : String(err);
    await sb
      .from("ai_providers")
      .update({ status: "error", last_tested_at: new Date().toISOString() })
      .eq("id", providerId);
    return { ok: false, message, latencyMs };
  }
}
