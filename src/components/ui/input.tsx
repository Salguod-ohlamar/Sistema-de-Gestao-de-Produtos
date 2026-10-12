import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-[10px] border border-[#1B2540] bg-[#0A0F1C] px-3.5 py-2 text-sm text-[#EAF0FF] placeholder:text-[#5F6E8F] transition-all duration-150 focus-visible:outline-none focus-visible:border-[#2F6BFF] focus-visible:ring-2 focus-visible:ring-[#2F6BFF]/30 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
