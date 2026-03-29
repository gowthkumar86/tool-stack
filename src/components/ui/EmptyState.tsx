import type { ReactNode } from "react";
import Card from "./Card";

interface EmptyStateProps {
  title: string;
  description: ReactNode;
  className?: string;
}

function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <Card className={className}>
      <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-subtle)]">{description}</p>
    </Card>
  );
}

export default EmptyState;
