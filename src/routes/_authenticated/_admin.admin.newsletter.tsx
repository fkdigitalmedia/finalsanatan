import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "newsletter_subscribers",
  keyColumn: "id",
  title: "Newsletter Subscribers",
  searchColumn: "email",
  fields: [
    { name: "email", label: "Email", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["active", "unsubscribed", "bounced"],
    },
    { name: "source", label: "Source", type: "text" },
    { name: "confirmed_at", label: "Confirmed at", type: "datetime", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/newsletter")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — Newsletter" }, { name: "robots", content: "noindex" }] }),
});
