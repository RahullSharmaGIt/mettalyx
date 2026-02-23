import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-industrial-orange selection:text-white dark:bg-input/30 border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-none h-10 w-full min-w-0 rounded-none bg-white px-3 py-1 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-900 font-mono",
        "focus-visible:border-slate-900 focus-visible:ring-0",
        "aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
