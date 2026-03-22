import type { ToolConfig, ToolInput } from "@/data/types";

interface ToolLongFormCopy {
  whatItDoes: string[];
  whenToUseIntro: string;
  whenToUseBullets: string[];
  exampleUsage: string;
  benefits: string[];
}

const categoryAudience: Record<string, string> = {
  "developer-tools": "developers, QA testers, and technical teams",
  "text-tools": "writers, editors, students, and support teams",
  converters: "people who need fast unit and format conversions",
  finance: "people making everyday price, budget, or payment checks",
  health: "people tracking personal wellness numbers",
  "date-tools": "people planning schedules, events, and timelines",
};

const categoryDescriptor: Record<string, string> = {
  "developer-tools": "developer utility",
  "text-tools": "text tool",
  converters: "online converter",
  finance: "online calculator",
  health: "health calculator",
  "date-tools": "date tool",
};

function joinList(values: string[]) {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function normalizeSentence(text: string) {
  if (!text) return "";
  return text.trim().endsWith(".") ? text.trim() : `${text.trim()}.`;
}

function getInputLabels(inputs: ToolInput[]) {
  return inputs
    .filter((input) => input.type !== "file")
    .slice(0, 3)
    .map((input) => input.label.toLowerCase());
}

function getResultLabels(tool: ToolConfig) {
  return tool.results.slice(0, 3).map((result) => result.label.toLowerCase());
}

function formatExampleValue(value: unknown) {
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 48 ? `${trimmed.slice(0, 45)}...` : trimmed;
  }
  if (value === null || value === undefined) return "value";
  return "value";
}

function formatExample(tool: ToolConfig) {
  const example = tool.examples?.[0]?.input;
  if (!example) return "";

  const entries = Object.entries(example).slice(0, 2);
  if (entries.length === 0) return "";

  const labelled = entries.map(([key, value]) => {
    const label = tool.inputs.find((input) => input.name === key)?.label ?? key;
    return `${label.toLowerCase()} as "${formatExampleValue(value)}"`;
  });

  return joinList(labelled);
}

function buildWhenToUseBullets(tool: ToolConfig) {
  const inputSummary = getInputLabels(tool.inputs);
  const resultSummary = getResultLabels(tool);

  return [
    inputSummary.length > 0
      ? `When you want to check ${joinList(inputSummary)} quickly without setting up a spreadsheet`
      : "When you need a fast input-to-output workflow without extra setup",
    resultSummary.length > 0
      ? `When you want a clear readout of ${joinList(resultSummary)} to copy into docs or reports`
      : "When you need consistent results you can reuse across tasks",
    `When you need a reliable ${categoryDescriptor[tool.category] ?? "online tool"} in the browser during time-sensitive work`,
  ];
}

function buildBenefits(tool: ToolConfig) {
  const resultSummary = getResultLabels(tool);
  const benefits = [
    "Runs directly in the browser with no installation required",
    "Keeps the workflow simple with labeled inputs and instant feedback",
    "Easy to repeat for multiple scenarios or quick sanity checks",
  ];

  if (resultSummary.length > 0) {
    benefits.push(`Provides a structured output for ${joinList(resultSummary)}`);
  } else {
    benefits.push("Produces clear results you can copy or reuse immediately");
  }

  return benefits.slice(0, 4);
}

