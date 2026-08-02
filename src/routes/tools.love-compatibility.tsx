import { createFileRoute } from "@tanstack/react-router";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { KundliMatchingTool } from "@/components/tools/KundliMatchingTool";
import { useTranslation } from "@/i18n/I18nProvider";

const FAQS = [
  {
    q: "How is love compatibility different from Kundli Matching?",
    a: "The core engine is the same Ashtakoot 36-guna method, but framing focuses on emotional harmony, mental compatibility and romantic dynamics rather than only marriage rules.",
  },
  {
    q: "Do both partners need exact birth times?",
    a: "Approximate time still works, but exact time gives more accurate Moon rashi and nakshatra — the two most important factors for compatibility.",
  },
  {
    q: "Can same-gender couples use this?",
    a: "Yes — Vedic compatibility works on birth chart energies, not gender. Use 'Partner 1' and 'Partner 2' with your birth details.",
  },
];

export const Route = createFileRoute("/tools/love-compatibility")({
  head: () => ({
    meta: [
      { title: "Love & Marriage Compatibility Test — Free Vedic Chart Match" },
      {
        name: "description",
        content:
          "Free love compatibility test using Vedic astrology. Get a detailed report on emotional, mental and relationship harmony between two partners.",
      },
      { property: "og:title", content: "Love Compatibility — Free Vedic Test" },
      {
        property: "og:description",
        content: "Discover romantic and emotional compatibility with a full Vedic chart analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Love Compatibility Test",
          description: "Free Vedic love & marriage compatibility test using Ashtakoot analysis.",
          url: "https://sanatantools.com/tools/love-compatibility",
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
      title={t("premium_tools.love_compatibility.title")}
      tagline={t("premium_tools.love_compatibility.tagline")}
      breadcrumb={t("premium_tools.love_compatibility.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.love_compatibility.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.love_compatibility.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.love_compatibility.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.love_compatibility.related.kundli_matching.title"),
          href: "/tools/kundli-matching",
          description: t("premium_tools.love_compatibility.related.kundli_matching.description"),
        },
        {
          title: t("premium_tools.love_compatibility.related.free_kundli.title"),
          href: "/kundli",
          description: t("premium_tools.love_compatibility.related.free_kundli.description"),
        },
        {
          title: t("premium_tools.love_compatibility.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.love_compatibility.related.muhurat.description"),
        },
      ]}
      premiumNote={t("premium_tools.love_compatibility.premium_note")}
    >
      <KundliMatchingTool softLanguage />
    </PremiumToolShell>
  );
}
