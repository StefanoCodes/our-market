import { cn } from '~/lib/utils/utils'
import LocationIcon from '~/components/ui/icons/location-icon'

export default function LocationBadge({
  location = '96773 Fremont',
  showLabel = true,
  iconClassName,
  className,
}: {
  location?: string
  showLabel?: boolean
  iconClassName?: string
  className?: string
}) {
  // todo: add a helper function in future to format the user location based on the region selection
  return (
    <div
      className={cn(
        'flex items-center gap-[0.625rem] rounded-[7px] bg-grey-100 px-4 py-[0.84375rem]',
        className,
      )}
    >
      {/* icon */}
      <LocationIcon className={iconClassName} />
      {/* text */}
      {showLabel && (
        <span className="font-inter text-sm font-medium text-grey-800">{location}</span>
      )}
    </div>
  )
}
