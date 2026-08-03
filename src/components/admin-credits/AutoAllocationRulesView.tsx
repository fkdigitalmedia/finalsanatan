import React from "react";
import { Zap, Clock, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AutoAllocationRulesView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Zap className="size-6 text-accent" /> 24.5 & 24.6 Auto Credit Allocation & Expiry Rules
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure automated credit top-up triggers for subscriptions, referrals & set system-wide expiry policies.
        </p>
      </div>

      {/* Auto Allocation Rules Cards */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4">Automated Credit Allocation Triggers</h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-secondary/30 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Subscription Purchase</span>
                <Badge className="bg-emerald-500 text-white text-[10px]">ENABLED</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Auto-grant credits specified by the subscription plan tier upon checkout.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">100 Credits / mo</span>
              <Switch checked={true} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-secondary/30 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Subscription Renewal</span>
                <Badge className="bg-emerald-500 text-white text-[10px]">ENABLED</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Refresh monthly credit quota upon successful recurring billing cycle.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">Auto-Reset Quota</span>
              <Switch checked={true} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-secondary/30 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Referral Bonus Reward</span>
                <Badge className="bg-emerald-500 text-white text-[10px]">ENABLED</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Grant bonus credits to both referrer & referee upon signup.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">+25 Credits / Invite</span>
              <Switch checked={true} />
            </div>
          </div>
        </div>
      </Card>

      {/* Credit Expiry Configuration */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="size-5 text-rose-500" /> 24.6 Credit Expiry Policy Engine
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-emerald-500/30 bg-emerald-500/5">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 block mb-1">
              Purchased Credits
            </span>
            <p className="font-display text-lg font-bold">Never Expire</p>
            <p className="text-xs text-muted-foreground mt-1">Permanent balance retention</p>
          </Card>

          <Card className="p-4 border-amber-500/30 bg-amber-500/5">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-600 block mb-1">
              Bonus & Promotional
            </span>
            <p className="font-display text-lg font-bold">90 Days Expiry</p>
            <p className="text-xs text-muted-foreground mt-1">Auto-pruned after 90 days</p>
          </Card>

          <Card className="p-4 border-purple-500/30 bg-purple-500/5">
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-600 block mb-1">
              Referral Credits
            </span>
            <p className="font-display text-lg font-bold">180 Days Expiry</p>
            <p className="text-xs text-muted-foreground mt-1">Valid for 6 months</p>
          </Card>

          <Card className="p-4 border-blue-500/30 bg-blue-500/5">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 block mb-1">
              Subscription Monthly Quota
            </span>
            <p className="font-display text-lg font-bold">30 Days Cycle</p>
            <p className="text-xs text-muted-foreground mt-1">Resets each billing cycle</p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
