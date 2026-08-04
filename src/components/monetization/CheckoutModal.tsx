import React, { useState } from "react";
import {
  ShieldCheck,
  Badge,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GatewayProvider, SubscriptionPlan } from "@/lib/monetization/monetization-types";
import { calculateTaxes } from "@/lib/monetization/gateway-manager";
import { validateCoupon } from "@/lib/monetization/monetization-api";

interface CheckoutModalProps {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckoutModal({ plan, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [discountCents, setDiscountCents] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<GatewayProvider>("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!plan) return null;

  const originalPriceCents = plan.yearlyPriceCents > 0 ? plan.yearlyPriceCents : plan.monthlyPriceCents;
  const subtotalCents = Math.max(0, originalPriceCents - discountCents);
  const { taxCents } = calculateTaxes(subtotalCents, selectedGateway === "razorpay");
  const totalCents = subtotalCents + taxCents;

  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await validateCoupon(couponCode, plan.slug, originalPriceCents);
      setDiscountCents(res.discountCents);
      setCouponSuccess(`Coupon ${res.coupon.code} applied! Saved ₹${res.discountCents / 100}.`);
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code.");
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Payment of ₹${(totalCents / 100).toLocaleString()} successful via ${selectedGateway.toUpperCase()}! Plan upgraded to ${plan.name}.`);
      if (onSuccess) onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center justify-between">
            <span>Upgrade to {plan.name}</span>
            <Badge className="bg-accent text-accent-foreground font-semibold">
              SSL SECURED 256-BIT
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm py-2">
          {/* Plan Summary Card */}
          <Card className="p-4 bg-secondary/30 border-border">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base">{plan.name} Plan</h4>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <span className="font-display text-xl font-bold text-accent">
                ₹{(originalPriceCents / 100).toLocaleString()}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Sparkles className="size-3.5 text-amber-500" /> Full Access
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <ShieldCheck className="size-3.5 text-emerald-500" /> 100% Refund Guarantee
              </span>
            </div>
          </Card>

          {/* Coupon Code Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold block">Have a Coupon Code?</label>
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. SANATAN20"
                className="font-mono text-sm uppercase"
              />
              <Button variant="outline" onClick={handleApplyCoupon} className="shrink-0">
                Apply
              </Button>
            </div>
            {couponError && <p className="text-xs text-rose-500">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-600 font-semibold">{couponSuccess}</p>}
          </div>

          {/* Payment Gateway Picker */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`p-3 cursor-pointer transition-all border ${
                  selectedGateway === "razorpay"
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "hover:border-accent/40"
                }`}
                onClick={() => setSelectedGateway("razorpay")}
              >
                <div className="font-bold text-sm">Razorpay (India)</div>
                <p className="text-[11px] text-muted-foreground">UPI, GPay, Cards, Net Banking</p>
              </Card>

              <Card
                className={`p-3 cursor-pointer transition-all border ${
                  selectedGateway === "lemonsqueezy"
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "hover:border-accent/40"
                }`}
                onClick={() => setSelectedGateway("lemonsqueezy")}
              >
                <div className="font-bold text-sm">LemonSqueezy</div>
                <p className="text-[11px] text-muted-foreground">Global Credit / Debit Cards & USD</p>
              </Card>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 rounded-lg bg-card border border-border space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan Subtotal:</span>
              <span>₹{(originalPriceCents / 100).toLocaleString()}</span>
            </div>
            {discountCents > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount:</span>
                <span>-₹{(discountCents / 100).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST Tax (18%):</span>
              <span>₹{(taxCents / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-bold text-base">
              <span>Final Total:</span>
              <span className="text-accent">₹{(totalCents / 100).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePay} disabled={isProcessing} className="gap-2 shadow-md px-6">
            {isProcessing ? "Processing Payment..." : `Pay ₹${(totalCents / 100).toLocaleString()}`}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
