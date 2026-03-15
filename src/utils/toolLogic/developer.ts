import { ToolLogicHandler } from "./shared";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export const developerToolLogic: Record<string, ToolLogicHandler> = {
  jsonFormatter: (_values, { str }) => {
    try {
      const formatted = JSON.stringify(
        JSON.parse(str("jsonInput")),
        null,
        2
      );

      return { formattedJson: formatted };
    } catch (e) {
      return { formattedJson: "âŒ Invalid JSON: " + (e as Error).message };
    }
  },

  jsonValidator: (_values, { str }) => {
    const source = str("jsonInput").trim();

    if (!source) {
      return {
        validationResult: "No JSON provided",
        errorDetails: "Paste JSON or upload a JSON file."
      };
    }

    try {
      const parsed = JSON.parse(source);

      return {
        validationResult: "Valid JSON",
        formattedJson: JSON.stringify(parsed, null, 2)
      };
    } catch (e) {
      return {
        validationResult: "Invalid JSON",
        errorDetails: (e as Error).message
      };
    }
  },

  base64: (_values, { str }) => {
    const mode = str("mode").toLowerCase();
    const input = str("textInput");

    if (mode === "decode") {
      try {
        return { result: atob(input) };
      } catch {
        return { result: "âŒ Invalid Base64 input" };
      }
    }

    return { result: btoa(input) };
  },

  urlEncode: (_values, { str }) => {
    const mode = str("mode").toLowerCase();
    const input = str("textInput");

    return {
      result:
        mode === "decode"
          ? decodeURIComponent(input)
          : encodeURIComponent(input)
    };
  },

  jwtDecoder: (_values, { str }) => {
    try {
      const parts = str("token").split(".");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      return {
        header: JSON.stringify(header, null, 2),
        payload: JSON.stringify(payload, null, 2)
      };
    } catch {
      return { result: "âŒ Invalid JWT token" };
    }
  },

  regexTester: (_values, { str }) => {
    try {
      const re = new RegExp(str("pattern"), str("flags"));
      const matches = str("testString").match(re);

      return {
        matches: matches
          ? `Found ${matches.length} match(es):\n${matches.join("\n")}`
          : "No matches found."
      };
    } catch (e) {
      return { matches: "âŒ Invalid regex: " + (e as Error).message };
    }
  },

  timestampConverter: (_values, { num }) => {
    const ts = num("timestamp");
    const d = new Date(ts * 1000);

    return {
      utc: d.toUTCString(),
      local: d.toLocaleString()
    };
  },

  uuidGenerator: (_values, { num }) => {
    const count = Math.min(Math.max(1, num("count") || 1), 100);

    return {
      uuids: Array.from(
        { length: count },
        () => crypto.randomUUID()
      ).join("\n")
    };
  },

  slugGenerator: (_values, { str }) => {
    const slug = str("textInput")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return { slug };
  },

  colorConverter: (_values, { str }) => {
    const hex = str("colorInput").replace("#", "");

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      return { result: "âŒ Enter a valid HEX color (e.g. #ff5733)" };
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;

      s = l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);

      if (max === rn) {
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      } else if (max === gn) {
        h = ((bn - rn) / d + 2) / 6;
      } else {
        h = ((rn - gn) / d + 4) / 6;
      }
    }

    return {
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    };
  },

  hashGenerator: (_values, { str }) => {
    const text = str("textInput");
    let hash = 5381;

    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
    }

    return {
      hash: hash.toString(16)
    };
  },

  loremIpsum: (_values, { num }) => {
    const count = Math.min(Math.max(1, num("paragraphs") || 1), 20);

    return {
      text: Array.from({ length: count }, () => LOREM).join("\n\n")
    };
  }
};


