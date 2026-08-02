import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Baby, Copy as CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { BABY_NAMES, NAKSHATRA_SYLLABLES } from "@/lib/library-data";
import { useTranslation } from "@/i18n/I18nProvider";

const FAQS = [
  {
    q: "How are baby names chosen by nakshatra?",
    a: "In Vedic tradition, the first syllable of a baby's name is chosen based on the nakshatra (birth star) and pada at the time of birth. This aligns the name's vibration with the child's chart.",
  },
  {
    q: "Are all names in this list traditional?",
    a: "Yes — every name is drawn from Sanskrit, Vedic and Puranic sources with authentic meanings and deity associations.",
  },
  {
    q: "Can I filter by deity?",
    a: "Yes — use the deity filter to find names devoted to Krishna, Shiva, Rama, Devi, and more.",
  },
];

export const Route = createFileRoute("/tools/baby-name-generator")({
  head: () => ({
    meta: [
      { title: "Vedic Baby Name Generator — By Nakshatra, Rashi & Deity" },
      {
        name: "description",
        content:
          "Find the perfect Sanskrit baby name by nakshatra, rashi, gender or deity. Every name includes meaning, deity and starting syllable.",
      },
      { property: "og:title", content: "Baby Name Generator — Vedic Sanskrit Names" },
      {
        property: "og:description",
        content: "Traditional Hindu baby names filtered by nakshatra, deity & meaning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Baby Name Generator",
          description: "Traditional Vedic Sanskrit baby names by nakshatra & deity.",
          url: "https://sanatantools.com/tools/baby-name-generator",
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
      title={t("premium_tools.baby_names.title")}
      tagline={t("premium_tools.baby_names.tagline")}
      breadcrumb={t("premium_tools.baby_names.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.baby_names.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.baby_names.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.baby_names.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.baby_names.related.nakshatra.title"),
          href: "/kundli",
          description: t("premium_tools.baby_names.related.nakshatra.description"),
        },
        {
          title: t("premium_tools.baby_names.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.baby_names.related.muhurat.description"),
        },
        {
          title: t("premium_tools.baby_names.related.numerology.title"),
          href: "/tools/numerology-report",
          description: t("premium_tools.baby_names.related.numerology.description"),
        },
      ]}
    >
      <NameTool />
    </PremiumToolShell>
  );
}

function NameTool() {
  const { t } = useTranslation();
  const [nak, setNak] = useState<string>("Any");
  const [gender, setGender] = useState<"Any" | "M" | "F">("Any");
  const [deity, setDeity] = useState("Any");
  const [q, setQ] = useState("");

  const deities = useMemo(
    () => [
      "Any",
      ...Array.from(new Set(BABY_NAMES.map((n) => n.deity).filter(Boolean) as string[])).sort(),
    ],
    [],
  );
  const syllables = useMemo(() => {
    if (nak === "Any") return null;
    const found = NAKSHATRA_SYLLABLES.find((n) => n.nakshatra === nak);
    return found?.padas.map((p) => p[0].toUpperCase());
  }, [nak]);

  const results = useMemo(() => {
    return BABY_NAMES.filter((n) => {
      if (gender !== "Any" && n.gender !== gender) return false;
      if (deity !== "Any" && n.deity !== deity) return false;
      if (syllables && !syllables.includes(n.name[0].toUpperCase())) return false;
      if (
        q &&
        !n.name.toLowerCase().includes(q.toLowerCase()) &&
        !n.meaning.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [gender, deity, q, syllables]);

  const copy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success(t("premium_tools.baby_names.copied", { name }));
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <Baby className="size-4" /> {t("premium_tools.baby_names.filters")}
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <Label>{t("premium_tools.baby_names.nakshatra_label")}</Label>
            <select
              className="mt-1 w-full h-9 rounded-md border bg-background px-2 text-sm"
              value={nak}
              onChange={(e) => setNak(e.target.value)}
            >
              <option value="Any">{t("premium_tools.shared.any")}</option>
              {NAKSHATRA_SYLLABLES.map((n) => (
                <option key={n.nakshatra}>{n.nakshatra}</option>
              ))}
            </select>
            {syllables && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t("premium_tools.baby_names.padas_label")}: {syllables.join(", ")}
              </p>
            )}
          </div>
          <div>
            <Label>{t("premium_tools.baby_names.gender_label")}</Label>
            <select
              className="mt-1 w-full h-9 rounded-md border bg-background px-2 text-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value as "Any" | "M" | "F")}
            >
              <option value="Any">{t("premium_tools.shared.any")}</option>
              <option value="M">{t("premium_tools.baby_names.boy")}</option>
              <option value="F">{t("premium_tools.baby_names.girl")}</option>
            </select>
          </div>
          <div>
            <Label>{t("premium_tools.baby_names.deity_label")}</Label>
            <select
              className="mt-1 w-full h-9 rounded-md border bg-background px-2 text-sm"
              value={deity}
              onChange={(e) => setDeity(e.target.value)}
            >
              {deities.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t("premium_tools.baby_names.search_label")}</Label>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("premium_tools.baby_names.search_placeholder")}
            />
          </div>
        </div>
      </Card>

      <div className="mt-6 text-sm text-muted-foreground">
        {t("premium_tools.baby_names.names_found", { count: results.length })}
      </div>
      <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((n) => (
          <Card key={n.name} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-lg">
                  {n.name}{" "}
                  <Badge variant="outline" className="ml-1 text-xs">
                    {n.gender === "M"
                      ? t("premium_tools.baby_names.boy")
                      : n.gender === "F"
                        ? t("premium_tools.baby_names.girl")
                        : t("premium_tools.baby_names.unisex")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.meaning}</p>
                {n.deity && (
                  <p className="mt-1 text-xs">
                    <span className="text-muted-foreground">
                      {t("premium_tools.baby_names.deity_prefix")}
                    </span>{" "}
                    {n.deity}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => copy(n.name)}>
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">
            {t("premium_tools.baby_names.no_results")}
          </p>
        )}
      </div>
    </>
  );
}
