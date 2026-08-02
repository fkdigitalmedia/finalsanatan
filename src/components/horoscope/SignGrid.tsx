import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/i18n/I18nProvider";
import { SIGNS, periodPath, periodLabel, type HoroscopePeriod } from "@/lib/horoscope-public";

/** 12-Rashi grid used by every horoscope hub / detail page. */
export function SignGrid({ period, activeSlug }: { period: HoroscopePeriod; activeSlug?: string }) {
  const { t } = useTranslation();
  const tr = (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars);
    return value === key ? fallback : value;
  };
  const periodText = tr(`horoscope.periods.${period}`, periodLabel(period));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {SIGNS.map((s) => {
        const active = s.slug === activeSlug;
        const signLabel = tr(`horoscope.signs.${s.slug}`, s.english);
        return (
          <Link
            key={s.slug}
            to={periodPath(period, s.slug) as unknown as "/"}
            className={`group rounded-2xl border p-4 transition-colors shadow-card ${
              active
                ? "border-primary bg-primary-soft"
                : "border-border bg-card hover:border-primary/50 hover:bg-secondary/60"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid place-items-center size-10 shrink-0 rounded-xl bg-primary-soft text-accent text-lg">
                {s.symbol}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{signLabel}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.sanskrit} · {s.hindi}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {t("horoscope.grid.periodDates", { period: periodText, dates: s.dates })}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
