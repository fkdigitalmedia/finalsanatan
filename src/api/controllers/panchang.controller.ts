// ============================================================
// Controllers — Panchang, Muhurat, Festivals
// ------------------------------------------------------------
// Controllers validate → authorize (done by the pipeline) →
// call a service → shape the result. Zero astrology here.
// ============================================================

import { z } from "zod";
import {
  DateSchema,
  LatitudeSchema,
  LongitudeSchema,
  TimezoneSchema,
  SafeString,
  parseOrThrow,
} from "../validators";
import { notFound } from "../errors";
import type { Handler } from "../types";
import { almanacForDay, muhuratForDay, panchangForDay } from "../services/panchang.service";
import { festivalBySlug, festivalCatalogue, festivalsForYear } from "../services/festival.service";

const PlaceSchema = z.object({
  date: DateSchema,
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  timezone: z.string().min(1).max(64).default("Asia/Kolkata"),
  place: SafeString(200).optional(),
});

function coerceQuery(query: Record<string, string>, body: unknown) {
  if (query.date || query.latitude) {
    return {
      date: query.date,
      latitude: Number(query.latitude),
      longitude: Number(query.longitude),
      timezone: query.timezone,
      place: query.place,
    };
  }
  return body;
}

export const getPanchang: Handler = async (ctx) => {
  const input = parseOrThrow(PlaceSchema, coerceQuery(ctx.query, ctx.body));
  return {
    data: panchangForDay(input),
    message: "Panchang computed.",
    metadata: { engine: "panchang" },
  };
};

export const getMuhurat: Handler = async (ctx) => {
  const input = parseOrThrow(PlaceSchema, coerceQuery(ctx.query, ctx.body));
  return {
    data: muhuratForDay(input),
    message: "Muhurat windows computed.",
    metadata: { engine: "panchang" },
  };
};

export const getAlmanac: Handler = async (ctx) => {
  const input = parseOrThrow(PlaceSchema, coerceQuery(ctx.query, ctx.body));
  return {
    data: almanacForDay(input),
    message: "Almanac computed.",
    metadata: { engine: "panchang" },
  };
};

const FestivalYearSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100),
  latitude: LatitudeSchema.optional(),
  longitude: LongitudeSchema.optional(),
  timezone: TimezoneSchema.optional(),
});

export const listFestivals: Handler = async (ctx) => {
  const input = parseOrThrow(FestivalYearSchema, {
    year: ctx.query.year ?? ctx.params.year ?? new Date().getUTCFullYear(),
    latitude: ctx.query.latitude ? Number(ctx.query.latitude) : undefined,
    longitude: ctx.query.longitude ? Number(ctx.query.longitude) : undefined,
    timezone: ctx.query.timezone,
  });
  const items = festivalsForYear(
    input.year,
    input.latitude,
    input.longitude,
    typeof input.timezone === "string" ? input.timezone : undefined,
  );
  return {
    data: { year: input.year, count: items.length, festivals: items },
    message: "Festival calendar resolved.",
  };
};

export const getFestival: Handler = async (ctx) => {
  const slug = parseOrThrow(SafeString(80), ctx.params.slug);
  const year = parseOrThrow(
    z.coerce.number().int().min(1900).max(2100),
    ctx.query.year ?? new Date().getUTCFullYear(),
  );
  try {
    const occurrences = festivalBySlug(slug, year);
    return { data: { slug, year, occurrences }, message: "Festival resolved." };
  } catch {
    throw notFound(`No festival rule registered for "${slug}".`);
  }
};

export const listFestivalRulesCtrl: Handler = async () => ({
  data: festivalCatalogue(),
  message: "Festival rule catalogue.",
});
