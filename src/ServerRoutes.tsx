import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import ToolPage from "./pages/ToolPage";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

export default function ServerRoutes() {
  return (
    <Layout>
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
    </Layout>
  );
}
