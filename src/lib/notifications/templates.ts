/**
 * Template rendering — {{variable}} interpolation with graceful fallbacks.
 * Pure and browser-safe so admin UI can preview exactly what will be sent.
 */

import type { Channel, NotificationTemplate } from "./types";

export interface RenderedMessage {
  subject: string;
  body: string;
  link: string | null;
}

const TOKEN = /\{\{\s*([\w.]+)\s*\}\}/g;

function lookup(data: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      data,
    );
}

export function interpolate(input: string, data: Record<string, unknown> = {}): string {
  if (!input) return "";
  return input.replace(TOKEN, (_m, key: string) => {
    const value = lookup(data, key);
    if (value === undefined || value === null || value === "") return "";
    return String(value);
  });
}

/** Variables referenced by a template body/subject. */
export function extractVariables(template: Pick<NotificationTemplate, "subject" | "body_md">) {
  const found = new Set<string>();
  for (const src of [template.subject ?? "", template.body_md ?? ""]) {
    for (const m of src.matchAll(TOKEN)) found.add(m[1]);
  }
  return Array.from(found);
}

/** Variables the template needs but the payload does not provide. */
export function missingVariables(
  template: Pick<NotificationTemplate, "subject" | "body_md">,
  data: Record<string, unknown> = {},
) {
  return extractVariables(template).filter((v) => {
    const value = lookup(data, v);
    return value === undefined || value === null || value === "";
  });
}

export function renderTemplate(
  template: NotificationTemplate,
  data: Record<string, unknown> = {},
): RenderedMessage {
  return {
    subject: interpolate(template.subject, data).trim() || fallbackSubject(template.type),
    body: interpolate(template.body_md, data)
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
    link: template.link ? interpolate(template.link, data) : null,
  };
}

export function fallbackSubject(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Pick the best template for a type/channel/language from a flat list.
 * Falls back: exact → same channel in English → in_app in requested language → in_app English.
 */
export function pickTemplate(
  templates: NotificationTemplate[],
  type: string,
  channel: Channel,
  language = "en",
): NotificationTemplate | null {
  const enabled = templates.filter((t) => t.type === type && t.enabled !== false);
  return (
    enabled.find((t) => t.channel === channel && t.language === language) ??
    enabled.find((t) => t.channel === channel && t.language === "en") ??
    enabled.find((t) => t.channel === "in_app" && t.language === language) ??
    enabled.find((t) => t.channel === "in_app" && t.language === "en") ??
    null
  );
}
