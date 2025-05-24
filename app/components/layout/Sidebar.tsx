import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { useRootLoaderData } from '~/root'
import CollectionList from './sidebar/collection-list'

export function Sidebar() {
  const data = useRootLoaderData()
  return (
    <aside className="bg-gray-50 hidden min-h-[100vh] w-full overflow-hidden border-r border-r-grey-300 bg-white px-[2.34375rem] py-5 md:block md:w-[var(--store-sidebar)]">
      <nav className="hide-scrollbars relative flex h-full max-h-[100vh] flex-col gap-6 overflow-y-auto">
        <section className="sticky top-0">
          <Suspense fallback={<SidebarCollectionSkeleton />}>
            <Await resolve={data?.collections}>
              {(collections) => {
                return <CollectionList collections={collections ?? []} />
              }}
            </Await>
          </Suspense>
        </section>
      </nav>
    </aside>
  )
}

function SidebarCollectionSkeleton({ skeletons = 24 }: { skeletons?: number }) {
  return (
    <div className="flex min-h-[100vh] flex-col gap-6">
      {Array.from({ length: skeletons }).map((_, i) => (
        <div key={i} className="flex flex-row gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </div>
  )
}
