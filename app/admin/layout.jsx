'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import {
  LayoutDashboard, Activity, Film,
  Shield, LogOut, TrendingUp, BarChart2, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNav = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Activity', href: '/admin/activity', icon: Activity },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { name: 'Content', href: '/admin/content', icon: Film },
  { name: 'API', href: '/admin/api-stats', icon: TrendingUp },
]

function isActive(pathname, href) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
}

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    async function verify() {
      if (!user) { router.replace('/login?redirect=/admin'); return }
      try {
        const token = await auth.currentUser.getIdToken()
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setStatus(data.isAdmin ? 'authorized' : 'unauthorized')
        if (!data.isAdmin) setTimeout(() => router.replace('/'), 2500)
      } catch {
        setStatus('unauthorized')
        router.replace('/')
      }
    }
    if (!loading) verify()
  }, [user, loading, router])

  // ── Loading ──────────────────────────────────────────────
  if (loading || status === 'loading') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#0a0a0a', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Shield style={{ width: 56, height: 56, color: '#EAB308', margin: '0 auto 16px' }} className="animate-pulse" />
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Verifying Admin Access...</p>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>CineVerse Control Panel</p>
        </div>
      </div>
    )
  }

  // ── Unauthorized ─────────────────────────────────────────
  if (status === 'unauthorized') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#0a0a0a', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Shield style={{ width: 56, height: 56, color: '#ef4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Access Denied</p>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>You don&apos;t have admin privileges.</p>
        </div>
      </div>
    )
  }

  // ── Authorized — inline styles to bypass ALL Tailwind layout ─────────────
  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0, left: 0,
      zIndex: 200,
      background: '#0a0a0a',
      display: 'flex',
      overflow: 'hidden',
    }}>

      {/* ════ DESKTOP SIDEBAR (md+) ════ */}
      <aside className="hidden md:flex" style={{
        width: 256, flexShrink: 0,
        background: '#111', borderRight: '1px solid rgba(255,255,255,0.05)',
        flexDirection: 'column', height: '100%',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: '#EAB308',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(234,179,8,0.3)', flexShrink: 0
            }}>
              <Shield style={{ width: 18, height: 18, color: '#000' }} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, margin: 0 }}>CineVerse</p>
              <p style={{ color: '#EAB308', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', margin: 0 }}>ADMIN PANEL</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
          {adminNav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group mb-1",
                  active
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-yellow-400" : "text-gray-500 group-hover:text-gray-300")} />
                {item.name}
                {active && <ChevronRight className="w-3 h-3 ml-auto text-yellow-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: 8
          }}>
            <p style={{ color: '#4b5563', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Admin</p>
            <p style={{ color: '#fff', fontSize: 11, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 text-sm transition-colors">
            <LogOut style={{ width: 14, height: 14 }} /> Back to Platform
          </Link>
        </div>
      </aside>

      {/* ════ CONTENT AREA ════ */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', minWidth: 0,
      }}>
        {/* ── Mobile Top Navbar — Tailwind classes control display so md:hidden works ── */}
        <div className="md:hidden flex items-center justify-between flex-shrink-0" style={{
          padding: '0 16px', height: 52,
          background: '#111',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Left: CineVerse brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, background: '#EAB308',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(234,179,8,0.35)',
            }}>
              <Shield style={{ width: 15, height: 15, color: '#000' }} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: 0, letterSpacing: '-0.3px' }}>CineVerse</p>
              <p style={{ color: '#EAB308', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', margin: 0 }}>ADMIN PANEL</p>
            </div>
          </div>

          {/* Right: current section + exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              color: '#6b7280', fontSize: 11, fontWeight: 500,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '3px 10px',
            }}>
              {adminNav.find(n => isActive(pathname, n.href))?.name || 'Admin'}
            </span>
            <Link href="/" style={{
              color: '#6b7280', fontSize: 11, display: 'flex',
              alignItems: 'center', gap: 4, textDecoration: 'none',
            }}>
              <LogOut style={{ width: 13, height: 13 }} /> Exit
            </Link>
          </div>
        </div>

        {/* Scrollable page content */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '16px',
          paddingBottom: '100px', // space for mobile bottom tab bar
        }} className="md:p-8 md:pb-8">
          {children}
        </main>
      </div>

      {/* ════ MOBILE BOTTOM TAB BAR ════ */}
      {/* Positioned inside fixed container — renders over content, below sidebar on desktop (hidden) */}
      <div className="md:hidden" style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        background: 'rgba(17,17,17,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 10,
      }}>
        {/* Tab buttons — no header row, top navbar handles that */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          height: 56, padding: '0 4px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          {adminNav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 3, height: '100%', position: 'relative',
                  textDecoration: 'none',
                }}
              >
                <item.icon style={{
                  width: 20, height: 20,
                  color: active ? '#EAB308' : '#4b5563',
                  filter: active ? 'drop-shadow(0 0 6px rgba(234,179,8,0.7))' : 'none',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 600, lineHeight: 1,
                  color: active ? '#EAB308' : '#4b5563',
                  transition: 'color 0.2s ease',
                }}>
                  {item.name}
                </span>
                {active && (
                  <span style={{
                    position: 'absolute', bottom: 2,
                    width: 4, height: 4, borderRadius: '50%',
                    background: '#EAB308',
                  }} />
                )}
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}
