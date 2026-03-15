export interface ToolInput {
  name: string;
  label: string;
  type: "number" | "text" | "date" | "textarea";
  placeholder?: string;
  defaultValue?: string;
}

export interface ToolConfig {
  name: string;
  slug: string;
  description: string;
  category: string;
  resultLabel: string;
  inputs: ToolInput[];
  logic: string;
  explanation: string;
  faqs: { question: string; answer: string }[];
  tags?: string[];
  featured?: boolean;
  related?: string[];
}
