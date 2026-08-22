import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Flame, Sparkles, ArrowRight, X } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { ToolListCard } from "@/components/ui-kit/ToolListCard";
import { AdSlot } from "@/components/ui-kit/AdSlot";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/config/categories";
import { TOOLS, popularTools, recentTools, searchTools, type ToolStatus } from "@/config/tools";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";
import { LocalizedHead } from "@/components/i18n/LocalizedHead";
import { localizedSearchableText } from "@/i18n/useToolI18n";
import { SITE_URL } from "@/lib/seo/constants";

export const Route = createFileRoute("/tools/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  search: {
    middlewares: [stripSearchParams({ q: "" })],
  },
  head: () => ({
    meta: [
      { title: "All Tools — SanatanTools" },
      {
        name: "description",
        content:
          "Browse 100+ Sanatan Dharma tools — Panchang, mantras, festivals, temples, calculators, Sanskrit, baby names and AI. Filter, search and discover.",
      },
      { property: "og:title", content: "All Tools — SanatanTools" },
      {
        property: "og:description",
        content:
          "The complete SanatanTools hub — search, filter and discover every tool across 10 categories.",
      },
      { property: "og:url", content: `${SITE_URL}/tools` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/tools` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "SanatanTools — All Tools",
          description:
            "Complete directory of Sanatan Dharma tools across Panchang, mantras, festivals, temples, calculators, Sanskrit, baby names and AI.",
          url: "/tools",
        }),
      },
    ],
  }),
  component: ToolsHub,
});

type Sort = "popular" | "recent" | "az";

function ToolsHub() {
  const { t, lang } = useTranslation();
  const catLabel = useCategoryLabel();
  const { q: initialQ } = Route.useSearch();
  const [query, setQuery] = useState(initialQ ?? "");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<ToolStatus | "all">("all");
  const [sort, setSort] = useState<Sort>("popular");

  const filtered = useMemo(() => {
    // Localised search: filter across per-language haystacks + English fallback.
    const base = query
      ? searchTools("", { category, status }).filter((tool) => {
          const catT = catLabel(tool.category, "title", tool.category);
          return localizedSearchableText(tool, lang, catT).includes(query.toLowerCase());
        })
      : searchTools("", { category, status });

    switch (sort) {
      case "recent":
        return [...base].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      case "az":
        return [...base].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return [...base].sort((a, b) => b.popularity - a.popularity);
    }
  }, [query, category, status, sort, lang, catLabel]);

  const popular = popularTools(6);
  const recent = recentTools(6);
  const hasFilters = query || category !== "all" || status !== "all" || sort !== "popular";

  return (
    <SiteLayout>
      <LocalizedHead titleKey="tool_hub.meta_title" descriptionKey="tool_hub.meta_description" />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-soft/40 to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-12 md:py-16">
          <Breadcrumbs items={[{ label: t("tool_hub.breadcrumb") }]} className="mb-6" />

          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 gap-1.5 border-primary/40 bg-primary-soft text-accent"
            >
              <Sparkles className="size-3" />
              {t("tool_hub.badge_count", { tools: TOOLS.length, categories: CATEGORIES.length })}
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
              {t("tool_hub.hero_pre")}{" "}
              <span className="text-gradient-brand">{t("tool_hub.hero_highlight")}</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              {t("tool_hub.hero_subtitle")}
            </p>

            <div className="mt-8 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("tool_hub.search_placeholder")}
                  className="h-14 pl-12 pr-12 rounded-2xl bg-background/90 backdrop-blur shadow-elegant text-base"
                  aria-label={t("tool_hub.search_placeholder")}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label={t("tool_hub.clear_search")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center size-8 rounded-full hover:bg-secondary"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground mr-1">
                  <Filter className="size-3.5" /> {t("tool_hub.filter_label")}
                </div>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    className="h-9 w-[180px]"
                    aria-label={t("tool_hub.filter_category")}
                  >
                    <SelectValue placeholder={t("tool_hub.filter_category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("tool_hub.filter_category_all")}</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {catLabel(c.slug, "title", c.title)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={(v) => setStatus(v as ToolStatus | "all")}>
                  <SelectTrigger className="h-9 w-[150px]" aria-label={t("tool_hub.filter_status")}>
                    <SelectValue placeholder={t("tool_hub.filter_status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("tool_hub.filter_status_all")}</SelectItem>
                    <SelectItem value="live">{t("tool_hub.filter_status_live")}</SelectItem>
                    <SelectItem value="beta">{t("tool_hub.filter_status_beta")}</SelectItem>
                    <SelectItem value="coming-soon">
                      {t("tool_hub.filter_status_coming")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                  <SelectTrigger className="h-9 w-[150px]" aria-label={t("tool_hub.sort_label")}>
                    <SelectValue placeholder={t("tool_hub.sort_label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">{t("tool_hub.sort_popular")}</SelectItem>
                    <SelectItem value="recent">{t("tool_hub.sort_recent")}</SelectItem>
                    <SelectItem value="az">{t("tool_hub.sort_az")}</SelectItem>
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                      setStatus("all");
                      setSort("popular");
                    }}
                    className="text-muted-foreground"
                  >
                    {t("tool_hub.reset")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
              {hasFilters ? t("tool_hub.results_filtered") : t("tool_hub.results_all")}
            </p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold tracking-tight">
              {t("tool_hub.results_count", { count: filtered.length })}
            </h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={t("tool_hub.empty_title")}
            description={t("tool_hub.empty_description")}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => (
              <ToolListCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <AdSlot size="leaderboard" />
        </div>
      </section>

      <section className="container-page py-14 border-t border-border/60">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <SectionHeading
            eyebrow={t("tool_hub.popular_eyebrow")}
            title={
              <>
                <Flame className="inline size-6 text-primary -mt-1" /> {t("tool_hub.popular_title")}
              </>
            }
            description={t("tool_hub.popular_description")}
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popular.map((tool) => (
            <ToolListCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="container-page py-14 border-t border-border/60">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <SectionHeading
            eyebrow={t("tool_hub.recent_eyebrow")}
            title={t("tool_hub.recent_title")}
            description={t("tool_hub.recent_description")}
          />
          <a href="/tools">
            <Button variant="outline" className="gap-2">
              {t("tool_hub.view_all")} <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map((tool) => (
            <ToolListCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <SectionHeading
          eyebrow={t("tool_hub.categories_eyebrow")}
          title={t("tool_hub.categories_title")}
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.slug}
                href={`/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary-soft/40 transition-colors"
              >
                <Icon className="size-4 text-accent" />
                {catLabel(c.slug, "title", c.title)}
                <span className="text-xs text-muted-foreground">
                  {TOOLS.filter((t) => t.category === c.slug).length}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
