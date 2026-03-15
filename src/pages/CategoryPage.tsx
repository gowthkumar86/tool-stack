import { Link, useParams } from "react-router-dom";
import AdPlaceholder from "@/components/AdPlaceholder";
import MobileAccordionSection from "@/components/MobileAccordionSection";
import PageSeo from "@/components/PageSeo";
import ToolCard from "@/components/ToolCard";
import { categories } from "@/data/categories";
import { getToolsByCategory } from "@/data/tools";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return <NotFound />;
  }

  const tools = getToolsByCategory(category.slug);
  const categoryPath = `/category/${category.slug}`;
  const categorySchemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.name} - ToolStack`,
      description: category.description,
      url: `https://tool-stack.online${categoryPath}`,
    },
    {
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
          name: category.name,
          item: `https://tool-stack.online${categoryPath}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${category.name} tools`,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: `https://tool-stack.online/${tool.slug}`,
      })),
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <PageSeo
        title={`${category.name} Online Tools | ToolStack`}
        description={`Browse free ${category.name.toLowerCase()} on ToolStack. ${category.description}`}
        path={categoryPath}
        keywords={[
          category.name,
          `${category.name.toLowerCase()} online`,
          "free online tools",
          "ToolStack",
        ]}
        schemas={categorySchemas}
      />

      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">ToolStack category</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{category.name}</h1>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          {category.description} Explore browser-based pages that are easy to use, easy to link internally, and built
          for quick tasks on desktop or mobile.
        </p>
      </header>

      <MobileAccordionSection title={`What you can do with these ${category.name.toLowerCase()}`}>
        <div className="space-y-4" aria-labelledby="category-benefits">
          <h2 id="category-benefits" className="text-2xl font-semibold text-foreground">
            What you can do with these {category.name.toLowerCase()}
          </h2>
          <p className="leading-7 text-muted-foreground">
            This category brings together related ToolStack pages so you can move between similar utilities without
            repeating the same search. Each page includes SEO-friendly descriptions, structured headings, and related
            links to help users and search engines understand how the tools connect.
          </p>
        </div>
      </MobileAccordionSection>

      <section className="space-y-4" aria-labelledby="category-tool-list">
        <h2 id="category-tool-list" className="text-2xl font-semibold text-foreground">
          {category.name} available on ToolStack
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {tools.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No tools in this category yet.</p>
      )}

      <AdPlaceholder />
    </div>
  );
}
