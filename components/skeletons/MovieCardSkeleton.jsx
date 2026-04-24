export default function MovieCardSkeleton() {
  return (
    <div className="relative min-w-[200px] h-[300px] rounded-xl overflow-hidden bg-white/5 animate-pulse border border-white/5">
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-3 bg-white/10 rounded w-1/2 mt-1"></div>
        <div className="flex gap-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-white/10"></div>
          <div className="w-8 h-8 rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  )
}
