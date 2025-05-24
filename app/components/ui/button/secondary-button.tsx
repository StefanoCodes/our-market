import { Button, ButtonProps } from '~/components/ui/button/button'
import { cn } from '~/lib/utils/utils'

interface SecondaryButtonProps extends ButtonProps {
  className?: string
  children: React.ReactNode
}

export default function SecondaryButton({
  className,
  children = 'Get Started',
  ...props
}: SecondaryButtonProps) {
  return (
    <Button
      className={cn(
        'bg-yellow-100 px-8 py-3 font-helvetica text-sm font-medium leading-[18px] text-brand-green hover:bg-yellow-200',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
