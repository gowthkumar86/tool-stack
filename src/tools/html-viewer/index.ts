import { Suspense, createElement, lazy } from "react";

import type { ToolConfig } from "@/data/types";

const HtmlViewerTool = lazy(() => import("./HtmlViewerTool"));

export const htmlViewerTool: ToolConfig = {
  name: "HTML Viewer Tool",
  slug: "html-viewer",
  description:
    "Paste raw HTML or upload an HTML file to render a live preview in a sandboxed iframe.",
  seoTitle: "HTML Viewer Tool | Live HTML Preview Playground",
  category: "developer-tools",
  icon: "code",
  featured: true,
  inputs: [],
  results: [],
  logic: "jsonFormatter",
  renderTool: () =>
    createElement(
      Suspense,
      {
        fallback: createElement("div", { className: "rounded-xl border bg-card p-6 text-sm text-muted-foreground" }, "Loading HTML Viewer...")
      },
      createElement(HtmlViewerTool)
    ),
  explanation:
    "This HTML Viewer gives developers a lightweight playground for testing markup without saving local files or switching into a full browser workflow. It supports direct paste, file upload, sandboxed previewing, and quick utility actions like formatting, copying, and downloading.",
  faqs: [
    {
      question: "Is the HTML preview sandboxed?",
      answer:
        "Yes. The preview runs inside a sandboxed iframe, and scripts stay disabled unless you explicitly enable them."
    },
    {
      question: "Can I upload an HTML file instead of pasting code?",
      answer:
        "Yes. You can upload a .html file and load it directly into the editor and preview panel."
    },
    {
      question: "Does malformed HTML still render?",
      answer:
        "Usually yes. Browsers are tolerant of invalid markup, so the viewer will still attempt to render the content."
    }
  ],
  instructions: [
    "Paste raw HTML into the editor or upload a .html file",
    "Render manually or turn on auto preview for live updates",
    "Use source view, device presets, and utility actions to inspect the result"
  ],
  examples: [
    {
      input: {}
    }
  ],
  tags: ["html", "viewer", "preview", "sandboxed iframe", "developer"],
  related: ["json-formatter", "base64-encoder-decoder"]
};
