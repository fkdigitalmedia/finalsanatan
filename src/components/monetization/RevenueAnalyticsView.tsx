import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  IndianRupee,
  Users,
  Award,
  BarChart3,
  Percent,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RevenueAnalyticsMetrics } from "@/lib/monetization/monetization-types";
import { fetchRevenueAnalytics } from "@/lib/monetization/monetization-api";

export function RevenueAnalyticsView() {
  const [analytics, setAnalytics] = useState<RevenueAnalyticsMetrics | null>(null);

  useEffect(() => {
    void fetchRevenueAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) return <div className="p-8 text-center text-sm text-muted-foreground">Loading revenue analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Top Financial Stat Counters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold block mb-1">
            Monthly Recurring Revenue (MRR)
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            ₹{(analytics.mrrCents / 100).toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <ArrowUpRight className="size-3.5" /> +18.4% vs last month
          </span>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold block mb-1">
            Annual Run Rate (ARR)
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            ₹{(analytics.arrCents / 100).toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Projected 12-Month ARR</span>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold block mb-1">
            Lifetime Revenue
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            ₹{(analytics.lifetimeRevenueCents / 100).toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Cumulative platform gross</span>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold block mb-1">
            ARPU (Avg Revenue Per User)
          </span>
          <p className="font-display text-2xl font-bold text-accent">
            ₹{(analytics.arpuCents / 100).toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {analytics.conversionRate}% Conversion Rate
          </span>
        </Card>
      </div>

      {/* Plan Distribution & Top Customers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Crown className="size-5 text-accent" /> Active Plan Distribution
          </h3>

          <div className="space-y-4">
            {Object.entries(analytics.planDistribution).map(([plan, count]) => (
              <div key={plan} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{plan}</span>
                  <span>{count.toLocaleString()} Subscribers</span>
                </div>
                <Progress value={Math.min(100, (count / 7000) * 100)} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Top Paying Customers */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="size-5 text-emerald-500" /> Top Revenue VIP Customers
          </h3>

          <div className="space-y-3">
            {analytics.topCustomers.map((cust, idx) => (
              <div
                key={cust.email}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{cust.name}</p>
                    <p className="text-xs text-muted-foreground">{cust.email}</p>
                  </div>
                </div>

                <span className="font-bold text-emerald-600 text-sm">
                  ₹{(cust.revenueCents / 100).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
