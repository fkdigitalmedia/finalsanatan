import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, Users } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { getFestivalsHub, listPublicFestivals } from "@/lib/festivals-public.functions";
import { SITE_URL } from "@/lib/seo/constants";

const BASE_URL = SITE_URL;

function unslug(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function deityQuery(slug: string) {
  return queryOptions({
    queryKey: ["festivals-deity", slug],
    queryFn: async () => {
      const hub = await getFestivalsHub();
      const match = hub.deities.find(
        (d: any) => d.name.toLowerCase().replace(/[^\w]+/g, "-") === slug,
      );
      const deityName = match?.name ?? unslug(slug);
      const list = await listPublicFestivals({ data: { deity: deityName, limit: 200 } });
      return { deityName, rows: list.rows };
    },
    staleTime: 10 * 60 * 1000,
  });
}

export const Route = createFileRoute("/festivals/deity/$slug")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(deityQuery(params.slug)),
  head: ({ params, loaderData }) => {
    const data = loaderData as { deityName?: string; rows?: any[] } | undefined;
    const name = data?.deityName ?? unslug(params.slug);
    const canonical = `${BASE_URL}/festivals/deity/${params.slug}`;
    const title = `${name} Festivals — Dates, Puja Vidhi & Mantras | SanatanTools`;
    const desc = `Every festival dedicated to ${name}: exact dates, puja vidhi, mantras, samagri and mythology.`;
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${name} Festivals`,
      itemListElement: (data?.rows ?? []).slice(0, 50).map((f: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE_URL}/festivals/${f.slug}`,
        name: f.name,
      })),
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Festivals", item: `${BASE_URL}/festivals` },
        { "@type": "ListItem", position: 3, name: name, item: canonical },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: canonical },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(itemList) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: DeityHub,
});

function DeityHub() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(deityQuery(slug));
  return (
    <SiteLayout>
      <section className="border-b border-border/60">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: "Festivals", href: "/festivals" }, { label: data.deityName }]}
          />
          <div className="mt-6 flex items-center gap-3">
            <div className="grid place-items-center size-14 rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Users className="size-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-accent">
                Deity
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold">
                {data.deityName} Festivals
              </h1>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground max-w-3xl">
            {data.rows.length} festival{data.rows.length === 1 ? "" : "s"} dedicated to{" "}
            {data.deityName}, with complete puja vidhi, mantras, and mythology.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {data.rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            No festivals published for this deity yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.rows.map((f: any) => (
              <Link
                key={f.id}
                to="/festivals/$slug"
                params={{ slug: f.slug }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition"
              >
                {f.featured_image && (
                  <img
                    src={f.featured_image}
                    alt={f.name}
                    loading="lazy"
                    className="mb-3 w-full aspect-[4/3] object-cover rounded-xl"
                  />
                )}
                {f.category && (
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {f.category}
                  </div>
                )}
                <div className="mt-1 font-display text-lg font-semibold group-hover:text-primary">
                  {f.name}
                </div>
                {f.short_description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                    {f.short_description}
                  </p>
                )}
                <div className="mt-3 text-xs text-accent inline-flex items-center gap-1">
                  View details <ChevronRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
