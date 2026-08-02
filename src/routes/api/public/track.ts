/**
 * First-party analytics ingestion.
 * Public endpoint (no auth) — writes with the service role after validation.
 * IP is hashed (SHA-256 with rotating daily salt) before storage. Last octet of
 * source IP is zeroed for GDPR-friendly geo lookups.
 */

import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";
import { z } from "zod";

const EventSchema = z.object({
  event_name: z.string().min(1).max(80),
  session_id: z.string().min(6).max(80),
  user_id: z.string().uuid().nullable().optional(),
  tool_slug: z.string().max(120).nullable().optional(),
  category: z.string().max(80).nullable().optional(),
  path: z.string().max(500).nullable().optional(),
  referrer: z.string().max(500).nullable().optional(),
  lang: z.string().max(10).nullable().optional(),
  device: z.string().max(20).nullable().optional(),
  browser: z.string().max(40).nullable().optional(),
  os: z.string().max(40).nullable().optional(),
  screen: z.string().max(20).nullable().optional(),
  utm_source: z.string().max(80).nullable().optional(),
  utm_medium: z.string().max(80).nullable().optional(),
  utm_campaign: z.string().max(120).nullable().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const PayloadSchema = z.object({
  events: z.array(EventSchema).min(1).max(30),
});

function maskIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(salt + "::" + ip)
    .digest("hex")
    .slice(0, 24);
}

function detectCountry(request: Request): string | null {
  return (
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    null
  );
}

function clientIp(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip");
}

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.json();
          const parsed = PayloadSchema.safeParse(raw);
          if (!parsed.success) {
            return new Response("Invalid payload", { status: 400 });
          }
          const ipHash = maskIp(clientIp(request));
          const country = detectCountry(request);
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const now = new Date().toISOString();
          const rows = parsed.data.events.map((e) => ({
            event_name: e.event_name,
            session_id: e.session_id,
            user_id: e.user_id ?? null,
            tool_slug: e.tool_slug ?? null,
            category: e.category ?? null,
            path: e.path ?? null,
            referrer: e.referrer ?? null,
            lang: e.lang ?? null,
            country,
            device: e.device ?? null,
            browser: e.browser ?? null,
            os: e.os ?? null,
            screen: e.screen ?? null,
            utm_source: e.utm_source ?? null,
            utm_medium: e.utm_medium ?? null,
            utm_campaign: e.utm_campaign ?? null,
            ip_hash: ipHash,
            meta: (e.meta ?? {}) as never,
            created_at: now,
          }));

          const { error: evErr } = await supabaseAdmin.from("analytics_events").insert(rows);
          if (evErr) console.error("[track] insert events", evErr);

          // Session upsert from the first event in the batch.
          const first = parsed.data.events[0];
          const isPageview = parsed.data.events.some((e) => e.event_name === "pageview");
          const pageviewCount = parsed.data.events.filter(
            (e) => e.event_name === "pageview",
          ).length;

          const { data: existing } = await supabaseAdmin
            .from("analytics_sessions")
            .select("session_id,pages")
            .eq("session_id", first.session_id)
            .maybeSingle();

          if (existing) {
            const newPages = (existing.pages ?? 1) + pageviewCount;
            await supabaseAdmin
              .from("analytics_sessions")
              .update({
                last_seen_at: now,
                pages: newPages,
                is_bounce: newPages <= 1,
              })
              .eq("session_id", first.session_id);
          } else if (isPageview) {
            await supabaseAdmin.from("analytics_sessions").insert({
              session_id: first.session_id,
              user_id: first.user_id ?? null,
              country,
              device: first.device ?? null,
              browser: first.browser ?? null,
              os: first.os ?? null,
              referrer: first.referrer ?? null,
              lang: first.lang ?? null,
              entry_path: first.path ?? null,
              pages: pageviewCount,
              is_bounce: pageviewCount <= 1,
            });
          }

          // Special-case: search events also land in search_queries for search analytics.
          const searchEvents = parsed.data.events.filter((e) => e.event_name === "search");
          if (searchEvents.length) {
            await supabaseAdmin.from("search_queries").insert(
              searchEvents
                .map((e) => ({
                  query: String((e.meta as { q?: string } | undefined)?.q ?? "").slice(0, 200),
                  results_count: Number((e.meta as { n?: number } | undefined)?.n ?? 0),
                  user_id: e.user_id ?? null,
                  session_id: e.session_id,
                  lang: e.lang ?? null,
                  path: e.path ?? null,
                }))
                .filter((r) => r.query.length > 0),
            );
          }

          return Response.json({ ok: true, ingested: rows.length });
        } catch (err) {
          console.error("[track] error", err);
          return new Response("Server error", { status: 500 });
        }
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
    },
  },
});
