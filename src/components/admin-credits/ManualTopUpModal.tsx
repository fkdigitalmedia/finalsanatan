import React, { useState } from "react";
import { Zap, Plus, Minus, Tag, MessageSquare, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TopUpReasonCategory, UserCreditAccount } from "@/lib/admin-credits/admin-credits-types";
import { performManualTopUp } from "@/lib/admin-credits/admin-credits-api";

interface ManualTopUpModalProps {
  user: UserCreditAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManualTopUpModal({ user, isOpen, onClose, onSuccess }: ManualTopUpModalProps) {
  const [amount, setAmount] = useState<number>(50);
  const [reasonCategory, setReasonCategory] = useState<TopUpReasonCategory>("bonus");
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (amount === 0) return;
    setIsSubmitting(true);
    try {
      await performManualTopUp({
        userId: user.userId,
        amount,
        reasonCategory,
        customNote: customNote.trim() || `Admin manual adjustment of ${amount} credits.`,
      });
      alert(`Successfully credited ${amount} credits to ${user.userName}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to update credits");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Zap className="size-5 text-accent" /> 24.3 Admin Manual Credit Top-Up
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Target User Info */}
          <Card className="p-3 bg-secondary/40 border-border text-xs flex justify-between items-center">
            <div>
              <p className="font-bold text-sm text-foreground">{user.userName}</p>
              <p className="text-muted-foreground">{user.userEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase block">Current Balance</span>
              <span className="font-display font-bold text-base text-accent">{user.currentBalance} Cr</span>
            </div>
          </Card>

          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">Quick Credit Presets</label>
            <div className="flex gap-2">
              {[10, 50, 100, 250].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset ? "default" : "outline"}
                  size="sm"
                  className="flex-1 font-mono text-xs"
                  onClick={() => setAmount(preset)}
                >
                  +{preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="text-xs font-semibold block mb-1">Custom Credit Delta (+ or -)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              placeholder="e.g. 50 or -10"
              className="font-mono"
            />
          </div>

          {/* Reason Category */}
          <div>
            <label className="text-xs font-semibold block mb-1">Reason Category</label>
            <Select
              value={reasonCategory}
              onValueChange={(val: any) => setReasonCategory(val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bonus">Bonus Grant</SelectItem>
                <SelectItem value="compensation">Support Compensation</SelectItem>
                <SelectItem value="support_ticket">Support Ticket Resolution</SelectItem>
                <SelectItem value="promotion">Marketing Promotion</SelectItem>
                <SelectItem value="refund">Refund / Reversal</SelectItem>
                <SelectItem value="admin_grant">Admin Direct Grant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Note */}
          <div>
            <label className="text-xs font-semibold block mb-1">Audit Note</label>
            <Textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Internal administrative note for audit log..."
              className="text-xs"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? "Processing..." : `Apply ${amount > 0 ? `+${amount}` : amount} Credits`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
