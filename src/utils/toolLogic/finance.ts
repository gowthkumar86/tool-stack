import { ToolLogicHandler } from "./shared";

export const financeToolLogic: Record<string, ToolLogicHandler> = {
  percentage: (_values, { num }) => ({
    result: num("value") * num("percentage") / 100
  }),

  discount: (_values, { num }) => {
    const orig = num("originalPrice");
    const disc = num("discountPercent");
    const saved = orig * disc / 100;

    return {
      finalPrice: (orig - saved).toFixed(2),
      saved: saved.toFixed(2)
    };
  },

  emi: (_values, { num }) => {
    const p = num("principal");
    const r = num("rate") / 12 / 100;
    const n = num("tenure");

    if (r === 0) {
      const emi = p / n;
      return { emi: emi.toFixed(2) };
    }

    const emi = p * r * Math.pow(1 + r, n) /
      (Math.pow(1 + r, n) - 1);

    return { emi: emi.toFixed(2) };
  },

  sip: (_values, { num }) => {
    const m = num("monthlyInvestment");
    const r = num("expectedReturn") / 12 / 100;
    const n = num("years") * 12;

    const fv = m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    return {
      maturityValue: fv.toFixed(2)
    };
  },

  fd: (_values, { num }) => {
    const p = num("principal");
    const r = num("rate") / 100;
    const t = num("years");

    const amount = p * Math.pow(1 + r / 4, 4 * t);

    return {
      maturityAmount: amount.toFixed(2)
    };
  },

  gst: (_values, { num }) => {
    const amt = num("amount");
    const rate = num("gstRate");
    const gst = amt * rate / 100;

    return {
      gstAmount: gst.toFixed(2),
      total: (amt + gst).toFixed(2)
    };
  },

  loanInterest: (_values, { num }) => {
    const interest =
      (num("principal") * num("rate") * num("years")) / 100;

    return {
      totalInterest: interest.toFixed(2)
    };
  },

  ctcToInhand: (_values, { num }) => {
    const annualCtc = num("annualCtc");
    const annualBonus = num("annualBonus");
    const employerPfMonthly = num("employerPfMonthly");
    const gratuityMonthly = num("gratuityMonthly");
    const employeePfMonthly = num("employeePfMonthly");
    const professionalTaxMonthly = num("professionalTaxMonthly");
    const otherMonthlyDeductions = num("otherMonthlyDeductions");
    const annualTaxEstimate = num("annualTaxEstimate");

    const annualEmployerContributions =
      annualBonus + (employerPfMonthly + gratuityMonthly) * 12;
    const annualFixedPay = Math.max(0, annualCtc - annualEmployerContributions);
    const monthlyGross = annualFixedPay / 12;
    const monthlyDeductions =
      employeePfMonthly +
      professionalTaxMonthly +
      otherMonthlyDeductions +
      annualTaxEstimate / 12;
    const monthlyInhand = Math.max(0, monthlyGross - monthlyDeductions);

    return {
      monthlyGross: Math.round(monthlyGross).toLocaleString(),
      annualFixedPay: Math.round(annualFixedPay).toLocaleString(),
      annualEmployerContributions: Math.round(annualEmployerContributions).toLocaleString(),
      monthlyDeductions: Math.round(monthlyDeductions).toLocaleString(),
      monthlyInhand: Math.round(monthlyInhand).toLocaleString(),
      annualInhand: Math.round(monthlyInhand * 12).toLocaleString()
    };
  },

  splitBill: (_values, { num }) => {
    const perPerson = num("totalBill") / num("people");

    return {
      perPerson: perPerson.toFixed(2)
    };
  },

  tip: (_values, { num }) => {
    const tip = num("billAmount") * num("tipPercent") / 100;

    return {
      tipAmount: tip.toFixed(2),
      totalBill: (num("billAmount") + tip).toFixed(2)
    };
  },

  age: (_values, { str }) => {
    const dob = new Date(str("dob"));
    const now = new Date();

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      days += 30;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      age: `${years} years, ${months} months, ${days} days`
    };
  },

  compoundInterest: (_values, { num }) => {
    const p = num("principal");
    const r = num("rate") / 100;
    const t = num("years");
    const n = num("n") || 12;

    const amount = p * Math.pow(1 + r / n, n * t);

    return {
      totalAmount: amount.toFixed(2)
    };
  },

  simpleInterest: (_values, { num }) => {
    const interest =
      (num("principal") * num("rate") * num("years")) / 100;

    return {
      interestAmount: interest.toFixed(2)
    };
  },

  markup: (_values, { num }) => {
    const cost = num("cost");
    const m = num("markup");
    const sellingPrice = cost + cost * m / 100;

    return {
      sellingPrice: sellingPrice.toFixed(2)
    };
  },

  profitMargin: (_values, { num }) => {
    const cp = num("costPrice");
    const sp = num("sellingPrice");
    const margin = ((sp - cp) / sp) * 100;

    return {
      margin: margin.toFixed(2) + "%"
    };
  }
};

