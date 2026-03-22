import { categories } from "@/data/categories";

export function getCategoryPath(slug: string) {
  const category = categories.find((item) => item.slug === slug);
  if (category?.path) {
    return category.path;
  }
  return `/category/${slug}`;
}
