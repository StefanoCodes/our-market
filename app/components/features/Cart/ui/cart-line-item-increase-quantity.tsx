import { CartForm, OptimisticInput, useOptimisticData } from '@shopify/hydrogen'
import { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types'

import PlusIcon from '~/components/ui/icons/plus-icon'
import { CartLineType } from './cart-line-item'

export function CartLineItemIncreaseQuantity({ line }: { line: CartLineType }) {
  if (!line || typeof line?.quantity === 'undefined') return null
  const { id: lineId, quantity, isOptimistic } = line
  const nextQuantity = Number((quantity + 1).toFixed(0))

  const optimisticId = `increase-${lineId}`
  const optimisticData = useOptimisticData(optimisticId)

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines: [{ id: lineId, quantity: nextQuantity }] }}
    >
      <input type="hidden" name="lineId" value={lineId} />
      <button
        aria-label="Increase quantity"
        name="increase-quantity"
        value={nextQuantity}
        disabled={!!isOptimistic}
        className="disabled:opacity-50"
        type="submit"
      >
        <PlusIcon className="text-brand mt-2 h-5 w-5" />
      </button>
      <OptimisticInput id={optimisticId} data={{ quantity: nextQuantity }} />
    </CartForm>
  )
}
