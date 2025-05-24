import { Await, Link } from '@remix-run/react'
import { Image } from '@shopify/hydrogen'
import { XIcon } from 'lucide-react'
import React, { Suspense, useEffect, useState } from 'react'
import { SidebarCollectionsQuery } from 'storefrontapi.generated'
import { useMobileBottomNav } from '~/components/layout/header/mobile-bottom-nav-provider'
import { SelectStoreInput } from '~/components/layout/sidebar/select-store'
import {
  DrawerTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '~/components/ui/drawer'
import { Skeleton } from '~/components/ui/skeleton'
import { LIVE_SITE_URL } from '~/lib/integrations/klaviyo/constants'
import { formatShopifyUrl } from '~/lib/utils/utils'
import { useRootLoaderData } from '~/root'

type CollectionNode = SidebarCollectionsQuery['menu']

export function MobileCategoriesList() {
  const data = useRootLoaderData()
  const collections = data?.collections
  return (
    <div className="flex flex-col gap-8 px-4 md:hidden md:px-6">
      {collections && <MobileCategoryListItems collections={collections} />}
    </div>
  )
}

function MobileCategoryListItems({
  collections,
}: {
  collections: Promise<SidebarCollectionsQuery> | undefined
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { hide, show } = useMobileBottomNav()
  useEffect(() => {
    if (isDrawerOpen) {
      hide()
    } else {
      show()
    }
  }, [isDrawerOpen, hide, show])

  return (
    <div className="h-full w-full">
      <CategoryGridStyles>
        <Suspense fallback={<CollectionLoadingSkeleton />}>
          <Await resolve={collections}>
            {(resolvedCollections) => {
              const slicedCollections = resolvedCollections?.menu?.items.slice(0, 9)

              return (
                <>
                  {/* CATEGORIES GRID */}
                  {slicedCollections?.map(({ url, id, resource, title }) => {
                    const formattedUrl = formatShopifyUrl(url, LIVE_SITE_URL)
                    return (
                      <Link key={id} to={formattedUrl ?? '/'}>
                        <div className="flex flex-col items-center text-center">
                          <Image
                            src={resource?.image?.url}
                            alt={resource?.image?.altText ?? title}
                            width={28}
                            height={28}
                          />
                          <span className="max-w-16 font-inter text-xs">{title}</span>
                        </div>
                      </Link>
                    )
                  })}
                  {/* VIEW ALL DRAWER */}
                  {resolvedCollections?.menu?.items &&
                    resolvedCollections?.menu?.items?.length > 9 && (
                      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <DrawerTrigger asChild>
                          <ViewAllButton open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
                        </DrawerTrigger>
                        <DrawerContent className="flex min-h-[50vh] flex-col">
                          <DrawerHeader className="sticky top-0 z-10 flex w-full flex-row items-center justify-between bg-white px-8">
                            <DrawerTitle className="font-helvetica text-md font-medium text-black">
                              Categories
                            </DrawerTitle>
                            <DrawerDescription asChild>
                              <div
                                className="flex h-8 w-8 cursor-pointer items-center justify-center"
                                onClick={() => setIsDrawerOpen(false)}
                              >
                                <XIcon className="h-6 w-6 text-black" />
                              </div>
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="hide-scrollbars flex-1 overflow-y-auto px-2 py-8">
                            <CategoryGridList collections={resolvedCollections.menu} />
                          </div>
                        </DrawerContent>
                      </Drawer>
                    )}
                </>
              )
            }}
          </Await>
        </Suspense>
      </CategoryGridStyles>
    </div>
  )
}
// view all dots in the view all button
function ViewAllDots() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand-pearl">
      <div className="flex h-5 w-5 flex-row items-center gap-1">
        <span className="h-1 w-1 rounded-full bg-brand-green" />
        <span className="h-1 w-1 rounded-full bg-brand-green" />
        <span className="h-1 w-1 rounded-full bg-brand-green" />
      </div>
    </div>
  )
}
// view all button
const ViewAllButton = React.forwardRef<
  HTMLDivElement,
  {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
>(({ open, onOpenChange }, ref) => {
  return (
    <div
      ref={ref}
      onClick={() => onOpenChange(!open)}
      className="flex cursor-pointer flex-col items-center justify-center gap-1"
    >
      <ViewAllDots />
      <span className="font-inter text-xs">View All</span>
    </div>
  )
})
// list of the categories (so we can reuse inside the drawer)

function CategoryGridList({ collections }: { collections: SidebarCollectionsQuery['menu'] }) {
  return (
    <CategoryGridStyles>
      {collections?.items.map(({ id, url, resource, title }) => {
        const formattedUrl = formatShopifyUrl(url, LIVE_SITE_URL)
        return (
          <Link key={id} to={formattedUrl ?? '/'}>
            <div className="flex flex-col items-center text-center">
              <Image
                src={resource?.image?.url}
                alt={resource?.image?.altText ?? title}
                width={28}
                height={28}
              />
              <span className="max-w-16 font-inter text-xs">{title}</span>
            </div>
          </Link>
        )
      })}
    </CategoryGridStyles>
  )
}

function CategoryGridStyles({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-[139px] w-full grid-cols-5 gap-x-5 gap-y-4">{children}</div>
}

function CollectionLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-sm bg-grey-300" />
          <Skeleton className="h-3 w-16 rounded bg-grey-300" />
        </div>
      ))}
    </>
  )
}
