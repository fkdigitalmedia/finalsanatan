import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("puja")!;

export const Route = createFileRoute("/puja")({
  head: () =>
    seoHead({
      type: "category",
      path: "/puja",
      slug: "puja",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "puja",
    }),
  component: () => <CategoryPage category={cat} />,
});
