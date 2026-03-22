import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { categories } from "../src/data/categories.ts";
import { allTools } from "../src/data/tools.ts";
import { render } from "../src/entry-server.tsx";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(scriptDir, "../dist");
const templatePath = resolve(distDir, "index.html");

if (!existsSync(templatePath)) {
  throw new Error("dist/index.html not found. Run the Vite build before prerendering.");
}

const template = readFileSync(templatePath, "utf-8");

const staticRoutes = ["/", "/about", "/contact", "/privacy-policy", "/terms"];
const categoryRoutes = categories.map((category) => category.path ?? `/category/${category.slug}`);
const toolRoutes = allTools.map((tool) => `/${tool.slug}`);

const routes = Array.from(new Set([...staticRoutes, ...categoryRoutes, ...toolRoutes]));

function injectHtml(baseHtml: string, appHtml: string, headHtml: string) {
  const withRoot = baseHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  return withRoot.replace("</head>", `${headHtml}</head>`);
}

for (const route of routes) {
  try {
    const { html, head } = render(route);
    const finalHtml = injectHtml(template, html, head);

    if (route === "/") {
      writeFileSync(templatePath, finalHtml);
      continue;
    }

    const outputDir = resolve(distDir, route.replace(/^\//, ""));
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(outputDir, "index.html"), finalHtml);
  } catch (error) {
    console.error(`Prerender failed for ${route}`, error);
    throw error;
  }
}

console.log(`Prerendered ${routes.length} routes.`);
