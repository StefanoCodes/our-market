import { createContext, useContext, useState, type ReactNode } from 'react'

type MobileBottomNavContextValue = {
  isVisible: boolean
  show: () => void
  hide: () => void
  toggle: () => void
}

const MobileBottomNavContext = createContext<MobileBottomNavContextValue | null>(null)

export function MobileBottomNavProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)

  const value = {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible((prev) => !prev),
  }

  return <MobileBottomNavContext.Provider value={value}>{children}</MobileBottomNavContext.Provider>
}

export function useMobileBottomNav() {
  const context = useContext(MobileBottomNavContext)
  if (!context) {
    throw new Error('useMobileBottomNav must be used within a MobileBottomNavProvider')
  }
  return context
}
