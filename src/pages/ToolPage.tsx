import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getToolBySlug } from "@/data/tools";
import { categories } from "@/data/categories";
import ToolEngine from "@/components/ToolEngine";
import RelatedTools from "@/components/RelatedTools";
import AdPlaceholder from "@/components/AdPlaceholder";
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

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) return <NotFound />;

  const category = categories.find((c) => c.slug === tool.category);
  const categoryName = category?.name || tool.category;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://yourdomain.com/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <Helmet>
      <title>{tool.name} – ToolStack</title>

      <meta name="description" content={tool.description} />

      <link rel="canonical" href={`https://tool-stack.online/tools/${tool.slug}`} />

      <meta property="og:title" content={`${tool.name} – ToolStack`} />
      <meta property="og:description" content={tool.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://tool-stack.online/tools/${tool.slug}`} />
      <meta property="og:image" content="https://tool-stack.online/og-image.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${tool.name} – ToolStack`} />
      <meta name="twitter:description" content={tool.description} />
      <meta name="twitter:image" content="https://tool-stack.online/og-image.png" />

      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(toolSchema)}</script>
    </Helmet>

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

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
        <p className="mt-2 text-muted-foreground">{tool.description}</p>
      </div>

      <ToolEngine tool={tool} />

      <AdPlaceholder />

      {tool.explanation && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">How it Works</h2>
          <p className="text-muted-foreground leading-relaxed">{tool.explanation}</p>
        </section>
      )}

      {tool.faqs.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {tool.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <AdPlaceholder />

      <RelatedTools tool={tool} />
    </div>
  );
}
