import { json, LoaderFunctionArgs, redirect } from '@remix-run/server-runtime'
import { useEffect, useState } from 'react'
import { CartLineFragment } from 'storefrontapi.generated'
import CheckoutFlow from '~/components/features/Checkout/checkout'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { MarketingSubscribeModal } from '~/lib/integrations/klaviyo/components/modal-popup'
import { profileEmail } from '~/lib/integrations/klaviyo/constants'
import { trackKlaviyoEvent } from '~/lib/integrations/klaviyo/events/tracking-events'
// import { KlaviyoTracking } from '~/lib/integrations/klaviyo/events/tracking-events'
import { useRootLoaderData } from '~/root'
export async function loader({ context, request }: LoaderFunctionArgs) {
  // block users from coming here for now
  return json('Not Allowed', { status: 405 })

  // const { cart } = context

  // const cartData = await cart.get()

  // if (!cartData) {
  //   return redirect('/')
  // }
  // const isLoggedIn = await context.customerAccount.getAccessToken()
  // if (isLoggedIn) {
  //   const customer = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)
  //   if (customer.data.customer.id) {
  //     await trackKlaviyoEvent(
  //       context.env.KLAVIYO_PRIVATE_KEY,
  //       '/checkout',
  //       'Checkout Started',
  //       request,
  //       {
  //         cartId: cartData.id,
  //         cartTotal: cartData.cost.totalAmount.amount,
  //         itemCount: cartData.totalQuantity,
  //         items: cartData.lines.nodes.map((line: CartLineFragment) => ({
  //           productId: line.merchandise.product.id,
  //           productName: line.merchandise.product.title,
  //           quantity: line.quantity,
  //           price: line.cost.totalAmount.amount,
  //           imageUrl: line.merchandise.image?.url,
  //           productUrl: line.merchandise.product.handle,
  //           vendor: line.merchandise.product.vendor,
  //         })),
  //       },
  //       // this will need to be the customer email
  //       customer.data.customer.emailAddress?.emailAddress ?? '',
  //     )
  //   }
  // }

  // return json({
  //   cart: cartData,
  // })
}
// load the cart from the root loader
// export default function Checkout() {
//   const data = useRootLoaderData()
//   if (!data) return null
//   const cart = data.cart
//   const customer = data.customer?.data.customer

//   const [showSubscribeModal, setShowSubscribeModal] = useState(false)

//   useEffect(() => {
//     // set the timer for 5 seconds and show the modal
//     setTimeout(() => {
//       setShowSubscribeModal(true)
//     }, 5000)
//   }, [])
//   return (
//     <>
//       <MarketingSubscribeModal
//         show={showSubscribeModal}
//         setShow={setShowSubscribeModal}
//         customer={customer ?? null}
//       />
//       <CheckoutFlow />
//     </>
//   )
// }
