import { Outlet } from '@remix-run/react'
import { PageLayout } from '~/components/layout/PageLayout'
import { useRootLoaderData } from '~/root'

export default function StoreLayout() {
  const data = useRootLoaderData()
  if (!data) return null

  return (
    <PageLayout
      hideAnnouncementBar={data.hideAnnouncementBar}
      cart={data.cart}
      header={data.header}
      isLoggedIn={data.isLoggedIn}
      publicStoreDomain={data.publicStoreDomain}
    >
      <Outlet />
    </PageLayout>
  )
}
