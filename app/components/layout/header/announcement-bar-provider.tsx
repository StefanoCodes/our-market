import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type AnnouncementBarContextValue = {
  isVisible: boolean
  show: () => void
  hide: () => void
  toggle: () => void
}

const AnnouncementBarContext = createContext<AnnouncementBarContextValue | null>(null)

export function AnnouncementBarProvider({
  children,
  hideAnnouncementBar,
}: {
  children: ReactNode
  hideAnnouncementBar: boolean
}) {
  const [isVisible, setIsVisible] = useState(hideAnnouncementBar ? false : true)

  const value = {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible((prev) => !prev),
  }

  return <AnnouncementBarContext.Provider value={value}>{children}</AnnouncementBarContext.Provider>
}

export function useAnnouncementBar() {
  const context = useContext(AnnouncementBarContext)
  if (!context) {
    throw new Error('useAnnouncementBar must be used within an AnnouncementBarProvider')
  }
  return context
}
