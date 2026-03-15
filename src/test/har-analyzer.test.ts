import { describe, expect, it } from "vitest";

import {
  analyzeHarText,
  compareHarTexts,
  formatBytes,
  formatDuration
} from "@/tools/har-analyzer/analysis";

const harA = JSON.stringify({
  log: {
    entries: [
      {
        request: { url: "https://app.example.com/", method: "GET" },
        response: { status: 200, bodySize: 1024, content: { mimeType: "text/html" } },
        timings: { dns: 20, connect: 40, ssl: 20, wait: 160, receive: 60 },
        startedDateTime: "2026-03-15T10:00:00.000Z",
        time: 300
      },
      {
        request: { url: "https://app.example.com/api/products", method: "GET" },
        response: { status: 200, bodySize: 512000, content: { mimeType: "application/json" } },
        timings: { dns: 10, connect: 20, ssl: 10, wait: 700, receive: 60 },
        startedDateTime: "2026-03-15T10:00:00.100Z",
        time: 800
      },
      {
        request: { url: "https://cdn.thirdparty.net/banner.jpg", method: "GET" },
        response: { status: 200, bodySize: 2097152, content: { mimeType: "image/jpeg" } },
        timings: { dns: 15, connect: 30, ssl: 15, wait: 80, receive: 260 },
        startedDateTime: "2026-03-15T10:00:00.200Z",
        time: 400
      },
      {
        request: { url: "https://analytics.example.net/collect", method: "POST" },
        response: { status: 204, bodySize: 200, content: { mimeType: "text/plain" } },
        timings: { dns: 5, connect: 10, ssl: 10, wait: 40, receive: 15 },
        startedDateTime: "2026-03-15T10:00:00.300Z",
        time: 80
      },
      {
        request: { url: "https://app.example.com/api/products", method: "GET" },
        response: { status: 200, bodySize: 512000, content: { mimeType: "application/json" } },
        timings: { dns: 8, connect: 18, ssl: 8, wait: 500, receive: 66 },
        startedDateTime: "2026-03-15T10:00:00.400Z",
        time: 600
      }
    ]
  }
});

const harB = JSON.stringify({
  log: {
    entries: [
      {
        request: { url: "https://app.example.com/", method: "GET" },
        response: { status: 200, bodySize: 1100, content: { mimeType: "text/html" } },
        timings: { dns: 25, connect: 70, ssl: 25, wait: 240, receive: 90 },
        startedDateTime: "2026-03-15T10:00:00.000Z",
        time: 450
      },
      {
        request: { url: "https://app.example.com/api/products", method: "GET" },
        response: { status: 500, bodySize: 256000, content: { mimeType: "application/json" } },
        timings: { dns: 15, connect: 40, ssl: 12, wait: 1300, receive: 133 },
        startedDateTime: "2026-03-15T10:00:00.100Z",
        time: 1500
      },
      {
        request: { url: "https://cdn.thirdparty.net/banner.jpg", method: "GET" },
        response: { status: 200, bodySize: 3145728, content: { mimeType: "image/jpeg" } },
        timings: { dns: 60, connect: 70, ssl: 20, wait: 200, receive: 550 },
        startedDateTime: "2026-03-15T10:00:00.200Z",
        time: 900
      },
      {
        request: { url: "https://new.tracker.io/script.js", method: "GET" },
        response: { status: 200, bodySize: 12000, content: { mimeType: "application/javascript" } },
        timings: { dns: 10, connect: 20, ssl: 10, wait: 100, receive: 40 },
        startedDateTime: "2026-03-15T10:00:00.300Z",
        time: 180
      }
    ]
  }
});

describe("HAR analyzer", () => {
  it("analyzes a single HAR file with duplicates, third parties, and bottlenecks", () => {
    const report = analyzeHarText(harA, "HAR A");

    expect(report.summary.totalRequests).toBe(5);
    expect(report.summary.failedRequests).toBe(0);
    expect(report.slowRequests[0]?.label).toBe("/api/products");
    expect(report.largePayloads[0]?.size).toBe(2097152);
    expect(report.duplicates.duplicateRequestCount).toBe(1);
    expect(report.duplicates.rows[0]?.label).toBe("/api/products");
    expect(report.thirdParty.totalThirdPartyRequests).toBe(2);
    expect(report.bottlenecks.summary.some((item) => item.type === "wait")).toBe(true);
  });

  it("compares two HAR files and flags regressions, failures, and missing requests", () => {
    const report = compareHarTexts(harA, harB, "HAR A", "HAR B", 500);

    expect(report.regressions.some((item) => item.label === "/api/products")).toBe(true);
    expect(report.statusDifferences.some((item) => item.statusA === 200 && item.statusB === 500)).toBe(true);
    expect(report.missingInA.some((item) => item.label === "/script.js")).toBe(true);
    expect(report.missingInB.some((item) => item.label === "/collect")).toBe(true);
    expect(report.bottleneckSummary.length).toBeGreaterThan(0);
  });

  it("formats durations and sizes for display", () => {
    expect(formatDuration(1500)).toBe("1.50 s");
    expect(formatBytes(2048)).toBe("2.0 KB");
  });
});
