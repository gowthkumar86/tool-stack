import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { ToolConfig } from "@/data/types";

interface Props {
  tool: ToolConfig;
}

export default function ToolCard({ tool }: Props) {
  return (
    <Link to={`/tools/${tool.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">{tool.name}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
          <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
