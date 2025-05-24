import { Outlet, useLoaderData } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import { json, LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen'
import { CurrentOrdersQuery } from 'customer-accountapi.generated'
import NoOders from '~/components/features/Orders/no-orders'
import OrderItem from '~/components/features/Orders/order-item'
import { CUSTOMER_CURRENT_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrderQuery'

export const meta: MetaFunction = () => {
  return [{ title: 'Current Orders' }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  })

  const { data, errors } = await context.customerAccount.query(CUSTOMER_CURRENT_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  })

  // filter the orders based on the fulfillment status
  const filteredOrders = data?.customer.orders.nodes.filter((order) => {
    // Check if order has fulfillments
    if (!order.fulfillments?.nodes?.length) return true

    // Check if any fulfillment has SUCCESS status
    return !order.fulfillments.nodes.some((fulfillment) => fulfillment?.status === 'SUCCESS')
  })

  if (errors?.length || !data?.customer) {
    throw Error('Current orders not found')
  }

  return json({ orders: filteredOrders })
}

export default function CurrentOrders() {
  const data = useLoaderData<{ orders: CurrentOrdersQuery['customer']['orders']['nodes'] }>()
  if (!data) return null
  const orders = data?.orders

  const hasOrders = orders?.length > 0

  return (
    <div className="flex flex-col gap-8 xl:flex-row">
      <div className="mx-auto min-h-[1000px] w-full max-w-2xl flex-1 rounded-2xl bg-white pt-24 lg:pt-0 xl:mx-0 xl:max-w-[528px]">
        {hasOrders ? (
          <div className="flex flex-col gap-4 px-8 py-6">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} type="past" />
            ))}
          </div>
        ) : (
          <NoOders />
        )}
      </div>
      <div className="mx-auto min-h-[500px] w-full max-w-2xl flex-1 rounded-2xl bg-white pt-12 lg:pt-0">
        <Outlet />
      </div>
    </div>
  )
}
