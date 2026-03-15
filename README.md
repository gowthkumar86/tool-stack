# ToolStack

ToolStack is a browser-based collection of free online tools built with React, TypeScript, and Vite. It combines developer utilities, calculators, text tools, converters, health tools, and date tools into a fast single-page application.

Live site: [https://tool-stack.online](https://tool-stack.online)

## Features

- Developer tools such as JSON formatting, JSON validation, HTML preview, Base64 encoding/decoding, UUID generation, and HAR file analysis/comparison
- Everyday calculators including EMI, SIP, GST, percentage, discount, tip, split bill, and salary take-home estimation
- Text utilities like word counting, case conversion, sorting, reversing, duplicate-line removal, and find/replace
- Converter, health, and date utility categories
- SEO-friendly tool pages with structured metadata and sitemap generation
- Fully client-side workflows for most tools, keeping common tasks fast and simple

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui and Radix UI
- React Router
- Vitest and Testing Library
- Playwright

## Project Structure

```text
src/
  components/    Reusable UI and layout components
  data/          Tool and category definitions
  lib/           Site metadata and shared helpers
  pages/         Route-level pages
  tools/         Custom interactive tool implementations
  utils/         Tool logic and helper functions
  test/          Unit test setup and examples
scripts/
  generate-sitemap.ts
public/
  sitemap.xml, robots.txt, images
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Generates `public/sitemap.xml` and creates the production build in `dist/`.

```bash
npm run build:dev
```

Builds the app in development mode.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run test
```

Runs the Vitest suite once.

```bash
npm run test:watch
```

Runs tests in watch mode.

```bash
npm run generate:sitemap
```

Regenerates the sitemap from the configured pages, categories, and tools.

## Deployment

The repository includes `vercel.json` for SPA routing on Vercel. All routes are rewritten to `/`, allowing React Router to handle navigation on the client.

## Notes

- The site URL is configured in `src/lib/site.ts`.
- Tool definitions live under `src/data/tools.ts` and the category-specific files in `src/data/tools/`.
- Some tools use custom interactive implementations under `src/tools/`.
