import { Image } from '@shopify/hydrogen'
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'
import SellerBannerReviews from './seller-banner-reviews'
import SellerBannerTags from './seller-banner-tags'

interface SellerBannerProps {
  name?: string
  description?: string
  tags: string[]
  rating: {
    starCount: number
    reviewsCount: number
  }
  bannerImage: ImageType
}

export default function SellerBanner({
  name,
  description,
  rating,
  tags,
  bannerImage,
}: SellerBannerProps) {
  const fallbackVendorName = 'Vendor'
  // const fallbackDescription = '' // can be added incase needed
  return (
    <div className="flex flex-col gap-7">
      {/* Content */}
      <div className="flex flex-col gap-[10px]">
        {/* Heading & Description */}
        <div className="flex flex-col gap-1">
          <h2 className="font-helvetica text-xl font-bold capitalize text-green-900">
            {name ?? fallbackVendorName}
          </h2>
          {description && (
            <p className="max-w-prose text-balance font-helvetica text-base text-grey-700">
              {description}
            </p>
          )}
        </div>
        {/* Tags & Reviews  */}
        <div className="flex flex-row items-center justify-between">
          <SellerBannerTags tags={tags} />
          {/* <SellerBannerReviews rating={rating} /> */}
        </div>
      </div>
      {/* image banner */}
      {bannerImage.url !== '' && (
        <div className={`relative mx-auto max-h-[400px] w-full max-w-seller-image-banner`}>
          <Image
            sizes="(min-width: 45em) 50vw, 100vw"
            data={bannerImage}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      )}
    </div>
  )
}
