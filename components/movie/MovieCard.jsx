'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/tmdb'
import { Play, Plus, Star, Check, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWatchlist, toggleWatchlist, useFavorites, toggleFavorite } from '@/lib/firestore'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function MovieCard({ movie }) {
  const imageUrl = getImageUrl(movie.poster_path || movie.backdrop_path, 'w500')
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

  // Sync back when server state changes
  useEffect(() => {
    setOptWatch(null)
  }, [serverWatchlisted])
  
  useEffect(() => {
    setOptFav(null)
  }, [serverFavorited])

  const handleWatchlistClick = async (e) => {
    e.preventDefault() // Stop link navigation
    if (!user) return router.push('/login')
    
    const nextState = !isWatchlisted
    setOptWatch(nextState) // Optimistic update
    
    try {
      await toggleWatchlist(user.uid, movie, !nextState)
    } catch (err) {
      setOptWatch(!nextState) // Revert on failure
    }
  }

  const handleFavoriteClick = async (e) => {
    e.preventDefault() // Stop link navigation
    if (!user) return router.push('/login')
    
    const nextState = !isFavorited
    setOptFav(nextState) // Optimistic update
    
    try {
      await toggleFavorite(user.uid, movie, !nextState)
    } catch (err) {
      setOptFav(!nextState) // Revert on failure
    }
  }

  // Robust check for TV vs Movie:
  // 1. Check explicit media_type
  // 2. Check for TV-specific fields (name, first_air_date)
  const isTV = movie.media_type === 'tv' || !!movie.first_air_date || (!!movie.name && !movie.title);
  const linkHref = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <div
      className="relative group min-w-[200px] h-[300px] rounded-xl overflow-hidden cursor-pointer card-hover"
    >
      <Link href={linkHref} className="relative block w-full h-full outline-none">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={movie.title || movie.name || 'Movie Poster'}
            fill
            className="object-cover transition-all duration-500 group-hover:brightness-50"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-gray-500 text-center p-2 text-sm">{movie.title || movie.name}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <h3 className="text-white font-black text-sm truncate mb-2 uppercase tracking-tight">{movie.title || movie.name}</h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center text-xs text-primary font-black">
              <Star className="w-3.5 h-3.5 mr-1 fill-primary" />
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-[10px] text-gray-400 font-bold">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black hover:bg-yellow-400 transition-all active:scale-90 tap-bounce shadow-lg">
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            </button>
            <button 
              onClick={handleWatchlistClick}
              title="Add to Watchlist"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all tap-bounce ${
                isWatchlisted 
                  ? 'bg-primary border-primary text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                  : 'border-white/30 text-white hover:border-white hover:bg-white/10'
              }`}
            >
              {isWatchlisted ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={handleFavoriteClick}
              title="Add to Favorites"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all tap-bounce ${
                isFavorited 
                  ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : 'border-white/30 text-white hover:border-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
