'use client'

import { useState, useEffect } from 'react'
import { Activity, Film, Heart, Bookmark, Filter, RefreshCw } from 'lucide-react'

const ACTION_META = {
  watched: { label: 'Watched', icon: Film, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  favorited: { label: 'Favorited', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  watchlisted: { label: 'Watchlisted', icon: Bookmark, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const fetchActivity = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/activity')
      const data = await res.json()
      setActivities(data.activity || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchActivity() }, [])

  const filtered = filter === 'all' ? activities : activities.filter(a => a.action === filter)

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Activity Feed</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time platform interactions</p>
        </div>
        <button
          onClick={fetchActivity}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'watched', 'favorited', 'watchlisted'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
            }`}
          >
            {f === 'all' ? `All (${activities.length})` : `${f} (${activities.filter(a => a.action === f).length})`}
          </button>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div className="col-span-2">User ID</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-6">Content</div>
          <div className="col-span-2 text-right">When</div>
        </div>

        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-14 border-b border-white/3 bg-white/2 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Activity className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600">No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/3 max-h-[600px] overflow-y-auto">
            {filtered.map((item, i) => {
              const meta = ACTION_META[item.action] || ACTION_META.watched
              const Icon = meta.icon
              return (
                <div key={i} className="grid grid-cols-12 gap-4 px-6 py-3.5 hover:bg-white/2 transition-colors items-center">
                  <div className="col-span-2">
                    <code className="text-xs text-gray-500 font-mono">{item.uid}</code>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${meta.bg} ${meta.color}`}>
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </span>
                  </div>
                  <div className="col-span-6">
                    <p className="text-sm text-white truncate">{item.title}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs text-gray-600">{item.ts ? timeAgo(item.ts) : '—'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
