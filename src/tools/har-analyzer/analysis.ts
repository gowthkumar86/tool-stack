export interface HarTimingBreakdown {
  dns: number;
  connect: number;
  ssl: number;
  wait: number;
  receive: number;
}

export interface NormalizedHarRequest {
  key: string;
  url: string;
  method: string;
  domain: string;
  status: number;
  size: number;
  time: number;
  timings: HarTimingBreakdown;
  mimeType: string;
  startedDateTime: string;
  path: string;
  comparableDomain: string;
}

export interface HarSummary {
  totalRequests: number;
  totalDataTransferred: number;
  totalLoadTime: number;
  failedRequests: number;
  redirectCount: number;
  cumulativeRequestTime: number;
}

export interface HarTableRow {
  key: string;
  label: string;
  domain?: string;
  count?: number;
  status?: number;
  time?: number;
  size?: number;
  totalTime?: number;
  totalSize?: number;
}

export interface DomainAnalysisRow {
  domain: string;
  requests: number;
  totalTime: number;
  totalSize: number;
}

export interface BottleneckCategorySummary {
  type: "dns" | "connect" | "wait" | "receive";
  count: number;
  message: string;
}

export interface BottleneckHotspot {
  key: string;
  label: string;
  domain: string;
  time: number;
  dominantPhase: "dns" | "connect" | "wait" | "receive";
  dominantRatio: number;
}

export interface NetworkBottleneckReport {
  summary: BottleneckCategorySummary[];
  hotspots: BottleneckHotspot[];
}

export interface DuplicateRequestRow {
  key: string;
  label: string;
  count: number;
  wastedBandwidth: number;
  wastedTime: number;
}

export interface DuplicateRequestReport {
  duplicateRequestCount: number;
  wastedBandwidth: number;
  wastedTime: number;
  rows: DuplicateRequestRow[];
}

export interface ThirdPartyDomainRow {
  domain: string;
  requests: number;
  totalTime: number;
  totalSize: number;
  percentageOfTime: number;
}

export interface ThirdPartyReport {
  primaryDomain: string;
  primaryComparableDomain: string;
  totalThirdPartyRequests: number;
  totalThirdPartyTime: number;
  totalThirdPartySize: number;
  percentageOfTotalTime: number;
  rows: ThirdPartyDomainRow[];
}

export interface SingleHarAnalysis {
  mode: "single";
  fileLabel: string;
  requestFilter: "all" | "api";
  summary: HarSummary;
  slowRequests: HarTableRow[];
  largePayloads: HarTableRow[];
  statusBreakdown: Array<{ status: string; count: number }>;
  domainAnalysis: DomainAnalysisRow[];
  bottlenecks: NetworkBottleneckReport;
  duplicates: DuplicateRequestReport;
  thirdParty: ThirdPartyReport;
}

export interface MatchedRequestComparison {
  key: string;
  label: string;
  domain: string;
  statusA: number;
  statusB: number;
  timeA: number;
  timeB: number;
  sizeA: number;
  sizeB: number;
  timeDiff: number;
  sizeDiff: number;
  timingsA: HarTimingBreakdown;
  timingsB: HarTimingBreakdown;
}

export interface TimingDifferenceRow {
  key: string;
  label: string;
  domain: string;
  component: keyof HarTimingBreakdown;
  a: number;
  b: number;
  diff: number;
}

export interface ComparisonSummaryRow {
  metric: string;
  a: number;
  b: number;
}

export interface HarComparisonAnalysis {
  mode: "comparison";
  requestFilter: "all" | "api";
  thresholdMs: number;
  summary: ComparisonSummaryRow[];
  harA: {
    fileLabel: string;
    summary: HarSummary;
    primaryDomain: string;
  };
  harB: {
    fileLabel: string;
    summary: HarSummary;
    primaryDomain: string;
  };
  matchedRequests: MatchedRequestComparison[];
  regressions: MatchedRequestComparison[];
  sizeDifferences: MatchedRequestComparison[];
  statusDifferences: MatchedRequestComparison[];
  missingInB: HarTableRow[];
  missingInA: HarTableRow[];
  timingDifferences: TimingDifferenceRow[];
  bottleneckSummary: string[];
}

