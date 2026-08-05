// ============================================================
// Kundli Matching — Guna Milan (Ashtakoot) — Public Page
// ============================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/I18nProvider";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { computeMatching, type MatchingResult } from "@/lib/kundli/matching";

const PAGE_URL = "/kundli-matching";
const SEO_TITLE = "Free Kundli Matching (Guna Milan) Online — 36 Points Ashtakoot | SanatanTools";
const SEO_DESC =
  "Free Kundli Matching by name & date of birth. Traditional Ashtakoot 36-guna Vedic compatibility with Mangal Dosha, Nadi Dosha and Bhakoot Dosha check.";

export const Route = createFileRoute("/kundli-matching")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESC },
      {
        name: "keywords",
        content:
          "kundli matching, guna milan, ashtakoot, horoscope matching, marriage compatibility, mangal dosha, nadi dosha, kundli milan free",
      },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Kundli Matching (Guna Milan)",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Any (Web)",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          description: SEO_DESC,
          url: PAGE_URL,
        }),
      },
    ],
  }),
  component: MatchingPage,
});

interface PersonForm {
  name: string;
  date: string;
  time: string;
  loc: LatLon;
}

const emptyPerson = (): PersonForm => ({
  name: "",
  date: "",
  time: "12:00",
  loc: { ...DEFAULT_LOCATION },
});

