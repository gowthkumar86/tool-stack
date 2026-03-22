import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";

const Index = lazy(() => import("./pages/Index"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));

function RouteLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/finance-tools" element={<CategoryPage categorySlug="finance" />} />
          <Route path="/developer-tools" element={<CategoryPage categorySlug="developer-tools" />} />
          <Route path="/text-tools" element={<CategoryPage categorySlug="text-tools" />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/tools/:slug" element={<ToolPage />} />
          <Route path="/:slug" element={<ToolPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
