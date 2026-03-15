import type { ReactNode } from "react";
import { useId } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileAccordionSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  defaultOpen?: boolean;
}

export default function MobileAccordionSection({
  title,
  children,
  className,
  contentClassName,
  defaultOpen = false,
}: MobileAccordionSectionProps) {
  const isMobile = useIsMobile();
  const id = useId();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? id : undefined}
      className={cn("rounded-2xl border bg-card px-4", className)}
    >
      <AccordionItem value={id} className="border-none">
        <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className={cn("pb-4", contentClassName)}>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
