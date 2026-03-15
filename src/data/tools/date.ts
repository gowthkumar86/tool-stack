import type { ToolConfig } from "../types.ts";

export const dateTools: ToolConfig[] = [

{
name: "Days Between Dates",
slug: "days-between-dates",
description: "Calculate the number of days between two dates.",
seoTitle: "Days Between Dates Calculator",
category: "date-tools",

inputs: [
{
name: "startDate",
label: "Start Date",
type: "date",
required: true
},
{
name: "endDate",
label: "End Date",
type: "date",
required: true
}
],

results: [
{ label: "Days Between", key: "daysBetween" }
],

logic: "daysBetween",

instructions: [
"Select the start date",
"Select the end date",
"View the total number of days between the two dates"
],

examples: [
{
input: {
startDate: "2024-01-01",
endDate: "2024-01-31"
},
description: "Calculate days in January"
}
],

explanation:
"This tool calculates the total number of calendar days between two selected dates. The calculation includes weekends and holidays.",

faqs: [
{
question: "Does this count weekends?",
answer: "Yes, the calculator counts all calendar days including weekends and holidays."
},
{
question: "Can the end date be earlier than the start date?",
answer: "Yes. The result will still show the absolute difference in days."
}
],

tags: ["date", "days", "difference", "calendar"]
},

{
name: "Date Countdown",
slug: "date-countdown",
description: "Calculate how many days remain until a specific date.",
seoTitle: "Date Countdown Calculator",
category: "date-tools",

inputs: [
{
name: "targetDate",
label: "Target Date",
type: "date",
required: true
}
],

results: [
{ label: "Days Remaining", key: "daysRemaining" }
],

logic: "dateCountdown",

instructions: [
"Select a future date",
"Run the countdown",
"See how many days remain from today"
],

examples: [
{
input: {
targetDate: "2026-12-31"
},
description: "Countdown to New Year"
}
],

explanation:
"This calculator determines the number of days between today's date and the selected future date.",

faqs: [
{
question: "What if the date is in the past?",
answer: "The tool will show a negative number indicating how many days have passed since the selected date."
},
{
question: "Does the countdown include today?",
answer: "The calculation starts from the current date and counts the remaining full days."
}
],

tags: ["countdown", "date", "event", "days"]
},

{
name: "Time Difference Calculator",
slug: "time-difference",
description: "Calculate the difference between two times.",
seoTitle: "Time Difference Calculator",
category: "date-tools",

inputs: [
{
name: "startTime",
label: "Start Time",
type: "text",
placeholder: "09:00",
helperText: "Use 24-hour format (HH:MM)",
required: true
},
{
name: "endTime",
label: "End Time",
type: "text",
placeholder: "17:30",
helperText: "Use 24-hour format (HH:MM)",
required: true
}
],

results: [
{ label: "Time Difference", key: "timeDifference" }
],

logic: "timeDifference",

instructions: [
"Enter the start time in HH:MM format",
"Enter the end time in HH:MM format",
"View the difference in hours and minutes"
],

examples: [
{
input: {
startTime: "09:00",
endTime: "17:30"
},
description: "Typical work shift"
}
],

explanation:
"This calculator determines the duration between two times using a 24-hour clock format.",

faqs: [
{
question: "What time format should I use?",
answer: "Use 24-hour format such as 09:00 for 9 AM or 17:30 for 5:30 PM."
},
{
question: "Can the end time be after midnight?",
answer: "Yes, the calculator can handle overnight time differences."
}
],

tags: ["time", "difference", "hours", "calculator"]
}

];