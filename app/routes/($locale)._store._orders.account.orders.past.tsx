import { Outlet, useLoaderData } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import { json, LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen'
import { CUSTOMER_PAST_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrderQuery'
import NoOders from '~/components/features/Orders/no-orders'
import OrderItem from '~/components/features/Orders/order-item'
import { PastOrdersQuery } from 'customer-accountapi.generated'

export const meta: MetaFunction = () => {
  return [{ title: 'Past Orders' }]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  })

  const { data, errors } = await context.customerAccount.query(CUSTOMER_PAST_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  })

  // filter the orders based on the fulfillment status
  const filteredOrders = data?.customer.orders.nodes.filter((order) => {
    if (order.fulfillments?.nodes?.length) return true
    return order.fulfillments.nodes.some((fulfillment) => fulfillment?.status === 'SUCCESS')
  })

  if (errors?.length || !data?.customer) {
    throw Error('Past orders not found')
  }

  return json({ orders: filteredOrders })
}

export default function PastOrders() {
  const data = useLoaderData<{ orders: PastOrdersQuery['customer']['orders']['nodes'] }>()
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
