/**
 * Generates JSON-LD structured data for various platform entities.
 */
export const generateSchema = {
  article: (article) => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.image],
    "datePublished": article.publishedAt,
    "author": [{
      "@type": "Person",
      "name": article.author || "CineVerse Editor",
      "url": "https://cineverse.com/about"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "CineVerse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cineverse.com/logo.png"
      }
    }
  }),

  movie: (movie) => ({
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "image": `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    "datePublished": movie.release_date,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": movie.vote_average,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": movie.vote_count
    },
    "description": movie.overview
  }),

  breadcrumb: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
}
