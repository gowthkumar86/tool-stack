import { NavLink } from "react-router-dom";
import { cn } from "../lib/cn";
import Container from "./ui/Container";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/har-analyzer", label: "HAR Analyzer" },
  { path: "/json-formatter", label: "JSON Formatter" },
  { path: "/gst-calculator", label: "GST Tool" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/privacy", label: "Privacy" },
];

function Navbar() {
  return (
    <nav className="border-t border-[var(--border-muted)] bg-[rgba(8,13,24,0.48)]" aria-label="Main navigation">
      <Container className="flex flex-wrap items-center gap-1 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "rounded-lg border px-3 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
                isActive
                  ? "border-emerald-300/35 bg-emerald-500/12 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.26)]"
                  : "border-transparent text-[var(--text-subtle)] hover:scale-[1.02] hover:border-[var(--border-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </Container>
    </nav>
  );
}

export default Navbar;
