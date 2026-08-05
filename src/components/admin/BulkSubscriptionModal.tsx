import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Users, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { bulkManageSubscriptions } from "@/lib/admin-subscription.functions";
import type {
  SubscriptionPlanKey,
  SubscriptionReasonCode,
} from "@/lib/monetization/monetization-types";

export interface BulkSubscriptionModalProps {
  selectedUserIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BulkSubscriptionModal({
  selectedUserIds,
  open,
  onOpenChange,
  onSuccess,
}: BulkSubscriptionModalProps) {
  const qc = useQueryClient();
  const bulkFn = useServerFn(bulkManageSubscriptions);

  const [action, setAction] = useState<"assign" | "extend" | "suspend" | "expire">("assign");
  const [planKey, setPlanKey] = useState<SubscriptionPlanKey>("premium_pro");
  const [extendDays, setExtendDays] = useState<number>(30);
  const [reasonCode, setReasonCode] = useState<SubscriptionReasonCode>("manual_upgrade");
  const [reasonNotes, setReasonNotes] = useState("");

  const bulkMut = useMutation({
    mutationFn: () =>
      bulkFn({
        data: {
          userIds: selectedUserIds,
          action,
          planKey,
          extendDays,
          reasonCode,
          reasonNotes,
        },
      }),
    onSuccess: (res) => {
      toast.success(`Bulk operation complete: Processed ${res.processed} users successfully.`);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Users className="size-5 text-accent" />
            Bulk Subscription Management
          </DialogTitle>
          <DialogDescription>
            Perform bulk plan operations on <strong className="text-foreground">{selectedUserIds.length}</strong> selected users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Action Type */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Bulk Action
            </Label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
            >
              <option value="assign">Bulk Assign Plan</option>
              <option value="extend">Bulk Extend Duration</option>
              <option value="suspend">Bulk Suspend Access</option>
              <option value="expire">Bulk Revoke / Expire</option>
            </select>
          </div>

          {/* Plan Selector if Assign */}
          {action === "assign" && (
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Plan
              </Label>
              <select
                value={planKey}
                onChange={(e) => setPlanKey(e.target.value as any)}
                className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
              >
                <option value="free">Free Plan</option>
                <option value="basic">Basic Plan</option>
                <option value="premium_pro">Premium Pro Plan</option>
                <option value="lifetime_vip">Lifetime VIP Plan</option>
              </select>
            </div>
          )}

          {/* Days selector if Extend */}
          {action === "extend" && (
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extension Days
              </Label>
              <select
                value={extendDays}
                onChange={(e) => setExtendDays(Number(e.target.value))}
                className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
              >
                <option value={7}>+7 Days</option>
                <option value={15}>+15 Days</option>
                <option value={30}>+30 Days (1 Month)</option>
                <option value={90}>+90 Days (3 Months)</option>
                <option value={180}>+180 Days (6 Months)</option>
                <option value={365}>+365 Days (1 Year)</option>
              </select>
            </div>
          )}

          {/* Reason Code */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason Code
            </Label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value as any)}
              className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
            >
              <option value="manual_upgrade">Manual Upgrade</option>
              <option value="customer_support">Customer Support</option>
              <option value="promotion">Promotion Campaign</option>
              <option value="influencer">Influencer Distribution</option>
              <option value="refund_compensation">Refund Compensation</option>
              <option value="testing">Internal Testing</option>
              <option value="contest_winner">Contest Winner</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Audit Notes
            </Label>
            <Input
              placeholder="e.g. Bulk promotional boost for festival"
              value={reasonNotes}
              onChange={(e) => setReasonNotes(e.target.value)}
              className="mt-1.5 text-xs"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={bulkMut.isPending}
              onClick={() => bulkMut.mutate()}
              className="min-w-[140px]"
            >
              {bulkMut.isPending ? "Processing..." : `Execute Bulk ${action}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
