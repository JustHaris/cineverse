'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Film, Tv, Search, User, MoreHorizontal, BookOpen, Bookmark, Shield, X, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useApp } from '@/context/AppContext'
import { motion } from 'framer-motion'

const mainNav = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search, isSearch: true },
  { name: 'Movies', href: '/movies', icon: Film, alsoActive: ['/movie/'] },
  { name: 'TV', href: '/tv', icon: Tv, alsoActive: ['/tv/'] },
  { name: 'Profile', href: '/profile', icon: User },
]

function isNavActive(pathname, href, alsoActive = []) {
  if (href === '/') return pathname === '/'
  const hrefPath = href.split('?')[0]
  if (pathname === hrefPath || pathname.startsWith(hrefPath + '/')) return true
  return alsoActive.some(pattern => pathname.startsWith(pattern))
}

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = useIsAdmin()
  const { immersive } = useApp()
  const [showMore, setShowMore] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Hide on admin pages or immersive mode
  if (pathname.startsWith('/admin') || immersive) return null

  const closeAll = () => { setShowSearch(false); setShowMore(false) }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      closeAll()
      setSearchQuery('')
    }
  }

  // More drawer items — Admin Panel only for admin users
  const moreNav = [
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Blogs', href: '/blogs', icon: BookOpen },
    { name: 'Watchlist', href: '/profile', icon: Bookmark },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: Shield }] : []),
  ]

  return (
    <>
      {/* Backdrop */}
      {(showMore || showSearch) && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={closeAll} />
      )}

      {/* ── Fullscreen Search Overlay ── */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <form onSubmit={handleSearch} className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows..."
                  className="w-full bg-white/10 border border-white/15 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-base focus:outline-none focus:border-primary/60"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-primary text-black font-bold rounded-2xl">Go</button>
            </form>
            <button onClick={closeAll} className="text-gray-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <Search className="w-14 h-14 mx-auto mb-3 opacity-25" />
              <p className="text-sm">Type to search movies &amp; TV shows</p>
            </div>
          </div>
        </div>
      )}

      {/* ── More Drawer ── */}
      <div className={cn(
        "md:hidden fixed bottom-16 left-0 w-full z-50 transition-all duration-300 ease-in-out px-3",
        showMore ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"
      )}>
        <div className="bg-[#181818] border border-white/10 rounded-2xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-sm">More</span>
            <button onClick={() => setShowMore(false)} className="text-gray-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className={`grid gap-2 ${moreNav.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {moreNav.map((item) => {
              const isActive = isNavActive(pathname, item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeAll}
                  className={cn(
                    "flex flex-col items-center gap-2 px-2 py-3 rounded-xl transition-all duration-200 border",
                    isActive
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium text-center leading-none">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-black/95 border-t border-white/10 backdrop-blur-xl pb-safe">
        <div className="flex justify-around items-center h-16 px-1">
          {mainNav.map((item) => {
            const isSearch = !!item.isSearch
            const isActive = isSearch ? showSearch : isNavActive(pathname, item.href, item.alsoActive)
            
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (isSearch) {
                    setShowSearch(s => !s)
                    setShowMore(false)
                  } else {
                    closeAll()
                    router.push(item.href)
                  }
                }}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 group relative outline-none"
              >
                <div className="relative flex flex-col items-center transition-all duration-300">
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    isActive 
                      ? "text-primary scale-110 -translate-y-1.5 drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]" 
                      : "text-gray-500 opacity-60 group-hover:opacity-100 group-active:scale-90"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold transition-all duration-300",
                    isActive 
                      ? "text-primary scale-105 opacity-100" 
                      : "text-gray-500 opacity-60 group-active:scale-90"
                  )}>
                    {item.name}
                  </span>
                  
                  {/* Active Indicator Pulse */}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#EAB308]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </div>
              </button>
            )
          })}

          {/* More */}
          <button
            onClick={() => { setShowMore(s => !s); setShowSearch(false) }}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 group relative outline-none"
          >
            <div className="relative flex flex-col items-center transition-all duration-300">
              <MoreHorizontal className={cn(
                "w-5 h-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]", 
                showMore 
                  ? "text-primary scale-110 -translate-y-1.5 drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]" 
                  : "text-gray-500 opacity-60 group-hover:opacity-100 group-active:scale-90"
              )} />
              <span className={cn(
                "text-[10px] font-bold transition-all duration-300", 
                showMore ? "text-primary" : "text-gray-500 opacity-60"
              )}>More</span>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