export function MatchingPage() {
  const { t } = useTranslation();
  const [boy, setBoy] = useState<PersonForm>(emptyPerson());
  const [girl, setGirl] = useState<PersonForm>(emptyPerson());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchingResult | null>(null);

  const handleGenerate = () => {
    if (!boy.date || !boy.time || !girl.date || !girl.time) {
      toast.error(t("kundli.matching.errors.fill_both"));
      return;
    }
    setLoading(true);
    setResult(null);
    // small delay to show loader
    setTimeout(() => {
      try {
        const r = computeMatching(
          {
            date: boy.date,
            time: boy.time,
            place: boy.loc.label,
            latitude: boy.loc.lat,
            longitude: boy.loc.lon,
            timezone: boy.loc.tz,
            gender: "male",
          },
          {
            date: girl.date,
            time: girl.time,
            place: girl.loc.label,
            latitude: girl.loc.lat,
            longitude: girl.loc.lon,
            timezone: girl.loc.tz,
            gender: "female",
          },
        );
        // attach names for display
        r.boy.name = boy.name || t("kundli.matching.default_boy");
        r.girl.name = girl.name || t("kundli.matching.default_girl");
        setResult(r);
        setTimeout(
          () => document.getElementById("match-result")?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      } catch (e) {
        console.error(e);
        toast.error(t("kundli.matching.errors.compute_failed"));
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: t("kundli.matching.breadcrumb_home"), href: "/" },
            { label: t("kundli.matching.breadcrumb_current") },
          ]}
        />

        {/* Hero */}
        <section className="mt-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-500/20 p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 px-3 py-1 text-xs font-semibold mb-4">
            <Heart className="size-3.5" /> {t("kundli.matching.hero_badge")}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t("kundli.matching.hero_title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("kundli.matching.hero_subtitle")}
          </p>
        </section>

        {/* Form */}
        <section className="mt-8 grid md:grid-cols-2 gap-6">
          <PersonCard
            title={t("kundli.matching.boy_details")}
            gradient="from-blue-500/10 to-cyan-500/10 border-blue-500/20"
            person={boy}
            setPerson={setBoy}
          />
          <PersonCard
            title={t("kundli.matching.girl_details")}
            gradient="from-pink-500/10 to-rose-500/10 border-pink-500/20"
            person={girl}
            setPerson={setGirl}
          />
        </section>

        <div className="mt-6 text-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
            className="min-w-[240px] bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />{" "}
                {t("kundli.matching.matching_progress")}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" /> {t("kundli.matching.match_cta")}
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">{t("kundli.matching.trust_line")}</p>
        </div>

        {loading && (
          <div className="mt-10">
            <SanatanLoader
              title={t("kundli.matching.loader_title")}
              subtitle={t("kundli.matching.loader_subtitle")}
            />
          </div>
        )}

        {result && <ResultView result={result} />}

        {/* Info section */}
        <section className="mt-16 grid md:grid-cols-3 gap-4">
          {KOOTA_INFO.map((k) => (
            <Card key={k.name} className="p-5">
              <div className="font-semibold flex items-center gap-2">
                <Badge variant="secondary">{k.max}</Badge> {k.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{k.desc}</p>
            </Card>
          ))}
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("kundli.matching.cross_promo")}{" "}
            <Link to="/kundli" className="text-primary underline underline-offset-4">
              {t("kundli.matching.cross_promo_cta")}
            </Link>
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}

function PersonCard({
  title,
  gradient,
  person,
  setPerson,
}: {
  title: string;
  gradient: string;
  person: PersonForm;
  setPerson: (p: PersonForm) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient}`}>
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Users className="size-4" /> {title}
      </h3>
      <div className="space-y-3">
        <div>
          <Label>{t("kundli.matching.full_name")}</Label>
          <Input
            value={person.name}
            onChange={(e) => setPerson({ ...person, name: e.target.value })}
            placeholder={t("kundli.matching.full_name_placeholder")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t("kundli.matching.date_of_birth")}</Label>
            <Input
              type="date"
              value={person.date}
              onChange={(e) => setPerson({ ...person, date: e.target.value })}
            />
          </div>
          <div>
            <Label>{t("kundli.matching.time_of_birth")}</Label>
            <Input
              type="time"
              value={person.time}
              onChange={(e) => setPerson({ ...person, time: e.target.value })}
            />
          </div>
        </div>
        <PhotonPlacePicker value={person.loc} onChange={(loc) => setPerson({ ...person, loc })} />
      </div>
    </Card>
  );
}

function ResultView({ result }: { result: MatchingResult }) {
  const { t } = useTranslation();
  const pct = Math.round((result.totalScore / 36) * 100);
  const color =
    result.verdict === "excellent"
      ? "text-emerald-600"
      : result.verdict === "very_good"
        ? "text-green-600"
        : result.verdict === "good"
          ? "text-blue-600"
          : result.verdict === "average"
            ? "text-amber-600"
            : "text-red-600";

  return (
    <section id="match-result" className="mt-12 space-y-8">
      {/* Score header */}
      <Card className="p-8 text-center bg-gradient-to-br from-primary/5 via-orange-500/5 to-rose-500/5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          {t("kundli.matching.total_guna_score")}
        </div>
        <div className="mt-2 text-6xl md:text-7xl font-black">
          {result.totalScore}
          <span className="text-3xl text-muted-foreground"> / 36</span>
        </div>
        <div className={`mt-2 text-xl font-bold ${color}`}>
          {result.verdictLabel} · {pct}%
        </div>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">{result.summary}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 max-w-xl mx-auto text-sm">
          <div className="rounded-lg bg-background/60 border p-3">
            <div className="text-xs text-muted-foreground">{t("kundli.matching.boy")}</div>
            <div className="font-semibold">{result.boy.name}</div>
            <div className="text-xs mt-1">
              {result.boy.moonRashi} · {result.boy.nakshatra}
            </div>
          </div>
          <div className="rounded-lg bg-background/60 border p-3">
            <div className="text-xs text-muted-foreground">{t("kundli.matching.girl")}</div>
            <div className="font-semibold">{result.girl.name}</div>
            <div className="text-xs mt-1">
              {result.girl.moonRashi} · {result.girl.nakshatra}
            </div>
          </div>
        </div>
      </Card>

      {/* Kootas table */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">{t("kundli.matching.ashtakoot_breakdown")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">{t("kundli.matching.table.koota")}</th>
                <th className="py-2 text-center">{t("kundli.matching.table.score")}</th>
                <th className="py-2 text-center">{t("kundli.matching.table.max")}</th>
                <th className="py-2">{t("kundli.matching.table.meaning")}</th>
              </tr>
            </thead>
            <tbody>
              {result.kootas.map((k) => {
                const good = k.score === k.max;
                const bad = k.score === 0;
                return (
                  <tr key={k.key} className="border-b last:border-0">
                    <td className="py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        {good ? (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : bad ? (
                          <XCircle className="size-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="size-4 text-amber-500" />
                        )}
                        {k.label}
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono font-bold">{k.score}</td>
                    <td className="py-3 text-center text-muted-foreground">{k.max}</td>
                    <td className="py-3 text-muted-foreground">{k.note}</td>
                  </tr>
                );
              })}
              <tr className="bg-muted/40 font-bold">
                <td className="py-3">{t("kundli.matching.table.total")}</td>
                <td className="py-3 text-center">{result.totalScore}</td>
                <td className="py-3 text-center">36</td>
                <td className="py-3">{result.verdictLabel}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Doshas */}
      <div className="grid md:grid-cols-3 gap-4">
        <DoshaCard
          title={t("kundli.matching.doshas.mangal")}
          ok={
            (!result.doshas.manglik.boy && !result.doshas.manglik.girl) ||
            result.doshas.manglik.cancelled
          }
          note={result.doshas.manglik.note}
        />
        <DoshaCard
          title={t("kundli.matching.doshas.nadi")}
          ok={!result.doshas.nadi}
          note={
            result.doshas.nadi
              ? t("kundli.matching.doshas.nadi_bad")
              : t("kundli.matching.doshas.nadi_good")
          }
        />
        <DoshaCard
          title={t("kundli.matching.doshas.bhakoot")}
          ok={!result.doshas.bhakoot}
          note={
            result.doshas.bhakoot
              ? t("kundli.matching.doshas.bhakoot_bad")
              : t("kundli.matching.doshas.bhakoot_good")
          }
        />
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
        <strong>{t("kundli.matching.disclaimer_label")}</strong>{" "}
        {t("kundli.matching.disclaimer_text")}
      </p>
    </section>
  );
}

function DoshaCard({ title, ok, note }: { title: string; ok: boolean; note: string }) {
  return (
    <Card
      className={`p-5 border ${ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}
    >
      <div className="flex items-center gap-2 font-semibold">
        {ok ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : (
          <AlertTriangle className="size-4 text-amber-500" />
        )}
        {title}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </Card>
  );
}

const KOOTA_INFO = [
  {
    name: "Varna",
    max: 1,
    desc: "Spiritual & ego compatibility based on the Moon sign varna hierarchy.",
  },
  {
    name: "Vashya",
    max: 2,
    desc: "Mutual attraction and the degree of influence one partner has over the other.",
  },
  {
    name: "Tara",
    max: 3,
    desc: "Health and destiny compatibility computed from the birth nakshatras.",
  },
  {
    name: "Yoni",
    max: 4,
    desc: "Sexual and biological compatibility based on the 14 yoni (animal) groups.",
  },
  {
    name: "Graha Maitri",
    max: 5,
    desc: "Mental & intellectual harmony via the friendship of the Moon-sign lords.",
  },
  { name: "Gana", max: 6, desc: "Behavioural temperament: Deva, Manushya or Rakshasa gana." },
  {
    name: "Bhakoot",
    max: 7,
    desc: "Family life, prosperity and progeny — evaluated from rashi distance.",
  },
  { name: "Nadi", max: 8, desc: "Progeny, health and genetic compatibility — Adi, Madhya, Antya." },
];
