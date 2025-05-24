import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useAside } from '../Aside'
import { HeaderProps } from '../Header'
import CartToggleBadge from './cart-badge'
import LanguageBadge from './language-badge'
import LocationBadge from './location-badge'
import NotificationBadge from './notification-badge'
import PrimaryLogo from './primary-logo'
import ExpandableSearch from './search-input'
import SignInBadge from './sign-in-badge'

import { useState } from 'react'
import { cn } from '~/lib/utils/utils'
import AnnouncementBar from './announcement-bar'
import { MobileBottomNav } from './mobile-bottom-nav'

export default function MainHeader({ header, isLoggedIn, cart, publicStoreDomain }: HeaderProps) {
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40">
        <HeaderDesktop
          cart={cart}
          header={header}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />

        <HeaderMobile
          cart={cart}
          header={header}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      </header>
      <MobileBottomNav />
    </>
  )
}

// TWO VARIANTS

// Desktop
const HeaderDesktop = ({ header, isLoggedIn, cart, publicStoreDomain }: HeaderProps) => {
  const { shop, menu } = header
  const [hasScrolled, setHasScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0) {
      setHasScrolled(true)
    } else {
      setHasScrolled(false)
    }
  })

  return (
    <motion.div
      className={cn(
        'hidden border-b border-b-grey-300 bg-white md:block',
        hasScrolled && 'bg-white/90 backdrop-blur-sm',
      )}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-[1.625rem] md:gap-8 lg:gap-0 xl:px-16">
        <div className="flex flex-1 flex-row items-center gap-16">
          <div className="h-8 w-20">
            <PrimaryLogo className="h-8 w-20" to="/" />
          </div>
          {/* Search */}
          <ExpandableSearch />
        </div>
        <div className="flex flex-row items-center justify-end gap-3 self-end">
          {/* <LocationBadge /> */}
          {/* <LanguageBadge /> */}
          <CartToggleBadge cart={cart} showLabel />
          <SignInBadge isLoggedIn={isLoggedIn} />
          {/* <NotificationBadge isLoggedIn={isLoggedIn} /> */}
        </div>
      </div>
    </motion.div>
  )
}
// Mobile
const HeaderMobile = ({ header, isLoggedIn, cart, publicStoreDomain }: HeaderProps) => {
  const { shop, menu } = header
  const { type, close, open } = useAside()
  // const isDrawerOpen = type === 'mobile'
  return (
    <div className="border-b border-grey-300 bg-white md:hidden">
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-6 xl:px-16">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-row items-center justify-between gap-[1.71875rem]">
            {/* LOGO + BURGER GROUP */}
            <div className="flex flex-row items-center gap-4">
              <PrimaryLogo to="/" className="aspect-square h-8 w-20" aria-label="Company logo" />
            </div>
            {/* <LanguageBadge showAbbreviation={true} className="px-3 py-[6px]" showLabel={false} /> */}
            <div className="flex flex-row items-center gap-3">
              {/* <LocationBadge
                showLabel={false}
                className="p-[9.4px]"
                iconClassName="w-[14.2px] h-[14.2px]"
              /> */}
              {/* <NotificationBadge
                isLoggedIn={isLoggedIn}
                className="p-[9.4px]"
                iconClassName="w-[14.2px] h-[14.2px]"
              /> */}
              <CartToggleBadge
                className="p-[9.4px]"
                iconClassName="w-[14.2px] h-[14.2px]"
                cart={cart}
                showLabel={false}
              />
              <SignInBadge isLoggedIn={isLoggedIn} showDisplayName={false} className="px-2" />
            </div>
          </div>
          <ExpandableSearch />
        </div>
      </div>
    </div>
  )
}
