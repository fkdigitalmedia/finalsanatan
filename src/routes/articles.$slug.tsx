import { createFileRoute, redirect } from "@tanstack/react-router";
import { getTool } from "@/config/tools";
import { getCategory } from "@/config/categories";
import { getBlogPost } from "@/lib/blog-public.functions";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/$slug")({
  beforeLoad: async ({ params }) => {
    const rawSlug = params.slug.toLowerCase().trim();
    const cleanSlug = rawSlug.replace(/-practice$/, "");

    // 1. Check if raw or clean slug matches a tool
    const tool = getTool(rawSlug) || getTool(cleanSlug);
    if (tool) {
      if (tool.slug === "kundli-generator") {
        throw redirect({ to: "/kundli", statusCode: 301 });
      }
      throw redirect({
        to: "/tools/$slug",
        params: { slug: tool.slug },
        statusCode: 301,
      });
    }

    // 2. Check if slug matches a category hub
    if (rawSlug === "astrology" || cleanSlug === "astrology") {
      throw redirect({ to: "/astrology", statusCode: 301 });
    }
    const cat = getCategory(rawSlug) || getCategory(cleanSlug);
    if (cat) {
      throw redirect({
        to: `/${cat.slug}` as any,
        statusCode: 301,
      });
    }

    // 3. Check if slug matches an active blog post
    try {
      const { post } = await getBlogPost({ data: { slug: rawSlug } });
      if (post) {
        throw redirect({
          to: "/blog/$slug",
          params: { slug: post.slug },
          statusCode: 301,
        });
      }
    } catch {
      // Ignore lookup errors
    }

    // 4. Safe fallback to /blog instead of non-existent 404 URL
    throw redirect({
      to: "/blog",
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
