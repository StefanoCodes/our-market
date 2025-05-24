import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Input } from '~/components/ui/input'
import { welcomeFlowBirthOfDateSchema } from '~/lib/utils/welcome'
type ActionResponse = {
  success: boolean
  error?: string
  marketingState?: string
}
export function UserDateOfBirthPreference({ defaultDateOfBirth }: { defaultDateOfBirth: string }) {
  const fetcher = useFetcher<ActionResponse>()
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success('Successfully updated your preference')
      } else {
        toast.error('Something Went Wrong')
      }
    }
  }, [fetcher.data])

  const isSubmitting = fetcher.state !== 'idle'
  return (
    <div className="flex flex-row items-center justify-between rounded-xl border border-grey-300 bg-grey-100 p-4">
      <p className="font-helvetica text-base font-regular text-grey-900">Date Of Birth</p>
      <fetcher.Form
        method="POST"
        action="/resource/preferences"
        className="flex items-center justify-center"
      >
        <Input
          type="date"
          className="block min-w-[150px] cursor-pointer bg-grey-100 md:min-w-[200px]"
          placeholder="Enter you date of birth"
          defaultValue={defaultDateOfBirth}
          disabled={isSubmitting}
          onBlur={(e) => {
            const dateValue = e.target.value
            if (defaultDateOfBirth === dateValue) return

            const dateObject = {
              date: dateValue,
            }

            const validationResult = welcomeFlowBirthOfDateSchema.safeParse(dateObject)

            if (validationResult.success) {

              fetcher.submit(
                { date: dateValue, intent: 'date' },
                { action: '/resource/preferences', method: 'POST' },
              )
            }
          }}
          onChange={(e) => {
            const dateValue = e.target.value
            const dateObject = {
              date: e.target.value,
            }
            // check if the same value as wahats entered no need to do anything
            if (defaultDateOfBirth === dateValue) return

            const validationResult = welcomeFlowBirthOfDateSchema.safeParse(dateObject)
            if (!validationResult.success) return
            fetcher.submit(
              { date: dateValue, intent: 'date' },
              { action: '/resource/preferences', method: 'POST' },
            )
          }}
        />
      </fetcher.Form>
    </div>
  )
}
