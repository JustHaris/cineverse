'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

const ROUTES = ['/', '/movies', '/tv', '/trending', '/profile']

export function AppProvider({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [immersive, setImmersive] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)

  useEffect(() => {
    // Auto-enable immersive mode for detail pages
    const isDetail = pathname.startsWith('/movie/') || pathname.startsWith('/tv/')
    setImmersive(isDetail)
    
    // Smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  const handleSwipe = (direction) => {
    const currentIndex = ROUTES.indexOf(pathname)
    if (currentIndex === -1) return

    if (direction === 'left' && currentIndex < ROUTES.length - 1) {
      router.push(ROUTES[currentIndex + 1])
    } else if (direction === 'right' && currentIndex > 0) {
      router.push(ROUTES[currentIndex - 0])
    }
  }

  return (
    <AppContext.Provider value={{ immersive, setImmersive, handleSwipe, isSwiping, setIsSwiping }}>
      {children}
    </AppContext.Provider>
  )
}
