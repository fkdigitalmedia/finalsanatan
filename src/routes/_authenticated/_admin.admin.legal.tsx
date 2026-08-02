import { createFileRoute, Link } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

const config: CrudConfig = {
  table: "legal_pages",
  keyColumn: "id",
  title: "Legal Pages",
  description: "Privacy, Terms, Disclaimers, and other legal documents.",
  searchColumn: "title",
  order: "sort_order",
  fields: [
    { name: "slug", label: "Slug", type: "text", required: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: ["privacy", "terms", "disclaimer", "policy", "company", "future"],
    },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "subtitle", label: "Subtitle", type: "text", hideInTable: true },
    { name: "summary", label: "Summary", type: "textarea", hideInTable: true },
    { name: "body_md", label: "Body (Markdown)", type: "textarea", hideInTable: true },
    { name: "seo_title", label: "SEO Title", type: "text", hideInTable: true },
    { name: "seo_description", label: "SEO Description", type: "textarea", hideInTable: true },
    { name: "seo_keywords", label: "SEO Keywords", type: "text", hideInTable: true },
    { name: "og_image", label: "OG Image URL", type: "text", hideInTable: true },
    { name: "schema_type", label: "Schema Type", type: "text", hideInTable: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["draft", "scheduled", "published", "archived"],
    },
    { name: "effective_date", label: "Effective Date", type: "datetime", hideInTable: true },
    { name: "scheduled_at", label: "Scheduled At", type: "datetime", hideInTable: true },
    { name: "sort_order", label: "Order", type: "number" },
    { name: "is_system", label: "System", type: "boolean", hideInTable: true },
    { name: "version", label: "Version", type: "number", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/legal")({
  component: () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link to={"/admin/legal-inbox" as never}>
            <History className="mr-1 h-4 w-4" /> Contact inbox
          </Link>
        </Button>
      </div>
      <CrudTable config={config} />
    </div>
  ),
  head: () => ({
    meta: [{ title: "Admin — Legal Pages" }, { name: "robots", content: "noindex" }],
  }),
});
