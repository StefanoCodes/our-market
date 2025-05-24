import { CartForm, OptimisticInput } from '@shopify/hydrogen'
import { MinusIcon, Trash, Trash2 } from 'lucide-react'
import { CartLineType } from './cart-line-item'
import { Button } from '~/components/ui/button'

export function CartLineDescreaseQuantity({ line }: { line: CartLineType }) {
  if (!line || typeof line?.quantity === 'undefined') return null
  const { id: lineId, quantity, isOptimistic } = line
  const prevQuantity = Number((quantity - 1).toFixed(0))

  const optimisticId = `decrease-${lineId}`
  return (
    <>
      {quantity > 1 && (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesUpdate}
          inputs={{ lines: [{ id: lineId, quantity: prevQuantity }] }}
        >
          <input type="hidden" name="lineId" value={lineId} />
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="disabled:opacity-50"
          >
            <MinusIcon className="text-brand mt-2 h-5 w-5 cursor-pointer" />
          </button>

          <OptimisticInput id={optimisticId} data={{ quantity: prevQuantity }} />
        </CartForm>
      )}
      {quantity <= 1 && (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesRemove}
          inputs={{ lineIds: [lineId] }}
        >
          <input type="hidden" name="lineId" value={lineId} />
          <button type="submit">
            <Trash2 className="text-brand mt-2 h-4 w-4 cursor-pointer" />
          </button>
        </CartForm>
      )}
    </>
  )
}
