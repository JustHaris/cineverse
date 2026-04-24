import { getEntertainmentNews, injectInternalLinks } from '@/services/blogService'
import { generateSchema } from '@/services/seoService'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, Tag, ArrowLeft, Film, Tv } from 'lucide-react'

export async function generateMetadata({ params }) {
  const { id } = await params;
  const articles = await getEntertainmentNews()
  const article = articles.find(a => a.id === id)
  if (!article) return { title: 'Blog Not Found' }

  return {
    title: `${article.title} - CineVerse Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.image],
      type: 'article',
    }
  }
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const articles = await getEntertainmentNews()
  const article = articles.find(a => a.id === id)

  if (!article) notFound()

  // Inject links if internal
  const enrichedContent = article.content 
    ? injectInternalLinks(article.content, article.related || [])
    : article.description;

  const schema = generateSchema.article(article)

  return (
    <article className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Link>

      <div className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <Image 
          src={article.image} 
          alt={article.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-tighter rounded-full">
                {article.category}
              </span>
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-white leading-tight glow-text">
             {article.title}
           </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-12 pb-8 border-b border-white/5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> {article.author || 'CineVerse Editor'}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {new Date(article.publishedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" /> {article.category}
        </div>
      </div>

      {/* Blog Body */}
      <div 
        className="prose prose-invert prose-primary max-w-none text-gray-300 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: enrichedContent }}
      />

      {/* Related Content (Internal Linking) */}
      {article.related && article.related.length > 0 && (
        <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Mentioned in this Article</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.related.map(rel => (
              <Link 
                key={rel.id} 
                href={rel.type === 'movie' ? `/movie/${rel.id}` : `/tv/${rel.id}`}
                className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl hover:bg-white/10 border border-white/5 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  {rel.type === 'movie' ? <Film className="text-primary w-6 h-6" /> : <Tv className="text-primary w-6 h-6" />}
                </div>
                <div>
                  <p className="text-white font-bold group-hover:text-primary transition-colors">{rel.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{rel.type}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
