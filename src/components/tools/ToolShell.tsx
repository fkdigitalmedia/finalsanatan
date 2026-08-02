import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  Copy,
  Share2,
  Sparkles,
  Info,
  Star,
  HelpCircle,
  ArrowRight,
  Target,
  AlertTriangle,
  Sigma,
  ShieldCheck,
  Lock,
  BookOpen,
  Crown,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { ToolListCard } from "@/components/ui-kit/ToolListCard";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { FAQList, type FAQItem } from "@/components/ui-kit/FAQList";
import { NewsletterCTA } from "@/components/tools/NewsletterCTA";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryFor, relatedTools, getTool, type Tool } from "@/config/tools";
import { BookmarkButton } from "@/components/user/BookmarkButton";
import { useTrackVisit } from "@/hooks/useTrackVisit";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";
import {
  useLocalizedTool,
  useLocalizedHowToUse,
  useLocalizedBenefits,
  useLocalizedFaqs,
} from "@/i18n/useToolI18n";

export interface ToolShellProps {
  tool: Tool;
  /** Optional override — usually omit and let localized intro/description do it. */
  intro?: string;
  children: React.ReactNode;
  copyText?: string;
  shareText?: string;
  /** Optional overrides. When omitted, shared localized strings are used. */
  howToUse?: string[];
  benefits?: string[];
  faqs?: FAQItem[];
  /** Global Tool Page Standard — unique per-tool sections. */
  useCases?: string[];
  mistakes?: string[];
  examples?: { label: string; value: string }[];
  formula?: { title: string; body: string };
  accuracy?: string;
  privacy?: string;
  relatedSlugs?: string[];
}

