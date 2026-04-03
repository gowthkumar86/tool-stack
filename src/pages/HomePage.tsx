import { useEffect } from "react";
import { Link } from "react-router-dom";
import ContentSection from "../components/ContentSection";
import Card from "../components/ui/card";
import { setSEO } from "../utils/seo";

const toolCards = [
  {
    title: "HAR Analyzer",
    description:
      "Spot slow endpoints, broken APIs, and status-code spikes from real browser captures instead of guessing from logs.",
    path: "/har-analyzer",
    isNew: true,
  },
  {
    title: "JSON Formatter",
    description:
      "Clean unreadable payloads, validate quickly, and catch syntax mistakes before your API call fails in production.",
    path: "/json-formatter",
    isNew: true,
  },
  {
    title: "GST Calculator",
    description:
      "Understand inclusive vs exclusive pricing so you stop quoting totals that quietly hurt your margins.",
    path: "/gst-calculator",
    isNew: false,
  },
];

function HomePage() {
  useEffect(() => {
    setSEO({
      title: "Smart Developer Tools - Debug Faster, Extract Smarter",
      description:
        "Developer-focused tools to analyze HAR files, debug JSON, extract insights from logs, and avoid costly mistakes in real workflows.",
    });
  }, []);

  return (
    <article className="space-y-6">
      {/* Header */}
      <Card>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">
          Smart Developer Tools
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
          Focused utilities for engineers who need useful answers quickly. Each tool is designed around real debugging and delivery pressure.
        </p>
      </Card>

      {/* Tools */}
      <section
        aria-label="Tool list"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {toolCards.map((tool) => (
          <Card key={tool.path} hoverable>
            {/* NEW badge (optional) */}
            {tool.isNew && (
              <span className="absolute top-3 right-3 text-xs bg-emerald-400 text-black px-2 py-1 rounded-full font-semibold">
                NEW
              </span>
            )}

            {/* Title */}
            <h2 className="text-lg font-semibold text-[var(--text-strong)]">
              {tool.title}
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
              {tool.description}
            </p>

            {/* CTA */}
            <Link
              to={tool.path}
              className="mt-4 inline-flex rounded-xl border border-emerald-300/30 bg-emerald-500/12 px-3 py-2 text-sm font-medium text-emerald-100 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-emerald-200/45 hover:bg-emerald-400/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/45"
            >
              Open Tool →
            </Link>
          </Card>
        ))}
      </section>

      {/* Content */}
      <ContentSection title="How Developers Actually Use These Tools">
        <p>
          Example workflow: inspect a failing request in{" "}
          <Link to="/har-analyzer" className="text-emerald-300">
            HAR Analyzer
          </Link>
          , copy the response body into{" "}
          <Link to="/json-formatter" className="text-emerald-300">
            JSON Formatter
          </Link>
          , then share clean payload evidence in your incident ticket.
        </p>
        <p>
          If your project includes billing logic, run the same payload
          assumptions through the{" "}
          <Link to="/gst-calculator" className="text-emerald-300">
            GST Tool
          </Link>{" "}
          before sending client estimates.
        </p>
      </ContentSection>

      <ContentSection title="Why This Stack Works">
        <ul className="list-disc space-y-2 pl-5">
          <li>HAR Analyzer shows what happened.</li>
          <li>JSON Formatter makes payloads readable.</li>
          <li>GST Tool prevents silent pricing mistakes.</li>
        </ul>
      </ContentSection>
    </article>
  );
}

export default HomePage;