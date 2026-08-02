import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "email_templates",
  keyColumn: "id",
  title: "Email Templates",
  description: "Reusable HTML templates for broadcasts, automation and transactional emails.",
  searchColumn: "name",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "body_html", label: "HTML body", type: "textarea", hideInTable: true },
    { name: "variables", label: "Variables (JSON)", type: "json", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/emails")({
  component: () => <CrudTable config={config} />,
  head: () => ({
    meta: [{ title: "Admin — Email Templates" }, { name: "robots", content: "noindex" }],
  }),
});
