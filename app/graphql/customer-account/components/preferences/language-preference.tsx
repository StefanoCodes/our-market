import { useFetcher } from '@remix-run/react'
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
type ActionResponse = {
  success: boolean
  error?: string
  marketingState?: string
}

export function UserLanguagePreference({ defaultLanguage }: { defaultLanguage: string }) {
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
      <p className="font-helvetica text-base font-regular text-grey-900">Language</p>
      <fetcher.Form
        method="POST"
        action="/resource/preferences"
        className="flex items-center justify-center"
      >
        <Select
          disabled={isSubmitting}
          onValueChange={(data) => {
            // early return if the value is the same as the default value
            if (data === defaultLanguage) return
            fetcher.submit(
              { language: data, intent: 'language' },
              { action: '/resource/preferences', method: 'POST' },
            )
          }}
          defaultValue={defaultLanguage}
        >
          <SelectTrigger className="flex w-[150px] justify-between md:w-[200px]">
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
      </fetcher.Form>
    </div>
  )
}
