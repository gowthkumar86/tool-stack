import { useEffect } from "react";
import ContentSection from "../components/ContentSection";
import Card from "../components/ui/Card";
import { setSEO } from "../utils/seo";

function ContactPage() {
  useEffect(() => {
    setSEO({
      title: "Contact tool-stack.online",
      description:
        "Contact tool-stack.online for feedback, bug reports, feature requests, and collaboration about developer tools.",
    });
  }, []);

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">Contact</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
          If something breaks, feels unclear, or could save developers more time, we want to hear it.
        </p>
      </Card>

      <ContentSection title="How To Reach Us">
        <p>Email: gowthkumar86backup@gmail.com</p>
        <p>Use this for bug reports, feature requests, or partnerships.</p>
      </ContentSection>

      <ContentSection title="What Helps Us Respond Faster">
        <p>Share the page URL, reproducible steps, and sample HAR or JSON input when possible.</p>
      </ContentSection>
    </article>
  );
}

export default ContactPage;
