import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils/utils'
type store = {
  name: string
  code: string
}

const stores: store[] = [{ name: 'West Africa', code: 'wa' }]

{
  /* <div className="bg-grey-100 px-6 py-[0.78125rem]"></div>; */
}

export function SelectStoreInput({ className }: { className?: string }) {
  return (
    <Select defaultValue="wa">
      <SelectTrigger
        className={cn(
          'h-full w-full rounded-lg border-grey-300 bg-white px-4 py-[0.59375rem] font-dm-sans font-medium text-grey-800 shadow-none',
          className,
        )}
      >
        <div className="flex min-w-[80.68px] items-center justify-between text-grey-500">
          <SelectValue placeholder="Select store" className="text-grey-500" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {stores.map((language) => (
          <SelectItem key={language.code} value={language.code} className="flex items-center gap-2">
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
