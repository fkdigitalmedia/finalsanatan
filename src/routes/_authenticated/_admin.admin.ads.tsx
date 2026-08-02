import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "admin_ads",
  keyColumn: "id",
  title: "Advertisements",
  description: "House ads across homepage, sidebar, tool, article and footer slots.",
  searchColumn: "name",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "slot",
      label: "Slot",
      type: "select",
      options: ["homepage", "sidebar", "tool", "article", "footer"],
      required: true,
    },
    { name: "html", label: "HTML (AdSense or custom)", type: "textarea", hideInTable: true },
    { name: "image_url", label: "Image URL", type: "text", hideInTable: true },
    { name: "target_url", label: "Target URL", type: "text", hideInTable: true },
    { name: "weight", label: "Rotation weight", type: "number" },
    { name: "enabled", label: "Enabled", type: "boolean" },
    { name: "starts_at", label: "Starts at", type: "datetime", hideInTable: true },
    { name: "ends_at", label: "Ends at", type: "datetime", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/ads")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — Ads" }, { name: "robots", content: "noindex" }] }),
});
