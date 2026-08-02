// ============================================================
// Controllers — Kundli, Dasha, Gochar, Dosha, Yoga, Transit
// ============================================================

import { z } from "zod";
import { BirthDetailsSchema, DateSchema, LanguageSchema, parseOrThrow } from "../validators";
import type { Handler } from "../types";
import type { BirthInput } from "@/lib/kundli/types";
import {
  charts,
  dasha,
  gochar,
  kundli,
  kundliSummary,
  sadeSati,
  transitSnapshot,
  yogaDosha,
} from "../services/astrology.service";

const BirthBody = z.object({ birth: BirthDetailsSchema });
const BirthWithDate = BirthBody.extend({
  currentDate: DateSchema.optional(),
  language: LanguageSchema.optional(),
});

const asBirth = (b: z.infer<typeof BirthDetailsSchema>): BirthInput => b as BirthInput;

export const postKundli: Handler = async (ctx) => {
  const { birth } = parseOrThrow(BirthBody, ctx.body);
  return {
    data: kundli(asBirth(birth)),
    message: "Kundli generated.",
    metadata: { engine: "kundli" },
  };
};

export const postKundliSummary: Handler = async (ctx) => {
  const { birth } = parseOrThrow(BirthBody, ctx.body);
  return {
    data: kundliSummary(asBirth(birth)),
    message: "Kundli summary generated.",
    metadata: { engine: "kundli" },
  };
};

export const postCharts: Handler = async (ctx) => {
  const parsed = parseOrThrow(
    BirthBody.extend({ charts: z.array(z.string().max(4)).max(20).optional() }),
    ctx.body,
  );
  return {
    data: charts(asBirth(parsed.birth), parsed.charts),
    message: "Divisional charts generated.",
    metadata: { engine: "kundli" },
  };
};

export const postDasha: Handler = async (ctx) => {
  const parsed = parseOrThrow(
    BirthWithDate.extend({
      system: z.enum(["vimshottari", "yogini", "kalachakra", "ashtottari", "char"]).optional(),
    }),
    ctx.body,
  );
  return {
    data: dasha({
      birth: asBirth(parsed.birth),
      currentDate: parsed.currentDate,
      system: parsed.system,
      language: parsed.language,
    }),
    message: "Dasha timeline generated.",
    metadata: { engine: "dasha" },
  };
};

export const postGochar: Handler = async (ctx) => {
  const parsed = parseOrThrow(BirthWithDate, ctx.body);
  return {
    data: gochar({
      birth: asBirth(parsed.birth),
      currentDate: parsed.currentDate,
      language: parsed.language,
    }),
    message: "Gochar influence computed.",
    metadata: { engine: "gochar" },
  };
};

export const postSadeSati: Handler = async (ctx) => {
  const parsed = parseOrThrow(BirthWithDate, ctx.body);
  return {
    data: sadeSati({
      birth: asBirth(parsed.birth),
      currentDate: parsed.currentDate,
      language: parsed.language,
    }),
    message: "Sade Sati timeline computed.",
    metadata: { engine: "sadesati" },
  };
};

const YogaDoshaBody = BirthBody.extend({
  language: LanguageSchema.optional(),
  rules: z.array(z.string().max(64)).max(50).optional(),
  includeUndetected: z.boolean().optional(),
});

function splitDetections(result: ReturnType<typeof yogaDosha>, kind: "dosha" | "yoga") {
  const detections =
    (result as unknown as { detections?: Array<{ kind: string }> }).detections ?? [];
  return { ...result, detections: detections.filter((d) => d.kind === kind) };
}

export const postDoshas: Handler = async (ctx) => {
  const parsed = parseOrThrow(YogaDoshaBody, ctx.body);
  const result = yogaDosha({ ...parsed, birth: asBirth(parsed.birth) });
  return {
    data: splitDetections(result, "dosha"),
    message: "Dosha detection complete.",
    metadata: { engine: "yogadosha" },
  };
};

export const postYogas: Handler = async (ctx) => {
  const parsed = parseOrThrow(YogaDoshaBody, ctx.body);
  const result = yogaDosha({ ...parsed, birth: asBirth(parsed.birth) });
  return {
    data: splitDetections(result, "yoga"),
    message: "Yoga detection complete.",
    metadata: { engine: "yogadosha" },
  };
};

export const postYogaDoshaAll: Handler = async (ctx) => {
  const parsed = parseOrThrow(YogaDoshaBody, ctx.body);
  return {
    data: yogaDosha({ ...parsed, birth: asBirth(parsed.birth) }),
    message: "Yoga & Dosha detection complete.",
    metadata: { engine: "yogadosha" },
  };
};

export const getTransits: Handler = async (ctx) => {
  const date = ctx.query.date ? parseOrThrow(DateSchema, ctx.query.date) : undefined;
  return {
    data: transitSnapshot(date),
    message: "Transit snapshot computed.",
    metadata: { engine: "transit" },
  };
};
