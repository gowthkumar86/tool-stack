import type { GstCalculationResult } from "./gstUtils";

export type GstInsightType = "tip" | "warning" | "info";

export interface GstInsight {
  type: GstInsightType;
  text: string;
}

export interface GstInputValues {
  amount: number;
  rate: number;
  isInclusive: boolean;
}

export function generateInsights(result: GstCalculationResult, inputs: GstInputValues): GstInsight[] {
  const insights: GstInsight[] = [];

  insights.push({
    type: "info",
    text: `You are paying \u20B9${result.gstAmount.toFixed(2)} as GST`,
  });

  insights.push({
    type: "info",
    text: `GST slab: ${inputs.rate}%`,
  });

  const gstShare = result.baseAmount === 0 ? 0 : (result.gstAmount / result.baseAmount) * 100;
  if (gstShare > 30) {
    insights.push({
      type: "warning",
      text: "Warning: GST is more than 30% of the base amount. Recheck pricing assumptions.",
    });
  }

  insights.push({
    type: "tip",
    text: inputs.isInclusive
      ? "Inclusive mode is useful when clients share final totals only."
      : "Exclusive mode is useful when you are drafting quotes from base prices.",
  });

  return insights;
}
