import { cn } from '~/lib/utils/utils'

export function UserDetail({
  value,
  children,
  className,
  label,
}: {
  value: string
  className?: string
  children?: React.ReactNode
  label?: string
}) {
  return children ? (
    <div className="flex w-full flex-row items-center justify-between border-t border-grey-300 pt-4 first-of-type:border-0 md:gap-8">
      <div className="flex flex-1 flex-col justify-between gap-2 md:flex-row md:items-center">
        {/* {label && <p className="font-helvetica text-base font-medium text-grey-700">{label}</p>} */}
        <p className={cn('font-helvetica text-sm font-medium text-grey-700', className)}>
          {value.length > 0 ? value : 'N/A'}
        </p>
      </div>
      <div>{children}</div>
    </div>
  ) : (
    <div className="flex flex-1 flex-row items-center justify-between space-y-2 border-t border-grey-300 pt-4 first-of-type:border-0">
      {label && <p className="font-helvetica text-sm font-medium text-grey-700">{label}</p>}
      <p className={cn('font-helvetica text-sm font-medium text-grey-700', className)}>
        {value.length > 0 ? value : 'N/A'}
      </p>
    </div>
  )
}