interface ParsedHarFile {
  fileLabel: string;
  requests: NormalizedHarRequest[];
  summary: HarSummary;
  primaryDomain: string;
  primaryComparableDomain: string;
}

interface HarEntryLike {
  request?: {
    url?: string;
    method?: string;
  };
  response?: {
    status?: number;
    bodySize?: number;
    content?: {
      mimeType?: string;
      size?: number;
    };
  };
  timings?: Partial<Record<keyof HarTimingBreakdown, number>>;
  startedDateTime?: string;
  time?: number;
}

interface HarLogLike {
  log?: {
    entries?: HarEntryLike[];
  };
}

const KB = 1024;
const MB = 1024 * KB;

export function analyzeHarText(
  harText: string,
  fileLabel: string,
  requestFilter: "all" | "api" = "all"
): SingleHarAnalysis {
  const parsed = parseHarFile(harText, fileLabel, requestFilter);

  return {
    mode: "single",
    fileLabel,
    requestFilter,
    summary: parsed.summary,
    slowRequests: toSlowRequestRows(parsed.requests),
    largePayloads: toLargePayloadRows(parsed.requests),
    statusBreakdown: buildStatusBreakdown(parsed.requests),
    domainAnalysis: buildDomainAnalysis(parsed.requests),
    bottlenecks: detectNetworkBottlenecks(parsed.requests),
    duplicates: detectDuplicateRequests(parsed.requests),
    thirdParty: detectThirdPartyRequests(
      parsed.requests,
      parsed.primaryDomain,
      parsed.primaryComparableDomain
    )
  };
}

export function compareHarTexts(
  harTextA: string,
  harTextB: string,
  fileLabelA: string,
  fileLabelB: string,
  thresholdMs = 500,
  requestFilter: "all" | "api" = "all"
): HarComparisonAnalysis {
  const parsedA = parseHarFile(harTextA, fileLabelA, requestFilter);
  const parsedB = parseHarFile(harTextB, fileLabelB, requestFilter);

  const requestMapA = new Map(parsedA.requests.map((request) => [request.key, request]));
  const requestMapB = new Map(parsedB.requests.map((request) => [request.key, request]));
  const matchedRequests: MatchedRequestComparison[] = [];
  const missingInB: HarTableRow[] = [];
  const missingInA: HarTableRow[] = [];

  for (const requestA of parsedA.requests) {
    const requestB = requestMapB.get(requestA.key);

    if (!requestB) {
      missingInB.push(toRequestRow(requestA));
      continue;
    }

    matchedRequests.push({
      key: requestA.key,
      label: requestA.path,
      domain: requestA.domain,
      statusA: requestA.status,
      statusB: requestB.status,
      timeA: requestA.time,
      timeB: requestB.time,
      sizeA: requestA.size,
      sizeB: requestB.size,
      timeDiff: requestB.time - requestA.time,
      sizeDiff: requestB.size - requestA.size,
      timingsA: requestA.timings,
      timingsB: requestB.timings
    });
  }

  for (const requestB of parsedB.requests) {
    if (!requestMapA.has(requestB.key)) {
      missingInA.push(toRequestRow(requestB));
    }
  }

  const regressions = matchedRequests
    .filter(
      (request) =>
        request.timeDiff >= thresholdMs &&
        request.timeB >= request.timeA * 1.3
    )
    .sort((a, b) => b.timeDiff - a.timeDiff)
    .slice(0, 15);

  const sizeDifferences = matchedRequests
    .filter(
      (request) =>
        Math.abs(request.sizeDiff) >= 50 * KB &&
        Math.abs(request.sizeDiff) >= Math.max(request.sizeA, 1) * 0.2
    )
    .sort((a, b) => Math.abs(b.sizeDiff) - Math.abs(a.sizeDiff))
    .slice(0, 15);

  const statusDifferences = matchedRequests
    .filter((request) => request.statusA !== request.statusB)
    .sort((a, b) => Math.abs(b.timeDiff) - Math.abs(a.timeDiff))
    .slice(0, 15);

  const timingDifferences = buildTimingDifferences(matchedRequests);

  return {
    mode: "comparison",
    requestFilter,
    thresholdMs,
    summary: [
      { metric: "Total Requests", a: parsedA.summary.totalRequests, b: parsedB.summary.totalRequests },
      { metric: "Total Data Transferred", a: parsedA.summary.totalDataTransferred, b: parsedB.summary.totalDataTransferred },
      { metric: "Total Page Load Time", a: parsedA.summary.totalLoadTime, b: parsedB.summary.totalLoadTime },
      { metric: "Failed Requests", a: parsedA.summary.failedRequests, b: parsedB.summary.failedRequests },
      { metric: "Redirect Count", a: parsedA.summary.redirectCount, b: parsedB.summary.redirectCount }
    ],
    harA: {
      fileLabel: fileLabelA,
      summary: parsedA.summary,
      primaryDomain: parsedA.primaryDomain
    },
    harB: {
      fileLabel: fileLabelB,
      summary: parsedB.summary,
      primaryDomain: parsedB.primaryDomain
    },
    matchedRequests: matchedRequests
      .sort((a, b) => Math.abs(b.timeDiff) - Math.abs(a.timeDiff))
      .slice(0, 20),
    regressions,
    sizeDifferences,
    statusDifferences,
    missingInB: missingInB.slice(0, 20),
    missingInA: missingInA.slice(0, 20),
    timingDifferences,
    bottleneckSummary: buildComparisonSummary(parsedA, parsedB, regressions, statusDifferences, timingDifferences)
  };
}

