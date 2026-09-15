import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("baby-names")!;

export const Route = createFileRoute("/baby-names")({
  head: () =>
    seoHead({
      type: "category",
      path: "/baby-names",
      slug: "baby-names",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "baby-names",
    }),
  component: () => <CategoryPage category={cat} />,
});
