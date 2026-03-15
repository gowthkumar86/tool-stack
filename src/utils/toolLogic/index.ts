import { converterToolLogic } from "./converters";
import { dateToolLogic } from "./date";
import { developerToolLogic } from "./developer";
import { financeToolLogic } from "./finance";
import { healthToolLogic } from "./health";
import {
  createToolLogicHelpers,
  ToolLogicHandler,
  ToolLogicResult,
  ToolValues
} from "./shared";
import { textToolLogic } from "./text";

export const toolLogicMap = {
  ...financeToolLogic,
  ...developerToolLogic,
  ...textToolLogic,
  ...converterToolLogic,
  ...healthToolLogic,
  ...dateToolLogic
} satisfies Record<string, ToolLogicHandler>;

export type ToolLogicId = keyof typeof toolLogicMap;

export function runToolLogic(
  logicId: ToolLogicId,
  values: ToolValues
): ToolLogicResult {
  const handler = toolLogicMap[logicId];

  if (!handler) {
    return {
      result: "Logic not implemented for this tool."
    };
  }

  return handler(values, createToolLogicHelpers(values));
}