export function ToolShell(props: ToolShellProps) {
  const {
    tool,
    intro: introOverride,
    children,
    copyText,
    shareText,
    useCases,
    mistakes,
    examples,
    formula,
    accuracy,
    privacy,
    relatedSlugs,
  } = props;
  const cat = categoryFor(tool);
  const Icon = cat?.icon;
  const defaultRelated = relatedTools(tool, 4);
  const related = relatedSlugs?.length
    ? relatedSlugs
        .map(getTool)
        .filter((t): t is Tool => Boolean(t))
        .slice(0, 5)
    : defaultRelated;
  useTrackVisit(tool.slug, tool.title);

  const { t } = useTranslation();
  const catLabel = useCategoryLabel();
  const { title, description, intro: localizedIntro } = useLocalizedTool(tool);
  // Hooks must run unconditionally — `??` short-circuits and would change hook
  // order between renders whenever these props appear/disappear.
  const localizedHowToUse = useLocalizedHowToUse(tool.slug);
  const localizedBenefits = useLocalizedBenefits(tool.slug);
  const localizedFaqs = useLocalizedFaqs(tool.slug);
  const howToUse = props.howToUse ?? localizedHowToUse;
  const benefits = props.benefits ?? localizedBenefits;
  const faqs = props.faqs ?? localizedFaqs;
  const catTitle = cat ? catLabel(cat.slug, "title", cat.title) : "";

  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast.success(t("tool_shell.copied"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("tool_shell.copy_failed"));
    }
  };
  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = shareText ?? `${title} — ${description}`;
    try {
      if (
        typeof navigator !== "undefined" &&
        (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share
      ) {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title,
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success(t("tool_shell.share_copied"));
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-soft/40 to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-10 md:py-12">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: t("tool_shell.tools_breadcrumb"), href: "/tools" },
              ...(cat ? [{ label: catTitle, href: `/${cat.slug}` }] : []),
              { label: title },
            ]}
          />
          <div className="flex flex-wrap items-start gap-5">
            <div className="grid place-items-center size-14 rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              {Icon ? <Icon className="size-6" /> : <Sparkles className="size-6" />}
            </div>
            <div className="flex-1 min-w-0">
              {cat && (
                <a
                  href={`/${cat.slug}`}
                  className="text-xs font-medium uppercase tracking-widest text-accent hover:underline"
                >
                  {catTitle}
                </a>
              )}
              <h1 className="mt-1 font-display text-3xl md:text-5xl font-semibold tracking-tight">
                {title}
              </h1>
              <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-3xl">
                {introOverride ?? localizedIntro ?? description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className="bg-success/15 text-success border-success/30" variant="outline">
                  {t("tool_shell.hero_status_live")}
                </Badge>
                {tool.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-muted-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <BookmarkButton slug={tool.slug} title={title} />
              {copyText !== undefined && (
                <Button variant="outline" onClick={onCopy} className="gap-2">
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {t("tool_shell.copy")}
                </Button>
              )}
              <Button variant="outline" onClick={onShare} className="gap-2">
                <Share2 className="size-4" /> {t("tool_shell.share")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-12">{children}</section>

      <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Info className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              {t("tool_shell.how_to_use_eyebrow")}
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {t("tool_shell.how_to_use_title")}
          </h2>
          <ol className="mt-4 space-y-3">
            {howToUse.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="grid place-items-center size-6 rounded-full bg-primary-soft text-accent font-semibold text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Star className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              {t("tool_shell.benefits_eyebrow")}
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {t("tool_shell.benefits_title")}
          </h2>
          <ul className="mt-4 space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <Check className="size-4 text-success shrink-0 mt-0.5" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {(useCases?.length || mistakes?.length) && (
        <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-2 gap-6">
          {useCases?.length ? (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Target className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {t("tool_shell.use_cases_eyebrow")}
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {t("tool_shell.use_cases_title", { title })}
              </h2>
              <ul className="mt-4 space-y-3">
                {useCases.map((u, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="grid place-items-center size-6 rounded-full bg-accent/10 text-accent font-semibold text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {mistakes?.length ? (
            <div className="rounded-3xl border border-warning/40 bg-warning/5 p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {t("tool_shell.mistakes_eyebrow")}
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {t("tool_shell.mistakes_title")}
              </h2>
              <ul className="mt-4 space-y-3">
                {mistakes.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {examples?.length ? (
        <section className="container-page py-10 border-t border-border/60">
          <SectionHeading
            eyebrow={t("tool_shell.examples_eyebrow")}
            title={t("tool_shell.examples_title", { title })}
          />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((ex, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {ex.label}
                </div>
                <div className="mt-2 font-display text-lg font-semibold text-foreground">
                  {ex.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(formula || accuracy || privacy) && (
        <section className="container-page py-10 border-t border-border/60 grid md:grid-cols-3 gap-6">
          {formula ? (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 text-accent">
                <Sigma className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {t("tool_shell.method_eyebrow")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">{formula.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{formula.body}</p>
            </div>
          ) : null}
          {accuracy ? (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 text-success">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {t("tool_shell.accuracy_eyebrow")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">
                {t("tool_shell.accuracy_title")}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{accuracy}</p>
            </div>
          ) : null}
          {privacy ? (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {t("tool_shell.privacy_eyebrow")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">
                {t("tool_shell.privacy_title")}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{privacy}</p>
            </div>
          ) : null}
        </section>
      )}

      <section className="container-page py-12 border-t border-border/60">
        <div className="flex items-center gap-2 text-accent">
          <HelpCircle className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {t("tool_shell.faq_eyebrow")}
          </span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-semibold">{t("tool_shell.faq_title")}</h2>
        <div className="mt-6 max-w-3xl">
          <FAQList items={faqs} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page py-12 border-t border-border/60">
          <SectionHeading
            eyebrow={t("tool_shell.related_eyebrow")}
            title={
              cat
                ? t("tool_shell.related_title", { category: catTitle })
                : t("tool_shell.related_title_default")
            }
            description={t("tool_shell.related_description")}
          />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <ToolListCard key={r.slug} tool={r} showCategory={false} />
            ))}
          </div>
          <div className="mt-8">
            <a href="/tools" className="inline-flex">
              <Button variant="outline" className="gap-2">
                {t("tool_shell.browse_all")} <ArrowRight className="size-4" />
              </Button>
            </a>
          </div>
        </section>
      )}

      <section className="container-page py-12 border-t border-border/60 grid md:grid-cols-2 gap-6">
        <NewsletterCTA source={`tool:${tool.slug}`} />
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-card p-6 md:p-8 shadow-elegant flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Crown className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t("tool_shell.premium_eyebrow")}
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              {t("tool_shell.premium_title")}
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              {t("tool_shell.premium_desc")}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/pricing">
              <Button className="shadow-glow gap-2">
                <Crown className="size-4" /> {t("tool_shell.premium_cta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12 border-t border-border/60">
        <div className="flex items-center gap-2 text-accent">
          <BookOpen className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {t("tool_shell.articles_eyebrow")}
          </span>
        </div>
        <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
          {t("tool_shell.articles_title")}
        </h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: t("tool_shell.article_complete_guide", { title }),
              href: `/articles/${tool.slug}`,
            },
            {
              title: t("tool_shell.article_foundational", { category: cat?.title ?? "Sanatan" }),
              href: `/articles/${cat?.slug ?? "sanatan"}`,
            },
            {
              title: t("tool_shell.article_daily_practice", { title }),
              href: `/articles/${tool.slug}-practice`,
            },
          ].map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("tool_shell.article_badge")}
              </div>
              <div className="mt-2 font-display text-base font-semibold group-hover:text-primary">
                {a.title}
              </div>
              <div className="mt-3 text-sm text-accent inline-flex items-center gap-1">
                {t("tool_shell.article_read_more")} <ArrowRight className="size-3" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

export function ToolCardFrame({ children, title }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-elegant">
      {title && <h2 className="font-display text-xl md:text-2xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
