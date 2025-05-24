import { OptimisticCart } from '@shopify/hydrogen'
import { X } from 'lucide-react'
import { CartApiQueryFragment } from 'storefrontapi.generated'
import { useAside } from '../../../layout/Aside'
import ClearCartBtn from './clear-cart'

export function CartHeader({ cart }: { cart: OptimisticCart<CartApiQueryFragment | null> }) {
  const { close } = useAside()
  return (
    <div className="flex flex-row items-center justify-between p-4">
      <h2 className="font-helvetica text-md text-black">Cart Details</h2>
      <div className="flex flex-row items-center gap-3">
        <ClearCartBtn cart={cart} />
        <X size={24} className="cursor-pointer" onClick={close} />
      </div>
    </div>
  )
}
