import React, { useCallback, useState, forwardRef, useEffect } from 'react'

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

// utils
import { cn } from '~/lib/utils/utils'

// assets
import { ChevronDown, CheckIcon, Globe } from 'lucide-react'
import flags from 'react-phone-number-input/flags'

// data
import { Country, allCountries } from '~/lib/constants/countries'

// Dropdown props
interface CountryDropdownProps {
  options?: Country[]
  onChange?: (country: Country) => void
  value?: string
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  slim?: boolean
}

const FlagComponent = ({ country, countryName }: { country: string; countryName: string }) => {
  const Flag = flags[country as keyof typeof flags]

  return (
    <span className="flex h-4 w-6 items-center justify-center rounded-xl bg-none">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

const CountryDropdownComponent = (
  {
    options = allCountries,
    onChange,
    value,
    defaultValue,
    disabled = false,
    placeholder = 'Select a country',
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(() => {
    if (value) {
      return options.find((country) => country.alpha2 === value)
    }
    if (defaultValue) {
      return options.find((country) => country.alpha2 === defaultValue)
    }
    return undefined
  })

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const country = options.find((c) => c.alpha2 === value)
      setSelectedCountry(country)
    }
  }, [value, options])

  // Update internal state when defaultValue changes and value is undefined
  useEffect(() => {
    if (value === undefined && defaultValue) {
      const country = options.find((c) => c.alpha2 === defaultValue)
      setSelectedCountry(country)
    }
  }, [defaultValue, options, value])

  const handleSelect = useCallback(
    (country: Country) => {
      if (value === undefined) {
        setSelectedCountry(country)
      }
      onChange?.(country)
      setOpen(false)
    },
    [onChange, value],
  )

  const displayCountry = selectedCountry

  const triggerClasses = cn(
    'flex h-9 w-[150px] md:w-[200px]  items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    slim === true && 'w-20',
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
        {displayCountry ? (
          <div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
            <FlagComponent country={displayCountry.alpha2} countryName={displayCountry.name} />
            {slim === false && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {displayCountry.name}
              </span>
            )}
          </div>
        ) : (
          <span>{slim === false ? placeholder : <Globe size={20} />}</span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="max-h-[200px] w-full sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              {/* <CommandInput placeholder="Search country..." /> */}
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, key: number) => (
                <CommandItem
                  className="flex w-full items-center gap-2"
                  key={key}
                  onSelect={() => handleSelect(option)}
                >
                  <div className="flex w-0 flex-grow space-x-2 overflow-hidden">
                    <FlagComponent country={option.alpha2} countryName={option.name} />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {option.name}
                    </span>
                  </div>
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4 shrink-0',
                      option.alpha2 === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

CountryDropdownComponent.displayName = 'CountryDropdownComponent'

export const CountryDropdown = forwardRef(CountryDropdownComponent)
