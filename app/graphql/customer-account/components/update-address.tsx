import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher } from '@remix-run/react'
import { CustomerAddress } from '@shopify/hydrogen/customer-account-api-types'
import { Pencil } from 'lucide-react'
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
  error?: string
  intent: string
}

export function EditAddress({
  address,
  defaultAddressId,
}: {
  address: Pick<
    CustomerAddress,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'company'
    | 'phoneNumber'
    | 'address1'
    | 'address2'
    | 'city'
    | 'zip'
    | 'territoryCode'
    | 'zoneCode'
    | 'formatted'
  >
  defaultAddressId: string
}) {
  const [showDialog, setShowDialog] = useState(false)
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'
  const form = useForm<AddressSchemaType>({
    resolver: zodResolver(addressSchema),
    mode: 'onSubmit',
  })
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        toast.success('Address updated successfully')
        setShowDialog(false)
      } else {
        toast.error(fetcher.data?.error)
      }
    }
  }, [fetcher.data])
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant={'link'} className="p-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <fetcher.Form
            method="PUT"
            action="/account/profile"
            onSubmit={form.handleSubmit((data) =>
              fetcher.submit(
                {
                  ...data,
                  intent: 'update-address',
                  defaultAddressId: defaultAddressId,
                  addressId: address.id,
                },
                { action: '/account/profile', method: 'PUT' },
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
                    defaultValue={address.firstName ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="firstName">First Name</CustomLabel>
                        <CustomInput
                          id="firstName"
                          placeholder="John"
                          autoComplete="given-name"
                          aria-label="First Name"
                          defaultValue={address?.firstName ?? ''}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    defaultValue={address?.lastName ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="lastName">Last Name</CustomLabel>
                        <CustomInput
                          id="lastName"
                          placeholder="Doe"
                          autoComplete="family-name"
                          aria-label="Last Name"
                          defaultValue={address?.lastName ?? ''}
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
                    defaultValue={address?.company ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="company">Company (Optional)</CustomLabel>
                        <CustomInput
                          id="company"
                          placeholder="Company Name"
                          autoComplete="organization"
                          defaultValue={address?.company ?? ''}
                          aria-label="Company"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    defaultValue={address?.phoneNumber ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="phoneNumber">Phone Number</CustomLabel>
                        <PhoneInput
                          {...field}
                          name="phoneNumber"
                          placeholder="Enter your phone number"
                          defaultValue={address?.phoneNumber ?? ''}
                          autoComplete="tel"
                          className="flex items-center"
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
                    defaultValue={address?.address1 ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="address1">Address Line 1</CustomLabel>
                        <CustomInput
                          id="address1"
                          placeholder="123 Street Name"
                          autoComplete="address-line1"
                          defaultValue={address?.address1 ?? ''}
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
                    defaultValue={address?.address2 ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="address2">Address Line 2 (Optional)</CustomLabel>
                        <CustomInput
                          id="address2"
                          placeholder="Apartment, Suite, etc."
                          defaultValue={address?.address2 ?? ''}
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
                    defaultValue={address?.city ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="city">City</CustomLabel>
                        <CustomInput
                          id="city"
                          placeholder="City"
                          defaultValue={address?.city ?? ''}
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
                    defaultValue={address?.zip ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="zip">ZIP / Postal Code</CustomLabel>
                        <CustomInput
                          id="zip"
                          placeholder="ZIP / Postal Code"
                          autoComplete="postal-code"
                          defaultValue={address?.zip ?? ''}
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
                    defaultValue={address?.territoryCode ?? ''}
                    render={({ field }) => (
                      <div className="flex flex-1 flex-col gap-1">
                        <CustomLabel htmlFor="territoryCode">Country</CustomLabel>
                        <CustomInput
                          id="territoryCode"
                          placeholder="Country"
                          defaultValue={address?.territoryCode ?? ''}
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    )}
                  />

                  {/* Province */}

                  <FormField
                    control={form.control}
                    name="zoneCode"
                    defaultValue={address?.zoneCode ?? ''}
                    render={({ field }) => {
                      return (
                        <div className="flex flex-1 flex-col gap-1">
                          <CustomLabel htmlFor="zoneCode">Province</CustomLabel>
                          <CustomInput
                            id="zoneCode"
                            placeholder="Province"
                            defaultValue={address?.zoneCode ?? ''}
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      )
                    }}
                  />
                </div>
              </div>
              <ButtonWithLoading isLoading={isSubmitting}>Update Address</ButtonWithLoading>
            </div>
          </fetcher.Form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
