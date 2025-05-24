import { NavLink, useLocation } from '@remix-run/react'
// import { useOnboarding } from '~/components/features/Onboarding/onboarding-provider'
import { navLinks } from '~/lib/constants/store'
import { cn } from '~/lib/utils/utils'
import { useAside } from '../Aside'
import { useMobileBottomNav } from './mobile-bottom-nav-provider'

export function MobileBottomNav() {
  const location = useLocation()
  const { close, open: isAsideOpen, type: activeType } = useAside()
  // const { isOpen: isOnboardingOpen } = useOnboarding()
  const { isVisible, toggle, hide } = useMobileBottomNav()

  const toggleAside = () => {
    if (activeType === 'account') {
      close()
    } else {
      isAsideOpen('account')
    }
  }
  const customerPath = '/account'

  if (!isVisible) return null

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 z-[200] w-full border-t border-grey-300 bg-white pb-[env(safe-area-inset-bottom)] transition-transform duration-1000 md:hidden',
        // isOnboardingOpen && 'translate-y-full',
        activeType !== 'closed' && 'translate-y-full',
        activeType === 'account' && 'translate-y-0',
      )}
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        {navLinks.map(({ path, icon: Icon, label }) => {
          const isAccountActive = path === customerPath && activeType === 'account'
          const isActive =
            path === customerPath
              ? isAccountActive
              : location.pathname === path && activeType !== 'account'

          return (
            <NavLink
              key={path}
              to={path}
              prefetch="intent"
              className={({ isActive: _isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 font-inter',
                  isActive ? 'text-brand-green' : 'text-grey-800',
                )
              }
              onClick={(e) => {
                if (path === customerPath) {
                  e.preventDefault()
                  toggleAside()
                  return
                }
                close()
              }}
            >
              <Icon
                className="h-5 w-5"
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 1.5 : 2}
              />
              <span className="font-inter text-xs font-medium">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
