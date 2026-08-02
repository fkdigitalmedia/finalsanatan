// Shared Zod schema + helpers for Kundli API routes.
import { z } from "zod";

export const BirthSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "time must be HH:mm"),
  place: z.string().min(1).max(200).default("Unknown"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.union([z.string().min(1).max(64), z.number().min(-14).max(14)]),
  gender: z.enum(["male", "female", "other"]).optional(),
  language: z.string().max(16).optional(),
});
export type BirthPayload = z.infer<typeof BirthSchema>;

export function parseBirth(
  body: unknown,
): { ok: true; data: BirthPayload } | { ok: false; error: string } {
  const parsed = BirthSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  return { ok: true, data: parsed.data };
}
