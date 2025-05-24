import * as React from 'react'
import { Globe } from 'lucide-react'
import { cn } from '~/lib/utils/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import GlobeIcon from '~/components/ui/icons/globe-icon'
type Language = {
  name: string
  code: string
  dir?: 'ltr' | 'rtl'
}

const languages: Language[] = [
  { name: 'English', code: 'eng', dir: 'ltr' },
  { name: 'Français', code: 'fr', dir: 'ltr' },
  { name: 'العربية', code: 'ar', dir: 'rtl' },
]

{
  /* <div className="bg-grey-100 px-6 py-[0.78125rem]"></div>; */
}

export default function LanguageBadge({
  className,
  showLabel = true,
  showAbbreviation,
}: {
  className?: string
  showLabel?: boolean
  showAbbreviation?: boolean
}) {
  const capitalize = (str: string) => {
    const capital = str.slice(0, 1).toUpperCase()
    const rest = str.slice(1)
    return capital + rest
  }
  return (
    <Select defaultValue="eng">
      <SelectTrigger
        className={cn(
          'h-full max-w-[9.25rem] border-0 bg-grey-100 px-4 py-[0.84375rem] font-inter font-medium text-grey-800 shadow-none',
          className,
        )}
      >
        <div className="flex flex-1 items-center gap-4">
          <SelectValue placeholder="Select language" />
          {showLabel && <GlobeIcon />}
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code} className="flex items-center gap-2">
            {showAbbreviation && capitalize(language.code)}
            {!showAbbreviation && language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
