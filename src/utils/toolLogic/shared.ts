export type ToolValues = Record<string, string>;

export type ToolLogicResult = Record<string, unknown>;

export type ToolLogicHandler = (
  values: ToolValues,
  helpers: ToolLogicHelpers
) => ToolLogicResult;

export interface ToolLogicHelpers {
  num: (key: string) => number;
  str: (key: string) => string;
}

export function createToolLogicHelpers(values: ToolValues): ToolLogicHelpers {
  return {
    num: (key: string) => parseFloat(values[key] || "0"),
    str: (key: string) => values[key] || ""
  };
}
