import React, { useState } from "react";
import {
  Crown,
  CreditCard,
  Tag,
  Gift,
  Wallet,
  Receipt,
  RotateCcw,
  AlertOctagon,
  IndianRupee,
  Settings,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlansManager } from "./SubscriptionPlansManager";
import { PaymentGatewayManagerView } from "./PaymentGatewayManagerView";
import { CouponsManagerView } from "./CouponsManagerView";
import { RevenueAnalyticsView } from "./RevenueAnalyticsView";

// Enterprise Credit Console Imports
import { CreditDashboardSummaryView } from "@/components/admin-credits/CreditDashboardSummaryView";
import { UserCreditManagementView } from "@/components/admin-credits/UserCreditManagementView";
import { CreditPackagesConfigView } from "@/components/admin-credits/CreditPackagesConfigView";
import { AutoAllocationRulesView } from "@/components/admin-credits/AutoAllocationRulesView";
import { CreditLogsAuditView } from "@/components/admin-credits/CreditLogsAuditView";
import { RefundCreditsView } from "@/components/admin-credits/RefundCreditsView";
import { BulkCreditActionsView } from "@/components/admin-credits/BulkCreditActionsView";
import { CreditAnalyticsView } from "@/components/admin-credits/CreditAnalyticsView";

type AdminTab =
  | "credit_console"
  | "analytics"
  | "plans"
  | "gateways"
  | "coupons text"
  | "coupons"
  | "user_credits"
  | "packages"
  | "auto_rules"
  | "audit_logs"
  | "refunds"
  | "bulk";

export function AdminBillingDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("credit_console");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Crown className="size-6 text-accent" /> 24.1 Enterprise Credit Console & Billing Admin
        </h2>
        <p className="text-sm text-muted-foreground">
          Full administrative control over user credits, top-ups, credit packages, auto-allocation, refund reversals & revenue analytics.
        </p>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-border pb-2 overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === "credit_console" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("credit_console")}
        >
          <Zap className="size-3.5 text-amber-500" /> 24.1 Credit Summary
        </Button>
        <Button
          size="sm"
          variant={activeTab === "user_credits" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("user_credits")}
        >
          <Wallet className="size-3.5 text-accent" /> 24.2 User Credits
        </Button>
        <Button
          size="sm"
          variant={activeTab === "packages" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("packages")}
        >
          <Crown className="size-3.5 text-amber-500" /> 24.4 Packages
        </Button>
        <Button
          size="sm"
          variant={activeTab === "auto_rules" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("auto_rules")}
        >
          <Settings className="size-3.5" /> 24.5 Auto Rules
        </Button>
        <Button
          size="sm"
          variant={activeTab === "audit_logs" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("audit_logs")}
        >
          <Receipt className="size-3.5" /> 24.7 Audit Logs
        </Button>
        <Button
          size="sm"
          variant={activeTab === "refunds" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("refunds")}
        >
          <RotateCcw className="size-3.5 text-rose-500" /> 24.9 Refunds
        </Button>
        <Button
          size="sm"
          variant={activeTab === "bulk" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("bulk")}
        >
          <Gift className="size-3.5 text-purple-500" /> 24.10 Bulk Actions
        </Button>
        <Button
          size="sm"
          variant={activeTab === "analytics" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("analytics")}
        >
          <IndianRupee className="size-3.5 text-emerald-500" /> 24.12 Analytics
        </Button>
        <Button
          size="sm"
          variant={activeTab === "plans" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("plans")}
        >
          <Crown className="size-3.5" /> Manage Plans
        </Button>
        <Button
          size="sm"
          variant={activeTab === "gateways" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("gateways")}
        >
          <CreditCard className="size-3.5" /> Gateways
        </Button>
        <Button
          size="sm"
          variant={activeTab === "coupons" ? "default" : "ghost"}
          className="text-xs rounded-xl gap-1.5"
          onClick={() => setActiveTab("coupons")}
        >
          <Tag className="size-3.5" /> Coupons
        </Button>
      </div>

      {/* Content Rendering */}
      <div>
        {activeTab === "credit_console" && (
          <div className="space-y-6">
            <CreditDashboardSummaryView />
            <UserCreditManagementView />
          </div>
        )}
        {activeTab === "user_credits" && <UserCreditManagementView />}
        {activeTab === "packages" && <CreditPackagesConfigView />}
        {activeTab === "auto_rules" && <AutoAllocationRulesView />}
        {activeTab === "audit_logs" && <CreditLogsAuditView />}
        {activeTab === "refunds" && <RefundCreditsView />}
        {activeTab === "bulk" && <BulkCreditActionsView />}
        {activeTab === "analytics" && <CreditAnalyticsView />}
        {activeTab === "plans" && <SubscriptionPlansManager isAdmin={true} />}
        {activeTab === "gateways" && <PaymentGatewayManagerView />}
        {activeTab === "coupons" && <CouponsManagerView />}
      </div>
    </div>
  );
}
