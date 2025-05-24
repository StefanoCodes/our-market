import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher } from '@remix-run/react'
import { CustomerDetailsQuery } from 'customer-accountapi.generated'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CustomInput from '~/components/features/Onboarding/input'
import CustomLabel from '~/components/features/Onboarding/label'
import { Button } from '~/components/ui/button'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { PhoneInput } from '~/components/ui/phone-input'
import { addressSchema, AddressSchemaType } from '~/lib/validations/customer'
type ActionResponse = {
  success: boolean
  intent: string
  error?: string
}

export function CreateNewAddress({
  customer,
  phoneNumber,
}: {
  customer: CustomerDetailsQuery['customer']
  phoneNumber: string
}) {
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'
  const [showCreateAddressDialog, setShowCreateAddressDialog] = useState(false)
  const form = useForm<AddressSchemaType>({
    resolver: zodResolver(addressSchema),
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        toast.success(`Address created successfully`)
        setShowCreateAddressDialog(false)
        // clear form
        form.reset()
      } else {
        toast.error(fetcher.data?.error)
      }
    }
  }, [fetcher.data])
  return (
    <Dialog open={showCreateAddressDialog} onOpenChange={setShowCreateAddressDialog}>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          className="font-helvetica text-xs font-medium text-brand-green underline"
        >
          Add new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <fetcher.Form
            method="POST"
            action="/account/profile"
            onSubmit={form.handleSubmit((data) =>
              fetcher.submit(
                { ...data, intent: 'address-create' },
                { action: '/account/profile', method: 'POST' },
              ),
            )}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    defaultValue={customer.firstName ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="firstName">First Name</CustomLabel>
                        <CustomInput
                          id="firstName"
                          placeholder="John"
                          autoComplete="given-name"
                          aria-label="First Name"
                          defaultValue={customer.firstName ?? ''}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    defaultValue={customer?.lastName ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="lastName">Last Name</CustomLabel>
                        <CustomInput
                          id="lastName"
                          placeholder="Doe"
                          autoComplete="family-name"
                          aria-label="Last Name"
                          defaultValue={customer?.lastName ?? ''}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Company (Optional)  + phone number*/}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    defaultValue=""
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="company">Company (Optional)</CustomLabel>
                        <CustomInput
                          id="company"
                          placeholder="Company Name"
                          autoComplete="organization"
                          aria-label="Company"
                          defaultValue={''}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    defaultValue={phoneNumber}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="phoneNumber">Phone Number</CustomLabel>
                        <PhoneInput
                          {...field}
                          name="phoneNumber"
                          placeholder="Enter your phone number"
                          autoComplete="tel"
                          className="flex items-center"
                          defaultValue={phoneNumber}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Address Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="address1">Address Line 1</CustomLabel>
                        <CustomInput
                          id="address1"
                          placeholder="123 Street Name"
                          autoComplete="address-line1"
                          aria-label="Address Line 1"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="address2">Address Line 2 (Optional)</CustomLabel>
                        <CustomInput
                          id="address2"
                          placeholder="Apartment, Suite, etc."
                          autoComplete="address-line2"
                          aria-label="Address Line 2"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* City and ZIP */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="city">City</CustomLabel>
                        <CustomInput
                          id="city"
                          placeholder="City"
                          autoComplete="address-level2"
                          aria-label="City"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="zip">ZIP / Postal Code</CustomLabel>
                        <CustomInput
                          id="zip"
                          placeholder="ZIP / Postal Code"
                          autoComplete="postal-code"
                          aria-label="ZIP Code"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="territoryCode"
                    render={({ field }) => (
                      <div className="flex flex-1 flex-col gap-1">
                        <CustomLabel htmlFor="territoryCode">Country</CustomLabel>
                        <CustomInput id="territoryCode" placeholder="Country" {...field} />
                      </div>
                    )}
                  />

                  {/* Province */}

                  <FormField
                    control={form.control}
                    name="zoneCode"
                    render={({ field }) => {
                      return (
                        <div className="flex flex-1 flex-col gap-1">
                          <CustomLabel htmlFor="zoneCode">Province</CustomLabel>
                          <CustomInput id="zoneCode" placeholder="Province" {...field} />
                          <FormMessage />
                        </div>
                      )
                    }}
                  />
                </div>
              </div>

              <ButtonWithLoading isLoading={isSubmitting}>Add New Address</ButtonWithLoading>
            </div>
          </fetcher.Form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
