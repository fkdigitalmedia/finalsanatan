import { Suspense, lazy } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { FAQList } from "@/components/ui-kit/FAQList";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { ShareButtons } from "@/components/share/ShareButtons";
import { SignGrid } from "@/components/horoscope/SignGrid";
import { Button } from "@/components/ui/button";
import {
  buildHoroscope,
  periodLabel,
  periodPath,
  HOROSCOPE_PERIODS,
  type HoroscopePeriod,
  type SignInfo,
} from "@/lib/horoscope-public";

/** Translate a key, falling back to the given English text if the key is missing. */
function useTr() {
  const { t } = useTranslation();
  return (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars);
    return value === key ? fallback : value;
  };
}

function usePeriodLabel() {
  const tr = useTr();
  return (period: HoroscopePeriod) => tr(`horoscope.periods.${period}`, periodLabel(period));
}

function useSignLabel() {
  const tr = useTr();
  return (sign: SignInfo) => tr(`horoscope.signs.${sign.slug}`, sign.english);
}

function useElementLabel() {
  const tr = useTr();
  return (element: string) => tr(`horoscope.elements.${element.toLowerCase()}`, element);
}

function usePlanetLabel() {
  const tr = useTr();
  return (planet: string) => tr(`horoscope.planets.${planet.toLowerCase()}`, planet);
}

function useCategoryLabel() {
  const tr = useTr();
  return (key: string, fallback: string) => tr(`horoscope.categories.${key}`, fallback);
}

function usePanchangLabel() {
  const tr = useTr();
  return (label: string) => {
    if (label.startsWith("quarter:")) {
      const n = label.split(":")[1];
      return tr("horoscope.panchangLabels.quarter", `Q${n}`, { n });
    }
    return tr(`horoscope.panchangLabels.${label}`, label);
  };
}

function useHoroscopeFaqs() {
  const tr = useTr();
  return (period: HoroscopePeriod, sign?: SignInfo) => {
    const periodText = tr(`horoscope.periods.${period}`, periodLabel(period));
    const who = sign
      ? tr("horoscope.faq.whoSign", `${sign.english} (${sign.sanskrit})`, {
          english: sign.english,
          sanskrit: sign.sanskrit,
        })
      : tr("horoscope.faq.whoDefault", "each Rashi");
    return [
      {
        question: tr(
          "horoscope.faq.calculated.question",
          `How is the ${period} horoscope for ${who} calculated?`,
          {
            period: periodText.toLowerCase(),
            who,
          },
        ),
        answer: tr(
          "horoscope.faq.calculated.answer",
          "It is generated from real planetary positions using our sidereal astronomy and Panchang engines — Moon transit (Chandra gochara) relative to your Rashi, tithi, nakshatra and yoga. No content is hand-written per day.",
        ),
      },
      {
        question: tr("horoscope.faq.zodiacSystem.question", "Which zodiac system do you use?"),
        answer: tr(
          "horoscope.faq.zodiacSystem.answer",
          "Vedic (sidereal) astrology with the Lahiri ayanamsa, based on your Moon sign (Rashi) rather than the Western Sun sign.",
        ),
      },
      {
        question: tr("horoscope.faq.free.question", "Is this horoscope free?"),
        answer: tr(
          "horoscope.faq.free.answer",
          "Yes. All 12 Rashi horoscopes are free to read. Personalised horoscopes based on your full birth chart are part of the premium plans.",
        ),
      },
      {
        question: tr("horoscope.faq.updated.question", "How often is it updated?", {
          period: periodText.toLowerCase(),
        }),
        answer: tr(
          "horoscope.faq.updated.answer",
          `The ${period} horoscope is recalculated from live planetary data every time the page loads, so it is always current.`,
          { period: periodText.toLowerCase() },
        ),
      },
    ];
  };
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{score}/100</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-brand"
          style={{ width: `${Math.max(3, score)}%` }}
        />
      </div>
    </div>
  );
}

