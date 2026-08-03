import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "newsletter_subscribers",
  keyColumn: "id",
  title: "Newsletter Subscribers",
  description: "View, search, add and manage all subscribers registered for the weekly newsletter.",
  searchColumn: "email",
  order: "created_at",
  fields: [
    { name: "email", label: "Email Address", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["active", "unsubscribed", "bounced"],
    },
    { name: "source", label: "Source / Form", type: "text" },
    { name: "created_at", label: "Subscribed At", type: "datetime" },
    { name: "confirmed_at", label: "Confirmed at", type: "datetime", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/newsletter")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — Newsletter" }, { name: "robots", content: "noindex" }] }),
});
