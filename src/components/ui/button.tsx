import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-klarna-ink text-white hover:bg-black active:scale-[0.98]",
      secondary: "bg-klarna-surface-2 text-klarna-ink hover:bg-klarna-border active:scale-[0.98]",
      outline: "border border-klarna-border bg-klarna-canvas text-klarna-ink hover:bg-klarna-surface-1 active:scale-[0.98]",
      ghost: "hover:bg-klarna-surface-2 text-klarna-ink",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizeStyles = {
      default: "h-9 sm:h-10 px-4 sm:px-5 py-2 text-xs sm:text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-6 text-sm sm:text-base",
      icon: "h-9 w-9 sm:h-10 sm:w-10 p-0",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all focus-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
