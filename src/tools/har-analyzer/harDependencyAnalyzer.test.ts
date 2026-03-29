import { describe, expect, it } from "vitest";
import {
  buildDependencyGraph,
  compareHarGraphs,
  getInitiatorChain,
  parseHarEntries,
  type HarEntry,
} from "./harDependencyAnalyzer";

describe("parseHarEntries", () => {
  it("throws when root HAR shape is invalid", () => {
    expect(() => parseHarEntries(null)).toThrowError(/Root data must be an object/i);
  });

  it("safely parses malformed entry fields", () => {
    const parsed = parseHarEntries({
      log: {
        entries: [
          {
            request: { url: 42 },
            response: { status: "bad" },
            _initiator: { type: "script", url: "https://cdn.example.com/app.js" },
          },
        ],
      },
    });

    expect(parsed).toHaveLength(1);
    expect(parsed[0].request.url).toContain("Unknown URL");
    expect(parsed[0].response.status).toBe(0);
    expect(parsed[0].initiator?.url).toBe("https://cdn.example.com/app.js");
  });
});

describe("buildDependencyGraph + getInitiatorChain", () => {
  it("links parent-child relationships via initiator url", () => {
    const entries: HarEntry[] = [
      {
        request: { method: "GET", url: "https://shop.example.com/index.html" },
        response: { status: 200 },
        time: 20,
      },
      {
        request: { method: "GET", url: "https://cdn.example.com/app.js" },
        response: { status: 200 },
        time: 15,
        initiator: { type: "parser", url: "https://shop.example.com/index.html" },
      },
      {
        request: { method: "GET", url: "https://api.example.com/sponsored-products" },
        response: { status: 200 },
        time: 250,
        initiator: { type: "script", url: "https://cdn.example.com/app.js" },
      },
    ];

    const graph = buildDependencyGraph(entries);
    const targetNode = Array.from(graph.values()).find((node) => node.url.includes("sponsored-products"));

    expect(targetNode).toBeDefined();
    const chain = getInitiatorChain(targetNode!.id, graph);

    expect(chain.map((node) => node.url)).toEqual([
      "https://shop.example.com/index.html",
      "https://cdn.example.com/app.js",
      "https://api.example.com/sponsored-products",
    ]);
  });
});

describe("compareHarGraphs", () => {
  it("detects missing initiator script and explains why", () => {
    const entriesA: HarEntry[] = [
      {
        request: { method: "GET", url: "https://shop.example.com/index.html" },
        response: { status: 200 },
        time: 20,
      },
      {
        request: { method: "GET", url: "https://cdn.thirdparty.com/ads.js" },
        response: { status: 200 },
        time: 15,
        initiator: { type: "parser", url: "https://shop.example.com/index.html" },
      },
      {
        request: { method: "GET", url: "https://api.example.com/sponsored-products" },
        response: { status: 200 },
        time: 250,
        initiator: { type: "script", url: "https://cdn.thirdparty.com/ads.js" },
      },
    ];

    const entriesB: HarEntry[] = [
      {
        request: { method: "GET", url: "https://shop.example.com/index.html" },
        response: { status: 200 },
        time: 25,
      },
    ];

    const graphA = buildDependencyGraph(entriesA);
    const graphB = buildDependencyGraph(entriesB);

    const result = compareHarGraphs(graphA, graphB, "https://api.example.com/sponsored-products");

    expect(result.foundInA).toBe(true);
    expect(result.foundInB).toBe(false);
    expect(result.breakPoint).toBe("https://cdn.thirdparty.com/ads.js");
    expect(result.reason.toLowerCase()).toContain("initiator not loaded");
  });
});
