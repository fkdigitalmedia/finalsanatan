/** Phase 14.7 — programmatic landing page for a single yoga. */
import { createFileRoute, notFound } from "@tanstack/react-router";
import { EntityDetailPage } from "@/components/seo/EntityLanding";
import { ENTITY_FAMILIES, findEntity } from "@/config/seo-entities";
import { seoHead } from "@/lib/seo/engine";
import { buildSeo } from "@/lib/seo/engine";

const FAMILY = ENTITY_FAMILIES.yoga;

function descriptor(slug: string) {
  const entity = findEntity("yoga", slug);
  return {
    entity,
    seo: entity
      ? {
          type: "landing" as const,
          path: `/yoga/${entity.slug}`,
          slug: entity.slug,
          title: entity.title,
          description: entity.summary,
          skipSiteSchema: true,
        }
      : null,
  };
}

export const Route = createFileRoute("/yoga/$slug")({
  head: ({ params }) => {
    const { seo } = descriptor(params.slug);
    if (!seo) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    return seoHead(seo);
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { entity, seo } = descriptor(slug);
  if (!entity || !seo) throw notFound();
  const built = buildSeo(seo);
  return (
    <EntityDetailPage
      entity={entity}
      familyLabel={FAMILY.label}
      familyBase={FAMILY.base}
      links={built.links}
      faqs={built.faqs}
      siblings={FAMILY.items}
    />
  );
}
