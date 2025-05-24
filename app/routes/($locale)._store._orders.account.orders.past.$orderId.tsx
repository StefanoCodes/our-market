import { useLoaderData } from '@remix-run/react'
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { OrderOverview } from '~/components/features/Orders/order-overview'
import { CUSTOMER_ORDER_QUERY } from '~/graphql/customer-account/CustomerOrderQuery'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { orderId } = params

  if (!orderId) {
    throw new Response('Not Found', { status: 404 })
  }
  const { data, errors } = await context.customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {
      orderId: `gid://shopify/Order/${orderId}`,
    },
  })
  if (errors?.length || !data?.order) {
    throw Error('Order not found')
  }
  return json({
    order: data.order,
  })
}

export default function Order() {
  const { order } = useLoaderData<typeof loader>()

  return <OrderOverview order={order} />
}
