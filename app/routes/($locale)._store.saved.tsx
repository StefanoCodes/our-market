import { Image } from '@shopify/hydrogen'
import { Button } from '~/components/ui/button/button'

export default function SavedProductsPage() {
  return (
    <div className="mx-auto flex h-[55.75rem] max-w-container flex-col gap-6 px-4 pt-9 lg:gap-8 xl:px-16">
      <div className="flex h-full flex-col">
        <h2 className="border-b border-grey-300 pb-6 font-helvetica text-md font-medium text-black">
          Saved Items
        </h2>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="p-[15px]">
                <Image src="/cart/shopping-cart.svg" className="h-[27px] w-[27px]" />
              </div>
              <p className="font-helvetica text-sm font-regular text-grey-700">
                Your saved Items will be listed here
              </p>
            </div>
            <Button variant="brand" className="h-12 px-4 py-6">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
