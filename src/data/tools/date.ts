import type { ToolConfig } from "../types.ts";
export const dateTools: ToolConfig[] = [
  {
    name: "Days Between Dates", slug: "days-between-dates",
    description: "Calculate the number of days between two dates.",
    category: "date-tools", resultLabel: "Days Between",
    inputs: [
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
    ],
    logic: "daysBetween", tags: ["date", "days", "difference"],
    explanation: "Calculates the absolute number of days between two dates.",
    faqs: [
      { question: "Does it count weekends?", answer: "Yes, all calendar days are counted." },
    ],
  },
  {
    name: "Date Countdown", slug: "date-countdown",
    description: "Count days remaining until a target date.",
    category: "date-tools", resultLabel: "Days Remaining",
    inputs: [
      { name: "targetDate", label: "Target Date", type: "date" },
    ],
    logic: "dateCountdown", tags: ["countdown", "date", "event"],
    explanation: "Shows how many days remain from today until the target date.",
    faqs: [
      { question: "What if the date is in the past?", answer: "It will show a negative number indicating days that have passed." },
    ],
  },
  {
    name: "Time Difference Calculator", slug: "time-difference",
    description: "Calculate the difference between two times.",
    category: "date-tools", resultLabel: "Time Difference",
    inputs: [
      { name: "startTime", label: "Start Time (HH:MM)", type: "text", placeholder: "09:00" },
      { name: "endTime", label: "End Time (HH:MM)", type: "text", placeholder: "17:30" },
    ],
    logic: "timeDifference", tags: ["time", "difference", "hours"],
    explanation: "Calculates hours and minutes between two times in 24-hour format.",
    faqs: [
      { question: "What format should I use?", answer: "Use 24-hour format, e.g. 09:00 for 9 AM, 17:30 for 5:30 PM." },
    ],
  },
];
