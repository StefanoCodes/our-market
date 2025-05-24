import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { AppLoadContext } from '@shopify/remix-oxygen'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { QUERY_DIETARY_PREFERENCE } from '~/graphql/customer-account/CustomerMetafieldQuery'
import { dietaryOptions } from '~/lib/integrations/klaviyo/constants'
import { welcomeFlowDietarySchema, welcomeFlowDietarySchemaType } from '~/lib/utils/welcome'
// auth check

type ActionResponse = {
  success: boolean
  message: string
}



export async function loader({ context }: { context: AppLoadContext }) {
  await context.customerAccount.handleAuthStatus()
  // perform query here (to get the existing value to prefill)
  const customerDietaryPreference = await context.customerAccount.query(QUERY_DIETARY_PREFERENCE)
  // @ts-ignore
  const dietaryPreferences = customerDietaryPreference.data.customer.metafield?.jsonValue || []

  return {
    dietary: dietaryPreferences,
  }
}

export default function WelcomeLanguagePreference() {
  const data = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionResponse>()
  const navigate = useNavigate()
  const defaultDietary = Array.isArray(data.dietary) ? data.dietary : []

  const form = useForm<welcomeFlowDietarySchemaType>({
    resolver: zodResolver(welcomeFlowDietarySchema),
    mode: 'onSubmit',
    defaultValues: {
      // @ts-ignore
      dietary: defaultDietary,
    },
  })

  const isLoading = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message)
        navigate('/welcome/success')
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
        onSubmit={form.handleSubmit((formData) => {
          // check if its the same then no need to make the server request
          if (JSON.stringify(formData.dietary.sort()) === JSON.stringify(defaultDietary.sort())) {
            return navigate('/welcome/success')
          }

          // Create a new FormData instance for submission
          const submissionData = new FormData();

          // Add the intent
          submissionData.append('intent', 'dietary');

          // Add each dietary preference as a separate entry
          formData.dietary.forEach(preference => {
            submissionData.append('dietary', preference);
          });

          fetcher.submit(
            submissionData,
            { action: '/resource/preferences', method: 'POST' },
          )
        })}
      >
        <FormField
          control={form.control}
          name="dietary"
          render={() => (
            <FormItem>
              <FormMessage className="mb-2" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dietaryOptions.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name="dietary"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...field.value, option]
                                  : field.value.filter((value) => value !== option)
                                field.onChange(updatedValue)
                              }}
                              className={`data-[state=checked]:bg-brand-green`}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {option}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          {/* @todo the name of this link can be different indicating going back to the home page store page */}
          <Link
            to={'/welcome/date'}
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
