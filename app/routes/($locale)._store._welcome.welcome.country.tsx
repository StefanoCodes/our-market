import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { ActionFunctionArgs, AppLoadContext } from '@remix-run/server-runtime'
import { json } from '@shopify/remix-oxygen'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CountryDropdown } from '~/components/features/Welcome/country-of-origin'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import CountrySelect from '~/components/ui/country-select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { UPDATE_CUSTOMER_METAFIELD } from '~/graphql/customer-account/CustomerMetafieldMutations'
import { QUERY_COUNTRY_OF_ORIGIN } from '~/graphql/customer-account/CustomerMetafieldQuery'
import { getFullCountryName } from '~/lib/utils/country-utils'
import { welcomeFlowCountrySchema, welcomeFlowCountrySchemaType } from '~/lib/utils/welcome'

// auth check
export async function loader({ context }: { context: AppLoadContext }) {
  await context.customerAccount.handleAuthStatus()
  const customerCountryOfOrigin = await context.customerAccount.query(QUERY_COUNTRY_OF_ORIGIN)
  // @ts-ignore
  const countryOfOrigin = customerCountryOfOrigin.data.customer.metafield?.jsonValue[0]

  return json(
    {
      country: countryOfOrigin,
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

export default function WelcomeCountryOfOrigin() {
  const data = useLoaderData<typeof loader>()
  const defaultCountry = data.country ?? ''

  const navigate = useNavigate()
  const fetcher = useFetcher<ActionResponse>()
  const form = useForm<welcomeFlowCountrySchemaType>({
    resolver: zodResolver(welcomeFlowCountrySchema),
    mode: 'onSubmit',
    defaultValues: {
      country: defaultCountry,
    },
  })
  const isLoading = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message)
        navigate('/welcome/date')
      } else {
        toast.error(fetcher.data.message)
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
          if (data.country === defaultCountry) {
            return navigate('/welcome/date')
          }
          fetcher.submit(
            { ...data, intent: 'country' },
            { action: '/resource/preferences', method: 'POST' },
          )
        })}
      >
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Of Origin</FormLabel>
              <FormControl>
                <CountrySelect
                  className='flex justify-between min-w-[150px] md:min-w-[200px]'
                  placeholder={!defaultCountry ? 'Select a country' : defaultCountry}
                  whitelist={[
                    "DZ",
                    "AO",
                    "BB",
                    "BJ",
                    "BW",
                    "BR",
                    "BF",
                    "BI",
                    "CV",
                    "CM",
                    "CA",
                    "CF",
                    "TD",
                    "KM",
                    "CU",
                    "CD",
                    "DO",
                    "CG",
                    "CI",
                    "DJ",
                    "EG",
                    "GQ",
                    "ER",
                    "ET",
                    "GA",
                    "GM",
                    "GH",
                    "GN",
                    "GW",
                    "HT",
                    "IN",
                    "JM",
                    "KE",
                    "LS",
                    "LR",
                    "LY",
                    "MG",
                    "MW",
                    "ML",
                    "MR",
                    "MU",
                    "MA",
                    "MZ",
                    "NA",
                    "NE",
                    "NG",
                    "RW",
                    "ST",
                    "SN",
                    "SC",
                    "SL",
                    "SO",
                    "ZA",
                    "SS",
                    "SD",
                    "SZ",
                    "TZ",
                    "TG",
                    "TT",
                    "TN",
                    "TR",
                    "UG",
                    "AE",
                    "US",
                    "ZM",
                    "ZW"
                  ]}
                  onChange={(data) => {
                    const countryName = getFullCountryName(data)
                    field.onChange(countryName)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          {/* @todo the name of this link can be different indicating going back to the home page store page */}
          <Link
            to={'/welcome/language'}
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
