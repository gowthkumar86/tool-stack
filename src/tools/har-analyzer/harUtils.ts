import type { HarEntry } from "./harParser";

export function getStatusCounts(entries: HarEntry[]): Record<string, number> {
  const statusCounts: Record<string, number> = {};

  entries.forEach((entry) => {
    const statusKey = String(entry.response.status || 0);
    statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
  });

  return statusCounts;
}

export function getSlowRequests(entries: HarEntry[]): HarEntry[] {
  return entries.filter((entry) => entry.time > 1000).sort((a, b) => b.time - a.time);
}
