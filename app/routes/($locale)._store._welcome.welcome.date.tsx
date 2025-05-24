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
import { Input } from '~/components/ui/input'
import { QUERY_DATE_OF_BIRTH } from '~/graphql/customer-account/CustomerMetafieldQuery'
import { welcomeFlowBirthOfDateSchema, welcomeFlowBirthOfDateSchemaType } from '~/lib/utils/welcome'
// auth check
export async function loader({ context }: { context: AppLoadContext }) {
  await context.customerAccount.handleAuthStatus()
  // perform query here (to get the existing value to prefill)
  const customerDateOfBirth = await context.customerAccount.query(QUERY_DATE_OF_BIRTH)
  // @ts-ignore
  const dateOfBirth = customerDateOfBirth.data.customer.metafield?.value

  return json(
    {
      date: dateOfBirth,
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
  const defaultDate = data.date ?? ''
  const form = useForm<welcomeFlowBirthOfDateSchemaType>({
    resolver: zodResolver(welcomeFlowBirthOfDateSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: defaultDate,
    },
  })

  const isLoading = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message)
        navigate('/welcome/dietary')
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
          if (data.date === defaultDate) {
            return navigate('/welcome/dietary')
          }
          fetcher.submit(
            { ...data, intent: 'date' },
            { action: '/resource/preferences', method: 'POST' },
          )
        })}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="block min-w-[200px] cursor-pointer"
                  placeholder="Enter you date of birth"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          {/* @todo the name of this link can be different indicating going back to the home page store page */}
          <Link
            to={'/welcome/country'}
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
