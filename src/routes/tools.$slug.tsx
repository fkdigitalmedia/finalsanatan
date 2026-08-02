import { Suspense } from "react";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { ArrowRight, Bell, Sparkles, Share2, Bookmark, Clock, Tag } from "lucide-react";
import { ToolPageSkeleton } from "@/components/ui-kit/LoadingSkeleton";
import { SanatanLoaderInline } from "@/components/ui-kit/SanatanLoader";
import { ErrorState } from "@/components/ui-kit/ErrorState";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { ToolListCard } from "@/components/ui-kit/ToolListCard";
import { AdSlot } from "@/components/ui-kit/AdSlot";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolShell } from "@/components/tools/ToolShell";
import { getToolContent } from "@/tools/registry";
import { useLocalizedToolContent } from "@/tools/content/i18n";
import { getTool, relatedTools, categoryFor, popularTools } from "@/config/tools";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";
import { useLocalizedTool, useLocalizedFaqs } from "@/i18n/useToolI18n";
import { LocalizedHeadRaw } from "@/components/i18n/LocalizedHead";
import { tStandalone } from "@/i18n/standalone";

export const Route = createFileRoute("/tools/$slug")({
  beforeLoad: ({ params }) => {
    // Flagship tools have dedicated pages
    const flagshipRedirects: Record<string, string> = {
      "kundli-generator": "/kundli",
    };
    const target = flagshipRedirects[params.slug];
    if (target) throw redirect({ to: target });
  },
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tool not found — SanatanTools" }, { name: "robots", content: "noindex" }],
      };
    }
    const { tool } = loaderData;
    const cat = categoryFor(tool);
    const title = `${tool.title} — ${cat?.title ?? "SanatanTools"}`;
    return {
      meta: [
        { title },
        { name: "description", content: tool.description },
        { property: "og:title", content: title },
        { property: "og:description", content: tool.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/tools/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/tools/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.title,
            description: tool.description,
            applicationCategory: cat?.title ?? "Utility",
            operatingSystem: "Web",
            url: `/tools/${params.slug}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Tools", item: "/tools" },
              ...(cat
                ? [{ "@type": "ListItem", position: 3, name: cat.title, item: `/${cat.slug}` }]
                : []),
              {
                "@type": "ListItem",
                position: cat ? 4 : 3,
                name: tool.title,
                item: `/tools/${params.slug}`,
              },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: ToolNotFound,
  pendingComponent: ToolPending,
  errorComponent: ToolError,
  component: ToolDetail,
});

function ToolPending() {
  return <ToolPageSkeleton />;
}

function ToolError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const title = withFallback(
    tStandalone("tool_page.error_title"),
    "tool_page.error_title",
    "This tool failed to load",
  );
  const body = withFallback(
    tStandalone("tool_page.error_body"),
    "tool_page.error_body",
    "An unexpected error occurred while rendering this tool. Please try again.",
  );
  return <ErrorState title={title} message={body} onRetry={reset} />;
}

function withFallback(value: string, key: string, fallback: string) {
  return value === key ? fallback : value;
}

/** Shown while a code-split tool widget's chunk is downloading. */
function ToolWidgetFallback() {
  return (
    <div className="py-10">
      <SanatanLoaderInline />
    </div>
  );
}

function ToolDetail() {
  const { tool } = Route.useLoaderData();
  const cat = categoryFor(tool);
  const related = relatedTools(tool, 4);
  const popular = popularTools(4)
    .filter((p) => p.slug !== tool.slug)
    .slice(0, 4);
  const Icon = cat?.icon;
  const content = getToolContent(tool.slug);

  const { t, lang } = useTranslation();
  // Language-specific content pack (from scripts/translate-tool-content.ts),
  // lazily downloaded. Fields fall back to English until/unless it arrives.
  const localized = useLocalizedToolContent(tool.slug, lang);
  const catLabel = useCategoryLabel();
  const { title, description, intro } = useLocalizedTool(tool);
  const faqs = useLocalizedFaqs(tool.slug);
  const catTitle = cat ? catLabel(cat.slug, "title", cat.title) : "";
  const metaTitle = cat
    ? t("tool_page.meta_title", { title, category: catTitle })
    : t("tool_page.meta_title_default", { title });

  const graph: unknown[] = [
    {
      "@type": "SoftwareApplication",
      name: title,
      description,
      applicationCategory: catTitle || "Utility",
      operatingSystem: "Web",
      url: `/tools/${tool.slug}`,
      inLanguage: lang,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: (content?.faqs ?? faqs).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  if (content?.howToUse?.length) {
    graph.push({
      "@type": "HowTo",
      name: `How to use ${title}`,
      inLanguage: lang,
      step: content.howToUse.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: `Step ${i + 1}`,
        text: s,
      })),
    });
  }

  const structuredData = {
    id: `tool-${tool.slug}`,
    data: { "@context": "https://schema.org", "@graph": graph },
  };

  const head = (
    <LocalizedHeadRaw title={metaTitle} description={description} structuredData={structuredData} />
  );

  if (content) {
    const {
      Component,
      howToUse,
      benefits,
      faqs: overrideFaqs,
      intro: overrideIntro,
      useCases,
      mistakes,
      examples,
      formula,
      accuracy,
      privacy,
      relatedSlugs,
    } = content;
    // `localized` comes from the hook at the top of this component — the pack
    // is fetched lazily, so it is undefined on first paint and for English.
    return (
      <>
        {head}
        <ToolShell
          tool={tool}
          intro={localized?.intro ?? overrideIntro ?? intro}
          howToUse={localized?.howToUse ?? howToUse}
          benefits={localized?.benefits ?? benefits}
          faqs={localized?.faqs ?? overrideFaqs}
          useCases={localized?.useCases ?? useCases}
          mistakes={localized?.mistakes ?? mistakes}
          examples={localized?.examples ?? examples}
          formula={localized?.formula ?? formula}
          accuracy={localized?.accuracy ?? accuracy}
          privacy={localized?.privacy ?? privacy}
          relatedSlugs={localized?.relatedSlugs ?? relatedSlugs}
        >
          <Suspense fallback={<ToolWidgetFallback />}>
            <Component />
          </Suspense>
        </ToolShell>
      </>
    );
  }

  return (
    <>
      {head}
      <SiteLayout>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-radial-glow" aria-hidden />
          <div
            className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-soft/40 to-transparent"
            aria-hidden
          />
          <div className="container-page relative py-12 md:py-14">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: t("tool_shell.tools_breadcrumb"), href: "/tools" },
                ...(cat ? [{ label: catTitle, href: `/${cat.slug}` }] : []),
                { label: title },
              ]}
            />

            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid place-items-center size-14 rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                    {Icon ? <Icon className="size-6" /> : <Sparkles className="size-6" />}
                  </div>
                  {cat && (
                    <a
                      href={`/${cat.slug}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      {catTitle}
                    </a>
                  )}
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
                  {description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-primary/40 bg-primary-soft text-accent"
                  >
                    <Sparkles className="size-3" />
                    {tool.status === "live"
                      ? t("tool_shell.hero_status_live")
                      : tool.status === "beta"
                        ? t("tool_shell.hero_status_beta")
                        : t("tool_shell.hero_status_coming")}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <Clock className="size-3" />{" "}
                    {t("tool_page.added", { date: formatDate(tool.addedAt, lang) })}
                  </Badge>
                  {tool.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="gap-1 text-muted-foreground">
                      <Tag className="size-3" /> {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="shadow-glow" disabled>
                    {tool.status === "live" ? t("tool_page.open_tool") : t("tool_page.notify_cta")}
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Share2 className="size-4" /> {t("tool_shell.share")}
                  </Button>
                  <Button size="lg" variant="ghost" className="gap-2">
                    <Bookmark className="size-4" /> {t("tool_page.save")}
                  </Button>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
                  <div className="flex items-start gap-3">
                    <div className="grid place-items-center size-10 rounded-xl bg-primary-soft text-accent shrink-0">
                      <Bell className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">{t("tool_page.notify_title")}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("tool_page.notify_body", { title })}
                      </p>
                    </div>
                  </div>
                  <form className="mt-4 flex gap-2">
                    <Input
                      type="email"
                      placeholder={t("common.email_placeholder")}
                      className="bg-background"
                    />
                    <Button aria-label={t("tool_page.notify_cta")}>
                      <ArrowRight className="size-4" />
                    </Button>
                  </form>
                </div>
                <AdSlot size="square" />
              </aside>
            </div>
          </div>
        </section>

        <section className="container-page py-14">
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 md:p-16 text-center">
            <div className="mx-auto grid place-items-center size-14 rounded-2xl bg-primary-soft text-accent">
              <Sparkles className="size-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-semibold">
              {t("tool_page.crafted_title")}
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              {t("tool_page.crafted_body")}
            </p>
            {cat && (
              <a href={`/${cat.slug}`} className="inline-block mt-6">
                <Button variant="outline" className="gap-2">
                  {t("tool_page.explore_category", { category: catTitle })}{" "}
                  <ArrowRight className="size-4" />
                </Button>
              </a>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="container-page py-14 border-t border-border/60">
            <SectionHeading
              eyebrow={t("tool_shell.related_eyebrow")}
              title={
                cat
                  ? t("tool_shell.related_title", { category: catTitle })
                  : t("tool_shell.related_title_default")
              }
              description={t("tool_shell.related_description")}
            />
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <ToolListCard key={r.slug} tool={r} showCategory={false} />
              ))}
            </div>
          </section>
        )}

        <section className="container-page py-14 border-t border-border/60">
          <SectionHeading
            eyebrow={t("tool_page.popular_eyebrow")}
            title={t("tool_page.popular_title")}
            description={t("tool_page.popular_description")}
          />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((p) => (
              <ToolListCard key={p.slug} tool={p} />
            ))}
          </div>
        </section>
      </SiteLayout>
    </>
  );
}

