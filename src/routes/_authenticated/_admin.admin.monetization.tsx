import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Crown,
  CreditCard,
  FileText,
  Tag,
  Coins,
} from "lucide-react";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { PaymentGatewayManagerView } from "@/components/monetization/PaymentGatewayManagerView";
import { InvoiceEngineView } from "@/components/monetization/InvoiceEngineView";
import { CouponsManagerView } from "@/components/monetization/CouponsManagerView";

export const Route = createFileRoute("/_authenticated/_admin/admin/monetization")({
  component: AdminMonetizationPage,
});

type MonetizationTab = "plans" | "gateways" | "invoices" | "coupons";

function AdminMonetizationPage() {
  const [activeTab, setActiveTab] = useState<MonetizationTab>("plans");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Coins className="size-6 text-accent" /> Monetization & Billing Console
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage subscription plans, Razorpay & LemonSqueezy payment gateways, GST invoices, and coupons.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("plans")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "plans"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Crown className="size-4" /> Subscription Plans
        </button>

        <button
          onClick={() => setActiveTab("gateways")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "gateways"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <CreditCard className="size-4" /> Payment Gateways
        </button>

        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "invoices"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <FileText className="size-4" /> GST Invoices
        </button>

        <button
          onClick={() => setActiveTab("coupons")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "coupons"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Tag className="size-4" /> Discount Coupons
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "plans" && <SubscriptionPlansManager isAdmin={true} />}
        {activeTab === "gateways" && <PaymentGatewayManagerView />}
        {activeTab === "invoices" && <InvoiceEngineView isAdmin={true} />}
        {activeTab === "coupons" && <CouponsManagerView />}
      </div>
    </div>
  );
}
