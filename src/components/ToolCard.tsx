import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { ToolConfig } from "@/data/types";
import { categories } from "@/data/categories";
import { getToolPath } from "@/lib/toolSeo";

interface Props {
  tool: ToolConfig;
}

export default function ToolCard({ tool }: Props) {
  const categoryName = categories.find((category) => category.slug === tool.category)?.name ?? tool.category;

  return (
    <Link to={getToolPath(tool)} aria-label={`Open ${tool.name}`}>
      <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">{tool.name}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
          <Badge variant="secondary" className="text-xs">{categoryName}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
