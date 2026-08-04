import React, { useState } from "react";
import {
  Crown,
  CreditCard,
  Tag,
  RotateCcw,
  AlertOctagon,
  IndianRupee,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionPlansManager } from "./SubscriptionPlansManager";
import { PaymentGatewayManagerView } from "./PaymentGatewayManagerView";
import { CouponsManagerView } from "./CouponsManagerView";
import { RevenueAnalyticsView } from "./RevenueAnalyticsView";

type AdminTab = "analytics" | "plans" | "gateways" | "coupons" | "refunds";

export function AdminBillingDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Crown className="size-6 text-accent" /> Admin Billing & Revenue CRM
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure subscription plans, payment gateways, coupons, refunds, and revenue analytics.
        </p>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === "analytics" ? "default" : "ghost"}
          className="text-xs rounded-lg gap-1.5"
          onClick={() => setActiveTab("analytics")}
        >
          <IndianRupee className="size-3.5" /> Revenue Analytics
        </Button>
        <Button
          size="sm"
          variant={activeTab === "plans" ? "default" : "ghost"}
          className="text-xs rounded-lg gap-1.5"
          onClick={() => setActiveTab("plans")}
        >
          <Crown className="size-3.5" /> Manage Plans
        </Button>
        <Button
          size="sm"
          variant={activeTab === "gateways" ? "default" : "ghost"}
          className="text-xs rounded-lg gap-1.5"
          onClick={() => setActiveTab("gateways")}
        >
          <CreditCard className="size-3.5" /> Payment Gateways
        </Button>
        <Button
          size="sm"
          variant={activeTab === "coupons" ? "default" : "ghost"}
          className="text-xs rounded-lg gap-1.5"
          onClick={() => setActiveTab("coupons")}
        >
          <Tag className="size-3.5" /> Coupons Engine
        </Button>
        <Button
          size="sm"
          variant={activeTab === "refunds" ? "default" : "ghost"}
          className="text-xs rounded-lg gap-1.5"
          onClick={() => setActiveTab("refunds")}
        >
          <RotateCcw className="size-3.5 text-rose-500" /> Refunds & Failed Payments
        </Button>
      </div>

      {/* Content Rendering */}
      <div>
        {activeTab === "analytics" && <RevenueAnalyticsView />}
        {activeTab === "plans" && <SubscriptionPlansManager isAdmin={true} />}
        {activeTab === "gateways" && <PaymentGatewayManagerView />}
        {activeTab === "coupons" && <CouponsManagerView />}
        {activeTab === "refunds" && (
          <Card className="p-6 text-center space-y-3">
            <AlertOctagon className="size-10 text-emerald-500 mx-auto" />
            <h3 className="font-display font-bold text-lg">Zero Pending Refunds</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              All recent transactions have been processed cleanly. Refund rate is currently at 0.4%.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