export function parseHarFile(
  harText: string,
  fileLabel: string,
  requestFilter: "all" | "api" = "all"
): ParsedHarFile {
  let parsedHar: HarLogLike;

  try {
    parsedHar = JSON.parse(harText) as HarLogLike;
  } catch (error) {
    throw new Error(`"${fileLabel}" is not valid JSON: ${(error as Error).message}`);
  }

  const rawEntries = parsedHar.log?.entries;

  if (!Array.isArray(rawEntries)) {
    throw new Error(`"${fileLabel}" does not contain a valid har.log.entries array.`);
  }

  const requests = rawEntries
    .map(normalizeHarEntry)
    .filter((request): request is NormalizedHarRequest => request !== null)
    .filter((request) =>
      requestFilter === "api" ? request.path.startsWith("/api") : true
    );

  if (requests.length === 0) {
    throw new Error(
      requestFilter === "api"
        ? `"${fileLabel}" contains no /api requests.`
        : `"${fileLabel}" contains no supported HAR requests.`
    );
  }

  const domainCounts = buildCountMap(requests.map((request) => request.comparableDomain));
  const primaryComparableDomain = getTopCountKey(domainCounts) || requests[0].comparableDomain;
  const primaryDomain =
    requests.find((request) => request.comparableDomain === primaryComparableDomain)?.domain ||
    requests[0].domain;

  return {
    fileLabel,
    requests,
    summary: buildSummary(requests),
    primaryDomain,
    primaryComparableDomain
  };
}

function normalizeHarEntry(entry: HarEntryLike): NormalizedHarRequest | null {
  const url = entry.request?.url;
  const method = entry.request?.method?.toUpperCase();

  if (!url || !method) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  const timings = {
    dns: normalizeTiming(entry.timings?.dns),
    connect: normalizeTiming(entry.timings?.connect),
    ssl: normalizeTiming(entry.timings?.ssl),
    wait: normalizeTiming(entry.timings?.wait),
    receive: normalizeTiming(entry.timings?.receive)
  };

  const providedTime = normalizeTiming(entry.time);
  const totalTime =
    providedTime ||
    timings.dns + timings.connect + timings.ssl + timings.wait + timings.receive;
  const size = Math.max(
    0,
    entry.response?.bodySize ?? entry.response?.content?.size ?? 0
  );
  const path = parsedUrl.pathname + parsedUrl.search;

  return {
    key: `${method} ${url}`,
    url,
    method,
    domain: parsedUrl.hostname,
    status: entry.response?.status ?? 0,
    size,
    time: totalTime,
    timings,
    mimeType: entry.response?.content?.mimeType ?? "unknown",
    startedDateTime: entry.startedDateTime ?? "",
    path,
    comparableDomain: toComparableDomain(parsedUrl.hostname)
  };
}

