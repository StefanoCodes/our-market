import { Await, MetaFunction, useLoaderData } from '@remix-run/react'
import { MediaImage } from '@shopify/hydrogen/storefront-api-types'
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { Suspense } from 'react'
import { ProductsCardSkeleton } from '~/components/features/Product/ui/product-card'
import { SwipeProductGrid } from '~/components/features/Product/ui/swipe-product-grid'
import { Sidebar } from '~/components/layout/Sidebar'
import { MarketingAnnouncementCardListSkeleton } from '~/components/pages/HomePage/markerting-announcement-card'
import { MarketingAnnouncementsList } from '~/components/pages/HomePage/marketing-announcements-list'
import { MobileCategoriesList } from '~/components/pages/HomePage/mobile-categories'
// import { MobileCategoriesList } from '~/components/pages/HomePage/mobile-categories'
import { Skeleton } from '~/components/ui/skeleton'
import { HOME_PAGE_COLLECTIONS_MENU_QUERY, MARKETING_ANNOUNCEMENTS_QUERY } from '~/lib/fragments'
import { LIVE_SITE_URL } from '~/lib/integrations/klaviyo/constants'
import { formatShopifyUrl } from '~/lib/utils/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'Our Market | Home' }]
}

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args)

  return defer({
    ...deferredData,
  })
}
//
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { storefront } = context

  const marketingAnnouncements = storefront.query(MARKETING_ANNOUNCEMENTS_QUERY, {
    cache: storefront.CacheLong(),
  })
  const homePageMenus = storefront.query(HOME_PAGE_COLLECTIONS_MENU_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      first: 20,
    },
  })

  return { marketingAnnouncements, homePageMenus }
}
export default function App() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto flex min-h-screen-mobile-dvh md:min-h-screen-desktop-dvh">
      {/* -top-5 represents the padding bottom we set for the sidebar */}
      <div className="sticky top-24 h-full">
        <Sidebar />
      </div>
      <div className="mx-auto max-w-storeContainer flex-1 overflow-hidden pb-24">
        {/* MARKETING ANNOUNCEMENTS */}
        <div className="hide-scrollbars h-fit flex-1 overflow-x-auto">
          <Suspense fallback={<MarketingAnnouncementCardListSkeleton />}>
            <Await resolve={loaderData.marketingAnnouncements} errorElement={<div>Error</div>}>
              {(marketingAnnouncements) => {
                // getting the first in the list (most updated)
                const bannerImages =
                  marketingAnnouncements.metaobjects.nodes[0].fields[0].references?.nodes

                const bannerImagesLinks = JSON.parse(
                  marketingAnnouncements.metaobjects.nodes[0].fields[1].value ?? '[]',
                )

                return (
                  <MarketingAnnouncementsList
                    bannerImages={bannerImages as MediaImage[]}
                    bannerImagesLinks={bannerImagesLinks as string[]}
                  />
                )
              }}
            </Await>
          </Suspense>
        </div>

        {/* CONTENT */}
        <div className="hide-scrollbars flex h-fit flex-1 flex-col gap-6 md:py-2">
          {/* VISIBLE ONLY ON MOBILE */}
          <MobileCategoriesList />

          <Suspense fallback={<CollectionSkeleton numberOfSkeletons={2} />}>
            <Await resolve={loaderData.homePageMenus} errorElement={<div>Error</div>}>
              {(homePageMenus) => {
                return (
                  <>
                    {homePageMenus.menu?.items?.map((item: any) => {
                      const formattedUrl = formatShopifyUrl(item.url, LIVE_SITE_URL)
                      return (
                        <SwipeProductGrid
                          key={item.title}
                          collectionHeading={item?.title}
                          products={item?.resource?.products?.nodes}
                          collectionHandle={formattedUrl ?? '/'}
                        />
                      )
                    })}
                  </>
                )
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CollectionSkeleton({ numberOfSkeletons = 1 }: { numberOfSkeletons?: number }) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <section key={index} className="h-[20.5rem] w-full px-4 md:h-[25.755rem]">
          <div className="flex h-full flex-col gap-[1.125rem]">
            <Skeleton className="flex h-[32.8px] w-full" />
            <div className="flex h-full flex-row gap-4">
              <ProductsCardSkeleton />
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
