import { getToolBySlug, getToolsByCategory } from "@/data/tools";
import { ToolConfig } from "@/data/types";
import ToolCard from "./ToolCard";

interface Props {
  tool: ToolConfig;
}

export default function RelatedTools({ tool }: Props) {
  const explicitRelated = (tool.related ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((relatedTool): relatedTool is ToolConfig => Boolean(relatedTool));

  const fallbackRelated = getToolsByCategory(tool.category).filter((candidate) => candidate.slug !== tool.slug);
  const related = [...explicitRelated, ...fallbackRelated]
    .filter((candidate, index, list) => list.findIndex((item) => item.slug === candidate.slug) === index)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <aside className="space-y-3" aria-label="Related tools">
      <h2 className="text-lg font-semibold text-foreground">Related tools</h2>
      <p className="text-sm text-muted-foreground">
        Explore more free online tools that pair well with {tool.name.toLowerCase()} workflows.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </aside>
  );
}
