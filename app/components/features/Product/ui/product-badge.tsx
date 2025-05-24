import { cn } from '~/lib/utils/utils'

export default function ProductBadge({ title, className }: { title: string; className?: string }) {
  return (
    <span
      className={cn(
        'rounded-[6px] border border-yellow-500 bg-black px-2 py-1 text-2xs uppercase text-white',
        className,
      )}
    >
      {title}
    </span>
  )
}
