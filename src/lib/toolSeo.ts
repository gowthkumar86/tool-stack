import type { ToolConfig } from "@/data/types";
import { categories } from "@/data/categories";
import { SITE_NAME, toAbsoluteUrl } from "@/lib/site";

interface ToolSeoCopy {
  title: string;
  description: string;
  keywords: string[];
  introParagraph: string;
  features: string[];
  useCases: string[];
  whatIsHeading: string;
  howToHeading: string;
  featuresHeading: string;
  useCasesHeading: string;
}

interface ToolSeoOverride {
  title?: string;
  description?: string;
  introParagraph?: string;
  features?: string[];
  useCases?: string[];
}

const toolOverrides: Record<string, ToolSeoOverride> = {
  "json-formatter": {
    title: "JSON Viewer Online - Format, Search and Explore JSON | ToolStack",
    description:
      "View, format, and search JSON data with ToolStack's free JSON viewer online. Explore nested objects and arrays in a clean tree view.",
    introParagraph:
      "ToolStack JSON Viewer is a free online tool for developers who need to inspect structured data quickly. Paste raw JSON or upload a file to turn minified payloads into a readable tree view in the browser. The viewer makes nested objects, arrays, keys, and values easier to scan than plain text, which helps during API debugging, config review, and payload validation. Because everything runs online, you can work through large responses without installing desktop software or switching between editors. Use this JSON viewer online to search deeply nested fields, understand parent-child relationships, and copy formatted output when you need to share clean data with teammates.",
    features: [
      "Collapsible JSON tree viewer for nested objects and arrays",
      "Search keys, values, and deeply nested fields in large payloads",
      "Paste raw JSON or upload a .json file directly in the browser",
      "Copy formatted output for debugging, documentation, or sharing",
    ],
    useCases: [
      "Inspect API responses from REST or GraphQL services during debugging",
      "Review exported configuration files or webhook payloads before deployment",
      "Search large JSON documents when tracing missing fields or incorrect values",
    ],
  },
  "html-viewer": {
    title: "HTML Viewer Online - Live HTML Preview Tool | ToolStack",
    description:
      "Preview HTML instantly with ToolStack's free HTML viewer online. Paste markup, upload files, and test layouts in a sandboxed browser preview.",
    introParagraph:
      "ToolStack HTML Viewer is a free online HTML preview tool built for developers, testers, and content teams who need to check markup quickly. Paste raw HTML or upload a local file to render a live preview inside a sandboxed iframe without opening a separate project. This browser-based developer utility is useful for checking snippets from emails, CMS blocks, landing pages, and template files before they go live. It keeps the workflow lightweight while still giving you a safe place to review formatting, structure, and rendered output. When you want a fast HTML preview tool for debugging or validation, this page lets you inspect markup and iterate without changing your existing application code.",
    features: [
      "Live HTML preview in a sandboxed iframe for safer testing",
      "Supports direct paste and local HTML file upload",
      "Useful for checking snippets, templates, email markup, and small layouts",
      "Browser-based workflow with no setup or local dev server required",
    ],
    useCases: [
      "Preview HTML snippets copied from CMS editors or email builders",
      "Check rendered layout before embedding markup in an application or template",
      "Validate quick changes to landing page sections without opening a full project",
    ],
  },
  "har-file-analyzer": {
    title: "HAR File Analyzer Online - Compare Network Performance | ToolStack",
    description:
      "Analyze HAR files online with ToolStack's free HAR analyzer. Compare two captures, inspect slow requests, and debug network bottlenecks faster.",
    introParagraph:
      "ToolStack HAR File Analyzer is a free online developer utility for understanding browser network captures without digging through raw HAR JSON manually. Upload one HAR file to audit slow requests, failed APIs, third-party calls, and waterfall bottlenecks, or upload two files to compare environments side by side. This HAR file analyzer online is especially helpful when a page behaves differently across VPNs, office networks, staging, and production. Instead of scanning thousands of request entries, you get a clearer report that surfaces the biggest delays and regressions first. Use it to speed up performance investigations, identify problematic endpoints, and share a structured network analysis with teammates.",
    features: [
      "Single-file HAR audit for slow requests, errors, and third-party impact",
      "Two-file comparison to spot regressions across networks or environments",
      "API-only filtering when you want backend-focused diagnostics",
      "Structured output that is easier to review than raw HAR JSON",
    ],
    useCases: [
      "Compare staging and production HAR captures to find request regressions",
      "Audit a slow page load and identify the domains or endpoints causing delays",
      "Investigate environment-specific API failures across VPN, office, or mobile networks",
    ],
  },
};

const categoryAudience: Record<string, string> = {
  "developer-tools": "developers, testers, and technical teams",
  "text-tools": "writers, editors, students, and support teams",
  converters: "people who need quick unit and format conversions",
  finance: "people handling prices, budgets, and everyday calculations",
  health: "people tracking everyday wellness numbers",
  "date-tools": "people planning schedules, events, and timelines",
};

const categoryLabel: Record<string, string> = {
  "developer-tools": "developer utility",
  "text-tools": "text tool",
  converters: "online converter",
  finance: "online calculator",
  health: "health calculator",
  "date-tools": "date calculator",
};

