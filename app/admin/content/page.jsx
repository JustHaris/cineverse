'use client'

import { useState, useEffect } from 'react'
import { Pin, EyeOff, Eye, Trash2, RefreshCw, Search, Film } from 'lucide-react'

export default function ContentControlPage() {
  const [pinned, setPinned] = useState([])
  const [hidden, setHidden] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [msg, setMsg] = useState('')

  const fetchControl = async () => {
    const res = await fetch('/api/admin/content')
    const data = await res.json()
    setPinned(data.pinned || [])
    setHidden(data.hidden || [])
    setLoading(false)
  }

  useEffect(() => { fetchControl() }, [])

  const searchContent = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=multi`)
      const data = await res.json()
      setSearchResults(data.results?.slice(0, 10) || [])
    } catch (e) { console.error(e) }
    setSearching(false)
  }

  const doAction = async (action, movie) => {
    setActionLoading(`${action}-${movie.id}`)
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          movie: { 
            id: movie.id, 
            title: movie.title || movie.name, 
            name: movie.name || '',
            poster_path: movie.poster_path, 
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            first_air_date: movie.first_air_date,
            media_type: movie.media_type || (movie.first_air_date || movie.name ? 'tv' : 'movie')
          } 
        })
      })
      setMsg(`✓ ${action.charAt(0).toUpperCase() + action.slice(1)}ned: ${movie.title || movie.name}`)
      setSearchResults([]) // Clear results on success
      setSearchQuery('')    // Clear search bar on success
      fetchControl()
      setTimeout(() => setMsg(''), 3000)
    } catch (e) { console.error(e) }
    setActionLoading(null)
  }

  const forceRefreshTrending = async () => {
    setMsg('⏳ Clearing trending cache...')
    // Revalidate by hitting the trending endpoint with no-cache
    await fetch('/api/movies/trending', { headers: { 'Cache-Control': 'no-cache' } })
    setMsg('✓ Trending cache refreshed!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-6xl space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Content Control Panel</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Pin, hide, or manage platform content</p>
        </div>
        <button
          onClick={forceRefreshTrending}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs md:text-sm font-medium rounded-xl transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 md:w-4 h-4" />
          Force Refresh Trending
        </button>
      </div>

      {/* Status message */}
      {msg && (
        <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs md:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {msg}
        </div>
      )}

      {/* Search & Add Content */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6">
        <h2 className="text-base md:text-lg font-bold text-white mb-4">Search & Control Content</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchContent()}
              placeholder="Search movie or TV show..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-all"
            />
          </div>
          <button
            onClick={searchContent}
            disabled={searching}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                <Film className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{item.title || item.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{item.media_type || 'movie'} · {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || ''}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => doAction('pin', item)}
                    disabled={actionLoading === `pin-${item.id}` || pinned.some(p => p.id?.toString() === item.id?.toString())}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg transition-all disabled:opacity-40"
                  >
                    <Pin className="w-3 h-3" />
                    {pinned.some(p => p.id?.toString() === item.id?.toString()) ? 'Pinned' : 'Pin'}
                  </button>
                  <button
                    onClick={() => doAction(hidden.some(h => h.id?.toString() === item.id?.toString()) ? 'unhide' : 'hide', item)}
                    disabled={actionLoading === `hide-${item.id}` || actionLoading === `unhide-${item.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-all disabled:opacity-40"
                  >
                    <EyeOff className="w-3 h-3" />
                    {hidden.some(h => h.id?.toString() === item.id?.toString()) ? 'Unhide' : 'Hide'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pinned Content */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">📌 Pinned Content ({pinned.length})</h2>
        {pinned.length === 0 ? (
          <p className="text-gray-600 text-sm py-4">No pinned content. Search above and pin items to feature them.</p>
        ) : (
          <div className="space-y-2">
            {pinned.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                <Pin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p className="flex-1 text-sm text-white truncate">{item.title}</p>
                <button
                  onClick={() => doAction('unpin', item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Unpin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Content */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">🚫 Hidden Content ({hidden.length})</h2>
        {hidden.length === 0 ? (
          <p className="text-gray-600 text-sm py-4">No hidden content. Use the search above to hide items from the platform.</p>
        ) : (
          <div className="space-y-2">
            {hidden.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <EyeOff className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="flex-1 text-sm text-white truncate">{item.title}</p>
                <button
                  onClick={() => doAction('unhide', item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs rounded-lg transition-all"
                >
                  <Eye className="w-3 h-3" /> Unhide
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
