import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils/utils'
import { LoaderIcon } from '../features/Onboarding/steps/loading'
interface GlobalLoadingProps {
  /**
   * Optional message to display below the spinner
   */
  message?: string
  /**
   * Optional className to apply to the container
   */
  className?: string
}

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return <Loader2 className={cn('animate-spin text-primary', className)} size={size} />
}

export function GlobalLoading({ message, className }: GlobalLoadingProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/30 ${className}`}
    >
      <LoaderIcon isLoading={true} />
      {message && <p className="mt-4 text-lg font-medium text-muted-foreground">{message}</p>}
    </div>
  )
}
