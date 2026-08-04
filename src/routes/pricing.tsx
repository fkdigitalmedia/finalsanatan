import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ShieldCheck, Crown, Sparkles, Check, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing & Plans — SanatanTools" },
      {
        name: "description",
        content:
          "Explore free and premium plans for Janam Kundli generation, Panchang, and Vedic astrology tools.",
      },
    ],
  }),
});

const STATIC_PLANS = [
  {
    name: "Free Developer",
    price: "₹0",
    period: "Forever Free",
    description: "Basic panchang, daily horoscope and initial Kundli calculations.",
    features: [
      "Basic Lagna Kundli Chart",
      "Daily Panchang Insights",
      "Saved Birth Charts Workspace",
      "Standard A4 PDF Export",
      "Community Support",
    ],
    cta: "Get Started Free",
    href: "/kundli",
    popular: false,
  },
  {
    name: "Premium Pro",
    price: "₹999",
    period: "Per Year",
    description: "Complete Vedic astrology suite with unlimited Janam Kundlis and PDF reports.",
    features: [
      "All Vedic Kundli Engines (D1 to D60)",
      "36-Point Ashtakoot Kundli Matching",
      "Tajik Varshphal Annual Predictions",
      "Vimshottari Dasha Sub-period Timeline",
      "Multi-Language PDF Generator (12 Indian Langs)",
      "Priority Account Support",
    ],
    cta: "Upgrade to Pro",
    href: "/kundli",
    popular: true,
  },
];

function PricingPage() {
  return (
    <SiteLayout>
      <section className="container-page py-12 md:py-16">
        <SectionHeading
          eyebrow="SanatanTools Pricing"
          title="Simple, Transparent Astrological Plans"
          description="Access high-precision Vedic calculations, Janam Kundlis, Panchang, and multi-language PDF reports."
        />

        <div className="mt-10 grid md:grid-cols-2 max-w-4xl mx-auto gap-6">
          {STATIC_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? "border-accent bg-accent/5 shadow-md ring-1 ring-accent"
                  : "hover:border-accent/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground font-bold shadow">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              <div>
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-xs text-muted-foreground ml-2">/ {plan.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={plan.href} className="w-full">
                <Button
                  className="w-full gap-1.5"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta} <ArrowRight className="size-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* GST & Guarantee Cards */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <ShieldCheck className="size-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg">100% Satisfaction</h3>
            <p className="text-xs text-muted-foreground mt-1">
              High precision calculations validated against standard Vedic ephemeris.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <Crown className="size-8 text-accent mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg">Multi-Language PDFs</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Print-ready A4 PDF exports available across 12 Indian languages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <Sparkles className="size-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg">Instant Access</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Full access to birth charts, panchang and matching engines.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
