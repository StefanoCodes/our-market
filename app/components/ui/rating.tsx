import { cn } from '~/lib/utils/utils'
import { Star } from 'lucide-react'
import { useState } from 'react'
import StarIcon from './icons/star-icon'

interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  onRatingChange?: (rating: number) => void
  className?: string
  value?: number
}

export function Rating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  onRatingChange,
  value,
  className,
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const currentRating = value !== undefined ? value : rating

  return (
    <div className={cn('flex flex-row items-center gap-1', className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1
        return (
          <StarIcon
            key={index}
            className={cn(
              sizeClasses[size],
              'transition-all',
              starRating <= (hoverRating || currentRating) ? 'fill-[#FFC645]' : 'fill-grey-400',
              interactive && 'cursor-pointer',
            )}
            onMouseEnter={() => interactive && setHoverRating(starRating)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => {
              if (interactive) {
                onChange?.(starRating)
                onRatingChange?.(starRating)
              }
            }}
          />
        )
      })}
    </div>
  )
}
