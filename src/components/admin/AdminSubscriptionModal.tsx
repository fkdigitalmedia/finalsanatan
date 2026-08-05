import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Crown,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  History,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getUserSubscriptionDetails,
  assignUserSubscription,
} from "@/lib/admin-subscription.functions";
import type {
  SubscriptionPlanKey,
  SubscriptionDurationPreset,
  AdminSubscriptionStatus,
  SubscriptionReasonCode,
} from "@/lib/monetization/monetization-types";

export interface AdminSubscriptionModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperAdmin?: boolean;
}

const PLANS: { key: SubscriptionPlanKey; name: string; badge: string; desc: string }[] = [
  { key: "free", name: "Free Plan", badge: "FREE", desc: "Basic access to core tools" },
  { key: "basic", name: "Basic Plan", badge: "BASIC", desc: "Standard access & monthly PDF" },
  { key: "premium_pro", name: "Premium Pro", badge: "PRO", desc: "Unlimited AI, Kundlis & PDFs" },
  { key: "lifetime_vip", name: "Lifetime VIP", badge: "VIP", desc: "Permanent VIP access forever" },
];

const DURATIONS: { key: SubscriptionDurationPreset; label: string }[] = [
  { key: "7d", label: "7 Days" },
  { key: "15d", label: "15 Days" },
  { key: "30d", label: "30 Days (1 Mo)" },
  { key: "60d", label: "60 Days" },
  { key: "90d", label: "90 Days (3 Mo)" },
  { key: "180d", label: "180 Days (6 Mo)" },
  { key: "365d", label: "365 Days (1 Yr)" },
  { key: "custom", label: "Custom Date" },
  { key: "lifetime", label: "Lifetime" },
];

const STATUSES: { key: AdminSubscriptionStatus; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "trial", label: "Trial" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
  { key: "cancelled", label: "Cancelled" },
  { key: "expired", label: "Expired" },
];

const REASONS: { key: SubscriptionReasonCode; label: string }[] = [
  { key: "manual_upgrade", label: "Manual Upgrade" },
  { key: "customer_support", label: "Customer Support Resolution" },
  { key: "promotion", label: "Promotional Offer" },
  { key: "influencer", label: "Influencer Partnership" },
  { key: "refund_compensation", label: "Refund Compensation" },
  { key: "testing", label: "QA & Internal Testing" },
  { key: "internal_staff", label: "Internal Staff Member" },
  { key: "contest_winner", label: "Contest Winner" },
  { key: "custom", label: "Custom Note" },
];

