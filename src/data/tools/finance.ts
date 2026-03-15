import type { ToolConfig } from "../types.ts";
export const financeTools: ToolConfig[] = [
  {
    name: "Percentage Calculator", slug: "percentage-calculator",
    description: "Calculate percentages quickly and easily.",
    category: "finance", resultLabel: "Result", featured: true,
    inputs: [
      { name: "value", label: "Value", type: "number", placeholder: "e.g. 200" },
      { name: "percentage", label: "Percentage (%)", type: "number", placeholder: "e.g. 15" },
    ],
    logic: "percentage", tags: ["math", "finance", "percentage"],
    explanation: "Multiply the value by the percentage and divide by 100 to get the result.",
    faqs: [
      { question: "How do you calculate percentage?", answer: "Multiply the value by the percentage and divide by 100." },
      { question: "What is 15% of 200?", answer: "15% of 200 = 200 × 15 / 100 = 30." },
    ],
  },
  {
    name: "Discount Calculator", slug: "discount-calculator",
    description: "Find the final price after applying a discount.",
    category: "finance", resultLabel: "Final Price", featured: true,
    inputs: [
      { name: "originalPrice", label: "Original Price", type: "number", placeholder: "e.g. 1000" },
      { name: "discountPercent", label: "Discount (%)", type: "number", placeholder: "e.g. 20" },
    ],
    logic: "discount", tags: ["shopping", "discount", "price"],
    explanation: "Subtract the discount amount from the original price to get the final price.",
    faqs: [
      { question: "How is discount calculated?", answer: "Final Price = Original Price - (Original Price × Discount / 100)." },
    ],
  },
  {
    name: "EMI Calculator", slug: "emi-calculator",
    description: "Calculate your monthly EMI for loans.",
    category: "finance", resultLabel: "Monthly EMI", featured: true,
    inputs: [
      { name: "principal", label: "Loan Amount", type: "number", placeholder: "e.g. 500000" },
      { name: "rate", label: "Interest Rate (% per year)", type: "number", placeholder: "e.g. 8.5" },
      { name: "tenure", label: "Tenure (months)", type: "number", placeholder: "e.g. 60" },
    ],
    logic: "emi", tags: ["loan", "emi", "bank"],
    explanation: "EMI is calculated using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is number of months.",
    faqs: [
      { question: "What is EMI?", answer: "EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each month." },
    ],
  },
  {
    name: "SIP Calculator", slug: "sip-calculator",
    description: "Calculate returns on your Systematic Investment Plan.",
    category: "finance", resultLabel: "Maturity Value",
    inputs: [
      { name: "monthlyInvestment", label: "Monthly Investment", type: "number", placeholder: "e.g. 5000" },
      { name: "expectedReturn", label: "Expected Return (% per year)", type: "number", placeholder: "e.g. 12" },
      { name: "years", label: "Time Period (years)", type: "number", placeholder: "e.g. 10" },
    ],
    logic: "sip", tags: ["investment", "sip", "mutual fund"],
    explanation: "SIP returns are calculated using compound interest on each monthly installment.",
    faqs: [
      { question: "What is SIP?", answer: "SIP is a method of investing a fixed sum regularly in mutual funds." },
    ],
  },
  {
    name: "FD Maturity Calculator", slug: "fd-calculator",
    description: "Calculate maturity amount of your Fixed Deposit.",
    category: "finance", resultLabel: "Maturity Amount",
    inputs: [
      { name: "principal", label: "Deposit Amount", type: "number", placeholder: "e.g. 100000" },
      { name: "rate", label: "Interest Rate (% per year)", type: "number", placeholder: "e.g. 7" },
      { name: "years", label: "Period (years)", type: "number", placeholder: "e.g. 5" },
    ],
    logic: "fd", tags: ["fd", "deposit", "bank"],
    explanation: "FD maturity is calculated using compound interest formula: A = P × (1 + r/4)^(4×t).",
    faqs: [
      { question: "How is FD interest calculated?", answer: "Most banks compound FD interest quarterly." },
    ],
  },
  {
    name: "GST Calculator", slug: "gst-calculator",
    description: "Calculate GST amount and total price.",
    category: "finance", resultLabel: "Total with GST",
    inputs: [
      { name: "amount", label: "Amount", type: "number", placeholder: "e.g. 1000" },
      { name: "gstRate", label: "GST Rate (%)", type: "number", placeholder: "e.g. 18" },
    ],
    logic: "gst", tags: ["tax", "gst", "india"],
    explanation: "GST is added to the base amount. Total = Amount + (Amount × GST Rate / 100).",
    faqs: [
      { question: "What are common GST rates?", answer: "Common GST rates in India are 5%, 12%, 18%, and 28%." },
    ],
  },
  {
    name: "Loan Interest Calculator", slug: "loan-interest-calculator",
    description: "Calculate total interest paid on a loan.",
    category: "finance", resultLabel: "Total Interest",
    inputs: [
      { name: "principal", label: "Loan Amount", type: "number", placeholder: "e.g. 500000" },
      { name: "rate", label: "Interest Rate (% per year)", type: "number", placeholder: "e.g. 10" },
      { name: "years", label: "Loan Period (years)", type: "number", placeholder: "e.g. 5" },
    ],
    logic: "loanInterest", tags: ["loan", "interest", "bank"],
    explanation: "Total interest = (Principal × Rate × Time) / 100 for simple interest.",
    faqs: [
      { question: "What is simple interest?", answer: "Simple interest is calculated on the original principal only." },
    ],
  },
  {
    name: "CTC to In-Hand Calculator", slug: "ctc-to-inhand",
    description: "Estimate your in-hand salary from CTC.",
    category: "finance", resultLabel: "Estimated In-Hand Salary",
    inputs: [
      { name: "ctc", label: "Annual CTC", type: "number", placeholder: "e.g. 1200000" },
      { name: "bonus", label: "Bonus/Variable (%)", type: "number", placeholder: "e.g. 10" },
    ],
    logic: "ctcToInhand", tags: ["salary", "ctc", "income"],
    explanation: "In-hand salary is estimated by deducting PF, tax estimates, and bonus components from CTC.",
    faqs: [
      { question: "What deductions are considered?", answer: "PF (12%), professional tax, and approximate income tax are deducted." },
    ],
  },
  {
    name: "Split Bill Calculator", slug: "split-bill-calculator",
    description: "Split a bill evenly among people.",
    category: "finance", resultLabel: "Each Person Pays",
    inputs: [
      { name: "totalBill", label: "Total Bill", type: "number", placeholder: "e.g. 3000" },
      { name: "people", label: "Number of People", type: "number", placeholder: "e.g. 4" },
    ],
    logic: "splitBill", tags: ["bill", "split", "share"],
    explanation: "Divide the total bill by the number of people to find each person's share.",
    faqs: [
      { question: "Does this include tip?", answer: "This is a simple split. Add tip to the total bill before splitting." },
    ],
  },
  {
    name: "Tip Calculator", slug: "tip-calculator",
    description: "Calculate tip amount and total bill with tip.",
    category: "finance", resultLabel: "Tip Amount",
    inputs: [
      { name: "billAmount", label: "Bill Amount", type: "number", placeholder: "e.g. 500" },
      { name: "tipPercent", label: "Tip (%)", type: "number", placeholder: "e.g. 15" },
    ],
    logic: "tip", tags: ["tip", "restaurant", "bill"],
    explanation: "Tip = Bill Amount × Tip Percentage / 100.",
    faqs: [
      { question: "What is a standard tip?", answer: "15-20% is considered standard in most countries." },
    ],
  },
  {
    name: "Age Calculator", slug: "age-calculator",
    description: "Calculate your exact age from your date of birth.",
    category: "finance", resultLabel: "Your Age", featured: true,
    inputs: [
      { name: "dob", label: "Date of Birth", type: "date" },
    ],
    logic: "age", tags: ["age", "birthday", "date"],
    explanation: "Your age is calculated based on the difference between today's date and your date of birth.",
    faqs: [
      { question: "Is the age exact?", answer: "Yes, it calculates years, months, and days." },
    ],
  },
  {
    name: "Compound Interest Calculator", slug: "compound-interest-calculator",
    description: "Calculate compound interest on your investment.",
    category: "finance", resultLabel: "Total Amount",
    inputs: [
      { name: "principal", label: "Principal Amount", type: "number", placeholder: "e.g. 100000" },
      { name: "rate", label: "Annual Rate (%)", type: "number", placeholder: "e.g. 8" },
      { name: "years", label: "Time (years)", type: "number", placeholder: "e.g. 5" },
      { name: "n", label: "Compounds per Year", type: "number", placeholder: "e.g. 12" },
    ],
    logic: "compoundInterest", tags: ["interest", "compound", "investment"],
    explanation: "A = P × (1 + r/n)^(n×t) where P is principal, r is rate, n is compounding frequency, t is time.",
    faqs: [
      { question: "What is compounding?", answer: "Compounding means earning interest on both principal and previously earned interest." },
    ],
  },
  {
    name: "Simple Interest Calculator", slug: "simple-interest-calculator",
    description: "Calculate simple interest on a principal amount.",
    category: "finance", resultLabel: "Interest Amount",
    inputs: [
      { name: "principal", label: "Principal", type: "number", placeholder: "e.g. 50000" },
      { name: "rate", label: "Rate (% per year)", type: "number", placeholder: "e.g. 6" },
      { name: "years", label: "Time (years)", type: "number", placeholder: "e.g. 3" },
    ],
    logic: "simpleInterest", tags: ["interest", "simple", "math"],
    explanation: "Simple Interest = (P × R × T) / 100.",
    faqs: [
      { question: "Difference between simple and compound interest?", answer: "Simple interest is on principal only; compound interest includes accumulated interest." },
    ],
  },
  {
    name: "Markup Calculator", slug: "markup-calculator",
    description: "Calculate the selling price based on cost and markup.",
    category: "finance", resultLabel: "Selling Price",
    inputs: [
      { name: "cost", label: "Cost Price", type: "number", placeholder: "e.g. 500" },
      { name: "markup", label: "Markup (%)", type: "number", placeholder: "e.g. 40" },
    ],
    logic: "markup", tags: ["business", "markup", "price"],
    explanation: "Selling Price = Cost + (Cost × Markup / 100).",
    faqs: [
      { question: "What is markup?", answer: "Markup is the percentage added to cost price to determine selling price." },
    ],
  },
  {
    name: "Profit Margin Calculator", slug: "profit-margin-calculator",
    description: "Calculate profit margin from cost and selling price.",
    category: "finance", resultLabel: "Profit Margin (%)",
    inputs: [
      { name: "costPrice", label: "Cost Price", type: "number", placeholder: "e.g. 400" },
      { name: "sellingPrice", label: "Selling Price", type: "number", placeholder: "e.g. 600" },
    ],
    logic: "profitMargin", tags: ["business", "profit", "margin"],
    explanation: "Profit Margin = ((Selling Price - Cost Price) / Selling Price) × 100.",
    faqs: [
      { question: "What is a good profit margin?", answer: "It varies by industry, but 10-20% is common for retail." },
    ],
  },
];
