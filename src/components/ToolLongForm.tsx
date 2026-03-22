import type { ToolConfig } from "@/data/types";
import { getToolLongFormCopy } from "@/lib/toolContent";

interface ToolLongFormProps {
  tool: ToolConfig;
}

export default function ToolLongForm({ tool }: ToolLongFormProps) {
  const copy = getToolLongFormCopy(tool);

  return (
    <section className="space-y-6 rounded-2xl border bg-card p-6" aria-labelledby="tool-guide">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Tool guide
        </p>
        <h2 id="tool-guide" className="text-2xl font-semibold text-foreground">
          {tool.name} overview, use cases, and benefits
        </h2>
        <p className="text-sm text-muted-foreground">
          Read this quick guide to understand what the tool does, when to use it, and how to get the most from each run.
        </p>
      </header>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">What this tool does</h3>
        {copy.whatItDoes.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="leading-7 text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">When to use it</h3>
        <p className="leading-7 text-muted-foreground">{copy.whenToUseIntro}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {copy.whenToUseBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Example usage</h3>
        <p className="leading-7 text-muted-foreground">{copy.exampleUsage}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Benefits</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {copy.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
