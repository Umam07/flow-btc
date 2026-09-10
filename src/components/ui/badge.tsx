import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-klarna-ink text-white hover:bg-black",
    secondary: "border-transparent bg-klarna-surface-2 text-klarna-ink hover:bg-klarna-border",
    destructive: "border-red-200/80 bg-red-50 text-klarna-error hover:bg-red-100",
    success: "border-emerald-200/80 bg-emerald-50 text-klarna-success hover:bg-emerald-100",
    warning: "border-amber-200/80 bg-amber-50 text-klarna-warning hover:bg-amber-100",
    outline: "border-klarna-border text-klarna-ink hover:bg-klarna-surface-1",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-klarna-pink",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
