import { forwardRef } from 'react'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils/utils'

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          `border border-grey-300 px-4 py-5 text-sm text-black shadow-none ring-0 placeholder:text-sm placeholder:text-grey-500 focus-visible:ring-0`,
          className,
        )}
        {...props}
      />
    )
  },
)

CustomInput.displayName = 'CustomInput'

export default CustomInput
