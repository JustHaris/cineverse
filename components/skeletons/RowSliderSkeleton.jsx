import MovieCardSkeleton from './MovieCardSkeleton'

export default function RowSliderSkeleton({ title }) {
  return (
    <div className="mb-12">
      <div className="h-8 bg-white/5 rounded w-48 mb-6 ml-8 animate-pulse"></div>
      <div className="relative">
        <div className="flex gap-4 overflow-hidden px-8">
          {[...Array(6)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
