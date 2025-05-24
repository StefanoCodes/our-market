// will be setting up an action to handle a customer favoriting the product

import { cn } from '~/lib/utils/utils'
import { Heart } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { ButtonProps } from '~/components/ui/button'
import { useFetcher } from '@remix-run/react'
type ActionData = {
  success: boolean
  message: string
}
interface ProductFavoriteProps extends ButtonProps {
  className?: string
}
export default function ProductFavorite({ className, ...props }: ProductFavoriteProps) {
  const fetcher = useFetcher<ActionData>()
  // submits to the resource.wishlist.ts endpoint
  // optimistic update on the heart to make it filled immediately and show a toast messages immediately
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(`flex h-12 w-12 cursor-pointer items-center justify-center`, className)}
            {...props}
          >
            <Heart className="h-4 w-4 transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-brand-green text-white">
          <p>Add to favorites</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
