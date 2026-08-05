import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Save, RefreshCw, Sparkles, Shield, DollarSign, Eye, EyeOff, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { adminList, adminUpsert } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  DEFAULT_TOOL_MONETIZATION_CONFIG,
  type ToolAccessType,
  type ToolMonetizationConfig,
  type ToolMonetizationItem,
} from "@/lib/monetization/tool-access";

const ACCESS_TYPE_LABELS: Record<ToolAccessType, { label: string; badge: string }> = {
  free: { label: "Free (Unlimited Access)", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  premium: { label: "Premium Subscription Only", badge: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  one_time: { label: "One-Time Purchase Only", badge: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  premium_and_one_time: { label: "Premium OR One-Time Purchase", badge: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  free_preview: { label: "Free Teaser Preview + Premium Full", badge: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" },
  hidden: { label: "Hidden (Disabled)", badge: "bg-destructive/10 text-destructive border-destructive/30" },
  coming_soon: { label: "Coming Soon (Teaser)", badge: "bg-muted text-muted-foreground border-muted" },
};

const ALL_PLAN_KEYS = [
  { key: "basic_access", label: "Basic Plan" },
  { key: "premium_access", label: "Premium Pro Plan" },
  { key: "kundli_premium_report", label: "Kundli Pro Special" },
  { key: "lifetime_vip", label: "Lifetime VIP" },
];

export function ToolMonetizationManager() {
  const listFn = useServerFn(adminList);
  const upsertFn = useServerFn(adminUpsert);
  const qc = useQueryClient();

  const configQuery = useQuery({
    queryKey: ["admin", "site_settings", "tool_monetization_config"],
    queryFn: async () => {
      const res = await listFn({
        data: { table: "site_settings", limit: 1, search: "tool_monetization_config", searchColumn: "key" },
      });
      const row = (res?.rows ?? []).find((r: any) => r.key === "tool_monetization_config") as any;
      if (!row?.value || typeof row.value !== "object") {
        return DEFAULT_TOOL_MONETIZATION_CONFIG;
      }
      return { ...DEFAULT_TOOL_MONETIZATION_CONFIG, ...(row.value as ToolMonetizationConfig) };
    },
  });

  const [items, setItems] = useState<ToolMonetizationConfig>(DEFAULT_TOOL_MONETIZATION_CONFIG);
  const [dirty, setDirty] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolMonetizationItem | null>(null);

  useEffect(() => {
    if (configQuery.data) {
      setItems(configQuery.data);
      setDirty(false);
    }
  }, [configQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (updatedConfig: ToolMonetizationConfig) => {
      return upsertFn({
        data: {
          table: "site_settings",
          onConflict: "key",
          values: {
            key: "tool_monetization_config",
            value: updatedConfig,
            is_public: true,
          },
        },
      });
    },
    onSuccess: () => {
      toast.success("Tool Monetization & Visibility Settings Saved Successfully!");
      setDirty(false);
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to save monetization config"),
  });

  const handleUpdateItem = (slug: string, updates: Partial<ToolMonetizationItem>) => {
    setItems((prev) => {
      const updated = {
        ...prev,
        [slug]: {
          ...prev[slug],
          ...updates,
        },
      };
      setDirty(true);
      return updated;
    });
  };

  const handleResetDefaults = () => {
    setItems(DEFAULT_TOOL_MONETIZATION_CONFIG);
    setDirty(true);
    toast.info("Reset to default monetization matrix. Click 'Save Changes' to persist.");
  };

  const sortedList = Object.values(items).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 font-serif text-2xl font-bold">
            <Layers className="size-6 text-amber-500" /> Astrology Tools Monetization & Visibility
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure access rules, prices, trial flags, badges, and display orders dynamically for every report and tool.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleResetDefaults}>
            <RefreshCw className="mr-1.5 size-4" /> Reset Defaults
          </Button>
          <Button
            size="sm"
            disabled={!dirty || saveMutation.isPending}
            onClick={() => saveMutation.mutate(items)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
          >
            <Save className="mr-1.5 size-4" /> {saveMutation.isPending ? "Saving…" : "Save All Configurations"}
          </Button>
        </div>
      </div>

      {/* Grid of Tool Configuration Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedList.map((item) => {
          const typeMeta = ACCESS_TYPE_LABELS[item.accessType] || ACCESS_TYPE_LABELS.free;
          return (
            <Card key={item.slug} className={`p-5 space-y-4 border ${!item.enabled ? "opacity-60 bg-muted/20" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-base flex items-center gap-2">
                    {item.name}
                    {!item.enabled && <Badge variant="destructive" className="text-[10px]">Disabled</Badge>}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">{item.slug}</div>
                </div>
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(enabled) => handleUpdateItem(item.slug, { enabled })}
                />
              </div>

              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              )}

              {/* Access Type Badge & Controls */}
              <div className="space-y-2 pt-2 border-t text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Access Type:</span>
                  <Badge variant="outline" className={typeMeta.badge}>
                    {typeMeta.label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">One-Time Price:</span>
                  <span className="font-semibold text-foreground">
                    {item.oneTimePriceCents > 0 ? `₹${(item.oneTimePriceCents / 100).toFixed(0)}` : "Included"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Display Order:</span>
                  <span className="font-mono text-xs">#{item.displayOrder}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.featuredBadge && <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600">Featured</Badge>}
                  {item.popularBadge && <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-600">Popular</Badge>}
                  {item.trialAvailable && <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600">Trial Yes</Badge>}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => setSelectedTool(item)}
              >
                Configure Settings →
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Settings Modal Dialog */}
      {selectedTool && (
        <Dialog open={!!selectedTool} onOpenChange={(op) => !op && setSelectedTool(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Configure {selectedTool.name}</DialogTitle>
              <DialogDescription className="text-xs">
                Set dynamic pricing, subscription plans, trial status, and visibility rules for this tool.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Tool Display Name</Label>
                  <Input
                    value={selectedTool.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSelectedTool((prev) => prev ? { ...prev, name } : null);
                      handleUpdateItem(selectedTool.slug, { name });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Display Order</Label>
                  <Input
                    type="number"
                    value={selectedTool.displayOrder}
                    onChange={(e) => {
                      const displayOrder = Number(e.target.value);
                      setSelectedTool((prev) => prev ? { ...prev, displayOrder } : null);
                      handleUpdateItem(selectedTool.slug, { displayOrder });
                    }}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Access Type</Label>
                <Select
                  value={selectedTool.accessType}
                  onValueChange={(val: ToolAccessType) => {
                    setSelectedTool((prev) => prev ? { ...prev, accessType: val } : null);
                    handleUpdateItem(selectedTool.slug, { accessType: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free (Unlimited Access)</SelectItem>
                    <SelectItem value="premium">Premium Subscription Only</SelectItem>
                    <SelectItem value="one_time">One-Time Purchase Only</SelectItem>
                    <SelectItem value="premium_and_one_time">Premium OR One-Time Purchase</SelectItem>
                    <SelectItem value="free_preview">Free Teaser Preview + Premium Full</SelectItem>
                    <SelectItem value="hidden">Hidden (Disabled)</SelectItem>
                    <SelectItem value="coming_soon">Coming Soon (Teaser)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">One-Time Price (INR Rupees)</Label>
                  <Input
                    type="number"
                    value={selectedTool.oneTimePriceCents / 100}
                    onChange={(e) => {
                      const oneTimePriceCents = Math.max(0, Number(e.target.value) * 100);
                      setSelectedTool((prev) => prev ? { ...prev, oneTimePriceCents } : null);
                      handleUpdateItem(selectedTool.slug, { oneTimePriceCents });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-5">
                  <Label className="text-xs">Trial Available</Label>
                  <Switch
                    checked={selectedTool.trialAvailable}
                    onCheckedChange={(trialAvailable) => {
                      setSelectedTool((prev) => prev ? { ...prev, trialAvailable } : null);
                      handleUpdateItem(selectedTool.slug, { trialAvailable });
                    }}
                  />
                </div>
              </div>

              {/* Included Subscription Plans */}
              <div className="space-y-2 border-t pt-3">
                <Label className="text-xs font-semibold">Included Subscription Plans</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PLAN_KEYS.map((p) => {
                    const checked = selectedTool.includedPlans.includes(p.key);
                    return (
                      <div key={p.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`plan-${p.key}`}
                          checked={checked}
                          onCheckedChange={(chk) => {
                            const newPlans = chk
                              ? [...selectedTool.includedPlans, p.key]
                              : selectedTool.includedPlans.filter((k) => k !== p.key);
                            setSelectedTool((prev) => prev ? { ...prev, includedPlans: newPlans } : null);
                            handleUpdateItem(selectedTool.slug, { includedPlans: newPlans });
                          }}
                        />
                        <label htmlFor={`plan-${p.key}`} className="text-xs font-medium leading-none cursor-pointer">
                          {p.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Badges & Status Switches */}
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Featured Badge</Label>
                  <Switch
                    checked={selectedTool.featuredBadge}
                    onCheckedChange={(featuredBadge) => {
                      setSelectedTool((prev) => prev ? { ...prev, featuredBadge } : null);
                      handleUpdateItem(selectedTool.slug, { featuredBadge });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Popular Badge</Label>
                  <Switch
                    checked={selectedTool.popularBadge}
                    onCheckedChange={(popularBadge) => {
                      setSelectedTool((prev) => prev ? { ...prev, popularBadge } : null);
                      handleUpdateItem(selectedTool.slug, { popularBadge });
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button size="sm" variant="default" onClick={() => setSelectedTool(null)}>
                Done Editing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
