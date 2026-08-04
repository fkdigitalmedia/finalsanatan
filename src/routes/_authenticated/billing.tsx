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
  AlertTriangle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import type { UserSubscription, SubscriptionPlan } from "@/lib/monetization/monetization-types";
import {
  fetchUserSubscription,
  fetchSubscriptionPlans,
  cancelSubscription,
  downgradeSubscription,
} from "@/lib/monetization/monetization-api";
import { InvoiceEngineView } from "@/components/monetization/InvoiceEngineView";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { CheckoutModal } from "@/components/monetization/CheckoutModal";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/billing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Billing & Subscription Management — Sanatan Tools" },
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [downgradePlanTarget, setDowngradePlanTarget] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSubscription = async () => {
    setLoading(true);
    const sub = await fetchUserSubscription(uid);
    setSubscription(sub);
    setLoading(false);
  };

  useEffect(() => {
    void loadSubscription();
  }, [uid]);

  const handleCancelSubscription = async () => {
    await cancelSubscription(uid);
    setShowCancelDialog(false);
    toast.success("Your subscription cancellation has been scheduled for the end of the billing period.");
    void loadSubscription();
  };

  const handleConfirmDowngrade = async () => {
    if (!downgradePlanTarget) return;
    await downgradeSubscription(uid, downgradePlanTarget);
    setDowngradePlanTarget(null);
    toast.success(`Downgrade to ${downgradePlanTarget.name} scheduled for your next billing cycle.`);
    void loadSubscription();
  };

  return (
    <DashboardShell
      title="Enterprise Subscription Management"
      description="Manage your active subscription plan, billing cycle, renewals, and GST invoices."
    >
      <div className="space-y-8">
        {/* Active Subscription Status Card */}
        <Card className="p-6 border-accent/20 bg-gradient-to-r from-accent/5 via-background to-primary-soft/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    subscription?.status === "canceled"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      : "bg-accent text-accent-foreground"
                  } font-semibold flex items-center gap-1`}
                >
                  <Crown className="size-3" />{" "}
                  {subscription?.status === "canceled"
                    ? "CANCELLATION SCHEDULED"
                    : "ACTIVE SUBSCRIPTION"}
                </Badge>
                {subscription?.billingCycle && (
                  <Badge variant="outline" className="capitalize text-xs">
                    {subscription.billingCycle} Cycle
                  </Badge>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold mt-2">
                {subscription ? subscription.planName : "Free Developer Plan"}
              </h2>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-accent" /> Active Since:{" "}
                  {subscription
                    ? new Date(subscription.startDate).toLocaleDateString()
                    : "Account Registration"}
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="size-3.5 text-blue-500" /> Renewal Date:{" "}
                  {subscription
                    ? new Date(subscription.endDate).toLocaleDateString()
                    : "Never (Free)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {subscription && subscription.status !== "canceled" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 gap-1 text-xs"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="size-3.5" /> Cancel Subscription
                </Button>
              )}

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

        {/* Available Subscription Plans Matrix */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl font-bold">Subscription Options & Upgrades</h3>
          </div>
          <SubscriptionPlansManager
            isAdmin={false}
            onSelectPlan={(plan) => {
              // If user is selecting lower plan than current, offer downgrade option
              if (subscription && plan.name !== subscription.planName) {
                setSelectedPlan(plan);
              } else {
                setSelectedPlan(plan);
              }
            }}
          />
        </div>
      </div>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Cancel Subscription?
            </DialogTitle>
            <DialogDescription>
              Your subscription will remain active until the end of your current billing period. After that, your account will revert to the Free Developer tier.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancelSubscription}>
              Confirm Cancellation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => {
            void loadSubscription();
          }}
        />
      )}
    </DashboardShell>
  );
}
