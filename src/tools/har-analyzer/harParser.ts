import { parseHarEntries, type HarEntry } from "./harDependencyAnalyzer";

export type { HarEntry };
export type { Initiator, RequestNode, CompareHarGraphsResult, GraphDiagnostics } from "./harDependencyAnalyzer";
export {
  buildDependencyGraph,
  compareHarGraphs,
  getInitiatorChain,
  buildGraphDiagnostics,
  parseHarEntries,
} from "./harDependencyAnalyzer";

export function extractHarEntries(harData: unknown): HarEntry[] {
  return parseHarEntries(harData);
}

export function parseHarContent(fileContent: string): HarEntry[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(fileContent);
  } catch {
    throw new Error("The uploaded file is not valid JSON.");
  }

  return parseHarEntries(parsed);
}
