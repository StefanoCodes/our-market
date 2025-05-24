import { NavLink, Outlet } from '@remix-run/react'

const accountNavLinks = [
  {
    title: 'Profile',
    to: '/account/profile',
  },
  {
    title: 'Preferences',
    to: '/account/preferences',
  },
  // {
  //   title: 'Security',
  //   to: '/customer/security',
  // },
]

export const AccountNavLinks = () => {
  return (
    <>
      {accountNavLinks.map((link) => (
        <NavLink
          key={link.title}
          className={({ isActive }) =>
            isActive
              ? 'flex-1 border-b-2 border-b-brand-green pb-3 text-sm text-brand-green lg:flex-none'
              : 'flex-1 pb-3 text-sm lg:flex-none'
          }
          to={link.to}
          preventScrollReset={true}
        >
          {link.title}
        </NavLink>
      ))}
    </>
  )
}

export default function AccountLayout() {
  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 pb-[4.25rem] pt-6 lg:gap-8 lg:pt-12 xl:px-16">
      <div className="flex flex-col gap-6">
        <h2 className="mb-2 font-helvetica text-md font-medium text-black">Account Details</h2>
        <div className="w-full border-b border-grey-400">
          <div className="flex flex-row gap-3">
            <AccountNavLinks />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
