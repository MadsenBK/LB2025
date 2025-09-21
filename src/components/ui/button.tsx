import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-xl px-4 py-2 font-medium transition-colors focus:outline-none",
          variant === "primary" &&
            "bg-[#E30613] text-white hover:bg-[#3A6EA5]",
          variant === "secondary" &&
            "bg-gray-200 text-black hover:bg-gray-300",
          variant === "danger" &&
            "bg-red-600 text-white hover:bg-red-700",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";