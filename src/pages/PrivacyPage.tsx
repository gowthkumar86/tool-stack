import { useEffect } from "react";
import ContentSection from "../components/ContentSection";
import Card from "../components/ui/card";
import { setSEO } from "../utils/seo";

function PrivacyPage() {
  useEffect(() => {
    setSEO({
      title: "Privacy Policy - tool-stack.online",
      description:
        "Read how tool-stack.online handles data, what is processed in-browser, and what privacy practices we follow.",
    });
  }, []);

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">Privacy Policy</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">Last updated: March 29, 2026</p>
      </Card>

      <ContentSection title="What We Process">
        <p>
          Tool inputs such as HAR files and JSON are processed in your browser for analysis and formatting. No account signup is required for core usage.
        </p>
      </ContentSection>

      <ContentSection title="Analytics and Logs">
        <p>
          We may collect anonymous usage signals, such as page views and feature usage, to improve reliability and prioritize improvements. We do not sell personal data.
        </p>
      </ContentSection>
    </article>
  );
}

export default PrivacyPage;
