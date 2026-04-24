export default function MovieDetailsLoading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-white/5 animate-pulse">
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col md:flex-row gap-8 items-end">
          {/* Poster */}
          <div className="hidden md:block w-64 h-96 relative rounded-2xl bg-white/10 shrink-0 shadow-2xl border border-white/5"></div>
          
          {/* Details */}
          <div className="flex-1 max-w-4xl w-full">
            <div className="h-16 bg-white/10 rounded-lg w-3/4 mb-4"></div>
            
            <div className="flex gap-4 mb-6">
              <div className="h-4 bg-white/10 rounded w-20"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-40 h-12 bg-white/10 rounded-xl"></div>
              <div className="w-12 h-12 bg-white/10 rounded-full"></div>
              <div className="w-12 h-12 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 animate-pulse">
        <div className="lg:col-span-2 space-y-12">
          {/* Trailer Placeholder */}
          <div className="space-y-4 pt-12">
            <div className="h-8 bg-white/10 rounded w-48"></div>
            <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/5"></div>
          </div>
        </div>

        {/* Reviews Placeholder */}
        <div className="space-y-8 lg:pt-12">
          <div className="h-8 bg-white/10 rounded w-32 mb-6"></div>
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="h-24 bg-white/10 rounded-xl w-full"></div>
            <div className="h-12 bg-white/10 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
