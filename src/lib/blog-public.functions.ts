import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SEED_BLOG_POSTS, type SeedBlogPost } from "@/content/blog/seeds";

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

function findSeedPost(slug: string): SeedBlogPost | undefined {
  return SEED_BLOG_POSTS.find((p) => p.slug === slug);
}

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

    try {
      let query = publicClient()
        .from("admin_articles")
        .select(LIST_COLS, { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .range(from, from + pageSize - 1);

      if (data.category) query = query.eq("category", data.category);
      if (data.tag) query = query.contains("tags", [data.tag]);
      if (data.q) query = query.or(`title.ilike.%${data.q}%,excerpt.ilike.%${data.q}%`);

      const { data: rows, count } = await query;
      const dbPosts = (rows ?? []) as BlogPostSummary[];
      const seedMap = new Map(SEED_BLOG_POSTS.map((s) => [s.slug, s]));

      // Merge dbPosts with seeds: if seed has richer metadata, use it
      const enhancedDbPosts = dbPosts.map((p) => {
        const seed = seedMap.get(p.slug);
        if (seed) {
          return {
            slug: p.slug,
            title: seed.title || p.title,
            excerpt: seed.excerpt || p.excerpt,
            category: seed.category || p.category,
            tags: seed.tags.length > 0 ? seed.tags : p.tags,
            featured_image: seed.featured_image || p.featured_image,
            published_at: seed.published_at || p.published_at,
            lang: seed.lang || p.lang,
          };
        }
        return p;
      });

      const dbSlugs = new Set(dbPosts.map((p) => p.slug));

      const matchingSeeds = SEED_BLOG_POSTS.filter((seed) => {
        if (dbSlugs.has(seed.slug)) return false;
        if (data.category && seed.category !== data.category) return false;
        if (data.tag && !seed.tags.includes(data.tag)) return false;
        if (
          data.q &&
          !seed.title.toLowerCase().includes(data.q.toLowerCase()) &&
          !seed.excerpt.toLowerCase().includes(data.q.toLowerCase())
        )
          return false;
        return true;
      }).map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        category: s.category,
        tags: s.tags,
        featured_image: s.featured_image,
        published_at: s.published_at,
        lang: s.lang,
      }));

      const combined = [...enhancedDbPosts, ...matchingSeeds];
      return {
        posts: combined.slice(0, pageSize),
        total: (count ?? 0) + matchingSeeds.length,
        page,
        pageSize,
      };
    } catch {
      const seedList = SEED_BLOG_POSTS.map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        category: s.category,
        tags: s.tags,
        featured_image: s.featured_image,
        published_at: s.published_at,
        lang: s.lang,
      }));
      return {
        posts: seedList.slice(from, from + pageSize),
        total: seedList.length,
        page,
        pageSize,
      };
    }
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const seed = findSeedPost(data.slug);
    try {
      const sb = publicClient();
      const { data: row } = await sb
        .from("admin_articles")
        .select(
          "slug,title,excerpt,category,tags,featured_image,published_at,lang,content_md,updated_at,seo",
        )
        .eq("status", "published")
        .eq("slug", data.slug)
        .maybeSingle();

      if (row) {
        const { data: related } = await sb
          .from("admin_articles")
          .select(LIST_COLS)
          .eq("status", "published")
          .neq("slug", data.slug)
          .eq("category", row.category ?? "")
          .order("published_at", { ascending: false })
          .limit(3);

        // If seed exists and has more comprehensive content than thin DB row, use seed content
        const postData =
          seed && seed.content_md.length > ((row.content_md as string)?.length || 0)
            ? {
                ...row,
                title: seed.title || row.title,
                excerpt: seed.excerpt || row.excerpt,
                category: seed.category || row.category,
                tags: seed.tags.length > 0 ? seed.tags : row.tags,
                featured_image: seed.featured_image || row.featured_image,
                content_md: seed.content_md,
                seo: seed.seo || row.seo,
              }
            : row;

        return {
          post: postData as unknown as BlogPost,
          related: (related ?? []) as BlogPostSummary[],
        };
      }
    } catch {
      // Fallback to seed on client/network error
    }

    if (seed) {
      const relatedSeeds = SEED_BLOG_POSTS.filter(
        (p) => p.slug !== seed.slug && p.category === seed.category,
      ).map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        category: r.category,
        tags: r.tags,
        featured_image: r.featured_image,
        published_at: r.published_at,
        lang: r.lang,
      }));

      return {
        post: seed as BlogPost,
        related: relatedSeeds,
      };
    }

    return { post: null as BlogPost | null, related: [] as BlogPostSummary[] };
  });

export const listBlogCategories = createServerFn({ method: "GET" }).handler(async () => {
  const counts = new Map<string, number>();
  try {
    const { data } = await publicClient()
      .from("admin_articles")
      .select("category")
      .eq("status", "published");
    for (const row of data ?? []) {
      const c = (row as { category: string | null }).category;
      if (!c) continue;
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  } catch {
    // Ignore network error
  }

  for (const seed of SEED_BLOG_POSTS) {
    if (seed.category) {
      counts.set(seed.category, (counts.get(seed.category) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
});

export const listBlogSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const slugsMap = new Map<string, { slug: string; updated_at: string; category: string | null }>();
  try {
    const { data } = await publicClient()
      .from("admin_articles")
      .select("slug,updated_at,category")
      .eq("status", "published")
      .limit(2000);
    for (const row of data ?? []) {
      const r = row as { slug: string; updated_at: string; category: string | null };
      slugsMap.set(r.slug, r);
    }
  } catch {
    // Ignore network error
  }

  for (const seed of SEED_BLOG_POSTS) {
    if (!slugsMap.has(seed.slug)) {
      slugsMap.set(seed.slug, {
        slug: seed.slug,
        updated_at: seed.updated_at,
        category: seed.category,
      });
    }
  }

  return [...slugsMap.values()];
});

/**
 * Phase 14.7 — rows the SEO engine needs for blog, news, image and
 * llms-full generation. One query, cached by the callers.
 */
export const listBlogSitemapRows = createServerFn({ method: "GET" }).handler(async () => {
  const rowsMap = new Map<
    string,
    {
      slug: string;
      title: string;
      excerpt: string | null;
      featured_image: string | null;
      updated_at: string;
      published_at: string | null;
      category: string | null;
      tags: string[] | null;
    }
  >();

  try {
    const { data } = await publicClient()
      .from("admin_articles")
      .select("slug,title,excerpt,featured_image,updated_at,published_at,category,tags")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(2000);

    for (const r of data ?? []) {
      const row = r as {
        slug: string;
        title: string;
        excerpt: string | null;
        featured_image: string | null;
        updated_at: string;
        published_at: string | null;
        category: string | null;
        tags: string[] | null;
      };
      rowsMap.set(row.slug, row);
    }
  } catch {
    // Ignore network error
  }

  for (const seed of SEED_BLOG_POSTS) {
    const existing = rowsMap.get(seed.slug);
    rowsMap.set(seed.slug, {
      slug: seed.slug,
      title: seed.title || existing?.title || "",
      excerpt: seed.excerpt || existing?.excerpt || null,
      featured_image: seed.featured_image || existing?.featured_image || null,
      updated_at: seed.updated_at || existing?.updated_at || new Date().toISOString(),
      published_at: seed.published_at || existing?.published_at || null,
      category: seed.category || existing?.category || null,
      tags: seed.tags.length > 0 ? seed.tags : (existing?.tags ?? null),
    });
  }

  return [...rowsMap.values()];
});

