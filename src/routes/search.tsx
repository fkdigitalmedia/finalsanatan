import { createFileRoute, Link, useNavigate, stripSearchParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchTools } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { allSiteFaqs } from "@/config/faqs";
import { SIGNS, HOROSCOPE_PERIODS, periodLabel, periodPath } from "@/lib/horoscope-public";
import { listBlogPosts } from "@/lib/blog-public.functions";
import { track } from "@/lib/analytics/track";
import { breadcrumbSchema, graph, ldJson, SITE_URL, webPageSchema } from "@/lib/seo/schema";

const TITLE = "Search — Tools, Horoscopes, Festivals & Guides | SanatanTools";
const DESC =
  "Search every SanatanTools calculator, horoscope, festival page, guide and help answer in one place.";

const searchSchema = z.object({ q: fallback(z.string(), "").default("") });

interface Hit {
  title: string;
  subtitle: string;
  href: string;
  group: string;
}

function localHits(q: string): Hit[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const hits: Hit[] = [];

  for (const t of searchTools(query).slice(0, 20)) {
    hits.push({
      title: t.title,
      subtitle: t.description,
      href: `/tools/${t.slug}`,
      group: "Tools",
    });
  }
  for (const c of CATEGORIES) {
    if (c.title.toLowerCase().includes(query) || c.slug.includes(query)) {
      hits.push({
        title: c.title,
        subtitle: c.description,
        href: `/${c.slug}`,
        group: "Categories",
      });
    }
  }
  for (const s of SIGNS) {
    if ([s.english, s.sanskrit, s.hindi, s.slug].some((v) => v.toLowerCase().includes(query))) {
      for (const p of HOROSCOPE_PERIODS) {
        hits.push({
          title: `${s.english} ${periodLabel(p)} Horoscope`,
          subtitle: `${s.sanskrit} · ${s.element} · ${s.rulingPlanet}`,
          href: periodPath(p, s.slug),
          group: "Horoscopes",
        });
      }
    }
  }
  for (const f of allSiteFaqs()) {
    if (f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)) {
      hits.push({
        title: f.question,
        subtitle: f.answer.slice(0, 140),
        href: "/faq",
        group: "Help",
      });
    }
  }
  return hits;
}

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  search: { middlewares: [stripSearchParams({ q: "" })] },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/search` },
      { name: "robots", content: "noindex,follow" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/search` }],
    scripts: [
      ldJson(
        graph(
          webPageSchema({ name: TITLE, description: DESC, path: "/search" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Search", path: "/search" },
          ]),
        ),
      ),
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(q);

  const local = localHits(q);
  const { data: blog } = useQuery({
    queryKey: ["search", "blog", q],
    queryFn: () => listBlogPosts({ data: { q, pageSize: 6 } }),
    enabled: q.trim().length > 1,
    staleTime: 60_000,
  });

  const hits: Hit[] = [
    ...local,
    ...(blog?.posts ?? []).map((p) => ({
      title: p.title,
      subtitle: p.excerpt ?? "",
      href: `/blog/${p.slug}`,
      group: "Blog",
    })),
  ];

  const groups = [...new Set(hits.map((h) => h.group))];

  return (
    <SiteLayout>
      <div className="container-page py-10 space-y-10">
        <SectionHeading eyebrow="Search" title="Find anything on SanatanTools" description={DESC} />

        <form
          className="relative max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            track("site_search", { meta: { q: draft } });
            navigate({ to: "/search", search: { q: draft } });
          }}
        >
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Kundli, Rahu Kaal, Aries horoscope, Diwali…"
            aria-label="Search SanatanTools"
            className="pl-9 h-11"
          />
          <Button type="submit" className="mt-3">
            Search
          </Button>
        </form>

        {!q.trim() ? (
          <EmptyState
            title="Start typing"
            description="Search tools, horoscopes, festivals, guides and help answers."
          />
        ) : hits.length === 0 ? (
          <EmptyState
            title={`No results for “${q}”`}
            description="Try a shorter phrase, or browse all tools."
            action={
              <Button asChild variant="outline">
                <Link to="/tools" search={{ q: "" }}>
                  Browse all tools
                </Link>
              </Button>
            }
          />
        ) : (
          groups.map((g) => (
            <section key={g}>
              <h2 className="font-serif text-xl">{g}</h2>
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
                {hits
                  .filter((h) => h.group === g)
                  .slice(0, 12)
                  .map((h) => (
                    <li key={`${h.group}-${h.href}-${h.title}`}>
                      <Link
                        to={h.href as unknown as "/"}
                        className="block p-4 hover:bg-secondary/60"
                      >
                        <p className="text-sm font-semibold">{h.title}</p>
                        {h.subtitle && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {h.subtitle}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </SiteLayout>
  );
}