function normalizeTiming(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

function buildSummary(requests: NormalizedHarRequest[]): HarSummary {
  const totalRequests = requests.length;
  const totalDataTransferred = requests.reduce((sum, request) => sum + request.size, 0);
  const cumulativeRequestTime = requests.reduce((sum, request) => sum + request.time, 0);
  const failedRequests = requests.filter((request) => request.status >= 400).length;
  const redirectCount = requests.filter((request) => request.status === 301 || request.status === 302).length;
  const loadSpan = calculateLoadSpan(requests);

  return {
    totalRequests,
    totalDataTransferred,
    totalLoadTime: loadSpan || cumulativeRequestTime,
    failedRequests,
    redirectCount,
    cumulativeRequestTime
  };
}

function calculateLoadSpan(requests: NormalizedHarRequest[]) {
  const timestamps = requests
    .map((request) => Date.parse(request.startedDateTime))
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return 0;
  }

  const start = Math.min(...timestamps);
  const end = Math.max(
    ...requests.map((request) => {
      const startTime = Date.parse(request.startedDateTime);
      return Number.isFinite(startTime) ? startTime + request.time : start;
    })
  );

  return Math.max(0, end - start);
}

function toSlowRequestRows(requests: NormalizedHarRequest[]) {
  return [...requests]
    .sort((a, b) => b.time - a.time)
    .slice(0, 10)
    .map(toRequestRow);
}

function toLargePayloadRows(requests: NormalizedHarRequest[]) {
  return [...requests]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .map(toRequestRow);
}

function toRequestRow(request: NormalizedHarRequest): HarTableRow {
  return {
    key: request.key,
    label: request.path,
    domain: request.domain,
    status: request.status,
    time: request.time,
    size: request.size
  };
}

