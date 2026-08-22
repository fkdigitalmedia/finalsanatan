import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { getFestivalsByYear } from "@/lib/festivals-public.functions";
import { SITE_URL } from "@/lib/seo/constants";

const BASE_URL = SITE_URL;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function yearQuery(year: number) {
  return queryOptions({
    queryKey: ["festivals-year", year],
    queryFn: async () => {
      const res = await getFestivalsByYear({ data: { year } });
      return res;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export const Route = createFileRoute("/festivals/year/$year")({
  parseParams: (raw) => {
    const y = Number(raw.year);
    if (!Number.isFinite(y) || y < 2020 || y > 2100) throw notFound();
    return { year: String(y) };
  },
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(yearQuery(Number(params.year))),
  head: ({ params, loaderData }) => {
    const data = loaderData as { events?: any[] } | undefined;
    const year = params.year;
    const canonical = `${BASE_URL}/festivals/year/${year}`;
    const title = `Hindu Festivals ${year} — Complete Calendar & Dates | SanatanTools`;
    const desc = `Every Hindu festival, vrat, and observance in ${year} with exact dates from our Panchang engine — month-by-month calendar.`;
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Hindu Festivals ${year}`,
      itemListElement: (data?.events ?? []).slice(0, 100).map((e: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE_URL}/festivals/${e.festival.slug}`,
        name: `${e.festival.name} — ${e.isoDate}`,
      })),
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Festivals", item: `${BASE_URL}/festivals` },
        { "@type": "ListItem", position: 3, name: year, item: canonical },
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
  errorComponent: ({ error }) => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Couldn't load calendar</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Year not available</h1>
      <p className="mt-3 text-muted-foreground">
        We only maintain the calendar for a limited date range.
      </p>
    </div>
  ),
  component: YearArchive,
});

function YearArchive() {
  const { year } = Route.useParams();
  const y = Number(year);
  const { data } = useSuspenseQuery(yearQuery(y));
  const byMonth: Record<number, typeof data.events> = {};
  for (const e of data.events) {
    const m = new Date(e.isoDate + "T12:00:00").getUTCMonth();
    (byMonth[m] ??= []).push(e);
  }

  return (
    <SiteLayout>
      <section className="border-b border-border/60">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Festivals", href: "/festivals" }, { label: year }]} />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <CalendarDays className="size-3.5" /> Complete calendar
              </div>
              <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
                Hindu Festivals {year}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {data.events.length} observances this year, computed by our Panchang engine.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/festivals/year/$year"
                params={{ year: String(y - 1) }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 hover:border-primary/40"
              >
                <ChevronLeft className="size-4" /> {y - 1}
              </Link>
              <Link
                to="/festivals/year/$year"
                params={{ year: String(y + 1) }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 hover:border-primary/40"
              >
                {y + 1} <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 space-y-10">
        {MONTHS.map((mName, i) => {
          const events = byMonth[i];
          if (!events || events.length === 0) return null;
          return (
            <div key={i}>
              <SectionHeading
                eyebrow={`${mName} ${year}`}
                title={`${events.length} observance${events.length === 1 ? "" : "s"}`}
              />
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {events.map((e, idx) => {
                  const d = new Date(e.isoDate + "T12:00:00");
                  return (
                    <Link
                      key={`${e.festival.id}-${idx}`}
                      to="/festivals/$slug"
                      params={{ slug: e.festival.slug }}
                      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition"
                    >
                      <div className="grid place-items-center size-14 shrink-0 rounded-xl bg-gradient-brand text-primary-foreground">
                        <div className="text-lg font-bold leading-none">{d.getUTCDate()}</div>
                        <div className="text-[10px] uppercase tracking-widest mt-0.5">
                          {MONTHS[d.getUTCMonth()].slice(0, 3)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold truncate group-hover:text-primary">
                          {e.festival.name}
                        </div>
                        {e.label && <div className="text-xs text-accent">{e.label}</div>}
                        {e.festival.short_description && (
                          <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {e.festival.short_description}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
        {data.events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No festival dates cached for {year} yet. The hourly job will populate this.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
