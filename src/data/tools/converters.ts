import type { ToolConfig } from "../types.ts";

export const converterTools: ToolConfig[] = [

{
name: "Km to Miles Converter",
slug: "km-to-miles",
description: "Convert kilometers to miles and miles to kilometers instantly.",
seoTitle: "Kilometers to Miles Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Distance",
type: "number",
placeholder: "100",
unit: "km / miles",
min: 0,
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Kilometers → Miles", value: "km-to-miles" },
{ label: "Miles → Kilometers", value: "miles-to-km" }
],
defaultValue: "km-to-miles"
}
],

results: [
{ label: "Converted Value", key: "result" }
],

logic: "kmMiles",

instructions: [
"Enter the distance value",
"Select the conversion direction",
"View the converted result"
],

examples: [
{
input: {
value: "100",
direction: "km-to-miles"
},
description: "Convert 100 km to miles"
}
],

explanation:
"Kilometers and miles are both units of distance. One kilometer equals approximately 0.621371 miles.",

faqs: [
{
question: "How many miles are in a kilometer?",
answer: "1 kilometer equals approximately 0.621371 miles."
}
],

tags: ["distance", "km", "miles", "converter"]
},

{
name: "Kg to Lbs Converter",
slug: "kg-to-lbs",
description: "Convert kilograms to pounds and pounds to kilograms.",
seoTitle: "Kilograms to Pounds Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Weight",
type: "number",
placeholder: "70",
unit: "kg / lbs",
min: 0,
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Kilograms → Pounds", value: "kg-to-lbs" },
{ label: "Pounds → Kilograms", value: "lbs-to-kg" }
],
defaultValue: "kg-to-lbs"
}
],

results: [
{ label: "Converted Value", key: "result" }
],

logic: "kgLbs",

instructions: [
"Enter the weight value",
"Choose the conversion direction",
"View the converted result"
],

examples: [
{
input: {
value: "70",
direction: "kg-to-lbs"
}
}
],

explanation:
"Kilograms and pounds are common weight units. One kilogram equals approximately 2.20462 pounds.",

faqs: [
{
question: "How many pounds are in a kilogram?",
answer: "1 kilogram equals approximately 2.20462 pounds."
}
],

tags: ["weight", "kg", "lbs", "converter"]
},

{
name: "Celsius to Fahrenheit Converter",
slug: "celsius-to-fahrenheit",
description: "Convert temperature between Celsius and Fahrenheit.",
seoTitle: "Celsius to Fahrenheit Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Temperature",
type: "number",
placeholder: "37",
unit: "°C / °F",
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Celsius → Fahrenheit", value: "c-to-f" },
{ label: "Fahrenheit → Celsius", value: "f-to-c" }
],
defaultValue: "c-to-f"
}
],

results: [
{ label: "Converted Temperature", key: "result" }
],

logic: "celsiusFahrenheit",

instructions: [
"Enter the temperature value",
"Choose the conversion direction",
"View the converted temperature"
],

examples: [
{
input: {
value: "37",
direction: "c-to-f"
}
}
],

explanation:
"Temperature conversions use mathematical formulas. Celsius is widely used globally while Fahrenheit is mainly used in the United States.",

faqs: [
{
question: "What is normal body temperature?",
answer: "Normal human body temperature is about 37°C or 98.6°F."
}
],

tags: ["temperature", "celsius", "fahrenheit"]
},

{
name: "MB to GB Converter",
slug: "mb-to-gb",
description: "Convert megabytes to gigabytes and vice versa.",
seoTitle: "MB to GB Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Data Size",
type: "number",
placeholder: "1024",
unit: "MB / GB",
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "MB → GB", value: "mb-to-gb" },
{ label: "GB → MB", value: "gb-to-mb" }
],
defaultValue: "mb-to-gb"
}
],

results: [
{ label: "Converted Size", key: "result" }
],

logic: "mbGb",

instructions: [
"Enter the storage value",
"Choose conversion direction",
"View converted result"
],

examples: [
{
input: {
value: "1024",
direction: "mb-to-gb"
}
}
],

explanation:
"Digital storage units use binary measurement in computing. One gigabyte equals 1024 megabytes.",

