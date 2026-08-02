/**
 * KundliPaywallDialog — shown when a non-premium user clicks "Download PDF".
 * Reuses the same Razorpay / Lemon Squeezy checkout flow as /pricing, but
 * scoped to the `kundli-premium-report` (INR) or `kundli-premium-report-usd`
 * (global) plans. On successful payment we invalidate entitlements and
 * invoke onUnlocked() so the caller can immediately re-run the download
 * with narratives included.
 */
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/I18nProvider";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { listPublicPlans } from "@/lib/razorpay.functions";
import { listPublicGateways, createPaymentOrder, verifyPayment } from "@/lib/payments.functions";

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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFreeDownload: () => void;
  onUnlocked: () => void;
};

export function KundliPaywallDialog({ open, onOpenChange, onFreeDownload, onUnlocked }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const listPlans = useServerFn(listPublicPlans);
  const listGateways = useServerFn(listPublicGateways);
  const createOrder = useServerFn(createPaymentOrder);
  const verify = useServerFn(verifyPayment);

  const plansQ = useQuery({
    queryKey: ["public-plans"],
    queryFn: () => listPlans(),
    enabled: open,
  });
  const gatewaysQ = useQuery({
    queryKey: ["public-gateways"],
    queryFn: () => listGateways(),
    enabled: open,
  });

  // Prefer INR plan for Indian users, USD elsewhere.
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

  const plan = useMemo(() => {
    const plans = plansQ.data ?? [];
    const inr = plans.find((p) => p.slug === "kundli-premium-report");
    const usd = plans.find((p) => p.slug === "kundli-premium-report-usd");
    return isLikelyIndia ? (inr ?? usd) : (usd ?? inr);
  }, [plansQ.data, isLikelyIndia]);

  const gateway = useMemo(() => {
    const gs = gatewaysQ.data ?? [];
    if (!plan) return null;
    if (plan.currency === "INR") {
      return gs.find((g) => g.provider === "razorpay") ?? gs[0] ?? null;
    }
    return gs.find((g) => g.provider === "lemonsqueezy") ?? gs[0] ?? null;
  }, [gatewaysQ.data, plan]);

  const [busy, setBusy] = useState(false);

  const pay = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate({ to: "/auth", search: { redirect: "/kundli" } as never });
        throw new Error("Please sign in to continue");
      }
      if (!plan) throw new Error("Premium plan is not configured");
      if (!gateway) throw new Error("No payment gateway is enabled yet");

      const order = await createOrder({
        data: {
          planId: plan.id,
          gatewayId: gateway.id,
          customer: {
            email: user.email ?? undefined,
            name: user.user_metadata?.display_name as string | undefined,
          },
        },
      });

      if (order.provider === "razorpay") {
        const ok = await loadRazorpayScript();
        if (!ok) throw new Error("Payment SDK failed to load");
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
                await verify({ data: { provider: "razorpay", ...response } });
                resolve();
              } catch (e) {
                reject(e);
              }
            },
            modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
          });
          rz.open();
        });
      } else if (order.provider === "lemonsqueezy") {
        window.location.href = order.checkoutUrl;
        await new Promise(() => {});
      } else {
        throw new Error("This gateway is not wired for checkout yet");
      }
    },
    onSuccess: async () => {
      toast.success(t("kundli.paywall.payment_success"));
      await qc.invalidateQueries({ queryKey: ["my-entitlements"] });
      onOpenChange(false);
      onUnlocked();
    },
    onError: (err: Error) => {
      if (err.message !== "Payment cancelled" && err.message !== "Please sign in to continue") {
        const known: Record<string, string> = {
          "Premium plan is not configured": t("kundli.paywall.errors.plan_not_configured"),
          "No payment gateway is enabled yet": t("kundli.paywall.errors.no_gateway"),
          "Payment SDK failed to load": t("kundli.paywall.errors.sdk_failed"),
          "This gateway is not wired for checkout yet": t(
            "kundli.paywall.errors.gateway_not_wired",
          ),
        };
        toast.error(known[err.message] ?? err.message);
      }
    },
    onSettled: () => setBusy(false),
  });

  const priceLabel = plan
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: plan.currency || "INR",
        maximumFractionDigits: plan.currency === "INR" ? 0 : 2,
      }).format(plan.price_cents / 100)
    : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>{t("kundli.paywall.title")}</DialogTitle>
          </div>
          <DialogDescription>{t("kundli.paywall.description")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-2xl font-semibold">{priceLabel}</div>
              <div className="text-xs text-muted-foreground">
                {t("kundli.paywall.one_time_lifetime")}
              </div>
            </div>
            <Badge variant="secondary">{t("kundli.paywall.best_value")}</Badge>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            {[
              t("kundli.paywall.features.pdf"),
              t("kundli.paywall.features.ai"),
              t("kundli.paywall.features.remedies"),
              t("kundli.paywall.features.divisional_charts"),
              t("kundli.paywall.features.strength_tables"),
              t("kundli.paywall.features.languages"),
            ].map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              onFreeDownload();
            }}
          >
            {t("kundli.paywall.download_free")}
          </Button>
          <Button
            onClick={() => {
              setBusy(true);
              pay.mutate();
            }}
            disabled={busy || plansQ.isLoading || !plan || !gateway}
            className="min-w-[180px]"
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("kundli.paywall.opening_checkout")}
              </>
            ) : (
              <>{t("kundli.paywall.pay_and_unlock", { price: priceLabel })}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
