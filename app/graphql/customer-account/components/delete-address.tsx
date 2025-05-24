import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@remix-run/react'
import { Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Form as ShadcnForm } from '~/components/ui/form'
import { deleteAddressSchema, DeleteAddressSchemaType } from '~/lib/validations/customer'
import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils/utils'
type ActionResponse = {
  success: boolean
  error: string
}
export function DeleteAddress({ addressId }: { addressId: string }) {
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'

  const form = useForm<DeleteAddressSchemaType>({
    resolver: zodResolver(deleteAddressSchema),
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        toast.success('Address deleted successfully')
      } else {
        toast.error(fetcher.data?.error)
      }
    }
  }, [fetcher.data])
  return (
    <fetcher.Form method="DELETE" action="/account/profile">
      <input type="hidden" name="intent" value="delete-address" />
      <input type="hidden" name="addressId" value={addressId} />
      <ShadcnForm {...form}>
        <Button
          variant={'link'}
          className={cn('p-0', isSubmitting && 'animate-pulse opacity-50')}
          type="submit"
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4 py-0 text-brand-green" />
        </Button>
      </ShadcnForm>
    </fetcher.Form>
  )
}
