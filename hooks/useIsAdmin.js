'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { auth } from '@/lib/firebase'

/**
 * Checks if the current user is an admin by calling the server-side verify API.
 * Returns false for logged-out users and non-admin users.
 * Result is cached per session so we don't spam the API.
 */
const cache = { uid: null, isAdmin: false }

export function useIsAdmin() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) { setIsAdmin(false); return }

    // Use cached result for same user
    if (cache.uid === user.uid) { setIsAdmin(cache.isAdmin); return }

    auth.currentUser.getIdToken()
      .then(token => fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      }))
      .then(r => r.json())
      .then(data => {
        cache.uid = user.uid
        cache.isAdmin = !!data.isAdmin
        setIsAdmin(cache.isAdmin)
      })
      .catch(() => setIsAdmin(false))
  }, [user, loading])

  return isAdmin
}
