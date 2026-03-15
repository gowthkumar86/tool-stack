import type { ToolConfig } from "../types.ts";
export const healthTools: ToolConfig[] = [
  {
    name: "BMI Calculator", slug: "bmi-calculator",
    description: "Calculate your Body Mass Index (BMI).",
    category: "health", resultLabel: "Your BMI", featured: true,
    inputs: [
      { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
    ],
    logic: "bmi", tags: ["health", "bmi", "weight"],
    explanation: "BMI = weight (kg) / height (m)². Underweight: <18.5, Normal: 18.5-24.9, Overweight: 25-29.9, Obese: 30+.",
    faqs: [
      { question: "What is a healthy BMI?", answer: "A BMI between 18.5 and 24.9 is considered healthy." },
      { question: "Is BMI accurate for athletes?", answer: "BMI doesn't distinguish between muscle and fat, so it may not be accurate for very muscular people." },
    ],
  },
  {
    name: "Calorie Calculator", slug: "calorie-calculator",
    description: "Estimate daily calorie needs based on your activity level.",
    category: "health", resultLabel: "Daily Calories",
    inputs: [
      { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
      { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 30" },
      { name: "activityLevel", label: "Activity (1.2=sedentary, 1.55=moderate, 1.9=active)", type: "number", placeholder: "1.55", defaultValue: "1.55" },
    ],
    logic: "calories", tags: ["health", "calories", "diet"],
    explanation: "Uses the Mifflin-St Jeor equation: BMR = 10×weight + 6.25×height - 5×age - 161, then multiplied by activity level.",
    faqs: [
      { question: "What is BMR?", answer: "Basal Metabolic Rate is the calories your body needs at rest." },
    ],
  },
  {
    name: "Water Intake Calculator", slug: "water-intake-calculator",
    description: "Calculate recommended daily water intake.",
    category: "health", resultLabel: "Daily Water Intake (liters)",
    inputs: [
      { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { name: "activityLevel", label: "Activity (1=low, 2=moderate, 3=high)", type: "number", placeholder: "2", defaultValue: "2" },
    ],
    logic: "waterIntake", tags: ["health", "water", "hydration"],
    explanation: "Base intake is ~35ml per kg of body weight, adjusted for activity level.",
    faqs: [
      { question: "How much water should I drink?", answer: "A general guideline is about 35ml per kg of body weight." },
    ],
  },
  {
    name: "Sleep Cycle Calculator", slug: "sleep-cycle-calculator",
    description: "Find optimal wake-up or bed times based on sleep cycles.",
    category: "health", resultLabel: "Recommended Times",
    inputs: [
      { name: "bedtime", label: "Bedtime (HH:MM, 24h format)", type: "text", placeholder: "23:00" },
    ],
    logic: "sleepCycle", tags: ["sleep", "health", "cycle"],
    explanation: "Each sleep cycle lasts ~90 minutes. Waking between cycles helps you feel more rested. We calculate 4-6 complete cycles.",
    faqs: [
      { question: "How long is a sleep cycle?", answer: "One complete sleep cycle lasts approximately 90 minutes." },
    ],
  },
];
