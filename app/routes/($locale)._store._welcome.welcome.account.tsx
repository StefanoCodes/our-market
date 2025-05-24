import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { AppLoadContext, json } from '@shopify/remix-oxygen'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CustomInput from '~/components/features/Onboarding/input'
import CustomLabel from '~/components/features/Onboarding/label'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { PhoneInput } from '~/components/ui/phone-input'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { UPDATE_CUSTOMER_METAFIELD } from '~/graphql/customer-account/CustomerMetafieldMutations'
import {
  QUERY_PHONE_NUMBER,
  QUERY_STARTED_WELCOME_FLOW,
} from '~/graphql/customer-account/CustomerMetafieldQuery'
import { welcomeFlowAccountSchema } from '~/lib/utils/welcome'
// auth check
export async function loader({ context }: { context: AppLoadContext }) {
  await context.customerAccount.handleAuthStatus()
  const customerDetails = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)
  const customerStartedWelcomeFlow = await context.customerAccount.query(QUERY_STARTED_WELCOME_FLOW)
  const customerPhoneNumber = await context.customerAccount.query(QUERY_PHONE_NUMBER)
  const hasNotStartedWelcomeFlow =
    customerStartedWelcomeFlow.data.customer.metafield?.value === undefined ||
    customerStartedWelcomeFlow.data.customer.metafield.value === 'false'
  if (hasNotStartedWelcomeFlow) {
    // mutate to true
    await context.customerAccount.mutate(UPDATE_CUSTOMER_METAFIELD, {
      variables: {
        metafields: {
          key: 'started_welcome_flow',
          namespace: 'custom',
          value: 'true',
          ownerId: customerDetails.data.customer.id,
        },
      },
    })
  }
  // @ts-ignore
  const phoneNumberDefaultValue = customerPhoneNumber.data.customer.metafield?.value

  return json(
    {
      firstName: customerDetails.data.customer.firstName,
      lastName: customerDetails.data.customer.lastName,
      phoneNumber: phoneNumberDefaultValue,
    },
    {
      status: 200,
    },
  )
}

type ActionResponse = {
  success: boolean
  message: string
}

export default function WelcomeAccountPreference() {
  const data = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionResponse>()
  const navigate = useNavigate()
  const defaultFirstName = data.firstName ?? ''
  const defaultLastName = data.lastName ?? ''
  const defaultPhoneNumber = data.phoneNumber ?? ''

  const form = useForm<welcomeFlowAccountSchema>({
    resolver: zodResolver(welcomeFlowAccountSchema),
    mode: 'onSubmit',
  })

  const isLoading = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        toast.success('Customer profile updated successfully')
        navigate('/welcome/language')
      } else {
        toast.error(fetcher.data?.message)
      }
    }
  }, [fetcher.data])

  return (
    <Form {...form}>
      <fetcher.Form
        method="POST"
        action="/resource/preferences"
        className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-12"
        onSubmit={form.handleSubmit((data) => {
          if (
            data.firstName === defaultFirstName &&
            data.lastName === defaultLastName &&
            data.phoneNumber === defaultPhoneNumber
          ) {
            return navigate('/welcome/language')
          }
          fetcher.submit(
            { ...data, intent: 'account' },
            { action: '/resource/preferences', method: 'POST' },
          )
        })}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            {/* first name */}
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="firstName"
                defaultValue={defaultFirstName}
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="firstName">First Name</CustomLabel>
                    <CustomInput
                      id={'firstName'}
                      placeholder={'First Name'}
                      autoComplete="given-name"
                      aria-label="Name"
                      defaultValue={defaultFirstName}
                      className="max-w-[150px] bg-grey-100 md:max-w-[200px]"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* last name */}
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="lastName"
                defaultValue={defaultLastName}
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="lastName">Last Name</CustomLabel>
                    <CustomInput
                      defaultValue={defaultLastName}
                      placeholder={'Last Name'}
                      id={'lastName'}
                      className="max-w-[150px] bg-grey-100 md:max-w-[200px]"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* phone */}
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              defaultValue={defaultPhoneNumber}
              render={({ field }) => (
                <FormItem>
                  <CustomLabel htmlFor="phone">Phone Number</CustomLabel>
                  <PhoneInput
                    {...field}
                    name="phone"
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
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          {/* @todo the name of this link can be different indicating going back to the home page store page */}
          <Link
            to={'/'}
            className="bg-transparent flex h-12 w-fit items-center justify-center rounded-lg border border-green-300 px-24 font-helvetica text-sm text-black duration-300 hover:bg-black hover:text-white"
          >
            Back
          </Link>
          <ButtonWithLoading isLoading={isLoading} className="w-fit px-24">
            Next
          </ButtonWithLoading>
        </div>
      </fetcher.Form>
    </Form>
  )
}
