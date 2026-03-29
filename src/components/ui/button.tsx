import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-emerald-300/30 bg-emerald-500/15 text-emerald-100 hover:scale-[1.02] hover:border-emerald-200/40 hover:bg-emerald-400/20 hover:shadow-[0_10px_28px_rgba(16,185,129,0.16)]",
  secondary:
    "border border-[var(--border-muted)] bg-[var(--surface-muted)] text-[var(--text-strong)] hover:scale-[1.02] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]",
  ghost:
    "border border-transparent text-[var(--text-subtle)] hover:scale-[1.02] hover:border-[var(--border-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});

export default Button;

