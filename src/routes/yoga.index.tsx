/** Phase 14.7 — programmatic landing index for yoga. Generated from the registry. */
import { createFileRoute, notFound } from "@tanstack/react-router";
import { EntityIndexPage } from "@/components/seo/EntityLanding";
import { ENTITY_FAMILIES } from "@/config/seo-entities";
import { seoHead } from "@/lib/seo/engine";

const FAMILY = ENTITY_FAMILIES.yoga;

export const Route = createFileRoute("/yoga/")({
  head: () =>
    seoHead({
      type: "landing",
      path: "/yoga",
      title: FAMILY.label,
      description: FAMILY.intro,
      items: FAMILY.items.map((i) => ({ name: i.title, path: `/yoga/${i.slug}` })),
      skipSiteSchema: true,
    }),
  component: Page,
});

function Page() {
  if (!FAMILY) throw notFound();
  return (
    <EntityIndexPage
      familyLabel={FAMILY.label}
      familyBase={FAMILY.base}
      intro={FAMILY.intro}
      items={FAMILY.items}
    />
  );
}
