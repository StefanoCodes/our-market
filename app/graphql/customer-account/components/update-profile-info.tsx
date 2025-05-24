import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher } from '@remix-run/react'
import { CustomerDetailsQuery } from 'customer-accountapi.generated'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CustomInput from '~/components/features/Onboarding/input'
import CustomLabel from '~/components/features/Onboarding/label'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { FormField, FormItem, FormMessage, Form as ShadcnForm } from '~/components/ui/form'
import { customerUpdateSchema, CustomerUpdateSchemaType } from '~/lib/validations/customer'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Button } from '~/components/ui/button'
import { DialogTitle } from '~/components/ui/dialog'
import { UseAccountProfileLoaderData } from '~/routes/($locale)._store._customer.account.profile'
import { PhoneInput } from '~/components/ui/phone-input'
type ActionResponse = {
  success: boolean
  error: string
}

export function UpdateProfileInfo({ customer }: { customer: CustomerDetailsQuery['customer'] }) {
  const data = UseAccountProfileLoaderData()
  const fetcher = useFetcher<ActionResponse>({
    key: 'update-account-info',
  })
  const isSubmitting = fetcher.state === 'submitting'
  const [showDialog, setShowDialog] = useState(false)
  const defaultPhoneNumber = data?.phoneNumber
  const customerForm = useForm<CustomerUpdateSchemaType>({
    resolver: zodResolver(customerUpdateSchema),
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        toast.success('Customer profile updated successfully')
        setShowDialog(false)
      } else {
        toast.error(fetcher.data?.error)
      }
    }
  }, [fetcher.data])

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          className="font-helvetica text-xs font-medium text-brand-green underline"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="update-profile"
        aria-description="Update Profile"
        aria-labelledby="dialog-title"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Update Profile</DialogTitle>
        </VisuallyHidden.Root>

        <ShadcnForm {...customerForm}>
          <fetcher.Form
            method="POST"
            action="/account/profile"
            onSubmit={customerForm.handleSubmit((data) => {
              if (
                data.firstName === customer?.firstName &&
                data.lastName === customer?.lastName &&
                data.phoneNumber === defaultPhoneNumber
              ) {
                return setShowDialog(false)
              }
              fetcher.submit(
                { ...data, intent: 'customer-update' },
                { action: '/account/profile', method: 'POST' },
              )
            })}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* full name */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={customerForm.control}
                    name="firstName"
                    defaultValue={customer?.firstName ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="firstName">First Name</CustomLabel>
                        <CustomInput
                          id={'firstName'}
                          placeholder={'First Name'}
                          autoComplete="given-name"
                          aria-label="Name"
                          defaultValue={customer?.firstName ?? ''}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* phone */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={customerForm.control}
                    name="lastName"
                    defaultValue={customer?.lastName ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="lastName">Last Name</CustomLabel>
                        <CustomInput
                          defaultValue={customer?.lastName ?? ''}
                          placeholder={'Last Name'}
                          id={'lastName'}
                          {...field}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={customerForm.control}
                    name="phoneNumber"
                    defaultValue={defaultPhoneNumber}
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="phone">Phone Number</CustomLabel>
                        <PhoneInput
                          {...field}
                          name="phoneNumber"
                          placeholder="Enter your phone number"
                          autoComplete="phone"
                          className="flex items-center"
                          defaultValue={defaultPhoneNumber}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <input type="hidden" name="intent" value="customer-profile-update" />
              <div className="mt-auto flex flex-col gap-6">
                <ButtonWithLoading isLoading={isSubmitting}>
                  {!isSubmitting ? `Update` : `Updating...`}
                </ButtonWithLoading>
              </div>
            </div>
          </fetcher.Form>
        </ShadcnForm>
      </DialogContent>
    </Dialog>
  )
}
