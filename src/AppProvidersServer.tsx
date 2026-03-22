import { ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as HelmetAsync from "react-helmet-async";

interface AppProvidersServerProps {
  children: ReactNode;
  helmetContext?: Record<string, unknown>;
}

export default function AppProvidersServer({ children, helmetContext }: AppProvidersServerProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const HelmetProvider = HelmetAsync.HelmetProvider;

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
