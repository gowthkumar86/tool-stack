import type { ToolConfig } from "../types.ts";

export const textTools: ToolConfig[] = [

{
name: "Word Counter",
slug: "word-counter",
description: "Count words, characters, sentences, and paragraphs in your text.",
seoTitle: "Word Counter Online",
category: "text-tools",
featured: true,

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Paste or type your text here...",
required: true
}
],

results: [
{ label: "Word Count", key: "wordCount" },
{ label: "Character Count", key: "charCount" },
{ label: "Character Count (No Spaces)", key: "charNoSpaces" },
{ label: "Sentence Count", key: "sentenceCount" },
{ label: "Paragraph Count", key: "paragraphCount" }
],

logic: "wordCounter",

instructions: [
"Paste or type your text into the input box",
"The tool automatically calculates text statistics",
"View word, character, sentence, and paragraph counts"
],

examples: [
{
input: {
textInput: "Hello world. This is a sample sentence."
}
}
],

explanation:
"This tool analyzes text to count words, characters, sentences, and paragraphs. It is useful for writing tasks with word limits.",

faqs: [
{
question: "How are words counted?",
answer: "Words are separated by spaces and line breaks."
}
],

tags: ["word", "counter", "text", "writing"]
},

{
name: "Character Counter",
slug: "character-counter",
description: "Count characters in your text with and without spaces.",
seoTitle: "Character Counter Online",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Type your text here...",
required: true
}
],

results: [
{ label: "Characters (with spaces)", key: "charWithSpaces" },
{ label: "Characters (without spaces)", key: "charWithoutSpaces" }
],

logic: "charCounter",

instructions: [
"Enter or paste your text",
"View character count statistics instantly"
],

examples: [
{
input: {
textInput: "Hello world"
}
}
],

explanation:
"This tool counts the total number of characters in your text and also provides a count excluding spaces.",

faqs: [
{
question: "Are spaces counted?",
answer: "Both counts are displayed: characters including spaces and excluding spaces."
}
],

tags: ["character", "counter", "text"]
},

{
name: "Case Converter",
slug: "case-converter",
description: "Convert text to uppercase, lowercase, title case, or sentence case.",
seoTitle: "Case Converter Tool",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Type text to convert...",
required: true
},
{
name: "caseType",
label: "Case Type",
type: "select",
options: [
{ label: "UPPERCASE", value: "upper" },
{ label: "lowercase", value: "lower" },
{ label: "Title Case", value: "title" },
{ label: "Sentence case", value: "sentence" }
],
defaultValue: "upper"
}
],

results: [
{ label: "Converted Text", key: "result" }
],

logic: "caseConverter",

instructions: [
"Enter your text",
"Choose the case format",
"Copy the converted result"
],

examples: [
{
input: {
textInput: "hello world",
caseType: "upper"
}
}
],

explanation:
"This tool converts text into different capitalization formats including uppercase, lowercase, title case, and sentence case.",

faqs: [
{
question: "What is title case?",
answer: "Title case capitalizes the first letter of each word."
}
],

tags: ["case", "converter", "text"]
},

{
name: "Remove Duplicate Lines",
slug: "remove-duplicate-lines",
description: "Remove duplicate lines from text.",
seoTitle: "Remove Duplicate Lines Tool",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Paste text with duplicate lines...",
required: true
}
],

results: [
{ label: "Cleaned Text", key: "cleanedText" }
],

logic: "removeDuplicates",

instructions: [
"Paste text containing duplicate lines",
"Run the tool",
"Copy the cleaned output"
],

examples: [
{
input: {
textInput: "apple\nbanana\napple"
}
}
],

explanation:
"This tool removes repeated lines from a list while keeping the first occurrence.",

faqs: [
{
question: "Is duplicate detection case-sensitive?",
answer: "Yes, the comparison is case-sensitive."
}
],

tags: ["duplicate", "remove", "text"]
},

{
name: "Text Sorter",
slug: "text-sorter",
description: "Sort lines of text alphabetically.",
seoTitle: "Text Sorter Tool",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "One item per line...",
required: true
},
{
name: "sortOrder",
label: "Sort Order",
type: "select",
options: [
{ label: "A → Z", value: "asc" },
{ label: "Z → A", value: "desc" }
],
defaultValue: "asc"
}
],

results: [
{ label: "Sorted Text", key: "sortedText" }
],

logic: "textSorter",

instructions: [
"Enter items separated by lines",
"Choose sorting order",
"View sorted output"
],

examples: [
{
input: {
textInput: "banana\napple\ncherry",
sortOrder: "asc"
}
}
],

explanation:
"This tool sorts lines of text alphabetically in ascending or descending order.",

faqs: [
{
question: "Can I sort reverse alphabetically?",
answer: "Yes, select descending order to sort from Z to A."
}
],

tags: ["sort", "alphabetical", "text"]
},

{
name: "Text Reverser",
slug: "text-reverser",
description: "Reverse text character by character.",
seoTitle: "Text Reverser Tool",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Type text to reverse...",
required: true
}
],

results: [
{ label: "Reversed Text", key: "reversedText" }
],

logic: "textReverser",

instructions: [
"Enter your text",
"Run the tool",
"Copy the reversed result"
],

examples: [
{
input: {
textInput: "hello"
}
}
],

explanation:
"This tool reverses the entire string character by character.",

faqs: [
{
question: "Does it reverse words or characters?",
answer: "The tool reverses all characters in the entire string."
}
],

tags: ["reverse", "text"]
},

{
name: "Find and Replace",
slug: "find-and-replace",
description: "Find and replace text within a string.",
seoTitle: "Find and Replace Text Tool",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Paste your text...",
required: true
},
{
name: "find",
label: "Find",
type: "text",
placeholder: "Text to find",
required: true
},
{
name: "replaceWith",
label: "Replace With",
type: "text",
placeholder: "Replacement text",
required: true
}
],

results: [
{ label: "Result", key: "result" }
],

logic: "findReplace",

instructions: [
"Enter the main text",
"Specify the word or phrase to find",
"Enter replacement text"
],

examples: [
{
input: {
textInput: "Hello world",
find: "world",
replaceWith: "everyone"
}
}
],

explanation:
"This tool replaces all matching occurrences of a word or phrase with another string.",

faqs: [
{
question: "Is the search case-sensitive?",
answer: "Yes, the search is case-sensitive."
}
],

tags: ["find", "replace", "text"]
},

{
name: "Line Counter",
slug: "line-counter",
description: "Count the number of lines in your text.",
seoTitle: "Line Counter Tool",
category: "text-tools",

inputs: [
{
name: "textInput",
label: "Enter Text",
type: "textarea",
placeholder: "Paste text here...",
required: true
}
],

results: [
{ label: "Total Lines", key: "totalLines" },
{ label: "Non-empty Lines", key: "nonEmptyLines" }
],

logic: "lineCounter",

instructions: [
"Paste text into the input box",
"View total line statistics"
],

examples: [
{
input: {
textInput: "apple\nbanana\n\ncherry"
}
}
],

explanation:
"This tool counts both total lines and lines that contain text.",

faqs: [
{
question: "Are empty lines counted?",
answer: "Yes, both total lines and non-empty lines are shown."
}
],

tags: ["line", "counter", "text"]
}

];