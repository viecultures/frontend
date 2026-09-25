import React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E4B43]/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl";
    
    const variants = {
      primary: "bg-[#1E4B43] hover:bg-[#163D37] text-[#FBF7EE] border border-[#D9B76A]/40 shadow-sm",
      secondary: "bg-[#FBF7EE] dark:bg-[#122924] text-[#1E4B43] dark:text-[#FBF7EE] border border-[#D9B76A] hover:bg-[#F6EEDC] dark:hover:bg-[#1e453c]",
      outline: "border border-[#1E4B43]/25 dark:border-[#D9B76A]/30 text-[#163D37] dark:text-[#FBF7EE] hover:bg-[#1E4B43]/10 dark:hover:bg-[#D9B76A]/10",
      ghost: "text-[#163D37] dark:text-[#FBF7EE] hover:bg-[#1E4B43]/10 dark:hover:bg-[#D9B76A]/10",
      gold: "bg-[#D9B76A] hover:bg-[#C5A457] text-[#163D37] font-semibold border border-[#1E4B43]/20 shadow-sm hover:shadow-[#D9B76A]/20"
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl"
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
