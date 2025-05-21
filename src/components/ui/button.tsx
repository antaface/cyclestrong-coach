
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-[#F49E85] text-primary-foreground hover:scale-[1.03] hover:shadow-md active:scale-[0.98] font-bold uppercase text-button-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.03] font-bold uppercase text-button-primary",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:scale-[1.02] font-medium text-button-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.03] font-medium text-button-secondary",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground font-medium text-button-secondary",
        link: "text-primary underline-offset-4 hover:underline font-medium text-button-secondary",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80 hover:scale-[1.03] font-medium text-button-secondary",
      },
      size: {
        default: "h-12 px-6 py-3.5", // Increased padding for finger tap zones
        sm: "h-10 rounded-md px-4 py-3",
        lg: "h-14 rounded-md px-8 text-base py-3.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
