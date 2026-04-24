'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Film, Tv, TrendingUp, BookOpen, Bookmark, User, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Movies', href: '/movies', icon: Film },
  { name: 'TV Shows', href: '/tv', icon: Tv },
  { name: 'Trending', href: '/trending', icon: TrendingUp },
  { name: 'Blogs', href: '/blogs', icon: BookOpen },
  { name: 'Watchlist', href: '/profile?tab=watchlist', icon: Bookmark },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden text-gray-400 hover:text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 glass z-50 flex flex-col md:hidden border-r border-white/10 shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <span className="text-xl font-bold glow-text text-primary uppercase tracking-wider">CineVerse</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)] border border-primary/20" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              <div className="p-4 border-t border-white/10 mt-auto">
                <Link 
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
