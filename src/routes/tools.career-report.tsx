import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { generateKundli } from "@/lib/kundli";
import type { KundliResult } from "@/lib/kundli/types";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { useTranslation } from "@/i18n/I18nProvider";

const FAQS = [
  {
    q: "How is the career report generated?",
    a: "We analyse your 10th house (karma bhava), its lord, Sun, Saturn and the influence of Jupiter — the classical Vedic career indicators.",
  },
  {
    q: "What professions match my chart?",
    a: "The dominant planet in the 10th house, the 10th lord's sign, and Atmakaraka indicate suitable fields — the free preview shows the raw indicators; the premium PDF explains suitable industries.",
  },
  {
    q: "Is exact birth time needed?",
    a: "Yes — the 10th house cusp changes every ~2 hours, so an accurate birth time is essential for career analysis.",
  },
];

export const Route = createFileRoute("/tools/career-report")({
  head: () => ({
    meta: [
      { title: "Career & Business Report — Free Vedic Astrology Analysis" },
      {
        name: "description",
        content:
          "Free Vedic career report — 10th house analysis, career planets, favourable industries, and business timing based on your birth chart.",
      },
      { property: "og:title", content: "Career & Business Report — Vedic Astrology" },
      {
        property: "og:description",
        content: "Discover your ideal career path using your Vedic birth chart.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Career & Business Report",
          description: "Vedic career analysis based on birth chart's 10th house and Saturn.",
          url: "https://sanatantools.com/tools/career-report",
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
      title={t("premium_tools.career.title")}
      tagline={t("premium_tools.career.tagline")}
      breadcrumb={t("premium_tools.career.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.career.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.career.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.career.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.career.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.career.related.kundli.description"),
        },
        {
          title: t("premium_tools.career.related.numerology.title"),
          href: "/tools/numerology-report",
          description: t("premium_tools.career.related.numerology.description"),
        },
        {
          title: t("premium_tools.career.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.career.related.muhurat.description"),
        },
      ]}
      premiumNote={t("premium_tools.career.premium_note")}
    >
      <CareerTool />
    </PremiumToolShell>
  );
}

function CareerTool() {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [loc, setLoc] = useState<LatLon>({ ...DEFAULT_LOCATION });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KundliResult | null>(null);

  const compute = () => {
    if (!date || !time) return toast.error(t("premium_tools.shared.enter_date_time_error"));
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      try {
        const k = generateKundli({
          date,
          time,
          place: loc.label,
          latitude: loc.lat,
          longitude: loc.lon,
          timezone: loc.tz,
        });
        setResult(k);
      } catch (e) {
        console.error(e);
        toast.error(t("premium_tools.shared.generic_error"));
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const tenthPlanets = result?.d1.planets.filter((p) => p.house === 10) ?? [];
  const sun = result?.d1.planets.find((p) => p.graha === "Sun");
  const saturn = result?.d1.planets.find((p) => p.graha === "Saturn");
  const jupiter = result?.d1.planets.find((p) => p.graha === "Jupiter");

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <Briefcase className="size-4" /> {t("premium_tools.shared.enter_birth_details")}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t("premium_tools.shared.date_of_birth")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>{t("premium_tools.shared.time_of_birth")}</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="mt-3">
          <PhotonPlacePicker value={loc} onChange={setLoc} />
        </div>
        <div className="mt-5 text-center">
          <Button size="lg" onClick={compute} disabled={loading} className="min-w-[220px]">
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />{" "}
                {t("premium_tools.career.analysing")}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" /> {t("premium_tools.career.analyse_button")}
              </>
            )}
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="mt-8">
          <SanatanLoader
            title={t("premium_tools.career.loader_title")}
            subtitle={t("premium_tools.career.loader_subtitle")}
          />
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {t("premium_tools.career.tenth_house_heading")}
            </h3>
            {tenthPlanets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("premium_tools.career.no_tenth_house_planets")}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {tenthPlanets.map((p) => (
                  <div key={p.graha} className="rounded-lg border p-3">
                    <div className="font-semibold">
                      {p.graha}{" "}
                      <Badge variant="secondary" className="ml-1">
                        {p.dignity}
                      </Badge>
                      {p.retrograde && (
                        <Badge variant="outline" className="ml-1">
                          {t("premium_tools.shared.retro")}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.rashi} · {p.nakshatra} · {t("premium_tools.shared.pada")} {p.pada}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {t("premium_tools.career.career_planets_heading")}
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: t("premium_tools.career.planet_sun"), p: sun },
                { label: t("premium_tools.career.planet_saturn"), p: saturn },
                { label: t("premium_tools.career.planet_jupiter"), p: jupiter },
              ].map(
                ({ label, p }) =>
                  p && (
                    <div key={label} className="rounded-lg border p-3">
                      <div className="text-xs uppercase text-muted-foreground">{label}</div>
                      <div className="font-semibold mt-1">
                        {p.graha} · {t("premium_tools.shared.house")} {p.house}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.rashi} · {p.dignity}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </Card>

          <p className="text-sm text-muted-foreground text-center">
            {t("premium_tools.career.upgrade_prompt")}{" "}
            <Link to="/pricing" className="text-primary underline underline-offset-4">
              {t("premium_tools.shared.upgrade_to_premium")}
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
