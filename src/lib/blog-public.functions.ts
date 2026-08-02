// ============================================================
// Phase 14.6 — Public blog data layer (admin_articles).
// Read-only, published rows only, publishable key.
// ============================================================

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false } },
  );
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  featured_image: string | null;
  published_at: string | null;
  lang: string;
}

export interface BlogPost extends BlogPostSummary {
  content_md: string;
  updated_at: string;
  seo: Record<string, string | number | boolean | null> | null;
}

const LIST_COLS = "slug,title,excerpt,category,tags,featured_image,published_at,lang";

export const listBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({
        category: z.string().optional(),
        tag: z.string().optional(),
        q: z.string().optional(),
        page: z.number().int().optional(),
        pageSize: z.number().int().optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const page = Math.max(1, data.page ?? 1);
    const pageSize = Math.min(48, Math.max(1, data.pageSize ?? 12));
    const from = (page - 1) * pageSize;

    let query = publicClient()
      .from("admin_articles")
      .select(LIST_COLS, { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (data.category) query = query.eq("category", data.category);
    if (data.tag) query = query.contains("tags", [data.tag]);
    if (data.q) query = query.or(`title.ilike.%${data.q}%,excerpt.ilike.%${data.q}%`);

    const { data: rows, count, error } = await query;
    if (error) throw new Error(error.message);
    return {
      posts: (rows ?? []) as BlogPostSummary[],
      total: count ?? 0,
      page,
      pageSize,
    };
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row, error } = await sb
      .from("admin_articles")
      .select(
        "slug,title,excerpt,category,tags,featured_image,published_at,lang,content_md,updated_at,seo",
      )
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { post: null as BlogPost | null, related: [] as BlogPostSummary[] };

    const { data: related } = await sb
      .from("admin_articles")
      .select(LIST_COLS)
      .eq("status", "published")
      .neq("slug", data.slug)
      .eq("category", row.category ?? "")
      .order("published_at", { ascending: false })
      .limit(3);

    return {
      post: row as unknown as BlogPost,
      related: (related ?? []) as BlogPostSummary[],
    };
  });

export const listBlogCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("admin_articles")
    .select("category")
    .eq("status", "published");
  if (error) throw new Error(error.message);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const c = (row as { category: string | null }).category;
    if (!c) continue;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
});

export const listBlogSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("admin_articles")
    .select("slug,updated_at,category")
    .eq("status", "published")
    .limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []) as { slug: string; updated_at: string; category: string | null }[];
});

/**
 * Phase 14.7 — rows the SEO engine needs for blog, news, image and
 * llms-full generation. One query, cached by the callers.
 */
export const listBlogSitemapRows = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("admin_articles")
    .select("slug,title,excerpt,featured_image,updated_at,published_at,category,tags")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []) as {
    slug: string;
    title: string;
    excerpt: string | null;
    featured_image: string | null;
    updated_at: string;
    published_at: string | null;
    category: string | null;
    tags: string[] | null;
  }[];
});
