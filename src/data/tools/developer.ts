import type { ToolConfig } from "../types.ts";
export const developerTools: ToolConfig[] = [
  {
    name: "JSON Formatter", slug: "json-formatter",
    description: "Format and beautify your JSON data.",
    category: "developer-tools", resultLabel: "Formatted JSON", featured: true,
    inputs: [{ name: "jsonInput", label: "JSON Input", type: "textarea", placeholder: '{"key": "value"}' }],
    logic: "jsonFormatter", tags: ["json", "format", "developer"],
    explanation: "Paste raw JSON and get it formatted with proper indentation for readability.",
    faqs: [
      { question: "What is JSON?", answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format." },
    ],
  },
  {
    name: "JSON Validator", slug: "json-validator",
    description: "Validate if your JSON is correctly formatted.",
    category: "developer-tools", resultLabel: "Validation Result",
    inputs: [{ name: "jsonInput", label: "JSON Input", type: "textarea", placeholder: '{"key": "value"}' }],
    logic: "jsonValidator", tags: ["json", "validate", "developer"],
    explanation: "Checks whether the provided text is valid JSON and reports any syntax errors.",
    faqs: [
      { question: "What makes JSON invalid?", answer: "Missing quotes, trailing commas, or incorrect brackets make JSON invalid." },
    ],
  },
  {
    name: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder",
    description: "Encode text to Base64 or decode Base64 to text.",
    category: "developer-tools", resultLabel: "Result", featured: true,
    inputs: [
      { name: "textInput", label: "Text / Base64 Input", type: "textarea", placeholder: "Enter text or Base64 string" },
      { name: "mode", label: "Mode (encode or decode)", type: "text", placeholder: "encode", defaultValue: "encode" },
    ],
    logic: "base64", tags: ["base64", "encode", "decode"],
    explanation: "Base64 encoding converts binary data to ASCII text. Useful for embedding data in URLs or emails.",
    faqs: [
      { question: "When should I use Base64?", answer: "Use Base64 when you need to transmit binary data over text-based protocols." },
    ],
  },
  {
    name: "URL Encoder/Decoder", slug: "url-encoder-decoder",
    description: "Encode or decode URL components.",
    category: "developer-tools", resultLabel: "Result",
    inputs: [
      { name: "textInput", label: "URL / Text Input", type: "textarea", placeholder: "https://example.com?q=hello world" },
      { name: "mode", label: "Mode (encode or decode)", type: "text", placeholder: "encode", defaultValue: "encode" },
    ],
    logic: "urlEncode", tags: ["url", "encode", "decode"],
    explanation: "URL encoding replaces special characters with percent-encoded equivalents for safe transmission.",
    faqs: [
      { question: "Why encode URLs?", answer: "Special characters like spaces and & can break URLs if not encoded." },
    ],
  },
  {
    name: "JWT Decoder", slug: "jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
    category: "developer-tools", resultLabel: "Decoded JWT", featured: true,
    inputs: [{ name: "token", label: "JWT Token", type: "textarea", placeholder: "eyJhbGciOiJIUzI1NiIs..." }],
    logic: "jwtDecoder", tags: ["jwt", "token", "auth"],
    explanation: "A JWT consists of three Base64-encoded parts: header, payload, and signature.",
    faqs: [
      { question: "Is it safe to decode JWTs here?", answer: "Yes, decoding happens entirely in your browser. Nothing is sent to any server." },
    ],
  },
  {
    name: "Regex Tester", slug: "regex-tester",
    description: "Test regular expressions against sample text.",
    category: "developer-tools", resultLabel: "Matches",
    inputs: [
      { name: "pattern", label: "Regex Pattern", type: "text", placeholder: "e.g. \\d+" },
      { name: "flags", label: "Flags", type: "text", placeholder: "g", defaultValue: "g" },
      { name: "testString", label: "Test String", type: "textarea", placeholder: "Enter text to test against" },
    ],
    logic: "regexTester", tags: ["regex", "pattern", "developer"],
    explanation: "Enter a regular expression pattern and test string to find all matches.",
    faqs: [
      { question: "What are common regex flags?", answer: "g (global), i (case-insensitive), m (multiline) are the most common." },
    ],
  },
  {
    name: "Timestamp Converter", slug: "timestamp-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    category: "developer-tools", resultLabel: "Converted Result",
    inputs: [{ name: "timestamp", label: "Unix Timestamp (seconds)", type: "number", placeholder: "e.g. 1700000000" }],
    logic: "timestampConverter", tags: ["timestamp", "unix", "date"],
    explanation: "Unix timestamp is the number of seconds since January 1, 1970 (UTC).",
    faqs: [
      { question: "What is epoch time?", answer: "Epoch time (Unix time) counts seconds from Jan 1, 1970 00:00:00 UTC." },
    ],
  },
  {
    name: "UUID Generator", slug: "uuid-generator",
    description: "Generate random UUIDs (v4).",
    category: "developer-tools", resultLabel: "Generated UUID", featured: true,
    inputs: [{ name: "count", label: "Number of UUIDs", type: "number", placeholder: "1", defaultValue: "1" }],
    logic: "uuidGenerator", tags: ["uuid", "id", "generator"],
    explanation: "UUID v4 generates universally unique identifiers using random numbers.",
    faqs: [
      { question: "Are UUIDs truly unique?", answer: "The probability of collision is astronomically low — practically impossible." },
    ],
  },
  {
    name: "Slug Generator", slug: "slug-generator",
    description: "Convert text to URL-friendly slugs.",
    category: "developer-tools", resultLabel: "Generated Slug",
    inputs: [{ name: "textInput", label: "Text Input", type: "text", placeholder: "My Blog Post Title" }],
    logic: "slugGenerator", tags: ["slug", "url", "seo"],
    explanation: "Slugs are URL-friendly versions of text: lowercase, hyphenated, no special characters.",
    faqs: [
      { question: "What is a slug?", answer: "A slug is the URL-friendly version of a title, e.g. 'my-blog-post'." },
    ],
  },
  {
    name: "Color Converter", slug: "color-converter",
    description: "Convert colors between HEX, RGB, and HSL.",
    category: "developer-tools", resultLabel: "Converted Color",
    inputs: [{ name: "colorInput", label: "Color (HEX e.g. #ff5733)", type: "text", placeholder: "#ff5733" }],
    logic: "colorConverter", tags: ["color", "hex", "rgb", "hsl"],
    explanation: "Enter a HEX color code to see its RGB and HSL equivalents.",
    faqs: [
      { question: "What color formats are supported?", answer: "Enter a HEX color code (e.g. #ff5733) to convert." },
    ],
  },
  {
    name: "Hash Generator", slug: "hash-generator",
    description: "Generate hash values for text (SHA-256).",
    category: "developer-tools", resultLabel: "Hash Output",
    inputs: [{ name: "textInput", label: "Text Input", type: "textarea", placeholder: "Enter text to hash" }],
    logic: "hashGenerator", tags: ["hash", "sha256", "crypto"],
    explanation: "SHA-256 produces a fixed 256-bit hash value from any input text.",
    faqs: [
      { question: "Is SHA-256 reversible?", answer: "No, cryptographic hashes are one-way functions." },
    ],
  },
  {
    name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator",
    description: "Generate placeholder Lorem Ipsum text.",
    category: "developer-tools", resultLabel: "Generated Text",
    inputs: [{ name: "paragraphs", label: "Number of Paragraphs", type: "number", placeholder: "3", defaultValue: "3" }],
    logic: "loremIpsum", tags: ["lorem", "placeholder", "text"],
    explanation: "Lorem Ipsum is dummy text used in design and development as a placeholder.",
    faqs: [
      { question: "What is Lorem Ipsum?", answer: "It's scrambled Latin text used as placeholder content since the 1500s." },
    ],
  },
];
