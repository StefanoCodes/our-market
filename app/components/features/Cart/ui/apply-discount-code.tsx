import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import CustomLabel from '../../Onboarding/label'
import CustomInput from '../../Onboarding/input'
import { Button } from '~/components/ui/button'
import { CartForm } from '@shopify/hydrogen'
import type { Cart } from '@shopify/hydrogen/storefront-api-types'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { FetcherWithComponents } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ApplyDiscountCode({
  discountCodes,
}: {
  discountCodes: Cart['discountCodes']
}) {
  const codes: string[] =
    discountCodes?.filter((discount) => discount.applicable)?.map(({ code }) => code) || []
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <span className="font-helvetica text-sm font-medium text-grey-600 underline">
          Apply Discount Code
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[29.375rem] xl:left-auto xl:right-40">
        <DialogTitle className="font-helvetica text-xl font-medium text-black">
          Apply Discount Code
        </DialogTitle>
        <DialogDescription className="max-w-sm font-helvetica text-md font-medium text-black">
          Enter code to check validity
        </DialogDescription>
        <CartForm
          route="/cart"
          inputs={{ discountCodes: codes }}
          action={CartForm.ACTIONS.DiscountCodesUpdate}
        >
          {(fetcher: FetcherWithComponents<any>) => {
            const isLoading = fetcher.state !== 'idle'
            useEffect(() => {

              if (fetcher.state === 'idle' && fetcher.data && !fetcher.data.error) {
                // show a toast message that the discount code has been applied
                toast.success('Discount code applied successfully')
                setIsDialogOpen(false)
              } else if (fetcher.state === 'idle' && fetcher.data && fetcher.data.error) {
                toast.error('Discount code is invalid')
              }
            }, [fetcher.state, fetcher.data])
            return (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <CustomLabel htmlFor="discount-code">Discount Code</CustomLabel>
                  <CustomInput
                    name="discountCode"
                    type="text"
                    id="discount-code"
                    placeholder="Discount code"
                  />
                </div>
                <ButtonWithLoading isLoading={isLoading}>Apply Discount Code</ButtonWithLoading>
              </div>
            )
          }}
        </CartForm>
      </DialogContent>
    </Dialog>
  )
}
