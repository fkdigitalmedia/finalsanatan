import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CreditCard,
  Crown,
  ShieldCheck,
  CheckCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import type { UserSubscription, SubscriptionPlan } from "@/lib/monetization/monetization-types";
import {
  fetchUserSubscription,
  fetchSubscriptionPlans,
} from "@/lib/monetization/monetization-api";
import { InvoiceEngineView } from "@/components/monetization/InvoiceEngineView";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { CheckoutModal } from "@/components/monetization/CheckoutModal";

export const Route = createFileRoute("/_authenticated/billing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Billing & Subscription — Sanatan Tools" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UserBillingPage,
});

function UserBillingPage() {
  const { user } = useAuth();
  const uid = user?.id || "demo";
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const sub = await fetchUserSubscription(uid);
      setSubscription(sub);
      setLoading(false);
    }
    void loadData();
  }, [uid]);

  return (
    <DashboardShell
      title="Billing & Subscription Management"
      description="View your current plan, download GST invoices, and manage subscription upgrades."
    >
      <div className="space-y-8">
        {/* Subscription Status Card */}
        <Card className="p-6 border-accent/20 bg-gradient-to-r from-accent/5 via-background to-primary-soft/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-accent text-accent-foreground font-semibold flex items-center gap-1">
                  <Crown className="size-3" /> ACTIVE SUBSCRIPTION
                </Badge>
                {subscription?.billingCycle && (
                  <Badge variant="outline" className="capitalize text-xs">
                    {subscription.billingCycle} Cycle
                  </Badge>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold mt-2">
                {subscription ? subscription.planName : "Free Plan"}
              </h2>

              <p className="text-xs text-muted-foreground mt-1">
                {subscription
                  ? `Renews on ${new Date(subscription.endDate).toLocaleDateString()}`
                  : "Upgrade your plan for unlimited PDF downloads and full Janam Kundli access."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/pricing">
                <Button className="gap-1.5 shadow-sm">
                  <Sparkles className="size-4 text-amber-300" /> Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* GST Invoices History */}
        <div>
          <InvoiceEngineView userId={uid} isAdmin={false} />
        </div>

        {/* Available Plans Selector */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-display text-xl font-bold mb-4">Available Subscription Plans</h3>
          <SubscriptionPlansManager
            isAdmin={false}
            onSelectPlan={(plan) => setSelectedPlan(plan)}
          />
        </div>
      </div>

      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => {
            void fetchUserSubscription(uid).then(setSubscription);
          }}
        />
      )}
    </DashboardShell>
  );
}
