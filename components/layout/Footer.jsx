'use client'

import Link from 'next/link'
import { Globe, Briefcase, Mail, Film, Info, Shield, HelpCircle, Heart, Bookmark, Users, Star } from 'lucide-react'
import { useIsAdmin } from '@/hooks/useIsAdmin'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const isAdmin = useIsAdmin()

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#050505] pt-16 pb-32 md:pb-12 px-8 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_20px_rgba(234,179,8,0.2)]" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
        
        {/* Section 1: Brand */}
        <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Film className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black text-white glow-text uppercase tracking-tighter">
              CineVerse
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Experience the future of entertainment with CineVerse. Our intelligence-driven platform brings you a curated cinematic experience with premium features and seamless tracking.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1">
              <Globe className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1">
              <Briefcase className="w-5 h-5" />
            </a>
            <a href="mailto:contact@cineverse.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="space-y-6">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Quick Navigation</h3>
          <ul className="space-y-4">
            {[
              { label: 'Home', href: '/' },
              { label: 'Movies', href: '/movies' },
              { label: 'TV Shows', href: '/tv' },
              { label: 'Trending', href: '/trending' },
              { label: 'Blogs', href: '/blogs' },
              { label: 'Search', href: '/search' }
            ].map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href} 
                  className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Platform */}
        <div className="space-y-6">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Platform Features</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Bookmark className="w-4 h-4" />
                Watchlist
              </Link>
            </li>
            <li>
              <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Heart className="w-4 h-4" />
                Favorites
              </Link>
            </li>
            <li>
              <Link href="/profile#shared-lists" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Users className="w-4 h-4" />
                Shared Lists
              </Link>
            </li>
            <li>
              <Link href="/profile#reviews" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Star className="w-4 h-4" />
                Reviews
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin" className="flex items-center gap-2 text-primary/70 hover:text-primary text-sm transition-all hover:translate-x-1 font-medium">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Section 4: Support */}
        <div className="space-y-6">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Legal & Support</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/privacy" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Info className="w-4 h-4" />
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Info className="w-4 h-4" />
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/help" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1">
                <HelpCircle className="w-4 h-4" />
                Help Center
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
        <div className="space-y-1">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {currentYear} <span className="text-white font-bold">CineVerse</span>. Built with passion by <span className="text-primary font-bold">Haris Khan</span>.
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            Premium Cinematic SaaS Experience
          </p>
        </div>
        
        <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Powered By</span>
          <div className="flex items-center gap-4 grayscale">
            <span className="text-xs text-white font-black tracking-tighter">NEXT.JS</span>
            <span className="text-xs text-white font-black tracking-tighter">FIREBASE</span>
            <span className="text-xs text-white font-black tracking-tighter">TMDB</span>
          </div>
        </div>
      </div>

      {/* Aesthetic blur overlay */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </footer>
  )
}
