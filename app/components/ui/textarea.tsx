import * as React from 'react'
import { cn } from '~/lib/utils/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'bg-transparent min-h-[60px] w-full rounded-md border border-grey-300 px-4 py-2 text-sm text-black shadow-none placeholder:text-sm placeholder:text-grey-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
