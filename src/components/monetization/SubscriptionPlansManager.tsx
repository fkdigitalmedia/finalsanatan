import React, { useState, useEffect } from "react";
import {
  Crown,
  Check,
  Edit,
  HardDrive,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SubscriptionPlan } from "@/lib/monetization/monetization-types";
import { fetchSubscriptionPlans, saveSubscriptionPlan } from "@/lib/monetization/monetization-api";

interface SubscriptionPlansManagerProps {
  isAdmin?: boolean;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlansManager({
  isAdmin = false,
  onSelectPlan,
}: SubscriptionPlansManagerProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly" | "lifetime">("yearly");
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const loadPlans = async () => {
    const list = await fetchSubscriptionPlans();
    setPlans(list);
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    await saveSubscriptionPlan(editingPlan);
    setEditingPlan(null);
    void loadPlans();
  };

  return (
    <div className="space-y-6">
      {/* Header & Cycle Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Crown className="size-6 text-accent" /> Subscription Plans
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure dynamic plans with PDF limits, AI allocations, and multi-currency pricing.
          </p>
        </div>

        {/* Cycle Pills */}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          <Button
            size="sm"
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            className="text-xs h-7 rounded-lg"
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            className="text-xs h-7 rounded-lg gap-1"
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly <Badge className="bg-emerald-500 text-white text-[9px]">SAVE 20%</Badge>
          </Button>
          <Button
            size="sm"
            variant={billingCycle === "lifetime" ? "default" : "ghost"}
            className="text-xs h-7 rounded-lg"
            onClick={() => setBillingCycle("lifetime")}
          >
            Lifetime VIP
          </Button>
        </div>
      </div>

      {/* Plans Matrix */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          let priceDisplay = "Free";
          if (billingCycle === "monthly" && plan.monthlyPriceCents > 0) {
            priceDisplay = `₹${(plan.monthlyPriceCents / 100).toLocaleString()} /mo`;
          } else if (billingCycle === "yearly" && plan.yearlyPriceCents > 0) {
            priceDisplay = `₹${(plan.yearlyPriceCents / 100).toLocaleString()} /yr`;
          } else if (billingCycle === "lifetime" && plan.lifetimePriceCents > 0) {
            priceDisplay = `₹${(plan.lifetimePriceCents / 100).toLocaleString()} One-time`;
          }

          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col justify-between relative transition-all ${
                plan.isPopular
                  ? "border-accent bg-accent/5 shadow-md ring-1 ring-accent"
                  : "hover:border-accent/50"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground font-bold shadow">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0"
                      onClick={() => setEditingPlan(plan)}
                    >
                      <Edit className="size-3.5" />
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground h-10 line-clamp-2">
                  {plan.description}
                </p>

                <div className="my-4">
                  <span className="font-display text-3xl font-bold">{priceDisplay}</span>
                </div>

                {/* Quota Highlights */}
                <div className="p-3 rounded-lg bg-secondary/50 space-y-1.5 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FileText className="size-3.5 text-blue-500" /> PDF Limit:
                    </span>
                    <span className="font-semibold">
                      {plan.pdfLimits === -1 ? "Unlimited" : `${plan.pdfLimits} /mo`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <HardDrive className="size-3.5 text-purple-500" /> Storage:
                    </span>
                    <span className="font-semibold">{plan.storageLimitsMB} MB</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full ${plan.isPopular ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => onSelectPlan && onSelectPlan(plan)}
              >
                Choose {plan.name}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Edit Plan Dialog (Admin Mode) */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Edit Subscription Plan</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-sm">
              <div>
                <label className="text-xs font-semibold block mb-1">Plan Name</label>
                <Input
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Monthly Price (Paise/Cents)</label>
                <Input
                  type="number"
                  value={editingPlan.monthlyPriceCents}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      monthlyPriceCents: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Cancel
              </Button>
              <Button onClick={handleSavePlan}>Save Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
