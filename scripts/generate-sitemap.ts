import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://tool-stack.online";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const sitemapPath = resolve(scriptDir, "../public/sitemap.xml");
const lastModified = new Date().toISOString();

const routes = [
  { path: "/", priority: "1.0" },
  { path: "/har-analyzer", priority: "0.9" },
  { path: "/json-formatter", priority: "0.9" },
  { path: "/gst-calculator", priority: "0.9" },
  { path: "/about", priority: "0.6" },
  { path: "/contact", priority: "0.6" },
  { path: "/privacy", priority: "0.3" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${lastModified}</lastmod>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

writeFileSync(sitemapPath, sitemap);

console.log("sitemap.xml generated successfully");
