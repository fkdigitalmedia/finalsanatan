import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Twitter, Facebook, Send } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";

export function Footer() {
  const { t } = useTranslation();
  const catLabel = useCategoryLabel();

  const cols = [
    {
      title: t("footer.cols.resources"),
      links: [
        { label: t("footer.links.festival_calendar"), href: "/festivals" },
        { label: t("footer.links.vrat_calendar"), href: "/festivals" },
        { label: t("footer.links.temple_directory"), href: "/temples" },
        { label: t("footer.links.sanskrit_learning"), href: "/sanskrit" },
        { label: t("footer.links.baby_names"), href: "/baby-names" },
        { label: t("footer.links.learn_sanatan"), href: "/learning" },
        { label: t("nav.daily_horoscope"), href: "/daily-horoscope" },
        { label: t("nav.blog"), href: "/blog" },
      ],
    },
    {
      title: t("footer.cols.company"),
      links: [
        { label: t("footer.links.about"), href: "/about" },
        { label: t("footer.links.contact"), href: "/contact" },
        { label: t("footer.links.support"), href: "/support" },
        { label: t("footer.links.faq"), href: "/faq" },
        { label: t("footer.links.editorial_policy"), href: "/legal/editorial-policy" },
        { label: t("footer.links.accessibility"), href: "/legal/accessibility-statement" },
        { label: t("footer.links.press"), href: "/contact" },
        { label: t("footer.links.partnerships"), href: "/contact" },
      ],
    },
    {
      title: t("footer.cols.legal"),
      links: [
        { label: t("footer.links.privacy"), href: "/legal/privacy-policy" },
        { label: t("footer.links.terms"), href: "/legal/terms-and-conditions" },
        { label: t("footer.links.cookies"), href: "/legal/cookie-policy" },
        { label: t("footer.links.disclaimer"), href: "/legal/disclaimer" },
        { label: t("footer.links.ai_disclaimer"), href: "/legal/ai-disclaimer" },
        { label: t("footer.links.all_legal"), href: "/legal" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-md">
            <Logo size="lg" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("footer.brand_body")}
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <h4 className="font-display text-base font-semibold">
                {t("footer.newsletter_title")}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">{t("footer.newsletter_body")}</p>
              <form className="mt-3 flex gap-2">
                <Input placeholder={t("common.email_placeholder")} className="bg-background" />
                <Button size="icon" aria-label={t("a11y.subscribe")}>
                  <Send className="size-4" />
                </Button>
              </form>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Youtube, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid place-items-center size-9 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
                  aria-label={t("a11y.social_link")}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {t("footer.cols.categories")}
              </h5>
              <ul className="mt-4 space-y-2.5">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`/${c.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {catLabel(c.slug, "short", c.short)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {cols.map((c) => (
              <div key={c.title}>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  {c.title}
                </h5>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <Link to="/" className="font-devanagari text-sm hover:text-foreground">
            सत्यं शिवं सुन्दरम्
          </Link>
        </div>
      </div>
    </footer>
  );
}
