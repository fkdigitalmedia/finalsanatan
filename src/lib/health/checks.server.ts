// Health checks — server-only probes used by /health, /status, /ready.

import { logger } from "@/lib/logging";

export type ComponentStatus = "ok" | "degraded" | "down" | "skipped";

export interface ComponentHealth {
  name: string;
  status: ComponentStatus;
  latencyMs?: number;
  detail?: string;
}

export interface HealthReport {
  status: "ok" | "degraded" | "down";
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  components: ComponentHealth[];
}

const BOOT_AT = Date.now();

function env(name: string): string | undefined {
  try {
    return process.env?.[name];
  } catch {
    return undefined;
  }
}

async function timed(
  name: string,
  fn: () => Promise<Omit<ComponentHealth, "name" | "latencyMs">>,
): Promise<ComponentHealth> {
  const started = Date.now();
  try {
    const result = await fn();
    return { name, latencyMs: Date.now() - started, ...result };
  } catch (error) {
    logger.error.error("health check failed", { component: name }, error);
    return { name, latencyMs: Date.now() - started, status: "down", detail: "check failed" };
  }
}

async function publicClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_PUBLISHABLE_KEY") ?? env("SUPABASE_ANON_KEY");
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
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

async function checkDatabase(): Promise<ComponentHealth> {
  return timed("database", async () => {
    const client = await publicClient();
    if (!client) return { status: "skipped", detail: "not configured" };
    const { error } = await client.from("site_settings").select("key").limit(1);
    if (error) return { status: "down", detail: "query failed" };
    return { status: "ok" };
  });
}

async function checkQueue(): Promise<ComponentHealth> {
  return timed("queue", async () => {
    const client = await publicClient();
    if (!client) return { status: "skipped", detail: "not configured" };
    const { error } = await client
      .from("notification_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    // RLS may hide rows from anon — reachability is what we assert here.
    if (error) return { status: "degraded", detail: "not readable" };
    return { status: "ok" };
  });
}

function checkStorage(): ComponentHealth {
  const configured = Boolean(env("SUPABASE_URL"));
  return {
    name: "storage",
    status: configured ? "ok" : "skipped",
    detail: configured ? undefined : "not configured",
  };
}

function checkAiProvider(): ComponentHealth {
  const keys = ["LOVABLE_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY", "ANTHROPIC_API_KEY"];
  const available = keys.filter((k) => Boolean(env(k)));
  if (available.length === 0) {
    return { name: "ai", status: "degraded", detail: "no provider configured" };
  }
  return { name: "ai", status: "ok", detail: `${available.length} provider(s)` };
}

function rollup(components: ComponentHealth[]): HealthReport["status"] {
  if (components.some((c) => c.status === "down")) return "down";
  if (components.some((c) => c.status === "degraded")) return "degraded";
  return "ok";
}

function base(): Omit<HealthReport, "status" | "components"> {
  return {
    version: env("APP_VERSION") ?? "1.0.0",
    environment: env("NODE_ENV") ?? "production",
    uptimeSeconds: Math.round((Date.now() - BOOT_AT) / 1000),
    timestamp: new Date().toISOString(),
  };
}

/** Liveness — cheap, no dependencies. */
export function liveness(): HealthReport {
  return { ...base(), status: "ok", components: [{ name: "app", status: "ok" }] };
}

/** Readiness — the app can serve traffic (database reachable). */
export async function readiness(): Promise<HealthReport> {
  const components = [{ name: "app", status: "ok" as const }, await checkDatabase()];
  return { ...base(), status: rollup(components), components };
}

/** Full status — every dependency. */
export async function fullStatus(): Promise<HealthReport> {
  const [db, queue] = await Promise.all([checkDatabase(), checkQueue()]);
  const components: ComponentHealth[] = [
    { name: "app", status: "ok" },
    db,
    checkStorage(),
    checkAiProvider(),
    queue,
  ];
  return { ...base(), status: rollup(components), components };
}

export function healthResponse(report: HealthReport): Response {
  return Response.json(report, {
    status: report.status === "down" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
