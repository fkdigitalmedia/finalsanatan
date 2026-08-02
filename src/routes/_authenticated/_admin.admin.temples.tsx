import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "admin_temples",
  keyColumn: "id",
  title: "Temples",
  description: "Temple directory with location, photos, history and SEO.",
  searchColumn: "name",
  fields: [
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "state", label: "State", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "address", label: "Address", type: "text", hideInTable: true },
    { name: "lat", label: "Latitude", type: "number", hideInTable: true },
    { name: "lng", label: "Longitude", type: "number", hideInTable: true },
    { name: "photos", label: "Photos (URLs)", type: "array", hideInTable: true },
    { name: "history", label: "History", type: "textarea", hideInTable: true },
    { name: "opening_hours", label: "Opening hours (JSON)", type: "json", hideInTable: true },
    { name: "seo", label: "SEO (JSON)", type: "json", hideInTable: true },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/temples")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — Temples" }, { name: "robots", content: "noindex" }] }),
});
