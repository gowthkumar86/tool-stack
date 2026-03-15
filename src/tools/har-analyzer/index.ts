import { Suspense, createElement, lazy } from "react";

import type { ToolConfig } from "../../data/types.ts";
import { analyzeHarText, compareHarTexts } from "./analysis.ts";

const HarAnalyzerResult = lazy(() => import("./HarAnalyzerResult.tsx"));

export const harAnalyzerTool: ToolConfig = {
  name: "HAR File Analyzer & Comparator",
  slug: "har-file-analyzer",
  description:
    "Upload one or two HAR files to inspect slow requests, failed APIs, third-party dependencies, and network bottlenecks across environments.",
  seoTitle: "HAR File Analyzer and HAR Comparison Tool",
  category: "developer-tools",
  icon: "activity",
  featured: true,
  inputs: [
    {
      name: "harFileA",
      label: "HAR File A",
      type: "file",
      accept: ".har,.json,application/json",
      required: true,
      helperText: "Upload a HAR file for single-file analysis or the baseline HAR for comparison."
    },
    {
      name: "harFileB",
      label: "HAR File B (Optional)",
      type: "file",
      accept: ".har,.json,application/json",
      helperText: "Upload a second HAR file to compare another IP, environment, or network."
    },
    {
      name: "requestFilter",
      label: "Request Filter",
      type: "select",
      defaultValue: "all",
      options: [
        { label: "All requests", value: "all" },
        { label: "API endpoints only", value: "api" }
      ],
      helperText: "Use API-only mode to focus on backend endpoints under /api."
    },
    {
      name: "regressionThresholdMs",
      label: "Regression Threshold",
      type: "number",
      defaultValue: "500",
      min: 50,
      step: 50,
      unit: "ms",
      helperText: "Matched requests slower than this threshold in HAR B will be flagged as regressions."
    }
  ],
  results: [{ label: "HAR Analysis Report", key: "report" }],
  logic: "jsonFormatter",
  run: (values) => {
    const harTextA = values.harFileA?.trim();
    const harTextB = values.harFileB?.trim();
    const requestFilter = values.requestFilter === "api" ? "api" : "all";
    const thresholdMs = Number(values.regressionThresholdMs || "500");

    if (!harTextA) {
      throw new Error("Upload at least one HAR file to analyze.");
    }

    const report = harTextB
      ? compareHarTexts(
          harTextA,
          harTextB,
          "HAR A",
          "HAR B",
          Number.isFinite(thresholdMs) ? thresholdMs : 500,
          requestFilter
        )
      : analyzeHarText(harTextA, "HAR A", requestFilter);

    return {
      report,
      exportJson: JSON.stringify(report, null, 2)
    };
  },
  renderResult: (result) =>
    createElement(
      Suspense,
      {
        fallback: createElement("p", { className: "text-sm text-muted-foreground" }, "Loading HAR report...")
      },
      createElement(HarAnalyzerResult, { result })
    ),
  getCopyText: (result) => String(result.exportJson ?? ""),
  instructions: [
    "Upload one HAR file for a standalone audit, or upload two HAR files for side-by-side comparison.",
    "Optionally filter to /api requests when you only want backend-focused diagnostics.",
    "Review summary cards, slow requests, bottleneck reports, and missing request sections to isolate environment-specific issues."
  ],
  examples: [
    {
      input: {
        requestFilter: "all",
        regressionThresholdMs: "500"
      },
      description: "Compare full-page HAR captures from two networks."
    }
  ],
  explanation:
    "A HAR analyzer turns browser network captures into a structured performance report. This tool normalizes requests, groups them by URL and domain, spots slow or duplicate calls, highlights third-party impact, and compares two captures to show where one environment is slower, missing assets, or failing requests.",
  faqs: [
    {
      question: "How are requests matched across two HAR files?",
      answer:
        "The comparison uses a strict method plus full URL key, which helps surface exact request-level differences between environments."
    },
    {
      question: "What does the network bottleneck detector look for?",
      answer:
        "It checks whether DNS, connection, wait, or receive time dominates each request so you can tell whether the slowdown is likely DNS resolution, connection setup, backend processing, or payload transfer."
    },
    {
      question: "Can I compare two HAR files from different networks or IPs?",
      answer:
        "Yes. That is the primary use case, especially when a site behaves differently across VPNs, CDNs, office networks, mobile hotspots, or regional exits."
    }
  ],
  tags: [
    "har analyzer",
    "har comparison",
    "network waterfall",
    "performance debugging",
    "developer"
  ],
  related: ["json-formatter", "json-validator"]
};
