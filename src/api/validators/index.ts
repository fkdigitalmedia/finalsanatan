// ============================================================
// Universal API Layer — Shared validation
// ------------------------------------------------------------
// Zod schemas only. The API layer validates and sanitizes;
// astrological rules stay in the engines.
// ============================================================

import { z } from "zod";
import { validationError, badRequest, payloadTooLarge, type FieldIssue } from "../errors";

export const MAX_BODY_BYTES = 128 * 1024; // 128 KB

export const LANGUAGES = ["en", "hi", "mr", "gu", "ta", "te", "kn", "ml", "pa", "bn"] as const;

/** Strip control chars + angle brackets — defeats stored XSS at the edge. */
export function sanitizeText(value: string): string {
  return (
    value
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/[<>]/g, "")
      .trim()
  );
}

export const SafeString = (max = 200) =>
  z.string().max(max).transform(sanitizeText).pipe(z.string().min(1).max(max));

export const LanguageSchema = z.enum(LANGUAGES).default("en");

export const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), "date is not a real calendar date");

export const TimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "time must be HH:mm in 24-hour format");

export const TimezoneSchema = z.union([
  z
    .string()
    .min(1)
    .max(64)
    .refine(
      (tz) => {
        try {
          new Intl.DateTimeFormat("en-US", { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      { message: "timezone must be a valid IANA name (e.g. Asia/Kolkata)" },
    ),
  z.number().min(-14).max(14),
]);

export const LatitudeSchema = z.number().min(-90).max(90);
export const LongitudeSchema = z.number().min(-180).max(180);

export const CoordinatesSchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
});

export const BirthDetailsSchema = z.object({
  date: DateSchema,
  time: TimeSchema,
  place: SafeString(200).default("Unknown"),
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  timezone: TimezoneSchema,
  gender: z.enum(["male", "female", "other"]).optional(),
  language: LanguageSchema.optional(),
});
export type BirthDetails = z.infer<typeof BirthDetailsSchema>;

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
] as const;
export const RashiSchema = z.enum(RASHIS);

/** Convert Zod issues into the API's flat field-issue list. */
export function zodIssues(error: z.ZodError): FieldIssue[] {
  return error.issues.map((i) => ({
    field: i.path.join(".") || "(root)",
    message: i.message,
  }));
}

/** Parse-or-throw, producing a 422 with field-level detail. */
export function parseOrThrow<S extends z.ZodType>(schema: S, input: unknown): z.infer<S> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw validationError(zodIssues(parsed.error));
  return parsed.data;
}

/** Read + size-guard a JSON body. */
export async function readJsonBody(request: Request): Promise<unknown> {
  if (request.method === "GET" || request.method === "HEAD") return {};

  const type = request.headers.get("content-type") ?? "";
  const raw = await request.text();
  if (!raw) return {};
  if (raw.length > MAX_BODY_BYTES) throw payloadTooLarge();
  if (type && !type.includes("application/json")) {
    throw badRequest("Content-Type must be application/json.");
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw badRequest("Request body is not valid JSON.");
  }
}

/** Query params as a plain object (repeated keys become the last value). */
export function queryObject(url: URL): Record<string, string> {
  const out: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    out[k] = sanitizeText(v);
  });
  return out;
}
