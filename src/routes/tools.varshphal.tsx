import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Loader2, Sparkles } from "lucide-react";
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
    q: "What is Varshphal?",
    a: "Varshphal (or Tajika) is the annual horoscope cast for your solar return each year. It predicts the coming year's key themes.",
  },
  {
    q: "How is Varshphal different from a birth chart?",
    a: "The birth chart shows your lifetime blueprint; Varshphal zooms into one specific year using the Sun's return to its natal position.",
  },
  {
    q: "What free info do I get here?",
    a: "The free version shows your current Vimshottari dasha lord and its natural themes. The premium report adds full annual predictions and Muntha analysis.",
  },
];

export const Route = createFileRoute("/tools/varshphal")({
  head: () => ({
    meta: [
      { title: "Varshphal — Free Annual Horoscope by Birth Chart" },
      {
        name: "description",
        content:
          "Free annual Vedic prediction — get your current Vimshottari Maha Dasha lord and year theme. Upgrade for full Varshphal report.",
      },
      { property: "og:title", content: "Varshphal — Annual Horoscope" },
      {
        property: "og:description",
        content: "Vedic annual prediction with Maha Dasha & yearly theme.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Varshphal — Annual Prediction",
          description: "Vedic annual horoscope with dasha analysis.",
          url: "https://sanatantools.com/tools/varshphal",
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
      title={t("premium_tools.varshphal.title")}
      tagline={t("premium_tools.varshphal.tagline")}
      breadcrumb={t("premium_tools.varshphal.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.varshphal.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.varshphal.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.varshphal.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.varshphal.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.varshphal.related.kundli.description"),
        },
        {
          title: t("premium_tools.varshphal.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.varshphal.related.muhurat.description"),
        },
        {
          title: t("premium_tools.varshphal.related.career.title"),
          href: "/tools/career-report",
          description: t("premium_tools.varshphal.related.career.description"),
        },
      ]}
      premiumNote={t("premium_tools.varshphal.premium_note")}
    >
      <VarshTool />
    </PremiumToolShell>
  );
}

function VarshTool() {
  const { t, raw } = useTranslation();
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

  // Current Maha Dasha from Vimshottari
  const currentMD = result?.vimshottari?.current?.mahadasha ?? null;
  const dashaThemes =
    raw<Record<string, string>>("premium_tools.varshphal.dasha_themes") ?? DASHA_THEMES;

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <Calendar className="size-4" /> {t("premium_tools.shared.enter_birth_details")}
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
                {t("premium_tools.varshphal.computing")}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />{" "}
                {t("premium_tools.varshphal.get_prediction_button")}
              </>
            )}
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="mt-8">
          <SanatanLoader
            title={t("premium_tools.varshphal.loader_title")}
            subtitle={t("premium_tools.varshphal.loader_subtitle")}
          />
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-amber-500/5">
            <div className="text-xs uppercase text-muted-foreground">
              {t("premium_tools.varshphal.current_maha_dasha")}
            </div>
            {currentMD ? (
              <>
                <div className="mt-2 text-4xl font-black text-primary">{currentMD.lord}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {new Date(currentMD.startISO).getFullYear()} –{" "}
                  {new Date(currentMD.endISO).getFullYear()}
                </div>
                <p className="mt-3 text-sm max-w-xl mx-auto">
                  {dashaThemes[currentMD.lord] ?? t("premium_tools.varshphal.dasha_theme_fallback")}
                </p>
                <Badge variant="secondary" className="mt-3">
                  {t("premium_tools.varshphal.vimshottari_badge")}
                </Badge>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("premium_tools.varshphal.unable_to_determine")}
              </p>
            )}
          </Card>

          <p className="text-sm text-muted-foreground text-center">
            {t("premium_tools.varshphal.upgrade_prompt")}{" "}
            <Link to="/pricing" className="text-primary underline underline-offset-4">
              {t("premium_tools.shared.upgrade_to_premium")}
            </Link>
          </p>
        </div>
      )}
    </>
  );
}

const DASHA_THEMES: Record<string, string> = {
  Ketu: "Introspection, spiritual seeking and karmic completion. Focus on inner growth and letting go.",
  Venus: "Love, luxury, art and relationships flourish. A period of pleasure and material comfort.",
  Sun: "Authority, recognition, career visibility and self-realisation take centre stage.",
  Moon: "Emotional depth, home, mother and public reputation dominate the year.",
  Mars: "Action, courage, competition and property matters intensify. Guard against conflict.",
  Rahu: "Sudden gains, foreign influences, ambitions surge — but expect turbulence.",
  Jupiter: "Wisdom, children, teaching, wealth and dharma bring expansion and blessings.",
  Saturn: "Discipline, hard work, karmic tests and long-term structure. Patience rewarded.",
  Mercury: "Communication, learning, trade, writing and networks bring opportunities.",
};
