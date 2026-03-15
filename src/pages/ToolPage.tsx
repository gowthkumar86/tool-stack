import { Link, useLocation, useParams } from "react-router-dom";
import ToolEngine from "@/components/ToolEngine";
import RelatedTools from "@/components/RelatedTools";
import AdPlaceholder from "@/components/AdPlaceholder";
import PageSeo from "@/components/PageSeo";
import { categories } from "@/data/categories";
import { getToolBySlug } from "@/data/tools";
import { getLegacyToolPath, getToolPath, getToolSeoCopy, getToolUrl } from "@/lib/toolSeo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotFound from "./NotFound";

const applicationCategoryByToolType: Record<string, string> = {
  "developer-tools": "DeveloperApplication",
  "text-tools": "UtilitiesApplication",
  converters: "UtilitiesApplication",
  finance: "FinanceApplication",
  health: "HealthApplication",
  "date-tools": "UtilitiesApplication",
};

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return <NotFound />;
  }

  const seo = getToolSeoCopy(tool);
  const canonicalPath = getToolPath(tool);
  const canonicalUrl = getToolUrl(tool);
  const isLegacyToolUrl = location.pathname === getLegacyToolPath(tool);
  const category = categories.find((item) => item.slug === tool.category);
  const categoryName = category?.name ?? tool.category;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://tool-stack.online/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `https://tool-stack.online/category/${tool.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: canonicalUrl,
      },
    ],
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    applicationCategory: applicationCategoryByToolType[tool.category] ?? "UtilitiesApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = tool.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  const howToSchema = tool.instructions.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use ${tool.name}`,
        description: `Step-by-step instructions for using the ${tool.name} online tool on ToolStack.`,
        totalTime: "PT2M",
        supply: [],
        tool: [
          {
            "@type": "HowToTool",
            name: tool.name,
          },
        ],
        step: tool.instructions.map((instruction, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: `Step ${index + 1}`,
          text: instruction,
          url: `${canonicalUrl}#how-to-use`,
        })),
      }
    : null;

  const schemas = [breadcrumbSchema, toolSchema];

  if (faqSchema) {
    schemas.push(faqSchema);
  }

  if (howToSchema) {
    schemas.push(howToSchema);
  }

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-6">
      <PageSeo
        title={seo.title}
        description={seo.description}
        path={canonicalPath}
        keywords={seo.keywords}
        robots={isLegacyToolUrl ? "noindex, follow" : "index, follow"}
        schemas={schemas}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/category/${tool.category}`}>{categoryName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tool.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Free online {categoryName.toLowerCase()}
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{tool.name}</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{seo.description}</p>
        </div>
      </header>

      <section className="space-y-3" aria-labelledby="what-this-tool-does">
        <h2 id="what-this-tool-does" className="text-2xl font-semibold text-foreground">
          {seo.whatIsHeading}
        </h2>
        <p className="leading-7 text-muted-foreground">{seo.introParagraph}</p>
      </section>

      <section className="space-y-4" aria-labelledby="tool-interface">
        <header className="space-y-2">
          <h2 id="tool-interface" className="text-2xl font-semibold text-foreground">
            Use the {tool.name} online
          </h2>
          <p className="text-muted-foreground">
            Enter your data below to run this free ToolStack utility directly in the browser.
          </p>
        </header>
        <ToolEngine tool={tool} />
      </section>

      <AdPlaceholder />

      <section id="how-to-use" className="space-y-4" aria-labelledby="how-to-heading">
        <h2 id="how-to-heading" className="text-2xl font-semibold text-foreground">
          {seo.howToHeading}
        </h2>
        <ol className="grid gap-3 md:grid-cols-3">
          {tool.instructions.map((instruction, index) => (
            <li key={instruction} className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold text-primary">Step {index + 1}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{instruction}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-semibold text-foreground">
          {seo.featuresHeading}
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {seo.features.map((feature) => (
            <li key={feature} className="rounded-xl border bg-card p-4 text-sm leading-6 text-muted-foreground">
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="use-cases-heading">
        <h2 id="use-cases-heading" className="text-2xl font-semibold text-foreground">
          {seo.useCasesHeading}
        </h2>
        <ul className="space-y-3">
          {seo.useCases.map((useCase) => (
            <li key={useCase} className="rounded-xl border bg-card p-4 text-sm leading-6 text-muted-foreground">
              {useCase}
            </li>
          ))}
        </ul>
      </section>

      {tool.explanation && (
        <section className="space-y-3" aria-labelledby="tool-background">
          <h2 id="tool-background" className="text-2xl font-semibold text-foreground">
            Why people use this {tool.name.toLowerCase()}
          </h2>
          <p className="leading-7 text-muted-foreground">{tool.explanation}</p>
        </section>
      )}

      {tool.faqs.length > 0 && (
        <section className="space-y-3" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold text-foreground">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full rounded-xl border px-4">
            {tool.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <AdPlaceholder />

      <RelatedTools tool={tool} />
    </article>
  );
}
