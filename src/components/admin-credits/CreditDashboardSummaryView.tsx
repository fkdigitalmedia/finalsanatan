import React, { useEffect, useState } from "react";
import { Zap, IndianRupee, Gift, AlertCircle, ShoppingBag, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CreditDashboardMetrics } from "@/lib/admin-credits/admin-credits-types";
import { fetchCreditDashboardMetrics } from "@/lib/admin-credits/admin-credits-api";

export function CreditDashboardSummaryView() {
  const [metrics, setMetrics] = useState<CreditDashboardMetrics | null>(null);

  useEffect(() => {
    void fetchCreditDashboardMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return <div className="p-6 text-center text-sm text-muted-foreground">Loading credit console summary...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Stat Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-accent/5 border-accent/30">
          <span className="text-xs uppercase tracking-wider text-accent font-semibold block mb-1">
            Total Credits Issued
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            {metrics.totalCreditsIssued.toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Lifetime gross allocation</span>
        </Card>

        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold block mb-1">
            Credits Used
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            {metrics.totalCreditsUsed.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="size-3.5" /> High user activity
          </span>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold block mb-1">
            Credits Remaining
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            {metrics.totalCreditsRemaining.toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Active user balances</span>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold block mb-1">
            Revenue From Credits
          </span>
          <p className="font-display text-2xl font-bold text-accent">
            ₹{(metrics.revenueFromCreditsCents / 100).toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Direct credit sales</span>
        </Card>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-muted-foreground font-semibold">Credits Purchased</span>
            <p className="font-display text-xl font-bold">{metrics.totalCreditsPurchased.toLocaleString()}</p>
          </div>
          <ShoppingBag className="size-8 text-blue-500/30" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-muted-foreground font-semibold">Credits Gifted / Bonus</span>
            <p className="font-display text-xl font-bold">{metrics.totalCreditsGifted.toLocaleString()}</p>
          </div>
          <Gift className="size-8 text-purple-500/30" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-muted-foreground font-semibold">Credits Expired</span>
            <p className="font-display text-xl font-bold">{metrics.totalCreditsExpired.toLocaleString()}</p>
          </div>
          <Clock className="size-8 text-rose-500/30" />
        </Card>
      </div>
    </div>
  );
}
