import React, { useState, useEffect } from "react";
import {
  Crown,
  Check,
  Edit,
  HardDrive,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Bot,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SubscriptionPlan } from "@/lib/monetization/monetization-types";
import {
  fetchSubscriptionPlans,
  saveSubscriptionPlan,
  deleteSubscriptionPlan,
} from "@/lib/monetization/monetization-api";

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
  const [newFeatureText, setNewFeatureText] = useState("");

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
    setNewFeatureText("");
    void loadPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this subscription plan?")) return;
    await deleteSubscriptionPlan(planId);
    setEditingPlan(null);
    void loadPlans();
  };

  const handleCreateNewPlan = () => {
    const newId = `plan-${Date.now()}`;
    const newPlan: SubscriptionPlan = {
      id: newId,
      name: "New Custom Plan",
      slug: `custom-${Date.now()}`,
      description: "Custom subscription tier configured by administrator.",
      monthlyPriceCents: 29900,
      yearlyPriceCents: 299000,
      lifetimePriceCents: 999900,
      currency: "INR",
      productType: "subscription",
      features: [
        "Access to Janam Kundli Engine",
        "Daily Panchang Insights",
        "10 High-Def PDF Downloads",
      ],
      pdfLimits: 10,
      aiLimits: 50,
      storageLimitsMB: 256,
      validityDays: 30,
      isPopular: false,
      sortOrder: plans.length + 1,
      visibility: "public",
      active: true,
      gstEnabled: true,
      gstPercentage: 18,
    };
    setEditingPlan(newPlan);
  };

  const handleAddFeature = () => {
    if (!editingPlan || !newFeatureText.trim()) return;
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, newFeatureText.trim()],
    });
    setNewFeatureText("");
  };

  const handleUpdateFeature = (index: number, val: string) => {
    if (!editingPlan) return;
    const updated = [...editingPlan.features];
    updated[index] = val;
    setEditingPlan({ ...editingPlan, features: updated });
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return;
    const updated = editingPlan.features.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, features: updated });
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
            Choose a plan with PDF limits, AI allocations, and multi-currency pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <Button size="sm" onClick={handleCreateNewPlan} className="gap-1.5 shadow-sm">
              <Plus className="size-4" /> Add New Plan
            </Button>
          )}

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
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0"
                      onClick={() => setEditingPlan({ ...plan })}
                    >
                      <Edit className="size-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{plan.description}</p>

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

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Bot className="size-3.5 text-amber-500" /> AI Limit:
                    </span>
                    <span className="font-semibold">
                      {plan.aiLimits === -1 ? "Unlimited" : `${plan.aiLimits} /mo`}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs mb-6">
                  {plan.features.map((feat, idx) => {
                    const isComingSoon = feat.includes("(Coming Soon)") || feat.includes("Coming Soon");
                    const cleanText = feat.replace("(Coming Soon)", "").replace("Coming Soon", "").trim();
                    return (
                      <li key={idx} className={`flex items-start gap-2 ${isComingSoon ? "opacity-60" : ""}`}>
                        <Check className={`size-3.5 ${isComingSoon ? "text-amber-500" : "text-emerald-500"} shrink-0 mt-0.5`} />
                        <span className="flex-1">
                          {cleanText}
                          {isComingSoon && (
                            <Badge variant="outline" className="ml-1.5 text-[9px] border-amber-500/40 text-amber-600 bg-amber-500/10 py-0">
                              Coming Soon
                            </Badge>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {onSelectPlan && (
                <Button
                  className="w-full mt-2"
                  variant={plan.isPopular ? "default" : "outline"}
                  onClick={() => onSelectPlan(plan)}
                >
                  Select {plan.name}
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Admin Edit Plan Modal */}
      {isAdmin && editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Edit Subscription Plan: {editingPlan.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm py-2">
              <div>
                <label className="text-xs font-semibold block mb-1">Plan Name</label>
                <Input
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <Textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Monthly (₹)</label>
                  <Input
                    type="number"
                    value={editingPlan.monthlyPriceCents / 100}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        monthlyPriceCents: Math.round(parseFloat(e.target.value || "0") * 100),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Yearly (₹)</label>
                  <Input
                    type="number"
                    value={editingPlan.yearlyPriceCents / 100}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        yearlyPriceCents: Math.round(parseFloat(e.target.value || "0") * 100),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Lifetime (₹)</label>
                  <Input
                    type="number"
                    value={editingPlan.lifetimePriceCents / 100}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        lifetimePriceCents: Math.round(parseFloat(e.target.value || "0") * 100),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">PDF Limit (-1 for unltd)</label>
                  <Input
                    type="number"
                    value={editingPlan.pdfLimits}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, pdfLimits: parseInt(e.target.value || "0") })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">AI Limit (-1 for unltd)</label>
                  <Input
                    type="number"
                    value={editingPlan.aiLimits}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, aiLimits: parseInt(e.target.value || "0") })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Storage (MB)</label>
                  <Input
                    type="number"
                    value={editingPlan.storageLimitsMB}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        storageLimitsMB: parseInt(e.target.value || "0"),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-semibold text-xs block">Enable 18% GST Calculation</span>
                  <span className="text-[11px] text-muted-foreground">Applies 18% GST at checkout</span>
                </div>
                <Switch
                  checked={editingPlan.gstEnabled ?? true}
                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, gstEnabled: checked })}
                />
              </div>

              {/* Bullet Features Manager */}
              <div className="space-y-2 border-t pt-3">
                <label className="text-xs font-semibold block">Feature Bullet Points</label>
                {editingPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={feat}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                      className="text-xs"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-8 p-0 text-destructive shrink-0"
                      onClick={() => handleRemoveFeature(idx)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Add new feature..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={handleAddFeature}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeletePlan(editingPlan.id)}
              >
                Delete Plan
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSavePlan}>
                  Save Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
