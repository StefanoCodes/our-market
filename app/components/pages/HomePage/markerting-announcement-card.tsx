import { Image } from '@shopify/hydrogen'
import { MediaImage } from '@shopify/hydrogen/storefront-api-types'
import { Link } from '@remix-run/react'
import { cn } from '~/lib/utils/utils'
import { Skeleton } from '~/components/ui/skeleton'
interface MarketingAnnouncementCardProps {
  image: MediaImage
  className?: string
  href?: string
}

export function MarketingAnnouncementCard({
  image,
  href,
  className,
}: MarketingAnnouncementCardProps) {
  return (
    <li className="min-h-[160px] min-w-[375px] snap-center">
      <Link
        to={href ?? '/'}
        aria-label={image.alt ?? 'Marketing announcement'}
        prefetch="intent"

      >
        <Image
          data={image.image ?? undefined}
          key={image.id}
          sizes="(min-width: 45em) 50vw, 100vw"
          className={cn(className)}
          width={375}
          height={160}
          loading="eager"
        />
      </Link>
    </li>
  )
}

// indivudal skeleton for the marketing announcement card
export function MarketingAnnouncementCardSkeleton() {
  return <Skeleton className="min-h-[160px] min-w-[375px] snap-center" />
}

// skeleton for the marketing announcement card list
export function MarketingAnnouncementCardListSkeleton({ number = 3 }: { number?: number }) {
  return (
    <ul
      className="hide-scrollbars relative z-10 flex w-full min-w-full snap-x snap-mandatory flex-row gap-6 overflow-x-auto scroll-smooth px-4 py-6 md:px-6"
      role="list"
      aria-label="Marketing announcements"
    >
      {Array.from({ length: number }).map((_, index) => (
        <MarketingAnnouncementCardSkeleton key={index} />
      ))}
    </ul>
  )
}