faqs: [
{
question: "Why 1024 MB in a GB?",
answer: "Computers use binary measurement where 1 GB equals 1024 MB."
}
],

tags: ["storage", "mb", "gb"]
},

{
name: "Lakh to Million Converter",
slug: "lakh-to-million",
description: "Convert Indian lakh values to international million units.",
seoTitle: "Lakh to Million Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Value",
type: "number",
placeholder: "10",
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Lakh → Million", value: "lakh-to-million" },
{ label: "Million → Lakh", value: "million-to-lakh" }
],
defaultValue: "lakh-to-million"
}
],

results: [
{ label: "Converted Value", key: "result" }
],

logic: "lakhMillion",

instructions: [
"Enter the number value",
"Select conversion direction",
"View converted result"
],

examples: [
{
input: {
value: "10",
direction: "lakh-to-million"
}
}
],

explanation:
"The Indian numbering system uses lakh (100,000) while the international system uses million (1,000,000).",

faqs: [
{
question: "How many lakhs are in a million?",
answer: "1 million equals 10 lakhs."
}
],

tags: ["numbers", "lakh", "million", "india"]
},

{
name: "Crore to Million Converter",
slug: "crore-to-million",
description: "Convert crore values to millions and vice versa.",
seoTitle: "Crore to Million Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Value",
type: "number",
placeholder: "5",
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Crore → Million", value: "crore-to-million" },
{ label: "Million → Crore", value: "million-to-crore" }
],
defaultValue: "crore-to-million"
}
],

results: [
{ label: "Converted Value", key: "result" }
],

logic: "croreMillion",

instructions: [
"Enter the number value",
"Select conversion direction",
"View converted result"
],

examples: [
{
input: {
value: "5",
direction: "crore-to-million"
}
}
],

explanation:
"In the Indian numbering system, one crore equals ten million.",

faqs: [
{
question: "How many millions are in one crore?",
answer: "1 crore equals 10 million."
}
],

tags: ["crore", "million", "numbers"]
},

{
name: "Inches to Cm Converter",
slug: "inches-to-cm",
description: "Convert inches to centimeters and vice versa.",
seoTitle: "Inches to Centimeters Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Length",
type: "number",
placeholder: "12",
unit: "in / cm",
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Inches → Centimeters", value: "in-to-cm" },
{ label: "Centimeters → Inches", value: "cm-to-in" }
],
defaultValue: "in-to-cm"
}
],

results: [
{ label: "Converted Length", key: "result" }
],

logic: "inchesCm",

instructions: [
"Enter the length value",
"Choose conversion direction",
"View converted value"
],

examples: [
{
input: {
value: "12",
direction: "in-to-cm"
}
}
],

explanation:
"Inches are used in the imperial system while centimeters belong to the metric system.",

faqs: [
{
question: "How many centimeters are in an inch?",
answer: "1 inch equals exactly 2.54 centimeters."
}
],

tags: ["length", "inch", "cm"]
},

{
name: "Liters to Gallons Converter",
slug: "liters-to-gallons",
description: "Convert liters to US gallons and gallons to liters.",
seoTitle: "Liters to Gallons Converter",
category: "converters",

inputs: [
{
name: "value",
label: "Volume",
type: "number",
placeholder: "20",
unit: "L / gal",
required: true
},
{
name: "direction",
label: "Conversion Direction",
type: "select",
options: [
{ label: "Liters → Gallons", value: "l-to-gal" },
{ label: "Gallons → Liters", value: "gal-to-l" }
],
defaultValue: "l-to-gal"
}
],

results: [
{ label: "Converted Volume", key: "result" }
],

logic: "litersGallons",

instructions: [
"Enter volume value",
"Choose conversion direction",
"View converted volume"
],

examples: [
{
input: {
value: "20",
direction: "l-to-gal"
}
}
],

explanation:
"Liters are metric volume units while gallons are commonly used in the United States.",

faqs: [
{
question: "Is this US or Imperial gallon?",
answer: "This converter uses US gallons where 1 gallon equals 3.78541 liters."
}
],

tags: ["volume", "liters", "gallons"]
}

];