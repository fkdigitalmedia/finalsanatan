import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Flame,
  Sparkles,
  TrendingUp,
  Users,
  ChevronRight,
  Landmark,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { NewsletterCTA } from "@/components/tools/NewsletterCTA";
import { toolsByCategory } from "@/config/tools";
import { getFestivalsHub } from "@/lib/festivals-public.functions";

const BASE_URL = "https://dharma-divine-tools.lovable.app";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtShort(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const hubQuery = queryOptions({
  queryKey: ["festivals-hub"],
  queryFn: () => getFestivalsHub(),
  staleTime: 10 * 60 * 1000,
});

export const Route = createFileRoute("/festivals")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hubQuery),
  head: ({ loaderData }) => {
    const data = loaderData as { upcoming?: any[]; thisYear?: number } | undefined;
    const title = "Hindu Festivals & Vrats — Dates, Puja Vidhi, Mantras | SanatanTools";
    const desc =
      "Complete guide to every Hindu festival & vrat: exact dates, puja vidhi, mantras, samagri, history, and regional variations — computed with our Panchang engine.";
    const canonical = `${BASE_URL}/festivals`;
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Hindu Festivals",
      itemListElement: (data?.upcoming ?? []).slice(0, 20).map((f: any, i: number) => ({
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
        { "@type": "ListItem", position: 2, name: "Festivals", item: canonical },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(itemList) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: FestivalsHub,
});

function FestivalsHub() {
  const { data } = useSuspenseQuery(hubQuery);
  const tools = toolsByCategory("festivals");

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-soft/40 to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-12 md:py-16">
          <Breadcrumbs items={[{ label: "Festivals" }]} />
          <div className="mt-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Flame className="size-3.5" /> Complete festival calendar
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight">
              Every Hindu festival & vrat, decoded.
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Accurate dates from our internal Panchang engine, complete puja vidhi, mantras,
              samagri, mythology, and regional variations — for every festival, every year.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                to="/festivals/year/$year"
                params={{ year: String(data.thisYear) }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-primary-foreground font-medium shadow-glow hover:opacity-90"
              >
                <CalendarDays className="size-4" /> {data.thisYear} calendar
              </Link>
              <Link
                to="/festivals/year/$year"
                params={{ year: String(data.thisYear + 1) }}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 font-medium hover:border-primary/40"
              >
                {data.thisYear + 1} calendar <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING (next 90 days) */}
      {data.upcoming.length > 0 && (
        <section className="container-page py-12">
          <SectionHeading
            eyebrow="Coming soon"
            title="Next 90 days"
            description="Prepare in advance for these observances."
          />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.upcoming.map((f: any) => (
              <Link
                key={f.id}
                to="/festivals/$slug"
                params={{ slug: f.slug }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 hover:shadow-elegant transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                    <CalendarDays className="size-3" /> {fmtShort(f.nextDate)}
                  </div>
                  {f.category && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {f.category}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-primary">
                  {f.name}
                </h3>
                {f.short_description && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                    {f.short_description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED + TRENDING */}
      {(data.featured.length > 0 || data.trending.length > 0) && (
        <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-2 gap-8">
          {data.featured.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Featured</span>
              </div>
              <div className="mt-3 space-y-3">
                {data.featured.map((f: any) => (
                  <Link
                    key={f.id}
                    to="/festivals/$slug"
                    params={{ slug: f.slug }}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition"
                  >
                    {f.featured_image && (
                      <img
                        src={f.featured_image}
                        alt={f.name}
                        loading="lazy"
                        className="size-14 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-display font-semibold truncate">{f.name}</div>
                      {f.short_description && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {f.short_description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {data.trending.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Trending now
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {data.trending.map((f: any) => (
                  <Link
                    key={f.id}
                    to="/festivals/$slug"
                    params={{ slug: f.slug }}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition"
                  >
                    {f.featured_image && (
                      <img
                        src={f.featured_image}
                        alt={f.name}
                        loading="lazy"
                        className="size-14 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-display font-semibold truncate">{f.name}</div>
                      {f.short_description && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {f.short_description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* BROWSE BY CATEGORY */}
      {data.categories.length > 0 && (
        <section className="container-page py-12 border-t border-border/60">
          <SectionHeading eyebrow="Browse" title="By category" />
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.categories.map((c: any) => (
              <Link
                key={c.name}
                to="/festivals/category/$slug"
                params={{ slug: slugify(c.name) }}
                className="group rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-semibold group-hover:text-primary capitalize">
                    {c.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.count} festival{c.count === 1 ? "" : "s"}
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BROWSE BY DEITY */}
      {data.deities.length > 0 && (
        <section className="container-page py-12 border-t border-border/60">
          <SectionHeading eyebrow="Browse" title="By deity" />
          <div className="mt-6 flex flex-wrap gap-2">
            {data.deities.map((d: any) => (
              <Link
                key={d.name}
                to="/festivals/deity/$slug"
                params={{ slug: slugify(d.name) }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary/40 transition"
              >
                <Users className="size-3.5 text-accent" /> {d.name}
                <Badge variant="outline" className="ml-1 text-[10px]">
                  {d.count}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FESTIVAL TOOLS */}
      {tools.length > 0 && (
        <section className="container-page py-12 border-t border-border/60">
          <SectionHeading
            eyebrow="Utilities"
            title="Festival tools"
            description="Plan pujas and check muhurta with our internal calculators."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {tools.slice(0, 12).map((t) => (
              <Link
                key={t.slug}
                to="/tools/$slug"
                params={{ slug: t.slug }}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-primary/40 transition"
              >
                <Landmark className="size-4 text-accent" /> {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="container-page py-12 border-t border-border/60">
        <NewsletterCTA source="festivals-hub" />
      </section>
    </SiteLayout>
  );
}
