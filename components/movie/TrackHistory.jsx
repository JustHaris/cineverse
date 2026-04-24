'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { addToHistory } from '@/lib/firestore'

export default function TrackHistory({ movie }) {
  const { user } = useAuth()

  useEffect(() => {
    if (user && movie) {
      // Add a slight delay so quick bounces don't count
      const timer = setTimeout(() => {
        addToHistory(user.uid, movie).catch(console.error)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user, movie])

  return null // This is a logic-only component
}
