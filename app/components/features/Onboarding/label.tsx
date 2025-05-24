import { LabelProps } from '@radix-ui/react-label'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils/utils'

interface CustomLabelProps extends LabelProps {
  children: React.ReactNode
  className?: string
}

export default function CustomLabel({ children, className, ...props }: CustomLabelProps) {
  return (
    <Label {...props} className={cn(`font-helvetica text-xs font-medium text-black`, className)}>
      {children}
    </Label>
  )
}
