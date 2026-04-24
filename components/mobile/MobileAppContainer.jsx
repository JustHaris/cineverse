'use client'

import { useApp } from '@/context/AppContext'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

const ROUTES = ['/', '/movies', '/tv', '/trending', '/profile']

export default function MobileAppContainer({ children }) {
  const { setIsSwiping } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef(null)
  const x = useMotionValue(0)
  const [touchStart, setTouchStart] = useState(null)
  
  // Swipe sensitivity
  const threshold = 120
  const dragFactor = 0.5 

  const isMainRoute = ROUTES.includes(pathname)
  
  useEffect(() => {
    const el = containerRef.current
    if (!el || !isMainRoute) return

    const onStart = (e) => {
      if (e.target.closest('.no-swipe')) return
      setTouchStart({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY,
        time: Date.now() 
      })
    }

    const onMove = (e) => {
      if (!touchStart) return
      const diffX = e.touches[0].clientX - touchStart.x
      const diffY = e.touches[0].clientY - touchStart.y
      
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        setIsSwiping(true)
        x.set(diffX * dragFactor)
        // Prevent browser back/forward gestures while swiping
        if (e.cancelable) e.preventDefault()
      }
    }

    const onEnd = (e) => {
      if (!touchStart) return
      const diffX = e.changedTouches[0].clientX - touchStart.x
      const duration = Date.now() - touchStart.time
      
      const isFlick = Math.abs(diffX) > 50 && duration < 250
      const crossedThreshold = Math.abs(diffX) > threshold

      if (isFlick || crossedThreshold) {
        const currentIndex = ROUTES.indexOf(pathname)
        if (diffX < 0 && currentIndex < ROUTES.length - 1) {
          router.push(ROUTES[currentIndex + 1])
        } else if (diffX > 0 && currentIndex > 0) {
          router.push(ROUTES[currentIndex - 1])
        }
      }
      
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
      setTouchStart(null)
      setTimeout(() => setIsSwiping(false), 300)
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [touchStart, isMainRoute, pathname, router, setIsSwiping, x])

  return (
    <div 
      ref={containerRef}
      className="relative overflow-x-hidden min-h-screen touch-pan-y"
    >
      <motion.div style={{ x }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}
