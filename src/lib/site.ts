export const SITE_NAME = "ToolStack";
export const SITE_URL = "https://tool-stack.online";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_KEYWORDS = [
  "ToolStack",
  "free online tools",
  "online developer tools",
  "developer utilities",
  "browser-based tools",
  "free calculators",
  "text tools",
  "converters",
];

export function toAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}
