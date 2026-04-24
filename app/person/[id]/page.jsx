export const revalidate = 3600; // Revalidate every hour
import Image from 'next/image'
import { getPersonDetails, getImageUrl } from '@/lib/tmdb'
import MovieCard from '@/components/movie/MovieCard'

export async function generateMetadata({ params }) {
  const { id } = await params;
  const person = await getPersonDetails(id);

  if (!person) {
    return { title: 'Person Not Found' };
  }

  return {
    title: `${person.name} - CineVerse`,
    description: person.biography || `Discover movies starring ${person.name}.`,
    openGraph: {
      title: person.name,
      images: [
        {
          url: getImageUrl(person.profile_path, 'w500'),
          width: 500,
          height: 750,
        },
      ],
    },
  };
}

export default async function PersonDetails({ params }) {
  const { id } = await params;
  const person = await getPersonDetails(id);

  if (!person) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl text-gray-400">Actor not found.</h1>
      </div>
    )
  }

  const profileUrl = getImageUrl(person.profile_path, 'h632')
  const knownFor = person.movie_credits?.cast?.sort((a, b) => b.popularity - a.popularity).slice(0, 20) || []

  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-48 h-72 md:w-64 md:h-96 relative rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10 mx-auto md:mx-0">
          {profileUrl ? (
            <Image src={profileUrl} alt={person.name} fill className="object-cover" sizes="(max-width: 768px) 192px, 256px" />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-4xl text-gray-600">{person.name[0]}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text">{person.name}</h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-300 mb-6">
            <span className="px-3 py-1 bg-white/10 rounded-full border border-white/5">{person.known_for_department}</span>
            {person.birthday && <span>Born: {person.birthday}</span>}
            {person.place_of_birth && <span>Place: {person.place_of_birth}</span>}
          </div>
          
          {person.biography && (
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-xl font-bold text-white">Biography</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-6 md:line-clamp-none">
                {person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {knownFor.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white glow-text">Known For</h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {knownFor.map((movie) => (
              <div key={movie.id} className="snap-start shrink-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
