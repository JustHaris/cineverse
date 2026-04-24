import { Tv } from 'lucide-react'

export default function TvShowsPage() {
  return (
    <div className="min-h-screen p-8 pt-24 md:pt-12 flex flex-col items-center justify-center text-center">
      <div className="glass p-12 rounded-3xl max-w-2xl w-full border border-white/10 glow-box">
        <Tv className="w-20 h-20 text-primary mx-auto mb-6 opacity-80" />
        <h1 className="text-4xl font-bold text-white mb-4 glow-text">TV Shows</h1>
        <p className="text-gray-400 text-lg">
          Binge-worthy series are coming soon to CineVerse!
          <br/><br/>
          We are currently expanding our catalog to include the best TV shows. Stay tuned.
        </p>
      </div>
    </div>
  )
}
