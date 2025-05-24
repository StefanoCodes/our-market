import { Await, useLoaderData } from '@remix-run/react'
import { ActionFunctionArgs, defer, LoaderFunctionArgs, redirect } from '@shopify/remix-oxygen'
import { Suspense } from 'react'
import { ProductItemDataFragment, ProductItemFragment } from 'storefrontapi.generated'
import { ProductCard, ProductCardSkeleton } from '~/components/features/Product/ui/product-card'
import SearchBreadcrumb from '~/components/features/Search/ui/search-breadcrumb'
import { Sidebar } from '~/components/layout/Sidebar'
import { PRODUCT_ITEM_FRAGMENT } from '~/lib/fragments'

// Number of products to show in initial critical load
const INITIAL_PRODUCTS = 8

// Key prefixes to ensure uniqueness
const KEYS = {
  SKELETON: 'search-skeleton',
  INITIAL: 'search-initial',
  DEFERRED: 'search-deferred',
} as const

interface SearchProduct {
  id: string
  handle: string
  title: string
  // ... add other product fields as needed
}

function SearchResultsSkeleton({ count = INITIAL_PRODUCTS * 2 }: { count?: number }) {
  return (
    <div className="contents">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={`${KEYS.SKELETON}-${Date.now()}-${i}`} />
      ))}
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const query = formData.get('q')

  if (!query) {
    return redirect('/')
  }

  // Redirect to the same route with query params
  return redirect(`/search?q=${encodeURIComponent(query.toString())}`)
}

// Remove unused interface
interface LoaderData {
  query: string | null
  totalProducts: number
  searchId: number
  initialResults: {
    products: ProductItemDataFragment[]
    articles: any[]
    pages: any[]
  }
  additionalResults: Promise<{
    products: ProductItemDataFragment[]
  }>
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')
  const searchId = Date.now()

  try {
    // Common variables for both queries
    const variables = {
      first: 250,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    }

    if (!query) {
      const { products } = await context.storefront.query(FEATURED_PRODUCTS_QUERY, {
        cache: context.storefront.CacheLong(),
        variables,
      })

      const allProducts = products?.nodes || []
      return createDeferredResponse({ query, allProducts, searchId })
    }

    const { products, articles, pages } = await context.storefront.query(SEARCH_QUERY, {
      cache: context.storefront.CacheLong(),
      variables: {
        ...variables,
        term: query,
      },
    })

    const allProducts = products?.nodes || []
    return createDeferredResponse({
      query,
      allProducts,
      searchId,
      articles: articles?.nodes,
      pages: pages?.nodes,
    })
  } catch (error) {
    console.error('Search Error:', error)
    return createDeferredResponse({ query, allProducts: [], searchId })
  }
}

// Helper function to create consistent deferred responses
function createDeferredResponse({
  query,
  allProducts,
  searchId,
  articles = [],
  pages = [],
}: {
  query: string | null
  allProducts: ProductItemDataFragment[]
  searchId: number
  articles?: any[]
  pages?: any[]
}) {
  const totalProducts = allProducts.length

  return defer({
    query,
    totalProducts,
    searchId,
    initialResults: {
      products: allProducts.slice(0, INITIAL_PRODUCTS),
      articles,
      pages,
    },
    additionalResults: Promise.resolve({
      products: allProducts.slice(INITIAL_PRODUCTS),
    }),
  })
}

export default function SearchPage() {
  const { query, initialResults, additionalResults, totalProducts, searchId } =
    useLoaderData<typeof loader>()
  const { products: initialProducts } = initialResults

  return (
    <div className="mx-auto flex min-h-screen-mobile-dvh max-w-[125rem] md:min-h-screen-desktop-dvh">
      <div className="sticky -top-5 h-full">
        <Sidebar />
      </div>
      <div className="mx-auto max-w-container flex-1 overflow-hidden pb-24 pt-8">
        <div className="mx-auto flex max-w-container flex-col gap-6 px-4 pb-[4.25rem] pt-4 lg:gap-8 xl:px-8">
          <SearchBreadcrumb title={query ? `${query}` : 'Featured Products'} type="search" />

          {/* Single Grid Container for All Results */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {initialProducts.length === 0 ? (
              <p className="col-span-full text-center">
                {query ? `No products found for "${query}"` : 'No featured products available'}
              </p>
            ) : (
              <>
                {initialProducts.map((product: ProductItemDataFragment) => (
                  <ProductCard
                    key={`${KEYS.INITIAL}-${product.id}-${searchId}`}
                    product={product}
                    swipeable={false}
                  />
                ))}

                {/* Deferred Additional Results */}
                <Suspense
                  fallback={
                    <SearchResultsSkeleton
                      count={Math.min(totalProducts - INITIAL_PRODUCTS, 100)}
                    />
                  }
                >
                  <Await resolve={additionalResults}>
                    {(data) => {
                      if (!data?.products?.length) return null
                      return (
                        <div className="contents">
                          {data.products.map((product: ProductItemDataFragment) => (
                            <ProductCard
                              key={`${KEYS.DEFERRED}-${product.id}-${searchId}`}
                              product={product}
                              swipeable={false}
                            />
                          ))}
                        </div>
                      )
                    }}
                  </Await>
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Queries

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const

const SEARCH_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
    ) {
      nodes {
        ...on Product {
          ...ProductItemData
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const

const FEATURED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query FeaturedProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      sortKey: BEST_SELLING
    ) {
      nodes {
        ...ProductItemData
      }
    }
  }
` as const
