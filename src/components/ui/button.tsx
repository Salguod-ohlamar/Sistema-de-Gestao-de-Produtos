import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070D] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#2F6BFF] text-[#EAF0FF] shadow-[0_0_16px_rgba(47,107,255,0.35)] hover:bg-[#4C82FF] hover:shadow-[0_0_20px_rgba(47,107,255,0.5)] active:bg-[#1F52D6] active:scale-[0.99]',
        secondary:
          'bg-[#0E1526] text-[#EAF0FF] border border-[#1B2540] hover:bg-[#141C30] hover:border-[#2A3A66] active:scale-[0.99]',
        destructive:
          'bg-[rgba(242,85,90,0.12)] text-[#F2555A] border border-[rgba(242,85,90,0.3)] hover:bg-[rgba(242,85,90,0.22)] active:scale-[0.99]',
        outline:
          'border border-[#1B2540] bg-transparent text-[#EAF0FF] hover:bg-[#0E1526] hover:border-[#2A3A66]',
        ghost:
          'text-[#9AA8C7] hover:text-[#EAF0FF] hover:bg-[#0E1526]',
        link:
          'text-[#4C82FF] underline-offset-4 hover:underline hover:text-[#38BDF8] p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-[8px] px-3 text-xs',
        lg: 'h-11 rounded-[10px] px-6 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-[8px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
