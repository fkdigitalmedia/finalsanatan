/**
 * Public (unauthenticated) reads for the festival system.
 * Uses the Supabase publishable key + narrow RLS policies:
 *   - admin_festivals: "Public reads published festivals"
 *   - festival_date_cache: "Anyone reads festival date cache"
 *   - festival_translations: "Public reads festival translations"
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PUBLIC_COLS = [
  "id",
  "slug",
  "name",
  "alt_names",
  "description",
  "short_description",
  "detailed_description",
  "history",
  "significance",
  "why_celebrated",
  "mythological_story",
  "regional_variations",
  "deities",
  "category",
  "sub_category",
  "tags",
  "is_featured",
  "is_trending",
  "is_popular",
  "date_type",
  "fixed_month",
  "fixed_day",
  "lunar_rule",
  "solar_rule",
  "is_multi_day",
  "duration_days",
  "year_overrides",
  "timezone",
  "region_rules",
  "puja_vidhi",
  "preparation",
  "samagri",
  "mantras",
  "aarti",
  "bhajans",
  "chalisa",
  "stotra",
  "prasad",
  "dress_colors",
  "vrat_rules",
  "featured_image",
  "gallery",
  "videos",
  "faqs",
  "related_articles",
  "related_festivals",
  "related_tools",
  "seo",
  "event_date",
  "images",
  "updated_at",
].join(",");

const TRANSLATION_STRING_KEYS = [
  "name",
  "short_description",
  "detailed_description",
  "history",
  "significance",
  "why_celebrated",
  "mythological_story",
  "puja_vidhi",
  "preparation",
  "prasad",
  "aarti",
  "chalisa",
  "stotra",
] as const;
const TRANSLATION_ARRAY_KEYS = [
  "alt_names",
  "samagri",
  "mantras",
  "regional_variations",
  "faqs",
] as const;

function mergeTranslation<T extends Record<string, any>>(
  row: T,
  content: Record<string, any> | null | undefined,
): T {
  if (!content) return row;
  const merged: any = { ...row };
  for (const k of TRANSLATION_STRING_KEYS) {
    if (typeof content[k] === "string" && content[k].trim()) merged[k] = content[k];
  }
  for (const k of TRANSLATION_ARRAY_KEYS) {
    if (Array.isArray(content[k]) && content[k].length) merged[k] = content[k];
  }
  const seo = { ...(row.seo ?? {}) } as Record<string, any>;
  if (typeof content.seo_title === "string" && content.seo_title.trim())
    seo.title = content.seo_title;
  if (typeof content.seo_description === "string" && content.seo_description.trim())
    seo.description = content.seo_description;
  if (Array.isArray(content.seo_keywords) && content.seo_keywords.length)
    seo.keywords = content.seo_keywords;
  merged.seo = seo;
  return merged;
}

// -------- Get one published festival by slug --------
export const getPublicFestivalBySlug = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const v = raw as { slug: string; language?: string };
    if (!v?.slug) throw new Error("Missing slug");
    return {
      slug: String(v.slug).slice(0, 200),
      language: v.language ? String(v.language).slice(0, 8) : "",
    };
  })
  .handler(async ({ data }) => {
    const supa = publicClient();
    const { data: row, error } = await supa
      .from("admin_festivals")
      .select(PUBLIC_COLS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row)
      return { row: null, occurrences: [], related: [], language: "en", translations: [] as any[] };

    const orFilters = [
      `festival_id.eq.${(row as any).id}`,
      (row as any).category ? `match_category.eq.${(row as any).category}` : "",
      ((row as any).deities ?? []).length
        ? `match_deity.in.(${((row as any).deities as string[]).map((d) => `"${d}"`).join(",")})`
        : "",
    ]
      .filter(Boolean)
      .join(",");

    const [
      { data: cache },
      { data: relatedExplicit },
      { data: translations },
      { data: toolRules },
    ] = await Promise.all([
      supa
        .from("festival_date_cache")
        .select("year, occurrences, computed_at")
        .eq("festival_id", (row as any).id)
        .order("year", { ascending: true }),
      (row as any).related_festivals?.length
        ? supa
            .from("admin_festivals")
            .select("id, slug, name, short_description, featured_image, category")
            .in("id", (row as any).related_festivals)
            .eq("status", "published")
        : Promise.resolve({ data: [] as any[] }),
      supa
        .from("festival_translations")
        .select("language, content, status")
        .eq("festival_id", (row as any).id)
        .eq("status", "published"),
      supa.from("festival_tool_rules").select("tool_slug, priority").or(orFilters),
    ]);

    // Auto-fill related festivals: if admin didn't set enough, add same category / same deity festivals.
    let related = relatedExplicit ?? [];
    if (related.length < 4) {
      const deityList = ((row as any).deities ?? []) as string[];
      const orParts: string[] = [];
      if ((row as any).category) orParts.push(`category.eq.${(row as any).category}`);
      if (deityList.length)
        orParts.push(`deities.ov.{${deityList.map((d) => `"${d.replace(/"/g, "")}"`).join(",")}}`);
      if (orParts.length) {
        const { data: auto } = await supa
          .from("admin_festivals")
          .select("id, slug, name, short_description, featured_image, category")
          .eq("status", "published")
          .neq("id", (row as any).id)
          .or(orParts.join(","))
          .limit(8);
        const seen = new Set(related.map((r: any) => r.id));
        for (const a of auto ?? []) {
          if (!seen.has((a as any).id)) {
            related.push(a);
            seen.add((a as any).id);
            if (related.length >= 6) break;
          }
        }
      }
    }

    // Merge rule-derived tool slugs into related_tools (deduped, priority-sorted).
    const ruleTools = (toolRules ?? [])
      .slice()
      .sort((a: any, b: any) => (a.priority ?? 100) - (b.priority ?? 100))
      .map((r: any) => r.tool_slug as string);
    const existingTools = ((row as any).related_tools ?? []) as string[];
    (row as any).related_tools = Array.from(new Set([...existingTools, ...ruleTools]));

    let finalRow: any = row;
    let language = "en";
    if (data.language && data.language !== "en") {
      const match = (translations ?? []).find((t: any) => t.language === data.language);
      if (match) {
        finalRow = mergeTranslation(row as any, (match.content ?? {}) as Record<string, any>);
        language = data.language;
      }
    }
    const availableLanguages = ["en", ...(translations ?? []).map((t: any) => t.language)];

    return {
      row: finalRow,
      occurrences: cache ?? [],
      related: related ?? [],
      language,
      availableLanguages,
    };
  });

// -------- List published festivals (index / related) --------
export const listPublicFestivals = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { limit?: number; category?: string; tag?: string; deity?: string };
    return {
      limit: Math.min(Math.max(v.limit ?? 60, 1), 500),
      category: v.category ?? "",
      tag: v.tag ?? "",
      deity: v.deity ?? "",
    };
  })
  .handler(async ({ data }) => {
    const supa = publicClient();
    let q = supa
      .from("admin_festivals")
      .select(
        "id, slug, name, short_description, description, featured_image, category, deities, tags, is_featured, is_trending, is_popular",
      )
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true })
      .limit(data.limit);
    if (data.category) q = q.eq("category", data.category);
    if (data.tag) q = q.contains("tags", [data.tag]);
    if (data.deity) q = q.contains("deities", [data.deity]);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

// -------- Festivals Hub (grouped view) --------
export const getFestivalsHub = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const today = new Date().toISOString().slice(0, 10);
  const thisYear = new Date().getUTCFullYear();
  const nextYear = thisYear + 1;

  const [{ data: festivals }, { data: cache }] = await Promise.all([
    supa
      .from("admin_festivals")
      .select(
        "id, slug, name, short_description, featured_image, category, deities, tags, is_featured, is_trending, is_popular",
      )
      .eq("status", "published")
      .order("name", { ascending: true })
      .limit(500),
    supa
      .from("festival_date_cache")
      .select("festival_id, year, occurrences")
      .in("year", [thisYear, nextYear]),
  ]);

  // Build: nextDate per festival, categories, deities aggregates
  const nextDate: Record<string, string> = {};
  for (const c of cache ?? []) {
    const dates: any[] = Array.isArray((c.occurrences as any)?.dates)
      ? (c.occurrences as any).dates
      : [];
    for (const d of dates) {
      if (d.isoDate && d.isoDate >= today) {
        const prev = nextDate[c.festival_id];
        if (!prev || d.isoDate < prev) nextDate[c.festival_id] = d.isoDate;
      }
    }
  }

  const rows = (festivals ?? []).map((f: any) => ({ ...f, nextDate: nextDate[f.id] ?? null }));
  const upcoming = rows
    .filter((r) => r.nextDate)
    .sort((a, b) => (a.nextDate! > b.nextDate! ? 1 : -1));

  const in90 = (() => {
    const cut = new Date();
    cut.setUTCDate(cut.getUTCDate() + 90);
    const cutISO = cut.toISOString().slice(0, 10);
    return upcoming.filter((r) => r.nextDate! <= cutISO);
  })();

  const categories: Record<string, number> = {};
  const deities: Record<string, number> = {};
  for (const r of rows) {
    if (r.category) categories[r.category] = (categories[r.category] ?? 0) + 1;
    for (const d of r.deities ?? []) deities[d] = (deities[d] ?? 0) + 1;
  }

  const featured = rows.filter((r: any) => r.is_featured).slice(0, 6);
  const trending = rows.filter((r: any) => r.is_trending).slice(0, 6);

  return {
    upcoming: in90.slice(0, 24),
    featured,
    trending,
    all: rows,
    categories: Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    deities: Object.entries(deities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30),
    thisYear,
  };
});

// -------- Festivals by year (calendar archive) --------
export const getFestivalsByYear = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const v = raw as { year: number };
    const y = Number(v?.year);
    if (!Number.isFinite(y) || y < 2020 || y > 2100) throw new Error("Invalid year");
    return { year: y };
  })
  .handler(async ({ data }) => {
    const supa = publicClient();
    const [{ data: festivals }, { data: cache }] = await Promise.all([
      supa
        .from("admin_festivals")
        .select(
          "id, slug, name, short_description, featured_image, category, deities, is_multi_day, duration_days",
        )
        .eq("status", "published"),
      supa
        .from("festival_date_cache")
        .select("festival_id, year, occurrences")
        .eq("year", data.year),
    ]);
    const byId = new Map((festivals ?? []).map((f: any) => [f.id, f]));
    const events: Array<{ isoDate: string; label?: string; festival: any }> = [];
    for (const c of cache ?? []) {
      const f = byId.get(c.festival_id);
      if (!f) continue;
      const dates: any[] = Array.isArray((c.occurrences as any)?.dates)
        ? (c.occurrences as any).dates
        : [];
      for (const d of dates) {
        if (d.isoDate) events.push({ isoDate: d.isoDate, label: d.name, festival: f });
      }
    }
    events.sort((a, b) => a.isoDate.localeCompare(b.isoDate));

    // Fallback: if the DB has no cached occurrences for this year, use the
    // curated static dataset so the calendar is never blank. Lunar festivals
    // will only be exact once the admin publishes and the tick job runs.
    if (events.length === 0) {
      const { FESTIVALS_2026 } = await import("@/lib/festivals-data");
      const yearDiff = data.year - 2026;
      for (const f of FESTIVALS_2026) {
        const [, mm, dd] = f.date.split("-");
        const iso = `${data.year}-${mm}-${dd}`;
        // Skip obviously invalid (e.g. Feb 29 in non-leap) — Date normalises.
        const check = new Date(`${iso}T12:00:00Z`);
        if (check.getUTCFullYear() !== data.year) continue;
        events.push({
          isoDate: iso,
          label: yearDiff === 0 ? undefined : "Approx.",
          festival: {
            id: f.slug,
            slug: f.slug,
            name: f.name,
            short_description: f.description,
            featured_image: null,
            category: f.category,
            deities: f.deity ? [f.deity] : [],
            is_multi_day: false,
            duration_days: 1,
          },
        });
      }
      events.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    }

    return { year: data.year, events };
  });

// -------- Sitemap slugs (published only) --------
export const listFestivalSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const { data, error } = await supa
    .from("admin_festivals")
    .select("slug, updated_at")
    .eq("status", "published")
    .limit(2000);
  if (error) throw new Error(error.message);
  return { rows: data ?? [] };
});
