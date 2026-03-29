import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentSection from "../../components/ContentSection";
import Button from "../../components/ui/button";
import Card from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/skeleton";
import { setSEO } from "../../utils/seo";
import {
  buildDependencyGraph,
  buildGraphDiagnostics,
  compareHarGraphs,
  getInitiatorChain,
  parseHarContent,
  type CompareHarGraphsResult,
  type HarEntry,
  type RequestNode,
} from "./harParser";
import { getSlowRequests, getStatusCounts } from "./harUtils";

type InsightType = "tip" | "warning" | "info";

interface Insight {
  type: InsightType;
  text: string;
}

interface NodeEvidence {
  id: string;
  url: string;
  method?: string;
  status: number;
  time: number;
  chainLength: number;
}

interface ComparisonEvidence {
  targetInA?: NodeEvidence;
  targetInB?: NodeEvidence;
  breakPointInA?: NodeEvidence;
  breakPointInB?: NodeEvidence;
  duplicateTargetCountA: number;
  duplicateTargetCountB: number;
  duplicateUrlCountA: number;
  duplicateUrlCountB: number;
  sharedDomains: string[];
  onlyDomainsInA: string[];
  onlyDomainsInB: string[];
}

function insightClass(type: InsightType): string {
  if (type === "tip") return "border-green-500/40 bg-green-500/10 text-green-300";
  if (type === "warning") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-200";
  return "border-blue-500/40 bg-blue-500/10 text-blue-200";
}

function normalizeComparableUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    parsed.hash = "";
    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

function urlMatchesTarget(candidateUrl: string, targetUrl: string): boolean {
  return normalizeComparableUrl(candidateUrl) === normalizeComparableUrl(targetUrl);
}

function averageRequestTime(entries: HarEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }
  return entries.reduce((sum, entry) => sum + entry.time, 0) / entries.length;
}

function toNodeEvidence(node: RequestNode, graph: Map<string, RequestNode>): NodeEvidence {
  return {
    id: node.id,
    url: node.url,
    method: node.method,
    status: node.status,
    time: node.time,
    chainLength: getInitiatorChain(node.id, graph).length,
  };
}

function findBestNodeForUrl(graph: Map<string, RequestNode>, targetUrl: string): RequestNode | undefined {
  const candidates = Array.from(graph.values()).filter((node) => urlMatchesTarget(node.url, targetUrl));
  if (candidates.length === 0) {
    return undefined;
  }

  return candidates
    .map((node) => ({ node, chainLength: getInitiatorChain(node.id, graph).length }))
    .sort((a, b) => {
      if (b.chainLength !== a.chainLength) {
        return b.chainLength - a.chainLength;
      }
      if (b.node.time !== a.node.time) {
        return b.node.time - a.node.time;
      }
      return b.node.status - a.node.status;
    })[0].node;
}

function countMatchingRequests(entries: HarEntry[], targetUrl: string): number {
  return entries.filter((entry) => urlMatchesTarget(entry.request.url, targetUrl)).length;
}

async function parseUploadedHarFile(selectedFile: File): Promise<HarEntry[]> {
  const content = await selectedFile.text();
  const parsedEntries = parseHarContent(content);

  if (parsedEntries.length === 0) {
    throw new Error("This HAR file has no network entries.");
  }

  return parsedEntries;
}

