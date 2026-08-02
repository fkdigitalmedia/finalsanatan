import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

const cat = getCategory("panchang")!;

export const Route = createFileRoute("/panchang")({
  head: () => ({
    meta: [
      { title: `${cat.title} — SanatanTools` },
      { name: "description", content: cat.description },
      { property: "og:title", content: `${cat.title} — SanatanTools` },
      { property: "og:description", content: cat.description },
      { property: "og:url", content: "/panchang" },
    ],
    links: [{ rel: "canonical", href: "/panchang" }],
  }),
  component: () => <CategoryPage category={cat} />,
});
