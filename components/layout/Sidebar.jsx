'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Film, Tv, TrendingUp, BookOpen, Bookmark, User, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsAdmin } from '@/hooks/useIsAdmin'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  // alsoActive: matches /movie/[id] detail pages in addition to /movies list
  { name: 'Movies', href: '/movies', icon: Film, alsoActive: ['/movie/'] },
  // alsoActive: matches /tv/[id] detail pages in addition to /tv list
  { name: 'TV Shows', href: '/tv', icon: Tv, alsoActive: ['/tv/'] },
  { name: 'Trending', href: '/trending', icon: TrendingUp },
  { name: 'Blogs', href: '/blogs', icon: BookOpen },
  { name: 'Watchlist', href: '/profile', icon: Bookmark },
]

function isNavActive(pathname, href, alsoActive = []) {
  if (href === '/') return pathname === '/'
  const hrefPath = href.split('?')[0]
  // Exact match or starts with href/
  if (pathname === hrefPath || pathname.startsWith(hrefPath + '/')) return true
  // Also check alsoActive patterns (e.g. /movie/ for the Movies nav item)
  return alsoActive.some(pattern => pathname.startsWith(pattern))
}

export default function Sidebar() {
  const pathname = usePathname()
  const isAdmin = useIsAdmin()

  // ✅ Hook called above — safe to conditionally return
  if (pathname.startsWith('/admin')) return null

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 glass hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold glow-text text-primary uppercase tracking-wider">CineVerse</span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = isNavActive(pathname, item.href, item.alsoActive)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)] border border-primary/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-white/5 space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              pathname.startsWith('/admin')
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:text-primary hover:bg-primary/5"
            )}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium text-sm">Admin Panel</span>
          </Link>
        )}
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
            pathname === '/profile'
              ? "bg-primary/10 text-primary"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </Link>
      </div>
    </aside>
  )
}
