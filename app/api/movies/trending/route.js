import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!TMDB_API_KEY) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

  try {
    // 1. Fetch TMDB Global Trending
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`, {
      next: { revalidate: 300 }
    });
    const tmdbData = await tmdbRes.json();
    let results = tmdbData.results || [];

    // 2. Intelligence Boost (Server-side simulation since internal API might be blocked on Edge)
    // In production, we'd fetch from a fast KV store or edge-compatible DB
    // For now, we apply CDN-level caching to the combined results.

    return NextResponse.json({ results }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'x-cineverse-edge': 'true'
      }
    });
  } catch (error) {
    console.error('Edge Trending Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
