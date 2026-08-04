import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Crown,
  CreditCard,
  FileText,
  Tag,
  Coins,
  LayoutDashboard,
  Terminal,
} from "lucide-react";
import { AdminBillingDashboard } from "@/components/monetization/AdminBillingDashboard";
import { SubscriptionPlansManager } from "@/components/monetization/SubscriptionPlansManager";
import { PaymentGatewayManagerView } from "@/components/monetization/PaymentGatewayManagerView";
import { InvoiceEngineView } from "@/components/monetization/InvoiceEngineView";
import { CouponsManagerView } from "@/components/monetization/CouponsManagerView";
import { WebhookLogsView } from "@/components/monetization/WebhookLogsView";

export const Route = createFileRoute("/_authenticated/_admin/admin/monetization")({
  component: AdminMonetizationPage,
});

type MonetizationTab = "overview" | "plans" | "gateways" | "invoices" | "coupons" | "webhooks";

function AdminMonetizationPage() {
  const [activeTab, setActiveTab] = useState<MonetizationTab>("overview");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Coins className="size-6 text-accent" /> Enterprise Subscription & Billing Management
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Production subscription control panel: Plan management, Gateways, GST Invoices, Coupons, and Webhook logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "overview"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <LayoutDashboard className="size-4" /> Overview Dashboard
        </button>

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
          <FileText className="size-4" /> Invoices & Transactions
        </button>

        <button
          onClick={() => setActiveTab("coupons")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "coupons"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Tag className="size-4" /> Coupons
        </button>

        <button
          onClick={() => setActiveTab("webhooks")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "webhooks"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Terminal className="size-4" /> Webhook Logs
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "overview" && <AdminBillingDashboard />}
        {activeTab === "plans" && <SubscriptionPlansManager isAdmin={true} />}
        {activeTab === "gateways" && <PaymentGatewayManagerView />}
        {activeTab === "invoices" && <InvoiceEngineView isAdmin={true} />}
        {activeTab === "coupons" && <CouponsManagerView />}
        {activeTab === "webhooks" && <WebhookLogsView />}
      </div>
    </div>
  );
}
