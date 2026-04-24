import { getEntertainmentNews, BLOG_CATEGORIES } from '@/services/blogService'
import Image from 'next/image'
import Link from 'next/link'
import { Newspaper, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Entertainment News & Movie Analysis - CineVerse',
  description: 'Deep dives into film theory, streaming guides, and the latest entertainment news from around the world.',
}

export default async function BlogsPage({ searchParams }) {
  const { category = 'all' } = await searchParams
  const articles = await getEntertainmentNews(category)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            CineVerse <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl italic">Curated technical analysis, streaming guides, and industry news.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-white/5">
        <Link 
          href="/blogs"
          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
            category === 'all' ? 'bg-primary text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'
          }`}
        >
          All Stories
        </Link>
        {BLOG_CATEGORIES.map(cat => (
          <Link 
            key={cat.id}
            href={`/blogs?category=${cat.id}`}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
              category === cat.id ? 'bg-primary text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => {
          // Safety check: ensure external links don't trigger downloads
          const isExternal = article.url && article.url.startsWith('http')
          const href = isExternal ? article.url : `/blogs/${article.id}`
          
          return (
            <Link
              key={article.id || index}
              href={href}
              target={isExternal ? "_blank" : "_self"}
              className="group relative flex flex-col bg-[#0c0c0c] rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                {article.image && !article.image.includes('.bin') ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    unoptimized={isExternal} // Avoid proxying external news images if they fail
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-white/10" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                  {article.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                      {article.author || 'CineVerse'}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">
                      {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      
      {articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Newspaper className="w-20 h-20 text-white/5 mb-6" />
          <p className="text-gray-500 text-lg font-bold">No stories found in this category.</p>
          <Link href="/blogs" className="mt-6 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
            Return to Feed
          </Link>
        </div>
      )}
    </div>
  )
}

