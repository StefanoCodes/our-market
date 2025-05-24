import { Await, useAsyncValue } from '@remix-run/react'
import { CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen'
import { Suspense } from 'react'
import { CartApiQueryFragment } from 'storefrontapi.generated'
import { Button } from '~/components/ui/button/button'
import CartIcon from '~/components/ui/icons/cart-icon'
import { cn } from '~/lib/utils/utils'
import { useAside } from '../Aside'
import { Skeleton } from '~/components/ui/skeleton'
import { TouchArea } from '~/components/ui/touch-area'

interface CartToggleBadgeProps {
  cart: Promise<CartApiQueryFragment | null>
  showLabel?: boolean
  iconClassName?: string
  className?: string
}

export default function CartToggleBadge({
  cart,
  showLabel = true,
  iconClassName,
  className,
}: CartToggleBadgeProps) {
  return (
    <Suspense fallback={<CartBannerSkeleton />}>
      <Await resolve={cart}>
        <CartBanner iconClassName={iconClassName} className={className} showLabel={showLabel} />
      </Await>
    </Suspense>
  )
}

function CartBannerSkeleton() {
  return (
    <Skeleton className="h-[34.8px] w-[36px] rounded-lg lg:h-[40px] lg:w-[78.96px]">
      {/* cart skeleton */}
      <div className="flex flex-row items-center gap-1">
        <Skeleton className="h-4 w-4 rounded-sm bg-grey-300" />
        <Skeleton className="h-3 w-16 rounded bg-grey-300" />
      </div>
    </Skeleton>
  )
}

function CartBanner({
  showLabel,
  iconClassName,
  className,
}: {
  showLabel: boolean
  iconClassName?: string
  className?: string
}) {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null
  const cart = useOptimisticCart(originalCart)
  const linesCount = cart?.totalQuantity ?? null

  return (
    <CartBadge
      className={className}
      iconClassName={iconClassName}
      showLabel={showLabel}
      count={linesCount}
    />
  )
}

function CartBadge({
  count,
  showLabel,
  className,
  iconClassName,
}: {
  count: number | null
  showLabel: boolean
  className?: string
  iconClassName?: string
}) {
  const { open, type, close } = useAside()
  const { publish, shop, cart, prevCart } = useAnalytics()
  const isCartAsideOpen = type === 'cart'
  const handleClick = () => {
    if (isCartAsideOpen) {
      close()
    } else {
      open('cart')
    }
    publish('cart_viewed', {
      cart,
      prevCart,
      shop,
      url: window.location.href || '',
    } as CartViewPayload)
  }
  return (
    <Button onClick={handleClick} variant="ghost" className="hover:bg-transparent relative p-0">
      <TouchArea />
      <div
        className={cn(
          'flex flex-row items-center gap-1 rounded-[7px] bg-green-800 px-4 py-[0.84375rem]',
          className,
        )}
      >
        {showLabel && <span className="font-inter text-sm text-pearl-700">Cart</span>}
        <div className="relative">
          <CartIcon className={iconClassName} />
          <div
            className={cn(
              'absolute -right-3 -top-3 hidden h-4 w-4 rounded-full',
              count !== null && count > 0 && 'block bg-brand-pearl',
            )}
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] text-brand-green">
              {count === null || count === 0 ? <span>&nbsp;</span> : count > 9 ? '9+' : count}
            </span>
          </div>
        </div>
      </div>
    </Button>
  )
}
