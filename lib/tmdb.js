const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDB(endpoint, params = {}) {
  if (!TMDB_API_KEY || TMDB_API_KEY.includes('placeholder')) {
    console.warn("TMDB API Key is missing or placeholder. Returning empty results.");
    return { results: [] };
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`TMDB Error: ${res.status} ${res.statusText}`);
      return { results: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch TMDB data:", error);
    return { results: [] };
  }
}

export async function getTrending() {
  const data = await fetchTMDB('/trending/all/day');
  return data.results || [];
}

export async function getPopularMovies() {
  const data = await fetchTMDB('/movie/popular');
  return data.results || [];
}

export async function getTopRatedMovies() {
  const data = await fetchTMDB('/movie/top_rated');
  return data.results || [];
}

export async function getActionMovies() {
  const data = await fetchTMDB('/discover/movie', { with_genres: '28' });
  return data.results || [];
}

export async function getComedyMovies() {
  const data = await fetchTMDB('/discover/movie', { with_genres: '35' });
  return data.results || [];
}

export async function getMovieDetails(id) {
  if (!TMDB_API_KEY || TMDB_API_KEY.includes('placeholder')) return null;

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    append_to_response: 'videos,credits,similar,watch/providers'
  });

  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?${queryParams}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function getTvDetails(id) {
  if (!TMDB_API_KEY || TMDB_API_KEY.includes('placeholder')) return null;

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    append_to_response: 'videos,credits,similar,watch/providers'
  });

  try {
    const res = await fetch(`${BASE_URL}/tv/${id}?${queryParams}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function getPersonDetails(id) {
  if (!TMDB_API_KEY || TMDB_API_KEY.includes('placeholder')) return null;

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    append_to_response: 'movie_credits,images'
  });

  try {
    const res = await fetch(`${BASE_URL}/person/${id}?${queryParams}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export function getImageUrl(path, size = 'original') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
