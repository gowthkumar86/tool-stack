import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageSeo from "@/components/PageSeo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <PageSeo
        title="Page Not Found | ToolStack"
        description="The requested ToolStack page could not be found."
        path={location.pathname}
        robots="noindex, follow"
      />

      <article className="max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">This ToolStack page could not be found.</p>
        <p className="text-sm text-muted-foreground">
          Return to the homepage to browse free online developer tools, calculators, converters, and utility pages.
        </p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </article>
    </div>
  );
};

export default NotFound;
