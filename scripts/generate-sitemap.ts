import { writeFileSync } from "fs";
import { allTools } from "../src/data/tools.ts";

const BASE_URL = "https://tool-stack.online";

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

writeFileSync("./public/sitemap.xml", sitemap);

console.log("✅ sitemap.xml generated successfully");