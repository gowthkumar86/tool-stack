import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Search
} from "lucide-react";

import { Badge } from "../../components/ui/badge.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { ScrollArea } from "../../components/ui/scroll-area.tsx";
import { cn } from "../../lib/utils.ts";
import type { ToolLogicResult } from "../../utils/toolLogic/shared.ts";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonViewerProps {
  result: ToolLogicResult;
}

interface MatchSummary {
  total: number;
  hasMatch: boolean;
}

interface MatchRecord {
  path: string;
  type: "key" | "value";
  preview: string;
}

export default function JsonViewer({ result }: JsonViewerProps) {
  const [query, setQuery] = useState("");
  const [expansionMode, setExpansionMode] = useState<"expand" | "collapse" | null>(
    null
  );
  const parsedJson = result.parsedJson as JsonValue | undefined;
  const trimmedQuery = query.trim().toLowerCase();
  const matches = useMemo(
    () => collectMatches(parsedJson, trimmedQuery),
    [parsedJson, trimmedQuery]
  );
  const matchSummary = useMemo(
    () => getMatchSummary(parsedJson, trimmedQuery),
    [parsedJson, trimmedQuery]
  );

  if (parsedJson === undefined) {
    return (
      <pre className="text-lg font-semibold whitespace-pre-wrap break-all font-sans">
        {String(result.formattedJson ?? "")}
      </pre>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search key or value"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpansionMode("expand")}
          >
            <ChevronsUpDown className="mr-2 h-4 w-4" />
            Expand all
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpansionMode("collapse")}
          >
            <ChevronsDownUp className="mr-2 h-4 w-4" />
            Collapse all
          </Button>

          <Badge variant="secondary" className="w-fit">
            {trimmedQuery
              ? `${matchSummary.total} match${matchSummary.total === 1 ? "" : "es"}`
              : "Tree view"}
          </Badge>
        </div>
      </div>

      {trimmedQuery && !matchSummary.hasMatch && (
        <p className="text-sm text-muted-foreground">
          No matching key or value found in this JSON.
        </p>
      )}

      {trimmedQuery && matchSummary.hasMatch && (
        <div className="rounded-xl border bg-muted/30 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
              Present
            </Badge>
            <span className="text-muted-foreground">
              Matching paths found for this key/value search.
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {matches.slice(0, 8).map((match) => (
              <div
                key={`${match.type}-${match.path}-${match.preview}`}
                className="rounded-lg border bg-background px-2.5 py-1.5 text-xs"
              >
                <span className="font-semibold text-foreground">{match.path}</span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{match.type}</span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-foreground">{match.preview}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="h-[420px] rounded-xl border bg-background/80">
        <div className="min-w-max p-4 font-mono text-sm">
          <JsonNode
            label="root"
            value={parsedJson}
            depth={0}
            query={trimmedQuery}
            path="root"
            expansionMode={expansionMode}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

interface JsonNodeProps {
  label: string;
  value: JsonValue;
  depth: number;
  query: string;
  path: string;
  expansionMode: "expand" | "collapse" | null;
}

function JsonNode({
  label,
  value,
  depth,
  query,
  path,
  expansionMode
}: JsonNodeProps) {
  const isArray = Array.isArray(value);
  const isObject = typeof value === "object" && value !== null && !isArray;
  const isBranch = isArray || isObject;
  const primitiveValue = isBranch
    ? null
    : (value as string | number | boolean | null);
  const childEntries = isBranch
    ? isArray
      ? value.map((item, index) => [String(index), item] as const)
      : Object.entries(value)
    : [];
  const matchSummary = getMatchSummary(value, query, label);
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const shouldExpand = query ? matchSummary.hasMatch : isExpanded;
  const nodeType = isArray ? "array" : isObject ? "object" : typeof value;

  useEffect(() => {
    if (expansionMode === "expand") {
      setIsExpanded(true);
    }

    if (expansionMode === "collapse") {
      setIsExpanded(depth < 1);
    }
  }, [depth, expansionMode]);

  return (
    <div className="relative">
      {depth > 0 && (
        <div
          className="pointer-events-none absolute bottom-0 top-0 w-px bg-border/70"
          style={{ left: depth * 20 + 16 }}
        />
      )}

      <div
        className={cn(
          "group relative flex min-h-8 items-start gap-2 rounded-xl border px-2 py-2 transition-colors",
          isBranch
            ? "bg-background hover:bg-muted/40"
            : "border-transparent hover:bg-muted/50",
          query && matchSummary.total > 0 && "border-amber-300 bg-amber-50/70"
        )}
        style={{ paddingLeft: depth * 20 + 8 }}
      >
        {isBranch ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-0.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={shouldExpand ? "Collapse node" : "Expand node"}
          >
            {shouldExpand ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="mt-0.5 h-4 w-4" />
        )}

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-sky-700">
              {highlightText(label, query)}
            </span>
            <span className="text-muted-foreground">:</span>

            {isBranch ? (
              <Fragment>
                <span className="text-violet-700">
                  {isArray ? "[" : "{"}
                </span>
                <Badge variant="outline" className="rounded-md">
                  {childEntries.length} {isArray ? "items" : "keys"}
                </Badge>
                <Badge variant="secondary" className="rounded-md capitalize">
                  {nodeType}
                </Badge>
                <span className="text-violet-700">
                  {isArray ? "]" : "}"}
                </span>
              </Fragment>
            ) : (
              <PrimitiveValue value={primitiveValue} query={query} />
            )}

            {query && matchSummary.total > 0 && (
              <Badge variant="secondary" className="rounded-md">
                {matchSummary.total}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>{path}</span>
            {depth > 0 && <span>parent depth {depth}</span>}
          </div>

          {isBranch && shouldExpand && (
            <div className="space-y-1 pl-1">
              {childEntries.map(([childLabel, childValue]) => (
                <JsonNode
                  key={`${label}.${childLabel}`}
                  label={childLabel}
                  value={childValue}
                  depth={depth + 1}
                  query={query}
                  path={buildChildPath(path, isArray, childLabel)}
                  expansionMode={expansionMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrimitiveValue({
  value,
  query
}: {
  value: string | number | boolean | null;
  query: string;
}) {
  if (value === null) {
    return <span className="text-rose-700">null</span>;
  }

  if (typeof value === "string") {
    return (
      <span className="break-all text-emerald-700">
        "
        {highlightText(value, query)}
        "
      </span>
    );
  }

  if (typeof value === "number") {
    return (
      <span className="text-amber-700">
        {highlightText(String(value), query)}
      </span>
    );
  }

  return (
    <span className="text-fuchsia-700">
      {highlightText(String(value), query)}
    </span>
  );
}

function highlightText(text: string, query: string) {
  if (!query) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const parts: Array<{ text: string; match: boolean }> = [];
  let searchIndex = 0;

  while (searchIndex < text.length) {
    const matchIndex = lowerText.indexOf(query, searchIndex);

    if (matchIndex === -1) {
      parts.push({ text: text.slice(searchIndex), match: false });
      break;
    }

    if (matchIndex > searchIndex) {
      parts.push({
        text: text.slice(searchIndex, matchIndex),
        match: false
      });
    }

    parts.push({
      text: text.slice(matchIndex, matchIndex + query.length),
      match: true
    });

    searchIndex = matchIndex + query.length;
  }

  if (!parts.some((part) => part.match)) {
    return text;
  }

  return (
    <Fragment>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={`${part.text}-${index}`}
            className="rounded bg-yellow-200 px-0.5 text-current"
          >
            {part.text}
          </mark>
        ) : (
          <Fragment key={`${part.text}-${index}`}>{part.text}</Fragment>
        )
      )}
    </Fragment>
  );
}

function getMatchSummary(
  value: JsonValue | undefined,
  query: string,
  label?: string
): MatchSummary {
  if (value === undefined || !query) {
    return { total: 0, hasMatch: false };
  }

  let total = 0;

  if (label?.toLowerCase().includes(query)) {
    total++;
  }

  if (value === null) {
    if ("null".includes(query)) {
      total++;
    }

    return { total, hasMatch: total > 0 };
  }

  if (typeof value !== "object") {
    if (String(value).toLowerCase().includes(query)) {
      total++;
    }

    return { total, hasMatch: total > 0 };
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);

  for (const [childLabel, childValue] of entries) {
    const childSummary = getMatchSummary(childValue, query, childLabel);
    total += childSummary.total;
  }

  return { total, hasMatch: total > 0 };
}

function collectMatches(
  value: JsonValue | undefined,
  query: string,
  label = "root",
  path = "root"
): MatchRecord[] {
  if (value === undefined || !query) {
    return [];
  }

  const matches: MatchRecord[] = [];

  if (label.toLowerCase().includes(query)) {
    matches.push({
      path,
      type: "key",
      preview: label
    });
  }

  if (value === null) {
    if ("null".includes(query)) {
      matches.push({
        path,
        type: "value",
        preview: "null"
      });
    }

    return matches;
  }

  if (typeof value !== "object") {
    const preview = String(value);

    if (preview.toLowerCase().includes(query)) {
      matches.push({
        path,
        type: "value",
        preview
      });
    }

    return matches;
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);

  for (const [childLabel, childValue] of entries) {
    matches.push(
      ...collectMatches(
        childValue,
        query,
        childLabel,
        buildChildPath(path, isArray, childLabel)
      )
    );
  }

  return matches;
}

function buildChildPath(path: string, isArray: boolean, childLabel: string) {
  return isArray ? `${path}[${childLabel}]` : `${path}.${childLabel}`;
}
