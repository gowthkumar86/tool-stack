export interface GstCalculationResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  rate: number;
  isInclusive: boolean;
}

function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateGST(amount: number, rate: number, isInclusive: boolean): GstCalculationResult {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Amount must be a valid non-negative number.");
  }

  if (!Number.isFinite(rate) || rate < 0) {
    throw new Error("GST rate must be valid.");
  }

  let baseAmount = amount;
  let gstAmount = 0;
  let totalAmount = amount;

  if (isInclusive) {
    baseAmount = amount / (1 + rate / 100);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    gstAmount = (amount * rate) / 100;
    totalAmount = amount + gstAmount;
  }

  return {
    baseAmount: roundToTwo(baseAmount),
    gstAmount: roundToTwo(gstAmount),
    totalAmount: roundToTwo(totalAmount),
    rate,
    isInclusive,
  };
}
