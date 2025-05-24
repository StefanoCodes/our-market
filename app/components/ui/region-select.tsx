import { forwardRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

//@ts-ignore
import countryRegionData from 'country-region-data/dist/data-umd'
import { useEffect, useState } from 'react'
import { filterRegions } from '~/lib/constants/helper'

export interface Region {
  name: string
  shortCode: string
}

export interface CountryRegion {
  countryName: string
  countryShortCode: string
  regions: Region[]
}

interface RegionSelectProps {
  countryCode: string
  priorityOptions?: string[]
  whitelist?: string[]
  blacklist?: string[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
}

const RegionSelect = forwardRef<HTMLButtonElement, RegionSelectProps>(
  (
    {
      countryCode,
      priorityOptions = [],
      whitelist = [],
      blacklist = [],
      value,
      onChange,
      className,
      placeholder = 'Region',
    },
    ref,
  ) => {
    const [regions, setRegions] = useState<Region[]>([])

    useEffect(() => {
      const regions = countryRegionData.find(
        (country: CountryRegion) => country.countryShortCode === countryCode,
      )

      if (regions) {
        setRegions(filterRegions(regions.regions, priorityOptions, whitelist, blacklist))
      }
    }, [countryCode, priorityOptions, whitelist, blacklist])

    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {regions.map(({ name, shortCode }) => (
            <SelectItem key={shortCode} value={shortCode}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
)

RegionSelect.displayName = 'RegionSelect'

export default RegionSelect
