import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'multi'; // movie, tv, or multi

  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  try {
    const endpoint = type === 'multi' ? '/search/multi' : `/search/${type}`;
    const url = `https://api.themoviedb.org/3${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);

    const data = await res.json();
    let results = data.results || [];

    // Filter out hidden content
    try {
      const { adminDb } = await import('@/services/firebase-admin');
      if (adminDb) {
        const hiddenSnap = await adminDb.collection('admin_hidden').get();
        const hiddenIds = new Set(hiddenSnap.docs.map(doc => doc.id));
        results = results.filter(item => !hiddenIds.has(item.id.toString()));
      }
    } catch (e) {
      console.warn('Search filtering failed:', e.message);
    }

    return NextResponse.json({ results }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
