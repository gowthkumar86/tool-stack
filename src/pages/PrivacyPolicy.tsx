import PageSeo from "@/components/PageSeo";

export default function PrivacyPolicy() {
  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <PageSeo
        title="Privacy Policy | ToolStack"
        description="Read the ToolStack privacy policy covering browser-based tools, cookies, analytics, and how visitor information is handled."
        path="/privacy-policy"
        keywords={["ToolStack privacy policy", "cookies", "browser-based tools privacy"]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="leading-7 text-muted-foreground">
          This page explains how ToolStack handles visitor information across its free online tools and utility pages.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="privacy-information">
        <h2 id="privacy-information" className="text-2xl font-semibold text-foreground">
          Information we collect
        </h2>
        <p className="leading-7 text-muted-foreground">
          Most ToolStack pages run directly in your browser, and we do not store the content you enter into tools
          unless a page explicitly says otherwise. We may collect non-personal usage information such as browser type,
          device information, visited pages, timestamps, and referring websites.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies" className="text-2xl font-semibold text-foreground">
          Cookies and ads
        </h2>
        <p className="leading-7 text-muted-foreground">
          ToolStack may use cookies and advertising services such as Google AdSense to improve the experience and show
          relevant ads. Third-party providers can collect data according to their own privacy policies.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="privacy-updates">
        <h2 id="privacy-updates" className="text-2xl font-semibold text-foreground">
          Policy updates
        </h2>
        <p className="leading-7 text-muted-foreground">
          This policy may change over time. Any updates will be posted on this page so visitors can review the latest
          version.
        </p>
      </section>
    </article>
  );
}
