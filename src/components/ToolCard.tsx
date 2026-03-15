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
      <Card className="group h-full cursor-pointer rounded-2xl border-border/80 transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">{tool.name}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{tool.description}</p>
          <Badge variant="secondary" className="text-xs">{categoryName}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
