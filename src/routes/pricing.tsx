/**
 * Public /pricing page — reads active plans + active payment gateways and
 * lets a signed-in user pay. Gateways come from the payment_gateways table
 * (admin-managed). Currently Razorpay is wired end-to-end; the picker also
 * shows other saved providers but only Razorpay opens a live checkout.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Premium Monthly & Annual Plans | SanatanTools" },
      {
        name: "description",
        content:
          "Choose a monthly or annual premium subscription for unlimited access to AI-powered Kundli, advanced Panchang and all premium Sanatan tools. Secure payments via multiple gateways.",
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
  const listPlans = useServerFn(listPublicPlans);
  const listGateways = useServerFn(listPublicGateways);
  const createOrder = useServerFn(createPaymentOrder);
  const verify = useServerFn(verifyPayment);

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
      } else if (order.provider === "lemonsqueezy") {
        // Redirect the user to Lemon Squeezy's hosted checkout (USD).
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
    </SiteLayout>
  );
}
