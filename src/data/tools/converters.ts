import type { ToolConfig } from "../types.ts";
export const converterTools: ToolConfig[] = [
  {
    name: "Km to Miles Converter", slug: "km-to-miles",
    description: "Convert kilometers to miles and vice versa.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 100" },
      { name: "direction", label: "Direction (km-to-miles or miles-to-km)", type: "text", placeholder: "km-to-miles", defaultValue: "km-to-miles" },
    ],
    logic: "kmMiles", tags: ["distance", "km", "miles"],
    explanation: "1 kilometer = 0.621371 miles. 1 mile = 1.60934 kilometers.",
    faqs: [{ question: "How many miles in a km?", answer: "1 km ≈ 0.6214 miles." }],
  },
  {
    name: "Kg to Lbs Converter", slug: "kg-to-lbs",
    description: "Convert kilograms to pounds and vice versa.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 70" },
      { name: "direction", label: "Direction (kg-to-lbs or lbs-to-kg)", type: "text", placeholder: "kg-to-lbs", defaultValue: "kg-to-lbs" },
    ],
    logic: "kgLbs", tags: ["weight", "kg", "lbs"],
    explanation: "1 kilogram = 2.20462 pounds. 1 pound = 0.453592 kilograms.",
    faqs: [{ question: "How many lbs in a kg?", answer: "1 kg ≈ 2.2046 lbs." }],
  },
  {
    name: "Celsius to Fahrenheit", slug: "celsius-to-fahrenheit",
    description: "Convert temperatures between Celsius and Fahrenheit.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Temperature", type: "number", placeholder: "e.g. 37" },
      { name: "direction", label: "Direction (c-to-f or f-to-c)", type: "text", placeholder: "c-to-f", defaultValue: "c-to-f" },
    ],
    logic: "celsiusFahrenheit", tags: ["temperature", "celsius", "fahrenheit"],
    explanation: "°F = (°C × 9/5) + 32. °C = (°F − 32) × 5/9.",
    faqs: [{ question: "What is normal body temperature?", answer: "Normal body temperature is 37°C or 98.6°F." }],
  },
  {
    name: "MB to GB Converter", slug: "mb-to-gb",
    description: "Convert between megabytes and gigabytes.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 1024" },
      { name: "direction", label: "Direction (mb-to-gb or gb-to-mb)", type: "text", placeholder: "mb-to-gb", defaultValue: "mb-to-gb" },
    ],
    logic: "mbGb", tags: ["data", "storage", "mb", "gb"],
    explanation: "1 GB = 1024 MB (binary) or 1000 MB (decimal). This uses 1024.",
    faqs: [{ question: "Is it 1000 or 1024?", answer: "This converter uses 1024 MB = 1 GB (binary/computing standard)." }],
  },
  {
    name: "Lakh to Million", slug: "lakh-to-million",
    description: "Convert between Indian lakh and international million.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 10" },
      { name: "direction", label: "Direction (lakh-to-million or million-to-lakh)", type: "text", placeholder: "lakh-to-million", defaultValue: "lakh-to-million" },
    ],
    logic: "lakhMillion", tags: ["number", "lakh", "million", "india"],
    explanation: "1 million = 10 lakhs. 1 lakh = 0.1 million.",
    faqs: [{ question: "How many lakhs in a million?", answer: "10 lakhs = 1 million." }],
  },
  {
    name: "Crore to Million", slug: "crore-to-million",
    description: "Convert between Indian crore and international million.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 5" },
      { name: "direction", label: "Direction (crore-to-million or million-to-crore)", type: "text", placeholder: "crore-to-million", defaultValue: "crore-to-million" },
    ],
    logic: "croreMillion", tags: ["number", "crore", "million", "india"],
    explanation: "1 crore = 10 million. 1 million = 0.1 crore.",
    faqs: [{ question: "How many millions in a crore?", answer: "1 crore = 10 million." }],
  },
  {
    name: "Inches to Cm Converter", slug: "inches-to-cm",
    description: "Convert between inches and centimeters.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 12" },
      { name: "direction", label: "Direction (in-to-cm or cm-to-in)", type: "text", placeholder: "in-to-cm", defaultValue: "in-to-cm" },
    ],
    logic: "inchesCm", tags: ["length", "inches", "cm"],
    explanation: "1 inch = 2.54 cm. 1 cm = 0.3937 inches.",
    faqs: [{ question: "How many cm in an inch?", answer: "1 inch = 2.54 cm." }],
  },
  {
    name: "Liters to Gallons", slug: "liters-to-gallons",
    description: "Convert between liters and US gallons.",
    category: "converters", resultLabel: "Result",
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 20" },
      { name: "direction", label: "Direction (l-to-gal or gal-to-l)", type: "text", placeholder: "l-to-gal", defaultValue: "l-to-gal" },
    ],
    logic: "litersGallons", tags: ["volume", "liters", "gallons"],
    explanation: "1 US gallon = 3.78541 liters. 1 liter = 0.264172 US gallons.",
    faqs: [{ question: "US or Imperial gallons?", answer: "This uses US gallons (3.785 liters)." }],
  },
];
