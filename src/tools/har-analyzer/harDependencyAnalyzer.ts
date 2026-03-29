export interface Initiator {
  type?: string;
  url?: string;
  stack?: unknown;
}

export interface HarEntry {
  startedDateTime?: string;
  time: number;
  request: {
    method?: string;
    url: string;
  };
  response: {
    status: number;
    statusText?: string;
  };
  initiator?: Initiator;
}

export interface RequestNode {
  id: string;
  url: string;
  method?: string;
  status: number;
  time: number;
  initiator?: Initiator;
  parentId?: string;
  childrenIds: string[];
}

export interface CompareHarGraphsResult {
  foundInA: boolean;
  foundInB: boolean;
  chainA: string[];
  breakPoint?: string;
  reason: string;
}

export interface GraphDiagnostics {
  byDomain: Map<string, RequestNode[]>;
  duplicatesByUrl: Map<string, RequestNode[]>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function toFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeUrl(url: string): string {
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

function getOrigin(url: string): string | undefined {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

function getDomain(url: string): string | undefined {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function isLikelyScriptUrl(url: string): boolean {
  const normalized = url.toLowerCase();
  return normalized.endsWith(".js") || normalized.includes("/script") || normalized.includes("webpack");
}

function addToMapArray(map: Map<string, string[]>, key: string, value: string): void {
  const existing = map.get(key);
  if (existing) {
    existing.push(value);
    return;
  }
  map.set(key, [value]);
}

function chooseMostRecentCandidate(
  candidateIds: string[],
  childId: string,
  orderById: Map<string, number>,
  graph: Map<string, RequestNode>,
): string | undefined {
  const childOrder = orderById.get(childId);
  if (childOrder === undefined) {
    return undefined;
  }

  const ranked = candidateIds
    .filter((candidateId) => candidateId !== childId)
    .map((candidateId) => ({ candidateId, order: orderById.get(candidateId) }))
    .filter((item): item is { candidateId: string; order: number } => item.order !== undefined && item.order < childOrder)
    .sort((a, b) => b.order - a.order);

  for (const item of ranked) {
    if (!wouldCreateCycle(item.candidateId, childId, graph)) {
      return item.candidateId;
    }
  }

  return undefined;
}

function wouldCreateCycle(potentialParentId: string, childId: string, graph: Map<string, RequestNode>): boolean {
  let cursor: string | undefined = potentialParentId;
  const seen = new Set<string>();

  while (cursor) {
    if (cursor === childId) {
      return true;
    }

    if (seen.has(cursor)) {
      // A pre-existing loop means this path is unsafe.
      return true;
    }

    seen.add(cursor);
    const node = graph.get(cursor);
    cursor = node?.parentId;
  }

  return false;
}

function parseInitiator(rawInitiator: unknown): Initiator | undefined {
  if (!isObject(rawInitiator)) {
    return undefined;
  }

  const type = toOptionalString(rawInitiator.type);
  const url = toOptionalString(rawInitiator.url);
  const stack = hasOwn(rawInitiator, "stack") ? rawInitiator.stack : undefined;

  if (!type && !url && stack === undefined) {
    return undefined;
  }

  return { type, url, stack };
}

function buildNodeId(entry: HarEntry, index: number): string {
  const method = (entry.request.method ?? "UNKNOWN").toUpperCase();
  return `req-${index}-${method}`;
}

interface IndexedGraph {
  byExactUrl: Map<string, RequestNode[]>;
  byNormalizedUrl: Map<string, RequestNode[]>;
  byDomain: Map<string, RequestNode[]>;
}

function indexGraph(graph: Map<string, RequestNode>): IndexedGraph {
  const byExactUrl = new Map<string, RequestNode[]>();
  const byNormalizedUrl = new Map<string, RequestNode[]>();
  const byDomain = new Map<string, RequestNode[]>();

  for (const node of graph.values()) {
    const exact = byExactUrl.get(node.url);
    if (exact) {
      exact.push(node);
    } else {
      byExactUrl.set(node.url, [node]);
    }

    const normalized = normalizeUrl(node.url);
    const byNorm = byNormalizedUrl.get(normalized);
    if (byNorm) {
      byNorm.push(node);
    } else {
      byNormalizedUrl.set(normalized, [node]);
    }

    const domain = getDomain(node.url);
    if (domain) {
      const byDomainNodes = byDomain.get(domain);
      if (byDomainNodes) {
        byDomainNodes.push(node);
      } else {
        byDomain.set(domain, [node]);
      }
    }
  }

  return { byExactUrl, byNormalizedUrl, byDomain };
}

function findNodesByUrl(url: string, index: IndexedGraph): RequestNode[] {
  const exact = index.byExactUrl.get(url);
  if (exact && exact.length > 0) {
    return exact;
  }

  const normalized = index.byNormalizedUrl.get(normalizeUrl(url));
  if (normalized && normalized.length > 0) {
    return normalized;
  }

  return [];
}

function selectBestCandidate(nodes: RequestNode[], graph: Map<string, RequestNode>): RequestNode {
  if (nodes.length === 1) {
    return nodes[0];
  }

  const ranked = nodes
    .map((node) => ({
      node,
      chainLength: getInitiatorChain(node.id, graph).length,
    }))
    .sort((a, b) => {
      if (b.chainLength !== a.chainLength) {
        return b.chainLength - a.chainLength;
      }

      if (b.node.time !== a.node.time) {
        return b.node.time - a.node.time;
      }

      return b.node.status - a.node.status;
    });

  return ranked[0].node;
}

function reasonForMissingStep(
  missingNode: RequestNode,
  targetNode: RequestNode,
  indexInChain: number,
  chainLength: number,
  graphIndexB: IndexedGraph,
): string {
  const missingDomain = getDomain(missingNode.url);
  const targetDomain = getDomain(targetNode.url);

  if (isLikelyScriptUrl(missingNode.url)) {
    return `initiator not loaded: ${missingNode.url} is missing in HAR B.`;
  }

  if (missingDomain && !graphIndexB.byDomain.has(missingDomain)) {
    if (targetDomain && missingDomain !== targetDomain) {
      return `third-party dependency missing: ${missingDomain} does not appear in HAR B.`;
    }
    return `domain missing: ${missingDomain} does not appear in HAR B.`;
  }

  if (indexInChain < chainLength - 1) {
    return `execution path broken: initiator step ${missingNode.url} was not observed in HAR B.`;
  }

  return `execution path broken: target request ${missingNode.url} was not observed in HAR B.`;
}

function reasonForStatusMismatch(stepA: RequestNode, stepB: RequestNode): string {
  if (stepA.status < 400 && stepB.status >= 400) {
    return `request blocked or failed: ${stepA.url} returned ${stepA.status} in HAR A but ${stepB.status} in HAR B.`;
  }

  return `status differs on dependency chain: ${stepA.url} returned ${stepA.status} in HAR A and ${stepB.status} in HAR B.`;
}

export function parseHarEntries(harData: unknown): HarEntry[] {
  if (!isObject(harData)) {
    throw new Error("Invalid HAR file. Root data must be an object.");
  }

  const log = harData.log;
  if (!isObject(log)) {
    throw new Error("Invalid HAR file. Missing log section.");
  }

  const rawEntries = log.entries;
  if (!Array.isArray(rawEntries)) {
    throw new Error("Invalid HAR file. Missing entries array.");
  }

  const parsedEntries: HarEntry[] = [];

  rawEntries.forEach((rawEntry, index) => {
    if (!isObject(rawEntry)) {
      return;
    }

    const request = isObject(rawEntry.request) ? rawEntry.request : {};
    const response = isObject(rawEntry.response) ? rawEntry.response : {};
    const rawInitiator = isObject(rawEntry._initiator)
      ? rawEntry._initiator
      : isObject(rawEntry.initiator)
        ? rawEntry.initiator
        : undefined;

    const safeUrl = toOptionalString(request.url) ?? `Unknown URL #${index}`;
    const entry: HarEntry = {
      startedDateTime: toOptionalString(rawEntry.startedDateTime),
      time: toFiniteNumber(rawEntry.time, 0),
      request: {
        method: toOptionalString(request.method),
        url: safeUrl,
      },
      response: {
        status: toFiniteNumber(response.status, 0),
        statusText: toOptionalString(response.statusText),
      },
      initiator: parseInitiator(rawInitiator),
    };

    parsedEntries.push(entry);
  });

  return parsedEntries;
}

export function buildDependencyGraph(entries: HarEntry[]): Map<string, RequestNode> {
  const graph = new Map<string, RequestNode>();
  const orderById = new Map<string, number>();

  const exactUrlToIds = new Map<string, string[]>();
  const normalizedUrlToIds = new Map<string, string[]>();
  const originToIds = new Map<string, string[]>();
  const successfulGetIds: string[] = [];

  entries.forEach((entry, index) => {
    const id = buildNodeId(entry, index);
    const node: RequestNode = {
      id,
      url: entry.request.url,
      method: entry.request.method,
      status: entry.response.status,
      time: entry.time,
      initiator: entry.initiator,
      childrenIds: [],
    };

    graph.set(id, node);
    orderById.set(id, index);

    addToMapArray(exactUrlToIds, node.url, id);
    addToMapArray(normalizedUrlToIds, normalizeUrl(node.url), id);

    const origin = getOrigin(node.url);
    if (origin) {
      addToMapArray(originToIds, origin, id);
    }

    const method = (node.method ?? "GET").toUpperCase();
    if (method === "GET" && node.status > 0 && node.status < 400) {
      successfulGetIds.push(id);
    }
  });

  const orderedNodes = Array.from(graph.values()).sort((a, b) => (orderById.get(a.id) ?? 0) - (orderById.get(b.id) ?? 0));

  for (const node of orderedNodes) {
    const candidateGroups: string[][] = [];

    const initiatorUrl = node.initiator?.url;
    if (initiatorUrl) {
      const exactCandidates = exactUrlToIds.get(initiatorUrl);
      if (exactCandidates) {
        candidateGroups.push(exactCandidates);
      }

      const normalizedCandidates = normalizedUrlToIds.get(normalizeUrl(initiatorUrl));
      if (normalizedCandidates) {
        candidateGroups.push(normalizedCandidates);
      }

      const initiatorOrigin = getOrigin(initiatorUrl);
      if (initiatorOrigin) {
        const originCandidates = originToIds.get(initiatorOrigin);
        if (originCandidates) {
          candidateGroups.push(originCandidates);
        }
      }
    }

    if (candidateGroups.length === 0) {
      const nodeOrigin = getOrigin(node.url);
      if (nodeOrigin) {
        const sameOriginCandidates = originToIds.get(nodeOrigin);
        if (sameOriginCandidates) {
          candidateGroups.push(sameOriginCandidates);
        }
      }

      if (successfulGetIds.length > 0) {
        candidateGroups.push(successfulGetIds);
      }
    }

    const seenCandidates = new Set<string>();
    for (const group of candidateGroups) {
      const deduped = group.filter((candidateId) => {
        if (seenCandidates.has(candidateId)) {
          return false;
        }
        seenCandidates.add(candidateId);
        return true;
      });

      const parentId = chooseMostRecentCandidate(deduped, node.id, orderById, graph);
      if (!parentId) {
        continue;
      }

      const parentNode = graph.get(parentId);
      if (!parentNode) {
        continue;
      }

      node.parentId = parentId;
      if (!parentNode.childrenIds.includes(node.id)) {
        parentNode.childrenIds.push(node.id);
      }
      break;
    }
  }

  return graph;
}

export function getInitiatorChain(nodeId: string, graph: Map<string, RequestNode>): RequestNode[] {
  const startNode = graph.get(nodeId);
  if (!startNode) {
    return [];
  }

  const chainFromLeaf: RequestNode[] = [];
  const seen = new Set<string>();
  let cursor: RequestNode | undefined = startNode;

  while (cursor) {
    if (seen.has(cursor.id)) {
      break;
    }

    seen.add(cursor.id);
    chainFromLeaf.push(cursor);

    if (!cursor.parentId) {
      break;
    }

    cursor = graph.get(cursor.parentId);
  }

  return chainFromLeaf.reverse();
}

export function compareHarGraphs(
  graphA: Map<string, RequestNode>,
  graphB: Map<string, RequestNode>,
  targetUrl: string,
): CompareHarGraphsResult {
  const indexedA = indexGraph(graphA);
  const indexedB = indexGraph(graphB);

  const targetCandidatesInA = findNodesByUrl(targetUrl, indexedA);
  const targetCandidatesInB = findNodesByUrl(targetUrl, indexedB);

  const foundInA = targetCandidatesInA.length > 0;
  const foundInB = targetCandidatesInB.length > 0;

  if (!foundInA) {
    return {
      foundInA: false,
      foundInB,
      chainA: [],
      reason: `Target URL is not present in HAR A: ${targetUrl}`,
    };
  }

  const bestTargetInA = selectBestCandidate(targetCandidatesInA, graphA);
  const chainNodesA = getInitiatorChain(bestTargetInA.id, graphA);
  const chainA = chainNodesA.map((node) => node.url);

  for (let i = 0; i < chainNodesA.length; i += 1) {
    const stepInA = chainNodesA[i];
    const stepCandidatesInB = findNodesByUrl(stepInA.url, indexedB);

    if (stepCandidatesInB.length === 0) {
      return {
        foundInA,
        foundInB,
        chainA,
        breakPoint: stepInA.url,
        reason: reasonForMissingStep(stepInA, bestTargetInA, i, chainNodesA.length, indexedB),
      };
    }

    const bestStepInB = selectBestCandidate(stepCandidatesInB, graphB);
    if (stepInA.status !== bestStepInB.status) {
      return {
        foundInA,
        foundInB,
        chainA,
        breakPoint: stepInA.url,
        reason: reasonForStatusMismatch(stepInA, bestStepInB),
      };
    }
  }

  if (!foundInB) {
    const parentInA = chainNodesA.length > 1 ? chainNodesA[chainNodesA.length - 2] : undefined;

    return {
      foundInA,
      foundInB,
      chainA,
      breakPoint: parentInA?.url,
      reason: parentInA
        ? `execution path broken after ${parentInA.url}; dependency chain exists in HAR B but target request was not fired.`
        : "execution path broken: target request was not fired in HAR B.",
    };
  }

  return {
    foundInA,
    foundInB,
    chainA,
    reason: "Target request exists in both HARs and no initiator-chain break was detected.",
  };
}

export function buildGraphDiagnostics(graph: Map<string, RequestNode>): GraphDiagnostics {
  const byDomain = new Map<string, RequestNode[]>();
  const byUrl = new Map<string, RequestNode[]>();

  for (const node of graph.values()) {
    const domain = getDomain(node.url) ?? "unknown-domain";
    const domainNodes = byDomain.get(domain);
    if (domainNodes) {
      domainNodes.push(node);
    } else {
      byDomain.set(domain, [node]);
    }

    const urlNodes = byUrl.get(node.url);
    if (urlNodes) {
      urlNodes.push(node);
    } else {
      byUrl.set(node.url, [node]);
    }
  }

  const duplicatesByUrl = new Map<string, RequestNode[]>();
  for (const [url, nodes] of byUrl) {
    if (nodes.length > 1) {
      duplicatesByUrl.set(url, nodes);
    }
  }

  return { byDomain, duplicatesByUrl };
}
