import Image from 'next/image'
export const revalidate = 3600; // Revalidate every hour
import Link from 'next/link'
import { Star, Clock, Calendar, Play, X } from 'lucide-react'
import { getTvDetails, getImageUrl } from '@/lib/tmdb'
import { getHiddenIds } from '@/lib/content-control'
import MovieActions from '@/components/movie/MovieActions'
import MovieReviews from '@/components/movie/MovieReviews'
import TrackHistory from '@/components/movie/TrackHistory'
import PosterGlow from '@/components/movie/PosterGlow'
import { generateSchema } from '@/services/seoService'

export async function generateMetadata({ params }) {
  const { id } = await params;
  const movie = await getTvDetails(id);
  const hiddenIds = await getHiddenIds();

  if (!movie || hiddenIds.has(id.toString())) {
    return { title: 'Movie Not Found' };
  }

  return {
    title: movie.title || movie.name,
    description: movie.overview,
    openGraph: {
      title: movie.title || movie.name,
      description: movie.overview,
      images: [
        {
          url: getImageUrl(movie.backdrop_path || movie.poster_path, 'w1280'),
          width: 1280,
          height: 720,
        },
      ],
    },
  };
}

export default async function TvDetails({ params }) {
  const { id } = await params;
  const [movie, hiddenIds] = await Promise.all([
    getTvDetails(id),
    getHiddenIds()
  ]);

  if (!movie || hiddenIds.has(id.toString())) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Content not available</h1>
        <p className="text-gray-400">This content has been removed or is temporarily hidden from the platform.</p>
        <Link href="/" className="mt-8 px-6 py-2 bg-primary text-black font-bold rounded-xl">Go Home</Link>
      </div>
    )
  }

  const backdropUrl = getImageUrl(movie.backdrop_path || movie.poster_path, 'original')
  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const trailer = movie.videos?.results?.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube')
  
  // Extract US Watch Providers (JustWatch data from TMDB)
  const providers = movie['watch/providers']?.results?.US;
  const tmdbWatchLink = providers?.link || '#';
  const streamProviders = providers?.flatrate || [];
  const rentProviders = providers?.rent || [];
  const buyProviders = providers?.buy || [];
  const hasProviders = streamProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0;

  const schema = generateSchema.movie(movie)

  return (
    <div className="min-h-screen pb-20 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TrackHistory movie={movie} />

      {/* Immersive Mobile Back Button */}
      <Link 
        href="/"
        className="md:hidden fixed top-6 left-6 z-50 w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white"
      >
        <X className="w-5 h-5" />
      </Link>

      <div className="relative min-h-[70vh] md:h-[70vh] w-full flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <PosterGlow imageUrl={posterUrl} />
          {backdropUrl && (
            <Image 
              src={backdropUrl}
              alt={movie.title || movie.name}
              fill
              priority
              className="object-cover opacity-30 scale-105 animate-pulse-slow"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative w-full p-8 md:p-16 flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-end z-10 pt-20 md:pt-0">
          <div className="block w-32 h-48 md:w-64 md:h-96 relative rounded-2xl overflow-hidden shrink-0 shadow-2xl glow-box border border-white/10">
            {posterUrl && (
              <Image src={posterUrl} alt={movie.name || movie.title || 'Poster'} fill className="object-cover" sizes="(max-width: 768px) 128px, 256px" />
            )}
          </div>
          
          <div className="flex-1 max-w-4xl flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 glow-text uppercase tracking-wide">
              {movie.title || movie.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base text-gray-300 mb-6">
              <span className="flex items-center gap-1 text-primary font-bold">
                <Star className="w-4 h-4 fill-primary" />
                {movie.vote_average?.toFixed(1)} / 10
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.runtime || 120} min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.first_air_date}
              </span>
              {movie.number_of_seasons && (
                <>
                  <span>•</span>
                  <span>{movie.number_of_seasons} Seasons</span>
                </>
              )}
              <span>•</span>
              <div className="flex gap-2">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="px-2 py-1 bg-white/10 rounded-md text-xs border border-white/5">{g.name}</span>
                ))}
              </div>
            </div>
            
            <p className="text-lg text-gray-200 mb-8 max-w-3xl leading-relaxed">
              {movie.overview}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {trailer ? (
                <a 
                  href={`#trailer`}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 glow-box"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Trailer
                </a>
              ) : (
                <button className="flex items-center gap-2 px-8 py-3 bg-gray-600 text-gray-300 font-bold rounded-xl cursor-not-allowed">
                  <Play className="w-5 h-5 fill-current" />
                  Trailer Unavailable
                </button>
              )}
              
              <MovieActions movie={movie} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {trailer && (
            <div id="trailer" className="space-y-4 pt-12">
              <h2 className="text-2xl font-bold text-white glow-text">Official Trailer</h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 glass">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&controls=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-white glow-text">Where to Watch</h2>
            <div className="glass p-6 rounded-2xl border border-white/10 space-y-6">
              {hasProviders ? (
                <>
                  {streamProviders.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Stream</h3>
                      <div className="flex flex-wrap gap-4">
                        {streamProviders.map(p => (
                          <a href={tmdbWatchLink} target="_blank" rel="noopener noreferrer" key={p.provider_id} className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/10 hover:scale-110 hover:border-primary transition-all duration-300" title={`Watch on ${p.provider_name}`}>
                            <Image src={getImageUrl(p.logo_path, 'original')} alt={p.provider_name} fill className="object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {(rentProviders.length > 0 || buyProviders.length > 0) && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Rent / Buy</h3>
                      <div className="flex flex-wrap gap-4">
                        {/* Combine rent and buy, removing duplicates by ID */}
                        {Array.from(new Map([...rentProviders, ...buyProviders].map(item => [item.provider_id, item])).values()).map(p => (
                          <a href={tmdbWatchLink} target="_blank" rel="noopener noreferrer" key={p.provider_id} className="relative w-10 h-10 rounded-xl overflow-hidden opacity-80 border border-white/10 hover:opacity-100 hover:scale-110 transition-all duration-300" title={`Rent or Buy on ${p.provider_name}`}>
                            <Image src={getImageUrl(p.logo_path, 'original')} alt={p.provider_name} fill className="object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400">Currently not available on streaming platforms in the US.</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Streaming data provided by JustWatch.</p>
          </div>

          {movie.credits?.cast && movie.credits.cast.length > 0 && (
             <div className="space-y-4">
               <h2 className="text-2xl font-bold text-white glow-text">Top Cast</h2>
               <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                 {movie.credits.cast.slice(0, 10).map((actor) => (
                   <Link href={`/person/${actor.id}`} key={actor.id} className="min-w-[120px] text-center group cursor-pointer">
                     <div className="w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden relative border border-white/20 group-hover:border-primary transition-colors">
                       {actor.profile_path ? (
                         <Image src={getImageUrl(actor.profile_path, 'w500')} alt={actor.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                       ) : (
                         <div className="w-full h-full bg-secondary flex items-center justify-center">
                           <span className="text-2xl text-gray-600">{actor.name[0]}</span>
                         </div>
                       )}
                     </div>
                     <p className="text-sm text-white font-medium truncate group-hover:text-primary transition-colors">{actor.name}</p>
                     <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                   </Link>
                 ))}
               </div>
             </div>
          )}
        </div>

        <div className="space-y-8 lg:pt-12">
          <MovieReviews movieId={movie.id} mediaType="tv" />
        </div>
      </div>
    </div>
  )
}
