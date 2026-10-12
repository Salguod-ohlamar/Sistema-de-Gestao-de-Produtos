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
            'group toast group-[.toaster]:bg-[#0E1526] group-[.toaster]:text-[#EAF0FF] group-[.toaster]:border-[#1B2540] group-[.toaster]:shadow-xl group-[.toaster]:rounded-[12px] group-[.toaster]:text-sm',
          description: 'group-[.toast]:text-[#9AA8C7]',
          actionButton:
            'group-[.toast]:bg-[#2F6BFF] group-[.toast]:text-[#EAF0FF] group-[.toast]:rounded-[8px]',
          cancelButton:
            'group-[.toast]:bg-[#141C30] group-[.toast]:text-[#9AA8C7] group-[.toast]:rounded-[8px]',
          error:
            'group-[.toaster]:border-[rgba(242,85,90,0.3)] group-[.toaster]:text-[#F2555A]',
          success:
            'group-[.toaster]:border-[rgba(34,197,94,0.3)] group-[.toaster]:text-[#22C55E]',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
