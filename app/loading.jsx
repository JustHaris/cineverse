import RowSliderSkeleton from '@/components/skeletons/RowSliderSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner Skeleton */}
      <div className="relative h-[70vh] w-full bg-white/5 animate-pulse mb-12">
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end">
          <div className="h-12 bg-white/10 rounded-lg w-3/4 md:w-1/2 mb-4"></div>
          <div className="flex gap-4 mb-6">
             <div className="h-4 bg-white/10 rounded w-24"></div>
             <div className="h-4 bg-white/10 rounded w-16"></div>
          </div>
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-white/10 rounded w-full max-w-2xl"></div>
            <div className="h-4 bg-white/10 rounded w-full max-w-2xl"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 max-w-2xl"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-32 h-12 bg-white/10 rounded-xl"></div>
            <div className="w-12 h-12 bg-white/10 rounded-full"></div>
            <div className="w-12 h-12 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Sliders Skeleton */}
      <div className="space-y-12">
        <RowSliderSkeleton />
        <RowSliderSkeleton />
        <RowSliderSkeleton />
      </div>
    </div>
  )
}
