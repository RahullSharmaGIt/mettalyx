import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-bold transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-2 border-slate-900 shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_#0F172A]",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-slate-900 border-slate-900",
        destructive: "bg-destructive text-white border-slate-900",
        outline: "bg-white text-slate-900 border-slate-900",
        secondary: "bg-cyan-500 text-slate-900 border-slate-900",
        ghost: "hover:bg-slate-100 text-slate-900 shadow-none border-transparent hover:border-slate-900 hover:shadow-neo active:shadow-none",
        link: "text-slate-900 underline-offset-4 hover:underline shadow-none border-transparent active:shadow-none hover:-translate-y-0 hover:-translate-x-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
