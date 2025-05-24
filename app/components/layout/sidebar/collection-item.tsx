import { Link } from '@remix-run/react'
import { Image } from '@shopify/hydrogen'
import { Image as ImageType, Maybe } from '@shopify/hydrogen/customer-account-api-types'
import { Collection, MenuItem } from '@shopify/hydrogen/storefront-api-types'
import { useEffect, useRef, useState } from 'react'
import { LIVE_SITE_URL } from '~/lib/integrations/klaviyo/constants'
import { cn, formatShopifyUrl } from '~/lib/utils/utils'
import { AnimatePresence, Variants } from 'motion/react'
import { motion as m } from 'motion/react'
import { ChevronDown } from 'lucide-react'

export const formatNestedUrl = (url: string | undefined | null, parentHandle?: string): string => {
  if (!url) return '/'

  // Extract the original URL parts
  const formattedUrl = formatShopifyUrl(url, LIVE_SITE_URL)

  if (!parentHandle || !formattedUrl) return formattedUrl || '/'

  // Check if this is a collection URL
  if (formattedUrl.includes('/collections/')) {
    // Extract the collection handle from the URL
    const urlParts = formattedUrl.split('/')
    const collectionIndex = urlParts.indexOf('collections')

    if (collectionIndex !== -1 && collectionIndex + 1 < urlParts.length) {
      // Get the collection handle
      const childHandle = urlParts[collectionIndex + 1]

      // Rebuild the URL with the parent/child structure
      urlParts[collectionIndex + 1] = `${parentHandle}/${childHandle}`
      return urlParts.join('/')
    }
  }

  return formattedUrl
}

// Animation variants for children (keep these for child animations)
const childVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      y: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
      opacity: { duration: 0.2 },
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      y: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
      opacity: { duration: 0.25 },
    },
  },
}

// Types
type ImageData = Maybe<Pick<ImageType, 'id' | 'url' | 'width' | 'height' | 'altText'>>

type NestedItem = Pick<MenuItem, 'title' | 'url'> & {
  resource?: Maybe<
    Pick<Collection, 'id'> & {
      image?: Maybe<Pick<ImageType, 'url' | 'width' | 'height' | 'altText' | 'id'>>
    }
  >
}

type CollectionItemProps = {
  url: string | undefined | null
  title: string
  image: ImageData | undefined
  items: NestedItem[]
  isExpanded?: boolean
  onToggle?: () => void
}

// Reusable components
export const CollectionLink = ({
  url,
  title,
  imageSrc,
  onClick = undefined,
  className,
}: {
  url: string
  title: string
  imageSrc: string | undefined
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  className?: string
}) => (
  <Link
    to={url}
    prefetch="intent"
    className={cn(`flex items-center gap-2`, className)}
    viewTransition
    onClick={onClick}
  >
    <CollectionImage src={imageSrc || '/placeholder.svg'} title={title} />
    <CollectionTitle title={title} />
  </Link>
)

export const CollectionImage = ({ src, title }: { src: string | undefined; title: string }) => (
  <Image
    src={src || '/placeholder.svg'}
    alt={`${title} collection image` || 'collection image'}
    width={20}
    height={20}
  />
)

export const CollectionTitle = ({ title }: { title: string }) => (
  <span className="font-inter text-sm text-grey-800">{title ?? 'Collection Name'}</span>
)

// Nested Collections Component
export function NestedCollections({
  items,
  parentHandle,
}: {
  items: NestedItem[]
  parentHandle: string
}) {
  return (
    <>
      {items.map(({ title, resource, url }, index) => {
        const nestedUrl = formatNestedUrl(url, parentHandle)
        return (
          <m.div key={`${title}-${index}`} variants={childVariants}>
            <CollectionLink url={nestedUrl ?? '/'} title={title} imageSrc={resource?.image?.url} />
          </m.div>
        )
      })}
    </>
  )
}

// Main component
export function CollectionItem({
  url,
  title,
  image,
  items,
  isExpanded = false,
  onToggle,
}: CollectionItemProps) {
  const formattedUrl = formatShopifyUrl(url, LIVE_SITE_URL)
  const handle = formattedUrl?.split('/').pop()

  const toggleExpanded = (e: React.MouseEvent<HTMLDivElement>) => {
    // only if the collection has nested collections we will do this
    if (items.length > 0) {
      e.preventDefault()
      if (onToggle) onToggle()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex w-full cursor-pointer select-none flex-row items-center justify-between gap-2"
        onClick={toggleExpanded}
      >
        <CollectionLink
          url={formattedUrl ?? '/'}
          title={title}
          imageSrc={image?.url}
          className={cn(isExpanded && 'text-brand-green transition-all duration-300')}
          onClick={(e) => {
            if (items.length > 0) {
              return e.preventDefault()
            }
          }}
        />
        {items.length > 0 && (
          <div className="h-5 w-5">
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-all duration-300',
                isExpanded ? 'rotate-180 text-brand-green' : '',
              )}
            />
          </div>
        )}
      </div>

      {/* Grid-based height animation for nested collections */}
      <div
        className={cn(
          'grid overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {/* Keep AnimatePresence for child animations while using grid for height */}
          <AnimatePresence>
            {isExpanded && (
              <m.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mb-4 ml-6 flex flex-col gap-6"
              >
                <NestedCollections items={items} parentHandle={handle ?? ''} />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
