import { NavLink, Outlet } from '@remix-run/react'

// layout for current orders and past orders top bar & orders heading
export default function OrdersLayout() {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 pb-[4.25rem] pt-6 lg:gap-8 lg:pt-12 xl:px-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-helvetica text-md font-medium text-black">Orders</h2>
        <div className="w-full border-b border-grey-400">
          <div className="flex flex-row gap-3">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'border-b-2 border-b-brand-green pb-3 text-brand-green' : 'pb-3'
              }
              to="/account/orders/current"
              preventScrollReset={true}
            >
              Current Orders
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'border-b-2 border-b-brand-green pb-3 text-brand-green' : 'pb-3'
              }
              to="/account/orders/past"
              preventScrollReset={true}
            >
              Past Orders
            </NavLink>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