function buildStatusBreakdown(requests: NormalizedHarRequest[]) {
  return Array.from(
    requests.reduce((map, request) => {
      const key = String(request.status);
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => Number(a.status) - Number(b.status));
}

function buildDomainAnalysis(requests: NormalizedHarRequest[]): DomainAnalysisRow[] {
  const groups = new Map<string, DomainAnalysisRow>();

  for (const request of requests) {
    const current = groups.get(request.domain) ?? {
      domain: request.domain,
      requests: 0,
      totalTime: 0,
      totalSize: 0
    };

    current.requests += 1;
    current.totalTime += request.time;
    current.totalSize += request.size;
    groups.set(request.domain, current);
  }

  return Array.from(groups.values()).sort((a, b) => b.totalTime - a.totalTime);
}

export function detectNetworkBottlenecks(
  requests: NormalizedHarRequest[]
): NetworkBottleneckReport {
  const counters = {
    dns: 0,
    connect: 0,
    wait: 0,
    receive: 0
  };

  const hotspots = requests
    .map((request) => {
      const dominantPhase = getDominantPhase(request);
      const dominantRatio = request.time > 0 ? request.timings[dominantPhase] / request.time : 0;

      if (request.time === 0) {
        return null;
      }

      if (request.timings.wait / request.time > 0.6) {
        counters.wait += 1;
      }

      if (request.timings.dns / request.time > 0.2) {
        counters.dns += 1;
      }

      if (request.timings.connect / request.time > 0.25) {
        counters.connect += 1;
      }

      if (request.timings.receive / request.time > 0.35) {
        counters.receive += 1;
      }

      return {
        key: request.key,
        label: request.path,
        domain: request.domain,
        time: request.time,
        dominantPhase,
        dominantRatio
      } satisfies BottleneckHotspot;
    })
    .filter((request): request is BottleneckHotspot => request !== null)
    .sort((a, b) => b.dominantRatio - a.dominantRatio)
    .slice(0, 12);

  const summary: BottleneckCategorySummary[] = [
    {
      type: "wait",
      count: counters.wait,
      message: `${counters.wait} requests have excessive wait time (>60%), suggesting slow backend processing.`
    },
    {
      type: "dns",
      count: counters.dns,
      message: `${counters.dns} requests show high DNS latency.`
    },
    {
      type: "connect",
      count: counters.connect,
      message: `${counters.connect} requests spend unusually long connecting, pointing to network latency.`
    },
    {
      type: "receive",
      count: counters.receive,
      message: `${counters.receive} requests are dominated by receive time, often caused by large payloads or slow transfer throughput.`
    }
  ].filter((item) => item.count > 0);

  return {
    summary,
    hotspots
  };
}

function getDominantPhase(request: NormalizedHarRequest): keyof HarTimingBreakdown {
  const candidates: Array<keyof HarTimingBreakdown> = ["dns", "connect", "wait", "receive"];

  return candidates.reduce((best, phase) =>
    request.timings[phase] > request.timings[best] ? phase : best
  , "wait");
}

export function detectDuplicateRequests(
  requests: NormalizedHarRequest[]
): DuplicateRequestReport {
  const groups = new Map<string, NormalizedHarRequest[]>();

  for (const request of requests) {
    const current = groups.get(request.key) ?? [];
    current.push(request);
    groups.set(request.key, current);
  }

  const rows = Array.from(groups.entries())
    .filter(([, entries]) => entries.length > 1)
    .map(([key, entries]) => {
      const duplicateEntries = entries.slice(1);

      return {
        key,
        label: entries[0]?.path ?? key,
        count: entries.length,
        wastedBandwidth: duplicateEntries.reduce((sum, request) => sum + request.size, 0),
        wastedTime: duplicateEntries.reduce((sum, request) => sum + request.time, 0)
      } satisfies DuplicateRequestRow;
    })
    .sort((a, b) => b.wastedTime - a.wastedTime);

  return {
    duplicateRequestCount: rows.reduce((sum, row) => sum + (row.count - 1), 0),
    wastedBandwidth: rows.reduce((sum, row) => sum + row.wastedBandwidth, 0),
    wastedTime: rows.reduce((sum, row) => sum + row.wastedTime, 0),
    rows: rows.slice(0, 15)
  };
}

export function detectThirdPartyRequests(
  requests: NormalizedHarRequest[],
  primaryDomain: string,
  primaryComparableDomain: string
): ThirdPartyReport {
  const thirdPartyRequests = requests.filter(
    (request) => request.comparableDomain !== primaryComparableDomain
  );
  const grouped = new Map<string, ThirdPartyDomainRow>();
  const totalTime = requests.reduce((sum, request) => sum + request.time, 0);

  for (const request of thirdPartyRequests) {
    const current = grouped.get(request.domain) ?? {
      domain: request.domain,
      requests: 0,
      totalTime: 0,
      totalSize: 0,
      percentageOfTime: 0
    };

    current.requests += 1;
    current.totalTime += request.time;
    current.totalSize += request.size;
    grouped.set(request.domain, current);
  }

  const rows = Array.from(grouped.values())
    .map((row) => ({
      ...row,
      percentageOfTime: totalTime > 0 ? (row.totalTime / totalTime) * 100 : 0
    }))
    .sort((a, b) => b.totalTime - a.totalTime);

  const totalThirdPartyTime = thirdPartyRequests.reduce((sum, request) => sum + request.time, 0);
  const totalThirdPartySize = thirdPartyRequests.reduce((sum, request) => sum + request.size, 0);

  return {
    primaryDomain,
    primaryComparableDomain,
    totalThirdPartyRequests: thirdPartyRequests.length,
    totalThirdPartyTime,
    totalThirdPartySize,
    percentageOfTotalTime: totalTime > 0 ? (totalThirdPartyTime / totalTime) * 100 : 0,
    rows: rows.slice(0, 15)
  };
}

function buildTimingDifferences(
  matchedRequests: MatchedRequestComparison[]
): TimingDifferenceRow[] {
  const rows: TimingDifferenceRow[] = [];
  const components: Array<keyof HarTimingBreakdown> = ["dns", "connect", "ssl", "wait", "receive"];

  for (const request of matchedRequests) {
    for (const component of components) {
      const diff = request.timingsB[component] - request.timingsA[component];

      if (Math.abs(diff) >= 100) {
        rows.push({
          key: request.key,
          label: request.label,
          domain: request.domain,
          component,
          a: request.timingsA[component],
          b: request.timingsB[component],
          diff
        });
      }
    }
  }

  return rows.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 20);
}

function buildComparisonSummary(
  harA: ParsedHarFile,
  harB: ParsedHarFile,
  regressions: MatchedRequestComparison[],
  statusDifferences: MatchedRequestComparison[],
  timingDifferences: TimingDifferenceRow[]
) {
  const summary: string[] = [];
  const overallDelta = harA.summary.totalLoadTime
    ? ((harB.summary.totalLoadTime - harA.summary.totalLoadTime) / harA.summary.totalLoadTime) * 100
    : 0;

  if (Math.abs(overallDelta) >= 5) {
    summary.push(
      `${harB.fileLabel} is ${overallDelta > 0 ? `${Math.round(overallDelta)}% slower` : `${Math.abs(Math.round(overallDelta))}% faster`} overall than ${harA.fileLabel}.`
    );
  }

  if (regressions.length > 0) {
    summary.push(`${regressions.length} matched requests are significantly slower in ${harB.fileLabel}.`);
  }

  const failureFlips = statusDifferences.filter(
    (request) => request.statusA < 400 && request.statusB >= 400
  );

  if (failureFlips.length > 0) {
    summary.push(`${failureFlips.length} requests succeed in ${harA.fileLabel} but fail in ${harB.fileLabel}.`);
  }

  const dominantTiming = timingDifferences[0];

  if (dominantTiming && dominantTiming.diff > 0) {
    summary.push(
      `${harB.fileLabel} has noticeably higher ${dominantTiming.component.toUpperCase()} time for ${dominantTiming.label}, hinting at a ${describeTimingComponent(dominantTiming.component)} issue.`
    );
  }

  const cdnDomainsA = buildDomainAnalysis(harA.requests).filter((row) => isCdnDomain(row.domain));
  const cdnDomainsB = buildDomainAnalysis(harB.requests).filter((row) => isCdnDomain(row.domain));
  const cdnTimeA = cdnDomainsA.reduce((sum, row) => sum + row.totalTime, 0);
  const cdnTimeB = cdnDomainsB.reduce((sum, row) => sum + row.totalTime, 0);

  if (cdnTimeA > 0 && cdnTimeB > cdnTimeA * 1.2) {
    summary.push(`CDN-like domains are slower from ${harB.fileLabel}, which may indicate edge routing or network locality issues.`);
  }

  if (summary.length === 0) {
    summary.push("No major regressions were detected across the uploaded HAR files.");
  }

  return summary;
}

function describeTimingComponent(component: keyof HarTimingBreakdown) {
  switch (component) {
    case "dns":
      return "DNS resolution";
    case "connect":
    case "ssl":
      return "connection setup";
    case "wait":
      return "backend processing";
    case "receive":
      return "payload transfer";
    default:
      return "network";
  }
}

function isCdnDomain(domain: string) {
  const lower = domain.toLowerCase();
  return lower.includes("cdn") || lower.includes("static") || lower.includes("assets");
}

function buildCountMap(values: string[]) {
  return values.reduce((map, value) => {
    map.set(value, (map.get(value) ?? 0) + 1);
    return map;
  }, new Map<string, number>());
}

function getTopCountKey(countMap: Map<string, number>) {
  return Array.from(countMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function toComparableDomain(domain: string) {
  if (
    domain === "localhost" ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(domain) ||
    domain.includes(":")
  ) {
    return domain;
  }

  const parts = domain.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return domain;
  }

  return parts.slice(-2).join(".");
}

export function formatBytes(value: number) {
  if (value >= MB) {
    return `${(value / MB).toFixed(2)} MB`;
  }

  if (value >= KB) {
    return `${(value / KB).toFixed(1)} KB`;
  }

  return `${Math.round(value)} B`;
}

export function formatDuration(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} s`;
  }

  return `${Math.round(value)} ms`;
}
