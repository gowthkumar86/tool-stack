import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";
import PageSeo from "@/components/PageSeo";
import ToolCard from "@/components/ToolCard";
import ToolSearch from "@/components/ToolSearch";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/categories";
import { allTools, getFeaturedTools, getToolsByCategory } from "@/data/tools";
import { getToolPath } from "@/lib/toolSeo";

export default function Index() {
  const featured = getFeaturedTools();
  const developerTools = getToolsByCategory("developer-tools").slice(0, 4);
  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ToolStack",
      url: "https://tool-stack.online/",
      description:
        "ToolStack is a free collection of online developer tools, calculators, text utilities, and converters.",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Featured ToolStack tools",
      itemListElement: featured.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: `https://tool-stack.online${getToolPath(tool)}`,
      })),
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
      <PageSeo
        title="ToolStack - Free Online Developer Tools, Converters and Calculators"
        description="Discover ToolStack, a free collection of online developer tools, JSON viewers, HTML preview tools, HAR analyzers, text utilities, converters, and calculators."
        path="/"
        keywords={[
          "ToolStack",
          "developer tools online",
          "JSON viewer online",
          "HTML preview tool",
          "HAR file analyzer",
          "free online tools",
          "browser-based calculators",
        ]}
        schemas={homeSchemas}
      />

      <header className="space-y-5 py-6 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Free online tools for fast everyday work
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            ToolStack developer tools, calculators, and utilities
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-7 text-muted-foreground">
            ToolStack helps developers, teams, and everyday users solve quick tasks in the browser with JSON viewers,
            HTML preview tools, HAR analyzers, text utilities, converters, and calculators. Every page is built to
            be fast, free, and easy to use without a signup.
          </p>
        </div>
        <ToolSearch />
      </header>

      <section className="space-y-4" aria-labelledby="developer-tools-highlight">
        <header className="space-y-2">
          <h2 id="developer-tools-highlight" className="text-2xl font-semibold text-foreground">
            Popular developer tools on ToolStack
          </h2>
          <p className="text-muted-foreground">
            Browse the most searched developer utilities for debugging payloads, previewing markup, and analyzing
            network traffic.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {developerTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <AdPlaceholder />

      <section className="space-y-4" aria-labelledby="category-browser">
        <header className="space-y-2">
          <h2 id="category-browser" className="text-2xl font-semibold text-foreground">
            Browse tools by category
          </h2>
          <p className="text-muted-foreground">
            Explore developer tools, finance calculators, text utilities, health tools, date tools, and converters.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const count = allTools.filter((tool) => tool.category === category.slug).length;

            return (
              <Link key={category.slug} to={`/category/${category.slug}`}>
                <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-3 pb-4 pt-5">
                    <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold leading-tight text-foreground">{category.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{category.description}</p>
                      <p className="mt-2 text-xs font-medium text-primary">{count} tools</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="featured-tools">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 id="featured-tools" className="text-2xl font-semibold text-foreground">
              Featured free online tools
            </h2>
            <p className="text-muted-foreground">
              Start with some of the most useful pages across ToolStack.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <AdPlaceholder />

      <section className="space-y-5" aria-labelledby="why-toolstack">
        <header className="space-y-2">
          <h2 id="why-toolstack" className="text-2xl font-semibold text-foreground">
            Why developers use ToolStack
          </h2>
          <p className="text-muted-foreground">
            Search engines and users both respond better when utility sites clearly explain what each tool does.
            ToolStack focuses on lightweight browser-based workflows so common tasks like inspecting JSON, previewing
            HTML, converting text, or checking quick calculations are easy to finish in seconds.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">Fast browser workflows</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use free tools online without local installs, account creation, or complex setup.
            </p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">Developer-focused utility pages</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Find developer utilities like JSON viewer online, HTML preview tools, and HAR file analysis in one place.
            </p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">Clear internal linking</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Move between related tools faster through category pages, featured collections, and tool-specific related links.
            </p>
          </article>
        </div>
      </section>

      {categories.map((category) => {
        const tools = allTools.filter((tool) => tool.category === category.slug).slice(0, 3);

        if (tools.length === 0) {
          return null;
        }

        return (
          <section key={category.slug} className="space-y-3" aria-labelledby={`${category.slug}-preview`}>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 id={`${category.slug}-preview`} className="text-xl font-semibold text-foreground">
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Link
                to={`/category/${category.slug}`}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}

      <AdPlaceholder />
    </div>
  );
}
