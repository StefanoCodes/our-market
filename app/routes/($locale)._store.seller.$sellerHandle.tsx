import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { json, redirect } from '@shopify/remix-oxygen'
import ProductGrid from '~/components/features/Product/ui/regular-product-grid'
import SellerBanner from '~/components/pages/SellerPage/seller-banner'
import GoBack from '~/components/ui/button/go-back'
import { PRODUCT_ITEM_FRAGMENT } from '~/lib/fragments'
import { ProductItemFragment } from '~/root'

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { sellerHandle } = params
  const { storefront } = context

  if (!sellerHandle) {
    throw redirect('/')
  }
  const seller = await storefront.query(VENDOR_COLLECTION_QUERY, {
    variables: {
      handle: sellerHandle,
      first: 48,
    },
    cache: context.storefront.CacheLong(),
  })

  if (!seller.collection) {
    throw redirect('/')
  }

  if (!seller.collection && seller.errors && seller.errors?.length > 0) throw redirect('/')

  // seller tags

  const sellerProducts = seller.collection?.products.nodes
  console.log(sellerProducts)
  if (sellerProducts?.length === 0) {
    throw redirect('/')
  }

  const sellerName = seller.collection?.title
  const sellerImage = seller.collection?.image

  const sellerDescription = seller.collection?.description
  const sellerTags = (
    seller.collection.metafield
      ? seller.collection.metafield.value
        ? JSON.parse(seller.collection.metafield?.value)
        : []
      : []
  ) as string[]

  return json({ sellerName, sellerDescription, sellerTags, sellerImage, sellerProducts })
}

export default function SellerPage() {
  const { sellerName, sellerDescription, sellerTags, sellerProducts, sellerImage } =
    useLoaderData<typeof loader>()

  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 overflow-hidden px-4 pb-[4.25rem] pt-8 lg:flex-row lg:gap-0 xl:px-16">
      {/* Back */}
      <GoBack className="justify-start self-start" />
      {/* Content */}
      <div className="mx-auto flex max-w-seller-main-content flex-col gap-[2.625rem]">
        {/* Seller info */}
        <SellerBanner
          name={sellerName}
          description={sellerDescription}
          tags={sellerTags}
          bannerImage={{
            url: sellerImage?.url ?? '',
            originalSrc: '',
            src: '',
            transformedSrc: '',
          }}
          rating={{
            reviewsCount: 100,
            starCount: 5,
          }}
        />
        {/* ALL PRODUCTS */}
        <div className="flex flex-col gap-[1.125rem]">
          {/* All Products */}
          <h3 className="font-helvetica text-md font-bold text-black">All Products</h3>

          {/* Products Grid */}
          <ProductGrid products={sellerProducts as ProductItemFragment['nodes']} />
        </div>
      </div>
    </div>
  )
}

export const VENDOR_COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query VendorDetails(
    $handle: String!
    $first: Int
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      image {
      height
      altText
      id
      url
      width
    }
       metafield(key: "tags", namespace: "custom") {
      value
    }
      products(
        first: $first
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        nodes {
          ...ProductItemData
        }
      }
    }
  }
` as const
