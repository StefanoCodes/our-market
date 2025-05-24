import { NavLink } from '@remix-run/react'
import { CurrentOrdersQuery, PastOrdersQuery } from 'customer-accountapi.generated'
import { cn } from '~/lib/utils/utils'

interface OrderItemProps {
  order:
  | PastOrdersQuery['customer']['orders']['nodes'][0]
  | CurrentOrdersQuery['customer']['orders']['nodes'][0]
  type: 'current' | 'past'
}

export default function OrderItem({ order, type }: OrderItemProps) {
  const formatOrderId = (id: string) => id.split('/').pop()
  const orderHandle = `/orders/${type}/${formatOrderId(order.id)}`
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status

  const orderStatus = getOrderStatus(fulfillmentStatus)

  return (
    <div className="flex flex-col gap-3">
      <NavLink
        preventScrollReset={true}
        className={({ isActive }) =>
          cn(
            'block h-full rounded-br-lg rounded-tr-lg border-l-2 p-4',
            isActive ? 'border-l-brand-green bg-green-100' : 'border-l-white',
          )
        }
        to={orderHandle}
        end
        prefetch="intent"
        viewTransition
      >
        <div className="flex h-full flex-row items-center justify-between">
          {/* order details */}
          <div className="flex flex-col gap-1">
            <p className="font-helvetica text-xs font-medium tracking-[-0.02em] text-grey-700">
              {order.name}
            </p>
            <h3 className="font-helvetica text-base font-bold text-[#292D32]">
              {order.lineItems.nodes.map((item) => item.title).join(', ')}
            </h3>
            <div className="flex flex-row items-center gap-1">
              <p className="font-helvetica text-xs font-regular text-grey-600">
                {order.lineItems.nodes.length} Items/Products
              </p>
              <span className="h-1 w-1 rounded-full bg-grey-600" />
              <p className="font-helvetica text-xs font-regular text-grey-600">
                ${order.totalPrice.amount}
              </p>
            </div>
          </div>

          <p className={cn('self-start font-helvetica text-xs font-medium', orderStatus.color)}>
            {orderStatus.label}
          </p>
        </div>
      </NavLink>

      <span className="w-full border-b border-grey-300" />
    </div>
  )
}

function getOrderStatus(status: string | undefined | null) {
  switch (status?.toString()) {
    case 'SUCCESS':
      return { label: 'Completed', color: 'text-brand-green' }
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'text-yellow-600' }
    case 'PARTIALLY_FULFILLED':
      return { label: 'Partially Fulfilled', color: 'text-yellow-600' }
    default:
      return { label: 'Processing', color: 'text-grey-700' }
  }
}
