import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,box-shadow,transform] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary: "bg-signal text-white hover:bg-signal-dark shadow-[0_10px_30px_-12px_rgb(228_28_56/0.8)]",
        light: "bg-white text-ink hover:bg-mist",
        dark: "bg-ink text-white hover:bg-deep",
        outline: "border border-current/25 hover:border-current/60",
        ghost: "hover:bg-current/5",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
