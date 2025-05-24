import type { ShouldRevalidateFunction } from '@remix-run/react'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react'
import { Analytics, getShopAnalytics, Image, useNonce } from '@shopify/hydrogen'
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types'
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { defer } from '@shopify/remix-oxygen'
import { ArrowLeft } from 'lucide-react'
import { Toaster } from '~/components/ui/sonner'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { getErrorDetails } from '~/lib/error'
import appStyles from '~/styles/app.css?url'
import resetStyles from '~/styles/reset.css?url'
import { Aside } from './components/layout/Aside'
import { createAnnouncementBarSession } from './cookies.server'
import { HEADER_QUERY } from './lib/fragments'
import fontStyles from './styles/fonts.css?url'
import tailwindCss from './styles/tailwind.css?url'
import { GlobalLoading } from './components/layout/Loading'

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true

  return defaultShouldRevalidate
}

export function links() {
  return [
    { rel: 'stylesheet', href: fontStyles },
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: appStyles },
    { rel: 'stylesheet', href: tailwindCss },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const { context } = args

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args)

  const criticalData = await loadCriticalData(args)

  const { storefront, env } = context

  return defer({
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  })
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const { storefront } = context
  const [header, announcementBarState, customer] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
    // cookie for the announcement bar
    (async () => {
      const cookieHeader = request.headers.get('Cookie')
      const announcementBarSession = createAnnouncementBarSession(context)
      const announcementBarCookie = await announcementBarSession.parse(cookieHeader)
      if (announcementBarCookie) {
        return announcementBarCookie.hideAnnouncementBar
      }
      return false
    })(),
    // customer
    (async () => {
      const customerAccessToken = await context.customerAccount.getAccessToken()
      if (!customerAccessToken) {
        return null
      }
      return context.customerAccount.query(CUSTOMER_DETAILS_QUERY)
    })(),
  ])
  return {
    header,
    hideAnnouncementBar: announcementBarState,
    customer,
  }
}

function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { cart, storefront } = context
  // for the sidebar
  const collections = storefront.query(COLLECTIONS_QUERY, {
    cache: storefront.CacheLong(),
  })
  return {
    cart: cart.get(),
    isLoggedIn: context.customerAccount.isLoggedIn(),
    collections,
  }
}

// this is used as a convient way of typing the loader function and to reuse in the child components to get the data from the parent
export function useRootLoaderData() {
  return useRouteLoaderData<RootLoader>('root')
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce()
  const data = useRootLoaderData()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content="Shop Our Market" />
        <Meta />

        <Links />
      </head>
      <body className="min-h-dvh">
        {data ? (
          <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
            <Aside.Provider>{children}</Aside.Provider>
          </Analytics.Provider>
        ) : (
          children
        )}
        <Toaster invert />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export default function App() {
  const navigation = useNavigation()
  const isNavigating = Boolean(navigation.location)

  return (
    <>
      {isNavigating && <GlobalLoading />}
      <Outlet />
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { errorMessage, errorStatus } = getErrorDetails(error)

  process.env.NODE_ENV === 'development' && console.error(error)

  return (
    <div className="relative flex min-h-dvh items-center justify-center">
      <Image
        src="/backgrounds/green-background.svg"
        alt="green Background"
        sizes="(min-width: 45em) 50vw, 100vw"
        width={500}
        height={500}
        className="absolute inset-0 h-full w-full"
      />
      <div className="z-1 absolute inset-0 h-full w-full bg-black/10" />
      <div className="relative mx-auto w-full max-w-2xl px-4 md:px-8">
        <div className="overflow-hidden rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-6xl font-extrabold md:text-7xl text-center text-yellow-500">
            {errorStatus}
          </h1>
          <p className="font-semibold text-gray-800 mt-4 text-center text-2xl md:text-3xl">
            Oops! Page not found.
          </p>
          <p className="text-gray-600 mt-2 text-center">{errorMessage}</p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="group flex items-center rounded-lg bg-brand-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export type RootLoader = typeof loader

// const COLLECTIONS_QUERY = `#graphql
//   query Collections(
//     $country: CountryCode
//     $language: LanguageCode
//     $first: Int = 10
//   ) @inContext(country: $country, language: $language) {
//     collections(first: $first) {
//       nodes {
//         id
//         handle
//         title
//         description
//         image {
//           url
//           altText
//           width
//           height
//         }
//       }
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//         startCursor
//         endCursor
//       }
//     }
//   }
// ` as const

const COLLECTIONS_QUERY = `#graphql
 query SidebarCollections {
  menu(handle: "side-panel") {
    items {
      id  
      url
      title
      type
 resource {
        ... on Collection {
          id
        image {
            url
            width
            height
            altText
            id
          }
        }
      }

      items {
        url
        title
         resource {
        ... on Collection {
          id
        image {
            url
            width
            height
            altText
            id
          }
        }
      }
    }
    }
  }
}` as const
export interface ProductItemFragment {
  nodes: Array<{
    id: string
    title: string
    publishedAt: string
    handle: string
    description: string
    priceRange: {
      minVariantPrice: MoneyV2
    }
    compareAtPriceRange: {
      minVariantPrice: MoneyV2
    }
    featuredImage?: {
      url: string
      altText: string
      width: number
      height: number
    }
    variants: {
      nodes: Array<{
        selectedOptions: Array<{
          name: string
          value: string
        }>
        availableForSale: boolean
        price: MoneyV2
        compareAtPrice?: MoneyV2
      }>
    }
    tags: Array<string>
    availableForSale: boolean
    vendor: string
  }>
}
