import { useFetcher } from '@remix-run/react'
import { CustomerDetailsQuery } from 'customer-accountapi.generated'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils/utils'
type ActionResponse = {
  success: boolean
  error?: string
}

export function UpdateDefaultAddress({
  customer,
  addressId,
}: {
  customer: CustomerDetailsQuery['customer']
  addressId: string
}) {
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        toast.success('Default address updated successfully')
      } else {
        toast.error(fetcher.data?.error)
      }
    }
  }, [fetcher.data])
  return (
    <fetcher.Form
      method="PUT"
      action="/account/profile"
      className="flex items-center justify-center"
    >
      <Checkbox
        checked={customer.defaultAddress?.id === addressId}
        className={cn(
          'data-[state=checked]:bg-brand-green',
          isSubmitting && 'animate-pulse opacity-50',
        )}
        onCheckedChange={() => {
          fetcher.submit(
            {
              intent: 'update-default-address',
              addressId: addressId,
            },
            {
              action: '/account/profile',
              method: 'PUT',
            },
          )
        }}
        disabled={customer.defaultAddress?.id === addressId || isSubmitting}
      />
    </fetcher.Form>
  )
}
