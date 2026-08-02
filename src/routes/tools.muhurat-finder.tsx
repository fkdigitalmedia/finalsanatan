import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Sun as SunIcon, Moon as MoonIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import {
  DEFAULT_LOCATION,
  type LatLon,
  fmtTime,
  getSunTimes,
  getKaalWindow,
  getChoghadiya,
} from "@/lib/panchang";
import { useTranslation } from "@/i18n/I18nProvider";

const FAQS = [
  {
    q: "What is Muhurat?",
    a: "Muhurat is an auspicious time window chosen using Panchang for important activities — weddings, business launches, travel, griha pravesh and more.",
  },
  {
    q: "What is Choghadiya?",
    a: "Choghadiya divides day and night into 8 parts each; Shubh, Labh and Amrit are auspicious while Kaal, Rog and Udveg are avoided.",
  },
  {
    q: "Why avoid Rahu Kaal?",
    a: "Rahu Kaal is one of the most inauspicious daily windows and is traditionally avoided for starting new work.",
  },
];

export const Route = createFileRoute("/tools/muhurat-finder")({
  head: () => ({
    meta: [
      { title: "Muhurat Finder — Free Choghadiya, Rahu Kaal & Auspicious Timings" },
      {
        name: "description",
        content:
          "Free Vedic Muhurat finder — Choghadiya, Rahu Kaal, Yamaganda and Gulika Kaal for any city and date.",
      },
      { property: "og:title", content: "Muhurat Finder — Choghadiya & Auspicious Times" },
      {
        property: "og:description",
        content: "Instant Vedic Muhurat with day & night Choghadiya and daily kaal windows.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Muhurat Finder",
          description: "Free daily Muhurat with Choghadiya and Rahu Kaal.",
          url: "https://sanatantools.com/tools/muhurat-finder",
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
      title={t("premium_tools.muhurat.title")}
      tagline={t("premium_tools.muhurat.tagline")}
      breadcrumb={t("premium_tools.muhurat.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.muhurat.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.muhurat.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.muhurat.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.muhurat.related.panchang.title"),
          href: "/panchang",
          description: t("premium_tools.muhurat.related.panchang.description"),
        },
        {
          title: t("premium_tools.muhurat.related.kundli_matching.title"),
          href: "/tools/kundli-matching",
          description: t("premium_tools.muhurat.related.kundli_matching.description"),
        },
        {
          title: t("premium_tools.muhurat.related.festivals.title"),
          href: "/festivals",
          description: t("premium_tools.muhurat.related.festivals.description"),
        },
      ]}
    >
      <MuhuratTool />
    </PremiumToolShell>
  );
}

function MuhuratTool() {
  const { t } = useTranslation();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loc, setLoc] = useState<LatLon>({ ...DEFAULT_LOCATION });

  const data = useMemo(() => {
    const d = new Date(date + "T12:00:00");
    const sun = getSunTimes(d, loc);
    const rahu = getKaalWindow("rahu", d, loc);
    const yama = getKaalWindow("yama", d, loc);
    const gulika = getKaalWindow("gulika", d, loc);
    const cho = getChoghadiya(d, loc);
    return { sun, rahu, yama, gulika, cho };
  }, [date, loc]);

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <Clock className="size-4" /> {t("premium_tools.muhurat.choose_date_city")}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t("premium_tools.muhurat.date_label")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <PhotonPlacePicker value={loc} onChange={setLoc} />
          </div>
        </div>
      </Card>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 font-semibold">
            <SunIcon className="size-4" /> {t("premium_tools.muhurat.sunrise_sunset")}
          </div>
          <div className="mt-3 text-sm space-y-1">
            <div>
              {t("premium_tools.muhurat.sunrise")}:{" "}
              <strong>{fmtTime(data.sun.sunrise, loc.tz)}</strong>
            </div>
            <div>
              {t("premium_tools.muhurat.sunset")}:{" "}
              <strong>{fmtTime(data.sun.sunset, loc.tz)}</strong>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="font-semibold mb-2">{t("premium_tools.muhurat.inauspicious_kaal")}</div>
          <div className="text-sm space-y-1">
            <div>
              {t("premium_tools.muhurat.rahu_kaal")}:{" "}
              <strong>
                {data.rahu
                  ? `${fmtTime(data.rahu.start, loc.tz)} – ${fmtTime(data.rahu.end, loc.tz)}`
                  : "—"}
              </strong>
            </div>
            <div>
              {t("premium_tools.muhurat.yamaganda")}:{" "}
              <strong>
                {data.yama
                  ? `${fmtTime(data.yama.start, loc.tz)} – ${fmtTime(data.yama.end, loc.tz)}`
                  : "—"}
              </strong>
            </div>
            <div>
              {t("premium_tools.muhurat.gulika_kaal")}:{" "}
              <strong>
                {data.gulika
                  ? `${fmtTime(data.gulika.start, loc.tz)} – ${fmtTime(data.gulika.end, loc.tz)}`
                  : "—"}
              </strong>
            </div>
          </div>
        </Card>
      </div>

      {data.cho && (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <ChoghadiyaTable
            title={t("premium_tools.muhurat.day_choghadiya")}
            icon={<SunIcon className="size-4" />}
            slots={data.cho.day}
            tz={loc.tz}
          />
          <ChoghadiyaTable
            title={t("premium_tools.muhurat.night_choghadiya")}
            icon={<MoonIcon className="size-4" />}
            slots={data.cho.night}
            tz={loc.tz}
          />
        </div>
      )}
    </>
  );
}

function ChoghadiyaTable({
  title,
  icon,
  slots,
  tz,
}: {
  title: string;
  icon: React.ReactNode;
  slots: { name: string; start: Date; end: Date; quality: string }[];
  tz: string;
}) {
  return (
    <Card className="p-5">
      <div className="font-semibold mb-3 flex items-center gap-2">
        {icon} {title}
      </div>
      <div className="space-y-1.5">
        {slots.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm border-b border-border/60 pb-1.5 last:border-0"
          >
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  s.quality === "auspicious"
                    ? "default"
                    : s.quality === "inauspicious"
                      ? "destructive"
                      : "secondary"
                }
                className="text-[10px]"
              >
                {s.quality}
              </Badge>
              <span className="font-medium">{s.name}</span>
            </div>
            <span className="text-muted-foreground font-mono text-xs">
              {fmtTime(s.start, tz)} – {fmtTime(s.end, tz)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
