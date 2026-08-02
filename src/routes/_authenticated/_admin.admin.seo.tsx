import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const redirectsConfig: CrudConfig = {
  table: "redirects",
  keyColumn: "id",
  title: "Redirects",
  description: "301/302 URL redirects for SEO migrations.",
  searchColumn: "from_path",
  fields: [
    { name: "from_path", label: "From path", type: "text", required: true, placeholder: "/old" },
    { name: "to_path", label: "To path", type: "text", required: true, placeholder: "/new" },
    { name: "code", label: "HTTP code", type: "select", options: ["301", "302", "307", "308"] },
    { name: "enabled", label: "Enabled", type: "boolean" },
  ],
};

const seoConfig: CrudConfig = {
  table: "site_settings",
  keyColumn: "key",
  title: "SEO Settings",
  description:
    "Meta defaults, robots directives, Search Console verification, OG defaults, structured data.",
  searchColumn: "key",
  fields: [
    {
      name: "key",
      label: "Setting key",
      type: "text",
      required: true,
      placeholder: "seo.default_title",
    },
    { name: "value", label: "Value (JSON)", type: "json", required: true },
    { name: "is_public", label: "Public (readable by anon)", type: "boolean" },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/seo")({
  component: SeoPage,
  head: () => ({ meta: [{ title: "Admin — SEO" }, { name: "robots", content: "noindex" }] }),
});

function SeoPage() {
  return (
    <div className="space-y-10">
      <CrudTable config={seoConfig} />
      <CrudTable config={redirectsConfig} />
    </div>
  );
}
