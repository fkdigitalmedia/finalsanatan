/**
 * Admin Monetization & Enterprise Credit Console Page
 */
import { createFileRoute } from "@tanstack/react-router";
import { AdminBillingDashboard } from "@/components/monetization/AdminBillingDashboard";

export const Route = createFileRoute("/_authenticated/_admin/admin/monetization")({
  component: MonetizationPage,
  head: () => ({
    meta: [
      { title: "Admin — Enterprise Credit Console & Monetization" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function MonetizationPage() {
  return (
    <div className="p-2 md:p-6 space-y-6">
      <AdminBillingDashboard />
    </div>
  );
}