function ToolNotFound() {
  const notFoundTitle = withFallback(
    tStandalone("tool_page.not_found_title"),
    "tool_page.not_found_title",
    "Tool not found",
  );
  const notFoundBody = withFallback(
    tStandalone("tool_page.not_found_body"),
    "tool_page.not_found_body",
    "The tool you're looking for doesn't exist yet.",
  );
  const browseAll = withFallback(
    tStandalone("tool_shell.browse_all"),
    "tool_shell.browse_all",
    "Browse all tools",
  );
  const toolsLabel = withFallback(
    tStandalone("tool_shell.tools_breadcrumb"),
    "tool_shell.tools_breadcrumb",
    "Tools",
  );
  return (
    <SiteLayout>
      <section className="container-page py-24 text-center">
        <Breadcrumbs
          items={[{ label: toolsLabel, href: "/tools" }, { label: notFoundTitle }]}
          className="justify-center mb-6"
        />
        <h1 className="font-display text-4xl md:text-5xl font-semibold">{notFoundTitle}</h1>
        <p className="mt-3 text-muted-foreground">{notFoundBody}</p>
        <a href="/tools" className="inline-block mt-6">
          <Button className="gap-2">
            {browseAll} <ArrowRight className="size-4" />
          </Button>
        </a>
      </section>
    </SiteLayout>
  );
}

function formatDate(iso: string, lang: string) {
  const locale = lang === "hi" ? "hi-IN" : "en-US";
  return new Date(iso).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
