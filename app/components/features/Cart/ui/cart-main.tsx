import { useOptimisticCart } from '@shopify/hydrogen'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import CartEmpty from './cart-empty'
import { CartHeader } from './cart-header'
import { CartItems } from './cart-items'

export type CartMainProps = {
  cart: CartApiQueryFragment | null
}

export function CartMain({ cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart)

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0)

  return (
    <div className="h-full">
      {/* header */}
      <CartHeader cart={cart} />
      {/* cart empty */}
      {!linesCount && <CartEmpty />}
      {/* cart items  */}
      {linesCount && <CartItems lines={cart.lines.nodes} cart={cart} />}
    </div>
  )
}
