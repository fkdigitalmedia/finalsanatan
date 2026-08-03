import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Crown,
  ShieldCheck,
  Calendar,
  Zap,
  ArrowUpRight,
  PauseCircle,
  PlayCircle,
  XCircle,
  Receipt,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { UserSubscription, UserWallet } from "@/lib/monetization/monetization-types";
import {
  fetchUserSubscription,
  fetchUserWallet,
  updateSubscriptionStatus,
} from "@/lib/monetization/monetization-api";

interface BillingDashboardViewProps {
  userId?: string;
  onUpgradeClick?: () => void;
  onTopUpClick?: () => void;
}

export function BillingDashboardView({
  userId = "user-1",
  onUpgradeClick,
  onTopUpClick,
}: BillingDashboardViewProps) {
  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [wallet, setWallet] = useState<UserWallet | null>(null);

  const loadData = async () => {
    const s = await fetchUserSubscription(userId);
    const w = await fetchUserWallet(userId);
    setSub(s);
    setWallet(w);
  };

  useEffect(() => {
    void loadData();
  }, [userId]);

  if (!sub || !wallet) return <div className="p-8 text-center text-sm text-muted-foreground">Loading billing portal...</div>;

  const handlePauseResume = async () => {
    const nextStatus = sub.status === "paused" ? "active" : "paused";
    await updateSubscriptionStatus(userId, nextStatus);
    void loadData();
  };

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel your subscription at the end of the billing period?")) {
      await updateSubscriptionStatus(userId, "canceled", true);
      void loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Current Subscription Plan */}
      <Card className="p-6 bg-gradient-to-r from-accent/15 via-background to-purple-500/10 border-accent/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 shadow-md">
              <Crown className="size-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold">{sub.planName}</h2>
                <Badge className="bg-emerald-500 text-white font-semibold uppercase text-[10px]">
                  {sub.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Billing Cycle: <strong className="text-foreground uppercase">{sub.billingCycle}</strong> •
                Renews on {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button onClick={onUpgradeClick} className="gap-1.5 shadow-sm">
              <ArrowUpRight className="size-4" /> Upgrade Plan
            </Button>
            {sub.status === "active" ? (
              <Button variant="outline" size="sm" onClick={handlePauseResume} className="gap-1">
                <PauseCircle className="size-3.5" /> Pause
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handlePauseResume} className="gap-1">
                <PlayCircle className="size-3.5 text-emerald-500" /> Resume
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-destructive hover:bg-destructive/10 gap-1 text-xs"
            >
              <XCircle className="size-3.5" /> Cancel
            </Button>
          </div>
        </div>
      </Card>

      {/* Credit & Quota Gauge Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Credits Balance</span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <p className="font-display text-3xl font-bold text-accent">{wallet.creditBalance}</p>
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 text-xs text-accent p-0 h-auto hover:underline"
            onClick={onTopUpClick}
          >
            + Top Up Credits
          </Button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Next Renewal</span>
            <Calendar className="size-4 text-blue-500" />
          </div>
          <p className="font-display text-2xl font-bold">
            {new Date(sub.currentPeriodEnd).toLocaleDateString()}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">Auto-renewal enabled</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Payment Gateway</span>
            <CreditCard className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-2xl font-bold capitalize">{sub.gatewayProvider}</p>
          <span className="text-xs text-muted-foreground mt-1 block">GST 18% Compliant</span>
        </Card>
      </div>
    </div>
  );
}
