// ============================================================
// Universal API Layer — v1 route registry
// ------------------------------------------------------------
// Single source of truth for routing, authorization, caching,
// rate-limit cost and the generated OpenAPI document.
// ============================================================

import type { RouteDefinition } from "../types";
import * as panchang from "../controllers/panchang.controller";
import * as kundli from "../controllers/kundli.controller";
import * as horoscope from "../controllers/horoscope.controller";
import * as system from "../controllers/system.controller";

const MIN = 60_000;

const BIRTH_EXAMPLE = {
  birth: {
    date: "1990-08-15",
    time: "10:45",
    place: "Varanasi, India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: "Asia/Kolkata",
    gender: "male",
  },
};

export const V1_ROUTES: RouteDefinition[] = [
  // ---------- Auth & Users ----------
  {
    method: "GET",
    path: "auth/session",
    handler: system.getSession,
    group: "Auth",
    summary: "Resolve the caller's session, role and rate-limit tier.",
  },
  {
    method: "GET",
    path: "users/me",
    handler: system.getMe,
    group: "Users",
    minRole: "user",
    summary: "Return the authenticated user's profile basics.",
  },

  // ---------- Panchang ----------
  {
    method: "GET",
    path: "panchang",
    handler: panchang.getPanchang,
    group: "Panchang",
    summary: "Full Panchang for a date and location.",
    engine: "panchang",
    cacheTtlMs: 10 * MIN,
    cacheTags: ["panchang"],
  },
  {
    method: "POST",
    path: "panchang",
    handler: panchang.getPanchang,
    group: "Panchang",
    summary: "Full Panchang for a date and location (JSON body).",
    engine: "panchang",
    cacheTtlMs: 10 * MIN,
    cacheTags: ["panchang"],
    requestExample: {
      date: "2026-01-14",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
    },
  },
  {
    method: "GET",
    path: "panchang/muhurat",
    handler: panchang.getMuhurat,
    group: "Panchang",
    summary: "Choghadiya, Abhijit and inauspicious windows.",
    engine: "panchang",
    cacheTtlMs: 10 * MIN,
    cacheTags: ["panchang"],
  },
  {
    method: "GET",
    path: "panchang/almanac",
    handler: panchang.getAlmanac,
    group: "Panchang",
    summary: "Almanac, planetary transits and upcoming eclipses.",
    engine: "panchang",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["panchang"],
  },

  // ---------- Festivals ----------
  {
    method: "GET",
    path: "festivals",
    handler: panchang.listFestivals,
    group: "Festival",
    summary: "Resolved festival calendar for a year.",
    engine: "festivals",
    cacheTtlMs: 60 * MIN,
    cacheTags: ["festivals"],
  },
  {
    method: "GET",
    path: "festivals/rules",
    handler: panchang.listFestivalRulesCtrl,
    group: "Festival",
    summary: "Catalogue of registered festival rules.",
    engine: "festivals",
    cacheTtlMs: 60 * MIN,
    cacheTags: ["festivals"],
  },
  {
    method: "GET",
    path: "festivals/:slug",
    handler: panchang.getFestival,
    group: "Festival",
    summary: "Resolve one festival for a year.",
    engine: "festivals",
    cacheTtlMs: 60 * MIN,
    cacheTags: ["festivals"],
  },

  // ---------- Kundli ----------
  {
    method: "POST",
    path: "kundli",
    handler: kundli.postKundli,
    group: "Kundli",
    summary: "Full natal chart with vargas, strengths, yogas and dashas.",
    engine: "kundli",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["kundli"],
    rateCost: 2,
    requestExample: BIRTH_EXAMPLE,
  },
  {
    method: "POST",
    path: "kundli/summary",
    handler: kundli.postKundliSummary,
    group: "Kundli",
    summary: "Compact chart summary for cards and list screens.",
    engine: "kundli",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["kundli"],
    requestExample: BIRTH_EXAMPLE,
  },
  {
    method: "POST",
    path: "kundli/charts",
    handler: kundli.postCharts,
    group: "Kundli",
    summary: "Selected divisional charts (D1…D60).",
    engine: "kundli",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["kundli"],
    rateCost: 2,
    requestExample: { ...BIRTH_EXAMPLE, charts: ["d1", "d9", "d10"] },
  },

  // ---------- Dasha / Gochar ----------
  {
    method: "POST",
    path: "dasha",
    handler: kundli.postDasha,
    group: "Dasha",
    summary: "Mahadasha / Antardasha timeline with the current period.",
    engine: "dasha",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["dasha"],
    rateCost: 2,
    requestExample: { ...BIRTH_EXAMPLE, system: "vimshottari" },
  },
  {
    method: "POST",
    path: "gochar",
    handler: kundli.postGochar,
    group: "Gochar",
    summary: "Transit influence on the natal chart.",
    engine: "gochar",
    cacheTtlMs: 15 * MIN,
    cacheTags: ["gochar"],
    rateCost: 2,
    requestExample: BIRTH_EXAMPLE,
  },
  {
    method: "POST",
    path: "gochar/sade-sati",
    handler: kundli.postSadeSati,
    group: "Gochar",
    summary: "Sade Sati and Dhaiya cycles.",
    engine: "sadesati",
    cacheTtlMs: 60 * MIN,
    cacheTags: ["gochar"],
    requestExample: BIRTH_EXAMPLE,
  },
  {
    method: "GET",
    path: "transits",
    handler: kundli.getTransits,
    group: "Gochar",
    summary: "Current planetary transit snapshot.",
    engine: "transit",
    cacheTtlMs: 5 * MIN,
    cacheTags: ["transit"],
  },

  // ---------- Dosha / Yoga ----------
  {
    method: "POST",
    path: "dosha",
    handler: kundli.postDoshas,
    group: "Dosha",
    summary: "Dosha detection (Mangal, Kaal Sarp, Pitra, Guru Chandal…).",
    engine: "yogadosha",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["yogadosha"],
    requestExample: BIRTH_EXAMPLE,
  },
  {
    method: "POST",
    path: "yoga",
    handler: kundli.postYogas,
    group: "Yoga",
    summary: "Yoga detection (Gaj Kesari, Raj Yoga, Dhana Yoga…).",
    engine: "yogadosha",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["yogadosha"],
    requestExample: BIRTH_EXAMPLE,
  },
  {
    method: "POST",
    path: "yoga-dosha",
    handler: kundli.postYogaDoshaAll,
    group: "Yoga",
    summary: "Combined yoga + dosha detection report.",
    engine: "yogadosha",
    cacheTtlMs: 30 * MIN,
    cacheTags: ["yogadosha"],
    requestExample: BIRTH_EXAMPLE,
  },

  // ---------- Horoscope ----------
  {
    method: "POST",
    path: "horoscope",
    handler: horoscope.postHoroscope,
    group: "Horoscope",
    summary: "Daily / weekly / monthly / yearly / personalized horoscope.",
    engine: "horoscope",
    cacheTtlMs: 15 * MIN,
    cacheTags: ["horoscope"],
    rateCost: 2,
    requestExample: { type: "daily", rashi: "mesha", date: "2026-01-14" },
  },
  {
    method: "GET",
    path: "horoscope/:type",
    handler: horoscope.postHoroscope,
    group: "Horoscope",
    summary: "Horoscope by period type with ?rashi= and ?date=.",
    engine: "horoscope",
    cacheTtlMs: 15 * MIN,
    cacheTags: ["horoscope"],
  },

  // ---------- Numerology / Vastu ----------
  {
    method: "POST",
    path: "numerology",
    handler: horoscope.postNumerology,
    group: "Numerology",
    summary: "Name number and life-path number.",
    engine: "numerology",
    cacheTtlMs: 60 * MIN,
    cacheTags: ["numerology"],
    requestExample: { name: "Aarav Sharma", dob: "1994-03-21" },
  },
  {
    method: "POST",
    path: "vastu",
    handler: horoscope.postVastu,
    group: "Vastu",
    summary: "Directional Vastu analysis with defects and remedies.",
    engine: "vastu",
    cacheTtlMs: 60 * MIN,
    cacheTags: ["vastu"],
    requestExample: {
      facing: "north-east",
      rooms: { kitchen: "south-east", "pooja-room": "north-east" },
    },
  },

  // ---------- AI ----------
  {
    method: "GET",
    path: "ai/reports",
    handler: system.getAiReportKinds,
    group: "AI",
    summary: "List the interpretation report kinds the AI layer supports.",
  },
  {
    method: "POST",
    path: "ai/interpret",
    handler: system.postInterpret,
    group: "AI",
    minRole: "user",
    summary: "Narrate structured engine JSON into Markdown. AI never calculates.",
    engine: "ai-interpretation",
    rateCost: 10,
    requestExample: {
      report: "kundli-summary",
      depth: "standard",
      language: "hi",
      data: { moonSign: "Karka" },
    },
  },

  // ---------- Reports ----------
  {
    method: "POST",
    path: "reports/pdf",
    handler: system.postReportPdf,
    group: "Reports",
    minRole: "user",
    summary: "Render a template-driven premium PDF report.",
    engine: "pdf",
    rateCost: 15,
    requestExample: { report: "kundli", language: "en", data: {} },
  },

  // ---------- System ----------
  {
    method: "GET",
    path: "system/cache",
    handler: system.getCacheStats,
    group: "System",
    minRole: "admin",
    summary: "API response-cache statistics.",
  },
  {
    method: "POST",
    path: "system/cache/invalidate",
    handler: system.postCacheInvalidate,
    group: "System",
    minRole: "admin",
    summary: "Invalidate cached API responses by tag, or clear everything.",
    requestExample: { tag: "panchang" },
  },
];

export interface MatchedRoute {
  route: RouteDefinition;
  params: Record<string, string>;
}

/** Longest static prefix first so ":slug" never shadows "rules". */
const SORTED = [...V1_ROUTES].sort(
  (a, b) =>
    a.path.split("/").filter((s) => s.startsWith(":")).length -
    b.path.split("/").filter((s) => s.startsWith(":")).length,
);

export function matchRoute(
  routes: RouteDefinition[],
  method: string,
  path: string,
): { match?: MatchedRoute; pathExists: boolean } {
  const segments = path.split("/").filter(Boolean);
  let pathExists = false;

  for (const route of routes) {
    const pattern = route.path.split("/").filter(Boolean);
    if (pattern.length !== segments.length) continue;

    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      if (p.startsWith(":")) params[p.slice(1)] = decodeURIComponent(segments[i]);
      else if (p !== segments[i]) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    pathExists = true;
    if (route.method === method) return { match: { route, params }, pathExists: true };
  }
  return { pathExists };
}

export function matchV1(method: string, path: string) {
  return matchRoute(SORTED, method, path);
}
