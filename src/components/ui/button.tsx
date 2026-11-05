import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-hover focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-text-primary shadow-[0_0_16px_rgba(47,107,255,0.35)] hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(47,107,255,0.5)] active:bg-primary-pressed active:scale-[0.99]',
        secondary:
          'bg-surface-2 text-text-primary border border-border hover:bg-surface-elevated hover:border-border-highlight active:scale-[0.99]',
        destructive:
          'bg-destructive/12 text-destructive border border-destructive/30 hover:bg-destructive/22 active:scale-[0.99]',
        outline:
          'border border-border bg-transparent text-text-primary hover:bg-surface-2 hover:border-border-highlight',
        ghost:
          'text-text-secondary hover:text-text-primary hover:bg-surface-2',
        link:
          'text-primary-hover underline-offset-4 hover:underline hover:text-cyan-accent p-0 h-auto',
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
