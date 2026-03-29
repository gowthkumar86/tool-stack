import { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { setSEO } from "../utils/seo";

function NotFound() {
  useEffect(() => {
    setSEO({
      title: "Page Not Found - tool-stack.online",
      description: "The page you requested does not exist. Explore Smart Developer Tools from the home page.",
    });
  }, []);

  return (
    <Card className="p-8 text-center">
      <h1 className="text-2xl font-bold text-[var(--text-strong)]">Page not found</h1>
      <p className="mt-2 text-[var(--text-body)]">The URL might be outdated or typed incorrectly.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl border border-emerald-300/30 bg-emerald-500/12 px-4 py-2 text-sm font-medium text-emerald-100 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-emerald-200/45 hover:bg-emerald-400/18"
      >
        Go back home
      </Link>
    </Card>
  );
}

export default NotFound;
