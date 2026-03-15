import type { ToolConfig } from "../types.ts";

export const financeTools: ToolConfig[] = [
{
name: "Percentage Calculator",
slug: "percentage-calculator",
description: "Calculate percentages quickly and easily.",
seoTitle: "Percentage Calculator Online",
category: "finance",
featured: true,

inputs: [
{
name: "value",
label: "Value",
type: "number",
placeholder: "200",
min: 0,
required: true
},
{
name: "percentage",
label: "Percentage",
type: "number",
placeholder: "15",
unit: "%",
min: 0,
required: true
}
],

results: [
{ label: "Percentage Result", key: "result" }
],

logic: "percentage",

instructions: [
"Enter the base value",
"Enter the percentage",
"View the calculated result"
],

examples: [
{
input: {
value: "200",
percentage: "15"
},
description: "Calculate 15% of 200"
}
],

explanation:
"To calculate a percentage, multiply the value by the percentage and divide the result by 100.",

faqs: [
{
question: "How do you calculate percentage?",
answer:
"Multiply the value by the percentage and divide by 100."
},
{
question: "What is 15% of 200?",
answer:
"15% of 200 equals 30."
}
],

tags: ["percentage", "calculator", "finance", "math"]
},

{
name: "Discount Calculator",
slug: "discount-calculator",
description: "Find the final price after applying a discount.",
seoTitle: "Discount Calculator Online",
category: "finance",
featured: true,

inputs: [
{
name: "originalPrice",
label: "Original Price",
type: "number",
placeholder: "1000",
min: 0,
required: true
},
{
name: "discountPercent",
label: "Discount Percentage",
type: "number",
placeholder: "20",
unit: "%",
min: 0,
max: 100,
required: true
}
],

results: [
{ label: "Final Price", key: "finalPrice" },
{ label: "Discount Amount", key: "discountAmount" }
],

logic: "discount",

instructions: [
"Enter the original price",
"Enter discount percentage",
"View the discounted price"
],

examples: [
{
input: {
originalPrice: "1000",
discountPercent: "20"
}
}
],

explanation:
"A discount reduces the original price. The discount amount is calculated first and then subtracted from the original price.",

faqs: [
{
question: "How is discount calculated?",
answer:
"Final price = Original price − (Original price × discount / 100)."
}
],

tags: ["discount", "shopping", "price", "finance"]
},

{
name: "EMI Calculator",
slug: "emi-calculator",
description: "Calculate your monthly EMI for loans.",
seoTitle: "Loan EMI Calculator Online",
category: "finance",
featured: true,

inputs: [
{
name: "principal",
label: "Loan Amount",
type: "number",
placeholder: "500000",
min: 0,
required: true
},
{
name: "rate",
label: "Interest Rate",
type: "number",
placeholder: "8.5",
unit: "% per year",
required: true
},
{
name: "tenure",
label: "Loan Tenure",
type: "number",
placeholder: "60",
unit: "months",
min: 1,
required: true
}
],

results: [
{ label: "Monthly EMI", key: "emi" },
{ label: "Total Interest", key: "interest" },
{ label: "Total Payment", key: "totalPayment" }
],

logic: "emi",

instructions: [
"Enter loan amount",
"Enter annual interest rate",
"Enter loan tenure in months"
],

examples: [
{
input: {
principal: "500000",
rate: "8.5",
tenure: "60"
}
}
],

explanation:
"EMI is calculated using a standard loan amortization formula based on principal, interest rate, and tenure.",

faqs: [
{
question: "What is EMI?",
answer:
"EMI (Equated Monthly Installment) is the fixed monthly payment made toward a loan."
}
],

tags: ["emi", "loan", "bank", "finance"]
},

{
name: "SIP Calculator",
slug: "sip-calculator",
description: "Calculate returns on your Systematic Investment Plan.",
seoTitle: "SIP Calculator for Mutual Funds",
category: "finance",

inputs: [
{
name: "monthlyInvestment",
label: "Monthly Investment",
type: "number",
placeholder: "5000",
min: 0,
required: true
},
{
name: "expectedReturn",
label: "Expected Return",
type: "number",
placeholder: "12",
unit: "% per year",
required: true
},
{
name: "years",
label: "Investment Period",
type: "number",
placeholder: "10",
unit: "years",
required: true
}
],

results: [
{ label: "Invested Amount", key: "investedAmount" },
{ label: "Estimated Returns", key: "returns" },
{ label: "Maturity Value", key: "maturityValue" }
],

logic: "sip",

instructions: [
"Enter monthly investment amount",
"Enter expected annual return",
"Enter investment duration"
],

examples: [
{
input: {
monthlyInvestment: "5000",
expectedReturn: "12",
years: "10"
}
}
],

explanation:
"SIP investing allows investors to contribute a fixed amount monthly. The investment grows through compound interest.",

faqs: [
{
question: "What is SIP?",
answer:
"SIP is a disciplined investment method where a fixed amount is invested periodically in mutual funds."
}
],

tags: ["sip", "investment", "mutual-fund"]
},

{
name: "GST Calculator",
slug: "gst-calculator",
description: "Calculate GST amount and total price.",
seoTitle: "GST Calculator India",
category: "finance",

inputs: [
{
name: "amount",
label: "Amount",
type: "number",
placeholder: "1000",
required: true
},
{
name: "gstRate",
label: "GST Rate",
type: "select",
options: [
{ label: "5%", value: "5" },
{ label: "12%", value: "12" },
{ label: "18%", value: "18" },
{ label: "28%", value: "28" }
],
defaultValue: "18"
}
],

results: [
{ label: "GST Amount", key: "gstAmount" },
{ label: "Total Amount", key: "total" }
],

logic: "gst",

instructions: [
"Enter base amount",
"Choose GST rate",
"View GST amount and total"
],

examples: [
{
input: {
amount: "1000",
gstRate: "18"
}
}
],

explanation:
"GST is calculated by applying the selected GST rate to the base price.",

faqs: [
{
question: "What are common GST rates in India?",
answer:
"5%, 12%, 18%, and 28% are the most common GST slabs."
}
],

tags: ["gst", "tax", "india"]
},

{
name: "CTC to In-Hand Salary Calculator",
slug: "ctc-to-in-hand-salary-calculator",
description: "Estimate monthly in-hand salary from annual CTC with configurable bonus, PF, gratuity, tax, and other deductions.",
seoTitle: "CTC to In-Hand Salary Calculator",
category: "finance",
featured: true,

inputs: [
{
name: "annualCtc",
label: "Annual CTC",
type: "number",
placeholder: "1200000",
min: 0,
required: true,
helperText: "Your full annual cost to company package."
},
{
name: "annualBonus",
label: "Annual Bonus / Variable Pay",
type: "number",
placeholder: "120000",
min: 0,
defaultValue: "0",
helperText: "Annual performance bonus or variable pay included inside CTC."
},
{
name: "employerPfMonthly",
label: "Employer PF Contribution (Monthly)",
type: "number",
placeholder: "1800",
min: 0,
defaultValue: "0",
helperText: "Employer PF is part of CTC but not part of monthly take-home."
},
{
name: "gratuityMonthly",
label: "Gratuity (Monthly)",
type: "number",
placeholder: "2400",
min: 0,
defaultValue: "0",
helperText: "Monthly gratuity component if your company includes it in CTC."
},
{
name: "employeePfMonthly",
label: "Employee PF Deduction (Monthly)",
type: "number",
placeholder: "1800",
min: 0,
defaultValue: "1800",
helperText: "Monthly PF deducted from your payslip."
},
{
name: "professionalTaxMonthly",
label: "Professional Tax (Monthly)",
type: "number",
placeholder: "200",
min: 0,
defaultValue: "200",
helperText: "Use 0 if professional tax does not apply in your state."
},
{
name: "otherMonthlyDeductions",
label: "Other Monthly Deductions",
type: "number",
placeholder: "1500",
min: 0,
defaultValue: "0",
helperText: "Insurance, food card recovery, loan EMI deduction, or other payroll deductions."
},
{
name: "annualTaxEstimate",
label: "Annual Income Tax Estimate",
type: "number",
placeholder: "60000",
min: 0,
defaultValue: "0",
helperText: "Enter your estimated annual tax to get a more realistic in-hand salary."
}
],

results: [
{ label: "Monthly Gross Fixed Pay", key: "monthlyGross" },
{ label: "Annual Fixed Pay", key: "annualFixedPay" },
{ label: "Annual Employer Contributions", key: "annualEmployerContributions" },
{ label: "Monthly Deductions", key: "monthlyDeductions" },
{ label: "Monthly In-Hand Salary", key: "monthlyInhand" },
{ label: "Annual In-Hand Salary", key: "annualInhand" }
],

logic: "ctcToInhand",

instructions: [
"Enter your total annual CTC",
"Fill in bonus, employer contributions, and deductions that are part of your package",
"Add an annual tax estimate for a closer in-hand salary projection",
"Review the monthly gross, monthly deductions, and in-hand salary breakdown"
],

examples: [
{
input: {
annualCtc: "1200000",
annualBonus: "120000",
employerPfMonthly: "1800",
gratuityMonthly: "2406",
employeePfMonthly: "1800",
professionalTaxMonthly: "200",
otherMonthlyDeductions: "1000",
annualTaxEstimate: "75000"
},
description: "Typical salaried package with variable pay, PF, gratuity, and tax estimate"
}
],

explanation:
"CTC and in-hand salary are not the same. In-hand pay is usually lower because annual bonus, employer PF, gratuity, income tax, employee PF, professional tax, and other payroll deductions can all reduce what lands in your bank account each month.",

faqs: [
{
question: "Why is in-hand salary lower than CTC?",
answer:
"CTC often includes bonus, employer PF, gratuity, insurance, and other components that are not fully paid out as monthly cash salary."
},
{
question: "Should I include employer PF and gratuity here?",
answer:
"Yes, if those components are part of your CTC breakup. They reduce the monthly fixed cash portion of the package."
},
{
question: "Why do you ask for annual tax estimate instead of auto-calculating tax?",
answer:
"Actual tax depends on regime, exemptions, deductions, and payroll setup. A manual annual tax estimate gives you a more flexible and realistic take-home calculation."
}
],

tags: ["ctc", "salary", "in hand", "take home", "payroll", "finance"]
},

{
name: "Split Bill Calculator",
slug: "split-bill-calculator",
description: "Split a bill evenly among people.",
seoTitle: "Split Bill Calculator",
category: "finance",

inputs: [
{
name: "totalBill",
label: "Total Bill Amount",
type: "number",
placeholder: "3000",
required: true
},
{
name: "people",
label: "Number of People",
type: "number",
placeholder: "4",
min: 1,
required: true
}
],

results: [
{ label: "Each Person Pays", key: "perPerson" }
],

logic: "splitBill",

instructions: [
"Enter the total bill amount",
"Enter number of people",
"View individual share"
],

examples: [
{
input: {
totalBill: "3000",
people: "4"
}
}
],

explanation:
"The total bill is divided equally among all participants.",

faqs: [
{
question: "Does this include tip?",
answer:
"Add the tip to the bill before splitting to include it."
}
],

tags: ["bill", "split", "share"]
},

{
name: "Tip Calculator",
slug: "tip-calculator",
description: "Calculate tip amount and total bill.",
seoTitle: "Tip Calculator Online",
category: "finance",

inputs: [
{
name: "billAmount",
label: "Bill Amount",
type: "number",
placeholder: "500",
required: true
},
{
name: "tipPercent",
label: "Tip Percentage",
type: "number",
placeholder: "15",
unit: "%",
required: true
}
],

results: [
{ label: "Tip Amount", key: "tipAmount" },
{ label: "Total Bill", key: "totalBill" }
],

logic: "tip",

instructions: [
"Enter the bill amount",
"Enter tip percentage",
"View calculated tip"
],

examples: [
{
input: {
billAmount: "500",
tipPercent: "15"
}
}
],

explanation:
"The tip is calculated by multiplying the bill amount by the tip percentage.",

faqs: [
{
question: "What is a standard tip?",
answer:
"15–20% is considered standard in many countries."
}
],

tags: ["tip", "restaurant", "bill"]
}
];
