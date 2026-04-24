'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Eye, Heart, Bookmark, PlayCircle, TrendingUp, 
  RefreshCw, Film, Tv, AlertCircle, Activity
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'

// ─── Reusable Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'text-primary', glow }) {
  return (
    <div className={`bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col gap-3 hover:border-white/10 transition-all ${glow ? 'shadow-[0_0_30px_rgba(234,179,8,0.08)]' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600">{sub}</p>}
    </div>
  )
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

const CHART_COLORS = ['#EAB308', '#3B82F6', '#10B981', '#F97316', '#8B5CF6']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchStats = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-internal': 'true' }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setLastUpdated(new Date())
      }
    } catch (e) {
      console.error('Failed to fetch admin stats:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  // Build chart data from stats
  const engagementData = stats ? [
    { name: 'Watchlist', value: stats.totalWatchlist, fill: '#EAB308' },
    { name: 'Favorites', value: stats.totalFavorites, fill: '#EF4444' },
    { name: 'History', value: stats.totalHistory, fill: '#3B82F6' },
  ] : []

  const userActivityData = stats ? [
    { name: 'Daily', users: stats.dailyActiveUsers },
    { name: 'Weekly', users: stats.weeklyActiveUsers },
    { name: 'Total', users: stats.totalUsers },
  ] : []

  const topWatchedData = (stats?.mostWatched || []).slice(0, 8).map(item => ({
    name: item.title?.length > 16 ? item.title.slice(0, 16) + '…' : item.title,
    views: item.count
  }))

  const topFavoritedData = (stats?.mostFavorited || []).slice(0, 8).map(item => ({
    name: item.title?.length > 16 ? item.title.slice(0, 16) + '…' : item.title,
    favs: item.count
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Real-time analytics'}
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} sub="Registered accounts" color="text-primary" glow />
        <StatCard icon={Activity} label="Daily Active" value={stats?.dailyActiveUsers} sub="Last 24 hours" color="text-green-400" />
        <StatCard icon={TrendingUp} label="Weekly Active" value={stats?.weeklyActiveUsers} sub="Last 7 days" color="text-blue-400" />
        <StatCard icon={Bookmark} label="Watchlist Items" value={stats?.totalWatchlist} sub="Total across users" color="text-yellow-400" />
        <StatCard icon={Heart} label="Favorites" value={stats?.totalFavorites} sub="Total favorited" color="text-red-400" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={PlayCircle} label="Watch History Events" value={stats?.totalHistory} sub="Total views recorded" color="text-purple-400" />
        <StatCard icon={Film} label="Most Watched Title" value={stats?.mostWatched?.[0]?.title || '—'} sub={stats?.mostWatched?.[0] ? `${stats.mostWatched[0].count} views` : ''} color="text-orange-400" />
        <StatCard icon={Eye} label="Top Favorited" value={stats?.mostFavorited?.[0]?.title || '—'} sub={stats?.mostFavorited?.[0] ? `${stats.mostFavorited[0].count} favorites` : ''} color="text-pink-400" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Breakdown */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <SectionHeader title="User Engagement Breakdown" sub="Watchlist vs Favorites vs History" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={engagementData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {engagementData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <SectionHeader title="User Activity" sub="Daily / Weekly / Total users" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userActivityData} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="users" fill="#EAB308" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Watched */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <SectionHeader title="🔥 Most Watched Content" sub="Based on internal watch history" />
          {topWatchedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topWatchedData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#d1d5db', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="views" fill="#3B82F6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <AlertCircle className="w-8 h-8 text-gray-700 mb-3" />
              <p className="text-gray-600 text-sm">No watch history data yet</p>
            </div>
          )}
        </div>

        {/* Most Favorited */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <SectionHeader title="❤️ Most Favorited Content" sub="Based on internal favorites data" />
          {topFavoritedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topFavoritedData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#d1d5db', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="favs" fill="#EF4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Heart className="w-8 h-8 text-gray-700 mb-3" />
              <p className="text-gray-600 text-sm">No favorites data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Content Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: '🎬 Top Watched', data: stats?.mostWatched, countLabel: 'views', color: 'text-blue-400' },
          { title: '❤️ Top Favorited', data: stats?.mostFavorited, countLabel: 'favs', color: 'text-red-400' },
        ].map(({ title, data, countLabel, color }) => (
          <div key={title} className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <SectionHeader title={title} />
            <div className="space-y-2">
              {(data || []).length === 0 ? (
                <p className="text-gray-600 text-sm py-4 text-center">No data yet</p>
              ) : (
                (data || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/3 last:border-0">
                    <span className="w-6 text-center text-xs font-bold text-gray-600">#{i + 1}</span>
                    <p className="flex-1 text-sm text-white truncate">{item.title}</p>
                    <span className={`text-sm font-bold ${color}`}>{item.count} <span className="text-gray-600 font-normal text-xs">{countLabel}</span></span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
