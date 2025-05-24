import { Link, useFetchers } from '@remix-run/react'
import { Money, OptimisticCart } from '@shopify/hydrogen'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import { useAside } from '~/components/layout/Aside'
import SecondaryButton from '~/components/ui/button/secondary-button'
import { CartLineItem, CartLineType } from './cart-line-item'
import { Loader2 } from 'lucide-react'
export function CartItems({
  lines,
  cart,
}: {
  lines: CartLineType[]
  cart: OptimisticCart<CartApiQueryFragment | null>
}) {
  const fetchers = useFetchers()
  const isLoading = fetchers.some((fetcher) => fetcher.state !== 'idle')
  return (
    <div className="flex h-full flex-col justify-between border-t border-grey-300">
      {/* items */}
      <CartLineItems lines={lines} />
      {/* summary (total, continue to payment, continue shopping) */}
      <SummaryItems cart={cart} isLoading={isLoading} />
    </div>
  )
}

function CartLineItems({ lines }: { lines: CartLineType[] }) {
  return (
    <ul className="hide-scrollbars flex flex-col gap-4 overflow-y-auto p-4 px-6 pt-8">
      {lines.map((line) => (
        <CartLineItem key={line.id} line={line} />
      ))}
    </ul>
  )
}

function SummaryItems({
  cart,
  isLoading,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>
  isLoading: boolean
}) {
  const { close } = useAside()
  return (
    <div className="flex flex-col gap-5 border-t border-grey-300 p-4 px-6 pb-20">
      <div className="flex flex-row items-center justify-between">
        <dt>Total:</dt>
        <div className="flex w-[40px] items-center justify-center">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            <dd>
              {cart.cost?.subtotalAmount?.amount ? <Money data={cart.cost?.subtotalAmount} /> : '-'}
            </dd>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Link
          onClick={close}
          to={cart?.checkoutUrl ?? '/checkout'}
          className="hover:bg-green-800', 'inline-flex [&_svg]:shrink-0' items-center justify-center gap-2 whitespace-nowrap rounded-md bg-brand-green px-8 py-3 text-center font-helvetica text-sm font-medium leading-[18px] text-brand-pearl transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4"
        >
          Continue To Payment
        </Link>
        <SecondaryButton
          onClick={close}
          className="h-auto bg-green-100 py-4 text-brand-green shadow-none hover:bg-green-200"
        >
          Continue Shopping
        </SecondaryButton>
      </div>
    </div>
  )
}
