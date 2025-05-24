import { motion, AnimatePresence } from 'motion/react'
import { X, Menu } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '~/lib/utils/utils'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'left' | 'right'
  width?: string
  className?: string
}

const MobileDrawer = ({
  isOpen,
  onClose,
  children,
  position = 'left',
  width = '80vw',
  className = '',
}: MobileDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus()
    }
  }, [isOpen])

  const drawerVariants = {
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
      {isOpen && (
        <>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 top-[var(--store-full-header-height-desktop)] z-[60] bg-black/15 bg-opacity-50 backdrop-blur-[2px] backdrop-filter"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className={cn(
              `fixed top-[var(--store-full-header-height-desktop)] z-[70] bg-white ${
                position === 'left' ? 'left-0' : 'right-0'
              } h-[calc(100dvh-var(--store-full-header-height-desktop))] overflow-y-auto shadow-lg lg:h-[calc(100dvh-var(--store-full-desktop-header))]`,
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile drawer"
            tabIndex={-1}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileDrawer
