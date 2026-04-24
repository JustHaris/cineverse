import { NextResponse } from 'next/server';
import { db, auth, admin } from '@/services/firebase-admin';

// Helper to verify token
async function verifyAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split('Bearer ')[1];
  try {
    return await auth.verifyIdToken(token);
  } catch (err) {
    return null;
  }
}

export async function GET(request) {
  if (!db) {
    console.warn("Firebase Admin not configured. Returning empty watchlist.");
    return NextResponse.json({ watchlist: [] }, { status: 200 });
  }

  const decodedToken = await verifyAuth(request);
  if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const snapshot = await db.collection('users').doc(decodedToken.uid).collection('watchlist').orderBy('addedAt', 'desc').get();
    const watchlist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ watchlist }, { status: 200 });
  } catch (error) {
    console.error('Watchlist GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!db) {
    console.warn("Firebase Admin not configured. Mocking success.");
    return NextResponse.json({ success: true, action: 'mocked' }, { status: 200 });
  }

  const decodedToken = await verifyAuth(request);
  if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { movie, isWatchlisted } = await request.json();
    if (!movie || !movie.id) return NextResponse.json({ error: 'Invalid movie data' }, { status: 400 });

    const docRef = db.collection('users').doc(decodedToken.uid).collection('watchlist').doc(movie.id.toString());
    
    if (isWatchlisted) {
      await docRef.delete();
      return NextResponse.json({ success: true, action: 'removed' }, { status: 200 });
    } else {
      await docRef.set({
        movieId: movie.id,
        title: movie.title || movie.name || '',
        name: movie.name || '',
        media_type: movie.media_type || (movie.first_air_date || movie.name ? 'tv' : 'movie'),
        poster_path: movie.poster_path || movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || '',
        first_air_date: movie.first_air_date || '',
        addedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return NextResponse.json({ success: true, action: 'added' }, { status: 200 });
    }
  } catch (error) {
    console.error('Watchlist POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
