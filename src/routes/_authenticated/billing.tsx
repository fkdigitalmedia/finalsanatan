import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ShieldCheck, Receipt } from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/billing")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Billing — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: BillingPage,
});

function money(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

function BillingPage() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["ws", "billing", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [orders, entitlements, plans] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .eq("user_id", uid!)
          .order("created_at", { ascending: false })
          .limit(25),
        supabase.from("user_entitlements").select("*").eq("user_id", uid!).eq("active", true),
        supabase.from("subscription_plans").select("*").eq("active", true).order("sort_order"),
      ]);
      return {
        orders: orders.data ?? [],
        entitlements: entitlements.data ?? [],
        plans: plans.data ?? [],
      };
    },
  });

  const active = data?.entitlements?.[0];
  const renewal = active?.expires_at ? new Date(active.expires_at).toLocaleDateString() : "—";

  return (
    <DashboardShell
      title="Billing"
      description="Subscription, invoices, payment history and plan upgrades."
    >
      {isLoading ? (
        <SkeletonGrid rows={2} />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-5 bg-gradient-brand text-primary-foreground border-transparent">
              <ShieldCheck className="size-5" />
              <p className="mt-3 text-xs uppercase tracking-widest text-primary-foreground/80">
                Current plan
              </p>
              <p className="mt-1 font-display text-2xl font-semibold capitalize">
                {active ? active.entitlement_key.replace(/[-_]/g, " ") : "Free"}
              </p>
            </Card>
            <Card className="p-5">
              <CreditCard className="size-5 text-accent" />
              <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                Renews on
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">{renewal}</p>
            </Card>
            <Card className="p-5">
              <Receipt className="size-5 text-accent" />
              <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                Payments
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">{data?.orders.length ?? 0}</p>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/pricing">
              <Button>Upgrade plan</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline">Apply coupon</Button>
            </Link>
          </div>

          <h2 className="mt-10 font-display text-xl font-semibold">Payment history</h2>
          {!data?.orders.length ? (
            <div className="mt-4">
              <EmptyState
                title="No payments yet"
                hint="Your invoices and receipts will appear here after your first purchase."
              />
            </div>
          ) : (
            <Card className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Your payment history</caption>
                <thead className="bg-secondary/60 text-left">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Provider
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.orders.map((o) => (
                    <tr key={o.id}>
                      <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium">{money(o.amount_cents, o.currency)}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{o.provider}</td>
                      <td className="px-4 py-3 capitalize">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
