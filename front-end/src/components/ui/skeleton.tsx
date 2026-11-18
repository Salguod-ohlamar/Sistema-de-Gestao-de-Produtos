import { cn } from '@/lib/utils'

// Componente React responsável por renderizar skeleton.
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[10px] bg-surface-2 border border-border/50', className)}
      {...props}
    />
  )
}

export { Skeleton }
