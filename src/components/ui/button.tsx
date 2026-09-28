import React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    // Base: sử dụng design tokens thay vì hex cứng
    // focus-ring class từ index.css (WCAG 2.1 AA gold ring)
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 " +
      "focus-ring " +
      "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl";

    const variants = {
      // Heritage green — primary action
      primary:
        "bg-heritage-green hover:bg-heritage-dark text-warm-ivory " +
        "border border-antique-gold/40 shadow-sm",

      // Rice paper — secondary action (light surface)
      secondary:
        "bg-warm-ivory dark:bg-surface-muted text-heritage-green dark:text-ink " +
        "border border-antique-gold hover:bg-rice-paper dark:hover:bg-surface-hover",

      // Outline — tertiary, minimal
      outline:
        "border border-heritage-green/25 dark:border-antique-gold/30 " +
        "text-heritage-dark dark:text-ink " +
        "hover:bg-heritage-green/10 dark:hover:bg-antique-gold/10",

      // Ghost — icon context, toolbar
      ghost:
        "text-heritage-dark dark:text-ink " +
        "hover:bg-heritage-green/10 dark:hover:bg-antique-gold/10",

      // Gold — highlight CTA, featured action
      gold:
        "bg-antique-gold hover:bg-[#C5A457] text-heritage-dark font-semibold " +
        "border border-heritage-dark/20 shadow-sm " +
        "hover:shadow-[0_4px_16px_rgba(217,183,106,0.35)]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
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
