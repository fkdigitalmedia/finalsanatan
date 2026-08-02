import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LegalShell, type LegalPage } from "@/components/legal/LegalShell";
import { getLegalPage } from "@/lib/legal.functions";
import { Button } from "@/components/ui/button";

const q = queryOptions({
  queryKey: ["legal-page", "about"],
  queryFn: () => getLegalPage({ data: { slug: "about" } }),
  staleTime: 60_000,
});

export const Route = createFileRoute("/about")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="font-serif text-3xl">Something went wrong</h1>
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
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl">About page not published yet.</h1>
        <Button asChild className="mt-6">
          <Link to="/">Home</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    const url = "https://dharma-divine-tools.lovable.app/about";
    const title = p?.seo_title || "About SanatanTools";
    const description =
      p?.seo_description ||
      "SanatanTools is a modern devotional utility platform for Panchang, Kundli, festivals, mantras, and 100+ dharma tools.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(q);
  if (!data.page) return null;
  return (
    <SiteLayout>
      <LegalShell page={data.page as LegalPage} />
    </SiteLayout>
  );
}
