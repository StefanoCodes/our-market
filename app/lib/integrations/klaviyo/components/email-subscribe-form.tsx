import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CustomInput from '~/components/features/Onboarding/input'
import CustomLabel from '~/components/features/Onboarding/label'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { PhoneInput } from '~/components/ui/phone-input'
import { KlaviyoFormData, klaviyoFormSchema } from '../klaviyo-validations'
import { CustomerDetailsQuery } from 'customer-accountapi.generated'
type ActionResponse = {
  success: boolean
  error?: string
}

export const EmailSubscribeForm = ({
  setShow,
  customer,
}: {
  setShow: (show: boolean) => void
  customer: CustomerDetailsQuery['customer'] | null
}) => {
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'
  const fullName = customer?.firstName + ' ' + customer?.lastName
  const klaviyoForm = useForm<KlaviyoFormData>({
    resolver: zodResolver(klaviyoFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      fullName: fullName.includes('undefined') ? '' : fullName,
      email: customer?.emailAddress?.emailAddress ?? '',
    },
  })

  useEffect(() => {

    if (fetcher.data?.error) {
      toast.error(`A profile already exists`)
    }
    if (fetcher.data?.success) {
      toast.success('Check your email for confirmation')
      setShow(false)
    }
  }, [fetcher.data])

  return (
    <fetcher.Form
      method="post"
      action="/resource/klaviyo"
      onSubmit={klaviyoForm.handleSubmit((data) => {
        fetcher.submit(data, { action: '/resource/klaviyo', method: 'POST' })
      })}
    >
      <Form {...klaviyoForm}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {/* full name */}
            <div className="flex flex-col gap-4">
              <FormField
                control={klaviyoForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="fullName">Full Name</CustomLabel>
                    <CustomInput
                      id={'fullName'}
                      placeholder={'John Singh'}
                      autoComplete="given-name"
                      aria-label="Name"
                      defaultValue={fullName.includes('undefined') ? '' : fullName}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* email */}
            <div className="flex flex-col gap-4">
              <FormField
                control={klaviyoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="email">Email</CustomLabel>
                    <CustomInput
                      id={'email'}
                      placeholder={'mail@gmail.com'}
                      autoComplete="email"
                      aria-label="Email"
                      defaultValue={customer?.emailAddress?.emailAddress ?? ''}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* phone number */}
            {/* <div className="flex flex-col gap-4">
              <FormField
                control={klaviyoForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="phoneNumber">Phone Number</CustomLabel>
                    <PhoneInput
                      {...field}
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      autoComplete="phone"
                      className="flex items-center"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>
          {/* submit button */}
          <div className="mt-auto flex flex-col gap-6">
            <ButtonWithLoading isLoading={isSubmitting}>
              {!isSubmitting ? `Subscribe` : `Subscribing...`}
            </ButtonWithLoading>
          </div>
        </div>
      </Form>
    </fetcher.Form>
  )
}
