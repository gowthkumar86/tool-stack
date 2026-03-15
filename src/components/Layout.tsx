import { Link, Outlet } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground font-bold text-lg">
            <Wrench className="h-5 w-5 text-primary" />
            ToolStack
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/category/developer-tools" className="text-muted-foreground hover:text-foreground transition-colors">Developer</Link>
            <Link to="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance</Link>
            <Link to="/category/text-tools" className="text-muted-foreground hover:text-foreground transition-colors">Text</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t mt-10 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

          <p>© {new Date().getFullYear()} ToolStack</p>

          <div className="flex gap-4">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>

        </div>
      </footer>
    </div>
  );
}