export function getToolLongFormCopy(tool: ToolConfig): ToolLongFormCopy {
  const audience = categoryAudience[tool.category] ?? "people who need quick answers";
  const descriptor = categoryDescriptor[tool.category] ?? "online tool";
  const inputSummary = getInputLabels(tool.inputs);
  const resultSummary = getResultLabels(tool);
  const instructionSummary = tool.instructions?.slice(0, 3).map((step) => step.toLowerCase()) ?? [];
  const exampleText = formatExample(tool);

  const whatItDoesFirst = [
    `The ${tool.name} is a free online ${descriptor} built for ${audience}.`,
    normalizeSentence(tool.description),
    normalizeSentence(tool.explanation),
    inputSummary.length > 0
      ? `It focuses on ${joinList(inputSummary)} to produce ${joinList(resultSummary) || "clear results"}, so you can make decisions without extra tools.`
      : `It turns your inputs into clear results, so you can move from question to answer quickly.`,
    "Because this ToolStack page runs directly in the browser, it is ideal for quick checks, repeated calculations, and lightweight workflows you want to finish in seconds.",
  ]
    .filter(Boolean)
    .join(" ");

  const whatItDoesSecond = [
    "The workflow mirrors how people use this kind of tool in day-to-day work.",
    instructionSummary.length > 0
      ? `Start by ${instructionSummary[0] || "entering your values"}, then ${instructionSummary[1] || "review the output"} and ${instructionSummary[2] || "repeat with new inputs"} to compare scenarios.`
      : "Start by entering your values, review the output, and repeat with new inputs to compare scenarios.",
    "This makes the tool practical for quick reviews, QA checks, and clear communication, since each run is easy to reproduce and the inputs are explicit.",
    "Whether you are double-checking a number, cleaning up content, or validating a format, the tool keeps the process lightweight while still delivering dependable results.",
  ]
    .filter(Boolean)
    .join(" ");

  const whenToUseIntro = `Use the ${tool.name} when you need a fast, reliable way to answer a focused question without interrupting your workflow. It works well on desktop or mobile and is designed for quick turnarounds, especially when you are comparing multiple scenarios or validating inputs before sharing results.`;

  const exampleUsage = exampleText
    ? `Example: enter ${exampleText}. The tool will generate ${joinList(resultSummary) || "the results"} immediately so you can copy, compare, or document the outputs with confidence.`
    : `Example: enter your values, run the tool, and review the ${joinList(resultSummary) || "results"} right away. Use the output to confirm a calculation or capture a baseline for later checks.`;

  return {
    whatItDoes: [whatItDoesFirst, whatItDoesSecond],
    whenToUseIntro,
    whenToUseBullets: buildWhenToUseBullets(tool),
    exampleUsage,
    benefits: buildBenefits(tool),
  };
}

export function getToolFaqs(tool: ToolConfig) {
  const inputSummary = getInputLabels(tool.inputs);
  const resultSummary = getResultLabels(tool);
  const instructionSummary = tool.instructions?.slice(0, 2) ?? [];

  const generated = [
    {
      question: `What does the ${tool.name} do?`,
      answer: `${normalizeSentence(tool.description)} It focuses on ${joinList(inputSummary) || "your inputs"} to produce ${joinList(resultSummary) || "clear results"}.`,
    },
    {
      question: `What inputs does the ${tool.name} need?`,
      answer: inputSummary.length > 0
        ? `Provide ${joinList(inputSummary)} and the tool will calculate the ${joinList(resultSummary) || "results"} automatically.`
        : "Provide your values in the input fields and the tool will calculate the results automatically.",
    },
    {
      question: "How should I use the tool for the best results?",
      answer: instructionSummary.length > 0
        ? `Follow the guided steps: ${instructionSummary.map((step) => step.replace(/\.$/, "")).join(", ")}.`
        : "Enter your values, run the tool, and review the results. Repeat with new inputs if you need comparisons.",
    },
    {
      question: "Is this tool free and browser-based?",
      answer: "Yes. ToolStack tools run directly in the browser, so you can use them instantly without installing software.",
    },
    {
      question: "When should I use this tool instead of a spreadsheet?",
      answer: "Use it when you want a fast, focused answer without building formulas or templates in another app.",
    },
  ];

  const merged = [...(tool.faqs ?? []), ...generated].filter(
    (faq, index, list) =>
      faq.question.trim().length > 0 &&
      list.findIndex((item) => item.question.toLowerCase() === faq.question.toLowerCase()) === index
  );

  if (merged.length >= 3) {
    return merged.slice(0, 5);
  }

  return merged.concat(generated).slice(0, 3);
}
