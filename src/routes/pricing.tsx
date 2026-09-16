/**
 * Public /pricing page — reads active plans + active payment gateways and
 * lets a signed-in user pay. Gateways come from the payment_gateways table
 * (admin-managed). Currently Razorpay is wired end-to-end; the picker also
 * shows other saved providers but only Razorpay opens a live checkout.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Check, Pencil, Trash2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { listPublicPlans } from "@/lib/razorpay.functions";
import { listPublicGateways, createPaymentOrder, verifyPayment } from "@/lib/payments.functions";
import { adminUpsert, adminDelete } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Premium Monthly & Annual Plans | SanatanTools" },
      {
        name: "description",
        content:
          "Choose a monthly or annual subscription for unlimited access to AI Kundli, advanced Panchang & 100+ premium Vedic tools. Secure checkout with instant access.",
      },
      { property: "og:title", content: "Pricing — SanatanTools" },
      {
        property: "og:description",
        content: "Monthly and annual premium subscriptions for SanatanTools.",
      },
    ],
  }),
});

type Plan = Awaited<ReturnType<typeof listPublicPlans>>[number];
type Gateway = Awaited<ReturnType<typeof listPublicGateways>>[number];

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listPlans = useServerFn(listPublicPlans);
  const listGateways = useServerFn(listPublicGateways);
  const createOrder = useServerFn(createPaymentOrder);
  const verify = useServerFn(verifyPayment);
  const upsertPlan = useServerFn(adminUpsert);
  const delPlan = useServerFn(adminDelete);

  // Check if current user is admin/staff
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.rpc("is_staff", { _user_id: user.id }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  // Admin plan editor state
  const [editingPlan, setEditingPlan] = useState<Record<string, unknown> | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const savePlanMut = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      upsertPlan({ data: { table: "subscription_plans", values } }),
    onSuccess: () => {
      toast.success("Plan saved!");
      qc.invalidateQueries({ queryKey: ["public-plans"] });
      setEditOpen(false);
      setEditingPlan(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deletePlanMut = useMutation({
    mutationFn: (id: string) =>
      delPlan({ data: { table: "subscription_plans", column: "id", value: id } }),
    onSuccess: () => {
      toast.success("Plan deleted");
      qc.invalidateQueries({ queryKey: ["public-plans"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { data: plans, isLoading } = useQuery({
    queryKey: ["public-plans"],
    queryFn: () => listPlans(),
  });
  const { data: gateways } = useQuery({
    queryKey: ["public-gateways"],
    queryFn: () => listGateways(),
  });

  // Detect whether the visitor is likely inside India (Asia/Kolkata timezone
  // or hi/IN locale). If not, prefer a USD gateway (Lemon Squeezy) automatically.
  const isLikelyIndia = useMemo(() => {
    if (typeof window === "undefined") return true;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Asia/Kolkata") return true;
      const lang = navigator.language || "";
      return /(-|_)IN\b/i.test(lang);
    } catch {
      return true;
    }
  }, []);

  const defaultGatewayId = useMemo(() => {
    if (!gateways || gateways.length === 0) return null;
    if (!isLikelyIndia) {
      const ls = gateways.find((g) => g.provider === "lemonsqueezy");
      if (ls) return ls.id;
    }
    const def = gateways.find((g) => g.is_default) ?? gateways[0];
    return def.id;
  }, [gateways, isLikelyIndia]);

  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);
  const activeGatewayId = selectedGatewayId ?? defaultGatewayId;
  const activeGateway = gateways?.find((g) => g.id === activeGatewayId) ?? null;

  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;

    // Clear query params from URL so refresh doesn't re-show toasts
    window.history.replaceState({}, "", window.location.pathname);

    if (payment === "failed") {
      toast.error("Payment failed. Please try again.");
    } else if (payment === "cancelled") {
      toast.info("Payment cancelled.");
    } else if (payment === "error") {
      toast.error("Payment processing mein error aaya. Agar paise kat gaye hain toh support se contact karein.");
    } else if (payment === "not_found") {
      toast.error("Order nahi mila. Support se contact karein.");
    } else if (payment === "success") {
      toast.success("Payment successful! Subscription activate ho gaya.");
    }
  }, []);

  const checkoutMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!user) {
        navigate({ to: "/auth", search: { redirect: "/pricing" } as never });
        throw new Error("Please sign in to continue");
      }
      if (!activeGateway) {
        throw new Error("No payment gateway is enabled. Please contact support.");
      }

      const order = await createOrder({
        data: {
          planId: plan.id,
          gatewayId: activeGateway.id,
          customer: {
            email: user.email ?? undefined,
            name: user.user_metadata?.display_name as string | undefined,
          },
        },
      });

      if (order.provider === "razorpay") {
        const scriptOk = await loadRazorpayScript();
        if (!scriptOk) throw new Error("Payment SDK failed to load");

        await new Promise<void>((resolve, reject) => {
          const rz = new window.Razorpay!({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            order_id: order.orderId,
            name: "SanatanTools",
            description: order.planName,
            prefill: {
              email: user.email ?? "",
              name: (user.user_metadata?.display_name as string | undefined) ?? "",
            },
            theme: { color: "#E8802A" },
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                const result = await verify({
                  data: { provider: "razorpay", ...response },
                });
                toast.success("Payment successful — thank you!");
                if (result.downloadUrl) {
                  window.open(result.downloadUrl, "_blank", "noopener");
                } else {
                  navigate({ to: "/dashboard" });
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () => reject(new Error("Payment cancelled")),
            },
          });
          rz.open();
        });
      } else if (order.provider === "lemonsqueezy" || order.provider === "phonepe") {
        // Redirect the user to PhonePe or Lemon Squeezy's hosted checkout.
        window.location.href = order.checkoutUrl;
        // Return without resolving so the button stays in "opening…" state
        // until navigation happens.
        await new Promise(() => {});
      } else {
        throw new Error(
          `Checkout for ${(order as { provider: string }).provider} is not wired yet.`,
        );
      }
    },
    onError: (err: Error) => {
      if (err.message !== "Payment cancelled" && err.message !== "Please sign in to continue") {
        toast.error(err.message);
      }
    },
    onSettled: () => setBuyingId(null),
  });

  const handleBuy = (plan: Plan) => {
    setBuyingId(plan.id);
    checkoutMutation.mutate(plan);
  };

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  const intervalLabel = (plan: Plan) => {
    if (plan.product_type === "one_time") return " one-time";
    if (plan.interval === "year") return "/year";
    return "/month";
  };

  return (
    <SiteLayout>
      <div className="container-page py-10 md:py-14">
        <SectionHeading
          as="h1"
          eyebrow="Pricing"
          title="Choose a plan that fits you"
          description="Subscribe monthly or yearly for unlimited access to premium tools, AI-powered Kundli reports and advanced Panchang."
        />

        {/* Gateway picker — only shows when more than one is enabled */}
        {gateways && gateways.length > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Pay with:</span>
            {gateways.map((g: Gateway) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGatewayId(g.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                  activeGatewayId === g.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                {g.display_name}
                {g.mode === "test" && (
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                    test
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="py-16">
            <SanatanLoader />
          </div>
        ) : !plans || plans.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
            No plans have been published yet. Please check back soon.
            {isAdmin && (
              <Button
                className="mt-4"
                onClick={() => { setEditingPlan({}); setEditOpen(true); }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Plan
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const features = Array.isArray(plan.features) ? (plan.features as string[]) : [];
              const isOneTime = plan.product_type === "one_time";
              const cta = plan.cta_label || (isOneTime ? "Buy & Download" : "Subscribe");
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col rounded-3xl border p-7 shadow-card transition-all",
                    plan.featured
                      ? "border-primary/50 bg-gradient-to-b from-primary-soft/60 to-card shadow-glow"
                      : "border-border bg-card hover:border-primary/30",
                  )}
                >
                  {plan.featured && (
                    <Badge className="absolute -top-2.5 left-6 bg-gradient-brand text-primary-foreground border-0 shadow-glow">
                      Most Popular
                    </Badge>
                  )}
                  {isOneTime && (
                    <Badge variant="secondary" className="absolute -top-2.5 right-6">
                      One-time
                    </Badge>
                  )}

                  {/* Admin controls — only visible to staff */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-1 z-10">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 opacity-80 hover:opacity-100"
                        title="Edit plan"
                        onClick={() => { setEditingPlan(plan as unknown as Record<string, unknown>); setEditOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7 opacity-80 hover:opacity-100"
                        title="Delete plan"
                        onClick={() => {
                          if (confirm(`"${plan.name}" ko delete karna chahte hain?`))
                            deletePlanMut.mutate(plan.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  <div>
                    <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description ||
                        (isOneTime
                          ? "One-time payment — instant download"
                          : "Recurring subscription")}
                    </p>
                  </div>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold tracking-tight">
                      {formatPrice(plan.price_cents, plan.currency)}
                    </span>
                    <span className="text-sm text-muted-foreground">{intervalLabel(plan)}</span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn("mt-7", plan.featured && "shadow-glow")}
                    variant={plan.featured ? "default" : "outline"}
                    disabled={buyingId === plan.id || !activeGateway}
                    onClick={() => handleBuy(plan)}
                  >
                    {buyingId === plan.id
                      ? "Opening checkout…"
                      : !activeGateway
                        ? "Payments coming soon"
                        : cta}
                  </Button>
                </div>
              );
            })}

            {/* Admin: Add new plan card */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => { setEditingPlan({}); setEditOpen(true); }}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary/30 p-7 text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors min-h-[200px]"
              >
                <Plus className="h-8 w-8" />
                <span className="font-medium">Add New Plan</span>
              </button>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Secure payments — UPI, cards, wallets and net-banking accepted. By purchasing you agree to
          our{" "}
          <a className="underline" href="/legal/terms-and-conditions">
            Terms
          </a>{" "}
          and{" "}
          <a className="underline" href="/legal/refund-policy">
            Refund Policy
          </a>
          .
        </p>
      </div>

      {/* Admin Plan Editor Dialog */}
      {isAdmin && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan?.id ? "✏️ Plan Edit Karein" : "➕ Naya Plan Add Karein"}
              </DialogTitle>
            </DialogHeader>
            <PlanEditorForm
              plan={editingPlan ?? {}}
              saving={savePlanMut.isPending}
              onSave={(values) => savePlanMut.mutate(values)}
              onCancel={() => { setEditOpen(false); setEditingPlan(null); }}
            />
          </DialogContent>
        </Dialog>
      )}
    </SiteLayout>
  );
}

// ── Admin Plan Editor Form ────────────────────────────────────────────────────

function PlanEditorForm({
  plan,
  saving,
  onSave,
  onCancel,
}: {
  plan: Record<string, unknown>;
  saving: boolean;
  onSave: (v: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(String(plan.name ?? ""));
  const [slug, setSlug] = useState(String(plan.slug ?? ""));
  const [description, setDescription] = useState(String(plan.description ?? ""));
  const [priceCents, setPriceCents] = useState(String(plan.price_cents ?? ""));
  const [currency, setCurrency] = useState(String(plan.currency ?? "INR"));
  const [interval, setInterval] = useState(String(plan.interval ?? "month"));
  const [productType, setProductType] = useState(String(plan.product_type ?? "subscription"));
  const [features, setFeatures] = useState(
    Array.isArray(plan.features) ? (plan.features as string[]).join("\n") : "",
  );
  const [ctaLabel, setCtaLabel] = useState(String(plan.cta_label ?? ""));
  const [downloadUrl, setDownloadUrl] = useState(String(plan.download_url ?? ""));
  const [entitlementKey, setEntitlementKey] = useState(String(plan.entitlement_key ?? ""));
  const [featured, setFeatured] = useState(!!plan.featured);
  const [active, setActive] = useState(plan.active !== false);
  const [sortOrder, setSortOrder] = useState(String(plan.sort_order ?? "0"));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const featureArr = features
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const values: Record<string, unknown> = {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || null,
      price_cents: Math.round(Number(priceCents)) || 0,
      currency: currency.trim() || "INR",
      interval: productType === "one_time" ? "one_time" : interval,
      product_type: productType,
      features: featureArr,
      cta_label: ctaLabel.trim() || null,
      download_url: downloadUrl.trim() || null,
      entitlement_key: entitlementKey.trim() || null,
      featured,
      active,
      sort_order: Number(sortOrder) || 0,
    };
    if (plan.id) values.id = plan.id;
    onSave(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Plan Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Premium Monthly" required />
        </div>
        <div>
          <Label className="text-xs">Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
        </div>
      </div>

      <div>
        <Label className="text-xs">Short Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sab kuch unlimited..." />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Price (Paise/Cents) *</Label>
          <Input type="number" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} placeholder="49900" required />
          <p className="text-[10px] text-muted-foreground mt-0.5">₹499 = 49900 paise</p>
        </div>
        <div>
          <Label className="text-xs">Currency</Label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="INR" />
        </div>
        <div>
          <Label className="text-xs">Sort Order</Label>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Product Type</Label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="subscription">Subscription</option>
            <option value="one_time">One-time</option>
          </select>
        </div>
        {productType === "subscription" && (
          <div>
            <Label className="text-xs">Interval</Label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <Label className="text-xs">Features (ek line mein ek feature)</Label>
        <Textarea
          rows={4}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder={"Unlimited AI Kundli Reports\nAdvanced Panchang\nPriority Support"}
          className="text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">CTA Button Label</Label>
          <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Subscribe Now" />
        </div>
        <div>
          <Label className="text-xs">Entitlement Key</Label>
          <Input value={entitlementKey} onChange={(e) => setEntitlementKey(e.target.value)} placeholder="premium_monthly" />
        </div>
      </div>

      {productType === "one_time" && (
        <div>
          <Label className="text-xs">Download URL (one-time ke liye)</Label>
          <Input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." />
        </div>
      )}

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Switch checked={featured} onCheckedChange={setFeatured} />
          Featured (Most Popular)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Switch checked={active} onCheckedChange={setActive} />
          Active (visible)
        </label>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="mr-1 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : plan.id ? "💾 Update Plan" : "✅ Create Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
