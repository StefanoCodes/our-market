import { Accordion } from '@radix-ui/react-accordion'
import { Await, Link, useAsyncValue, useLoaderData, type MetaFunction } from '@remix-run/react'
import {
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  Image,
  Money,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
  VariantSelector,
} from '@shopify/hydrogen'
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { Minus, Plus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { AddToCartButton } from '~/components/features/Cart/ui/add-to-cart'
import { ProductsCardSkeleton } from '~/components/features/Product/ui/product-card'
import ProductFavorite from '~/components/features/Product/ui/product-favorites'
import ProductImageGrid from '~/components/features/Product/ui/product-image-grid'
import { ProductRow } from '~/components/features/Product/ui/product-row'
import { useAside } from '~/components/layout/Aside'
import SellerBannerReviews, {
  SellerBannerReviewsSkeleton,
} from '~/components/pages/SellerPage/seller-banner-reviews'
import { AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import GoBack from '~/components/ui/button/go-back'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { PRODUCT_ITEM_FRAGMENT } from '~/lib/fragments'
import { getProductReviews, getProductReviewsCount } from '~/lib/integrations/judge-me/actions'
import { CreateReviewForm } from '~/lib/integrations/judge-me/components/create-review'
import { ReviewCard, ReviewCardSkeleton } from '~/lib/integrations/judge-me/components/review-card'
import { trackKlaviyoEvent } from '~/lib/integrations/klaviyo/events/tracking-events'
import {
  formatDescription,
  formatMetaFieldTitle,
  formatVendorHandle,
  ParsedNutritionItem,
  parseNutritionData,
} from '~/lib/utils/product'
import { cn } from '~/lib/utils/utils'
import { useRootLoaderData } from '~/root'

// note get the right acess for the total quantity

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Our Market | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  // Defer non-critical data
  const deferredData = loadDeferredData(args)

  // Load critical data first
  const criticalData = await loadCriticalData(args)

  return defer({
    ...criticalData,
    ...deferredData,
  })
}

/**
 * Load critical data required for initial page render
 */
async function loadCriticalData({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params
  const { storefront } = context

  if (!handle) {
    throw new Response(null, { status: 404 })
  }
  const selectedOptions = getSelectedProductOptions(request)
  const [{ product }, customer, cart] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions },
    }),
    (async () => {
      const customerAccessToken = await context.customerAccount.getAccessToken()
      if (!customerAccessToken) {
        return null
      }
      return context.customerAccount.query(CUSTOMER_DETAILS_QUERY)
    })(),
    context.cart.get(),
  ])

  if (!product?.selectedOrFirstAvailableVariant) {
    const searchParams = new URLSearchParams(new URL(request.url).search)

    const firstVariant = product?.options[0]?.optionValues[0]?.firstSelectableVariant

    for (const option of firstVariant?.selectedOptions ?? []) {
      searchParams.set(option.name, option.value)
    }

    throw redirect(
      `/products/${product!.handle}?${searchParams.toString()}`,
      302, // Make sure to use a 302, because the first variant is subject to change
    )
  }

  if (!product?.id) {
    throw new Response(null, { status: 404 })
  }
  if (customer?.data.customer.id) {
    await trackKlaviyoEvent(
      context.env.KLAVIYO_PRIVATE_KEY,
      `/product/${product.handle}`,
      'Product Page Viewed',
      request,
      { product },
      customer.data.customer.emailAddress?.emailAddress ?? '',
    )
  }

  return { product, cart }
}

/**
 * Load non-critical data that can be deferred
 */
function loadDeferredData({ params, context }: LoaderFunctionArgs) {
  const { handle } = params
  if (!handle) {
    throw new Response(null, { status: 404 })
  }

  const recommendedProducts = context.storefront.query(RECCOMENDED_PRODUCTS_QUERY, {
    variables: { handle },
  })

  const productReviews = getProductReviews(context, handle)
  const productReviewsCount = getProductReviewsCount(context, handle)

  return {
    recommendedProducts,
    productReviews,
    productReviewsCount,
  }
}

