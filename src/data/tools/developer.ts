import type { ToolConfig } from "../types.ts";
import { jsonFormatterTool } from "../../tools/json-formatter/index.ts";
import { harAnalyzerTool } from "../../tools/har-analyzer/index.ts";
import { htmlViewerTool } from "../../tools/html-viewer/index.ts";

export const developerTools: ToolConfig[] = [
  htmlViewerTool,
  jsonFormatterTool,
  harAnalyzerTool,

  {
    name: "JSON Validator",
    slug: "json-validator",
    description: "Validate JSON and detect syntax errors instantly.",
    seoTitle: "Free JSON Validator Tool",
    category: "developer-tools",
    icon: "check-circle",

    inputs: [
      {
        name: "jsonInput",
        label: "JSON Input",
        type: "textarea",
        placeholder: '{"key":"value"}',
        helperText: "Paste JSON directly, or upload a .json file below."
      },
      {
        name: "jsonFile",
        label: "Upload JSON File",
        type: "file",
        accept: ".json,application/json",
        loadsInto: "jsonInput",
        helperText: "Upload a JSON file to validate it instantly."
      }
    ],

    results: [
      { label: "Validation Result", key: "validationResult" },
      { label: "Error Details", key: "errorDetails" },
      { label: "Formatted JSON", key: "formattedJson" }
    ],

    logic: "jsonValidator",

    instructions: [
      "Paste JSON into the input box",
      "Run validation",
      "View errors if JSON is invalid"
    ],

    examples: [
      {
        input: { jsonInput: '{"name":"John"}' }
      }
    ],

    explanation:
      "A JSON Validator checks whether the syntax of a JSON string follows the JSON standard. It identifies issues such as missing quotes, incorrect brackets, or trailing commas.",

    faqs: [
      {
        question: "What makes JSON invalid?",
        answer:
          "Common issues include missing quotation marks, trailing commas, incorrect nesting, or mismatched brackets."
      }
    ],

    tags: ["json", "validator", "developer"],
    related: ["json-formatter"]
  },

  {
    name: "Base64 Encoder Decoder",
    slug: "base64-encoder-decoder",
    description: "Encode text to Base64 or decode Base64 strings instantly.",
    seoTitle: "Base64 Encoder Decoder Online",
    category: "developer-tools",
    icon: "lock",
    featured: true,

    inputs: [
      {
        name: "textInput",
        label: "Text or Base64 Input",
        type: "textarea",
        placeholder: "Enter text or Base64 value",
        required: true
      },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        options: [
          { label: "Encode", value: "encode" },
          { label: "Decode", value: "decode" }
        ],
        defaultValue: "encode"
      }
    ],

    results: [
      { label: "Result", key: "result" }
    ],

    logic: "base64",

    instructions: [
      "Enter text or Base64 string",
      "Choose encode or decode",
      "Run the tool"
    ],

    examples: [
      {
        input: {
          textInput: "hello",
          mode: "encode"
        },
        description: "Encoding simple text"
      }
    ],

    explanation:
      "Base64 encoding converts binary data into ASCII text format. It is commonly used for transmitting binary data over text-based systems such as email, APIs, and data URLs.",

    faqs: [
      {
        question: "Why use Base64 encoding?",
        answer:
          "It allows binary data like images or files to be transmitted over text-only channels."
      }
    ],

    tags: ["base64", "encode", "decode", "developer"]
  },

  {
    name: "URL Encoder Decoder",
    slug: "url-encoder-decoder",
    description: "Encode or decode URLs for safe transmission.",
    seoTitle: "URL Encoder Decoder Online Tool",
    category: "developer-tools",
    icon: "link",

    inputs: [
      {
        name: "textInput",
        label: "URL or Text",
        type: "textarea",
        placeholder: "https://example.com?q=hello world",
        required: true
      },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        options: [
          { label: "Encode", value: "encode" },
          { label: "Decode", value: "decode" }
        ],
        defaultValue: "encode"
      }
    ],

    results: [
      { label: "Result", key: "result" }
    ],

    logic: "urlEncode",

    instructions: [
      "Paste URL or text",
      "Choose encode or decode",
      "View converted output"
    ],

    examples: [
      {
        input: {
          textInput: "hello world",
          mode: "encode"
        }
      }
    ],

    explanation:
      "URL encoding replaces unsafe ASCII characters with percent-encoded equivalents to ensure URLs remain valid across browsers and servers.",

    faqs: [
      {
        question: "Why encode URLs?",
        answer:
          "Characters like spaces, ?, &, and = can break URLs if not encoded properly."
      }
    ],

    tags: ["url", "encode", "decode", "developer"]
  },

  {
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate random UUID v4 identifiers instantly.",
    seoTitle: "UUID Generator Online",
    category: "developer-tools",
    icon: "hash",
    featured: true,

    inputs: [
      {
        name: "count",
        label: "Number of UUIDs",
        type: "number",
        defaultValue: "1",
        min: 1,
        max: 100,
        step: 1
      }
    ],

    results: [
      { label: "Generated UUIDs", key: "uuids" }
    ],

    logic: "uuidGenerator",

    instructions: [
      "Enter how many UUIDs you want",
      "Generate identifiers",
      "Copy the output"
    ],

    examples: [
      {
        input: { count: "1" }
      }
    ],

    explanation:
      "UUID version 4 generates universally unique identifiers using random numbers. They are widely used for database IDs, tokens, and distributed systems.",

    faqs: [
      {
        question: "Are UUIDs unique?",
        answer:
          "The chance of collision is extremely small, making UUIDs effectively unique."
      }
    ],

    tags: ["uuid", "generator", "developer"]
  }
];
