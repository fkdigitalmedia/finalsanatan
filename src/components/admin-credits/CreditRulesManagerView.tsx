import React, { useEffect, useState } from "react";
import {
  Zap,
  Search,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Activity,
  Filter,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import type { CreditRuleAuditLog, DynamicCreditRule, FeatureCategory } from "@/lib/credit-rules/credit-rules-types";
import {
  fetchCreditRuleAuditLogs,
  fetchCreditRules,
  saveCreditRule,
} from "@/lib/credit-rules/credit-rules-api";

export function CreditRulesManagerView() {
  const [rules, setRules] = useState<DynamicCreditRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<CreditRuleAuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingRule, setEditingRule] = useState<DynamicCreditRule | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const loadData = async () => {
    const r = await fetchCreditRules();
    const l = await fetchCreditRuleAuditLogs();
    setRules(r);
    setAuditLogs(l);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const categories: FeatureCategory[] = [
    "Kundli Reports",
    "AI Jyotish Assistant",
    "Panchang Tools",
    "Matchmaking",
    "Numerology",
    "Family Astrology",
    "Remedies & Pujas",
  ];

  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.featureName.toLowerCase().includes(search.toLowerCase()) ||
      r.featureKey.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleRuleStatus = async (rule: DynamicCreditRule) => {
    const updated = { ...rule, isEnabled: !rule.isEnabled };
    await saveCreditRule(updated, "Admin Superuser");
    void loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-accent/15 via-background to-purple-500/10 border-accent/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <Zap className="size-6 text-accent" /> Dynamic Credit Rules Manager
              </h2>
              <Badge className="bg-emerald-500 text-white font-semibold text-[10px] uppercase">
                LIVE IN PRODUCTION
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Configure dynamic credit costs and daily/monthly usage limits for every tool & report. Changes take effect immediately without code deployment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowLogs(!showLogs)}
            >
              <Activity className="size-3.5" /> {showLogs ? "Hide Audit Logs" : "View Audit Logs"}
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs shadow-sm"
              onClick={() =>
                setEditingRule({
                  id: `rule-${Date.now()}`,
                  featureKey: "new_feature_key",
                  featureName: "New Premium Feature",
                  category: "Kundli Reports",
                  description: "Custom premium tool description",
                  creditsRequired: 5,
                  dailyLimit: -1,
                  monthlyLimit: -1,
                  isEnabled: true,
                  unlimitedInPlans: ["pro"],
                  updatedAt: new Date().toISOString(),
                  updatedBy: "Admin Superuser",
                })
              }
            >
              <Plus className="size-4" /> Add Credit Rule
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by feature name or key..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="w-full sm:w-60">
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Credit Rules Matrix Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Feature Name / Key</th>
                <th className="p-3">Category</th>
                <th className="p-3">Credit Cost</th>
                <th className="p-3">Daily / Monthly Limit</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-secondary/20">
                  <td className="p-3 font-semibold">
                    <p className="text-foreground">{rule.featureName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{rule.featureKey}</p>
                  </td>

                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {rule.category}
                    </Badge>
                  </td>

                  <td className="p-3 font-display font-bold text-base text-accent">
                    {rule.creditsRequired} Credits
                  </td>

                  <td className="p-3 text-xs text-muted-foreground">
                    <span>
                      Daily: <strong>{rule.dailyLimit === -1 ? "Unlimited" : rule.dailyLimit}</strong>
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      Monthly: <strong>{rule.monthlyLimit === -1 ? "Unlimited" : rule.monthlyLimit}</strong>
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.isEnabled}
                        onCheckedChange={() => handleToggleRuleStatus(rule)}
                      />
                      <span className="text-xs font-semibold">
                        {rule.isEnabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </td>

                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                      onClick={() => setEditingRule(rule)}
                    >
                      <Edit2 className="size-3.5" /> Edit Rule
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Logs Drawer / Section */}
      {showLogs && (
        <Card className="p-6 border-accent/40 bg-card">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="size-5 text-accent" /> Rule Change Audit History Stream
          </h3>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recent rule modifications logged.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider">
                    <th className="p-2.5">Feature</th>
                    <th className="p-2.5">Cost Delta</th>
                    <th className="p-2.5">Status Delta</th>
                    <th className="p-2.5">Changed By</th>
                    <th className="p-2.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-2.5 font-semibold">{log.featureName}</td>
                      <td className="p-2.5">
                        <span className="line-through text-muted-foreground mr-1">
                          {log.previousCost} Cr
                        </span>
                        <ArrowRight className="inline size-3 text-accent mx-0.5" />
                        <strong className="text-accent">{log.newCost} Cr</strong>
                      </td>
                      <td className="p-2.5">
                        {log.previousStatus ? "Enabled" : "Disabled"} →{" "}
                        <strong>{log.newStatus ? "Enabled" : "Disabled"}</strong>
                      </td>
                      <td className="p-2.5 text-muted-foreground">{log.changedBy}</td>
                      <td className="p-2.5 text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Edit Rule Modal */}
      {editingRule && (
        <EditRuleModal
          rule={editingRule}
          isOpen={!!editingRule}
          onClose={() => setEditingRule(null)}
          onSuccess={() => void loadData()}
        />
      )}
    </div>
  );
}

function EditRuleModal({
  rule,
  isOpen,
  onClose,
  onSuccess,
}: {
  rule: DynamicCreditRule;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [featureName, setFeatureName] = useState(rule.featureName);
  const [featureKey, setFeatureKey] = useState(rule.featureKey);
  const [creditsRequired, setCreditsRequired] = useState(rule.creditsRequired);
  const [dailyLimit, setDailyLimit] = useState(rule.dailyLimit);
  const [monthlyLimit, setMonthlyLimit] = useState(rule.monthlyLimit);
  const [isEnabled, setIsEnabled] = useState(rule.isEnabled);

  const handleSave = async () => {
    await saveCreditRule(
      {
        ...rule,
        featureName,
        featureKey,
        creditsRequired,
        dailyLimit,
        monthlyLimit,
        isEnabled,
      },
      "Admin Superuser",
    );
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Credit Cost Rule</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm">
          <div>
            <label className="text-xs font-semibold block mb-1">Feature Name</label>
            <Input value={featureName} onChange={(e) => setFeatureName(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Feature Key (Unique Identifier)</label>
            <Input value={featureKey} onChange={(e) => setFeatureKey(e.target.value)} className="font-mono text-xs" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Credit Cost Required</label>
            <Input
              type="number"
              value={creditsRequired}
              onChange={(e) => setCreditsRequired(parseInt(e.target.value) || 0)}
              className="font-mono text-base font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1">Daily Limit (-1 = Unlimited)</label>
              <Input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(parseInt(e.target.value) || -1)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Monthly Limit (-1 = Unlimited)</label>
              <Input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(parseInt(e.target.value) || -1)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold">Rule Status</span>
            <div className="flex items-center gap-2">
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              <span className="text-xs font-bold">{isEnabled ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save & Apply Immediately</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