function HoroscopeBody({ period, sign }: { period: HoroscopePeriod; sign: SignInfo }) {
  const { t } = useTranslation();
  const tr = useTr();
  const periodLabelFor = usePeriodLabel();
  const categoryLabel = useCategoryLabel();
  const panchangLabel = usePanchangLabel();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["horoscope", period, sign.slug, new Date().toISOString().slice(0, 10)],
    queryFn: async () => buildHoroscope(period, sign),
    staleTime: 30 * 60_000,
  });

  if (isLoading) {
    return (
      <SanatanLoader
        title={t("horoscope.loader.title", { period: periodLabelFor(period) })}
        subtitle={t("horoscope.loader.subtitle")}
      />
    );
  }
  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">{t("horoscope.error")}</p>;
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card self-start">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("horoscope.overall")}
          </p>
          <p className="mt-1 font-serif text-5xl">{data.overallScore}</p>
          <p className="text-xs text-muted-foreground">
            {t("horoscope.outOf100", { range: data.rangeLabel })}
          </p>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <dt className="text-muted-foreground">{t("horoscope.luckyNumber")}</dt>
              <dd className="font-semibold">{data.lucky.number ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("horoscope.luckyColour")}</dt>
              <dd className="font-semibold">{data.lucky.color ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("horoscope.luckyDirection")}</dt>
              <dd className="font-semibold">{data.lucky.direction ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-serif text-xl">{t("horoscope.lifeAreas")}</h2>
          {data.categories.map((c) => (
            <ScoreBar key={c.key} label={categoryLabel(c.key, c.fallbackLabel)} score={c.score} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-serif text-xl">{t("horoscope.whatFavoursYou")}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {(data.highlights.length ? data.highlights : [t("horoscope.steadyDayFallback")]).map(
              (h) => (
                <li key={h}>• {h}</li>
              ),
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-serif text-xl">{t("horoscope.whatToAvoid")}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {(data.cautions.length ? data.cautions : [t("horoscope.noCautionsFallback")]).map(
              (h) => (
                <li key={h}>• {h}</li>
              ),
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-serif text-xl">{t("horoscope.panchangContext")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {data.panchang.map((p) => (
            <div key={p.label}>
              <dt className="text-xs text-muted-foreground">{panchangLabel(p.label)}</dt>
              <dd className="font-medium">{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function HoroscopeDetailPage({ period, sign }: { period: HoroscopePeriod; sign: SignInfo }) {
  const { t } = useTranslation();
  const periodLabelFor = usePeriodLabel();
  const signLabelFor = useSignLabel();
  const elementLabelFor = useElementLabel();
  const planetLabelFor = usePlanetLabel();
  const horoscopeFaqsFor = useHoroscopeFaqs();

  const signLabel = signLabelFor(sign);
  const periodText = periodLabelFor(period);
  const title = t("horoscope.detailTitle", { sign: signLabel, period: periodText });

  return (
    <div className="container-page py-10 space-y-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-2xl text-accent">
            {sign.symbol}
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl sm:text-3xl">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {sign.sanskrit} · {sign.hindi} · {elementLabelFor(sign.element)} ·{" "}
              {t("horoscope.ruledBy", { planet: planetLabelFor(sign.rulingPlanet) })}
            </p>
          </div>
        </div>
        <ShareButtons title={title} />
      </header>

      <nav className="flex flex-wrap gap-2" aria-label={t("horoscope.periodsNav")}>
        {HOROSCOPE_PERIODS.map((p) => (
          <Button key={p} asChild size="sm" variant={p === period ? "default" : "outline"}>
            <Link to={periodPath(p, sign.slug) as unknown as "/"}>{periodLabelFor(p)}</Link>
          </Button>
        ))}
      </nav>

      <HoroscopeBody period={period} sign={sign} />

      <section>
        <SectionHeading
          eyebrow={t("horoscope.questionsEyebrow")}
          title={t("horoscope.faqTitle", { period: periodText })}
          description={t("horoscope.faqDescription")}
        />
        <div className="mt-6">
          <FAQList
            items={horoscopeFaqsFor(period, sign).map((f) => ({ q: f.question, a: f.answer }))}
          />
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow={t("horoscope.allRashisEyebrow")}
          title={t("horoscope.allRashisTitle", { period: periodText })}
          description={t("horoscope.allRashisDescription")}
        />
        <div className="mt-6">
          <SignGrid period={period} activeSlug={sign.slug} />
        </div>
      </section>
    </div>
  );
}

export function HoroscopeHubPage({ period }: { period: HoroscopePeriod }) {
  const { t } = useTranslation();
  const periodLabelFor = usePeriodLabel();
  const horoscopeFaqsFor = useHoroscopeFaqs();
  const label = periodLabelFor(period);

  return (
    <div className="container-page py-10 space-y-12">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl">
          {t("horoscope.hub.title", { period: label })}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("horoscope.hub.description", { period })}</p>
        <div className="mt-5">
          <ShareButtons title={t("horoscope.hub.shareTitle", { period: label })} />
        </div>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label={t("horoscope.periodsNav")}>
        {HOROSCOPE_PERIODS.map((p) => (
          <Button key={p} asChild size="sm" variant={p === period ? "default" : "outline"}>
            <Link to={periodPath(p) as unknown as "/"}>{periodLabelFor(p)}</Link>
          </Button>
        ))}
      </nav>

      <SignGrid period={period} />

      <section>
        <SectionHeading
          eyebrow={t("horoscope.questionsEyebrow")}
          title={t("horoscope.faqTitle", { period: label })}
        />
        <div className="mt-6">
          <FAQList items={horoscopeFaqsFor(period).map((f) => ({ q: f.question, a: f.answer }))} />
        </div>
      </section>
    </div>
  );
}
