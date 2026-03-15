import { ToolLogicHandler } from "./shared";

export const textToolLogic: Record<string, ToolLogicHandler> = {
  wordCounter: (_values, { str }) => {
    const text = str("textInput");
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;

    return {
      wordCount: words,
      charCount: chars,
      sentenceCount: sentences,
      paragraphCount: paragraphs
    };
  },

  charCounter: (_values, { str }) => {
    const text = str("textInput");

    return {
      withSpaces: text.length,
      withoutSpaces: text.replace(/\s/g, "").length
    };
  },

  caseConverter: (_values, { str }) => {
    const text = str("textInput");
    const type = str("caseType").toLowerCase();

    if (type === "lower") {
      return { result: text.toLowerCase() };
    }

    if (type === "title") {
      return {
        result: text.replace(
          /\w\S*/g,
          (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
        )
      };
    }

    if (type === "sentence") {
      return {
        result:
          text.charAt(0).toUpperCase() +
          text.slice(1).toLowerCase()
      };
    }

    return { result: text.toUpperCase() };
  },

  removeDuplicates: (_values, { str }) => {
    const cleaned = [
      ...new Set(str("textInput").split("\n"))
    ].join("\n");

    return { cleanedText: cleaned };
  },

  textSorter: (_values, { str }) => {
    const sorted = str("textInput")
      .split("\n")
      .sort()
      .join("\n");

    return { sortedText: sorted };
  },

  textReverser: (_values, { str }) => {
    const reversed = str("textInput")
      .split("")
      .reverse()
      .join("");

    return { reversedText: reversed };
  },

  findReplace: (_values, { str }) => {
    const result = str("textInput")
      .split(str("find"))
      .join(str("replaceWith"));

    return { result };
  },

  lineCounter: (_values, { str }) => {
    const lines = str("textInput").split("\n");
    const nonEmpty = lines.filter((l) => l.trim()).length;

    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmpty
    };
  }
};
