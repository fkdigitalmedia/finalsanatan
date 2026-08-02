import { createFileRoute } from "@tanstack/react-router";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { KundliMatchingTool } from "@/components/tools/KundliMatchingTool";
import { useTranslation } from "@/i18n/I18nProvider";

const FAQS = [
  {
    q: "How many gunas are needed for a good match?",
    a: "Traditionally, 18 out of 36 is the minimum for compatibility; 24+ is considered very good and 32+ excellent.",
  },
  {
    q: "Is Guna Milan enough for marriage decisions?",
    a: "No. Guna Milan is a starting point; a full evaluation must consider both charts, dashas, doshas and life circumstances.",
  },
  {
    q: "What is Mangal Dosha?",
    a: "Mangal (Mars) Dosha occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th or 12th house. It can be cancelled if both partners are Manglik.",
  },
  {
    q: "Is my data stored?",
    a: "No. All calculations happen in your browser; we do not save any birth details.",
  },
];

export const Route = createFileRoute("/tools/kundli-matching")({
  head: () => ({
    meta: [
      { title: "Kundli Matching (Guna Milan) — Free Online Ashtakoot Compatibility" },
      {
        name: "description",
        content:
          "Free Vedic Kundli Matching with full Ashtakoot 36-guna breakdown, Mangal Dosha check, Nadi & Bhakoot analysis. Instant compatibility report.",
      },
      { property: "og:title", content: "Kundli Matching — Free 36 Guna Milan" },
      {
        property: "og:description",
        content: "Free Ashtakoot Kundli Matching with Mangal, Nadi & Bhakoot dosha check.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Kundli Matching",
          description: "Free Ashtakoot 36-guna Kundli Matching with Mangal Dosha check.",
          url: "https://sanatantools.com/tools/kundli-matching",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, raw } = useTranslation();
  return (
    <PremiumToolShell
      title={t("premium_tools.kundli_matching.title")}
      tagline={t("premium_tools.kundli_matching.tagline")}
      breadcrumb={t("premium_tools.kundli_matching.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.kundli_matching.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.kundli_matching.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.kundli_matching.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.kundli_matching.related.love_compatibility.title"),
          href: "/tools/love-compatibility",
          description: t("premium_tools.kundli_matching.related.love_compatibility.description"),
        },
        {
          title: t("premium_tools.kundli_matching.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.kundli_matching.related.muhurat.description"),
        },
        {
          title: t("premium_tools.kundli_matching.related.free_kundli.title"),
          href: "/kundli",
          description: t("premium_tools.kundli_matching.related.free_kundli.description"),
        },
      ]}
    >
      <KundliMatchingTool />
    </PremiumToolShell>
  );
}
