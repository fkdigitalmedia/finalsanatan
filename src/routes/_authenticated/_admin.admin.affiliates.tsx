import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "affiliate_links",
  keyColumn: "id",
  title: "Affiliate Links",
  description: "Products, links and click/conversion tracking. Amazon integration comes later.",
  searchColumn: "product",
  fields: [
    { name: "product", label: "Product", type: "text", required: true },
    { name: "url", label: "Affiliate URL", type: "text", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "network", label: "Network", type: "text" },
    { name: "active", label: "Active", type: "boolean" },
    { name: "clicks", label: "Clicks", type: "number" },
    { name: "conversions", label: "Conversions", type: "number" },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/affiliates")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — Affiliates" }, { name: "robots", content: "noindex" }] }),
});
