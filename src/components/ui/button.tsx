import React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex shrink-0 items-center justify-center text-center font-sans font-semibold leading-snug transition-colors duration-200 " +
      "focus-ring " +
      "disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

    const variants = {
      // Heritage green — primary action
      primary:
        "bg-action text-on-action enabled:hover:bg-action-hover border border-transparent",

      // Rice paper — secondary action (light surface)
      secondary:
        "bg-surface-muted text-ink border border-transparent enabled:hover:bg-surface-hover",

      // Outline — tertiary, minimal
      outline:
        "border border-ink-faint/50 text-ink enabled:hover:bg-surface-muted",

      // Ghost — icon context, toolbar
      ghost:
        "border border-transparent text-ink-soft enabled:hover:bg-surface-muted enabled:hover:text-ink",

      // Kept for existing consumers; use primary for the main action.
      gold:
        "bg-accent-soft text-accent-ink border border-transparent enabled:hover:border-accent-ink/40",
    };

    const sizes = {
      sm: "min-h-11 px-3 py-2 text-sm gap-1.5",
      md: "min-h-12 px-5 py-3 text-base gap-2",
      lg: "min-h-13 px-6 py-3.5 text-base gap-2.5",
      icon: "size-11 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
