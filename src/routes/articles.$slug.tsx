import { createFileRoute, redirect } from "@tanstack/react-router";
import { getTool } from "@/config/tools";
import { getBlogPost } from "@/lib/blog-public.functions";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/$slug")({
  beforeLoad: async ({ params }) => {
    // 1. Check if slug matches a tool
    const tool = getTool(params.slug);
    if (tool) {
      throw redirect({
        to: "/tools/$slug",
        params: { slug: params.slug },
        statusCode: 301,
      });
    }

    // 2. Check if slug matches a blog post
    try {
      const { post } = await getBlogPost({ data: { slug: params.slug } });
      if (post) {
        throw redirect({
          to: "/blog/$slug",
          params: { slug: params.slug },
          statusCode: 301,
        });
      }
    } catch {
      // Ignore lookup errors
    }

    // 3. 301 redirect to /blog/$slug as default migration for article namespace
    throw redirect({
      to: "/blog/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
  head: () => ({
    meta: [
      { title: "Article Retired — SanatanTools" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ArticleGone,
});

function ArticleGone() {
  return (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-4xl font-semibold">410 — Article Gone</h1>
        <p className="mt-3 text-muted-foreground">
          This article has been permanently retired or moved to our blog archive.
        </p>
        <Button asChild className="mt-6">
          <Link to="/blog">Browse Blog & Articles</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}
