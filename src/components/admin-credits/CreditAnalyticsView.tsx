import React, { useEffect, useState } from "react";
import { BarChart3, Award, Users, IndianRupee, Percent, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CreditAnalyticsData } from "@/lib/admin-credits/admin-credits-types";
import { fetchCreditAnalytics } from "@/lib/admin-credits/admin-credits-api";

export function CreditAnalyticsView() {
  const [data, setData] = useState<CreditAnalyticsData | null>(null);

  useEffect(() => {
    void fetchCreditAnalytics().then(setData);
  }, []);

  if (!data) return <div className="p-6 text-center text-sm text-muted-foreground">Loading credit analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/30">
          <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold block mb-1">
            Unused Credits Ratio
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            {data.unusedCreditsRatio}%
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Healthy active pool</span>
        </Card>

        <Card className="p-4 bg-blue-500/5 border-blue-500/30">
          <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold block mb-1">
            Avg Usage Per User
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            {data.avgUsagePerUser} Cr / mo
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Monthly engagement</span>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/30">
          <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold block mb-1">
            Expired Credits Count
          </span>
          <p className="font-display text-2xl font-bold text-foreground">
            {data.expiredCreditsCount.toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Auto-pruned credits</span>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/30">
          <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold block mb-1">
            Credit Revenue
          </span>
          <p className="font-display text-2xl font-bold text-accent">
            ₹{(data.revenueCents / 100).toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Gross credit revenue</span>
        </Card>
      </div>

      {/* Top Buyers & Top Users Leaderboards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Credit Buyers */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="size-5 text-amber-500" /> Top Credit Buyers
          </h3>

          <div className="space-y-3">
            {data.topBuyers.map((buyer, idx) => (
              <div
                key={buyer.userEmail}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{buyer.userName}</p>
                    <p className="text-xs text-muted-foreground">{buyer.userEmail}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-foreground text-sm block">
                    {buyer.creditsBought} Credits
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ₹{(buyer.totalSpentCents / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Credit Users */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2 text-emerald-600">
            <TrendingUp className="size-5" /> Top Credit Power Users
          </h3>

          <div className="space-y-3">
            {data.topUsers.map((user, idx) => (
              <div
                key={user.userEmail}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{user.userName}</p>
                    <p className="text-xs text-muted-foreground">{user.userEmail}</p>
                  </div>
                </div>

                <span className="font-bold text-emerald-600 text-sm">
                  {user.creditsUsed} Credits Used
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
