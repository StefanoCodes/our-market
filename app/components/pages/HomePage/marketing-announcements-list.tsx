import { MediaImage } from '@shopify/hydrogen/storefront-api-types'
import { MarketingAnnouncementCard } from './markerting-announcement-card'

export function MarketingAnnouncementsList({
  bannerImages,
  bannerImagesLinks,
}: {
  bannerImages: MediaImage[] | undefined
  bannerImagesLinks: string[] | undefined
}) {
  return (
    <ul
      className="hide-scrollbars relative z-10 flex w-full min-w-full snap-x snap-mandatory flex-row gap-6 overflow-x-auto scroll-smooth px-4 py-6 md:px-6"
      aria-label="Marketing announcements"
    >
      {bannerImages?.map((image, index) => (
        <MarketingAnnouncementCard key={image.id} image={image} href={bannerImagesLinks?.[index]} />
      ))}
    </ul>
  )
}
