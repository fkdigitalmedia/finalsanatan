import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getPublicFestivalBySlug } from "@/lib/festivals-public.functions";
import { FestivalLanding, type FestivalRow } from "@/components/festivals/FestivalLanding";

const BASE_URL = "https://dharma-divine-tools.lovable.app";

const LANGS = ["en", "hi", "mr", "gu", "ta", "te", "kn", "bn", "ml", "pa", "or", "as"] as const;
const searchSchema = z.object({
  lang: z.enum(LANGS).optional(),
});

function festivalQueryOptions(slug: string, language: string) {
  return queryOptions({
    queryKey: ["public-festival", slug, language],
    queryFn: async () => {
      const res = await getPublicFestivalBySlug({ data: { slug, language } });
      if (!res.row) throw notFound();
      return res as unknown as {
        row: FestivalRow;
        occurrences: any[];
        related: any[];
        language: string;
        availableLanguages: string[];
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export const Route = createFileRoute("/festivals/$slug")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ lang: search.lang ?? "en" }),
  loader: ({ params, context, deps }) =>
    context.queryClient.ensureQueryData(festivalQueryOptions(params.slug, deps.lang)),
  head: ({ params, loaderData }) => {
    const data = loaderData as { row?: FestivalRow; language?: string } | undefined;
    const row = data?.row;
    const language = data?.language ?? "en";
    const canonical = `${BASE_URL}/festivals/${params.slug}`;
    if (!row) {
      return {
        meta: [
          { title: "Festival not found — SanatanTools" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const seo = (row.seo ?? {}) as {
      title?: string;
      description?: string;
      og_image?: string;
      keywords?: string[];
    };
    const title = seo.title || `${row.name} — Date, Puja Vidhi, Significance | SanatanTools`;
    const desc =
      seo.description ||
      row.short_description ||
      row.description ||
      `${row.name}: dates, puja vidhi, mantras, samagri, history and regional variations.`;
    const image =
      seo.og_image ||
      row.featured_image ||
      `${BASE_URL}/api/public/festivals/${params.slug}/og.svg`;

    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: language === "en" ? "en_IN" : `${language}_IN` },
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    if (seo.keywords?.length) meta.push({ name: "keywords", content: seo.keywords.join(", ") });

    const eventLd = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: row.name,
      description: desc,
      inLanguage: language,
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      ...(image ? { image: [image] } : {}),
      location: { "@type": "VirtualLocation", url: canonical },
      organizer: { "@type": "Organization", name: "SanatanTools", url: BASE_URL },
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Festivals", item: `${BASE_URL}/festivals` },
        { "@type": "ListItem", position: 3, name: row.name, item: canonical },
      ],
    };
    const faqLd =
      Array.isArray(row.faqs) && row.faqs.length
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: row.faqs.slice(0, 20).map((f: any) => ({
              "@type": "Question",
              name: f.question ?? f.q ?? "",
              acceptedAnswer: { "@type": "Answer", text: f.answer ?? f.a ?? "" },
            })),
          }
        : null;

    // Hreflang alternates for all available languages
    const available = ((loaderData as any)?.availableLanguages ?? ["en"]) as string[];
    const alternates = available.map((l) => ({
      rel: "alternate",
      hreflang: l === "en" ? "en" : l,
      href: l === "en" ? canonical : `${canonical}?lang=${l}`,
    }));

    return {
      meta,
      links: [
        { rel: "canonical", href: language === "en" ? canonical : `${canonical}?lang=${language}` },
        ...alternates,
        { rel: "alternate", hreflang: "x-default", href: canonical },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(eventLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: desc,
            inLanguage: language,
            ...(image ? { image: [image] } : {}),
            author: { "@type": "Organization", name: "SanatanTools", url: BASE_URL },
            publisher: { "@type": "Organization", name: "SanatanTools", url: BASE_URL },
            mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
            about: row.name,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description: desc,
            url: canonical,
            inLanguage: language,
            isPartOf: { "@type": "WebSite", name: "SanatanTools", url: BASE_URL },
            breadcrumb: { "@id": `${canonical}#breadcrumb` },
          }),
        },
        ...(faqLd ? [{ type: "application/ld+json", children: JSON.stringify(faqLd) }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Festival not found</h1>
      <p className="mt-3 text-muted-foreground">
        This festival is not published yet or the URL is incorrect.
      </p>
      <a href="/festivals" className="mt-6 inline-block text-accent hover:underline">
        ← Browse all festivals
      </a>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground text-sm">{error.message}</p>
      <button onClick={reset} className="mt-6 text-accent hover:underline">
        Try again
      </button>
    </div>
  ),
  component: FestivalDetail,
});

function FestivalDetail() {
  const { slug } = Route.useParams();
  const { lang } = Route.useSearch();
  const { data } = useSuspenseQuery(festivalQueryOptions(slug, lang ?? "en"));
  return (
    <FestivalLanding
      row={data.row}
      occurrences={data.occurrences}
      related={data.related}
      language={data.language}
      availableLanguages={data.availableLanguages ?? ["en"]}
      slug={slug}
    />
  );
}
