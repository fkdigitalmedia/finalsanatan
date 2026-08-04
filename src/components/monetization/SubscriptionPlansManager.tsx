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
      monthlyPriceCents: 29900, // ₹299
      yearlyPriceCents: 299000, // ₹2,990
      lifetimePriceCents: 999900, // ₹9,999
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
            Configure dynamic plans with PDF limits, AI allocations, and multi-currency pricing.
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0 hover:bg-accent/20"
                      onClick={() => setEditingPlan(plan)}
                      title="Edit Plan"
                    >
                      <Edit className="size-3.5 text-accent" />
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground min-h-10 line-clamp-2">
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

      {/* Dynamic Edit Plan Dialog (Admin Mode) */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-2">
                <Crown className="size-5 text-accent" /> Edit Subscription Plan
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Plan Name</label>
                  <Input
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g. Premium Pro"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Slug / Identifier</label>
                  <Input
                    value={editingPlan.slug}
                    onChange={(e) => setEditingPlan({ ...editingPlan, slug: e.target.value })}
                    placeholder="e.g. premium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <Textarea
                  rows={2}
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  placeholder="Short summary of this subscription plan..."
                />
              </div>

              {/* Pricing Options */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                  Pricing (in ₹ Rupees)
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Monthly (₹)</label>
                    <Input
                      type="number"
                      value={editingPlan.monthlyPriceCents / 100}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          monthlyPriceCents: Math.round((parseFloat(e.target.value) || 0) * 100),
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
                          yearlyPriceCents: Math.round((parseFloat(e.target.value) || 0) * 100),
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
                          lifetimePriceCents: Math.round((parseFloat(e.target.value) || 0) * 100),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Limits & Quotas */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                  Quotas & Usage Limits (-1 for Unlimited)
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">PDF Exports / Month</label>
                    <Input
                      type="number"
                      value={editingPlan.pdfLimits}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          pdfLimits: parseInt(e.target.value) || 0,
                        })
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
                          storageLimitsMB: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">AI Requests / Month</label>
                    <Input
                      type="number"
                      value={editingPlan.aiLimits}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          aiLimits: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Feature Bullet Points Editor */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                  Features List Bullet Points
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {editingPlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={feat}
                        onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                        className="text-xs h-9"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-8 p-0 text-rose-500 hover:bg-rose-500/10 shrink-0"
                        onClick={() => handleRemoveFeature(idx)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Input
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Add a new feature point..."
                    className="text-xs h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddFeature}
                    className="gap-1 h-9 text-xs shrink-0"
                  >
                    <Plus className="size-3.5" /> Add Point
                  </Button>
                </div>
              </div>

              {/* GST Tax Configuration */}
              <div className="border-t pt-3 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                  GST Tax Settings (Dynamic)
                </h4>

                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={editingPlan.gstEnabled === true}
                      onCheckedChange={(checked) =>
                        setEditingPlan({ ...editingPlan, gstEnabled: checked })
                      }
                    />
                    <div>
                      <label className="text-xs font-semibold block">Enable GST Tax on Checkout</label>
                      <span className="text-[11px] text-muted-foreground">
                        {editingPlan.gstEnabled === true ? "GST applied at checkout" : "GST Exempt (0% Tax)"}
                      </span>
                    </div>
                  </div>

                  {editingPlan.gstEnabled === true && (
                    <div>
                      <label className="text-xs font-semibold block mb-1">GST Tax Rate (%)</label>
                      <Input
                        type="number"
                        value={editingPlan.gstPercentage ?? 18}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            gstPercentage: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="18"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Badges & Toggles */}
              <div className="border-t pt-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editingPlan.isPopular}
                    onCheckedChange={(checked) =>
                      setEditingPlan({ ...editingPlan, isPopular: checked })
                    }
                  />
                  <div>
                    <label className="text-xs font-semibold block">Highlight as "Most Popular"</label>
                    <span className="text-[11px] text-muted-foreground">Display badge & glowing ring</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={editingPlan.active}
                    onCheckedChange={(checked) =>
                      setEditingPlan({ ...editingPlan, active: checked })
                    }
                  />
                  <div>
                    <label className="text-xs font-semibold block">Plan Status</label>
                    <span className="text-[11px] text-muted-foreground">
                      {editingPlan.active ? "Active for purchase" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeletePlan(editingPlan.id)}
                className="gap-1 text-xs"
              >
                <Trash2 className="size-3.5" /> Delete Plan
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePlan} className="gap-1 bg-accent text-accent-foreground font-semibold">
                  <Check className="size-4" /> Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
