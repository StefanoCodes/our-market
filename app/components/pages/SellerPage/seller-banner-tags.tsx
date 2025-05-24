import { cn } from '~/lib/utils/utils'

interface TagsProps {
  tags: string[]
}

export default function SellerBannerTags({ tags }: TagsProps) {
  const tagLabelBaseStyles = `text-green-600 font-helvetica capitalize font-medium text-xs`
  const isThereTags = tags.length > 0
  return (
    <>
      {isThereTags ? (
        <div className={cn('flex w-full flex-row items-center gap-1')}>
          {tags.map((tag, index) => (
            <span key={tag} className={cn(tagLabelBaseStyles, 'flex flex-row items-center gap-1')}>
              {tag}
              {index < tags.length - 1 && <span>•</span>}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}
