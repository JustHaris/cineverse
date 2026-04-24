'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * PageTransition — Native app-like transitions using Framer Motion.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  // Admin pages: NO wrapper div, NO transform — fixed positioning works correctly
  if (isAdmin) return <>{children}</>

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

