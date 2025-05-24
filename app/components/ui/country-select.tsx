import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { filterCountries } from '~/lib/constants/helper'
//@ts-ignore
import countryRegionData from 'country-region-data/dist/data-umd'
import { useEffect, useState } from 'react'
import flags from 'react-phone-number-input/flags'

export interface Region {
  name: string
  shortCode: string
}

export interface CountryRegion {
  countryName: string
  countryShortCode: string
  regions: Region[]
}

interface CountrySelectProps {
  priorityOptions?: string[]
  whitelist?: string[]
  blacklist?: string[]
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

function CountrySelect({
  priorityOptions = [],
  whitelist = [],
  blacklist = [],
  onChange = () => {},
  className,
  placeholder = 'Country',
  disabled,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<CountryRegion[]>([])

  useEffect(() => {
    setCountries(filterCountries(countryRegionData, priorityOptions, whitelist, blacklist))
  }, [])

  return (
    <Select
      onValueChange={(value: string) => {
        onChange(value)
      }}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {countries.map(({ countryName, countryShortCode }) => (
          <SelectItem key={countryShortCode} value={countryShortCode}>
            <div className="flex h-full flex-row items-center justify-center gap-2">
              <FlagComponent country={countryShortCode} countryName={countryName} />
              <span>{countryName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
const FlagComponent = ({ country, countryName }: { country: string; countryName: string }) => {
  const Flag = flags[country as keyof typeof flags]

  return (
    <span className="flex h-4 w-6 items-center justify-center rounded-xl bg-none">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export default CountrySelect
