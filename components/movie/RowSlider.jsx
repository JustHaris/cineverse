'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'

export default function RowSlider({ title, movies }) {
  const rowRef = useRef(null)

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="mb-8 relative group">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8 glow-text">{title}</h2>

      <div className="relative">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-sm hidden md:flex"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 md:px-8 pb-4 no-scrollbar no-swipe"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-sm hidden md:flex"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  )
}
