import { cn } from '~/lib/utils/utils'

import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '../../ui/select'
const preferences = [
  {
    id: 1,
    title: 'Halal',
    code: 'ha',
  },
  {
    id: 2,
    title: 'Halal',
    code: 'ha2',
  },
  {
    id: 3,
    title: 'Halal',
    code: 'ha3',
  },
]

export default function ReligiousPreferenceSelect() {
  return (
    <Select defaultValue="ha">
      <SelectTrigger
        className={cn(
          'flex h-full w-full justify-between rounded-lg border-grey-300 bg-white px-4 py-[0.59375rem] font-dm-sans font-medium text-grey-800 shadow-none',
        )}
      >
        <SelectValue placeholder="Select Religious Preference" className="flex-1 text-grey-500" />
      </SelectTrigger>
      <SelectContent>
        {preferences.map(({ id, title, code }) => (
          <SelectItem key={id} value={code} className="flex items-center gap-2">
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
