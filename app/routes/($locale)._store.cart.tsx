import { type MetaFunction } from '@remix-run/react'
import type { CartQueryDataReturn } from '@shopify/hydrogen'
import { CartForm } from '@shopify/hydrogen'
import { type ActionFunctionArgs, json } from '@shopify/remix-oxygen'
import { CartLineFragment } from 'storefrontapi.generated'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { trackKlaviyoEvent } from '~/lib/integrations/klaviyo/events/tracking-events'

export const meta: MetaFunction = () => {
  return [{ title: `Our Market | Cart` }]
}

export async function loader() {
  return json('Not Allowed', { status: 405 })
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart, customerAccount } = context

  const cartData = await cart.get()

  const formData = await request.formData()
  const { action, inputs } = CartForm.getFormInput(formData)

  if (!action) {
    throw new Error('No action provided')
  }

  let status = 200
  let result: CartQueryDataReturn

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines)
      // track klaviyo event
      const isLoggedIn = await customerAccount.getAccessToken()
      if (isLoggedIn) {
        const customer = await customerAccount.query(CUSTOMER_DETAILS_QUERY)
        await trackKlaviyoEvent(
          context.env.KLAVIYO_PRIVATE_KEY,
          '/',
          'Product Added to Cart',
          request,
          {
            cartId: cartData?.id,
            cartTotal: cartData?.cost.totalAmount.amount,
            itemCount: cartData?.totalQuantity,
            startedAt: cartData?.createdAt ?? new Date().toISOString(),
            lastModified: cartData?.updatedAt ?? new Date().toISOString(),
            currency: cartData?.cost.totalAmount.currencyCode,
            items: cartData?.lines.nodes.map((line: CartLineFragment) => ({
              id: line.merchandise.id,
              name: line.merchandise.product.title,
              price: line.merchandise.price.amount,
              quantity: line.quantity,
              variantId: line.merchandise.id,
              variantTitle: line.merchandise.product.title,
              productUrl: `${request.url}products/${line.merchandise.product.handle}`,
            })),
          },
          customer.data.customer.emailAddress?.emailAddress ?? '',
        )
      }
      break
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines)
      break
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds)
      break
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = formData.get('discountCode')

      // User inputted discount code
      const discountCodes = (formDiscountCode ? [formDiscountCode] : []) as string[]

      // is the discount code valid?
      // const isDiscountCodeValid = await cart.(discountCodes[0])

      // Combine with discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes)

      result = await cart.updateDiscountCodes(discountCodes)
      break
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode

      // User inputted gift card code
      const giftCardCodes = (formGiftCardCode ? [formGiftCardCode] : []) as string[]

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes)

      result = await cart.updateGiftCardCodes(giftCardCodes)
      break
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      })
      break
    }
    default:
      throw new Error(`${action} cart action is not defined`)
  }

  const cartId = result?.cart?.id
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers()
  const { cart: cartResult, errors, warnings } = result

  const redirectTo = formData.get('redirectTo') ?? null
  if (typeof redirectTo === 'string') {
    status = 303
    headers.set('Location', redirectTo)
  }

  return json(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    { status, headers },
  )
}
