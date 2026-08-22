import { createFileRoute, Link, notFound, redirect, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LegalShell, type LegalPage } from "@/components/legal/LegalShell";
import { getLegalPage } from "@/lib/legal.functions";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/seo/constants";

export const pageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["legal-page", slug],
    queryFn: () => getLegalPage({ data: { slug } }),
    staleTime: 60_000,
  });

function NotFoundView() {
  return (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Legal document not found</h1>
        <p className="mt-3 text-muted-foreground">
          The document you are looking for is not published on SanatanTools.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function ErrorView({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Something went wrong</h1>
        <Button
          className="mt-6"
          onClick={() => {
            reset();
            router.invalidate();
          }}
        >
          Try again
        </Button>
      </div>
    </SiteLayout>
  );
}

export const Route = createFileRoute("/legal/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "terms-conditions") {
      throw redirect({
        to: "/legal/$slug",
        params: { slug: "terms-and-conditions" },
        statusCode: 301,
      });
    }
  },
  loader: async ({ context, params }) => {
    const res = await context.queryClient.ensureQueryData(pageQuery(params.slug));
    if (!res.page) throw notFound();
    return res;
  },
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
  head: ({ loaderData, params }) => {
    if (!loaderData?.page) {
      return { meta: [{ title: "Legal — SanatanTools" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.page;
    const title = p.seo_title || `${p.title} — SanatanTools`;
    const description =
      p.seo_description || p.subtitle || `${p.title} — SanatanTools legal document.`;
    const url = `${SITE_URL}/legal/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": p.schema_type || "WebPage",
            name: p.title,
            description,
            url,
            dateModified: p.last_updated_at,
            datePublished: p.published_at ?? p.effective_date ?? p.last_updated_at,
            publisher: { "@type": "Organization", name: "SanatanTools" },
          }),
        },
      ],
    };
  },
  component: LegalRoute,
});

function LegalRoute() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(pageQuery(slug));
  if (!data.page) return <NotFoundView />;
  return (
    <SiteLayout>
      <LegalShell page={data.page as LegalPage} />
    </SiteLayout>
  );
}
