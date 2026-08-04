import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Crown,
  CheckCircle,
  Tag,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { SubscriptionPlan, Coupon } from "@/lib/monetization/monetization-types";
import {
  validateCoupon,
  createInvoice,
  updateUserSubscription,
} from "@/lib/monetization/monetization-api";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckoutModal({
  plan,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly" | "lifetime">("yearly");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "lemonsqueezy">("razorpay");

  // Price calculations
  let basePriceCents = plan.yearlyPriceCents;
  if (billingCycle === "monthly") basePriceCents = plan.monthlyPriceCents;
  if (billingCycle === "lifetime") basePriceCents = plan.lifetimePriceCents;

  let discountCents = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountCents = Math.round((basePriceCents * appliedCoupon.discountValue) / 100);
    } else {
      discountCents = appliedCoupon.discountValue;
    }
  }

  const priceAfterDiscount = Math.max(0, basePriceCents - discountCents);

  // 18% GST calculation (Strictly 0 if gstEnabled is false)
  const gstEnabled = plan.gstEnabled ?? true;
  const gstTaxCents = gstEnabled ? Math.round(priceAfterDiscount * 0.18) : 0;
  const finalTotalCents = priceAfterDiscount + gstTaxCents;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const c = await validateCoupon(couponCode);
    if (c) {
      setAppliedCoupon(c);
      toast.success(`Coupon ${c.code} applied successfully!`);
    } else {
      toast.error("Invalid or expired coupon code.");
    }
  };

  const handleCompletePayment = async () => {
    if (!user) {
      toast.error("You must be signed in to purchase a plan.");
      return;
    }

    setProcessing(true);
    try {
      // Simulate gateway authorization window
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userName = user.user_metadata?.display_name || user.email?.split("@")[0] || "User";
      const userEmail = user.email || "user@sanatantools.com";

      // 1. Create GST Invoice
      await createInvoice({
        userId: user.id,
        userName,
        userEmail,
        planName: plan.name,
        subtotalCents: basePriceCents,
        discountCents,
        gstTaxCents,
        totalCents: finalTotalCents,
        currency: "INR",
        status: "paid",
        gateway: selectedGateway,
        transactionId: `tx_${selectedGateway}_${Date.now()}`,
      });

      // 2. Activate User Subscription
      const endDate = new Date();
      if (billingCycle === "monthly") endDate.setDate(endDate.getDate() + 30);
      else if (billingCycle === "yearly") endDate.setDate(endDate.getDate() + 365);
      else endDate.setDate(endDate.getDate() + 36500);

      await updateUserSubscription({
        id: `sub-${Date.now()}`,
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
        status: "active",
        billingCycle,
        amountPaidCents: finalTotalCents,
        currency: "INR",
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        gateway: selectedGateway,
        autoRenew: billingCycle !== "lifetime",
        createdAt: new Date().toISOString(),
      });

      toast.success(`🎉 Congratulations! You are now subscribed to ${plan.name}`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (e) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Crown className="size-5 text-accent" /> Checkout: {plan.name}
          </DialogTitle>
          <DialogDescription>
            Upgrade your SanatanTools subscription with GST-compliant invoice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm py-2">
          {/* Cycle Selector */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <span className="text-xs font-semibold">Select Billing Cycle:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                className="text-xs h-7"
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </Button>
              <Button
                size="sm"
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                className="text-xs h-7"
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
              </Button>
              <Button
                size="sm"
                variant={billingCycle === "lifetime" ? "default" : "ghost"}
                className="text-xs h-7"
                onClick={() => setBillingCycle("lifetime")}
              >
                Lifetime
              </Button>
            </div>
          </div>

          {/* Payment Gateway Picker */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">Payment Gateway</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedGateway === "razorpay"
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border hover:bg-secondary/40"
                }`}
                onClick={() => setSelectedGateway("razorpay")}
              >
                <div>
                  <div className="font-bold text-xs">Razorpay</div>
                  <div className="text-[10px] text-muted-foreground">UPI, Cards, NetBanking</div>
                </div>
                {selectedGateway === "razorpay" && <CheckCircle className="size-4 text-accent" />}
              </button>

              <button
                type="button"
                className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedGateway === "lemonsqueezy"
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border hover:bg-secondary/40"
                }`}
                onClick={() => setSelectedGateway("lemonsqueezy")}
              >
                <div>
                  <div className="font-bold text-xs">LemonSqueezy</div>
                  <div className="text-[10px] text-muted-foreground">Global Cards & Paypal</div>
                </div>
                {selectedGateway === "lemonsqueezy" && <CheckCircle className="size-4 text-accent" />}
              </button>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Have a coupon code?"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="text-xs"
            />
            <Button size="sm" variant="outline" onClick={handleApplyCoupon} className="gap-1 text-xs">
              <Tag className="size-3.5" /> Apply
            </Button>
          </div>

          {/* Pricing Summary */}
          <div className="rounded-xl border p-4 bg-card space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Base Price:</span>
              <span>₹{(basePriceCents / 100).toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({appliedCoupon.code}):</span>
                <span>- ₹{(discountCents / 100).toLocaleString()}</span>
              </div>
            )}

            {gstEnabled && (
              <div className="flex justify-between text-muted-foreground">
                <span>18% GST Tax:</span>
                <span>+ ₹{(gstTaxCents / 100).toLocaleString()}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-bold text-sm text-foreground">
              <span>Total Payable:</span>
              <span className="text-accent text-base">
                ₹{(finalTotalCents / 100).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 justify-center">
            <ShieldCheck className="size-4 text-emerald-500" /> 256-bit Encrypted Payment • 7-Day Refund Policy
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCompletePayment} disabled={processing} className="gap-1.5">
            {processing ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            {processing ? "Processing Payment..." : `Pay ₹${(finalTotalCents / 100).toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
