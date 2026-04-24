'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Info } from 'lucide-react'
import { getImageUrl } from '@/lib/tmdb'

export default function HeroBanner({ movie }) {
  if (!movie) {
    return (
      <div className="relative h-[70vh] w-full flex items-center justify-center bg-secondary">
        <p className="text-gray-500">Loading Featured Movie...</p>
      </div>
    )
  }

  const backdropUrl = getImageUrl(movie.backdrop_path || movie.poster_path, 'original')

  const isTV = movie.media_type === 'tv' || movie.first_air_date || (movie.name && !movie.title);
  const linkHref = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={movie.title || movie.name || 'Hero Banner'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        {/* Dark cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-[15%] left-4 md:left-12 lg:left-24 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl glow-text uppercase tracking-wide">
          {movie.title || movie.name}
        </h1>
        <p className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-8 drop-shadow-md">
          {movie.overview}
        </p>

        <div className="flex items-center gap-4">
          <Link
            href={linkHref}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 glow-box"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </Link>
          <Link
            href={linkHref}
            className="flex items-center gap-2 px-8 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 backdrop-blur-md transition-all border border-white/10"
          >
            <Info className="w-5 h-5" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  )
}
