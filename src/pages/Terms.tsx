import PageSeo from "@/components/PageSeo";

export default function Terms() {
  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <PageSeo
        title="Terms and Conditions | ToolStack"
        description="Read the terms and conditions for using ToolStack's free online developer tools, calculators, converters, and utility pages."
        path="/terms"
        keywords={["ToolStack terms", "free online tools terms", "developer tools terms"]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms and Conditions</h1>
        <p className="leading-7 text-muted-foreground">
          These terms explain how ToolStack and its free online tools may be used.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="terms-use">
        <h2 id="terms-use" className="text-2xl font-semibold text-foreground">
          Use of the website
        </h2>
        <p className="leading-7 text-muted-foreground">
          ToolStack provides browser-based utilities for informational, productivity, and troubleshooting workflows.
          You agree to use the site lawfully and in ways that do not disrupt the service for others.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="terms-accuracy">
        <h2 id="terms-accuracy" className="text-2xl font-semibold text-foreground">
          Accuracy of results
        </h2>
        <p className="leading-7 text-muted-foreground">
          We work to keep the tools useful and reliable, but ToolStack does not guarantee that every calculation,
          conversion, or generated output will be error-free in all situations. Important results should be verified
          independently.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="terms-services">
        <h2 id="terms-services" className="text-2xl font-semibold text-foreground">
          Third-party services
        </h2>
        <p className="leading-7 text-muted-foreground">
          Some pages may rely on third-party services such as analytics or advertising providers. Those services are
          governed by their own terms and privacy policies.
        </p>
      </section>
    </article>
  );
}
