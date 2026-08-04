import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Coupon } from "@/lib/monetization/monetization-types";
import { fetchCoupons, saveCoupon } from "@/lib/monetization/monetization-api";

export function CouponsManagerView() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState("20");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await fetchCoupons();
      setCoupons(list);
      setLoading(false);
    }
    void load();
  }, []);

  const handleCreateCoupon = async () => {
    if (!newCode.trim()) {
      toast.error("Please enter a valid coupon code.");
      return;
    }
    const valNum = parseFloat(newValue || "0");
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountType: newType,
      discountValue: newType === "percentage" ? valNum : Math.round(valNum * 100),
      maxUses: 500,
      usedCount: 0,
      expiresAt: "2026-12-31",
      active: true,
    };
    await saveCoupon(newCoupon);
    setCoupons((prev) => [newCoupon, ...prev]);
    setNewCode("");
    toast.success(`Coupon ${newCoupon.code} created!`);
  };

  const handleToggleCoupon = async (c: Coupon) => {
    const updated = { ...c, active: !c.active };
    await saveCoupon(updated);
    setCoupons((prev) => prev.map((item) => (item.id === c.id ? updated : item)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Tag className="size-6 text-accent" /> Discount Coupons Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Create percentage or flat discount coupon codes for checkout promotion.
          </p>
        </div>
      </div>

      {/* Create New Coupon Bar */}
      <Card className="p-4 bg-card/60">
        <div className="grid sm:grid-cols-4 gap-3 items-center">
          <Input
            placeholder="Coupon Code (e.g. SANATAN30)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="text-xs uppercase font-mono"
          />

          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-xs"
          >
            <option value="percentage">Percentage Discount (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>

          <Input
            type="number"
            placeholder={newType === "percentage" ? "Value (e.g. 20%)" : "Value in ₹"}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="text-xs"
          />

          <Button onClick={handleCreateCoupon} className="gap-1 text-xs">
            <Plus className="size-4" /> Create Coupon
          </Button>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Usage Count</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-accent">{c.code}</td>
                  <td className="p-4 text-xs font-semibold">
                    {c.discountType === "percentage"
                      ? `${c.discountValue}% OFF`
                      : `₹${(c.discountValue / 100).toLocaleString()} OFF`}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {c.usedCount} / {c.maxUses} used
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">{c.expiresAt}</td>
                  <td className="p-4">
                    {c.active ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Switch checked={c.active} onCheckedChange={() => handleToggleCoupon(c)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
