import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("mantras")!;

export const Route = createFileRoute("/mantras")({
  head: () =>
    seoHead({
      type: "category",
      path: "/mantras",
      slug: "mantras",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "mantras",
    }),
  component: () => <CategoryPage category={cat} />,
});
