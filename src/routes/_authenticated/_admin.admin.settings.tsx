import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";
import { WebsiteSections } from "@/components/admin/WebsiteSections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rawConfig: CrudConfig = {
  table: "site_settings",
  keyColumn: "key",
  title: "All Settings (raw JSON)",
  description:
    "Advanced: every key/value stored in site_settings. Use the Website Sections tab for common fields.",
  searchColumn: "key",
  order: "updated_at",
  fields: [
    { name: "key", label: "Key", type: "text", required: true, placeholder: "brand.name" },
    { name: "value", label: "Value (JSON)", type: "json", required: true },
    { name: "is_public", label: "Public", type: "boolean" },
  ],
};

function SettingsPage() {
  return (
    <Tabs defaultValue="sections" className="space-y-6">
      <TabsList>
        <TabsTrigger value="sections">Website Sections</TabsTrigger>
        <TabsTrigger value="raw">Advanced (raw)</TabsTrigger>
      </TabsList>
      <TabsContent value="sections" className="mt-0">
        <WebsiteSections />
      </TabsContent>
      <TabsContent value="raw" className="mt-0">
        <CrudTable config={rawConfig} />
      </TabsContent>
    </Tabs>
  );
}

export const Route = createFileRoute("/_authenticated/_admin/admin/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Admin — Settings" }, { name: "robots", content: "noindex" }] }),
});
