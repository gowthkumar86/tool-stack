import { ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as HelmetAsync from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppProvidersProps {
  children: ReactNode;
  helmetContext?: Record<string, unknown>;
}

export default function AppProviders({ children, helmetContext }: AppProvidersProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const isClient = typeof window !== "undefined";
  const HelmetProvider = HelmetAsync.HelmetProvider;

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {isClient && (
            <>
              <Toaster />
              <Sonner />
            </>
          )}
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
