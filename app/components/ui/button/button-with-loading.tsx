import { LoaderIcon } from '~/components/features/Onboarding/steps/loading'
import { Button } from './button'
import { cn } from '~/lib/utils/utils'
import { ButtonProps } from '../button'
const primaryButtonClasses =
  'text-brand-pearl font-helvetica font-medium text-base w-full h-12 shadow-none relative grid place-items-center'
export function ButtonWithLoading({
  children = 'Click Me',
  className,
  isLoading,
}: {
  children?: React.ReactNode
  className?: string
  isLoading: boolean
}) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(primaryButtonClasses, className)}
      variant="brand"
    >
      <span
        className={`col-start-1 row-start-1 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      >
        {children}
      </span>
      <LoaderIcon isLoading={isLoading} />
    </Button>
  )
}
