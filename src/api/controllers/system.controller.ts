// ============================================================
// Controllers — Auth, Users, AI, Reports (PDF), System
// ============================================================

import { z } from "zod";
import { LanguageSchema, SafeString, parseOrThrow } from "../validators";
import { forbidden } from "../errors";
import type { Handler } from "../types";
import { generatePdf, interpretReport } from "../services/ai.service";
import { apiCache } from "../cache";
import { RATE_RULES } from "../rate-limit";
import type { InterpretationInput } from "@/lib/ai/types";
import type { GenerateOptions } from "@/lib/pdf/types";

/** GET /auth/session — who am I, according to the bearer token. */
export const getSession: Handler = async (ctx) => ({
  data: {
    authenticated: ctx.auth.isAuthenticated,
    role: ctx.auth.role,
    userId: ctx.auth.userId,
    email: ctx.auth.email,
    roles: ctx.auth.roles,
    limits: RATE_RULES[ctx.auth.role],
  },
  message: ctx.auth.isAuthenticated ? "Session resolved." : "Anonymous session.",
});

export const getMe: Handler = async (ctx) => ({
  data: {
    userId: ctx.auth.userId,
    email: ctx.auth.email,
    role: ctx.auth.role,
    roles: ctx.auth.roles,
  },
  message: "Profile resolved.",
});

const REPORT_KINDS = [
  "daily-horoscope",
  "weekly-horoscope",
  "monthly-horoscope",
  "yearly-horoscope",
  "personalized-horoscope",
  "kundli-summary",
  "career-report",
  "marriage-compatibility",
  "guna-milan",
  "varshphal",
  "muhurat",
  "numerology",
  "vastu",
  "dosha",
  "yoga",
] as const;

const AiBody = z.object({
  report: z.string().max(48),
  depth: z.enum(["brief", "standard", "detailed", "premium"]).optional(),
  language: LanguageSchema.optional(),
  data: z.record(z.string(), z.unknown()),
  context: z.record(z.string(), z.unknown()).optional(),
  confidence: z.number().min(0).max(100).optional(),
  bypassCache: z.boolean().optional(),
});

/** AI narrates engine JSON the caller already obtained from other endpoints. */
export const postInterpret: Handler = async (ctx) => {
  const parsed = parseOrThrow(AiBody, ctx.body);
  const result = await interpretReport({
    ...parsed,
    userId: ctx.auth.userId,
  } as unknown as InterpretationInput);
  return {
    data: result,
    message: "Interpretation generated.",
    metadata: { engine: "ai-interpretation" },
  };
};

export const getAiReportKinds: Handler = async () => ({
  data: { reports: REPORT_KINDS },
  message: "Supported interpretation reports.",
});

const PdfBody = z.object({
  report: z.string().max(48),
  templateId: SafeString(80).optional(),
  language: LanguageSchema.optional(),
  theme: z.string().max(32).optional(),
  filename: SafeString(120).optional(),
  data: z.record(z.string(), z.unknown()),
});

export const postReportPdf: Handler = async (ctx) => {
  const parsed = parseOrThrow(PdfBody, ctx.body);
  const result = await generatePdf(parsed as unknown as GenerateOptions);
  return {
    data: {
      filename: result.filename,
      pages: result.pages,
      bytes: result.bytes,
      dataUrl: result.dataUrl,
      meta: result.meta,
    },
    message: "PDF generated.",
    metadata: { engine: "pdf" },
  };
};

/** Admin-only cache controls (smart invalidation). */
export const getCacheStats: Handler = async () => ({
  data: apiCache.stats(),
  message: "API response cache statistics.",
});

export const postCacheInvalidate: Handler = async (ctx) => {
  if (ctx.auth.role !== "admin" && ctx.auth.role !== "super_admin") throw forbidden();
  const parsed = parseOrThrow(
    z.object({ tag: SafeString(64).optional(), all: z.boolean().optional() }),
    ctx.body,
  );
  if (parsed.all) {
    apiCache.clear();
    return { data: { cleared: "all" }, message: "API cache cleared." };
  }
  const removed = parsed.tag ? apiCache.invalidateTag(parsed.tag) : 0;
  return { data: { tag: parsed.tag ?? null, removed }, message: "API cache invalidated." };
};
