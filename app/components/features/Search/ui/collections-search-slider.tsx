import { Link, useLocation } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { SidebarCollectionsQuery } from 'storefrontapi.generated'
import { formatNestedUrl } from '~/components/layout/sidebar/collection-item'
import { LIVE_SITE_URL } from '~/lib/integrations/klaviyo/constants'
import { cn, formatShopifyUrl } from '~/lib/utils/utils'
// const format title to handle
const formatTitleToHandle = (title: string) => {
  const split = title.replace(' ', '-')
  const lowerCase = split.toLocaleLowerCase()
  return lowerCase
}
interface CollectionItem {
  id: string
  handle: string
  title: string
}

interface CollectionsSearchSliderProps {
  collections: SidebarCollectionsQuery['menu']
  activeMainHandle?: string
  activeNestedHandle?: string
}

export function CollectionsSearchSlider({
  collections,
  activeMainHandle,
  activeNestedHandle,
}: CollectionsSearchSliderProps) {
  const activeRef = useRef<HTMLAnchorElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const activeNestedCollections = collections?.items.filter((collection) => {
    return activeMainHandle === formatTitleToHandle(collection.title)
  })

  useEffect(() => {
    setTimeout(() => {
      if (activeRef.current && containerRef.current) {
        activeRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }, 600)
  }, [activeMainHandle])
  return (
    <div className="relative flex w-full flex-col gap-2">
      <div
        ref={containerRef}
        className={cn('hide-scrollbars relative z-10 flex gap-4 overflow-x-auto pb-4')}
      >
        {collections?.items.map(({ id, title, url }) => {
          const formattedUrl = formatShopifyUrl(url, LIVE_SITE_URL)
          const handle = formattedUrl?.split('/').pop()

          return (
            <Link
              key={id}
              ref={activeMainHandle === handle ? activeRef : null}
              to={`${formattedUrl}`}
              prefetch="intent"
              viewTransition
              className={cn(
                'flex-shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-colors',
                activeMainHandle === handle
                  ? 'bg-green-200 text-green-900'
                  : 'border border-green-200 bg-white/30 text-green-900',
              )}
            >
              {title}
            </Link>
          )
        })}
      </div>
      {activeNestedCollections &&
        activeNestedCollections.length > 0 &&
        activeNestedCollections.map((collection) => {
          const isThereNestedCollections = collection.items.length > 0
          return (
            isThereNestedCollections && (
              <div
                ref={containerRef}
                className={cn('hide-scrollbars relative z-10 flex gap-4 overflow-x-auto pb-4')}
                key={collection.id}
              >
                {collection.items.map(({ title, url }) => {
                  const nestedUrl = formatNestedUrl(url, activeMainHandle)
                  const handle = location.pathname.split('/').pop()
                  const titleToHandle = formatTitleToHandle(title)
                  return (
                    <Link
                      key={title}
                      ref={titleToHandle === handle ? activeRef : null}
                      to={nestedUrl}
                      prefetch="intent"
                      viewTransition
                      className={cn(
                        'flex-shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-colors',
                        titleToHandle === handle
                          ? 'bg-green-200 text-green-900'
                          : 'border border-green-200 bg-white/30 text-green-900',
                      )}
                    >
                      {title}
                    </Link>
                  )
                })}
              </div>
            )
          )
        })}
    </div>
  )
}
