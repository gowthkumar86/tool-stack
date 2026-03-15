import PageSeo from "@/components/PageSeo";

export default function About() {
  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <PageSeo
        title="About ToolStack | Free Online Developer Tools and Utilities"
        description="Learn about ToolStack, a free platform for online developer tools, text utilities, converters, and calculators that work directly in the browser."
        path="/about"
        keywords={["about ToolStack", "free online tools", "developer tools", "browser-based utilities"]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">About ToolStack</h1>
        <p className="leading-7 text-muted-foreground">
          ToolStack is a free online platform that groups together practical developer tools, calculators, text
          utilities, and converters in one browser-based workspace.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="what-toolstack-offers">
        <h2 id="what-toolstack-offers" className="text-2xl font-semibold text-foreground">
          What ToolStack offers
        </h2>
        <p className="leading-7 text-muted-foreground">
          The site includes developer utilities like JSON viewer online pages, HTML preview tools, and HAR file
          analyzers, along with calculators and productivity tools for everyday tasks. The goal is to keep each page
          lightweight, useful, and easy to access from any device.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="toolstack-mission">
        <h2 id="toolstack-mission" className="text-2xl font-semibold text-foreground">
          Our mission
        </h2>
        <p className="leading-7 text-muted-foreground">
          ToolStack is designed to help people move through repetitive digital work faster. We focus on clear tool
          pages, quick results, and browser-based workflows that do not require downloads, accounts, or setup time.
        </p>
      </section>
    </article>
  );
}
