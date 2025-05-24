import { Await, Link } from '@remix-run/react'
import {
  CartForm,
  Image,
  Money,
  OptimisticInput,
  useOptimisticCart,
  useOptimisticData,
} from '@shopify/hydrogen'
import { Suspense, useEffect, useState } from 'react'
import { ProductItemDataFragment } from 'storefrontapi.generated'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils/utils'
// import ProductBadge from './product-badge'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { calculatePercentageOff, pricePerUnit } from '~/lib/utils/product'
import { useRootLoaderData } from '~/root'
import { AddToCartButton } from '../../Cart/ui/add-to-cart'
import ProductFavorite from './product-favorites'
import { ProductPercentageOff } from './product-percentage-off'
import background from '/backgrounds/green-background.svg'
import { Button } from '~/components/ui/button'
import { TouchArea } from '~/components/ui/touch-area'
const KEYS = {
  SKELETON: 'product-card-skeleton',
} as const

interface ProductCardProps {
  swipeable?: boolean
  loading?: 'eager' | 'lazy'
  product: ProductItemDataFragment
}

type OptimisticData = {
  action?: string
  quantity?: number
}

function CartLineQuantityAdjust({
  lineId,
  currentQuantity,
  maxQuantity,
}: {
  lineId: string
  currentQuantity: number
  maxQuantity: number
}) {
  const optimisticData = useOptimisticData<OptimisticData>(lineId)
  const optimisticQuantity = optimisticData?.quantity || currentQuantity
  const [maxTooltipOpen, setMaxTooltipOpen] = useState(false)

  const prevQuantity = Math.max(0, optimisticQuantity - 1)
  const nextQuantity = Math.min(maxQuantity, optimisticQuantity + 1)

  const isAtMinQuantity = optimisticQuantity <= 1
  const isAtMaxQuantity = optimisticQuantity >= maxQuantity

  useEffect(() => {
    if (maxTooltipOpen) {
      setMaxTooltipOpen(true)
      const timer = setTimeout(() => setMaxTooltipOpen(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [maxTooltipOpen])

  return (
    <div className="z-10 flex h-8 items-center gap-2 rounded-lg border border-brand-green bg-green-100 text-brand-green lg:w-[130px] lg:justify-center">
      <div>
        {isAtMinQuantity && (
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{
              lines: [{ id: lineId, quantity: prevQuantity }],
            }}
          >
            <Button
              className={cn(
                'hover:bg-transparent flex h-8 w-8 items-center justify-center rounded-full transition-all',
              )}
              type="submit"
              variant={'ghost'}
              // we need to disable if we are updating an item optimstically
            >
              <AnimatePresence mode="popLayout">
                {isAtMinQuantity && (
                  <motion.div
                    initial={{ opacity: 1, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 0, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, rotate: 0, transition: { duration: 0.2 } }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </CartForm>
        )}

        {!isAtMinQuantity && (
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{
              lines: [{ id: lineId, quantity: prevQuantity }],
            }}
          >
            <Button
              className={cn(
                'hover:bg-transparent flex h-8 w-8 items-center justify-center rounded-full transition-all',
              )}
              type="submit"
              variant={'ghost'}
            >
              <AnimatePresence mode="popLayout">
                {!isAtMinQuantity && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <OptimisticInput id={lineId} data={{ quantity: prevQuantity }} />
          </CartForm>
        )}
      </div>

      <span className="min-w-[20px] text-center">{optimisticQuantity}</span>

      <TooltipProvider>
        <Tooltip open={maxTooltipOpen} onOpenChange={setMaxTooltipOpen}>
          <TooltipTrigger asChild>
            <div>
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesUpdate}
                inputs={{
                  lines: [{ id: lineId, quantity: nextQuantity }],
                }}
              >
                <Button
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                    isAtMaxQuantity ? 'opacity-50' : 'hover:bg-gray-100',
                  )}
                  disabled={isAtMaxQuantity}
                  type="submit"
                  variant={'ghost'}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <OptimisticInput id={lineId} data={{ quantity: nextQuantity }} />
              </CartForm>
            </div>
          </TooltipTrigger>
          {isAtMaxQuantity && maxTooltipOpen && (
            <TooltipContent>
              <p>Qty Limit Reached</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function ProductCard({ loading, product }: ProductCardProps) {
  const data = useRootLoaderData()
  const selectedVariant = product?.variants?.nodes[0]
  const maxQuantity = selectedVariant?.quantityAvailable ?? 0
  // Use availableForSale and quantityAvailable together to determine stock status
  const isOutOfStock = !selectedVariant?.availableForSale || maxQuantity <= 0

  const percentageOff = calculatePercentageOff(
    Number(product.compareAtPriceRange.minVariantPrice.amount),
    Number(product.priceRange.minVariantPrice.amount),
  )

  return (
    <div className={cn('group relative h-full w-full overflow-hidden')}>
      {/* PRODUCT CARD */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white p-[10px] transition-all md:p-3 md:group-hover:scale-95">
        {/* Product Image (top part) */}
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="relative aspect-square w-full overflow-hidden rounded-xl"
          viewTransition
        >
          <Image
            alt={'Product Image'}
            aspectRatio="1/1"
            src={product.featuredImage?.url || ''}
            sizes="(min-width: 45em) 20vw, 50vw"
            loading={loading}
            className="h-full w-full object-cover"
          />
          {/* will be conditionally rendedred if ther is one */}
          {/* <ProductBadge
            title="POPULAR CHOICE"
            className="absolute bottom-[6px] right-[3px] border border-brand-yellow bg-brand-green text-brand-yellow"
          /> */}
          {/* to display the favorites icon */}
        </Link>
        <ProductFavorite
          onClick={() => {
            console.log('wishlist clicked')
          }}
          className="absolute inset-0 transition-all"
        />

        {/* Product Content (bottom part) */}
        <div className="mt-2 flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <Link
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="mb-auto line-clamp-2 font-helvetica text-xs text-black md:text-base"
              viewTransition
            >
              {product.title}
            </Link>
            <span className="font-helvetica text-xs font-regular text-grey-600">
              $
              {pricePerUnit(
                +product.priceRange.minVariantPrice.amount,
                +(product.variants?.nodes[0]?.weight || 0),
                product.variants?.nodes[0]?.weightUnit || 'POUNDS',
              )}
              /oz
            </span>
          </div>
          {/* price & add to cart */}
          <div className="mt-1 flex w-full flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="relative flex items-center gap-1">
                <Money
                  data={product.priceRange.minVariantPrice}
                  className={cn(
                    'font-inter text-sm text-brand-green md:text-md',
                    +product.compareAtPriceRange.minVariantPrice.amount > 0 && 'text-brand-red',
                  )}
                />
                {Number(product.compareAtPriceRange.minVariantPrice.amount) > 0 && (
                  <Money
                    data={product.compareAtPriceRange.minVariantPrice}
                    className={cn(
                      'absolute inset-0 -top-1 left-10 font-inter text-2xs text-grey-500 line-through md:left-14 md:text-sm',
                    )}
                  />
                )}
              </div>
              <span className="font-helvetica text-xs font-regular text-grey-600">1k sold</span>
            </div>
            <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
              <Await resolve={data?.cart}>
                {(cart) => {
                  const optimisticCart = useOptimisticCart(cart)
                  const optimisticData = useOptimisticData<OptimisticData>(selectedVariant?.id)
                  // optimstic line item
                  const optimisticLineItem = optimisticCart?.lines.nodes.find(
                    (line) => line.merchandise.id === selectedVariant.id,
                  )

                  // original cart line item

                  const originalCartLineItem = cart?.lines.nodes.find(
                    (line) => line.merchandise.id === selectedVariant.id,
                  )

                  const currentQuantity =
                    optimisticLineItem?.quantity || optimisticData?.quantity || 0

                  return (
                    <>
                      {isOutOfStock ? (
                        <span className="font-helvetica text-xs font-regular text-grey-600">
                          Out of stock
                        </span>
                      ) : originalCartLineItem?.id && currentQuantity >= 1 ? (
                        <CartLineQuantityAdjust
                          lineId={optimisticLineItem?.id || selectedVariant.id}
                          currentQuantity={currentQuantity}
                          maxQuantity={maxQuantity}
                        />
                      ) : (
                        <AddToCartButton
                          lines={
                            selectedVariant
                              ? [
                                  {
                                    merchandiseId: selectedVariant.id,
                                    quantity: 1,
                                    selectedVariant: selectedVariant,
                                  },
                                ]
                              : []
                          }
                          afterAddedToCartText=""
                          className="z-20 flex h-full w-10 flex-row items-center gap-2 rounded-full p-3 transition-all duration-300 group-hover:lg:w-[130px]"
                        >
                          <div className="hidden transition-all lg:invisible lg:flex lg:w-0 lg:flex-none lg:self-stretch lg:opacity-0 lg:group-hover:visible lg:group-hover:w-auto lg:group-hover:flex-1 lg:group-hover:opacity-100">
                            Add To Cart
                          </div>
                          <div className="lg:flex-shrink-1 w-full cursor-pointer group-hover:mr-[0px] lg:mr-[7px] lg:flex-1">
                            <Plus className="h-full w-full text-white" />
                          </div>
                        </AddToCartButton>
                      )}
                    </>
                  )
                }}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
      {/* top right percentage off */}
      <div className="absolute right-2 top-3">
        {percentageOff > 0 && <ProductPercentageOff percentageOff={percentageOff} />}
      </div>
      {/* absolute bg visible once we scale down the card on group hover */}
      {/* on mobile no hover effect */}
      <div className="invisible absolute inset-0 -z-10 hidden overflow-hidden rounded-xl bg-brand-green opacity-0 transition-all group-hover:visible group-hover:opacity-100 md:block">
        <Image
          src={background}
          className="absolute h-full w-full object-cover"
          sizes="(min-width: 45em) 20vw, 50vw"
          loading={loading}
        />
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative h-full">
      <div className="flex h-full min-w-product-card-mobile flex-col overflow-hidden rounded-xl bg-white p-[10px] md:min-w-product-card-desktop md:p-3">
        {/* Image skeleton */}
        <Skeleton className="aspect-square w-full rounded-xl" />

        {/* Content skeleton */}
        <div className="mt-2 flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          {/* Price and button skeleton */}
          <div className="mt-1 flex w-full flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductsCardSkeleton({ products = 5 }: { products?: number }) {
  // if the number of products is greater than 5 we will render rows
  // will use the module sign to know how many rows to render
  const rows = Math.ceil(products / 5)
  const array = Array.from({ length: rows })

  return (
    <div className="hide-scrollbars flex h-full w-full flex-col gap-product-row-mobile overflow-y-auto">
      {array.map((_, index) => (
        <div className="flex h-full flex-row gap-product-row-mobile" key={index}>
          {Array.from({ length: 6 }, (_, index) => (
            <ProductCardSkeleton key={`${KEYS.SKELETON}-${index}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
