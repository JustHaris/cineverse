'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon, X, Film, Tv } from 'lucide-react'
import MovieCard from '@/components/movie/MovieCard'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(!!initialQuery)

  // Run search immediately if there's an initial query from URL
  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSearch(q) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(q)}&type=movie`),
        fetch(`/api/search?q=${encodeURIComponent(q)}&type=tv`)
      ])
      const moviesData = moviesRes.ok ? await moviesRes.json() : { results: [] }
      const tvData = tvRes.ok ? await tvRes.json() : { results: [] }

      // Merge and sort by popularity
      const combined = [
        ...(moviesData.results || []).map(r => ({ ...r, media_type: 'movie' })),
        ...(tvData.results || []).map(r => ({ ...r, media_type: 'tv' }))
      ].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

      setResults(combined)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
      runSearch(query)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setSearched(false)
    router.push('/search', { scroll: false })
  }

  return (
    <div className="min-h-screen pt-24 pb-28 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-primary" />
          Search
        </h1>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors..."
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-base md:text-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Quick type hint */}
        {!searched && (
          <p className="text-gray-500 text-sm mt-3 text-center">
            Type and press Enter, or wait to search automatically
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[300px] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <p className="text-gray-400 text-sm">
              Found <span className="text-white font-bold">{results.length}</span> results for{' '}
              <span className="text-primary font-bold">"{query}"</span>
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {results.map((item) => (
                <div key={`${item.media_type}-${item.id}`} className="relative">
                  {/* Media Type Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.media_type === 'tv' 
                        ? 'bg-blue-500/80 text-white' 
                        : 'bg-primary/80 text-black'
                    }`}>
                      {item.media_type === 'tv' ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {item.media_type === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  <MovieCard movie={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchIcon className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-xl text-gray-400 font-medium">No results for "{query}"</p>
              <p className="text-gray-600 mt-2 text-sm">Try a different title, actor, or genre</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !searched && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <SearchIcon className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-xl text-gray-400 font-medium">Find your next watch</p>
          <p className="text-gray-600 mt-2 text-sm">Search across thousands of movies and TV shows</p>
          <div className="flex gap-3 mt-6">
            {['Avengers', 'Breaking Bad', 'Inception'].map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); runSearch(s) }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
