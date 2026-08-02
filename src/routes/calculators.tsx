import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

const cat = getCategory("calculators")!;

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: `${cat.title} — SanatanTools` },
      { name: "description", content: cat.description },
      { property: "og:title", content: `${cat.title} — SanatanTools` },
      { property: "og:description", content: cat.description },
      { property: "og:url", content: "/calculators" },
    ],
    links: [{ rel: "canonical", href: "/calculators" }],
  }),
  component: () => <CategoryPage category={cat} />,
});
