'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Bell, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'

export default function Navbar() {
  const { immersive } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  // Auto-hide on mobile scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      if (current < 60) { setVisible(true); setLastScrollY(current); return }
      setVisible(current < lastScrollY)
      setLastScrollY(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, router])

  // ✅ ALL hooks are called above — safe to early-return after this point
  if (pathname.startsWith('/admin')) return null
  if (immersive) return null

  return (
    <nav className={`fixed top-0 right-0 z-40 w-full md:w-[calc(100%-16rem)] p-4 flex items-center justify-between glass md:bg-transparent md:backdrop-blur-none md:border-none transition-all duration-300 ${
      visible ? 'translate-y-0 opacity-100' : 'md:translate-y-0 md:opacity-100 -translate-y-full opacity-0'
    }`}>
      {/* Mobile logo */}
      <div className="md:hidden flex items-center">
        <Link href="/">
          <span className="text-xl font-bold glow-text text-primary uppercase">CineVerse</span>
        </Link>
      </div>

      {/* Desktop search */}
      <div className="flex-1 flex justify-end md:justify-between items-center md:px-4">
        <form onSubmit={e => e.preventDefault()} className="hidden md:flex items-center gap-4 flex-1 max-w-md relative">
          <Search className="w-5 h-5 absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search movies, TV shows..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-gray-500"
          />
        </form>

        {/* Right controls */}
        <div className="flex items-center gap-5 ml-auto">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-400 hover:text-white transition-colors relative p-1"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,1)]" />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 glass p-4 rounded-2xl border border-white/10 shadow-2xl z-50"
                >
                  <h3 className="text-white font-bold mb-3 pb-2 border-b border-white/10">Notifications</h3>
                  <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <p className="text-sm text-white font-medium">Welcome to CineVerse! 🦇</p>
                      <p className="text-xs text-gray-400 mt-1">Enjoy the premium cinematic experience.</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <p className="text-sm text-white font-medium">Trending Now</p>
                      <p className="text-xs text-gray-400 mt-1">Check out the latest blockbusters added today.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-box">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}
