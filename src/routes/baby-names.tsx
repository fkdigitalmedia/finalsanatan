import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

const cat = getCategory("baby-names")!;

export const Route = createFileRoute("/baby-names")({
  head: () => ({
    meta: [
      { title: `${cat.title} — SanatanTools` },
      { name: "description", content: cat.description },
      { property: "og:title", content: `${cat.title} — SanatanTools` },
      { property: "og:description", content: cat.description },
      { property: "og:url", content: "/baby-names" },
    ],
    links: [{ rel: "canonical", href: "/baby-names" }],
  }),
  component: () => <CategoryPage category={cat} />,
});
