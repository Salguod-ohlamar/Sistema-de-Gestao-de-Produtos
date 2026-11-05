import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-surface-2 group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-[12px] group-[.toaster]:text-sm',
          description: 'group-[.toast]:text-text-secondary',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-text-primary group-[.toast]:rounded-[8px]',
          cancelButton:
            'group-[.toast]:bg-surface-elevated group-[.toast]:text-text-secondary group-[.toast]:rounded-[8px]',
          error:
            'group-[.toaster]:border-destructive/30 group-[.toaster]:text-destructive',
          success:
            'group-[.toaster]:border-[rgba(34,197,94,0.3)] group-[.toaster]:text-[#22C55E]',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
