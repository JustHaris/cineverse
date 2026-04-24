export const BLOG_CATEGORIES = [
  { id: 'reviews', name: 'Movie Reviews', icon: 'Film' },
  { id: 'analysis', name: 'TV Show Analysis', icon: 'Tv' },
  { id: 'guides', name: 'Streaming Guides', icon: 'Play' },
  { id: 'news', name: 'Entertainment News', icon: 'Globe' }
];

/**
 * Intelligent Internal Linker
 */
export function injectInternalLinks(text, relations = []) {
  if (!text) return '';
  let enrichedText = text;

  relations.forEach(rel => {
    const regex = new RegExp(`\\b${rel.name}\\b`, 'gi');
    const url = rel.type === 'movie' ? `/movie/${rel.id}` : `/tv/${rel.id}`;
    enrichedText = enrichedText.replace(regex, `<a href="${url}" class="text-primary hover:underline font-bold">${rel.name}</a>`);
  });

  return enrichedText;
}

export async function getEntertainmentNews(category = 'all') {
  const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  
  // Premium Internal Content
  const internalBlogs = [
    {
      id: 'boys-s4-analysis',
      title: "Why The Boys Season 4 is the dark satire we need",
      description: "A deep dive into the political themes and character arcs of the latest season of The Boys on Prime Video.",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000",
      publishedAt: new Date().toISOString(),
      category: 'analysis',
      author: 'CineVerse Critics',
      content: "The Boys continues to push boundaries in its fourth season, offering a mirror to modern society that is as uncomfortable as it is entertaining. The evolution of Homelander into a truly terrifying figurehead represents one of the most compelling character arcs in modern television...",
      related: [{ id: '76479', name: 'The Boys', type: 'tv' }]
    },
    {
      id: 'dune-part-two-review',
      title: "Dune: Part Two — A Masterclass in Sci-Fi Epics",
      description: "Denis Villeneuve delivers a sequel that surpasses the original in every conceivable way, from visuals to emotional weight.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
      publishedAt: new Date().toISOString(),
      category: 'reviews',
      author: 'CineVerse Critics',
      content: "Visual splendor meets political intrigue in Dune: Part Two. Timothée Chalamet and Zendaya lead a cast that feels perfectly at home in the vast sands of Arrakis...",
      related: [{ id: '693134', name: 'Dune: Part Two', type: 'movie' }]
    }
  ];

  const filteredInternal = category === 'all' 
    ? internalBlogs 
    : internalBlogs.filter(b => b.category === category);

  if (!API_KEY) return filteredInternal;

  try {
    const q = category === 'all' ? 'movies+OR+cinema' : category;
    const res = await fetch(`https://gnews.io/api/v4/search?q=${q}&lang=en&max=10&apikey=${API_KEY}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('News API error');
    
    const data = await res.json();
    const externalBlogs = (data.articles || []).map(a => ({
       ...a, 
       id: Buffer.from(a.url).toString('base64url'), // Use URL-safe base64
       category: 'news',
       url: a.url // Keep original URL
    }));
    
    return [...filteredInternal, ...externalBlogs];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return filteredInternal;
  }
}
