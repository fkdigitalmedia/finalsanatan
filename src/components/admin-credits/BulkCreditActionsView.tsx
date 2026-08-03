import React, { useState } from "react";
import { Users, Upload, CheckCircle, ArrowRight, Zap, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { performBulkCreditAction } from "@/lib/admin-credits/admin-credits-api";

export function BulkCreditActionsView() {
  const [emailsInput, setEmailsInput] = useState("");
  const [action, setAction] = useState<"bulk_add" | "bulk_remove" | "bulk_expire" | "bulk_gift">(
    "bulk_add",
  );
  const [amount, setAmount] = useState(25);
  const [reason, setReason] = useState("Festival Campaign Bonus");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecuteBulk = async () => {
    const ids = emailsInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      alert("Please enter at least one User ID or email.");
      return;
    }

    setIsProcessing(true);
    try {
      await performBulkCreditAction({
        targetUserIds: ids,
        action,
        amount,
        reason,
      });
      alert(`Bulk action [${action}] completed for ${ids.length} users!`);
      setEmailsInput("");
    } catch (err: any) {
      alert(err.message || "Bulk operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Users className="size-6 text-purple-500" /> 24.10 Bulk Credit Operations & CSV Import
        </h2>
        <p className="text-sm text-muted-foreground">
          Perform multi-user credit grants, promotional gifts, or bulk balance expirations across targeted user sets.
        </p>
      </div>

      {/* Bulk Form */}
      <Card className="p-6 max-w-xl space-y-4">
        <h3 className="font-display font-bold text-lg">Bulk Operations Manager</h3>

        <div>
          <label className="text-xs font-semibold block mb-1">Target User List (IDs or Emails)</label>
          <Textarea
            value={emailsInput}
            onChange={(e) => setEmailsInput(e.target.value)}
            placeholder="Enter emails or User IDs separated by commas or line breaks...&#10;rahul@example.com&#10;priya@example.com"
            rows={4}
            className="font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Operation Type</label>
            <Select value={action} onValueChange={(val: any) => setAction(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulk_add">Bulk Add Credits</SelectItem>
                <SelectItem value="bulk_gift">Bulk Gift Bonus</SelectItem>
                <SelectItem value="bulk_remove">Bulk Deduct Credits</SelectItem>
                <SelectItem value="bulk_expire">Bulk Expire Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Credit Amount Per User</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Campaign / Reason Note</label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Diwali Festival Gift 2026"
          />
        </div>

        <Button onClick={handleExecuteBulk} disabled={isProcessing} className="w-full gap-2 shadow-md">
          {isProcessing ? "Executing Bulk Action..." : `Execute Bulk Action (${amount} Cr)`}
          <ArrowRight className="size-4" />
        </Button>
      </Card>
    </div>
  );
}
