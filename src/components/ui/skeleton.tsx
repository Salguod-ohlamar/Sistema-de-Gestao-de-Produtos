import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[10px] bg-[#0E1526] border border-[#1B2540]/50', className)}
      {...props}
    />
  )
}

export { Skeleton }
