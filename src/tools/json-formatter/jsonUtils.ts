function parseJSON(input: string): unknown {
  if (!input.trim()) {
    throw new Error("Please paste JSON before running this tool.");
  }

  return JSON.parse(input);
}

export function formatJSON(input: string): string {
  const parsed = parseJSON(input);
  return JSON.stringify(parsed, null, 2);
}

export function minifyJSON(input: string): string {
  const parsed = parseJSON(input);
  return JSON.stringify(parsed);
}

export function validateJSON(input: string): { isValid: boolean; error?: string } {
  try {
    parseJSON(input);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}
