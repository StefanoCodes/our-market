import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { cn } from '~/lib/utils/utils'
// import { useOnboarding } from '../features/Onboarding/onboarding-provider'
import { useAnnouncementBar } from './header/announcement-bar-provider'

type AsidePosition = 'left' | 'right'
type AsideType = 'mobile' | 'search' | 'cart' | 'closed' | 'account'

interface AsideContextValue {
  type: AsideType
  open: (type: AsideType) => void
  close: () => void
}

interface AsideProps {
  children: ReactNode
  type: AsideType
  position?: AsidePosition
  className?: string
}

const AsideContext = createContext<AsideContextValue | null>(null)

export function Aside({ children, type, position = 'left', className = '' }: AsideProps) {
  const { type: activeType, close } = useAside()
  // const { isOpen: isOnboardingOpen } = useOnboarding()
  const expanded = type === activeType
  const asideRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const [hasScrolled, setHasScrolled] = useState(false)
  const { isVisible } = useAnnouncementBar()

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.03) {
      setHasScrolled(true)
    } else {
      setHasScrolled(false)
    }
  })

  // close the aside if the onboarding is open
  // useEffect(() => {
  //   if (isOnboardingOpen && expanded) {
  //     close()
  //   }
  // }, [isOnboardingOpen, expanded, close])

  useEffect(() => {
    if (!expanded) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded) {
        close()
      }
    }

    if (expanded) {
      document.documentElement.style.scrollbarGutter = 'stable'
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.scrollbarGutter = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [expanded, close])

  useEffect(() => {
    if (expanded && asideRef.current) {
      asideRef.current.focus()
    }
  }, [expanded])

  const asideVariants = {
    closed: {
      x: position === 'left' ? '-100%' : '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <AnimatePresence>
      {expanded && (
        <>
          {/* overlay in the bg */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className={cn(
              'fixed inset-0 top-[6.7rem] z-[60] bg-black/15 bg-opacity-50 backdrop-blur-[2px] backdrop-filter md:top-[var(--store-full-header-height-desktop)]',
              hasScrolled && 'top-[5rem] md:top-[6.5rem]',
              !isVisible && 'top-[5rem] md:top-[6.5rem]',
            )}
            onClick={close}
            aria-hidden="true"
          />
          {/* the content container  */}
          <motion.div
            ref={asideRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={asideVariants}
            className={cn(
              `fixed bottom-0 top-[6.7rem] z-[100] bg-white md:top-[var(--store-full-header-height-desktop)]`,
              className,
              position === 'left' ? 'left-0' : 'right-0',
              hasScrolled && 'top-[5rem] md:top-[6.5rem]',
              !isVisible && 'top-[5rem] md:top-[6.5rem]',
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Aside Drawer"
            tabIndex={-1}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Provider Component and Hook remain the same
Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed')

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  )
}

export function useAside() {
  const aside = useContext(AsideContext)
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider')
  }
  return aside
}
