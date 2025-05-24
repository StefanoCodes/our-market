import { Link, useLocation } from '@remix-run/react'
import Star from '~/components/ui/icons/star'
import { Skeleton } from '~/components/ui/skeleton'

interface SellerBannerReviews {
  rating: {
    starCount: number
    reviewsCount: number
  }
}
export default function SellerBannerReviews({ rating }: SellerBannerReviews) {
  const location = useLocation()
  const existingUrl = location.pathname + location.search
  const starCount = Math.round(rating.starCount * 10) / 10
  const reviewsCount = rating.reviewsCount
  return (
    <Link
      to={`${existingUrl}#reviews`}
      target="_self"
      className="rounded-[14px] bg-white px-2 py-1"
      replace
    >
      <div className="flex flex-row items-center gap-1">
        {/* star */}
        <Star />
        {/* reviews rating + reviews count */}
        <div className="flex flex-row gap-[2px]">
          <span className="font-helvetica text-xs font-medium text-yellow-800">{starCount}</span>
          <span className="font-helvetica text-xs font-regular text-grey-700">
            ({reviewsCount})
          </span>
        </div>
      </div>
    </Link>
  )
}

// skeleton
export function SellerBannerReviewsSkeleton() {
  return (
    <Skeleton className="rounded-[14px] bg-white px-2 py-1">
      <div className="flex flex-row items-center gap-1">
        <Star />
        <div className="flex flex-row gap-[2px]">
          <div className="h-2 w-2 rounded-full bg-grey-300" />
          <div className="h-2 w-2 rounded-full bg-grey-300" />
        </div>
      </div>
    </Skeleton>
  )
}
