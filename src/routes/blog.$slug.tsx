import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { ShareButtons } from "@/components/share/ShareButtons";
import { Button } from "@/components/ui/button";
import { getBlogPost } from "@/lib/blog-public.functions";
import { articleSchema, breadcrumbSchema, graph, ldJson, SITE_URL } from "@/lib/seo/schema";

function postQuery(slug: string) {
  return queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: () => getBlogPost({ data: { slug } }),
    staleTime: 5 * 60_000,
  });
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const res = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!res.post) throw notFound();
    return res;
  },
  head: ({ params, loaderData }) => {
    const path = `/blog/${params.slug}`;
    const url = `${SITE_URL}${path}`;
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [
          { title: "Article not found — SanatanTools" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const desc = post.excerpt ?? `${post.title} — a guide from SanatanTools.`;
    return {
      meta: [
        { title: `${post.title} | SanatanTools` },
        { name: "description", content: desc },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post.featured_image
          ? [
              { property: "og:image", content: post.featured_image },
              { name: "twitter:image", content: post.featured_image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        ldJson(
          graph(
            articleSchema({
              type: "BlogPosting",
              headline: post.title,
              description: desc,
              path,
              image: post.featured_image ?? undefined,
              datePublished: post.published_at ?? undefined,
              dateModified: post.updated_at,
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path },
            ]),
          ),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl">Article not found</h1>
        <Button asChild className="mt-6">
          <Link to="/blog">Back to the blog</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQuery(slug));
  const post = data.post!;

  return (
    <SiteLayout>
      <article className="container-page py-10 max-w-3xl">
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl leading-tight">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {post.category && (
            <span className="uppercase tracking-wide text-accent">{post.category}</span>
          )}
          {post.published_at && (
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString()}
            </time>
          )}
        </div>

        {post.featured_image && (
          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border">
            <img src={post.featured_image} alt={post.title} className="size-full object-cover" />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          <ReactMarkdown>{post.content_md}</ReactMarkdown>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <ShareButtons title={post.title} />
        </div>

        {data.related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-xl">Related reading</h2>
            <ul className="mt-4 space-y-3">
              {data.related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: r.slug }}
                    className="text-sm hover:text-accent"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}
