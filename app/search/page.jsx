import { Suspense } from 'react'
import SearchPage from './SearchPage'

export const metadata = {
  title: 'Search Movies & TV Shows | CineVerse',
  description: 'Search thousands of movies and TV shows on CineVerse.',
}

export default function SearchRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="h-14 w-full rounded-2xl bg-white/5 animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[300px] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <SearchPage />
    </Suspense>
  )
}
