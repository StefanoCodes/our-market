import { Button } from '~/components/ui/button/button'
import ArrowLeftIcon from '../icons/arrow-left'
import { useNavigate } from '@remix-run/react'
import { cn } from '~/lib/utils/utils'

export default function GoBack({ className }: { className?: string }) {
  const navigate = useNavigate()
  return (
    <Button
      variant="link"
      onClick={() => navigate(-1)}
      className={cn('flex items-center gap-1 px-0', className)}
    >
      <ArrowLeftIcon />
      <span className="font-helvetica text-sm font-medium">Go Back</span>
    </Button>
  )
}