export function AdminSubscriptionModal({
  userId,
  open,
  onOpenChange,
  isSuperAdmin = true,
}: AdminSubscriptionModalProps) {
  const qc = useQueryClient();
  const fetchDetails = useServerFn(getUserSubscriptionDetails);
  const assignPlan = useServerFn(assignUserSubscription);

  const [activeTab, setActiveTab] = useState<"current" | "manage" | "history">("current");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanKey>("premium_pro");
  const [selectedStatus, setSelectedStatus] = useState<AdminSubscriptionStatus>("active");
  const [durationPreset, setDurationPreset] = useState<SubscriptionDurationPreset>("30d");
  const [customExpiry, setCustomExpiry] = useState("");
  const [reasonCode, setReasonCode] = useState<SubscriptionReasonCode>("manual_upgrade");
  const [reasonNotes, setReasonNotes] = useState("");

  const { data: details, isLoading } = useQuery({
    queryKey: ["admin", "subscription", userId],
    queryFn: () => fetchDetails({ data: { userId: userId! } }),
    enabled: open && !!userId,
  });

  const assignMut = useMutation({
    mutationFn: (actionType?: string) =>
      assignPlan({
        data: {
          userId: userId!,
          planKey: selectedPlan,
          status: selectedStatus,
          durationPreset,
          customExpiryDate: durationPreset === "custom" && customExpiry ? new Date(customExpiry).toISOString() : undefined,
          isLifetime: durationPreset === "lifetime" || selectedPlan === "lifetime_vip",
          reasonCode,
          reasonNotes,
          actionType: (actionType as any) || "assign",
        },
      }),
    onSuccess: (res) => {
      toast.success(res.message || "Subscription updated successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "subscription", userId] });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      setActiveTab("current");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Crown className="size-5 text-accent" />
            Subscription Management
          </DialogTitle>
          <DialogDescription>
            Assign, extend, upgrade, suspend or revoke subscription plans for{" "}
            <span className="font-semibold text-foreground">{details?.userName || userId}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="current">Current Status</TabsTrigger>
            <TabsTrigger value="manage">Manage Plan</TabsTrigger>
            <TabsTrigger value="history">Audit History</TabsTrigger>
          </TabsList>

          {/* TAB 1: CURRENT STATUS */}
          <TabsContent value="current" className="space-y-4 pt-3">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <RefreshCw className="size-5 animate-spin mx-auto mb-2" />
                Loading subscription details...
              </div>
            ) : (
              <>
                <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Current Active Plan</p>
                      <h3 className="text-2xl font-bold flex items-center gap-2 mt-0.5">
                        {details?.currentPlanLabel}
                        {details?.isLifetime && (
                          <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            LIFETIME VIP
                          </Badge>
                        )}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        details?.status === "Active"
                          ? "default"
                          : details?.status === "Suspended"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs font-bold uppercase px-2.5 py-1"
                    >
                      {details?.status}
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs border-t">
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <p className="font-medium mt-0.5">
                        {details?.startDate ? new Date(details.startDate).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <p className="font-medium mt-0.5">
                        {details?.isLifetime
                          ? "Never (Lifetime)"
                          : details?.expiryDate
                          ? new Date(details.expiryDate).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining Days:</span>
                      <p className="font-bold text-accent mt-0.5">
                        {details?.isLifetime ? "∞ Unlimited" : `${details?.remainingDays ?? 0} Days`}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assigned By:</span>
                      <p className="font-medium mt-0.5">{details?.assignedBy || "System"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Presets */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick Admin Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPlan("premium_pro");
                        setDurationPreset("30d");
                        setSelectedStatus("active");
                        setActiveTab("manage");
                      }}
                    >
                      <Sparkles className="size-3.5 mr-1 text-primary" /> +30 Days Pro
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPlan("premium_pro");
                        setDurationPreset("365d");
                        setSelectedStatus("active");
                        setActiveTab("manage");
                      }}
                    >
                      <Crown className="size-3.5 mr-1 text-amber-500" /> +1 Year Pro
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPlan("lifetime_vip");
                          setDurationPreset("lifetime");
                          setSelectedStatus("active");
                          setActiveTab("manage");
                        }}
                      >
                        <Zap className="size-3.5 mr-1 text-accent" /> Assign Lifetime VIP
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedPlan("free");
                        setSelectedStatus("suspended");
                        setActiveTab("manage");
                      }}
                    >
                      Suspend Access
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* TAB 2: MANAGE & ASSIGN */}
          <TabsContent value="manage" className="space-y-4 pt-3">
            {/* 1. Choose Plan */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Subscription Plan
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                {PLANS.map((p) => {
                  const isVip = p.key === "lifetime_vip";
                  const disabled = isVip && !isSuperAdmin;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setSelectedPlan(p.key);
                        if (isVip) setDurationPreset("lifetime");
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPlan === p.key
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{p.badge}</span>
                        {isVip && <Lock className="size-3 text-muted-foreground" />}
                      </div>
                      <p className="font-semibold text-sm mt-1">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Choose Duration & Status */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Duration / Validity
                </Label>
                <select
                  value={durationPreset}
                  onChange={(e) => setDurationPreset(e.target.value as any)}
                  className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {DURATIONS.map((d) => (
                    <option key={d.key} value={d.key} disabled={d.key === "lifetime" && !isSuperAdmin}>
                      {d.label} {d.key === "lifetime" && !isSuperAdmin ? "(Super Admin Only)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </Label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Expiry Input if Custom selected */}
            {durationPreset === "custom" && (
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Custom Expiry Date
                </Label>
                <Input
                  type="date"
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}

            {/* 3. Reason Code & Custom Notes */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assignment Reason (Required)
                </Label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value as any)}
                  className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {REASONS.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin Notes / Remarks
                </Label>
                <Input
                  placeholder="e.g. Granted per support ticket #402"
                  value={reasonNotes}
                  onChange={(e) => setReasonNotes(e.target.value)}
                  className="mt-1.5 text-xs"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-end gap-2 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                disabled={assignMut.isPending}
                onClick={() => assignMut.mutate("assign")}
                className="min-w-[140px]"
              >
                {assignMut.isPending ? "Updating..." : "Save Subscription"}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: AUDIT HISTORY */}
          <TabsContent value="history" className="pt-3">
            {!details?.auditHistory?.length ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No previous subscription audit records found for this user.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
                {details.auditHistory.map((h: any) => (
                  <div key={h.id} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{h.meta?.planLabel || h.action}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(h.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Action: <strong className="text-foreground">{h.action}</strong> | Status:{" "}
                      <strong className="text-foreground">{h.meta?.status || "Active"}</strong>
                    </p>
                    {h.meta?.reasonText && (
                      <p className="text-muted-foreground">
                        Reason: <span className="italic">{h.meta.reasonText}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      Admin: {h.meta?.adminName || h.actorUserId}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
