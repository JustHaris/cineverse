'use client'
import { HelpCircle, Search, Play, User, CreditCard, ChevronRight } from 'lucide-react'

export default function HelpPage() {
  const categories = [
    { icon: User, title: 'Account & Profile', desc: 'Manage your profile, password, and preferences.' },
    { icon: Play, title: 'Using CineVerse', desc: 'Learn how to use watchlists, tracking, and search.' },
    { icon: CreditCard, title: 'Premium Features', desc: 'Understanding our subscription and premium benefits.' },
    { icon: HelpCircle, title: 'Troubleshooting', desc: 'Fixing playback issues, login problems, and more.' },
  ]

  const faqs = [
    { q: 'Is CineVerse free to use?', a: 'Yes, CineVerse provides all its core tracking and discovery features for free, powered by the TMDB API.' },
    { q: 'How do I add movies to my watchlist?', a: 'Simply click the "Watchlist" or "+" button on any movie or TV show card to save it to your profile.' },
    { q: 'Can I share my watchlist with friends?', a: 'Absolutely! Go to your profile and click "Share Watchlist" to generate a link you can send to anyone.' },
    { q: 'Where does the movie data come from?', a: 'We use the industry-leading TMDB (The Movie Database) API to provide up-to-date movie and TV show information.' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white glow-text">Help Center</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">How can we help you today? Search our knowledge base or browse categories below.</p>
        
        <div className="max-w-2xl mx-auto relative group mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for help..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {categories.map((cat) => (
          <div key={cat.title} className="glass p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6 group-hover:bg-primary/10 transition-colors">
              <cat.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass p-6 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-white font-bold flex items-center justify-between">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-primary" />
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 glass p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Still need help?</h3>
          <p className="text-gray-400">Our support team is available 24/7 to answer your questions.</p>
        </div>
        <button className="px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all">
          Contact Support
        </button>
      </div>
    </div>
  )
}