const categoryKeywordSeed: Record<string, string[]> = {
  "developer-tools": ["online developer tool", "developer utility", "free developer tool"],
  "text-tools": ["online text tool", "free text utility", "browser-based text tool"],
  converters: ["online converter", "free conversion tool", "browser-based converter"],
  finance: ["online calculator", "free calculator", "browser-based calculator"],
  health: ["online health calculator", "free health tool", "browser-based calculator"],
  "date-tools": ["online date calculator", "free date tool", "browser-based date tool"],
};

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function joinList(values: string[]) {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function getCategoryName(categorySlug: string) {
  return categories.find((category) => category.slug === categorySlug)?.name ?? titleCaseFromSlug(categorySlug);
}

export function getToolPath(tool: ToolConfig) {
  return `/${tool.slug}`;
}

export function getLegacyToolPath(tool: ToolConfig) {
  return `/tools/${tool.slug}`;
}

export function getToolUrl(tool: ToolConfig) {
  return toAbsoluteUrl(getToolPath(tool));
}

export function getToolKeywords(tool: ToolConfig) {
  const baseKeywords = [
    tool.name,
    `${tool.name} online`,
    `free ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} tool`,
    getCategoryName(tool.category),
    ...categoryKeywordSeed[tool.category],
    ...(tool.tags ?? []),
  ];

  return Array.from(new Set(baseKeywords));
}

function buildGenericTitle(tool: ToolConfig) {
  const descriptor = categoryLabel[tool.category] ?? "online tool";
  return `${tool.name} Online - Free ${descriptor} | ${SITE_NAME}`;
}

function buildGenericDescription(tool: ToolConfig) {
  const descriptor = categoryLabel[tool.category] ?? "online tool";
  return `Use ToolStack's free ${tool.name.toLowerCase()} online. ${tool.description} Fast, browser-based ${descriptor} with instant results.`;
}

function buildGenericIntro(tool: ToolConfig) {
  const audience = categoryAudience[tool.category] ?? "people who need fast answers";
  const descriptor = categoryLabel[tool.category] ?? "online tool";
  const firstInstruction = tool.instructions?.[0]?.replace(/\.$/, "").toLowerCase();
  const secondInstruction = tool.instructions?.[1]?.replace(/\.$/, "").toLowerCase();
  const exampleHint = tool.examples?.[0]?.description?.toLowerCase();

  return `${tool.name} is a free online ${descriptor} built for ${audience}. ${tool.description} ${tool.explanation} Because this ToolStack page runs directly in the browser, you can work through inputs and results without installing extra software or signing up for another service. It is especially useful when you need to ${firstInstruction || "test values quickly"}, ${secondInstruction || "review the output immediately"}, or move through repetitive tasks faster. ${exampleHint ? `A common scenario is ${exampleHint}. ` : ""}Whether you are handling quick checks or day-to-day workflows, this free tool keeps the process simple, fast, and easy to repeat.`;
}

function buildGenericFeatures(tool: ToolConfig) {
  const inputSummary = tool.inputs
    .filter((input) => input.type !== "file")
    .slice(0, 3)
    .map((input) => input.label.toLowerCase());
  const resultSummary = tool.results.slice(0, 3).map((result) => result.label.toLowerCase());

  return [
    `Free online ${tool.name.toLowerCase()} that works directly in your browser`,
    inputSummary.length > 0
      ? `Supports ${joinList(inputSummary)} so you can enter values and test scenarios quickly`
      : `Simple browser-based interface designed for quick input and fast feedback`,
    resultSummary.length > 0
      ? `Instant output for ${joinList(resultSummary)}`
      : `Fast results designed for everyday browser-based workflows`,
    tool.instructions?.[0]
      ? `Guided workflow: ${tool.instructions[0].replace(/\.$/, "")}`
      : `Useful for repeated checks, debugging, and everyday productivity tasks`,
  ];
}

function buildGenericUseCases(tool: ToolConfig) {
  const category = tool.category;

  if (category === "developer-tools") {
    return [
      `Debug data, payloads, or encoded content during frontend and backend development`,
      `Check inputs and outputs before sharing results with teammates or clients`,
      `Use a fast browser-based developer utility when you do not want to open a larger local setup`,
    ];
  }

  if (category === "text-tools") {
    return [
      `Clean or review text before publishing, sending, or pasting it elsewhere`,
      `Handle repetitive editing tasks faster when working with long text blocks`,
      `Use a simple online tool for writing, support, documentation, or classroom work`,
    ];
  }

  if (category === "converters") {
    return [
      `Convert values while working with measurements, documents, or reports`,
      `Double-check unit changes before entering numbers into other systems`,
      `Use a quick free tool when you need reliable conversions without extra apps`,
    ];
  }

  if (category === "finance") {
    return [
      `Estimate costs, payments, savings, or price changes before making a decision`,
      `Check everyday finance numbers for loans, bills, taxes, or discounts`,
      `Use a browser-based calculator when you need fast answers on desktop or mobile`,
    ];
  }

  if (category === "health") {
    return [
      `Review everyday wellness metrics such as BMI, calories, hydration, or sleep timing`,
      `Compare inputs quickly when planning routines or tracking progress`,
      `Use a lightweight health calculator without downloading a separate app`,
    ];
  }

  return [
    `Plan dates, schedules, and timelines with fast browser-based calculations`,
    `Check differences and countdowns before booking, planning, or reporting`,
    `Use a free date tool when you need quick answers without spreadsheet formulas`,
  ];
}

export function getToolSeoCopy(tool: ToolConfig): ToolSeoCopy {
  const override = toolOverrides[tool.slug];

  return {
    title: override?.title ?? (tool.seoTitle ? `${tool.seoTitle} | ${SITE_NAME}` : buildGenericTitle(tool)),
    description: override?.description ?? buildGenericDescription(tool),
    keywords: getToolKeywords(tool),
    introParagraph: override?.introParagraph ?? buildGenericIntro(tool),
    features: override?.features ?? buildGenericFeatures(tool),
    useCases: override?.useCases ?? buildGenericUseCases(tool),
    whatIsHeading: `What is this ${tool.name}?`,
    howToHeading: `How to use this ${tool.name}`,
    featuresHeading: `Features of this ${tool.name}`,
    useCasesHeading: `Example use cases for ${tool.name}`,
  };
}
