'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWatchlist, useFavorites, toggleWatchlist, toggleFavorite } from '@/lib/firestore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function MovieActions({ movie }) {
  const { user } = useAuth()
  const router = useRouter()

  const { watchlist } = useWatchlist(user?.uid)
  const { favorites } = useFavorites(user?.uid)

  const serverWatchlisted = watchlist.some(item => item.movieId.toString() === movie.id.toString())
  const serverFavorited = favorites.some(item => item.movieId.toString() === movie.id.toString())

  const [optWatch, setOptWatch] = useState(null)
  const [optFav, setOptFav] = useState(null)

  const isWatchlisted = optWatch !== null ? optWatch : serverWatchlisted
  const isFavorited = optFav !== null ? optFav : serverFavorited

  useEffect(() => { setOptWatch(null) }, [serverWatchlisted])
  useEffect(() => { setOptFav(null) }, [serverFavorited])

  const handleWatchlist = async () => {
    if (!user) return router.push('/login')
    const nextState = !isWatchlisted
    setOptWatch(nextState)
    try {
      await toggleWatchlist(user.uid, movie, !nextState)
    } catch (e) {
      setOptWatch(!nextState)
    }
  }

  const handleFavorite = async () => {
    if (!user) return router.push('/login')
    const nextState = !isFavorited
    setOptFav(nextState)
    try {
      await toggleFavorite(user.uid, movie, !nextState)
    } catch (e) {
      setOptFav(!nextState)
    }
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleWatchlist}
        className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all border ${isWatchlisted
            ? 'bg-primary text-black border-primary'
            : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
          }`}
      >
        {isWatchlisted ? (
          <Check className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
        {isWatchlisted ? 'Added to Watchlist' : 'Watchlist'}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleFavorite}
        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border ${isFavorited
            ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'bg-white/10 text-white hover:bg-white/20 hover:text-red-500 border-white/10'
          }`}
      >
        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
      </motion.button>
    </>
  )
}
