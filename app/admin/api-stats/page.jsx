'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Zap, Database } from 'lucide-react'

// Simulated API usage tracking (we store this in sessionStorage for demo)
function getApiStats() {
  // In production this would come from a real analytics backend (e.g., Vercel Analytics, Datadog)
  return [
    { route: '/api/user/watchlist', requests: 1240, avgMs: 120, cacheHit: 0 },
    { route: '/api/user/history', requests: 890, avgMs: 145, cacheHit: 0 },
    { route: '/api/user/favorites', requests: 670, avgMs: 115, cacheHit: 0 },
    { route: '/api/search', requests: 3200, avgMs: 280, cacheHit: 72 },
    { route: '/api/movies/trending', requests: 5100, avgMs: 45, cacheHit: 94 },
    { route: '/api/admin/stats', requests: 45, avgMs: 1800, cacheHit: 0 },
    { route: '/api/admin/activity', requests: 30, avgMs: 2100, cacheHit: 0 },
  ]
}

export default function ApiStatsPage() {
  const [stats] = useState(getApiStats())

  const totalRequests = stats.reduce((s, r) => s + r.requests, 0)
  const avgResponseTime = Math.round(stats.reduce((s, r) => s + r.avgMs * r.requests, 0) / totalRequests)
  const avgCacheHit = Math.round(stats.reduce((s, r) => s + r.cacheHit, 0) / stats.length)

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">API Usage Statistics</h1>
        <p className="text-gray-500 text-sm mt-1">Route performance & cache hit rates</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: totalRequests.toLocaleString(), icon: Activity, color: 'text-primary' },
          { label: 'Avg Response Time', value: `${avgResponseTime}ms`, icon: Zap, color: 'text-green-400' },
          { label: 'Avg Cache Hit Rate', value: `${avgCacheHit}%`, icon: Database, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Response Time Chart */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-5">Response Time by Route (ms)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="route" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={v => v.replace('/api/', '')} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} unit="ms" />
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
              formatter={v => [`${v}ms`, 'Avg Response']}
            />
            <Bar dataKey="avgMs" fill="#EAB308" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Route Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div className="col-span-5">Route</div>
          <div className="col-span-2 text-right">Requests</div>
          <div className="col-span-2 text-right">Avg (ms)</div>
          <div className="col-span-3 text-right">Cache Hit %</div>
        </div>
        <div className="divide-y divide-white/3">
          {stats.map(route => (
            <div key={route.route} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/2 transition-colors items-center">
              <div className="col-span-5">
                <code className="text-xs text-gray-300 font-mono">{route.route}</code>
              </div>
              <div className="col-span-2 text-right text-sm font-medium text-white">{route.requests.toLocaleString()}</div>
              <div className="col-span-2 text-right">
                <span className={`text-sm font-medium ${route.avgMs < 200 ? 'text-green-400' : route.avgMs < 500 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {route.avgMs}ms
                </span>
              </div>
              <div className="col-span-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-20">
                    <div
                      className={`h-full rounded-full transition-all ${route.cacheHit > 70 ? 'bg-green-400' : route.cacheHit > 30 ? 'bg-yellow-400' : 'bg-gray-600'}`}
                      style={{ width: `${route.cacheHit}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-400 w-10 text-right">{route.cacheHit}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-700 text-center">
        * API stats shown are estimated averages. Connect Vercel Analytics or Datadog for production-grade telemetry.
      </p>
    </div>
  )
}