export default function Product() {
  const { product, productReviews, recommendedProducts, productReviewsCount, cart } =
    useLoaderData<typeof loader>()

  const { vendor, description } = product

  // Optimistically selects a variant with given available variant information

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  )

  // cart line item in the cart (this product could already be in the cart therefore we need to update the logic)
  const lineItem = cart?.lines.nodes.find(
    (cartItem) => cartItem.merchandise.id === selectedVariant.id,
  )

  const vendorHandle = formatVendorHandle(vendor)
  const [quantity, setQuantity] = useState(1)
  const lowerLimit = 1
  const isLowerLimit = quantity <= lowerLimit
  const isUpperLimit =
    quantity >= (selectedVariant?.quantityAvailable ?? 0) - (lineItem?.quantity ?? 0)

  const isOutOfStock = !selectedVariant?.availableForSale || !selectedVariant.id
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount
  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > lowerLimit ? prev - 1 : lowerLimit))
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions)

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  })

  const filteredMetafields = product.metafields.filter((metafield: any) => metafield !== null)
  const { title, images } = selectedVariant.product
  const { open } = useAside()

  const handleAddToCart = () => {
    open('cart')
    setQuantity(1)
  }

  // @todo listen to when the variant changes and reset the quantity adjuster

  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 scroll-smooth px-4 pb-[4.25rem] pt-6 lg:gap-8 lg:pt-12 xl:gap-10 xl:px-16">
      {/* PRODUCT INFO */}
      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-8">
        {/* Go Back */}
        <GoBack className="max-w-3xl self-start" />
        {/* Product Images */}
        {images?.nodes && (
          <ProductImageGrid
            key={selectedVariant.id}
            images={[
              // First image (either variant or first product image)
              selectedVariant.image
                ? {
                    id: selectedVariant.image.id || String(Date.now()),
                    url: selectedVariant.image.url || '',
                    altText: selectedVariant.image.altText || '',
                    width: selectedVariant.image.width || 0,
                    height: selectedVariant.image.height || 0,
                  }
                : {
                    id: images.nodes[0].id || String(Date.now()),
                    url: images.nodes[0].url || '',
                    altText: images.nodes[0].altText || '',
                    width: images.nodes[0].width || 0,
                    height: images.nodes[0].height || 0,
                  },
              // Remaining images, filtered to avoid duplicates
              ...images.nodes
                .filter((image) => image.id !== (selectedVariant.image?.id || images.nodes[0].id))
                .slice(0, 3)
                .map((image: any) => ({
                  id: image.id || String(Date.now()),
                  url: image.url || '',
                  altText: image.altText || '',
                  width: image.width || 0,
                  height: image.height || 0,
                })),
            ]}
            title={title}
          />
        )}
        {/* Product Sidebar Info */}
        <div className="w-full max-w-3xl flex-1 rounded-xl bg-white px-4 py-6 pb-0 lg:max-w-[528px] lg:px-6">
          {/* Seperation */}
          <div className="flex flex-col gap-7">
            {/* Product Details */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                {/* first segment (price, seller info) */}
                <div>
                  <div className="flex w-full flex-row justify-between border-b border-grey-400 pb-4">
                    <div className="flex flex-row items-center gap-[6px]">
                      {/* Seller name & seller pfp & link to */}
                      <Image src="/seller-profile-image.svg" width={32} height={32} />
                      <Link
                        className="font-helvetica text-base font-medium capitalize text-brand-green underline"
                        to={`/seller/${vendorHandle}`}
                      >
                        {vendor}
                      </Link>
                    </div>
                    {/* reviews */}
                    <Suspense fallback={<SellerBannerReviewsSkeleton />}>
                      <Await resolve={productReviewsCount}>
                        {(count) => {
                          return (
                            <SellerBannerReviews
                              rating={{
                                reviewsCount: count.count,
                                starCount: count.averageStarRating,
                              }}
                            />
                          )
                        }}
                      </Await>
                    </Suspense>
                  </div>
                </div>
                {/* second segment product name & product favoirte icon */}
                <div className="flex flex-row items-center justify-between">
                  <h1 className="font-helvetica text-md font-medium text-[#292D32]">{title}</h1>
                  <ProductFavorite className="rounded-full border border-grey-300 p-2" />
                </div>
                {/* third segment */}
                <div className="flex flex-col gap-2">
                  {/* product price + span (per pick) */}
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                      <Money
                        data={selectedVariant?.price || {}}
                        className="font-helvetica text-md font-medium text-brand-green"
                      />
                      {/* compare at price */}
                      {selectedVariant?.compareAtPrice && (
                        <Money
                          data={selectedVariant?.compareAtPrice || {}}
                          className="font-helvetica text-sm font-regular text-grey-600 line-through"
                        />
                      )}
                    </div>

                    <span className="font-helvetica text-sm font-regular text-grey-600">
                      Per Pck
                    </span>
                  </div>
                  {/* shippng details */}
                  <p className="font-helvetica text-sm font-regular text-grey-600">
                    Shipping is calculated at checkout
                  </p>
                </div>
              </div>
              {/* variants & quantity */}
              <div className="flex flex-col gap-4">
                {/* varinats */}
                <VariantSelector
                  options={productOptions}
                  handle={product.handle}
                  // @ts-ignore
                  selectedVariant={product.selectedOrFirstAvailableVariant}
                >
                  {({ option }) => (
                    <div className="flex flex-col gap-4">
                      <span>{option.name}</span>
                      <div className="flex flex-row gap-3">
                        {option.values.map(({ isActive, optionValue, isAvailable, to }) => (
                          <Link
                            key={optionValue.name}
                            // dont add to history stack
                            replace
                            to={to}
                            preventScrollReset
                            prefetch="intent"
                            className={cn(
                              'rounded-[22px] border px-[35px] py-[10px] font-helvetica text-xs font-medium text-[#292D32]',
                              isActive ? 'bg-brand-green text-white' : 'border-grey-300',
                              !isAvailable && 'cursor-not-allowed opacity-50',
                            )}
                          >
                            {optionValue.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </VariantSelector>

                {/* quantity controllers */}
                {!isOutOfStock && lineItem && lineItem.quantity > 0 && (
                  <span className="flex w-full justify-end self-end font-dm-sans text-xs text-brand-green">
                    ({lineItem?.quantity} {lineItem.quantity > 1 ? `items` : `item`} in the cart)
                  </span>
                )}
                <div className="flex flex-row items-center justify-between">
                  <h4 className="font-helvetica text-sm font-medium text-[#292D32]">Quantity</h4>
                  <div className="flex flex-row gap-5 rounded-xl border border-grey-300 bg-grey-100 px-3 py-[14px]">
                    {isOutOfStock && (
                      <span className="font-helvetica text-sm font-regular text-[#292D32]">
                        {'Out of Stock'}
                      </span>
                    )}
                    {/* todo ofc have the logic in place to be disabled if the qunaity selected is less than one etc thats gonna happen */}
                    {!isOutOfStock && (
                      <>
                        <Button
                          aria-disabled={isLowerLimit}
                          variant="ghost"
                          className={cn(
                            `h-6 w-6 cursor-pointer`,
                            isLowerLimit ? 'cursor-not-allowed opacity-50' : '',
                          )}
                          onClick={handleDecreaseQuantity}
                          disabled={isLowerLimit}
                        >
                          <Minus className="h-6 w-6 text-black" />
                        </Button>
                        <span className="font-helvetica text-md font-regular text-[#292D32]">
                          {quantity}
                        </span>

                        <Button
                          variant="ghost"
                          className={cn(
                            `h-6 w-6 cursor-pointer`,
                            isUpperLimit ? 'cursor-not-allowed opacity-50' : '',
                          )}
                          onClick={handleIncreaseQuantity}
                          disabled={isUpperLimit}
                        >
                          <Plus className="h-6 w-6 cursor-pointer text-black" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Cart Form Buttons (add to cart + Buy Now) */}
                {!isOutOfStock && (
                  <div className="flex flex-col gap-3">
                    <AddToCartButton
                      lines={
                        selectedVariant
                          ? [
                              {
                                merchandiseId: selectedVariant.id,
                                quantity: quantity,
                                selectedVariant,
                              },
                            ]
                          : []
                      }
                      afterAddedToCart={handleAddToCart}
                      afterAddedToCartText="Added to cart"
                    >
                      Add To Cart
                    </AddToCartButton>
                    {/* <Button
                      className={cn(
                        'rounded-md bg-green-100 px-8 py-3 font-helvetica text-sm font-medium leading-[18px] text-brand-green shadow-none hover:bg-green-100',
                      )}
                    >
                      Buy Now
                    </Button> */}
                  </div>
                )}
                {isOutOfStock && (
                  <div className="flex flex-col gap-3">
                    <Button
                      disabled
                      className="rounded-md bg-green-100 px-8 py-3 font-helvetica text-sm font-medium leading-[18px] text-brand-green shadow-none hover:bg-green-300 disabled:opacity-100"
                    >
                      Sold Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* Badges*/}
            {/* <ProductBadges /> */}
            {/* Metadata (im not mapping over each so i have more control over the accordion data) */}
            <Accordion type="single" collapsible>
              {/* description */}
              <ProductDescriptionMetafield description={description} />
              {filteredMetafields.length > 0 && (
                <>
                  {/* Ingredients */}
                  {filteredMetafields.length > 1 && (
                    <AccordionItem
                      value={filteredMetafields[1]?.id ?? ''}
                      className="w-full border-b border-grey-300 pb-3 last:border-b-0"
                    >
                      <AccordionTrigger className="w-full text-left text-base font-medium text-black hover:no-underline">
                        <p className="max-w-72 md:max-w-full">
                          {formatMetaFieldTitle(filteredMetafields[1]?.key ?? 'ingredients')}
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="w-full rounded-lg border border-grey-300 bg-grey-100 p-4 text-base">
                        <p>{filteredMetafields[1]?.value}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {/* nutritional info */}
                  {filteredMetafields.length > 2 && (
                    <AccordionItem
                      value={filteredMetafields[2]?.id ?? ''}
                      className="w-full border-b border-grey-300 pb-3 last:border-b-0"
                    >
                      <AccordionTrigger className="w-full text-left text-base font-medium text-black hover:no-underline">
                        <p className="max-w-72 md:max-w-full">
                          {formatMetaFieldTitle(filteredMetafields[2]?.key ?? 'nutrional_info')}
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="w-full rounded-lg border border-grey-300 bg-grey-100 p-4 text-base">
                        <RenderNutritionData
                          data={parseNutritionData(filteredMetafields[2]?.value ?? '')}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {/* product of metafield */}
                  <AccordionItem
                    value={filteredMetafields[0]?.id ?? ''}
                    className="w-full border-b border-grey-300 pb-3 last:border-b-0"
                  >
                    <AccordionTrigger className="w-full text-left text-base font-medium text-black hover:no-underline">
                      <p className="max-w-72 md:max-w-full">
                        {formatMetaFieldTitle(filteredMetafields[0]?.key ?? 'product_of')}
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className="w-full rounded-lg border border-grey-300 bg-grey-100 p-4 text-base">
                      <p>{filteredMetafields[0]?.value}</p>
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}
            </Accordion>
          </div>
        </div>
      </div>
      {/* Deferred Reviews Section */}
      <div className="flex flex-col gap-6" id="reviews">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-helvetica text-base font-medium text-black">Reviews</h2>
          <CreateReviewForm productId={product.id} />
        </div>
        <div className="overflow-hidden">
          <Suspense fallback={<ReviewCardSkeleton />}>
            <Await resolve={productReviews}>
              {(reviews) => {
                return reviews.length > 0 ? (
                  <ul
                    role="list"
                    aria-label="Product reviews"
                    className="hide-scrollbars relative z-10 flex w-full flex-row gap-product-row-mobile overflow-x-auto rounded-lg"
                  >
                    {reviews.map((review: any) => (
                      <ReviewCard
                        key={review.id}
                        reviewTitle={review.title}
                        reviewBody={review.body}
                        reviewRating={review.rating}
                        reviewPublishedDate={review.created_at}
                        reviewAuthor={review.reviewer.name}
                        productImage={product.images.nodes[0].url}
                      />
                    ))}
                  </ul>
                ) : null
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Deferred Recommended Products Section */}

      <div className="flex flex-col gap-6">
        <h2 className="font-helvetica text-base font-medium text-black">Recommended to Add</h2>
        <Suspense fallback={<ProductsCardSkeleton products={10} />}>
          <Await resolve={recommendedProducts}>
            {(data) => {
              const products = data?.productRecommendations ?? []
              return <ProductRow rows={5} products={products} />
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  )
}

function ProductDescriptionMetafield({ description }: { description: string }) {
  return (
    <AccordionItem
      value={'description'}
      className="w-full border-b border-grey-300 pb-3 last:border-b-0"
    >
      <AccordionTrigger className="w-full text-left text-base font-medium text-black hover:no-underline">
        <p className="max-w-72 md:max-w-full">Description</p>
      </AccordionTrigger>
      <AccordionContent className="w-full rounded-lg border border-grey-300 bg-grey-100 p-4 text-base">
        <div className="flex flex-col gap-2">
          {formatDescription(description).map((desc, index) => (
            <p key={index} className="font-helvetica text-sm font-regular text-grey-600">
              {desc}
            </p>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function RenderNutritionData({ data }: { data: ParsedNutritionItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {data.map((item) => (
        <div
          key={item.key}
          className="flex w-full items-center justify-between border-b border-grey-300 py-3 font-helvetica text-xs text-grey-600 last-of-type:border-b-0"
        >
          <span>{item.key}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      images(first:4) {
        nodes {
          id
          height
          width
          url
          altText
        }
      }
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
quantityAvailable
    quantityRule {
    increment
    maximum
    minimum
    }
  
  }
` as const

const PRODUCT_HANDLE_FRAGMENT = `#graphql
  fragment ProductDetails on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first:4) {
      nodes {
        id
        height
        width
        url
        altText
      }
    }
    metafields(
      identifiers: [
        {namespace: "custom", key: "product_of"},
        {namespace: "custom", key: "how_to_use"},
        {namespace: "custom", key: "ingredients"},
        {namespace: "custom", key: "nutritional_info"}
      ]
    ) {
      id
      key
      value
    }
      
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 10) {
      nodes {
        ...ProductVariant
      }
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      ...ProductDetails
    }
  }
  ${PRODUCT_HANDLE_FRAGMENT}
` as const

// const PRODUCT_ITEM_FRAGMENT = `#graphql
//   fragment ProductItemDataData on Product {
//     id
//     title
//     publishedAt
//     handle
//     description
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     compareAtPriceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     featuredImage {
//       url
//       altText
//       width
//       height
//     }
//     variants(first: 1) {
//       nodes {
//         selectedOptions {
//           name
//           value
//         }
//         availableForSale
//         price {
//           amount
//           currencyCode
//         }
//         compareAtPrice {
//           amount
//           currencyCode
//         }
//       }
//     }
//     tags
//     availableForSale
//     vendor
//   }
// ` as const

const RECCOMENDED_PRODUCTS_QUERY = `#graphql
  query ReccomendedProducts($handle: String!) {
    productRecommendations(productHandle: $handle, intent: RELATED) {
      ...ProductItemData
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const
