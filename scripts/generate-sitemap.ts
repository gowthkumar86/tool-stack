import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { allTools } from "../src/data/tools.ts";

const BASE_URL = "https://tool-stack.online";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const sitemapPath = resolve(scriptDir, "../public/sitemap.xml");

const urls = [
  `${BASE_URL}/`,
  ...allTools.map((tool) => `${BASE_URL}/tools/${tool.slug}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("")}
</urlset>`;

writeFileSync(sitemapPath, sitemap);

console.log("sitemap.xml generated successfully");
