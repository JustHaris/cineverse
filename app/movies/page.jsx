import { Film } from 'lucide-react'

export default function MoviesPage() {
  return (
    <div className="min-h-screen p-8 pt-24 md:pt-12 flex flex-col items-center justify-center text-center">
      <div className="glass p-12 rounded-3xl max-w-2xl w-full border border-white/10 glow-box">
        <Film className="w-20 h-20 text-primary mx-auto mb-6 opacity-80" />
        <h1 className="text-4xl font-bold text-white mb-4 glow-text">Movies Collection</h1>
        <p className="text-gray-400 text-lg">
          The dedicated movies directory is currently being curated by our editors. 
          <br/><br/>
          For now, please use the Home page or Search bar to find your favorite films!
        </p>
      </div>
    </div>
  )
}
