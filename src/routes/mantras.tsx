import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

const cat = getCategory("mantras")!;

export const Route = createFileRoute("/mantras")({
  head: () => ({
    meta: [
      { title: `${cat.title} — SanatanTools` },
      { name: "description", content: cat.description },
      { property: "og:title", content: `${cat.title} — SanatanTools` },
      { property: "og:description", content: cat.description },
      { property: "og:url", content: "/mantras" },
    ],
    links: [{ rel: "canonical", href: "/mantras" }],
  }),
  component: () => <CategoryPage category={cat} />,
});
