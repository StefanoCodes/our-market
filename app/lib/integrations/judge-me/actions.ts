import { AppLoadContext, json } from '@shopify/remix-oxygen'
import { createReviewSchema } from './validations'
import { formatGidToNumericId } from '~/lib/utils/utils'
const BASE_URL = 'https://api.judge.me/api/v1/reviews'
// Create Review
export async function handleCreateReview(
  formData: FormData,
  context: AppLoadContext,
  productId: string | null,
) {
  const validatedData = createReviewSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    title: formData.get('title'),
    body: formData.get('body'),
    rating: formData.get('rating'),
    pictureUrls: formData.get('pictureUrls'),
  })
  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.message,
    }
  }
  const data = validatedData.data
  const requestBody = JSON.stringify({
    name: data.name,
    email: data.email,
    title: data.title,
    body: data.body,
    rating: data.rating,
    pictureUrls: data.pictureUrls,
    id: productId ? formatGidToNumericId(productId) : -1,
    shop_domain: context.env.PUBLIC_STORE_DOMAIN,
    platform: 'shopify',
  })

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Error creating review:', responseData)
      return json({
        success: false,
        error: 'Error creating review',
      })
    }

    return json({
      success: true,
      message: 'Review created successfully',
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return json({
      success: false,
      error: 'Error creating review',
    })
  }
}

// Get Shopify External Product ID

export async function getShopifyExternalProductId(context: AppLoadContext, handle: string) {
  const product = await context.storefront.query(PRODUCT_ID_QUERY, {
    variables: { handle },
  })

  if (!product.product?.id) {
    throw new Response(null, { status: 404 })
  }

  const productId = product.product.id

  return productId
}

// Get Internal Product ID

export async function getInternalProductId(context: AppLoadContext, handle: string) {
  try {
    const productId = await getShopifyExternalProductId(context, handle)
    const formattedProductId = formatGidToNumericId(productId)

    const getJudgeMeInternalProduct = await fetch(
      `https://judge.me/api/v1/products/-1?api_token=${context.env.JUDGE_ME_PRIVATE_KEY}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}&external_id=${formattedProductId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    if (!getJudgeMeInternalProduct.ok) {
      console.error(
        `[Judge.me] Product fetch failed with status: ${getJudgeMeInternalProduct.status}`,
      )
      return []
    }

    const judgeMeInternalProductResponse = await getJudgeMeInternalProduct.json()

    // @ts-ignore

    if (!judgeMeInternalProductResponse.product) {
      console.error('[Judge.me] Product response:', judgeMeInternalProductResponse)
    }
    // @ts-ignore
    const judgeMeInternalProductId = judgeMeInternalProductResponse.product.id

    return judgeMeInternalProductId
  } catch (error) {
    console.error('[Judge.me] Error fetching internal product ID:', error)
    return null
  }
}
// Get Product Reviews
export async function getProductReview(context: AppLoadContext, judgeMeInternalProductId: string) {
  try {
    const response = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${context.env.JUDGE_ME_PRIVATE_KEY}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}&product_id=${judgeMeInternalProductId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      console.error(`[Judge.me] Reviews fetch failed with status: ${response.status}`)
      return []
    }

    const data = await response.json()
    // @ts-ignore
    return data.reviews || []
  } catch (error) {
    console.error('[Judge.me] Error fetching reviews:', error)
    return []
  }
}

// Get Product Reviews
export async function getProductReviews(context: AppLoadContext, productId: string) {
  try {
    const judgeMeInternalProductId = await getInternalProductId(context, productId)

    if (!judgeMeInternalProductId) {
      console.error('[Judge.me] Internal product ID not found')
      return []
    }

    const productReviews = await getProductReview(context, judgeMeInternalProductId)

    if (productReviews.length === 0) {
      console.error('[Judge.me] No reviews found for product')
      return []
    }

    return productReviews
  } catch (error) {
    console.error('Something went wrong while getting product reviews', error)
    return []
  }
}
// get Product Reviews Count
export async function getProductReviewsCount(context: AppLoadContext, productId: string) {
  try {
    const productReviews = await getProductReviews(context, productId)
    const reviewCount = productReviews.length
    const averageStarRating =
      productReviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviewCount

    if (!reviewCount) {
      console.error('[Judge.me] Internal product ID not found')
      return {
        count: 0,
        averageStarRating: 0,
      }
    }

    return {
      count: reviewCount,
      averageStarRating,
    }
  } catch (error) {
    console.error('Something went wrong while getting product reviews', error)
    return {
      count: 0,
      averageStarRating: 0,
    }
  }
}

const PRODUCT_ID_QUERY = `#graphql
  query ProductId($handle: String!) {
    product(handle: $handle) {
      id
    }
  }
` as const
