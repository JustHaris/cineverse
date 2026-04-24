import { db, admin } from '@/services/firebase-admin'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/tmdb'
import { Star } from 'lucide-react'

// Note: Ensure your Next.js config supports revalidation or dynamic rendering for this route
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }) {
  const { userId } = await params;
  let userName = 'User';

  try {
    const userRecord = await admin.auth().getUser(userId);
    userName = userRecord.displayName || 'User';
  } catch (error) {
    // If user not found, fallback to default
  }

  return {
    title: `${userName}'s Watchlist - CineVerse`,
    description: `Check out ${userName}'s favorite movies and what they plan to watch next.`,
  }
}

export default async function SharedWatchlistPage({ params }) {
  const { userId } = await params;
  
  let watchlist = [];
  let userName = 'Unknown User';

  try {
    const userRecord = await admin.auth().getUser(userId);
    userName = userRecord.displayName || 'Anonymous Cinephile';

    const snapshot = await db.collection('users').doc(userId).collection('watchlist').orderBy('addedAt', 'desc').get();
    watchlist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-500">Error loading watchlist or user not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text uppercase tracking-wide">
          {userName}'s Watchlist
        </h1>
        <p className="text-gray-400 text-lg">
          {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved for later
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {watchlist.map((movie) => {
          const imageUrl = getImageUrl(movie.poster_path, 'w500');
          return (
            <Link href={`/movie/${movie.movieId}`} key={movie.id}>
              <div className="relative group w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5 bg-secondary/50">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={movie.title}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-sm font-medium text-gray-300">{movie.title}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-sm truncate mb-1">{movie.title}</h3>
                  <div className="flex items-center text-xs text-primary font-bold">
                    <Star className="w-3 h-3 mr-1 fill-primary" />
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {watchlist.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 font-medium">This watchlist is currently empty.</p>
        </div>
      )}
    </div>
  )
}
