import type { ReactNode } from "react";
import type { ToolLogicId } from "../utils/toolLogic";
import type {
  ToolLogicResult,
  ToolValues
} from "../utils/toolLogic/shared";

export type ToolRunner = (values: ToolValues) => ToolLogicResult;
export type ToolResultRenderer = (result: ToolLogicResult) => ReactNode;
export type ToolCopyTextGetter = (result: ToolLogicResult) => string;
export type ToolRenderer = () => ReactNode;

export interface ToolOption {
  label: string;
  value: string;
}

export interface ToolInput {
  name: string;
  label: string;
  type: "number" | "text" | "date" | "textarea" | "select" | "file";
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  helperText?: string;
  accept?: string;
  loadsInto?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: ToolOption[];
}

export interface ToolResultField {
  key: string;
  label: string;
}

export interface ToolExample {
  input: ToolValues;
  description?: string;
}

export interface ToolConfig {
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  category: string;
  icon?: string;
  inputs: ToolInput[];
  results: ToolResultField[];
  logic: ToolLogicId;
  run?: ToolRunner;
  renderTool?: ToolRenderer;
  renderResult?: ToolResultRenderer;
  getCopyText?: ToolCopyTextGetter;
  instructions?: string[];
  examples?: ToolExample[];
  explanation: string;
  faqs: { question: string; answer: string }[];
  tags?: string[];
  featured?: boolean;
  related?: string[];
}
