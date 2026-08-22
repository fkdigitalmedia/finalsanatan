import { createFileRoute, Link, stripSearchParams } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { Button } from "@/components/ui/button";
import { listBlogPosts, listBlogCategories } from "@/lib/blog-public.functions";
import { breadcrumbSchema, collectionPageSchema, graph, ldJson, SITE_URL } from "@/lib/seo/schema";

const TITLE = "Sanatan Blog — Astrology, Panchang & Festival Guides | SanatanTools";
const DESC =
  "Long-form guides on Vedic astrology, Panchang, muhurat, festivals, puja vidhi and mantras — written to answer the questions people actually ask.";

const searchSchema = z.object({
  page: fallback(z.number().int(), 1).default(1),
  category: fallback(z.string(), "").default(""),
  q: fallback(z.string(), "").default(""),
});

function postsQuery(page: number, category: string, q: string) {
  return queryOptions({
    queryKey: ["blog", "list", page, category, q],
    queryFn: () =>
      listBlogPosts({
        data: { page, pageSize: 12, category: category || undefined, q: q || undefined },
      }),
    staleTime: 5 * 60_000,
  });
}

const categoriesQuery = queryOptions({
  queryKey: ["blog", "categories"],
  queryFn: () => listBlogCategories(),
  staleTime: 10 * 60_000,
});

export const Route = createFileRoute("/blog/")({
  validateSearch: zodValidator(searchSchema),
  search: { middlewares: [stripSearchParams({ page: 1, category: "", q: "" })] },
  loaderDeps: ({ search }) => ({ page: search.page, category: search.category, q: search.q }),
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(postsQuery(deps.page, deps.category, deps.q)),
      context.queryClient.ensureQueryData(categoriesQuery),
    ]),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
    scripts: [
      ldJson(
        graph(
          collectionPageSchema({ name: TITLE, description: DESC, path: "/blog", items: [] }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ),
      ),
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { page, category, q } = Route.useSearch();
  const { data } = useSuspenseQuery(postsQuery(page, category, q));
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <SiteLayout>
      <div className="container-page py-10 space-y-10">
        <SectionHeading as="h1" eyebrow="Blog" title="Sanatan knowledge, explained" description={DESC} />

        {categories.length > 0 && (
          <nav className="flex flex-wrap gap-2" aria-label="Blog categories">
            <Button asChild size="sm" variant={category ? "outline" : "default"}>
              <Link to="/blog" search={{ page: 1, category: "", q: "" }}>
                All
              </Link>
            </Button>
            {categories.map((c) => (
              <Button
                key={c.slug}
                asChild
                size="sm"
                variant={category === c.slug ? "default" : "outline"}
              >
                <Link to="/blog" search={{ page: 1, category: c.slug, q: "" }}>
                  {c.slug} ({c.count})
                </Link>
              </Button>
            ))}
          </nav>
        )}

        {data.posts.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="New guides are published every week — check back soon."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:border-primary/50 transition-colors"
              >
                {p.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={p.featured_image}
                      alt={p.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  {p.category && (
                    <p className="text-[11px] uppercase tracking-wide text-accent">{p.category}</p>
                  )}
                  <h2 className="mt-1 font-serif text-lg leading-snug">{p.title}</h2>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  )}
                  {p.published_at && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(p.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button asChild size="sm" variant="outline" disabled={page <= 1}>
              <Link to="/blog" search={{ page: Math.max(1, page - 1), category, q }}>
                Previous
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {pages}
            </span>
            <Button asChild size="sm" variant="outline" disabled={page >= pages}>
              <Link to="/blog" search={{ page: Math.min(pages, page + 1), category, q }}>
                Next
              </Link>
            </Button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
