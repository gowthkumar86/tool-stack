import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { categories } from "@/data/categories";
import { allTools } from "@/data/tools";
import { Link } from "react-router-dom";
import { getToolPath } from "@/lib/toolSeo";

export default function ToolSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allTools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools... (e.g. JSON, percentage, BMI)"
          className="h-12 pl-10 text-base"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((tool) => (
            <Link
              key={tool.slug}
              to={getToolPath(tool)}
              onClick={() => setQuery("")}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{tool.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categories.find((category) => category.slug === tool.category)?.name ?? tool.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
