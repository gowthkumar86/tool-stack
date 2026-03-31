import { Suspense, lazy, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
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
const AprilFoolPage = lazy(() => import("./tools/april-fool-fun/AprilFoolPage"));

function withFallback(element: ReactNode) {
  return <Suspense fallback={<PageLoadingState />}>{element}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={withFallback(<HomePage />)} />
        <Route path="/har-analyzer" element={withFallback(<HarAnalyzerPage />)} />
        <Route path="/json-formatter" element={withFallback(<JsonFormatterPage />)} />
        <Route path="/gst-calculator" element={withFallback(<GstCalculatorPage />)} />
        <Route path="/prompt-perfection-engine" element={withFallback(<AprilFoolPage />)} />
        <Route path="/about" element={withFallback(<AboutPage />)} />
        <Route path="/contact" element={withFallback(<ContactPage />)} />
        <Route path="/privacy" element={withFallback(<PrivacyPage />)} />
        <Route path="*" element={withFallback(<NotFound />)} />
      </Route>
    </Routes>
  );
}

export default App;

