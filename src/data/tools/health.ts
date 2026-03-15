import type { ToolConfig } from "../types.ts";

export const healthTools: ToolConfig[] = [

{
name: "BMI Calculator",
slug: "bmi-calculator",
description: "Calculate your Body Mass Index (BMI) to understand your weight category.",
seoTitle: "BMI Calculator – Body Mass Index Calculator",
category: "health",
featured: true,

inputs: [
{
name: "weight",
label: "Weight",
type: "number",
placeholder: "70",
unit: "kg",
min: 1,
required: true
},
{
name: "height",
label: "Height",
type: "number",
placeholder: "175",
unit: "cm",
min: 50,
required: true
}
],

results: [
{ label: "BMI Value", key: "bmi" },
{ label: "BMI Category", key: "category" }
],

logic: "bmi",

instructions: [
"Enter your weight in kilograms",
"Enter your height in centimeters",
"View your BMI and health category"
],

examples: [
{
input: {
weight: "70",
height: "175"
}
}
],

explanation:
"BMI (Body Mass Index) is calculated using the formula weight divided by height squared. It helps classify whether a person is underweight, normal weight, overweight, or obese.",

faqs: [
{
question: "What is a healthy BMI?",
answer: "A BMI between 18.5 and 24.9 is considered healthy."
},
{
question: "Is BMI accurate for athletes?",
answer: "BMI does not differentiate between muscle and fat, so very muscular individuals may appear overweight."
}
],

tags: ["bmi", "health", "body-mass-index", "weight"]
},

{
name: "Calorie Calculator",
slug: "calorie-calculator",
description: "Estimate your daily calorie needs based on age, body size, and activity level.",
seoTitle: "Daily Calorie Needs Calculator",
category: "health",

inputs: [
{
name: "weight",
label: "Weight",
type: "number",
placeholder: "70",
unit: "kg",
required: true
},
{
name: "height",
label: "Height",
type: "number",
placeholder: "175",
unit: "cm",
required: true
},
{
name: "age",
label: "Age",
type: "number",
placeholder: "30",
unit: "years",
required: true
},
{
name: "activityLevel",
label: "Activity Level",
type: "select",
options: [
{ label: "Sedentary (little or no exercise)", value: "1.2" },
{ label: "Light Activity (1-3 days/week)", value: "1.375" },
{ label: "Moderate Activity (3-5 days/week)", value: "1.55" },
{ label: "Very Active (6-7 days/week)", value: "1.725" },
{ label: "Extra Active (athlete level)", value: "1.9" }
],
defaultValue: "1.55"
}
],

results: [
{ label: "Estimated Daily Calories", key: "calories" }
],

logic: "calories",

instructions: [
"Enter your age, weight, and height",
"Select your activity level",
"View your estimated daily calorie requirement"
],

examples: [
{
input: {
weight: "70",
height: "175",
age: "30",
activityLevel: "1.55"
}
}
],

explanation:
"This calculator estimates calorie needs using the Mifflin-St Jeor equation to calculate BMR (Basal Metabolic Rate) and then adjusts it based on activity level.",

faqs: [
{
question: "What is BMR?",
answer: "Basal Metabolic Rate is the number of calories your body needs to maintain basic functions while at rest."
}
],

tags: ["calories", "diet", "nutrition", "health"]
},

{
name: "Water Intake Calculator",
slug: "water-intake-calculator",
description: "Estimate your recommended daily water intake.",
seoTitle: "Daily Water Intake Calculator",
category: "health",

inputs: [
{
name: "weight",
label: "Body Weight",
type: "number",
placeholder: "70",
unit: "kg",
required: true
},
{
name: "activityLevel",
label: "Activity Level",
type: "select",
options: [
{ label: "Low Activity", value: "1" },
{ label: "Moderate Activity", value: "2" },
{ label: "High Activity", value: "3" }
],
defaultValue: "2"
}
],

results: [
{ label: "Recommended Water Intake", key: "waterLiters" }
],

logic: "waterIntake",

instructions: [
"Enter your body weight",
"Select your activity level",
"View recommended daily water intake"
],

examples: [
{
input: {
weight: "70",
activityLevel: "2"
}
}
],

explanation:
"A common guideline recommends drinking around 35 milliliters of water per kilogram of body weight per day, adjusted based on physical activity.",

faqs: [
{
question: "How much water should I drink daily?",
answer: "A typical guideline is around 35 ml per kg of body weight."
}
],

tags: ["hydration", "water", "health"]
},

{
name: "Sleep Cycle Calculator",
slug: "sleep-cycle-calculator",
description: "Find optimal sleep and wake times based on sleep cycles.",
seoTitle: "Sleep Cycle Calculator",
category: "health",

inputs: [
{
name: "bedtime",
label: "Bedtime",
type: "text",
placeholder: "23:00",
helperText: "Use 24-hour format (HH:MM)",
required: true
}
],

results: [
{ label: "Recommended Wake Times", key: "wakeTimes" }
],

logic: "sleepCycle",

instructions: [
"Enter the time you plan to sleep",
"The calculator estimates wake times based on 90-minute sleep cycles"
],

examples: [
{
input: {
bedtime: "23:00"
}
}
],

explanation:
"Human sleep occurs in cycles of roughly 90 minutes. Waking at the end of a sleep cycle helps you feel more refreshed.",

faqs: [
{
question: "How long is one sleep cycle?",
answer: "A typical sleep cycle lasts about 90 minutes."
}
],

tags: ["sleep", "sleep-cycle", "health"]
}

];