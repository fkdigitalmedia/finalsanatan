/**
 * Channel providers. Server-only.
 *
 * Every channel implements the same contract so new channels (SMS, WhatsApp,
 * Telegram) only need a new entry here — the queue processor never changes.
 * Channels that have no credentials configured resolve as `skipped` instead of
 * throwing, so one unconfigured channel never blocks the rest of a dispatch.
 */

import type { Channel } from "./types";

export interface DeliveryContext {
  userId: string | null;
  recipient: string | null;
  type: string;
  language: string;
  subject: string;
  body: string;
  link: string | null;
  payload: Record<string, unknown>;
  channelConfig: Record<string, any>;
}

export interface DeliveryResult {
  status: "sent" | "skipped" | "failed";
  provider: string;
  reason?: string;
  meta?: Record<string, unknown>;
}

type Provider = (ctx: DeliveryContext) => Promise<DeliveryResult>;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const inApp: Provider = async (ctx) => {
  if (!ctx.userId) return { status: "skipped", provider: "database", reason: "no_user_id" };
  const db = await admin();
  const { error } = await db.from("notifications").insert({
    user_id: ctx.userId,
    title: ctx.subject,
    body: ctx.body,
    link: ctx.link,
    category: ctx.type,
    read: false,
  });
  if (error) return { status: "failed", provider: "database", reason: error.message };
  return { status: "sent", provider: "database" };
};

/**
 * Email. Uses Lovable's managed email API when the workspace email domain is
 * configured; otherwise reports `skipped` so the queue does not retry forever.
 */
const email: Provider = async (ctx) => {
  const to = ctx.recipient;
  if (!to) return { status: "skipped", provider: "lovable_email", reason: "no_recipient" };
  const apiKey = process.env.LOVABLE_API_KEY;
  const sender = ctx.channelConfig?.sender_domain as string | undefined;
  if (!apiKey || !sender) {
    return { status: "skipped", provider: "lovable_email", reason: "email_domain_not_configured" };
  }
  try {
    const res = await fetch("https://api.lovable.dev/email/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        sender_domain: sender,
        from: ctx.channelConfig?.from ?? `notifications@${sender}`,
        to,
        subject: ctx.subject,
        html: `<div style="font-family:Georgia,serif;line-height:1.6">${escapeHtml(ctx.body).replace(/\n/g, "<br/>")}${
          ctx.link ? `<p><a href="${escapeHtml(ctx.link)}">Open</a></p>` : ""
        }</div>`,
        text: ctx.body,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429)
        return { status: "failed", provider: "lovable_email", reason: `rate_limited: ${text}` };
      return {
        status: "failed",
        provider: "lovable_email",
        reason: `${res.status}: ${text.slice(0, 300)}`,
      };
    }
    return { status: "sent", provider: "lovable_email" };
  } catch (e: any) {
    return { status: "failed", provider: "lovable_email", reason: e?.message ?? "email_error" };
  }
};

/** Browser push — persisted for the service worker / Web Push sender. */
const browserPush: Provider = async (ctx) => {
  const endpoint = ctx.channelConfig?.web_push_endpoint as string | undefined;
  if (!endpoint) {
    return { status: "skipped", provider: "web_push", reason: "web_push_not_configured" };
  }
  return httpPost(endpoint, ctx, "web_push", ctx.channelConfig?.headers);
};

const webhook: Provider = async (ctx) => {
  const url = ctx.channelConfig?.url as string | undefined;
  if (!url) return { status: "skipped", provider: "http", reason: "webhook_url_missing" };
  return httpPost(url, ctx, "http", ctx.channelConfig?.headers);
};

/** SMS / WhatsApp / Telegram / mobile push: generic HTTP relay when configured. */
function relay(name: string): Provider {
  return async (ctx) => {
    const url = ctx.channelConfig?.url as string | undefined;
    if (!url) return { status: "skipped", provider: name, reason: `${name}_not_configured` };
    return httpPost(url, ctx, name, ctx.channelConfig?.headers);
  };
}

async function httpPost(
  url: string,
  ctx: DeliveryContext,
  provider: string,
  headers?: Record<string, string>,
): Promise<DeliveryResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(headers ?? {}) },
      body: JSON.stringify({
        type: ctx.type,
        userId: ctx.userId,
        recipient: ctx.recipient,
        language: ctx.language,
        subject: ctx.subject,
        body: ctx.body,
        link: ctx.link,
        data: ctx.payload,
      }),
    });
    if (!res.ok) {
      return {
        status: "failed",
        provider,
        reason: `${res.status}: ${(await res.text()).slice(0, 300)}`,
      };
    }
    return { status: "sent", provider };
  } catch (e: any) {
    return { status: "failed", provider, reason: e?.message ?? "network_error" };
  }
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export const PROVIDERS: Record<Channel, Provider> = {
  in_app: inApp,
  email,
  browser_push: browserPush,
  mobile_push: relay("mobile_push"),
  sms: relay("sms"),
  whatsapp: relay("whatsapp"),
  telegram: relay("telegram"),
  webhook,
};

export async function deliver(channel: Channel, ctx: DeliveryContext): Promise<DeliveryResult> {
  const provider = PROVIDERS[channel];
  if (!provider) return { status: "skipped", provider: "unknown", reason: "unknown_channel" };
  return provider(ctx);
}
