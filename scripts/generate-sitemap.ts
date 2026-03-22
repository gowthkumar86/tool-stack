import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { categories } from "../src/data/categories.ts";
import { allTools } from "../src/data/tools.ts";

const BASE_URL = "https://tool-stack.online";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const sitemapPath = resolve(scriptDir, "../public/sitemap.xml");
const lastModified = new Date().toISOString();

const urls = [
  { loc: `${BASE_URL}/`, priority: "1.0" },
  { loc: `${BASE_URL}/about`, priority: "0.6" },
  { loc: `${BASE_URL}/contact`, priority: "0.6" },
  { loc: `${BASE_URL}/privacy-policy`, priority: "0.3" },
  { loc: `${BASE_URL}/terms`, priority: "0.3" },
  ...categories.map((category) => ({
    loc: `${BASE_URL}${category.path ?? `/category/${category.slug}`}`,
    priority: "0.8",
  })),
  ...allTools.map((tool) => ({
    loc: `${BASE_URL}/${tool.slug}`,
    priority: "0.9",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

writeFileSync(sitemapPath, sitemap);

console.log("sitemap.xml generated successfully");
