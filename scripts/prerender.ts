import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(scriptDir, "../dist");
const templatePath = resolve(distDir, "index.html");

if (!existsSync(templatePath)) {
  throw new Error("dist/index.html not found. Run the Vite build before prerendering.");
}

const template = readFileSync(templatePath, "utf-8");

const routes = [
  "/",
  "/har-analyzer",
  "/json-formatter",
  "/gst-calculator",
  "/about",
  "/contact",
  "/privacy",
];

for (const route of routes) {
  try {
    if (route === "/") {
      continue;
    }

    const outputDir = resolve(distDir, route.replace(/^\//, ""));
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(outputDir, "index.html"), template);
  } catch (error) {
    console.error(`Prerender failed for ${route}`, error);
    throw error;
  }
}

console.log(`Prerendered ${routes.length} routes.`);
