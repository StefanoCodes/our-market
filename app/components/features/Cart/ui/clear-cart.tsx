import { CartForm, OptimisticCart } from '@shopify/hydrogen'
import { CartApiQueryFragment } from 'storefrontapi.generated'
import { Button } from '~/components/ui/button'

export default function ClearCartBtn({
  cart,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{ lineIds: cart?.lines?.nodes?.map((line) => line.id) ?? [] }}
      action={CartForm.ACTIONS.LinesRemove}
    >
      <Button
        type="submit"
        className="cursor-pointer bg-green-100 font-helvetica text-xs font-medium capitalize text-brand-green shadow-none hover:bg-green-200"
      >
        Clear cart
      </Button>
    </CartForm>
  )
}
