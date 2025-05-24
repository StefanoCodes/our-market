import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { AppLoadContext, json } from '@shopify/remix-oxygen'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { QUERY_LANGUAGE_PREFERENCE } from '~/graphql/customer-account/CustomerMetafieldQuery'
import { welcomeFlowLanguageSchema, welcomeFlowLanguageSchemaType } from '~/lib/utils/welcome'
// auth check
export async function loader({ context }: { context: AppLoadContext }) {
  await context.customerAccount.handleAuthStatus()
  // perform query here (to get the existing value to prefill)
  const customerLanguagePreference = await context.customerAccount.query(QUERY_LANGUAGE_PREFERENCE)
  // @ts-ignore
  const languagePreference = customerLanguagePreference.data.customer.metafield?.jsonValue[0]

  return json(
    {
      language: languagePreference,
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

export default function WelcomeLanguagePreference() {
  const data = useLoaderData<typeof loader>()
  const fetcher = useFetcher<ActionResponse>()
  const navigate = useNavigate()
  const defaultLanguage = data.language ?? ''
  const form = useForm<welcomeFlowLanguageSchemaType>({
    resolver: zodResolver(welcomeFlowLanguageSchema),
    mode: 'onSubmit',
    defaultValues: {
      language: defaultLanguage,
    },
  })

  const isLoading = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message)
        navigate('/welcome/country')
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
          // check if its the same then no need to make the server request
          if (data.language === defaultLanguage) {
            return navigate('/welcome/country')
          }
          fetcher.submit(
            { ...data, intent: 'language' },
            { action: '/resource/preferences', method: 'POST' },
          )
        })}
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language Preference</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="flex w-[200px] justify-between">
                    <SelectValue placeholder="Select a preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Language Preference</SelectLabel>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="عربي">عربي</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          {/* @todo the name of this link can be different indicating going back to the home page store page */}
          <Link
            to={'/welcome/account'}
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
