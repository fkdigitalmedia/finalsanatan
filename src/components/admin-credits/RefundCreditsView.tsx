import React, { useState } from "react";
import { RotateCcw, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RefundCreditsView() {
  const [targetUserId, setTargetUserId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [creditsToRefund, setCreditsToRefund] = useState(50);
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefund = async () => {
    if (!targetUserId.trim()) {
      alert("Please enter a User ID or Email");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Refund of ${creditsToRefund} credits successfully processed for user ${targetUserId}!`);
      setTargetUserId("");
      setTransactionId("");
      setReason("");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <RotateCcw className="size-6 text-rose-500" /> 24.9 Refund & Transaction Reversals
        </h2>
        <p className="text-sm text-muted-foreground">
          Admin tool to reverse failed credit purchases, restore debited credits, and process customer refunds.
        </p>
      </div>

      {/* Refund Form Card */}
      <Card className="p-6 max-w-xl space-y-4">
        <h3 className="font-display font-bold text-lg">Process Credit Refund</h3>

        <div>
          <label className="text-xs font-semibold block mb-1">User ID or User Email</label>
          <Input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="e.g. usr-101 or rahul.sharma@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Transaction ID (Optional)</label>
            <Input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. txn_rzp_987654"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Credits to Refund</label>
            <Input
              type="number"
              value={creditsToRefund}
              onChange={(e) => setCreditsToRefund(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Refund Reason & Notes</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this refund is being granted..."
            rows={2}
          />
        </div>

        <Button onClick={handleRefund} disabled={isProcessing} className="w-full gap-2 shadow-md">
          {isProcessing ? "Processing Reversal..." : `Confirm Refund (+${creditsToRefund} Credits)`}
          <ArrowRight className="size-4" />
        </Button>
      </Card>
    </div>
  );
}
