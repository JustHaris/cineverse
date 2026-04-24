'use client'

import useSWR from 'swr'
import MovieCard from '@/components/movie/MovieCard'
import { Flame } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function TrendingPage() {
  const { data, error, isLoading } = useSWR('/api/movies/trending', fetcher, {
    refreshInterval: process.env.NODE_ENV === 'development' ? 0 : 60000, 
    revalidateOnFocus: process.env.NODE_ENV !== 'development',
  })

  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-7xl mx-auto">
      <div className="mb-12 flex items-center gap-4">
        <Flame className="w-10 h-10 text-primary animate-pulse" />
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 glow-text">Trending Now</h1>
          <p className="text-gray-400 text-lg">Live updates of the most popular movies & TV shows.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-full aspect-[2/3] rounded-xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">Failed to load trending content.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data?.results?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
