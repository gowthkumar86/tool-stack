import { Helmet } from "react-helmet-async";
import { DEFAULT_KEYWORDS, DEFAULT_OG_IMAGE, SITE_NAME, toAbsoluteUrl } from "@/lib/site";

interface PageSeoProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  robots?: string;
  image?: string;
  type?: string;
  schemas?: Array<Record<string, unknown>>;
}

export default function PageSeo({
  title,
  description,
  path = "/",
  keywords = [],
  robots = "index, follow",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  schemas = [],
}: PageSeoProps) {
  const url = toAbsoluteUrl(path);
  const mergedKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords]));

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={mergedKeywords.join(", ")} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
