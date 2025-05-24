import { Link, useFetcher, useFetchers } from '@remix-run/react'
import { CartForm, Image, Money, OptimisticCartLine } from '@shopify/hydrogen'
import { Loader2 } from 'lucide-react'
import { motion as m } from 'motion/react'
import { useState } from 'react'
import { CartApiQueryFragment } from 'storefrontapi.generated'
import { useAside } from '~/components/layout/Aside'
import { useVariantUrl } from '~/lib/variants'
import { ProductPrice } from '../../Product/ProductPrice'
import { CartLineDescreaseQuantity } from './cart-line-item-descrease-quantity'
import { CartLineItemIncreaseQuantity } from './cart-line-item-increase-quantity'
import { MoneyV2 } from '@shopify/hydrogen/storefront-api-types'
import { cn } from '~/lib/utils/utils'
export type CartLineType = OptimisticCartLine<CartApiQueryFragment>
const variants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 0 },
  hiddenOnSwipe: { opacity: 0, x: '-200vw' },
  dragging: (distance: number) => ({
    x: distance,
    opacity: 1 - Math.abs(distance) / 500,
    transition: {
      duration: 0,
      ease: 'linear',
    },
  }),
  swipeLeft: {
    x: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
      opacity: { duration: 0.3, delay: 0.2 },
    },
  },
}
export function CartLineItem({
  line,
  hideQuantityAdjusters = false,
}: {
  line: CartLineType
  hideQuantityAdjusters?: boolean
}) {
  const { id, merchandise, quantity } = line
  const { product, title, image, selectedOptions, compareAtPrice } = merchandise ?? {}

  const lineItemUrl = product?.handle ? useVariantUrl(product.handle, selectedOptions) : '#'
  const { close } = useAside()
  const fetchers = useFetchers()
  // Check if there's any fetcher specifically working on this line item
  const isLineItemLoading = fetchers.some(
    (fetcher) => fetcher.state !== 'idle' && fetcher.formData?.get('lineId') === id,
  )

  // logic for swiping to remove item
  // const [touchStart, setTouchStart] = useState<number | null>(null)
  // const [touchEnd, setTouchEnd] = useState<number | null>(null)
  // const minSwipeDistance = 50

  // const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  // const [dragDistance, setDragDistance] = useState(0)

  // const handleOnTouchStart = (e: React.TouchEvent<HTMLLIElement>) => {
  //   setTouchEnd(null)
  //   setTouchStart(e.targetTouches[0].clientX)
  // }

  // const handleOnTouchMove = (e: React.TouchEvent<HTMLLIElement>) => {
  //   if (!touchStart) return
  //   const currentTouch = e.targetTouches[0].clientX
  //   const distance = currentTouch - touchStart
  //   setTouchEnd(currentTouch)
  //   setDragDistance(Math.min(0, distance))
  // }

  // const handleOnTouchEnd = () => {
  //   if (!touchStart || !touchEnd) return
  //   const distance = touchStart - touchEnd
  //   const isLeftSwipe = distance > minSwipeDistance

  //   if (isLeftSwipe) {
  //     setDragDistance(0)
  //     requestAnimationFrame(() => {
  //       setSwipeDirection('left')
  //     })
  //   } else {
  //     setDragDistance(0)
  //     setSwipeDirection(null)
  //   }
  // }

  return (
    <li
      className="border-t border-grey-300 pb-6 pt-3 first-of-type:border-t-0 md:transform-none"

      // animate={dragDistance !== 0 ? 'dragging' : swipeDirection ? swipeDirection : 'visible'}
      // custom={dragDistance}
      // exit={swipeDirection ? 'hiddenOnSwipe' : 'hidden'}
      // variants={variants}
      // transition={{
      //   duration: 0.3,
      //   ease: [0.32, 0.72, 0, 1],
      // }}
      // onTouchStart={handleOnTouchStart}
      // onTouchMove={handleOnTouchMove}
      // onTouchEnd={handleOnTouchEnd}
      // style={{
      //   // Only allow x-axis movement on mobile
      //   touchAction: 'pan-x',
      // }}
    >
      <div className="flex flex-row items-center justify-between">
        {/* img title qty and price */}
        <div className="flex flex-row items-center gap-4">
          {image && (
            <Image
              alt={image.altText ?? `${title} Product Image`}
              aspectRatio="1/1"
              data={image}
              sizes="(min-width: 45em) 50vw, 100vw"
              className="h-full w-full max-w-[70px] rounded-sm object-cover"
              loading="lazy"
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="flex max-w-44 flex-col gap-1">
              <Link
                to={lineItemUrl}
                onClick={close}
                className="font-helvetica font-medium text-black"
              >
                {product?.title ?? 'Product'}
              </Link>
              <div className="flex flex-row items-center gap-1 truncate font-helvetica text-xs font-regular text-grey-600">
                {/* {selectedOptions.map((option) => (
                  <p className="text-xs" key={`${product.id}-${option.name}`}>
                    {option.name}
                  </p>
                ))}
                <p className="text-">{title}</p> */}
              </div>
            </div>
          </div>
        </div>
        {/* drop a review */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {!hideQuantityAdjusters && <CartLineDescreaseQuantity line={line} />}
              <span className="rounded-md border border-grey-300 bg-grey-100 px-[10px] py-1 font-helvetica text-base font-regular text-black">
                {quantity}
              </span>
              {/* quantity adjsuters */}
              {!hideQuantityAdjusters && <CartLineItemIncreaseQuantity line={line} />}
            </div>
            {/* remove button only shown on desktop */}
            <div className="hidden md:block">
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesRemove}
                inputs={{
                  lineIds: [id],
                }}
              >
                <button className="font-helvetica text-xs font-regular text-grey-600">
                  Remove
                </button>
              </CartForm>
            </div>
          </div>
          {/* clear item */}
          {/* price and clear item */}
          <div className="relative flex w-[58px] items-center justify-center font-helvetica text-base font-medium text-black">
            {/* listen to the fetcher state and upate wiht a loading spinner */}
            {isLineItemLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              <ProductPrice
                price={line.cost?.totalAmount ?? undefined}
                className={cn(compareAtPrice && 'text-brand-red')}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export function CartLineItemSkeleton() {
  return (
    <div className="flex animate-pulse flex-row items-center gap-4">
      <div className="h-10 w-10 rounded-md bg-grey-100" />
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-4 w-full rounded-md bg-grey-100" />
        <div className="h-4 w-full rounded-md bg-grey-100" />
      </div>
    </div>
  )
}
export function ProductPriceWithCompareAtPrice({
  compareAtPrice,
}: {
  compareAtPrice?: MoneyV2 | null
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      {compareAtPrice && <ProductPrice price={compareAtPrice} />}
    </div>
  )
}
