import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  Crown,
  Receipt,
  Gift,
  Tag,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { SubscriptionPlan } from "@/lib/monetization/monetization-types";
import { BillingDashboardView } from "@/components/monetization/BillingDashboardView";
import { InvoiceEngineView } from "@/components/monetization/InvoiceEngineView";
import { ReferralSystemView } from "@/components/monetization/ReferralSystemView";
import { CouponsManagerView } from "@/components/monetization/CouponsManagerView";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { CheckoutModal } from "@/components/monetization/CheckoutModal";

export const Route = createFileRoute("/_authenticated/billing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Subscriptions & Billing Portal — SanatanTools" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BillingPage,
});

type BillingTab =
  | "portal"
  | "plans"
  | "invoices"
  | "referrals"
  | "coupons";

function BillingPage() {
  const { user } = useAuth();
  const uid = user?.id || "user-1";
  const [activeTab, setActiveTab] = useState<BillingTab>("portal");
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  return (
    <DashboardShell
      title="Subscriptions & Billing Portal"
      description="Manage subscription plans, GST invoices, and referral rewards."
      actions={
        <div className="flex items-center gap-2">
          <Link to="/pricing">
            <Button variant="outline" size="sm" className="gap-1">
              <Crown className="size-4 text-amber-500" /> Pricing Page
            </Button>
          </Link>
        </div>
      }
    >
      {/* Sub-Tab Navigation Bar */}
      <div className="mb-6 border-b border-border pb-2 flex items-center gap-1.5 overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === "portal" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("portal")}
        >
          <CreditCard className="size-3.5" /> Billing Portal
        </Button>
        <Button
          size="sm"
          variant={activeTab === "plans" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("plans")}
        >
          <Crown className="size-3.5 text-accent" /> Plans
        </Button>
        <Button
          size="sm"
          variant={activeTab === "invoices" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("invoices")}
        >
          <Receipt className="size-3.5" /> Invoices
        </Button>
        <Button
          size="sm"
          variant={activeTab === "referrals" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("referrals")}
        >
          <Gift className="size-3.5 text-rose-500" /> Referrals
        </Button>
        <Button
          size="sm"
          variant={activeTab === "coupons" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("coupons")}
        >
          <Tag className="size-3.5 text-emerald-500" /> Coupons
        </Button>
      </div>

      {/* Tab Render */}
      <div>
        {activeTab === "portal" && (
          <BillingDashboardView
            userId={uid}
            onUpgradeClick={() => setActiveTab("plans")}
          />
        )}

        {activeTab === "plans" && (
          <SubscriptionPlansManager
            isAdmin={false}
            onSelectPlan={(p) => setSelectedPlanForCheckout(p)}
          />
        )}

        {activeTab === "invoices" && (
          <InvoiceEngineView userId={uid} />
        )}

        {activeTab === "referrals" && (
          <ReferralSystemView userId={uid} />
        )}

        {activeTab === "coupons" && (
          <CouponsManagerView />
        )}
      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          plan={selectedPlanForCheckout}
          isOpen={!!selectedPlanForCheckout}
          onClose={() => setSelectedPlanForCheckout(null)}
          onSuccess={() => setActiveTab("portal")}
        />
      )}
    </DashboardShell>
  );
}
