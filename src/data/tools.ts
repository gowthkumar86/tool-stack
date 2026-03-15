import { financeTools } from "./tools/finance.ts";
import { developerTools } from "./tools/developer.ts";
import { textTools } from "./tools/text.ts";
import { converterTools } from "./tools/converters.ts";
import { healthTools } from "./tools/health.ts";
import { dateTools } from "./tools/date.ts";

export type { ToolConfig, ToolInput } from "./types";

export const allTools = [
  ...financeTools,
  ...developerTools,
  ...textTools,
  ...converterTools,
  ...healthTools,
  ...dateTools,
];

export function getToolBySlug(slug: string) {
  return allTools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string) {
  return allTools.filter((t) => t.category === categorySlug);
}

export function getFeaturedTools() {
  return allTools.filter((t) => t.featured);
}

export function searchTools(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(q))
  );
}