function HarAnalyzerPage() {
  const [entries, setEntries] = useState<HarEntry[]>([]);
  const [comparisonEntries, setComparisonEntries] = useState<HarEntry[]>([]);

  const [fileName, setFileName] = useState("");
  const [comparisonFileName, setComparisonFileName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [comparisonErrorMessage, setComparisonErrorMessage] = useState("");

  const [targetUrl, setTargetUrl] = useState("");
  const [comparisonResult, setComparisonResult] = useState<CompareHarGraphsResult | null>(null);
  const [comparisonEvidence, setComparisonEvidence] = useState<ComparisonEvidence | null>(null);
  const [comparisonRunError, setComparisonRunError] = useState("");

  const [copyMessage, setCopyMessage] = useState("");
  const [isParsingA, setIsParsingA] = useState(false);
  const [isParsingB, setIsParsingB] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    setSEO({
      title: "Analyze HAR Files � Find Slow Requests & Errors",
      description:
        "Analyze HAR files to find slow requests, status-code spikes, and API bottlenecks. Practical debugging insights without dashboard overhead.",
    });
  }, []);

  const statusCountsA = useMemo(() => getStatusCounts(entries), [entries]);
  const statusCountsB = useMemo(() => getStatusCounts(comparisonEntries), [comparisonEntries]);

  const slowRequestsA = useMemo(() => getSlowRequests(entries), [entries]);
  const slowRequestsB = useMemo(() => getSlowRequests(comparisonEntries), [comparisonEntries]);

  const avgTimeA = useMemo(() => averageRequestTime(entries), [entries]);
  const avgTimeB = useMemo(() => averageRequestTime(comparisonEntries), [comparisonEntries]);

  const insights = useMemo(() => {
    const nextInsights: Insight[] = [];

    if (entries.length === 0) {
      nextInsights.push({
        type: "info",
        text: "Upload HAR A to start seeing request health and bottlenecks.",
      });
      return nextInsights;
    }

    const serverErrorsA = Object.entries(statusCountsA)
      .filter(([status]) => Number(status) >= 500)
      .reduce((sum, [, count]) => sum + count, 0);

    if (serverErrorsA > 0) {
      nextInsights.push({
        type: "warning",
        text: `HAR A has ${serverErrorsA} server-error responses (5xx). Check backend logs for matching timestamps.`,
      });
    }

    if (slowRequestsA.length > 0) {
      nextInsights.push({
        type: "warning",
        text: `HAR A has ${slowRequestsA.length} requests above 1000ms. Fix the top offenders first.`,
      });
    }

    nextInsights.push({
      type: "info",
      text: `Average request time: HAR A ${avgTimeA.toFixed(0)}ms${comparisonEntries.length > 0 ? ` vs HAR B ${avgTimeB.toFixed(0)}ms.` : "."}`,
    });

    if (comparisonEntries.length === 0) {
      nextInsights.push({
        type: "tip",
        text: "Upload HAR B and compare by target URL to find exactly where the initiator chain broke.",
      });
    }

    if (comparisonResult?.breakPoint) {
      nextInsights.push({
        type: "info",
        text: `Comparison break point: ${comparisonResult.breakPoint}`,
      });
    }

    return nextInsights;
  }, [avgTimeA, avgTimeB, comparisonEntries.length, comparisonResult?.breakPoint, entries.length, slowRequestsA.length, statusCountsA]);

  async function handleFileUploadA(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    setFileName(selectedFile.name);
    setErrorMessage("");
    setCopyMessage("");
    setComparisonRunError("");
    setComparisonResult(null);
    setComparisonEvidence(null);

    setIsParsingA(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const parsedEntries = await parseUploadedHarFile(selectedFile);
      setEntries(parsedEntries);
    } catch (error) {
      setEntries([]);
      setErrorMessage(error instanceof Error ? error.message : "Could not parse HAR A.");
    } finally {
      setIsParsingA(false);
    }
  }

  async function handleFileUploadB(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    setComparisonFileName(selectedFile.name);
    setComparisonErrorMessage("");
    setComparisonRunError("");
    setComparisonResult(null);
    setComparisonEvidence(null);

    setIsParsingB(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const parsedEntries = await parseUploadedHarFile(selectedFile);
      setComparisonEntries(parsedEntries);
    } catch (error) {
      setComparisonEntries([]);
      setComparisonErrorMessage(error instanceof Error ? error.message : "Could not parse HAR B.");
    } finally {
      setIsParsingB(false);
    }
  }

  async function runComparison(): Promise<void> {
    const normalizedTargetUrl = targetUrl.trim();

    if (entries.length === 0 || comparisonEntries.length === 0) {
      setComparisonRunError("Please upload both HAR A and HAR B before running comparison.");
      setComparisonResult(null);
      setComparisonEvidence(null);
      return;
    }

    if (!normalizedTargetUrl) {
      setComparisonRunError("Enter the exact target request URL you want to compare.");
      setComparisonResult(null);
      setComparisonEvidence(null);
      return;
    }

    setIsComparing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 140));
      const graphA = buildDependencyGraph(entries);
      const graphB = buildDependencyGraph(comparisonEntries);
      const result = compareHarGraphs(graphA, graphB, normalizedTargetUrl);

      const diagnosticsA = buildGraphDiagnostics(graphA);
      const diagnosticsB = buildGraphDiagnostics(graphB);

      const targetInA = findBestNodeForUrl(graphA, normalizedTargetUrl);
      const targetInB = findBestNodeForUrl(graphB, normalizedTargetUrl);

      const breakPointInA = result.breakPoint ? findBestNodeForUrl(graphA, result.breakPoint) : undefined;
      const breakPointInB = result.breakPoint ? findBestNodeForUrl(graphB, result.breakPoint) : undefined;

      const domainsA = Array.from(diagnosticsA.byDomain.keys()).sort();
      const domainsB = new Set(Array.from(diagnosticsB.byDomain.keys()));

      const sharedDomains = domainsA.filter((domain) => domainsB.has(domain));
      const onlyDomainsInA = domainsA.filter((domain) => !domainsB.has(domain));
      const onlyDomainsInB = Array.from(diagnosticsB.byDomain.keys())
        .filter((domain) => !diagnosticsA.byDomain.has(domain))
        .sort();

      const evidence: ComparisonEvidence = {
        targetInA: targetInA ? toNodeEvidence(targetInA, graphA) : undefined,
        targetInB: targetInB ? toNodeEvidence(targetInB, graphB) : undefined,
        breakPointInA: breakPointInA ? toNodeEvidence(breakPointInA, graphA) : undefined,
        breakPointInB: breakPointInB ? toNodeEvidence(breakPointInB, graphB) : undefined,
        duplicateTargetCountA: countMatchingRequests(entries, normalizedTargetUrl),
        duplicateTargetCountB: countMatchingRequests(comparisonEntries, normalizedTargetUrl),
        duplicateUrlCountA: diagnosticsA.duplicatesByUrl.size,
        duplicateUrlCountB: diagnosticsB.duplicatesByUrl.size,
        sharedDomains,
        onlyDomainsInA,
        onlyDomainsInB,
      };

      setComparisonRunError("");
      setComparisonResult(result);
      setComparisonEvidence(evidence);
    } catch (error) {
      setComparisonResult(null);
      setComparisonEvidence(null);
      setComparisonRunError(error instanceof Error ? error.message : "Comparison failed.");
    } finally {
      setIsComparing(false);
    }
  }

  async function copySummary() {
    if (entries.length === 0) {
      return;
    }

    const summary = {
      harA: {
        fileName,
        totalRequests: entries.length,
        avgTimeMs: Number(avgTimeA.toFixed(2)),
        statusCounts: statusCountsA,
        slowRequests: slowRequestsA.slice(0, 8).map((entry) => ({
          url: entry.request.url,
          status: entry.response.status,
          time: Number(entry.time.toFixed(2)),
        })),
      },
      harB: {
        fileName: comparisonFileName,
        totalRequests: comparisonEntries.length,
        avgTimeMs: Number(avgTimeB.toFixed(2)),
        statusCounts: statusCountsB,
        slowRequests: slowRequestsB.slice(0, 8).map((entry) => ({
          url: entry.request.url,
          status: entry.response.status,
          time: Number(entry.time.toFixed(2)),
        })),
      },
      comparison: comparisonResult,
      evidence: comparisonEvidence,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage("Clipboard access failed. You can copy manually.");
    }
  }

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gray-100">HAR Analyzer</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Debugging production slowness from memory is risky. This tool shows what is actually slow, what is failing,
          and where to investigate first.
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="HAR tool layout">
        <Card hoverable className="relative">
          <h2 className="text-lg font-semibold text-gray-100">Input</h2>
          <p className="mt-2 text-sm text-slate-300">
            Upload two HAR files and compare the same target URL to see where the initiator chain breaks.
          </p>

          <label htmlFor="har-upload-a" className="mt-4 block text-sm font-medium text-slate-300">
            HAR A (expected flow)
          </label>
          <input
            id="har-upload-a"
            type="file"
            accept=".har,.json,application/json"
            onChange={handleFileUploadA}
            className="input-field mt-2 p-2 text-sm"
          />
          {fileName && <p className="mt-2 text-sm text-slate-400">HAR A loaded: {fileName}</p>}
          {errorMessage && <p className="mt-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{errorMessage}</p>}

          <label htmlFor="har-upload-b" className="mt-4 block text-sm font-medium text-slate-300">
            HAR B (missing flow)
          </label>
          <input
            id="har-upload-b"
            type="file"
            accept=".har,.json,application/json"
            onChange={handleFileUploadB}
            className="input-field mt-2 p-2 text-sm"
          />
          {comparisonFileName && <p className="mt-2 text-sm text-slate-400">HAR B loaded: {comparisonFileName}</p>}
          {comparisonErrorMessage && (
            <p className="mt-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{comparisonErrorMessage}</p>
          )}

          <label htmlFor="target-url" className="mt-4 block text-sm font-medium text-slate-300">
            Target Request URL
          </label>
          <input
            id="target-url"
            type="text"
            value={targetUrl}
            onChange={(event) => {
              setTargetUrl(event.target.value);
              setComparisonResult(null);
              setComparisonEvidence(null);
              setComparisonRunError("");
            }}
            placeholder="https://api.example.com/sponsored-products"
            className="input-field mt-2 p-2 text-sm"
          />

          <div className="sticky bottom-0 mt-5 border-t border-[var(--border-muted)] bg-[var(--surface)]/95 pt-4">
            <Button
              onClick={() => {
                void runComparison();
              }}
              disabled={entries.length === 0 || comparisonEntries.length === 0 || isComparing}
              variant="primary"
            >
              {isComparing ? "Comparing..." : "Compare Initiator Chains"}
            </Button>
          </div>

          {comparisonRunError && (
            <p className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{comparisonRunError}</p>
          )}
        </Card>

        <Card hoverable className="relative">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-100">Results & Insights</h2>
            <Button variant="secondary" onClick={copySummary} disabled={entries.length === 0} className="text-xs">
              {copyMessage || "Copy Summary"}
            </Button>
          </header>

          {(isParsingA || isParsingB || isComparing) && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-40 w-full sm:col-span-2" />
            </div>
          )}

          {!isParsingA && !isParsingB && !isComparing && entries.length === 0 && (
            <div className="mt-4">
              <EmptyState
                title="No HAR data yet"
                description="Paste your HAR file to begin analysis. Upload HAR A first, then HAR B to compare initiator chains."
              />
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
              <h3 className="text-xs uppercase tracking-wide text-slate-400">HAR A Requests</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-100">{entries.length}</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
              <h3 className="text-xs uppercase tracking-wide text-slate-400">HAR B Requests</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-100">{comparisonEntries.length}</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
              <h3 className="text-xs uppercase tracking-wide text-slate-400">Avg Time HAR A</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-100">{avgTimeA.toFixed(0)}ms</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
              <h3 className="text-xs uppercase tracking-wide text-slate-400">Avg Time HAR B</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-100">{avgTimeB.toFixed(0)}ms</p>
            </div>
          </div>

          {comparisonResult && (
            <section className="mt-4 rounded-md border border-slate-800 bg-slate-900 p-3">
              <h3 className="text-sm font-semibold text-gray-100">Comparison Result</h3>
              <p className="mt-2 text-sm text-slate-300">Found in HAR A: {comparisonResult.foundInA ? "Yes" : "No"}</p>
              <p className="mt-1 text-sm text-slate-300">Found in HAR B: {comparisonResult.foundInB ? "Yes" : "No"}</p>
              {comparisonResult.breakPoint && (
                <p className="mt-1 text-sm text-yellow-200">Break point: {comparisonResult.breakPoint}</p>
              )}
              <p className="mt-2 text-sm text-slate-200">Reason: {comparisonResult.reason}</p>

              {comparisonResult.chainA.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs uppercase tracking-wide text-slate-400">Initiator chain in HAR A</h4>
                  <ol className="mt-2 space-y-1 text-xs text-slate-300">
                    {comparisonResult.chainA.map((url, index) => (
                      <li key={`${url}-${index}`} className="mono-output break-all">
                        {index + 1}. {url}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          )}

          {comparisonEvidence && (
            <section className="mt-4 rounded-md border border-slate-800 bg-slate-900 p-3">
              <h3 className="text-sm font-semibold text-gray-100">Comparison Evidence</h3>
              <p className="mt-2 text-sm text-slate-300">Target matches in HAR A: {comparisonEvidence.duplicateTargetCountA}</p>
              <p className="mt-1 text-sm text-slate-300">Target matches in HAR B: {comparisonEvidence.duplicateTargetCountB}</p>
              <p className="mt-1 text-sm text-slate-300">Duplicate URLs in HAR A: {comparisonEvidence.duplicateUrlCountA}</p>
              <p className="mt-1 text-sm text-slate-300">Duplicate URLs in HAR B: {comparisonEvidence.duplicateUrlCountB}</p>
              <p className="mt-1 text-sm text-slate-300">Shared domains: {comparisonEvidence.sharedDomains.length}</p>
              <p className="mt-1 text-sm text-slate-300">Domains only in HAR A: {comparisonEvidence.onlyDomainsInA.length}</p>
              <p className="mt-1 text-sm text-slate-300">Domains only in HAR B: {comparisonEvidence.onlyDomainsInB.length}</p>

              {comparisonEvidence.targetInA && (
                <div className="mt-3 rounded-md border border-slate-800 bg-gray-900 p-2 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">Selected Target In HAR A</p>
                  <p className="mt-1 mono-output break-all">URL: {comparisonEvidence.targetInA.url}</p>
                  <p>Node: {comparisonEvidence.targetInA.id}</p>
                  <p>
                    Method {comparisonEvidence.targetInA.method ?? "UNKNOWN"} | Status {comparisonEvidence.targetInA.status} | Time {comparisonEvidence.targetInA.time.toFixed(2)}ms | Chain {comparisonEvidence.targetInA.chainLength}
                  </p>
                </div>
              )}

              {comparisonEvidence.targetInB && (
                <div className="mt-2 rounded-md border border-slate-800 bg-gray-900 p-2 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">Selected Target In HAR B</p>
                  <p className="mt-1 mono-output break-all">URL: {comparisonEvidence.targetInB.url}</p>
                  <p>Node: {comparisonEvidence.targetInB.id}</p>
                  <p>
                    Method {comparisonEvidence.targetInB.method ?? "UNKNOWN"} | Status {comparisonEvidence.targetInB.status} | Time {comparisonEvidence.targetInB.time.toFixed(2)}ms | Chain {comparisonEvidence.targetInB.chainLength}
                  </p>
                </div>
              )}

              {comparisonEvidence.breakPointInA && (
                <div className="mt-2 rounded-md border border-slate-800 bg-gray-900 p-2 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">Break Point In HAR A</p>
                  <p className="mt-1 mono-output break-all">URL: {comparisonEvidence.breakPointInA.url}</p>
                  <p>Node: {comparisonEvidence.breakPointInA.id}</p>
                  <p>
                    Method {comparisonEvidence.breakPointInA.method ?? "UNKNOWN"} | Status {comparisonEvidence.breakPointInA.status} | Time {comparisonEvidence.breakPointInA.time.toFixed(2)}ms | Chain {comparisonEvidence.breakPointInA.chainLength}
                  </p>
                </div>
              )}

              {comparisonResult?.breakPoint && !comparisonEvidence.breakPointInB && (
                <p className="mt-2 text-xs text-yellow-200">Break point request is not present in HAR B.</p>
              )}

              {comparisonEvidence.onlyDomainsInA.length > 0 && (
                <div className="mt-3 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">Domains only in HAR A (first 8)</p>
                  <p className="mt-1 mono-output break-all">{comparisonEvidence.onlyDomainsInA.slice(0, 8).join(", ")}</p>
                </div>
              )}

              {comparisonEvidence.onlyDomainsInB.length > 0 && (
                <div className="mt-2 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">Domains only in HAR B (first 8)</p>
                  <p className="mt-1 mono-output break-all">{comparisonEvidence.onlyDomainsInB.slice(0, 8).join(", ")}</p>
                </div>
              )}
            </section>
          )}

          {Object.keys(statusCountsA).length > 0 && (
            <section className="mt-4">
              <h3 className="text-sm font-semibold text-gray-100">HAR A Status Code Distribution</h3>
              <ul className="mono-output mt-2 grid gap-1 text-sm text-slate-300 sm:grid-cols-2">
                {Object.entries(statusCountsA)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([statusCode, count]) => (
                    <li key={`a-${statusCode}`}>
                      {statusCode}: {count}
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {Object.keys(statusCountsB).length > 0 && (
            <section className="mt-4">
              <h3 className="text-sm font-semibold text-gray-100">HAR B Status Code Distribution</h3>
              <ul className="mono-output mt-2 grid gap-1 text-sm text-slate-300 sm:grid-cols-2">
                {Object.entries(statusCountsB)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([statusCode, count]) => (
                    <li key={`b-${statusCode}`}>
                      {statusCode}: {count}
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {slowRequestsA.length > 0 && (
            <section className="mt-4">
              <h3 className="text-sm font-semibold text-gray-100">Top Slow Requests In HAR A</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {slowRequestsA.slice(0, 6).map((entry, index) => (
                  <li key={`a-${entry.request.url}-${index}`} className="rounded-md border border-slate-800 bg-slate-900 p-3">
                    <p className="mono-output break-all text-slate-200">{entry.request.url}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Status {entry.response.status} | {entry.time.toFixed(2)}ms
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {slowRequestsB.length > 0 && (
            <section className="mt-4">
              <h3 className="text-sm font-semibold text-gray-100">Top Slow Requests In HAR B</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {slowRequestsB.slice(0, 6).map((entry, index) => (
                  <li key={`b-${entry.request.url}-${index}`} className="rounded-md border border-slate-800 bg-slate-900 p-3">
                    <p className="mono-output break-all text-slate-200">{entry.request.url}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Status {entry.response.status} | {entry.time.toFixed(2)}ms
                    </p>
                  </li>
                ))}
              </ul>
            </section>
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
          Teams often say, "the app feels slow," but nobody knows whether the issue is backend latency, payload size,
          or one bad third-party endpoint. HAR gives you evidence instead of opinions.
        </p>
      </ContentSection>

      <ContentSection title="Common Mistakes We See">
        <ul className="list-disc space-y-2 pl-5">
          <li>Optimizing random endpoints instead of the slowest requests first.</li>
          <li>Ignoring status-code trends, especially intermittent 5xx failures.</li>
          <li>Comparing only target URLs without checking the full initiator chain.</li>
        </ul>
      </ContentSection>

      <ContentSection title="How This Tool Helps In Practice">
        <p>
          You get request volume, status breakdown, immediate visibility into requests above 1000ms,
          and chain-level comparison between HAR A and HAR B.
        </p>
      </ContentSection>

      <ContentSection title="Example Scenario">
        <p>
          Sponsored products API appears in HAR A but not HAR B. Comparison highlights a missing ad script in HAR B,
          so you can focus on blocked script loading instead of debugging the API first.
        </p>
      </ContentSection>

      <ContentSection title="Edge Cases And FAQs">
        <h3 className="text-base font-semibold text-gray-100">What if my HAR loads but looks incomplete?</h3>
        <p>Capture again with "Preserve log" enabled and reproduce the issue before exporting.</p>
        <h3 className="text-base font-semibold text-gray-100">How do I share payload snippets safely?</h3>
        <p>
          Use <Link to="/json-formatter" className="text-green-500">JSON Formatter</Link> to clean payloads,
          then redact private fields before sharing in tickets.
        </p>
      </ContentSection>
    </article>
  );
}

export default HarAnalyzerPage;



