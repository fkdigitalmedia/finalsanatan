import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  Crown,
  Wallet,
  Receipt,
  Gift,
  Zap,
  Tag,
  ShieldCheck,
  BarChart3,
  Lock,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { SubscriptionPlan } from "@/lib/monetization/monetization-types";
import { BillingDashboardView } from "@/components/monetization/BillingDashboardView";
import { UserWalletView } from "@/components/monetization/UserWalletView";
import { CreditEngineView } from "@/components/monetization/CreditEngineView";
import { InvoiceEngineView } from "@/components/monetization/InvoiceEngineView";
import { ReferralSystemView } from "@/components/monetization/ReferralSystemView";
import { CouponsManagerView } from "@/components/monetization/CouponsManagerView";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { CheckoutModal } from "@/components/monetization/CheckoutModal";
import { AdminBillingDashboard } from "@/components/monetization/AdminBillingDashboard";

export const Route = createFileRoute("/_authenticated/billing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Monetization, Billing & Credits — SanatanTools" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BillingPage,
});

type BillingTab =
  | "portal"
  | "wallet"
  | "credits"
  | "plans"
  | "invoices"
  | "referrals"
  | "coupons"
  | "admin";

function BillingPage() {
  const { user } = useAuth();
  const uid = user?.id || "user-1";
  const [activeTab, setActiveTab] = useState<BillingTab>("portal");
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  return (
    <DashboardShell
      title="Subscriptions, Credits & Billing Portal"
      description="Manage subscription plans, credit wallet balance, GST invoices, and referral rewards."
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
          <CreditCard className="size-3.5" /> 24.10 Billing Portal
        </Button>
        <Button
          size="sm"
          variant={activeTab === "wallet" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("wallet")}
        >
          <Wallet className="size-3.5 text-amber-500" /> 24.9 Wallet
        </Button>
        <Button
          size="sm"
          variant={activeTab === "credits" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("credits")}
        >
          <Zap className="size-3.5 text-purple-500" /> 24.2 Credits
        </Button>
        <Button
          size="sm"
          variant={activeTab === "plans" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("plans")}
        >
          <Crown className="size-3.5 text-accent" /> 24.1 Plans
        </Button>
        <Button
          size="sm"
          variant={activeTab === "invoices" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("invoices")}
        >
          <Receipt className="size-3.5" /> 24.11 Invoices
        </Button>
        <Button
          size="sm"
          variant={activeTab === "referrals" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("referrals")}
        >
          <Gift className="size-3.5 text-rose-500" /> 24.8 Referrals
        </Button>
        <Button
          size="sm"
          variant={activeTab === "coupons" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("coupons")}
        >
          <Tag className="size-3.5 text-emerald-500" /> 24.7 Coupons
        </Button>
        <Button
          size="sm"
          variant={activeTab === "admin" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("admin")}
        >
          <BarChart3 className="size-3.5 text-blue-500" /> 24.13 Admin Billing
        </Button>
      </div>

      {/* Tab Render */}
      <div>
        {activeTab === "portal" && (
          <BillingDashboardView
            userId={uid}
            onUpgradeClick={() => setActiveTab("plans")}
            onTopUpClick={() => setActiveTab("wallet")}
          />
        )}

        {activeTab === "wallet" && (
          <UserWalletView
            userId={uid}
            onTopUpClick={() => setActiveTab("plans")}
          />
        )}

        {activeTab === "credits" && (
          <CreditEngineView
            onTopUpClick={() => setActiveTab("plans")}
          />
        )}

        {activeTab === "plans" && (
          <SubscriptionPlansManager
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

        {activeTab === "admin" && (
          <AdminBillingDashboard />
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
