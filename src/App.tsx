import { Suspense, lazy, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Layout from "./components/Layout";
import PageLoadingState from "./components/PageLoadingState";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const HarAnalyzerPage = lazy(() => import("./tools/har-analyzer/HarAnalyzerPage"));
const JsonFormatterPage = lazy(() => import("./tools/json-formatter/JsonFormatterPage"));
const GstCalculatorPage = lazy(() => import("./tools/gst-calculator/GstCalculatorPage"));
const GlinerExtractorPage = lazy(() => import("./tools/gliner/GlinerExtractor"));

function withFallback(element: ReactNode) {
  return <Suspense fallback={<PageLoadingState />}>{element}</Suspense>;
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={withFallback(<HomePage />)} />
          <Route path="/har-analyzer" element={withFallback(<HarAnalyzerPage />)} />
          <Route path="/json-formatter" element={withFallback(<JsonFormatterPage />)} />
          <Route path="/gst-calculator" element={withFallback(<GstCalculatorPage />)} />
          <Route path="/gliner-extractor" element={withFallback(<GlinerExtractorPage />)} />
          <Route path="/about" element={withFallback(<AboutPage />)} />
          <Route path="/contact" element={withFallback(<ContactPage />)} />
          <Route path="/privacy" element={withFallback(<PrivacyPage />)} />
          <Route path="*" element={withFallback(<NotFound />)} />
        </Route>
      </Routes>

      <Analytics />
    </>
  );
}

export default App;
