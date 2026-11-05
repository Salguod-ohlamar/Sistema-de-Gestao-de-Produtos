import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 h-6 text-xs font-medium transition-colors select-none font-sans',
  {
    variants: {
      variant: {
        default:
          'border-primary/30 bg-primary/15 text-primary-hover',
        secondary:
          'border-border bg-surface-2 text-text-secondary',
        success:
          'border-status-success/25 bg-status-success/12 text-status-success',
        warning:
          'border-status-warning/25 bg-status-warning/12 text-status-warning',
        destructive:
          'border-destructive/25 bg-destructive/12 text-destructive',
        outline:
          'border-border text-text-secondary bg-transparent',
        mono:
          'font-mono text-[11px] border-border bg-surface-1 text-text-muted uppercase tracking-wider',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
