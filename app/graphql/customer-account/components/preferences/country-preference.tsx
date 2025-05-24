import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import CountrySelect from '~/components/ui/country-select'
import { getFullCountryName } from '~/lib/utils/country-utils'

type ActionResponse = {
  success: boolean
  error?: string
  marketingState?: string
}

export function UserCountryPreference({ defaultCountry }: { defaultCountry: string }) {
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
      <p className="font-helvetica text-base font-regular text-grey-900">Country Of Origin</p>
      <fetcher.Form method="POST" action="/resource/preferences">
        <CountrySelect
          placeholder={!defaultCountry ? 'Select a country' : defaultCountry}
          whitelist={[
            'DZ',
            'AO',
            'BB',
            'BJ',
            'BW',
            'BR',
            'BF',
            'BI',
            'CV',
            'CM',
            'CA',
            'CF',
            'TD',
            'KM',
            'CU',
            'CD',
            'DO',
            'CG',
            'CI',
            'DJ',
            'EG',
            'GQ',
            'ER',
            'ET',
            'GA',
            'GM',
            'GH',
            'GN',
            'GW',
            'HT',
            'IN',
            'JM',
            'KE',
            'LS',
            'LR',
            'LY',
            'MG',
            'MW',
            'ML',
            'MR',
            'MU',
            'MA',
            'MZ',
            'NA',
            'NE',
            'NG',
            'RW',
            'ST',
            'SN',
            'SC',
            'SL',
            'SO',
            'ZA',
            'SS',
            'SD',
            'SZ',
            'TZ',
            'TG',
            'TT',
            'TN',
            'TR',
            'UG',
            'AE',
            'US',
            'ZM',
            'ZW',
          ]}
          className="flex min-w-[150px] justify-between md:min-w-[200px]"
          disabled={isSubmitting}
          onChange={(data: string) => {
            if (isSubmitting) return
            const countryName = getFullCountryName(data)
            if (countryName === defaultCountry) return
            fetcher.submit(
              { country: countryName ?? defaultCountry, intent: 'country' },
              { action: '/resource/preferences', method: 'POST' },
            )
          }}
        />
      </fetcher.Form>
    </div>
  )
}
