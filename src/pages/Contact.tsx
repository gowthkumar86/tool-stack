import PageSeo from "@/components/PageSeo";

export default function Contact() {
  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <PageSeo
        title="Contact ToolStack | Feedback, Bug Reports and Tool Requests"
        description="Contact ToolStack for feedback, bug reports, developer tool suggestions, or requests for new online utilities."
        path="/contact"
        keywords={["contact ToolStack", "tool requests", "bug report", "developer tool feedback"]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact ToolStack</h1>
        <p className="leading-7 text-muted-foreground">
          Send feedback, bug reports, or suggestions for new developer utilities, calculators, and free online tools.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="contact-email">
        <h2 id="contact-email" className="text-2xl font-semibold text-foreground">
          Email
        </h2>
        <p className="text-muted-foreground">
          Reach ToolStack at{" "}
          <a className="font-semibold text-primary hover:underline" href="mailto:gowthkumar86backup@gmail.com">
            gowthkumar86backup@gmail.com
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground">Responses usually arrive within 48 hours.</p>
      </section>
    </article>
  );
}
