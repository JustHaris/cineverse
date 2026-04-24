'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, PieChart, Pie
} from 'recharts'
import { TrendingUp, Users, MousePointer2, Target, BarChart3, ArrowUpRight, Activity, Flame } from 'lucide-react'

const COLORS = ['#EAB308', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6']

export default function IntelligenceEngine() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async (range) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics/summary?range=${range}`)
      const d = await res.json()
      setData(d)
    } catch (err) { console.error(err) }
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchData(timeRange)
  }, [timeRange])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData(timeRange)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
      </div>
    )
  }

  // Activity over last 24h simulation (if data is missing)
  const activityData = [
    { time: '00:00', users: 12 }, { time: '04:00', users: 5 }, { time: '08:00', users: 18 },
    { time: '12:00', users: 45 }, { time: '16:00', users: 62 }, { time: '20:00', users: 38 }
  ]

  return (
    <div className="space-y-8 pb-12 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-wider">Live</div>
            <h1 className="text-3xl font-bold text-white">Intelligence Engine</h1>
          </div>
          <p className="text-gray-500">Real-time content engagement & user behavior analytics</p>
        </div>
        <div className="flex gap-2">
           <select 
             value={timeRange}
             onChange={(e) => setTimeRange(e.target.value)}
             className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
           >
             <option value="24h" className="bg-[#111]">Last 24 Hours</option>
             <option value="7d" className="bg-[#111]">Last 7 Days</option>
             <option value="30d" className="bg-[#111]">Last 30 Days</option>
             <option value="90d" className="bg-[#111]">Last 90 Days</option>
             <option value="all" className="bg-[#111]">All Time</option>
           </select>
           <button 
             onClick={handleRefresh}
             disabled={loading || refreshing}
             className="px-4 py-2 bg-primary text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all disabled:opacity-50 flex items-center gap-2"
           >
             <ArrowUpRight className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
             {refreshing ? 'Refreshing...' : 'Refresh Report'}
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Daily Active" 
          value={data.activeUsers.dau} 
          icon={<Users className="w-5 h-5 text-blue-400" />}
          trend="+12%"
          color="blue"
        />
        <StatCard 
          title="Weekly Active" 
          value={data.activeUsers.wau} 
          icon={<Target className="w-5 h-5 text-yellow-400" />}
          trend="+5%"
          color="yellow"
        />
        <StatCard 
          title="Interactions" 
          value={data.contentMetrics.reduce((acc, curr) => acc + curr.clicks, 0)} 
          icon={<MousePointer2 className="w-5 h-5 text-purple-400" />}
          trend="+24%"
          color="purple"
        />
        <StatCard 
          title="Retention" 
          value="68%" 
          icon={<Activity className="w-5 h-5 text-green-400" />}
          trend="+8%"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Funnel */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2">
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Conversion Funnel
            </h2>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Home → Details → Action</div>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnel} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#666" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                  {data.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Activity Trend */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Live Activity
          </h2>
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="time" stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#181818', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Content Engagement */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Content Heat Index
            </h2>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:inline">Top 10</span>
          </div>
          <div className="space-y-3">
            {data.contentMetrics.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 md:gap-4 bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-xl text-xs md:text-sm shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-bold text-white truncate">ID: {item.id}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                       <MousePointer2 className="w-2.5 h-2.5 text-gray-500" />
                       <span className="text-[9px] text-gray-400">{item.clicks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <Users className="w-2.5 h-2.5 text-gray-500" />
                       <span className="text-[9px] text-gray-400">{item.views}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter">Score</p>
                  <p className="text-base md:text-xl font-black text-white leading-none">{item.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap UI (SaaS Style) */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-white mb-2">Content Heatmap</h2>
          <p className="text-[10px] md:text-xs text-gray-500 mb-6">User interaction depth across the platform</p>
          <div className="grid grid-cols-5 xs:grid-cols-8 sm:grid-cols-10 gap-1 md:gap-1.5 p-3 md:p-4 bg-black/40 rounded-2xl border border-white/5">
            {Array.from({ length: 80 }).map((_, i) => {
              const intensity = Math.random() // Simulation
              return (
                <div 
                  key={i} 
                  className="aspect-square rounded-[2px] transition-all hover:scale-110 cursor-help"
                  style={{ 
                    backgroundColor: intensity > 0.8 ? '#EAB308' : 
                                     intensity > 0.5 ? '#EAB30880' : 
                                     intensity > 0.3 ? '#EAB30840' : 
                                     intensity > 0.1 ? '#EAB30810' : '#111',
                  }}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-6 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
            <span>Low Eng.</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.8].map(o => (
                <div key={o} className="w-2.5 h-2.5 rounded-[1px]" style={{ backgroundColor: '#EAB308', opacity: o }} />
              ))}
            </div>
            <span>High Eng.</span>
          </div>
          
          <div className="mt-12 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
             <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Intelligence Insight
             </h4>
             <p className="text-xs text-gray-400 leading-relaxed">
                We noticed a 14% drop-off between Detail pages and Watchlist additions. 
                Consider making the "Add to Watchlist" button more prominent or using an optimistic UI update to increase retention.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend, color }) {
  const colorMap = {
    blue: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
    yellow: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
    purple: 'bg-purple-400/10 border-purple-400/20 text-purple-400',
    green: 'bg-green-400/10 border-green-400/20 text-green-400',
  }

  return (
    <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-primary/20 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-white mt-2 tracking-tight">{value}</h3>
      </div>
    </div>
  )
}
