import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "legal_contact_messages",
  keyColumn: "id",
  title: "Contact Inbox",
  description: "Messages submitted via the Contact Us form.",
  searchColumn: "email",
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "text" },
    {
      name: "topic",
      label: "Topic",
      type: "select",
      options: [
        "support",
        "bug",
        "feature",
        "partnership",
        "media",
        "business",
        "general",
        "privacy",
        "copyright",
      ],
    },
    { name: "subject", label: "Subject", type: "text" },
    { name: "message", label: "Message", type: "textarea" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["new", "read", "replied", "spam"],
    },
    { name: "page_url", label: "Page URL", type: "text", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/legal-inbox")({
  component: () => <CrudTable config={config} />,
  head: () => ({
    meta: [{ title: "Admin — Contact Inbox" }, { name: "robots", content: "noindex" }],
  }),
});
