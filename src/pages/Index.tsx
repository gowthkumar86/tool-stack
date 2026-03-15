import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { categories } from "@/data/categories";
import { getFeaturedTools, allTools } from "@/data/tools";
import ToolSearch from "@/components/ToolSearch";
import ToolCard from "@/components/ToolCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Index() {
  const featured = getFeaturedTools();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Helmet>
        <title>ToolStack – Free Online Tools, Calculators & Utilities</title>
        <meta
          name="description"
          content="Free online tools: calculators, converters, developer utilities, text tools and more. Fast, browser-based, no signup required."
        />
      </Helmet>

      {/* Hero */}
      <section className="text-center space-y-4 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Free Online Tools & Calculators
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {allTools.length}+ browser-based tools for developers, finance, health, text processing, and more. Fast, free, no signup.
        </p>
        <ToolSearch />
      </section>

      <AdPlaceholder />

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = allTools.filter((t) => t.category === cat.slug).length;
            return (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Card className="hover:shadow-md transition-shadow group cursor-pointer h-full">
                  <CardContent className="pt-5 pb-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground leading-tight">{cat.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{count} tools</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Popular Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <AdPlaceholder />

      {/* All categories with preview */}
      {categories.map((cat) => {
        const tools = allTools.filter((t) => t.category === cat.slug).slice(0, 3);
        if (tools.length === 0) return null;
        return (
          <section key={cat.slug} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{cat.name}</h2>
              <Link
                to={`/category/${cat.slug}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
