// ============================================================
// Controllers — Horoscope, Numerology, Vastu
// ============================================================

import { z } from "zod";
import {
  BirthDetailsSchema,
  DateSchema,
  LanguageSchema,
  SafeString,
  parseOrThrow,
} from "../validators";
import type { Handler } from "../types";
import { horoscope } from "../services/horoscope.service";
import { numerology, vastu } from "../services/numerology.service";
import { DIRECTIONS } from "@/lib/vastu";
import type { HoroscopeInput, RashiKey } from "@/lib/horoscope/types";

const RASHI_KEYS = [
  "mesha",
  "vrishabha",
  "mithuna",
  "karka",
  "simha",
  "kanya",
  "tula",
  "vrishchika",
  "dhanu",
  "makara",
  "kumbha",
  "meena",
] as const;

const HoroscopeBody = z.object({
  type: z.enum(["daily", "weekly", "monthly", "yearly", "personalized"]),
  rashi: z.enum(RASHI_KEYS).optional(),
  date: DateSchema.optional(),
  language: LanguageSchema.optional(),
  birth: BirthDetailsSchema.optional(),
});

export const postHoroscope: Handler = async (ctx) => {
  const parsed = parseOrThrow(HoroscopeBody, {
    ...(typeof ctx.body === "object" && ctx.body ? ctx.body : {}),
    ...(ctx.params.type ? { type: ctx.params.type } : {}),
    ...(ctx.query.rashi ? { rashi: ctx.query.rashi } : {}),
    ...(ctx.query.date ? { date: ctx.query.date } : {}),
  });

  const input: HoroscopeInput = {
    type: parsed.type,
    rashi: parsed.rashi as RashiKey | undefined,
    date: parsed.date,
    language: parsed.language,
    ...(parsed.birth
      ? {
          time: parsed.birth.time,
          place: parsed.birth.place,
          latitude: parsed.birth.latitude,
          longitude: parsed.birth.longitude,
          timezone: parsed.birth.timezone,
          gender: parsed.birth.gender,
          date: parsed.date ?? parsed.birth.date,
        }
      : {}),
  };

  return {
    data: horoscope(input),
    message: "Horoscope generated.",
    metadata: { engine: "horoscope" },
  };
};

const NumerologyBody = z.object({
  name: SafeString(120),
  dob: DateSchema,
  language: LanguageSchema.optional(),
});

export const postNumerology: Handler = async (ctx) => {
  const parsed = parseOrThrow(NumerologyBody, ctx.body);
  return {
    data: numerology(parsed),
    message: "Numerology computed.",
    metadata: { engine: "numerology" },
  };
};

const DirectionSchema = z.enum(DIRECTIONS as [string, ...string[]]);

const VastuBody = z.object({
  facing: DirectionSchema,
  propertyType: z.enum(["home", "office", "shop", "factory"]).optional(),
  rooms: z.record(z.string().max(32), DirectionSchema).optional(),
  language: LanguageSchema.optional(),
});

export const postVastu: Handler = async (ctx) => {
  const parsed = parseOrThrow(VastuBody, ctx.body);
  return {
    data: vastu(parsed as Parameters<typeof vastu>[0]),
    message: "Vastu analysis complete.",
    metadata: { engine: "vastu" },
  };
};
