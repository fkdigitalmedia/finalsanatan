import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2, Save, Gift } from "lucide-react";
import { toast } from "sonner";

import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminList, adminUpsert } from "@/lib/admin.functions";
import { parseBoolSetting } from "@/lib/settings.functions";
import { PredictionRuleManager } from "@/components/admin/PredictionRuleManager";
import { PdfConfigurator } from "@/components/admin/PdfConfigurator";
import { KnowledgeBaseManager } from "@/components/admin/KnowledgeBaseManager";

const plansConfig: CrudConfig = {
  table: "subscription_plans",
  keyColumn: "id",
  title: "Subscription Plans",
  description:
    "Subscription tiers and one-time downloads. Set product type to 'one_time' and add a Download URL for pay-and-download items. Priced in the smallest currency unit (paise for INR).",
  searchColumn: "slug",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "description", label: "Short description", type: "text", hideInTable: true },
    {
      name: "product_type",
      label: "Product type",
      type: "select",
      options: ["subscription", "one_time"],
    },
    { name: "price_cents", label: "Price (in paise / cents)", type: "number", required: true },
    { name: "currency", label: "Currency", type: "text" },
    { name: "interval", label: "Interval", type: "select", options: ["month", "year", "one_time"] },
    { name: "features", label: "Features (JSON array)", type: "json", hideInTable: true },
    { name: "cta_label", label: "CTA label", type: "text", hideInTable: true },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "sort_order", label: "Sort order", type: "number", hideInTable: true },
    { name: "download_url", label: "Download URL (one-time)", type: "text", hideInTable: true },
    { name: "entitlement_key", label: "Entitlement key", type: "text", hideInTable: true },
    {
      name: "provider",
      label: "Provider",
      type: "select",
      options: ["razorpay", "stripe", "lemonsqueezy", "paddle"],
    },
    { name: "provider_price_id", label: "Provider price ID", type: "text", hideInTable: true },
    { name: "active", label: "Active", type: "boolean" },
  ],
};

const couponsConfig: CrudConfig = {
  table: "coupons",
  keyColumn: "id",
  title: "Coupons",
  searchColumn: "code",
  fields: [
    { name: "code", label: "Code", type: "text", required: true },
    { name: "percent_off", label: "% off", type: "number" },
    { name: "amount_off_cents", label: "$ off (cents)", type: "number" },
    { name: "currency", label: "Currency", type: "text" },
    { name: "valid_from", label: "Valid from", type: "datetime", hideInTable: true },
    { name: "valid_to", label: "Valid to", type: "datetime", hideInTable: true },
    { name: "max_redemptions", label: "Max redemptions", type: "number" },
    { name: "redemptions", label: "Used", type: "number" },
    { name: "active", label: "Active", type: "boolean" },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/monetization")({
  component: MonetizationPage,
  head: () => ({
    meta: [{ title: "Admin — Monetization" }, { name: "robots", content: "noindex" }],
  }),
});

function MonetizationPage() {
  return (
    <div className="space-y-10">
      <KundliFreeToggle />
      <CrudTable config={plansConfig} />
      <CrudTable config={couponsConfig} />
    </div>
  );
}

function KundliFreeToggle() {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin", "site_settings", "kundli.report"],
    queryFn: () =>
      list({
        data: { table: "site_settings", limit: 1, search: "kundli.report", searchColumn: "key" },
      }),
  });

  const row = (q.data?.rows ?? []).find((r: any) => r.key === "kundli.report") as any;
  const initial = parseBoolSetting(row?.value);
  const [free, setFree] = useState(initial);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setFree(initial);
    setDirty(false);
  }, [initial]);

  const save = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          table: "site_settings",
          onConflict: "key",
          values: {
            key: "kundli.report",
            value: { free_full_report: free },
            is_public: true,
          },
        },
      }),
    onSuccess: () => {
      toast.success(
        free ? "Kundli report is now FREE for everyone" : "Kundli report is now PAID (premium)",
      );
      setDirty(false);
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to save"),
  });

  return (
    <section className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Gift className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-serif font-semibold">Kundli Report — Free or Paid?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn <b>ON</b> to give every user the full premium Kundli PDF (all 14+ pages, AI
            interpretation, divisional charts) for <b>FREE</b>. Turn <b>OFF</b> to keep it as a paid
            download — non-premium users will see the payment popup.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-4">
            <div>
              <Label className="text-sm font-medium">Give full Kundli report for FREE</Label>
              <p className="text-xs text-muted-foreground">
                Current mode:{" "}
                <b className={free ? "text-emerald-600" : "text-amber-600"}>
                  {free ? "FREE for everyone" : "PAID (premium only)"}
                </b>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={free}
                onCheckedChange={(v) => {
                  setFree(v);
                  setDirty(true);
                }}
              />
              <Button
                size="sm"
                onClick={() => save.mutate()}
                disabled={save.isPending || !dirty}
                className="gap-2"
              >
                {save.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t pt-8 space-y-8">
        <PredictionRuleManager />
        <PdfConfigurator />
        <KnowledgeBaseManager />
      </div>
    </section>
  );
}
