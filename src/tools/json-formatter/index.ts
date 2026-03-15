import { Component, Suspense, createElement, lazy } from "react";
import type { ReactNode } from "react";
import type { ToolConfig } from "../../data/types.ts";

function JsonViewerFallback({ formattedJson }: { formattedJson: string }) {
  return createElement(
    "pre",
    { className: "text-lg font-semibold whitespace-pre-wrap break-all font-sans" },
    formattedJson
  );
}

class JsonViewerErrorBoundary extends Component<
  { children: ReactNode; formattedJson: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return createElement(JsonViewerFallback, {
        formattedJson: this.props.formattedJson
      });
    }

    return this.props.children;
  }
}

const JsonViewer = lazy(() =>
  import("./JsonViewer.tsx").catch(() => ({
    default: ({ result }: { result: { formattedJson?: string } }) =>
      createElement(JsonViewerFallback, {
        formattedJson: String(result.formattedJson ?? "")
      })
  }))
);

export const jsonFormatterTool: ToolConfig = {
  name: "JSON Viewer",
  slug: "json-formatter",
  description: "View JSON in a searchable tree format to inspect nested objects, arrays, parent-child structure, and values more easily.",
  seoTitle: "JSON Viewer Online Free | Tree View, Search Keys and Values",
  category: "developer-tools",
  icon: "code",
  featured: true,
  inputs: [
    {
      name: "jsonInput",
      label: "JSON Input",
      type: "textarea",
      placeholder: '{"name":"John","age":30,"address":{"city":"Chennai"}}',
      helperText: "Paste raw or minified JSON, or upload a .json file below."
    },
    {
      name: "jsonFile",
      label: "Upload JSON File",
      type: "file",
      accept: ".json,application/json",
      loadsInto: "jsonInput",
      helperText: "Upload a JSON file to load it into the viewer."
    }
  ],
  results: [
    { label: "JSON Viewer", key: "formattedJson" }
  ],
  logic: "jsonFormatter",
  run: (values) => {
    const source = values.jsonInput?.trim();

    if (!source) {
      throw new Error("Paste JSON or upload a JSON file.");
    }

    try {
      const parsedJson = JSON.parse(source);
      const formattedJson = JSON.stringify(parsedJson, null, 2);

      return {
        formattedJson,
        parsedJson
      };
    } catch (e) {
      throw new Error("Invalid JSON: " + (e as Error).message);
    }
  },
  renderResult: (result) =>
    createElement(
      JsonViewerErrorBoundary,
      {
        formattedJson: String(result.formattedJson ?? "")
      },
      createElement(
        Suspense,
        {
          fallback: createElement(JsonViewerFallback, {
            formattedJson: String(result.formattedJson ?? "")
          })
        },
        createElement(JsonViewer, { result })
      )
    ),
  getCopyText: (result) => String(result.formattedJson ?? ""),
  instructions: [
    "Paste your JSON into the input box or upload a JSON file",
    "Load the viewer to inspect nested objects and arrays as a tree",
    "Search any key or value to check whether it exists in the JSON"
  ],
  examples: [
    {
      input: {
        jsonInput:
          '{"name":"John","age":30,"address":{"city":"Chennai","zip":"600001"},"skills":["React","TypeScript"]}'
      },
      description: "Nested object with arrays"
    }
  ],
  explanation:
    "This JSON viewer converts raw or minified JSON into an expandable tree so nested parent-child relationships are easier to understand than in a plain text block. Built-in search lets you quickly find keys, values, and deeply nested fields in large JSON payloads.",
  faqs: [
    {
      question: "What is a JSON tree view?",
      answer:
        "A tree view presents JSON as nested expandable nodes so objects, arrays, parents, and children are easier to distinguish."
    },
    {
      question: "Can I search both keys and values?",
      answer:
        "Yes. The search box checks object keys, array indexes, and primitive values in the loaded JSON."
    },
    {
      question: "Why use a JSON viewer instead of plain formatted JSON?",
      answer:
        "A JSON viewer makes structure easier to scan by visually separating parent and child nodes, which is especially helpful for large nested API responses."
    }
  ],
  tags: ["json viewer", "json tree viewer", "json search", "developer", "tree"],
  related: ["json-validator"]
};
