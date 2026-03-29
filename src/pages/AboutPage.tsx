import { useEffect } from "react";
import ContentSection from "../components/ContentSection";
import Card from "../components/ui/Card";
import { setSEO } from "../utils/seo";

function AboutPage() {
  useEffect(() => {
    setSEO({
      title: "About tool-stack.online - Practical Developer Utilities",
      description:
        "Learn what tool-stack.online does, who it is built for, and why our tools focus on practical debugging and decision-making.",
    });
  }, []);

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">About tool-stack.online</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
          We build focused tools for developers who need clarity under pressure. The goal is useful output, not dashboard bloat.
        </p>
      </Card>

      <ContentSection title="What This Site Does">
        <p>
          We provide utilities for common workflow pain points: HAR debugging, JSON cleanup, and tax sanity checks for India-focused billing.
        </p>
      </ContentSection>

      <ContentSection title="Who It Is For">
        <p>
          Frontend and backend developers, QA engineers, founders, and freelancers who want practical answers while fixing issues or preparing estimates.
        </p>
      </ContentSection>

      <ContentSection title="Product Philosophy">
        <p>We keep the interface quiet and dependable so decisions happen faster during real work.</p>
      </ContentSection>
    </article>
  );
}

export default AboutPage;
