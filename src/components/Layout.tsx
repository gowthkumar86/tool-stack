import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Container from "./ui/Container";
import PageTransition from "./ui/pageTransition";

function Layout() {
  const location = useLocation();

  return (
    <div className="app-shell text-[var(--text-body)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border-muted)] glass-surface">
        <Container className="py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/90">tool-stack.online</p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-strong)]">
            Developer tools for real debugging workflows
          </p>
        </Container>
        <Navbar />
      </header>

      <main className="py-8 sm:py-10">
        <Container>
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </Container>
      </main>

      <footer className="border-t border-[var(--border-muted)] bg-[rgba(8,13,24,0.64)]">
        <Container className="py-5 text-sm text-[var(--text-subtle)]">
          Built for developers who care about practical outputs.
        </Container>
      </footer>
    </div>
  );
}

export default Layout;
