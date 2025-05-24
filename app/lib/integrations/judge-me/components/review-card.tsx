import { Image } from '@shopify/hydrogen'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import { Rating } from '~/components/ui/rating'
import { Skeleton } from '~/components/ui/skeleton'
import { formatDate } from '~/lib/utils/utils'
export function ReviewCard({
  reviewTitle,
  reviewBody,
  reviewRating,
  reviewPublishedDate,
  reviewAuthor,
  productImage,
}: {
  reviewTitle: string
  reviewBody: string
  reviewRating: number
  reviewPublishedDate: string
  reviewAuthor: string
  productImage: string
}) {
  const formattedReviewPublishedDate = () => {
    const date = new Date(reviewPublishedDate)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }
  return (
    <li className="flex min-w-[20rem] flex-row items-center gap-3 rounded-[12px] bg-white p-3">
      {/* review content */}
      <div className="h-full flex-1">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <Rating interactive={false} size="sm" maxRating={5} rating={reviewRating} />
            <div className="flex flex-col gap-2">
              <h4 className="max-w-[180px] font-helvetica text-sm font-medium text-green-900">
                {reviewTitle}
              </h4>

              <p className="max-w-[180px] text-xs font-medium text-grey-900">{reviewBody}</p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-grey-300" />
            <p className="text-sm font-medium text-black">{reviewAuthor}</p>
            <p className="text-sm font-medium text-grey-600">{formattedReviewPublishedDate()}</p>
          </div>
        </div>
      </div>

      {/* product review image */}

      <Image
        src={productImage}
        alt="Product Image"
        width={84}
        height={84}
        className="self-start rounded-lg"
        aspectRatio="square"
      />
    </li>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div className="hide-scrollbars flex w-full flex-row items-center gap-3 overflow-x-auto rounded-[12px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="relative flex h-[9.375rem] w-full min-w-[20rem] flex-row items-start gap-product-row-mobile space-x-0 space-y-0 border-0 p-3 shadow-none"
        >
          <CardContent className="flex flex-col gap-5 px-0 py-0">
            <div className="flex flex-col gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-4 w-4"
                    style={{
                      clipPath:
                        'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-[27px] max-w-[182px]" />
                <Skeleton className="h-[27px] max-w-[184px]" />
              </div>
            </div>
            <Skeleton className="h-[20px] w-[170px]" />
          </CardContent>
          <CardFooter className="p-0">
            <Skeleton className="h-[5.25rem] w-[5.125rem] items-start" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
