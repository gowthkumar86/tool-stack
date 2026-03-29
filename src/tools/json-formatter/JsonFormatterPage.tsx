import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ContentSection from "../../components/ContentSection";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { setSEO } from "../../utils/seo";
import { formatJSON, minifyJSON, validateJSON } from "./jsonUtils";

type Mode = "format" | "minify" | "validate" | "jsonviewer";
type InsightType = "tip" | "warning" | "info";
type ExpandMode = "auto" | "expanded" | "collapsed";

interface Insight {
  type: InsightType;
  text: string;
}

interface JsonTreeProps {
  data: unknown;
  searchQuery: string;
  expandMode: ExpandMode;
  selectedPath: string;
  onSelectPath: (path: string) => void;
  path?: string;
  level?: number;
}

interface JsonIndexItem {
  path: string;
  label: string;
  preview: string;
  isMatch: boolean;
}

function insightClass(type: InsightType): string {
  if (type === "tip") return "border-green-500/40 bg-green-500/10 text-green-300";
  if (type === "warning") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-200";
  return "border-blue-500/40 bg-blue-500/10 text-blue-200";
}

function viewerButtonClass(isActive: boolean): string {
  return [
    "rounded-md border px-2.5 py-1 text-xs transition-all duration-300",
    isActive
      ? "border-green-500/60 bg-green-500/15 text-green-400"
      : "border-slate-700 text-slate-300 hover:border-green-500/50 hover:text-green-400",
  ].join(" ");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pathToDomId(path: string): string {
  return `jp-${path.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function shortPreview(value: unknown): string {
  if (Array.isArray(value)) {
    return `Array [${value.length}]`;
  }

  if (isObject(value)) {
    return `Object {${Object.keys(value).length}}`;
  }

  const plain = String(value);
  return plain.length > 38 ? `${plain.slice(0, 38)}...` : plain;
}

function highlightText(text: string, searchQuery: string) {
  if (!searchQuery) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === searchQuery.toLowerCase();

    if (!isMatch) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <mark key={`${part}-${index}`} className="rounded bg-yellow-400 px-0.5 text-black">
        {part}
      </mark>
    );
  });
}

function renderPrimitive(value: unknown, searchQuery: string) {
  if (typeof value === "string") {
    return <span className="text-green-400">"{highlightText(value, searchQuery)}"</span>;
  }

  if (typeof value === "number") {
    return <span className="text-blue-300">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-purple-300">{String(value)}</span>;
  }

  if (value === null) {
    return <span className="text-slate-400">null</span>;
  }

  return <span className="text-slate-300">{String(value)}</span>;
}

function jsonContainsMatch(data: unknown, searchQuery: string): boolean {
  if (!searchQuery) {
    return false;
  }

  if (Array.isArray(data)) {
    return data.some((item) => jsonContainsMatch(item, searchQuery));
  }

  if (isObject(data)) {
    return Object.entries(data).some(([key, value]) => {
      if (key.toLowerCase().includes(searchQuery)) {
        return true;
      }

      return jsonContainsMatch(value, searchQuery);
    });
  }

  return String(data).toLowerCase().includes(searchQuery);
}

function countMatchesInJson(data: unknown, searchQuery: string): number {
  if (!searchQuery) {
    return 0;
  }

  if (Array.isArray(data)) {
    return data.reduce((count, item) => count + countMatchesInJson(item, searchQuery), 0);
  }

  if (isObject(data)) {
    return Object.entries(data).reduce((count, [key, value]) => {
      const keyMatchCount = key.toLowerCase().includes(searchQuery) ? 1 : 0;
      return count + keyMatchCount + countMatchesInJson(value, searchQuery);
    }, 0);
  }

  return String(data).toLowerCase().includes(searchQuery) ? 1 : 0;
}

function getNodeOpenState(params: {
  expandMode: ExpandMode;
  hasQuery: boolean;
  hasMatch: boolean;
  level: number;
}): boolean {
  const { expandMode, hasQuery, hasMatch, level } = params;

  if (expandMode === "expanded") {
    return true;
  }

  if (expandMode === "collapsed") {
    return false;
  }

  if (hasQuery) {
    return hasMatch;
  }

  return level < 1;
}

function buildJsonIndex(data: unknown, searchQuery: string): JsonIndexItem[] {
  const items: JsonIndexItem[] = [];

  function walk(node: unknown, path: string, label: string, depth: number) {
    if (items.length >= 400 || depth > 10) {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        const rowPath = `${path}[${index}]`;
        const match = searchQuery ? jsonContainsMatch(item, searchQuery) : true;

        if (!searchQuery || match) {
          items.push({
            path: rowPath,
            label: `${label}[${index}]`,
            preview: shortPreview(item),
            isMatch: match,
          });
        }

        walk(item, rowPath, `${label}[${index}]`, depth + 1);
      });
      return;
    }

    if (isObject(node)) {
      Object.entries(node).forEach(([key, value]) => {
        const rowPath = path === "$" ? `$.${key}` : `${path}.${key}`;
        const keyMatch = searchQuery ? key.toLowerCase().includes(searchQuery) : true;
        const valueMatch =
          searchQuery && !Array.isArray(value) && !isObject(value)
            ? String(value).toLowerCase().includes(searchQuery)
            : false;
        const subtreeMatch = searchQuery ? jsonContainsMatch(value, searchQuery) : true;
        const rowMatch = keyMatch || valueMatch || subtreeMatch;

        if (!searchQuery || rowMatch) {
          items.push({
            path: rowPath,
            label: key,
            preview: shortPreview(value),
            isMatch: rowMatch,
          });
        }

        walk(value, rowPath, key, depth + 1);
      });
    }
  }

  walk(data, "$", "$", 0);
  return items;
}

function JsonTree({
  data,
  searchQuery,
  expandMode,
  selectedPath,
  onSelectPath,
  path = "$",
  level = 0,
}: JsonTreeProps) {
  const hasQuery = Boolean(searchQuery);

  if (Array.isArray(data)) {
    const hasMatch = hasQuery ? jsonContainsMatch(data, searchQuery) : false;
    const shouldOpen = getNodeOpenState({ expandMode, hasQuery, hasMatch, level });

    return (
      <details open={shouldOpen} className="mt-1">
        <summary
          className="cursor-pointer rounded px-1 py-0.5 text-slate-300 hover:bg-slate-800/50"
          onClick={() => onSelectPath(path)}
        >
          Array [{data.length}]
        </summary>
        <ul className="mt-1 space-y-1 border-l border-slate-700 pl-4">
          {data.length === 0 && <li className="text-xs text-slate-500">(empty array)</li>}
          {data.map((item, index) => {
            const rowPath = `${path}[${index}]`;
            const entryMatch = hasQuery && jsonContainsMatch(item, searchQuery);
            const isNested = Array.isArray(item) || isObject(item);
            const isSelected = selectedPath === rowPath;

            return (
              <li
                id={pathToDomId(rowPath)}
                key={rowPath}
                onClick={() => onSelectPath(rowPath)}
                className={[
                  "px-1 py-0.5",
                  entryMatch ? "rounded bg-yellow-100/10" : "",
                  isSelected ? "ring-1 ring-green-500/50" : "",
                ].join(" ")}
              >
                <span className="mr-2 text-xs text-slate-500">[{index}]</span>
                {isNested ? (
                  <JsonTree
                    data={item}
                    searchQuery={searchQuery}
                    expandMode={expandMode}
                    selectedPath={selectedPath}
                    onSelectPath={onSelectPath}
                    path={rowPath}
                    level={level + 1}
                  />
                ) : (
                  renderPrimitive(item, searchQuery)
                )}
              </li>
            );
          })}
        </ul>
      </details>
    );
  }

  if (isObject(data)) {
    const entries = Object.entries(data);
    const hasMatch = hasQuery ? jsonContainsMatch(data, searchQuery) : false;
    const shouldOpen = getNodeOpenState({ expandMode, hasQuery, hasMatch, level });

    return (
      <details open={shouldOpen} className="mt-1">
        <summary
          className="cursor-pointer rounded px-1 py-0.5 text-slate-300 hover:bg-slate-800/50"
          onClick={() => onSelectPath(path)}
        >
          {`Object {${entries.length}}`}
        </summary>
        <ul className="mt-1 space-y-1 border-l border-slate-700 pl-4">
          {entries.length === 0 && <li className="text-xs text-slate-500">(empty object)</li>}
          {entries.map(([key, value]) => {
            const rowPath = path === "$" ? `$.${key}` : `${path}.${key}`;
            const keyMatch = hasQuery && key.toLowerCase().includes(searchQuery);
            const valueMatch =
              hasQuery && !Array.isArray(value) && !isObject(value) && String(value).toLowerCase().includes(searchQuery);
            const subtreeMatch =
              hasQuery && (Array.isArray(value) || isObject(value)) && jsonContainsMatch(value, searchQuery);
            const rowMatch = keyMatch || valueMatch || subtreeMatch;
            const isNested = Array.isArray(value) || isObject(value);
            const isSelected = selectedPath === rowPath;

            return (
              <li
                id={pathToDomId(rowPath)}
                key={rowPath}
                onClick={() => onSelectPath(rowPath)}
                className={[
                  "px-1 py-0.5",
                  rowMatch ? "rounded bg-yellow-100/10" : "",
                  isSelected ? "ring-1 ring-green-500/50" : "",
                ].join(" ")}
              >
                <span className="mr-2 text-blue-300">{highlightText(key, searchQuery)}</span>
                <span className="mr-2 text-slate-500">:</span>
                {isNested ? (
                  <JsonTree
                    data={value}
                    searchQuery={searchQuery}
                    expandMode={expandMode}
                    selectedPath={selectedPath}
                    onSelectPath={onSelectPath}
                    path={rowPath}
                    level={level + 1}
                  />
                ) : (
                  renderPrimitive(value, searchQuery)
                )}
              </li>
            );
          })}
        </ul>
      </details>
    );
  }

  return <span>{renderPrimitive(data, searchQuery)}</span>;
}

function JsonFormatterPage() {
  const [mode, setMode] = useState<Mode>("format");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [statusMessage, setStatusMessage] = useState("Paste JSON to begin.");
  const [isError, setIsError] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [viewerSearch, setViewerSearch] = useState("");
  const [expandMode, setExpandMode] = useState<ExpandMode>("auto");
  const [selectedPath, setSelectedPath] = useState<string>("$");
  const [isViewerMaximized, setIsViewerMaximized] = useState(false);
  const [isProcessingOutput, setIsProcessingOutput] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const treeContainerRef = useRef<HTMLDivElement | null>(null);

  const normalizedSearch = viewerSearch.trim().toLowerCase();

  const parsedInput = useMemo(() => {
    if (!input.trim()) {
      return null;
    }

    try {
      return JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }, [input]);

  const matchCount = useMemo(() => {
    if (mode !== "jsonviewer" || !parsedInput || !normalizedSearch) {
      return 0;
    }

    return countMatchesInJson(parsedInput, normalizedSearch);
  }, [mode, normalizedSearch, parsedInput]);

  const viewerIndex = useMemo(() => {
    if (!parsedInput) {
      return [] as JsonIndexItem[];
    }

    return buildJsonIndex(parsedInput, normalizedSearch);
  }, [normalizedSearch, parsedInput]);

  useEffect(() => {
    setSEO({
      title: "JSON Formatter & Validator - Clean and Debug JSON Fast",
      description:
        "Format, minify, validate, and view JSON as a tree. Search keys/values and count occurrences while debugging APIs.",
    });
  }, []);

  useEffect(() => {
    setIsProcessingOutput(true);

    const timer = window.setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setStatusMessage("Paste JSON to begin.");
        setIsError(false);
        setIsProcessingOutput(false);
        return;
      }

      try {
        if (mode === "format") {
          setOutput(formatJSON(input));
          setStatusMessage("Formatted successfully.");
          setIsError(false);
          setIsProcessingOutput(false);
          return;
        }

        if (mode === "minify") {
          setOutput(minifyJSON(input));
          setStatusMessage("Minified successfully.");
          setIsError(false);
          setIsProcessingOutput(false);
          return;
        }

        if (mode === "jsonviewer") {
          const validation = validateJSON(input);
          if (validation.isValid) {
            setOutput(formatJSON(input));
            setStatusMessage("JSON viewer is ready. Search by key or value.");
            setIsError(false);
          } else {
            setOutput("");
            setStatusMessage(validation.error || "Invalid JSON.");
            setIsError(true);
          }
          setIsProcessingOutput(false);
          return;
        }

        const validation = validateJSON(input);
        if (validation.isValid) {
          setOutput(formatJSON(input));
          setStatusMessage("JSON is valid.");
          setIsError(false);
        } else {
          setOutput("");
          setStatusMessage(validation.error || "Invalid JSON.");
          setIsError(true);
        }
      } catch (error) {
        setOutput("");
        setStatusMessage(error instanceof Error ? error.message : "Could not process JSON.");
        setIsError(true);
      } finally {
        setIsProcessingOutput(false);
      }
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [input, mode]);

  useEffect(() => {
    if (isViewerMaximized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isViewerMaximized]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsViewerMaximized(false);
      }
    }

    if (isViewerMaximized) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isViewerMaximized]);
  const stats = useMemo(() => {
    const inputLines = input ? input.split("\n").length : 0;
    const outputLines = output ? output.split("\n").length : 0;

    return {
      inputChars: input.length,
      outputChars: output.length,
      inputLines,
      outputLines,
    };
  }, [input, output]);

  const insights = useMemo<Insight[]>(() => {
    if (!input.trim()) {
      return [{ type: "info", text: "Paste a payload from Postman, browser devtools, or logs to start." }];
    }

    if (isError) {
      return [
        {
          type: "warning",
          text: "Most JSON failures come from trailing commas, missing quotes, or pasting log text into JSON blocks.",
        },
      ];
    }

    const baseInsights: Insight[] = [
      {
        type: "info",
        text: `Input: ${stats.inputChars} chars (${stats.inputLines} lines). Output: ${stats.outputChars} chars (${stats.outputLines} lines).`,
      },
      {
        type: "tip",
        text: "Share formatted output in PRs and tickets. Debugging is faster when payloads are readable.",
      },
    ];

    if (mode === "jsonviewer") {
      if (normalizedSearch) {
        baseInsights.unshift({
          type: "info",
          text: `Search matches: ${matchCount} occurrence(s) for "${viewerSearch.trim()}".`,
        });
      } else {
        baseInsights.unshift({
          type: "tip",
          text: "Use JSON Viewer mode to expand/collapse nested payloads and search by keys or values.",
        });
      }
    }

    return baseInsights;
  }, [input, isError, matchCount, mode, normalizedSearch, stats, viewerSearch]);

  async function copyOutput() {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage("Clipboard access failed. Please copy manually.");
    }
  }

  async function importJSONFile(file: File) {
    try {
      const content = await file.text();
      setInput(content);
      setCopyMessage("");
    } catch {
      setStatusMessage("Could not read the selected file.");
      setIsError(true);
    }
  }

  function jumpToPath(path: string) {
    setSelectedPath(path);

    if (expandMode !== "expanded") {
      setExpandMode("expanded");
      setTimeout(() => {
        const target = document.getElementById(pathToDomId(path));
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 40);
      return;
    }

    const target = document.getElementById(pathToDomId(path));
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setViewerSearch("");
    setExpandMode("auto");
    setSelectedPath("$");
    setIsViewerMaximized(false);
    setCopyMessage("");
    setStatusMessage("Paste JSON to begin.");
    setIsError(false);
  }

  const treeView = (
    <div
      ref={treeContainerRef}
      className={[
        "mono-output rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-gray-200",
        isViewerMaximized? "flex-1 min-h-0 overflow-auto": "max-h-72 overflow-auto",
      ].join(" ")}
    >
      {!parsedInput && input.trim() && <p className="text-red-300">Invalid JSON. Fix input to view tree.</p>}
      {parsedInput && !isTransitioning && (
        <JsonTree
          data={parsedInput}
          searchQuery={normalizedSearch}
          expandMode={expandMode}
          selectedPath={selectedPath}
          onSelectPath={setSelectedPath}
        />
      )}
      {!input.trim() && <p className="text-slate-400">Tree view will appear after you paste JSON.</p>}
    </div>
  );

  const navigationPane = (
    <aside className="w-full lg:w-80 flex flex-col min-h-0 rounded-md border border-slate-700 bg-slate-900 p-3">
      <h3 className="text-sm font-semibold text-gray-100">Navigation Index</h3>
      <p className="mt-1 text-xs text-slate-400">
        {normalizedSearch
          ? `Showing matched paths (${viewerIndex.length})`
          : `Showing indexed paths (${viewerIndex.length})`}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Selected: <span className="mono-output text-green-400">{selectedPath}</span>
      </p>

      <div className="mt-3 flex-1 min-h-0 overflow-auto space-y-1">
        {viewerIndex.length === 0 && <p className="text-xs text-slate-500">No paths available.</p>}
        {viewerIndex.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => jumpToPath(item.path)}
            className={[
              "w-full rounded-md border px-2 py-1.5 text-left text-xs transition-all duration-300",
              item.path === selectedPath
                ? "border-green-500/50 bg-green-500/15 text-green-300"
                : "border-slate-700 text-slate-300 hover:border-green-500/40",
            ].join(" ")}
          >
            <p className="mono-output truncate">{item.path}</p>
            <p className="truncate text-slate-400">{item.label}: {item.preview}</p>
          </button>
        ))}
      </div>
    </aside>
  );

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gray-100">JSON Formatter & Validator</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          JSON bugs waste hours because payloads are hard to read under pressure. This tool keeps formatting,
          minification, validation, and tree-view exploration in one fast workflow.
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="JSON tool layout">
        <Card hoverable>
          <h2 className="text-lg font-semibold text-gray-100">Input</h2>
          <p className="mt-2 text-sm text-slate-300">Mode updates instantly as you type.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["format", "minify", "validate", "jsonviewer"] as Mode[]).map((currentMode) => (
              <button
                key={currentMode}
                type="button"
                onClick={() => {
                  setMode(currentMode);
                  setCopyMessage("");
                }}
                className={[
                  "rounded-md px-3 py-1.5 text-xs capitalize transition-all duration-300",
                  mode === currentMode
                    ? "bg-green-500/15 text-green-400"
                    : "border border-slate-700 text-slate-300 hover:border-green-500/50",
                ].join(" ")}
              >
                {currentMode}
              </button>
            ))}
          </div>

          <label htmlFor="json-input" className="mt-4 block text-sm font-medium text-slate-300">
            JSON Input
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setCopyMessage("");
            }}
            placeholder='{"api":"/v1/orders","retry":false}'
            className="input-field mono-output mt-2 h-72 p-3 text-sm"
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".json,application/json,text/plain"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void importJSONFile(file);
                event.currentTarget.value = "";
              }}
              className="text-sm text-slate-300"
            />
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-all duration-300 hover:border-green-500/50 hover:text-green-400"
            >
              Clear
            </button>
          </div>
        </Card>

        <Card hoverable>
          <header className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-100">Output & Insights</h2>
            <Button type="button" onClick={copyOutput} disabled={!output} className="text-xs">
              {copyMessage || "Copy Output"}
            </Button>
          </header>

          <p
            className={[
              "mt-3 rounded-md border p-3 text-sm",
              isError
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-green-500/20 bg-green-500/5 text-green-300",
            ].join(" ")}
          >
            {statusMessage}
          </p>

          {isProcessingOutput ? (
            <section className="mt-4 grid gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-56 w-full" />
            </section>
          ) : !input.trim() ? (
            <section className="mt-4">
              <EmptyState title="No JSON input" description="Paste JSON to begin formatting or validation." />
            </section>
          ) : mode === "jsonviewer" ? (
            <section className="mt-4 space-y-3">
              <div className="rounded-md border border-slate-700 bg-slate-900 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="json-viewer-search" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Search
                  </label>
                  <input
                    id="json-viewer-search"
                    type="text"
                    value={viewerSearch}
                    onChange={(event) => setViewerSearch(event.target.value)}
                    placeholder="Find key or value (status, userId, timeout)"
                    className="input-field w-full p-2 text-sm lg:w-80"
                  />
                  <button
                    type="button"
                    onClick={() => setViewerSearch("")}
                    className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-all duration-300 hover:border-green-500/50 hover:text-green-400"
                  >
                    Clear Search
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
                    Matches: <span className="text-green-400">{matchCount}</span>
                  </span>

                  <button type="button" onClick={() => setExpandMode("expanded")} className={viewerButtonClass(expandMode === "expanded")}>
                    Expand All
                  </button>
                  <button type="button" onClick={() => setExpandMode("collapsed")} className={viewerButtonClass(expandMode === "collapsed")}>
                    Collapse All
                  </button>
                  <button type="button" onClick={() => setExpandMode("auto")} className={viewerButtonClass(expandMode === "auto")}>
                    Smart Expand
                  </button>
                  {/* Fullscreen disabled due to performance issues
                  <button type="button" 
                    onClick={() => {
                      setIsTransitioning(true);

                      requestAnimationFrame(() => {
                        setIsViewerMaximized((p) => !p);

                        setTimeout(() => {
                          setIsTransitioning(false);
                        }, 200);
                      });
                    }}
                    className={viewerButtonClass(isViewerMaximized)}>
                    {isViewerMaximized ? "Exit Full Window" : "Full Window"}
                  </button> */}
                </div>
              </div>

              {isViewerMaximized ? (
                <div className="fixed inset-0 z-50 bg-slate-900/95 p-4 overflow-hidden will-change-transform">
                  <div className="mx-auto flex h-full max-w-[1500px] gap-4 min-h-0">
                    <section className="flex min-w-0 flex-1 flex-col rounded-md border border-slate-700 bg-gray-900 p-3 min-h-0">
                      <header className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-100">JSON Viewer - Full Window</h3>
                        <button
                          type="button"
                          onClick={() => setIsViewerMaximized(false)}
                          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:border-green-500/50 hover:text-green-400"
                        >
                          Close
                        </button>
                      </header>

                      <div className="mb-3 rounded-md border border-slate-700 bg-slate-900 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <label htmlFor="json-viewer-search-full" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Search
                          </label>
                          <input
                            id="json-viewer-search-full"
                            type="text"
                            value={viewerSearch}
                            onChange={(event) => setViewerSearch(event.target.value)}
                            placeholder="Find key or value (status, userId, timeout)"
                            className="input-field w-full p-2 text-sm lg:w-80"
                          />
                          <button
                            type="button"
                            onClick={() => setViewerSearch("")}
                            className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-all duration-300 hover:border-green-500/50 hover:text-green-400"
                          >
                            Clear Search
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
                            Matches: <span className="text-green-400">{matchCount}</span>
                          </span>

                          <button type="button" onClick={() => setExpandMode("expanded")} className={viewerButtonClass(expandMode === "expanded")}>
                            Expand All
                          </button>
                          <button type="button" onClick={() => setExpandMode("collapsed")} className={viewerButtonClass(expandMode === "collapsed")}>
                            Collapse All
                          </button>
                          <button type="button" onClick={() => setExpandMode("auto")} className={viewerButtonClass(expandMode === "auto")}>
                            Smart Expand
                          </button>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1">{treeView}</div>
                    </section>
                    {navigationPane}
                  </div>
                </div>
              ) : (
                treeView
              )}
            </section>
          ) : (
            <>
              <label htmlFor="json-output" className="mt-4 block text-sm font-medium text-slate-300">
                Output
              </label>
              <textarea
                id="json-output"
                value={output}
                readOnly
                className="input-field mono-output mt-2 h-72 p-3 text-sm"
              />
            </>
          )}

          <section className="mt-4 space-y-2" aria-label="Insights">
            <h3 className="text-sm font-semibold text-gray-100">Insights</h3>
            {insights.map((insight, index) => (
              <p key={`${insight.type}-${index}`} className={`rounded-md border p-3 text-sm ${insightClass(insight.type)}`}>
                {insight.text}
              </p>
            ))}

          </section>
        </Card>
      </section>

      <ContentSection title="Real-World Problem This Solves">
        <p>
          APIs rarely fail with clean messages. You usually get unreadable one-line JSON in logs, and that slows down
          debugging and incident response.
        </p>
      </ContentSection>

      <ContentSection title="Common Mistakes Developers Make">
        <ul className="list-disc space-y-2 pl-5">
          <li>Trusting payloads copied from chat apps that silently break quotes.</li>
          <li>Sharing minified payloads in PR comments where nobody can read nested fields.</li>
          <li>Validating by "looks correct" instead of parsing.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Practical Example">
        <p>
          A webhook fails in production. Paste payload here, validate it, then format before posting in your issue
          thread so backend and QA can align quickly.
        </p>
      </ContentSection>

      <ContentSection title="Edge Cases And FAQs">
        <h3 className="text-base font-semibold text-gray-100">Does this fix invalid JSON automatically?</h3>
        <p>No. It surfaces parse errors clearly so you can fix the source without hidden data changes.</p>
        <h3 className="text-base font-semibold text-gray-100">What should I check next for API slowness?</h3>
        <p>
          Use <Link to="/har-analyzer" className="text-green-500">HAR Analyzer</Link> for timing and status trends.
          For tax payload validation, pair with <Link to="/gst-calculator" className="text-green-500">GST Tool</Link>.
        </p>
      </ContentSection>
    </article>
  );
}

export default JsonFormatterPage;



