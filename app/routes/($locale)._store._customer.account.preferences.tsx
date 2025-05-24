import { useFetcher, useLoaderData } from '@remix-run/react'
import { ActionFunctionArgs } from '@remix-run/server-runtime'
import { AppLoadContext, json } from '@shopify/remix-oxygen'
import { CustomerDetailsQuery } from 'customer-accountapi.generated'
import { useEffect } from 'react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { UserCountryPreference } from '~/graphql/customer-account/components/preferences/country-preference'
import { UserDateOfBirthPreference } from '~/graphql/customer-account/components/preferences/date-of-birth-preference'
import { UserDietaryPreference } from '~/graphql/customer-account/components/preferences/dietary-preference'
import { UserLanguagePreference } from '~/graphql/customer-account/components/preferences/language-preference'
import {
  EMAIL_MARKETING_SUBSCRIBE_MUTATION,
  EMAIL_MARKETING_UNSUBSCRIBE_MUTATION,
} from '~/graphql/customer-account/CustomerMarketingSubscribeMutations'
import {
  QUERY_COUNTRY_OF_ORIGIN,
  QUERY_DATE_OF_BIRTH,
  QUERY_DIETARY_PREFERENCE,
  QUERY_LANGUAGE_PREFERENCE,
} from '~/graphql/customer-account/CustomerMetafieldQuery'
import { useRootLoaderData } from '~/root'

type ActionResponse = {
  success: boolean
  error?: string
  marketingState?: string
}

export async function loader({ context }: { context: AppLoadContext }) {
  //  extract all default values
  const [
    { data: languageQuery },
    { data: countryQuery },
    { data: dietaryQuery },
    { data: dateOfBirthQuery },
  ] = await Promise.all([
    context.customerAccount.query(QUERY_LANGUAGE_PREFERENCE),
    context.customerAccount.query(QUERY_COUNTRY_OF_ORIGIN),
    context.customerAccount.query(QUERY_DIETARY_PREFERENCE),
    context.customerAccount.query(QUERY_DATE_OF_BIRTH),
  ])

  // Extract the values with fallbacks
  // @ts-ignore
  const language: string = languageQuery.customer.metafield?.jsonValue[0] ?? ''
  // @ts-ignore
  const country: string = countryQuery.customer.metafield?.jsonValue[0] ?? ''
  // @ts-ignore
  const dietary: string[] = dietaryQuery.customer.metafield?.jsonValue || []
  // @ts-ignore
  const dateOfBirth: string = dateOfBirthQuery.customer.metafield?.value ?? ''

  return json(
    {
      language,
      country,
      dietary,
      dateOfBirth,
    },
    {
      status: 200,
    },
  )
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { customerAccount } = context
  const formData = await request.formData()
  const intent = formData.get('intent')

  try {
    switch (intent) {
      case 'SUBSCRIBED': {
        const { data, errors } = await customerAccount.mutate(EMAIL_MARKETING_SUBSCRIBE_MUTATION)

        if (errors?.length) {
          throw new Error(errors[0].message)
        }

        if (data?.customerEmailMarketingSubscribe?.userErrors?.length) {
          throw new Error(data.customerEmailMarketingSubscribe.userErrors[0].message)
        }

        return {
          success: true,
          marketingState: data?.customerEmailMarketingSubscribe?.emailAddress?.marketingState,
        }
      }
      case 'NOT_SUBSCRIBED': {
        const { data, errors } = await customerAccount.mutate(EMAIL_MARKETING_UNSUBSCRIBE_MUTATION)

        if (errors?.length) {
          throw new Error(errors[0].message)
        }

        if (data?.customerEmailMarketingUnsubscribe?.userErrors?.length) {
          throw new Error(data.customerEmailMarketingUnsubscribe.userErrors[0].message)
        }

        return {
          success: true,
          marketingState: data?.customerEmailMarketingUnsubscribe?.emailAddress?.marketingState,
        }
      }
      default:
        return { success: false, error: 'Invalid intent' }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export default function AccountPreferences() {
  const data = useRootLoaderData()
  const customer = data?.customer?.data?.customer

  return (
    <div className="flex min-h-[300px] flex-col gap-6 rounded-2xl bg-white p-4 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full flex-1 flex-col gap-8 rounded-2xl border border-grey-300 p-5 xl:mx-0">
        <MarketingPreferences customer={customer} />
        <UserPreferences customer={customer} />
      </div>
    </div>
  )
}

function MarketingPreferences({
  customer,
}: {
  customer: CustomerDetailsQuery['customer'] | undefined
}) {
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state !== 'idle'
  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(
        `Successfully ${fetcher.data.marketingState === 'SUBSCRIBED' ? 'subscribed' : 'unsubscribed'}`,
      )
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data?.error)
    }
  }, [fetcher.data])
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-row items-center justify-between border-b border-grey-300 py-2">
        <h2 className="font-helvetica text-base font-medium text-black">Email Preferences</h2>
      </div>
      <div className="flex flex-row items-center justify-between rounded-xl border border-grey-300 bg-grey-100 p-4">
        <p className="font-helvetica text-base font-regular text-grey-900">
          Receive mail notifications
        </p>
        <fetcher.Form
          method="POST"
          action="/account/preferences"
          className="flex items-center justify-center"
        >
          <input
            type="hidden"
            name="intent"
            value={
              customer?.emailAddress?.marketingState === 'SUBSCRIBED'
                ? 'NOT_SUBSCRIBED'
                : 'SUBSCRIBED'
            }
          />
          <Switch
            defaultChecked={customer?.emailAddress?.marketingState === 'SUBSCRIBED'}
            onCheckedChange={() => {
              fetcher.submit(
                {
                  intent:
                    customer?.emailAddress?.marketingState === 'SUBSCRIBED'
                      ? 'NOT_SUBSCRIBED'
                      : 'SUBSCRIBED',
                  emailAddress: customer?.emailAddress?.emailAddress || '',
                },

                {
                  action: '/account/preferences',
                  method: 'POST',
                },
              )
            }}
            disabled={isSubmitting}
            className="data-[state=checked]:bg-brand-green"
          />
        </fetcher.Form>
      </div>
    </div>
  )
}

function UserPreferences({ customer }: { customer: CustomerDetailsQuery['customer'] | undefined }) {
  const { language, country, dietary, dateOfBirth } = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-row items-center justify-between border-b border-grey-300 py-2">
        <h2 className="font-helvetica text-base font-medium text-black">Account Preferences</h2>
      </div>
      <UserLanguagePreference defaultLanguage={language} />
      <UserCountryPreference defaultCountry={country} />
      <UserDietaryPreference defaultDietary={dietary} />
      <UserDateOfBirthPreference defaultDateOfBirth={dateOfBirth} />
    </div>
  )
}
