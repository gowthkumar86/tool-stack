import type { ExtractedEntity, GroupedEntities } from "../types";

interface ResultsDisplayProps {
  mode: "use-case" | "custom";
  groupedEntities?: GroupedEntities;
  entities: ExtractedEntity[];
}

interface GroupedEntitySection {
  key: string;
  values: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractGroupedValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    const rows = value.flatMap((item) => extractGroupedValues(item));
    return rows.filter(Boolean);
  }

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }

  if (isRecord(value)) {
    if (typeof value.text === "string" && value.text.trim()) {
      return [value.text.trim()];
    }

    const inlineValue =
      (typeof value.value === "string" && value.value.trim() && value.value.trim())
      || (typeof value.name === "string" && value.name.trim() && value.name.trim());

    if (inlineValue) {
      return [inlineValue];
    }
  }

  return [];
}

function normalizeGroupedSections(groupedEntities: GroupedEntities | undefined): GroupedEntitySection[] {
  if (!groupedEntities) {
    return [];
  }

  return Object.entries(groupedEntities).map(([key, rawValue]) => ({
    key,
    values: Array.from(new Set(extractGroupedValues(rawValue))),
  }));
}

function renderEntityTable(entities: ExtractedEntity[]) {
  if (entities.length === 0) {
    return (
      <p className="rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-400">
        No entities extracted yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-700 bg-slate-900">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-slate-800/90 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-3 py-2 font-medium">Text</th>
            <th className="px-3 py-2 font-medium">Label</th>
            <th className="px-3 py-2 font-medium">Score</th>
            <th className="px-3 py-2 font-medium">Span</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((entity, index) => (
            <tr key={`${entity.text}-${entity.label}-${index}`} className="border-t border-slate-800">
              <td className="px-3 py-2 text-slate-100">{entity.text}</td>
              <td className="px-3 py-2">
                <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200">
                  {formatLabel(entity.label)}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-300">
                {typeof entity.score === "number" ? entity.score.toFixed(3) : "N/A"}
              </td>
              <td className="px-3 py-2 text-slate-400">
                {typeof entity.start === "number" && typeof entity.end === "number"
                  ? `${entity.start} - ${entity.end}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultsDisplay({ mode, groupedEntities, entities }: ResultsDisplayProps) {
  const groupedSections = normalizeGroupedSections(groupedEntities);

  return (
    <section className="space-y-4">
      {mode === "use-case" && (
        <section className="space-y-3">
          <header>
            <h3 className="text-sm font-semibold text-slate-100">Grouped Entities</h3>
            <p className="text-xs text-slate-400">Business-friendly output grouped by label.</p>
          </header>

          {groupedSections.length === 0 ? (
            <p className="rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-400">
              No grouped entities returned.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {groupedSections.map((section) => (
                <article key={section.key} className="rounded-md border border-slate-700 bg-slate-900 p-3">
                  <h4 className="text-sm font-semibold text-slate-100">{formatLabel(section.key)}</h4>
                  <p className="mt-1 text-xs text-slate-400">{section.values.length} value(s)</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {section.values.length === 0 && <li className="text-slate-400">No values available.</li>}
                    {section.values.map((value) => (
                      <li key={`${section.key}-${value}`} className="rounded bg-slate-800 px-2 py-1">
                        {value}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-3">
        <header>
          <h3 className="text-sm font-semibold text-slate-100">
            {mode === "use-case" ? "Raw Entities (Debug)" : "Extracted Entities"}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === "use-case"
              ? "Direct model output for debugging and QA."
              : "Entity list from your custom labels."}
          </p>
        </header>
        {renderEntityTable(entities)}
      </section>
    </section>
  );
}
