import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 h-6 text-xs font-medium transition-colors select-none font-sans',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(47,107,255,0.3)] bg-[rgba(47,107,255,0.15)] text-[#4C82FF]',
        secondary:
          'border-[#1B2540] bg-[#0E1526] text-[#9AA8C7]',
        success:
          'border-[rgba(52,211,153,0.25)] bg-[rgba(52,211,153,0.12)] text-[#34D399]',
        warning:
          'border-[rgba(245,181,68,0.25)] bg-[rgba(245,181,68,0.12)] text-[#F5B544]',
        destructive:
          'border-[rgba(242,85,90,0.25)] bg-[rgba(242,85,90,0.12)] text-[#F2555A]',
        outline:
          'border-[#1B2540] text-[#9AA8C7] bg-transparent',
        mono:
          'font-mono text-[11px] border-[#1B2540] bg-[#0A0F1C] text-[#7A89AB] uppercase tracking-wider',
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
