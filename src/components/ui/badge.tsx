import React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cefr-a2" | "cefr-b1" | "cefr-b2" | "cefr-c1" | "gold" | "bamboo" | "lacquer" | "outline";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "gold", children, ...props }) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors";

  const variants = {
    "cefr-a2": "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40",
    "cefr-b1": "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300/40",
    "cefr-b2": "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-400/40",
    "cefr-c1": "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300/40",
    gold: "bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30",
    bamboo: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30",
    lacquer: "bg-rose-500/15 text-rose-900 dark:text-rose-300 border border-rose-500/30",
    outline: "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
