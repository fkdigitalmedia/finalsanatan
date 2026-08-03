/**
 * Public /pricing page — reads active plans + active payment gateways and
 * lets a signed-in user pay via Razorpay or LemonSqueezy.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Check, ShieldCheck, Crown, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { CheckoutModal } from "@/components/monetization/CheckoutModal";
import type { SubscriptionPlan } from "@/lib/monetization/monetization-types";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing & Premium Plans — SanatanTools" },
      {
        name: "description",
        content:
          "Choose a monthly or annual premium subscription for unlimited access to AI-powered Kundli, advanced Panchang and all premium Sanatan tools. GST compliant payments via Razorpay and LemonSqueezy.",
      },
    ],
  }),
});

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!user) {
      toast.info("Please sign in to upgrade your subscription");
      navigate({ to: "/auth", search: { redirect: "/pricing" } as never });
      return;
    }
    setSelectedPlan(plan);
  };

  return (
    <SiteLayout>
      <section className="container-page py-12 md:py-16">
        <SectionHeading
          eyebrow="SanatanTools Monetization"
          title="Simple, Transparent Astrological Pricing"
          description="Choose the perfect plan for your personal Kundli reports, AI predictions, and remedy tracking. Upgrade anytime."
        />

        <div className="mt-10">
          <SubscriptionPlansManager
            isAdmin={false}
            onSelectPlan={(p) => handleSelectPlan(p)}
          />
        </div>

        {/* GST & Guarantee Cards */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <ShieldCheck className="size-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg">100% Money-Back Guarantee</h3>
            <p className="text-xs text-muted-foreground mt-1">
              7-day risk-free full refund policy if not satisfied.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <Crown className="size-8 text-accent mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg">GST-Compliant Invoices</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Automated 18% GST invoices generated for business claims.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <Zap className="size-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg">Instant Credit Grants</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Credits credited immediately to your user wallet upon checkout.
            </p>
          </div>
        </div>
      </section>

      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => navigate({ to: "/dashboard" })}
        />
      )}
    </SiteLayout>
  );
}
