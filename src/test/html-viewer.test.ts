import { describe, expect, it } from "vitest";

import { formatHtml } from "@/tools/html-viewer/formatHtml";

describe("HTML viewer formatter", () => {
  it("formats a simple HTML document with indentation", () => {
    const formatted = formatHtml("<!DOCTYPE html><html><head><title>Sample</title></head><body><h1>Hello</h1><p>World</p></body></html>");

    expect(formatted).toContain("<!DOCTYPE html>");
    expect(formatted).toContain("  <head>");
    expect(formatted).toContain("    <title>Sample</title>");
    expect(formatted).toContain("    <h1>Hello</h1>");
  });

  it("keeps void tags without forced closing tags", () => {
    const formatted = formatHtml("<html><head><meta charset='utf-8'></head><body><img src='hero.png'></body></html>");

    expect(formatted).toContain('<meta charset="utf-8">');
    expect(formatted).toContain('<img src="hero.png">');
    expect(formatted).not.toContain("</meta>");
    expect(formatted).not.toContain("</img>");
  });
});

