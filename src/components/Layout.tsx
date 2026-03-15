import { Link } from "react-router-dom";
import { Menu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Wrench className="h-5 w-5 text-primary" />
            ToolStack
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-4 text-sm sm:flex">
            <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/category/developer-tools" className="text-muted-foreground transition-colors hover:text-foreground">
              Developer
            </Link>
            <Link to="/category/finance" className="text-muted-foreground transition-colors hover:text-foreground">
              Finance
            </Link>
            <Link to="/category/text-tools" className="text-muted-foreground transition-colors hover:text-foreground">
              Text
            </Link>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 sm:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs">
              <SheetHeader>
                <SheetTitle>Browse ToolStack</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile primary" className="mt-6 flex flex-col gap-2">
                <SheetClose asChild>
                  <Link to="/" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/category/developer-tools"
                    className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                  >
                    Developer
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/category/finance" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
                    Finance
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/category/text-tools"
                    className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                  >
                    Text
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-10 border-t py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <p>Copyright {new Date().getFullYear()} ToolStack</p>

          <nav aria-label="Footer" className="flex gap-4">
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link to="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
