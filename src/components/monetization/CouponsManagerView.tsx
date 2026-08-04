import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Percent,
  IndianRupee,
  Gift,
  Calendar,
  Users,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Coupon } from "@/lib/monetization/monetization-types";
import { DEFAULT_COUPONS } from "@/lib/monetization/monetization-api";

export function CouponsManagerView() {
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newValue, setNewValue] = useState(20);

  const handleCreate = () => {
    if (!newCode.trim()) return;
    const item: Coupon = {
      id: `coup-${Date.now()}`,
      code: newCode.toUpperCase(),
      description: newDesc,
      discountType: "percentage",
      discountValue: newValue,
      maxUsageTotal: 100,
      currentUsageCount: 0,
      maxUsagePerUser: 1,
      minPurchaseCents: 49900,
      applicablePlanSlugs: [],
      active: true,
      createdAt: new Date().toISOString(),
    };
    setCoupons([item, ...coupons]);
    setNewCode("");
    setNewDesc("");
    setIsAddOpen(false);
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Tag className="size-6 text-accent" /> 24.7 Dynamic Coupon Engine
          </h2>
          <p className="text-sm text-muted-foreground">
            Create percentage discounts, fixed cash discounts, or free bonus credits.
          </p>
        </div>

        <Button className="gap-2 shadow-sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="size-4" /> Create Coupon Code
        </Button>
      </div>

      {/* Coupons List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="p-5 border-accent/20 hover:border-accent/50 transition-all">
            <div className="flex items-center justify-between gap-2 mb-3">
              <Badge className="bg-accent/20 text-accent font-mono text-sm uppercase px-3 py-1">
                {coupon.code}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="size-7 p-0 text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(coupon.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <p className="text-sm font-semibold">{coupon.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Discount:{" "}
              <strong className="text-foreground font-bold">
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}% OFF`
                  : coupon.discountType === "fixed_amount"
                  ? `₹${coupon.discountValue / 100} OFF`
                  : "Free Report"}
              </strong>
            </p>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Usage: {coupon.currentUsageCount} / {coupon.maxUsageTotal}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {coupon.active ? "Active" : "Disabled"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create New Coupon Code</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-sm">
            <div>
              <label className="text-xs font-semibold block mb-1">Coupon Code</label>
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. DIWALI30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Description</label>
              <Input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="30% discount on Diwali Janam Kundli"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Discount Percentage (%)</label>
              <Input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save Coupon</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
