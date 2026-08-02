// Shared premium tool landing shell — hero, breadcrumbs, tool slot, FAQ, related tools, CTA.
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { FAQList, type FAQItem } from "@/components/ui-kit/FAQList";
import { NewsletterCTA } from "@/components/tools/NewsletterCTA";
import { useTranslation } from "@/i18n/I18nProvider";

export interface RelatedTool {
  title: string;
  href: string;
  description: string;
}

export interface PremiumToolShellProps {
  title: string;
  tagline: string;
  breadcrumb: string;
  howToUse: string[];
  benefits: string[];
  faqs: FAQItem[];
  related: RelatedTool[];
  premiumNote?: string;
  children: React.ReactNode;
}

export function PremiumToolShell(props: PremiumToolShellProps) {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: t("premium_tools.shell.home"), href: "/" },
            { label: t("premium_tools.shell.tools"), href: "/tools" },
            { label: props.breadcrumb },
          ]}
        />

        <header className="mt-6 mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-3">
            <Sparkles className="size-3.5" /> {t("premium_tools.shell.premium_vedic_tool")}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{props.title}</h1>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {props.tagline}
          </p>
        </header>

        {props.children}

        <section className="mt-16 grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-3">{t("premium_tools.shell.how_to_use")}</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-5">
              {props.howToUse.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-3">{t("premium_tools.shell.benefits")}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-5">
              {props.benefits.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">{t("premium_tools.shell.faq_heading")}</h2>
          <FAQList items={props.faqs} />
        </section>

        {props.premiumNote && (
          <section className="mt-12 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 text-center">
            <p className="text-sm">{props.premiumNote}</p>
            <Link
              to="/pricing"
              className="mt-3 inline-flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              {t("premium_tools.shell.view_premium_plans")} <ArrowRight className="size-4" />
            </Link>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            {t("premium_tools.shell.related_tools_heading")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {props.related.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                className="block rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors"
              >
                <div className="font-semibold">{r.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <NewsletterCTA />
        </section>
      </div>
    </SiteLayout>
  );
}

// Small helper to build SoftwareApplication + FAQPage JSON-LD.
export function toolSchema(opts: {
  name: string;
  description: string;
  url: string;
  faqs: FAQItem[];
  price?: string;
}): string {
  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: opts.name,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any (Web)",
      offers: { "@type": "Offer", price: opts.price ?? "0", priceCurrency: "INR" },
      description: opts.description,
      url: opts.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: opts.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ]);
}
