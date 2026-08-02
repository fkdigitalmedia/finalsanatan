import {
  CalendarDays,
  Flame,
  BookOpen,
  HelpCircle,
  Sparkles,
  Info,
  Heart,
  Music,
  ShieldCheck,
  Landmark,
  MapPin,
  ChevronRight,
  ExternalLink,
  Users,
  AlertTriangle,
  Check,
  X,
  Sun,
  Moon,
  Star,
  Home,
  FileDown,
  Bot,
  Gift,
  ShoppingBag,
  Newspaper,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { FAQList, type FAQItem } from "@/components/ui-kit/FAQList";
import { NewsletterCTA } from "@/components/tools/NewsletterCTA";
import { AddToCalendar } from "@/components/festivals/AddToCalendar";
import { FestivalCountdown } from "@/components/festivals/FestivalCountdown";
import { FestivalPanchangSnapshot } from "@/components/festivals/FestivalPanchangSnapshot";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

type Occurrence = { isoDate: string; name?: string; notes?: string[] };
type CacheRow = {
  year: number;
  occurrences: { dates?: Occurrence[]; error?: string } | any;
  computed_at?: string;
};
type RelatedRow = {
  id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  featured_image?: string | null;
  category?: string | null;
};

export interface FestivalRow {
  id: string;
  slug: string;
  name: string;
  alt_names?: string[];
  description?: string | null;
  short_description?: string | null;
  detailed_description?: string | null;
  history?: string | null;
  significance?: string | null;
  why_celebrated?: string | null;
  mythological_story?: string | null;
  regional_variations?: Array<{ region?: string; name?: string; notes?: string }>;
  deities?: string[];
  category?: string | null;
  sub_category?: string | null;
  tags?: string[];
  date_type?: string;
  duration_days?: number;
  is_multi_day?: boolean;
  puja_vidhi?: string | null;
  preparation?: string | null;
  samagri?: Array<{ item?: string; qty?: string; notes?: string }>;
  mantras?: Array<{ title?: string; text?: string; meaning?: string }>;
  aarti?: string | null;
  bhajans?: Array<{ title?: string; url?: string }>;
  chalisa?: string | null;
  stotra?: string | null;
  prasad?: string | null;
  dress_colors?: Record<string, string> | any;
  vrat_rules?: Record<string, any>;
  featured_image?: string | null;
  gallery?: Array<{ url?: string; caption?: string }>;
  faqs?: FAQItem[] | any;
  related_tools?: string[];
  related_articles?: Array<{ title?: string; url?: string; excerpt?: string; image?: string }>;
  affiliate_products?: Array<{
    title?: string;
    url?: string;
    image?: string;
    price?: string;
    note?: string;
  }>;
  todays_relevance?: string | null;
  how_families_celebrate?: string | null;
  premium_pdf_url?: string | null;
  donation_url?: string | null;
  seo?: { title?: string; description?: string; og_image?: string; keywords?: string[] } | any;
}

interface Props {
  row: FestivalRow;
  occurrences: CacheRow[];
  related: RelatedRow[];
  language?: string;
  availableLanguages?: string[];
  slug?: string;
}

const LANG_LABEL: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  gu: "ગુજરાતી",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  bn: "বাংলা",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
  or: "ଓଡ଼ିଆ",
  as: "অসমীয়া",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function flattenOccurrences(
  rows: CacheRow[],
): Array<{ year: number; date: string; label?: string }> {
  const out: Array<{ year: number; date: string; label?: string }> = [];
  const today = new Date().toISOString().slice(0, 10);
  for (const r of rows) {
    const dates: Occurrence[] = Array.isArray((r.occurrences as any)?.dates)
      ? (r.occurrences as any).dates
      : [];
    for (const d of dates) {
      if (d.isoDate && d.isoDate >= today.slice(0, 4)) {
        out.push({ year: r.year, date: d.isoDate, label: d.name });
      }
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function FestivalLanding({
  row,
  occurrences,
  related,
  language = "en",
  availableLanguages = ["en"],
  slug,
}: Props) {
  const upcoming = flattenOccurrences(occurrences);
  const next = upcoming.find((o) => o.date >= new Date().toISOString().slice(0, 10)) ?? upcoming[0];
  const nextYearGroup = upcoming.filter((o) => next && o.year === next.year);

  const heroDesc = row.short_description ?? row.description ?? "";
  const faqs: FAQItem[] = Array.isArray(row.faqs) ? row.faqs : [];
  const mantras = row.mantras ?? [];
  const bhajans = row.bhajans ?? [];
  const samagri = row.samagri ?? [];
  const regional = row.regional_variations ?? [];
  const gallery = row.gallery ?? [];
  const dressColors =
    row.dress_colors && typeof row.dress_colors === "object" ? row.dress_colors : {};
  const dressColorEntries = Object.entries(dressColors).filter(
    ([, v]) => typeof v === "string" && v,
  );
  const vrat = (
    row.vrat_rules && typeof row.vrat_rules === "object" ? row.vrat_rules : {}
  ) as Record<string, any>;
  const dos: string[] = Array.isArray(vrat.dos)
    ? vrat.dos
    : Array.isArray((row as any).dos)
      ? (row as any).dos
      : [];
  const donts: string[] = Array.isArray(vrat.donts)
    ? vrat.donts
    : Array.isArray((row as any).donts)
      ? (row as any).donts
      : [];

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-soft/40 to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-10 md:py-14">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: "Festivals", href: "/festivals" },
              ...(row.category
                ? [
                    {
                      label: row.category,
                      href: `/festivals?category=${encodeURIComponent(row.category)}`,
                    },
                  ]
                : []),
              { label: row.name },
            ]}
          />
          {availableLanguages.length > 1 && slug && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Read in:</span>
              {availableLanguages.map((l) => {
                const isActive = l === language;
                const href = l === "en" ? `/festivals/${slug}` : `/festivals/${slug}?lang=${l}`;
                return (
                  <a
                    key={l}
                    href={href}
                    hrefLang={l}
                    className={`px-2.5 py-1 rounded-full border transition ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/60 hover:bg-primary/5"
                    }`}
                  >
                    {LANG_LABEL[l] ?? l.toUpperCase()}
                  </a>
                );
              })}
            </div>
          )}
          <div className="grid md:grid-cols-[1fr,auto] gap-8 items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid place-items-center size-12 rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <Flame className="size-6" />
                </div>
                {row.category && (
                  <Link
                    to="/festivals"
                    className="text-xs font-medium uppercase tracking-widest text-accent hover:underline"
                  >
                    {row.category}
                  </Link>
                )}
              </div>
              <h1 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight">
                {row.name}
              </h1>
              {row.alt_names?.length ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Also known as: {row.alt_names.join(", ")}
                </p>
              ) : null}
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {heroDesc}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {row.deities?.slice(0, 4).map((d) => (
                  <Badge key={d} variant="outline" className="border-accent/40 text-accent">
                    {d}
                  </Badge>
                ))}
                {row.tags?.slice(0, 6).map((t) => (
                  <Badge key={t} variant="outline" className="text-muted-foreground">
                    #{t}
                  </Badge>
                ))}
                {row.is_multi_day && (
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    {row.duration_days ?? 1}-day observance
                  </Badge>
                )}
              </div>
            </div>
            {next && (
              <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-card p-6 shadow-elegant min-w-[260px]">
                <div className="flex items-center gap-2 text-primary">
                  <CalendarDays className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Next observance
                  </span>
                </div>
                <div className="mt-2 font-display text-2xl font-semibold">{fmtDate(next.date)}</div>
                {next.label && (
                  <div className="text-sm text-muted-foreground mt-1">{next.label}</div>
                )}
                {nextYearGroup.length > 1 && (
                  <div className="mt-3 space-y-1 border-t border-border/60 pt-3">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      All days ({next.year})
                    </div>
                    {nextYearGroup.map((o) => (
                      <div key={o.date} className="text-sm flex items-center justify-between gap-3">
                        <span className="text-foreground">{fmtDate(o.date)}</span>
                        {o.label && (
                          <span className="text-xs text-muted-foreground">{o.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  <AddToCalendar
                    slug={row.slug}
                    name={row.name}
                    description={row.short_description ?? row.description ?? ""}
                    nextDateIso={next.date}
                    durationDays={row.duration_days}
                  />
                  <FestivalCountdown targetIso={next.date} label={`${row.name} starts in`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK FACTS + PANCHANG SHORTCUT */}
      {next && (
        <section className="container-page py-8 border-b border-border/60">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <CalendarDays className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  This year
                </span>
              </div>
              <div className="mt-1 font-display text-lg font-semibold">{fmtDate(next.date)}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(next.date + "T12:00:00").toLocaleDateString(undefined, {
                  weekday: "long",
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Category
                </span>
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                {row.category ?? "Festival"}
              </div>
              {row.sub_category && (
                <div className="text-xs text-muted-foreground">{row.sub_category}</div>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Flame className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Duration
                </span>
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                {row.duration_days ?? 1} {(row.duration_days ?? 1) > 1 ? "days" : "day"}
              </div>
              <div className="text-xs text-muted-foreground">{row.date_type ?? "Lunar"}</div>
            </div>
            <Link
              to="/panchang"
              search={{ date: next.date } as any}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-card hover:border-primary/60 transition group"
            >
              <div className="flex items-center gap-2 text-primary">
                <Sun className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Panchang
                </span>
              </div>
              <div className="mt-1 font-display text-lg font-semibold group-hover:text-primary">
                Tithi · Nakshatra · Muhurat
              </div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                See sunrise, sunset & choghadiya <ChevronRight className="size-3" />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* LIVE PANCHANG SNAPSHOT (internal engine) */}
      {next && <FestivalPanchangSnapshot isoDate={next.date} festivalName={row.name} />}

      {/* SIGNIFICANCE + HISTORY */}
      {(row.significance || row.why_celebrated || row.history || row.mythological_story) && (
        <section className="container-page py-10 md:py-12 grid md:grid-cols-2 gap-6">
          {(row.significance || row.why_celebrated) && (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Significance
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">Why {row.name} matters</h2>
              <div className="mt-4 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                {row.significance && <p>{row.significance}</p>}
                {row.why_celebrated && <p>{row.why_celebrated}</p>}
              </div>
            </div>
          )}
          {(row.history || row.mythological_story) && (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <BookOpen className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  History &amp; story
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">Origins &amp; scripture</h2>
              <div className="mt-4 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                {row.history && <p>{row.history}</p>}
                {row.mythological_story && <p>{row.mythological_story}</p>}
              </div>
            </div>
          )}
        </section>
      )}

      {/* DETAILED DESCRIPTION */}
      {row.detailed_description && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading eyebrow="Complete guide" title={`Everything about ${row.name}`} />
          <div className="mt-6 max-w-4xl text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
            {row.detailed_description}
          </div>
        </section>
      )}

      {/* PUJA VIDHI + PREPARATION */}
      {(row.puja_vidhi || row.preparation) && (
        <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-2 gap-6">
          {row.preparation && (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Info className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Preparation</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">How to prepare</h2>
              <div className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {row.preparation}
              </div>
            </div>
          )}
          {row.puja_vidhi && (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Flame className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Puja vidhi</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">Step-by-step ritual</h2>
              <div className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {row.puja_vidhi}
              </div>
            </div>
          )}
        </section>
      )}

      {/* SAMAGRI */}
      {samagri.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading
            eyebrow="Puja samagri"
            title="What you'll need"
            description="Traditional items used in this puja."
          />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {samagri.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-medium">{s.item}</div>
                  {s.qty && <div className="text-xs text-muted-foreground">{s.qty}</div>}
                </div>
                {s.notes && <div className="mt-1 text-xs text-muted-foreground">{s.notes}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MANTRAS + AARTI + CHALISA */}
      {(mantras.length > 0 || row.aarti || row.chalisa || row.stotra) && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading eyebrow="Mantras &amp; hymns" title="Sacred texts for this festival" />
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {mantras.map((m, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                {m.title && <div className="text-sm font-semibold text-accent">{m.title}</div>}
                {m.text && (
                  <div className="mt-2 font-display text-lg leading-relaxed text-foreground whitespace-pre-line">
                    {m.text}
                  </div>
                )}
                {m.meaning && (
                  <div className="mt-2 text-sm text-muted-foreground italic">{m.meaning}</div>
                )}
              </div>
            ))}
            {row.aarti && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2 text-accent">
                  <Music className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Aarti</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                  {row.aarti}
                </div>
              </div>
            )}
            {row.chalisa && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2 text-accent">
                  <BookOpen className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Chalisa</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                  {row.chalisa}
                </div>
              </div>
            )}
            {row.stotra && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2 text-accent">
                  <BookOpen className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Stotra</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                  {row.stotra}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* VRAT + PRASAD + DRESS COLORS */}
      {(row.vrat_rules || row.prasad || dressColorEntries.length > 0) && (
        <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-3 gap-6">
          {row.vrat_rules && Object.keys(row.vrat_rules).length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Vrat / fasting
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">Fasting rules</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {Object.entries(row.vrat_rules).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-medium text-foreground">{k}:</span> {String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {row.prasad && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Heart className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Prasad</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">Offering</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{row.prasad}</p>
            </div>
          )}
          {dressColorEntries.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Dress colours
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">Traditional attire</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {dressColorEntries.map(([k, v]) => (
                  <li key={k}>
                    <span className="font-medium text-foreground">{k}:</span> {String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* REGIONAL VARIATIONS */}
      {regional.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading
            eyebrow="Across India"
            title="Regional variations"
            description="How this festival is observed in different regions."
          />
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regional.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {r.region ?? "Region"}
                  </span>
                </div>
                {r.name && <div className="mt-2 font-display text-lg font-semibold">{r.name}</div>}
                {r.notes && (
                  <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {r.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading eyebrow="Gallery" title={`${row.name} in pictures`} />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((g, i) =>
              g.url ? (
                <figure
                  key={i}
                  className="rounded-2xl overflow-hidden border border-border bg-card shadow-card"
                >
                  <img
                    src={g.url}
                    alt={g.caption ?? row.name}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  {g.caption && (
                    <figcaption className="p-3 text-xs text-muted-foreground">
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              ) : null,
            )}
          </div>
        </section>
      )}

      {/* UPCOMING DATES */}
      {upcoming.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading
            eyebrow="Multi-year calendar"
            title="Upcoming dates"
            description="Calculated by our internal Panchang engine."
          />
          <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
            <ul className="divide-y divide-border">
              {upcoming.slice(0, 25).map((o) => (
                <li
                  key={`${o.year}-${o.date}`}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center size-10 rounded-xl bg-primary-soft text-accent font-semibold text-sm">
                      {o.year}
                    </div>
                    <div>
                      <div className="font-medium">{fmtDate(o.date)}</div>
                      {o.label && <div className="text-xs text-muted-foreground">{o.label}</div>}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground text-xs">
                    {new Date(o.date + "T12:00:00").toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* DO'S & DON'TS */}
      {(dos.length > 0 || donts.length > 0) && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading
            eyebrow="Observance guide"
            title="Do's & don'ts"
            description={`Traditional guidance for observing ${row.name}.`}
          />
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {dos.length > 0 && (
              <div className="rounded-3xl border border-success/40 bg-success/5 p-6 shadow-card">
                <div className="flex items-center gap-2 text-success">
                  <Check className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Do's</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  {dos.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="size-4 mt-0.5 text-success shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {donts.length > 0 && (
              <div className="rounded-3xl border border-destructive/40 bg-destructive/5 p-6 shadow-card">
                <div className="flex items-center gap-2 text-destructive">
                  <X className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Don'ts</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  {donts.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <X className="size-4 mt-0.5 text-destructive shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* BHAJANS */}
      {bhajans.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading eyebrow="Bhajans" title={`Devotional songs for ${row.name}`} />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bhajans.map((b, i) => (
              <a
                key={i}
                href={b.url ?? "#"}
                target={b.url ? "_blank" : undefined}
                rel={b.url ? "noopener noreferrer" : undefined}
                className="rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 transition flex items-center gap-3"
              >
                <div className="grid place-items-center size-10 rounded-xl bg-primary/10 text-primary">
                  <Music className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{b.title ?? `Bhajan ${i + 1}`}</div>
                  {b.url && <div className="text-xs text-muted-foreground truncate">Listen</div>}
                </div>
                {b.url && <ExternalLink className="size-3 text-muted-foreground" />}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* TODAY'S RELEVANCE + HOW FAMILIES CELEBRATE */}
      {(row.todays_relevance || row.how_families_celebrate) && (
        <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-2 gap-6">
          {row.todays_relevance && (
            <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Today's relevance
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                Why {row.name} matters now
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {row.todays_relevance}
              </p>
            </div>
          )}
          {row.how_families_celebrate && (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Home className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">At home</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">How families celebrate</h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {row.how_families_celebrate}
              </p>
            </div>
          )}
        </section>
      )}

      {/* FAQ */}

      {faqs.length > 0 && (
        <section className="container-page py-12 border-t border-border/60">
          <div className="flex items-center gap-2 text-accent">
            <HelpCircle className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Frequently asked
            </span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold">Questions about {row.name}</h2>
          <div className="mt-6 max-w-3xl">
            <FAQList items={faqs} />
          </div>
        </section>
      )}

      {/* RELATED FESTIVALS */}
      {related.length > 0 && (
        <section className="container-page py-12 border-t border-border/60">
          <SectionHeading eyebrow="Related festivals" title="You may also observe" />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/festivals/$slug"
                params={{ slug: r.slug }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition"
              >
                {r.featured_image && (
                  <img
                    src={r.featured_image}
                    alt={r.name}
                    loading="lazy"
                    className="mb-3 w-full aspect-[4/3] object-cover rounded-xl"
                  />
                )}
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {r.category ?? "Festival"}
                </div>
                <div className="mt-1 font-display text-base font-semibold group-hover:text-primary">
                  {r.name}
                </div>
                {r.short_description && (
                  <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {r.short_description}
                  </div>
                )}
                <div className="mt-3 text-xs text-accent inline-flex items-center gap-1">
                  Read more <ChevronRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RELATED TOOLS */}
      {row.related_tools && row.related_tools.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading eyebrow="Try our tools" title="Related utilities" />
          <div className="mt-6 flex flex-wrap gap-3">
            {row.related_tools.map((slug) => (
              <a
                key={slug}
                href={`/${slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-primary/40 transition"
              >
                <Landmark className="size-4 text-accent" /> {slug}
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* RELATED ARTICLES */}
      {row.related_articles && row.related_articles.length > 0 && (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading
            eyebrow="Read more"
            title="Related articles"
            description="Deep-dive guides from our editors."
          />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {row.related_articles.map((a, i) => (
              <a
                key={i}
                href={a.url ?? "#"}
                target={a.url?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:border-primary/40 transition"
              >
                {a.image && (
                  <img
                    src={a.image}
                    alt={a.title ?? "Article"}
                    loading="lazy"
                    className="w-full aspect-[16/9] object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-accent">
                    <Newspaper className="size-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">
                      Article
                    </span>
                  </div>
                  <div className="mt-1 font-display text-base font-semibold group-hover:text-primary">
                    {a.title}
                  </div>
                  {a.excerpt && (
                    <div className="mt-2 text-xs text-muted-foreground line-clamp-3">
                      {a.excerpt}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* MONETIZATION: PREMIUM GUIDE + AI + AFFILIATES + DONATIONS */}
      <section className="container-page py-12 border-t border-border/60">
        <SectionHeading
          eyebrow="Go deeper"
          title={`Premium ${row.name} experience`}
          description="Unlock a printable guide, AI explanations, curated products and support the mission."
        />
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={row.premium_pdf_url ?? "/auth"}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-card hover:border-primary/60 transition block"
          >
            <div className="grid place-items-center size-10 rounded-xl bg-primary/15 text-primary">
              <FileDown className="size-5" />
            </div>
            <div className="mt-3 font-display text-lg font-semibold">Premium PDF guide</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Puja vidhi, mantras & samagri checklist — printable, offline-ready.
            </p>
            <div className="mt-3 text-xs font-medium text-primary inline-flex items-center gap-1">
              Download <ChevronRight className="size-3" />
            </div>
          </a>
          <Link
            to="/ai"
            className="rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-card hover:border-accent/60 transition block"
          >
            <div className="grid place-items-center size-10 rounded-xl bg-accent/15 text-accent">
              <Bot className="size-5" />
            </div>
            <div className="mt-3 font-display text-lg font-semibold">AI explanation</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask the Dharma Assistant to explain any ritual or mantra in your language.
            </p>
            <div className="mt-3 text-xs font-medium text-accent inline-flex items-center gap-1">
              Open AI Studio <ChevronRight className="size-3" />
            </div>
          </Link>
          <a
            href={row.donation_url ?? "/contact"}
            className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition block"
          >
            <div className="grid place-items-center size-10 rounded-xl bg-primary-soft text-primary">
              <Gift className="size-5" />
            </div>
            <div className="mt-3 font-display text-lg font-semibold">Support the mission</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Help us keep authentic Sanatan tools free for everyone.
            </p>
            <div className="mt-3 text-xs font-medium text-primary inline-flex items-center gap-1">
              Donate <ChevronRight className="size-3" />
            </div>
          </a>
          <Link
            to="/festivals"
            className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition block"
          >
            <div className="grid place-items-center size-10 rounded-xl bg-primary-soft text-accent">
              <CalendarDays className="size-5" />
            </div>
            <div className="mt-3 font-display text-lg font-semibold">Festival calendar</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Browse the full year of Hindu festivals with dates & muhurats.
            </p>
            <div className="mt-3 text-xs font-medium text-accent inline-flex items-center gap-1">
              Explore <ChevronRight className="size-3" />
            </div>
          </Link>
        </div>

        {/* AFFILIATE PRODUCTS */}
        {row.affiliate_products && row.affiliate_products.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 text-accent">
              <ShoppingBag className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Suggested puja items
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Affiliate links — we may earn a small commission at no extra cost to you.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {row.affiliate_products.map((p, i) => (
                <a
                  key={i}
                  href={p.url ?? "#"}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:border-primary/40 transition block"
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title ?? "Product"}
                      loading="lazy"
                      className="w-full aspect-square object-cover"
                    />
                  )}
                  <div className="p-3">
                    <div className="font-medium text-sm truncate">{p.title}</div>
                    {p.price && (
                      <div className="text-xs text-primary font-semibold mt-0.5">{p.price}</div>
                    )}
                    {p.note && (
                      <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {p.note}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* NEWSLETTER + PREMIUM */}

      <section className="container-page py-12 border-t border-border/60 grid md:grid-cols-2 gap-6">
        <NewsletterCTA source={`festival:${row.slug}`} />
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-card p-6 md:p-8 shadow-elegant flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Users className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Never miss a festival
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Get personalised reminders
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Sign in to save {row.name} to your calendar and get notifications based on your
              location's Panchang.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/auth">
              <Button className="shadow-glow">Create free account</Button>
            </Link>
            <Link to="/festivals">
              <Button variant="outline">Browse all festivals</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PRIVACY / ACCURACY */}
      <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-success">
            <ShieldCheck className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Accuracy</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">How we calculate this date</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Dates are computed by our internal Panchang engine using Swiss-astronomy models — no
            third-party API. Regional differences (Purnimanta vs Amanta, sunrise-based tithi) are
            honoured. If your local pandit's date differs, it usually reflects a different
            sampradaya or location.
          </p>
        </div>
        <div className="rounded-3xl border border-warning/40 bg-warning/5 p-6 shadow-card">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Please note</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">Verify locally</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This page is for educational purposes. For fasting, muhurta, or vrat udyapan, please
            consult a qualified pandit or your family tradition. We do not collect any personal data
            on this page.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
