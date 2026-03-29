import type { ReactNode } from "react";
import Card from "./ui/Card";

interface ContentSectionProps {
  title: string;
  children: ReactNode;
}

function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <Card>
      <header>
        <h2 className="text-lg font-semibold text-[var(--text-strong)]">{title}</h2>
      </header>
      <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--text-body)]">{children}</div>
    </Card>
  );
}

export default ContentSection;
