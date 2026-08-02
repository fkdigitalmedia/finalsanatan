import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "admin_articles",
  keyColumn: "id",
  title: "Articles",
  description: "Blog posts, spiritual guides, festival explainers.",
  searchColumn: "title",
  order: "updated_at",
  fields: [
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "diwali-history" },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "content_md", label: "Content (Markdown)", type: "textarea", hideInTable: true },
    { name: "category", label: "Category", type: "text" },
    { name: "tags", label: "Tags", type: "array" },
    { name: "featured_image", label: "Featured image URL", type: "text", hideInTable: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["draft", "scheduled", "published"],
      required: true,
    },
    { name: "published_at", label: "Publish at", type: "datetime" },
    { name: "lang", label: "Language", type: "text" },
    { name: "seo", label: "SEO (JSON)", type: "json", hideInTable: true },
    { name: "schema_json", label: "Schema.org JSON-LD", type: "json", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/articles")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — Articles" }, { name: "robots", content: "noindex" }] }),
});
