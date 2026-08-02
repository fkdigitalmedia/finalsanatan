// ============================================================
// Universal PDF Report Engine — Helpers
// ------------------------------------------------------------
// Variable resolution, theme merging, paper maths, formatting.
// Pure functions only — fully unit testable, no jsPDF.
// ============================================================

import {
  BUILT_IN_THEME_MAP,
  DEFAULT_BRANDING,
  DEFAULT_EXPORT,
  DEFAULT_FOOTER,
  DEFAULT_HEADER,
  DEFAULT_PAPER,
  DEFAULT_QR,
  DEFAULT_SIGNATURE,
  DEFAULT_THEME_NAME,
  DEFAULT_WATERMARK,
  PAPER_SIZES,
} from "./constants";
import type {
  DeepPartial,
  PaperConfig,
  PdfDataContext,
  PdfTemplate,
  PdfTheme,
  ThemeName,
} from "./types";

// ---------- object utils ----------
export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function deepMerge<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (!patch) return base;
  if (!isPlainObject(base) || !isPlainObject(patch)) return (patch as T) ?? base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    if (v === undefined) continue;
    const prev = out[k];
    out[k] =
      isPlainObject(prev) && isPlainObject(v)
        ? deepMerge(prev, v as DeepPartial<Record<string, unknown>>)
        : v;
  }
  return out as T;
}

/** Resolve "a.b[0].c" against an object. */
export function getPath(source: unknown, path: string): unknown {
  if (!path) return undefined;
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  let cur: unknown = source;
  for (const part of parts) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

// ---------- variables ----------
const VAR_RE = /\{\{\s*([^{}]+?)\s*\}\}/g;

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(formatValue).filter(Boolean).join(", ");
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

/**
 * Replace every {{path}} placeholder. Supports a `|default` fallback:
 *   {{user.name|Guest}}
 * Unknown variables collapse to an empty string — never "undefined".
 */
export function resolveVariables(input: string, data: PdfDataContext): string {
  if (typeof input !== "string" || !input.includes("{{")) return input ?? "";
  return input.replace(VAR_RE, (_m, expr: string) => {
    const [path, fallback] = expr.split("|").map((s) => s.trim());
    const value = getPath(data, path);
    const text = formatValue(value);
    return text || (fallback ?? "");
  });
}

/** Recursively resolve variables inside any structure. */
export function resolveDeep<T>(value: T, data: PdfDataContext): T {
  if (typeof value === "string") return resolveVariables(value, data) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => resolveDeep(v, data)) as unknown as T;
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveDeep(v, data);
    return out as T;
  }
  return value;
}

/** Truthiness test for `visibleWhen`. Supports "a.b", "!a.b", "a.b == x". */
export function evaluateCondition(expr: string | undefined, data: PdfDataContext): boolean {
  if (!expr || !expr.trim()) return true;
  const raw = expr.trim();

  const cmp = raw.match(/^(.+?)\s*(==|!=)\s*(.+)$/);
  if (cmp) {
    const left = formatValue(getPath(data, cmp[1].trim()));
    const right = cmp[3].trim().replace(/^["']|["']$/g, "");
    return cmp[2] === "==" ? left === right : left !== right;
  }

  const negated = raw.startsWith("!");
  const path = negated ? raw.slice(1).trim() : raw;
  const value = getPath(data, path);
  const truthy = Array.isArray(value)
    ? value.length > 0
    : isPlainObject(value)
      ? Object.keys(value).length > 0
      : Boolean(value);
  return negated ? !truthy : truthy;
}

// ---------- paper ----------
export function paperDimensions(paper: PaperConfig): { width: number; height: number } {
  const base =
    paper.size === "custom"
      ? { width: paper.width ?? 210, height: paper.height ?? 297 }
      : (PAPER_SIZES[paper.size] ?? PAPER_SIZES.a4);
  return paper.orientation === "landscape"
    ? { width: base.height, height: base.width }
    : { width: base.width, height: base.height };
}

// ---------- theme ----------
export function resolveTheme(
  name: ThemeName | undefined,
  overrides?: DeepPartial<PdfTheme>,
  customThemes: Record<string, PdfTheme> = {},
): PdfTheme {
  const key = String(name ?? DEFAULT_THEME_NAME);
  const base = customThemes[key] ?? BUILT_IN_THEME_MAP[key] ?? BUILT_IN_THEME_MAP.premium;
  return deepMerge(structuredCloneSafe(base), overrides);
}

export function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// ---------- template normalisation ----------
export function normalizeTemplate(input: Partial<PdfTemplate> & { report: string }): PdfTemplate {
  return {
    id: input.id ?? `tpl_${input.report}`,
    name: input.name ?? `${input.report} template`,
    report: input.report,
    version: input.version ?? 1,
    status: input.status ?? "published",
    language: input.language ?? "en",
    theme: input.theme ?? DEFAULT_THEME_NAME,
    themeOverrides: input.themeOverrides,
    paper: deepMerge(structuredCloneSafe(DEFAULT_PAPER), input.paper),
    branding: deepMerge(structuredCloneSafe(DEFAULT_BRANDING), input.branding),
    header: deepMerge(structuredCloneSafe(DEFAULT_HEADER), input.header),
    footer: deepMerge(structuredCloneSafe(DEFAULT_FOOTER), input.footer),
    watermark: deepMerge(structuredCloneSafe(DEFAULT_WATERMARK), input.watermark),
    qr: deepMerge(structuredCloneSafe(DEFAULT_QR), input.qr),
    signature: deepMerge(structuredCloneSafe(DEFAULT_SIGNATURE), input.signature),
    security: input.security,
    export: deepMerge(structuredCloneSafe(DEFAULT_EXPORT), input.export),
    sections: (input.sections ?? []).map((s, i) => ({
      enabled: true,
      inToc: Boolean(s.title),
      ...s,
      id: s.id ?? `sec_${i + 1}`,
    })),
    meta: input.meta,
  };
}

// ---------- text / numbers ----------
export function titleCase(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatDate(value: string | Date | undefined, locale = "en-IN"): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

/** Convert a hex colour to rgb triplet, tolerant of shorthand. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = (hex || "#000000").replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const int = parseInt(h.slice(0, 6) || "000000", 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

/** Mix a hex colour towards white (amount 0..1). */
export function tint(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const t = clamp(amount, 0, 1);
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function safeFilename(base: string, ext = "pdf"): string {
  const clean = slugify(base || "report") || "report";
  return `${clean}.${ext}`;
}
