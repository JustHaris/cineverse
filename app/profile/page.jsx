'use client'

import { useState } from 'react'
import { User, LogOut, Settings, History, Heart, X, Save, Bell, Shield, Palette, Share2, Copy, Check, MessageCircle, Send, Film, Tv } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { signOut, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useWatchlist, useHistory, useFavorites } from '@/lib/firestore'
import MovieCard from '@/components/movie/MovieCard'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const { watchlist, loading: watchlistLoading } = useWatchlist(user?.uid)
  const { history, loading: historyLoading } = useHistory(user?.uid)
  const { favorites, loading: favoritesLoading } = useFavorites(user?.uid)

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const openSettings = () => {
    setDisplayName(user?.displayName || '')
    setSaveMsg('')
    setShowSettings(true)
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/shared/${user?.uid}` : ''
  const shareText = `Check out my CineVerse watchlist! 🎬`

  const handleShareWatchlist = async () => {
    // Try native Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My CineVerse Watchlist', text: shareText, url: shareUrl })
        return
      } catch { /* user cancelled */ }
    }
    // Fallback: show share modal
    setShowShare(true)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* fallback */ }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() || user.displayName })
      setSaveMsg('✓ Profile updated successfully!')
      setTimeout(() => setShowSettings(false), 1500)
    } catch (e) {
      setSaveMsg('❌ Failed to update. Try again.')
    }
    setSaving(false)
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading Profile...</p></div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <User className="w-24 h-24 text-gray-600 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Not Signed In</h1>
        <p className="text-gray-400 mb-8 max-w-md">Create an account or log in to manage your watchlist, favorites, and reviews.</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <>
      {/* ── Share Watchlist Modal ── */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowShare(false)} />
          <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl shadow-2xl p-7 z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Share Watchlist</h2>
              </div>
              <button onClick={() => setShowShare(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Copy URL */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Watchlist Link</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-400 truncate flex items-center">
                  {shareUrl}
                </div>
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social Share */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Share via</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    name: 'WhatsApp',
                    color: 'text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/20',
                    url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
                    icon: <MessageCircle className="w-4 h-4" />,
                  },
                  {
                    name: 'Telegram',
                    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
                    url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
                    icon: <Send className="w-4 h-4" />,
                  },
                  {
                    name: 'Twitter / X',
                    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20',
                    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                    icon: <span className="text-sm font-bold">𝕏</span>,
                  },
                  {
                    name: 'Facebook',
                    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20',
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                    icon: <span className="text-sm font-bold">f</span>,
                  },
                ].map(({ name, color, url, icon }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${color}`}
                  >
                    {icon} {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl shadow-2xl p-8 z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Settings</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={user?.displayName || 'Your name'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <div className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  {user?.email}
                  <span className="ml-auto text-xs text-gray-600">Read-only</span>
                </div>
              </div>

              {/* Preferences — interactive toggles */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preferences</label>
                <div className="space-y-2">
                  {[
                    { icon: Bell, label: 'Email Notifications', value: emailNotifs, set: setEmailNotifs },
                    { icon: Palette, label: 'Dark Mode', value: darkMode, set: setDarkMode },
                  ].map(({ icon: Icon, label, value, set }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => set(v => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">{label}</span>
                      </div>
                      <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                        value ? 'bg-primary' : 'bg-white/15'
                      }`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                          value ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {saveMsg && (
                <p className={`text-sm text-center py-2 rounded-xl ${
                  saveMsg.startsWith('✓') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                }`}>{saveMsg}</p>
              )}

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-yellow-400 text-black font-bold rounded-xl transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-24 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white glow-text">My Profile</h1>
      </div>

      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 mb-8 md:mb-12 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary rounded-full flex items-center justify-center border-4 border-primary shadow-[0_0_20px_rgba(234,179,8,0.3)] shrink-0">
          <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
        </div>
        
        <div className="flex-1 text-center md:text-left min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 truncate">
            {user.displayName || 'CineVerse User'}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 truncate">{user.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
            <button
              onClick={openSettings}
              className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 text-sm rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
            </div>
              {watchlist.length > 0 && (
                <button
                  onClick={handleShareWatchlist}
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Watchlist
                </button>
              )}
          </div>
          
          {watchlistLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4"><div className="w-[200px] h-[300px] rounded-xl bg-white/5 animate-pulse"></div></div>
          ) : watchlist.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {watchlist.map(item => (
                <div key={item.movieId} className="min-w-[200px] relative">
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${(item.media_type === 'tv' || item.first_air_date || item.name) ? 'bg-blue-500/80 text-white' : 'bg-primary/80 text-black'}`}>
                      {(item.media_type === 'tv' || item.first_air_date || item.name) ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {(item.media_type === 'tv' || item.first_air_date || item.name) ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  <MovieCard movie={{
                    ...item,
                    id: item.movieId,
                    media_type: item.media_type || (item.first_air_date || item.name ? 'tv' : 'movie'),
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl text-center border border-white/5">
              <p className="text-gray-400">Your watchlist is empty.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-white">Watch History</h2>
          </div>
          
          {historyLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4"><div className="w-[200px] h-[300px] rounded-xl bg-white/5 animate-pulse"></div></div>
          ) : history.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {history.map(item => (
                <div key={item.movieId} className="min-w-[200px] relative">
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${(item.media_type === 'tv' || item.first_air_date || item.name) ? 'bg-blue-500/80 text-white' : 'bg-primary/80 text-black'}`}>
                      {(item.media_type === 'tv' || item.first_air_date || item.name) ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {(item.media_type === 'tv' || item.first_air_date || item.name) ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  <MovieCard movie={{
                    ...item,
                    id: item.movieId,
                    media_type: item.media_type || (item.first_air_date || item.name ? 'tv' : 'movie'),
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl text-center border border-white/5">
              <p className="text-gray-400">You haven't viewed any movies yet.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <h2 className="text-2xl font-bold text-white">My Favorites</h2>
          </div>
          
          {favoritesLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4"><div className="w-[200px] h-[300px] rounded-xl bg-white/5 animate-pulse"></div></div>
          ) : favorites.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {favorites.map(item => (
                <div key={item.movieId} className="min-w-[200px] relative">
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${(item.media_type === 'tv' || item.first_air_date || item.name) ? 'bg-blue-500/80 text-white' : 'bg-primary/80 text-black'}`}>
                      {(item.media_type === 'tv' || item.first_air_date || item.name) ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {(item.media_type === 'tv' || item.first_air_date || item.name) ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  <MovieCard movie={{
                    ...item,
                    id: item.movieId,
                    media_type: item.media_type || (item.first_air_date || item.name ? 'tv' : 'movie'),
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl text-center border border-white/5">
              <p className="text-gray-400">You haven't added any favorites yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
