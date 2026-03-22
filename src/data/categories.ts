import { Calculator, Code, Type, ArrowLeftRight, Heart, Calendar } from "lucide-react";

export interface Category {
  name: string;
  slug: string;
  path?: string;
  description: string;
  icon: typeof Calculator;
}

export const categories: Category[] = [
  {
    name: "Finance & Daily Life",
    slug: "finance",
    path: "/finance-tools",
    description: "EMI, SIP, GST, percentage, discount and more financial calculators.",
    icon: Calculator,
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    path: "/developer-tools",
    description: "JSON, Base64, JWT, UUID, regex and other developer utilities.",
    icon: Code,
  },
  {
    name: "Text Tools",
    slug: "text-tools",
    path: "/text-tools",
    description: "Word counter, case converter, text sorter and more text utilities.",
    icon: Type,
  },
  { name: "Converters", slug: "converters", description: "Unit converters for length, weight, temperature and more.", icon: ArrowLeftRight },
  { name: "Health Tools", slug: "health", description: "BMI, calorie, water intake and health calculators.", icon: Heart },
  { name: "Date Tools", slug: "date-tools", description: "Calculate days between dates, countdowns and time differences.", icon: Calendar },
];
