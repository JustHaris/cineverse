'use client'

import { useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const trackEvent = useCallback(async (type, data = {}) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          pathname,
          uid: user?.uid || 'anonymous',
          timestamp: Date.now(),
          ...data
        }),
        keepalive: true
      })
    } catch (e) {
      // Silent fail in production
      console.error('Analytics error:', e)
    }
  }, [pathname, user])

  // Track Page Views
  useEffect(() => {
    trackEvent('page_view', {
      query: searchParams.toString()
    })
  }, [pathname, searchParams, trackEvent])

  // Track Clicks Globally
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('button, a, [data-track-click]')
      if (target) {
        trackEvent('click', {
          target: target.innerText || target.getAttribute('aria-label') || target.tagName,
          id: target.id || target.getAttribute('data-id'),
          href: target.href
        })
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [trackEvent])

  return null
}
