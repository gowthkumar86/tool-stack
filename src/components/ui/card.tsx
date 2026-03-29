import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

function Card({ hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-muted)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_rgba(2,6,23,0.32)] transition-all duration-200 ease-in-out",
        hoverable &&
          "hover:scale-[1.02] hover:border-emerald-300/35 hover:shadow-[0_18px_38px_rgba(2,6,23,0.4),0_0_0_1px_rgba(16,185,129,0.2)]",
        className,
      )}
      {...props}
    />
  );
}

export default Card;
