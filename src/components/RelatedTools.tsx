import { getToolsByCategory } from "@/data/tools";
import { ToolConfig } from "@/data/types";
import ToolCard from "./ToolCard";

interface Props {
  tool: ToolConfig;
}

export default function RelatedTools({ tool }: Props) {
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
