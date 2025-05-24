import { Image } from '@shopify/hydrogen'
import { useAside } from '~/components/layout/Aside'
import { Button } from '~/components/ui/button/button'

// this can also be setup to load from the shopify store itself not just through here bt instead throgh shopify cms
export default function CartEmpty() {
  const { close } = useAside()

  return (
    <div className="flex h-full items-center justify-center border-t border-grey-300">
      <div className="flex flex-col gap-4">
        <Image
          alt={'cart is empty image'}
          aspectRatio="1/1"
          src={`/cart/empty-cart.svg`}
          sizes="(min-width: 45em) 50vw, 100vw"
          className="mx-auto max-w-[194px]"
        />
        <p className="font-helvetica text-xs font-regular text-grey-700">
          Your cart is empty, add items to get stared
        </p>
        <Button variant="brand" className="rounded-[8px] py-6 text-sm" onClick={close}>
          Get Started
        </Button>
      </div>
    </div>
  )
}
