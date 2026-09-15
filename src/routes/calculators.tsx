import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("calculators")!;

export const Route = createFileRoute("/calculators")({
  head: () =>
    seoHead({
      type: "category",
      path: "/calculators",
      slug: "calculators",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "calculators",
    }),
  component: () => <CategoryPage category={cat} />,
});
