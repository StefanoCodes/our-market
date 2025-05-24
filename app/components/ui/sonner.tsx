import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group flex items-center justify-between gap-2 !bg-green-700  !text-brand-pearl text-sm rounded-lg p-4 shadow-none',
          title: 'text-base',
          description: 'text-sm',
          actionButton: 'bg-primary',
          cancelButton: 'bg-muted',
          closeButton: '!text-white/80 !bg-transparent hover:!bg-white/20 rounded-md',
          success: 'group-[.success]:!bg-[#1B4332]',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
